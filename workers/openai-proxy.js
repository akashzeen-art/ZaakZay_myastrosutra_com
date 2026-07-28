/**
 * Cloudflare Worker — OpenAI proxy (no nginx / no VPS changes).
 *
 * Setup:
 * 1. https://dash.cloudflare.com → Workers & Pages → Create Worker
 * 2. Paste this file as the worker code
 * 3. Settings → Variables → Add secret: OPENAI_API_KEY
 * 4. Deploy → copy the workers.dev URL
 * 5. Set VITE_OPENAI_PROXY_URL to that URL for production builds
 */
const OPENAI_URL = "https://api.openai.com/v1/chat/completions";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (request.method !== "POST") {
      return Response.json(
        { error: { message: "Method not allowed" } },
        { status: 405, headers: corsHeaders },
      );
    }

    const apiKey = env?.OPENAI_API_KEY;
    if (!apiKey) {
      return Response.json(
        { error: { message: "OPENAI_API_KEY secret is not configured" } },
        { status: 500, headers: corsHeaders },
      );
    }

    try {
      const body = await request.text();
      const openaiRes = await fetch(OPENAI_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body,
      });

      const text = await openaiRes.text();
      return new Response(text, {
        status: openaiRes.status,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      });
    } catch (err) {
      return Response.json(
        { error: { message: err?.message || "Proxy failed" } },
        { status: 500, headers: corsHeaders },
      );
    }
  },
};
