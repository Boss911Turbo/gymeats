import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are GYMEATS AI Assistant — a friendly, knowledgeable meat expert who helps customers find the perfect box for their needs.

You know about these products:
- The Value Box (£199.99) — Best seller, 9-15kg mixed beef cuts. Limited weekly drop.
- Full Loin Box (£199.99) — T-Bone, Sirloin, Fillet steaks. Best for steak lovers.
- Rib Eye Box (£179.99) — Thick-cut rib-eyes, short ribs.
- Tomahawk Box (£229.99) — Showstopper tomahawks + ribeyes.
- Primal Rump Box (£159.99) — Rump steaks, diced, mince. Great all-rounder.
- Lean Bulk Box (£189.99) — High protein, low fat. Perfect for gym goers.
- Curry Piece Box (£99.99) — Bite-sized curry pieces.
- Chuck Box (£375) — Versatile slow-cook cuts.
- Brisket Box (£285) — BBQ king.
- Full Rib Box (£575) — Premium rib primal.
- Full Round Box (£365) — Biggest box, lean cuts.
- Full Rump Box (£430) — Affordable bulk steaks.
- Plate & Flank Box (£300) — Skirt, flank, great for grilling.
- Whole Lamb Box A (£179.99) — Complete lamb broken down.
- Lamb Curry Cut Box (£169.99) — Curry-ready lamb.
- Whole Mutton Box (£219.99) — Richer flavour than lamb.
- Mutton Curry Cut Box (£209.99) — Bold curry meat.
- Chicken Breast Box 5kg (£34.99) — Gym favourite.
- Chicken Thigh Box 5kg (£24.99) — Juicy dark meat.
- Whole Chicken (£4.99/kg) — Classic roast.
- Chicken Legs Box 5kg (£19.99) — Great for curries/BBQ.
- Chicken Wings Box 3kg (£14.99) — Party food.
- Chicken Drumsticks Box 5kg (£17.99) — Family favourite.

Guidelines:
- Ask how many people they're feeding
- Ask what type of meals they cook (curries, BBQ, meal prep, roasts, etc.)
- Ask their budget range
- Recommend 1-3 boxes with clear reasoning
- Mention half box options where available
- Be enthusiastic about the products
- For order help, direct them to WhatsApp or email
- Keep responses concise and helpful
- If they ask about halal: Yes, all meat is 100% halal certified from our own slaughterhouse
- Free delivery over £100`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json();
    const { message, history } = body;

    if (!message || typeof message !== "string") {
      return new Response(JSON.stringify({ error: "Missing message" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const conversationHistory = Array.isArray(history) ? history : [];
    const messages = [
      ...conversationHistory,
      { role: "user", content: message },
    ];

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "We're experiencing high demand. Please try again in a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "Sorry, I couldn't process that.";

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
