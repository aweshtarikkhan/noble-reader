const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const TROY_OUNCE_TO_GRAMS = 31.1035;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Fetch from goldprice.org public endpoint (no API key needed)
    const res = await fetch("https://data-asg.goldprice.org/dbXRates/INR");
    if (!res.ok) {
      throw new Error(`Failed to fetch gold prices: ${res.status}`);
    }

    const data = await res.json();
    
    // data.items[0] contains xauPrice (gold per oz) and xagPrice (silver per oz) in INR
    const item = data.items?.[0];
    if (!item) {
      throw new Error("No price data available");
    }

    const goldPerOzINR = item.xauPrice; // Gold per troy ounce in INR
    const silverPerOzINR = item.xagPrice; // Silver per troy ounce in INR

    // Convert to per gram
    const gold24PerGram = Math.round(goldPerOzINR / TROY_OUNCE_TO_GRAMS);
    const gold22PerGram = Math.round(gold24PerGram * 0.916); // 22/24 purity
    const gold18PerGram = Math.round(gold24PerGram * 0.75); // 18/24 purity
    const silverPerGram = Math.round(silverPerOzINR / TROY_OUNCE_TO_GRAMS);

    return new Response(
      JSON.stringify({
        success: true,
        rates: {
          gold24ct: gold24PerGram,
          gold22ct: gold22PerGram,
          gold18ct: gold18PerGram,
          silver: silverPerGram,
          lastUpdated: new Date().toISOString(),
          source: "International Market Rate",
        },
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Error fetching gold rates:", err);
    return new Response(
      JSON.stringify({ success: false, error: String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
