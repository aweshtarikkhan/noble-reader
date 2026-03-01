import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const CDN_BASE = "https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1";

const HADITH_BOOKS = [
  { id: "bukhari", editions: ["ara-bukhari", "eng-bukhari", "urd-bukhari"] },
  { id: "muslim", editions: ["ara-muslim", "eng-muslim", "urd-muslim"] },
  { id: "nasai", editions: ["ara-nasai", "eng-nasai", "urd-nasai"] },
  { id: "abudawud", editions: ["ara-abudawud", "eng-abudawud", "urd-abudawud"] },
  { id: "tirmidhi", editions: ["ara-tirmidhi", "eng-tirmidhi", "urd-tirmidhi"] },
  { id: "ibnmajah", editions: ["ara-ibnmajah", "eng-ibnmajah", "urd-ibnmajah"] },
];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  const url = new URL(req.url);
  const bookFilter = url.searchParams.get("book"); // optional: sync only one book
  const editionFilter = url.searchParams.get("edition"); // optional: sync one edition
  const sectionFilter = url.searchParams.get("section"); // optional: sync one section

  // If a specific edition+section is requested, sync just that
  if (editionFilter && sectionFilter) {
    const result = await syncSection(supabase, editionFilter, parseInt(sectionFilter));
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // If a specific edition full book is requested
  if (editionFilter && !sectionFilter) {
    const result = await syncFullBook(supabase, editionFilter);
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Sync all books or a specific book
  const books = bookFilter
    ? HADITH_BOOKS.filter((b) => b.id === bookFilter)
    : HADITH_BOOKS;

  const results: Record<string, any> = {};

  for (const book of books) {
    results[book.id] = {};
    for (const edition of book.editions) {
      try {
        // First fetch section 1 to get metadata (number of sections)
        const sec1 = await fetchFromCDN(`editions/${edition}/sections/1.min.json`);
        if (!sec1) {
          results[book.id][edition] = { error: "Failed to fetch section 1" };
          continue;
        }

        const sectionKeys = Object.keys(sec1.metadata?.section || {});
        const totalSections = sectionKeys.length;

        // Upload section 1
        await uploadToStorage(supabase, `editions/${edition}/sections/1.min.json`, sec1);

        // Upload remaining sections
        let synced = 1;
        for (let i = 2; i <= totalSections; i++) {
          const data = await fetchFromCDN(`editions/${edition}/sections/${i}.min.json`);
          if (data) {
            await uploadToStorage(supabase, `editions/${edition}/sections/${i}.min.json`, data);
            synced++;
          }
        }

        // Also sync the full book
        const fullBook = await fetchFromCDN(`editions/${edition}.min.json`);
        if (fullBook) {
          await uploadToStorage(supabase, `editions/${edition}.min.json`, fullBook);
        }

        results[book.id][edition] = { sections: synced, total: totalSections };
      } catch (err) {
        results[book.id][edition] = { error: String(err) };
      }
    }
  }

  return new Response(JSON.stringify({ success: true, results }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});

async function fetchFromCDN(path: string): Promise<any> {
  const res = await fetch(`${CDN_BASE}/${path}`);
  if (!res.ok) return null;
  return res.json();
}

async function uploadToStorage(supabase: any, path: string, data: any) {
  const body = JSON.stringify(data);
  const { error } = await supabase.storage
    .from("hadith-data")
    .upload(path, new Blob([body], { type: "application/json" }), {
      upsert: true,
      contentType: "application/json",
    });
  if (error) throw new Error(`Upload failed for ${path}: ${error.message}`);
}

async function syncSection(supabase: any, edition: string, section: number) {
  const data = await fetchFromCDN(`editions/${edition}/sections/${section}.min.json`);
  if (!data) return { error: "Failed to fetch from CDN" };
  await uploadToStorage(supabase, `editions/${edition}/sections/${section}.min.json`, data);
  return { success: true, edition, section };
}

async function syncFullBook(supabase: any, edition: string) {
  const data = await fetchFromCDN(`editions/${edition}.min.json`);
  if (!data) return { error: "Failed to fetch from CDN" };
  await uploadToStorage(supabase, `editions/${edition}.min.json`, data);
  return { success: true, edition };
}
