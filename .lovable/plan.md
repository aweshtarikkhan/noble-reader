

## Current Situation

Your app currently fetches hadith data from `cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1` — a free public CDN. This works but you don't control it, and it could go down or rate-limit you.

## Cloudflare R2 — What's Needed

Cloudflare R2 is an external service that **you** need to set up. Lovable cannot create or manage Cloudflare accounts. Here's exactly what to do:

### Your Part (Setup R2)

1. **Create a Cloudflare account** at cloudflare.com (free tier includes 10GB R2 storage — more than enough for hadith JSON files)
2. **Create an R2 bucket** — name it something like `hadith-data`
3. **Enable public access** on the bucket (so the app can fetch JSON files directly without auth)
4. **Connect a custom domain** (optional) or use the default R2 public URL
5. **Upload the hadith JSON files** — Download them from the fawazahmed0 API and upload to R2 in the same folder structure:
   - `editions/eng-muslim/sections/1.min.json`
   - `editions/ara-muslim/sections/1.min.json`
   - `editions/urd-muslim/sections/1.min.json`
   - ... (repeat for all 56 sections × 3 languages × 6 books)

### My Part (Code Update)

Once you give me the R2 public URL, I will:

1. **Update `src/lib/hadithApi.ts`** — Change the `BASE` URL from the jsDelivr CDN to your R2 bucket URL
2. **Add fallback logic** — Try R2 first, fall back to the original jsDelivr CDN if R2 fails
3. That's it — the rest of the app (localforage caching, offline logic) stays the same

### Alternative: Skip R2 Entirely

The current jsDelivr CDN is reliable and free. R2 only makes sense if:
- You want full control over the data
- You plan to add/modify hadith content
- You're hitting rate limits on jsDelivr

---

**Next step:** If you want to proceed, create the R2 bucket with public access, upload the JSON files, and share the public URL with me. I'll update the code in one line.

