import type { Plugin } from "vite";
import { loadEnv } from "vite";
import { OPENAI_API_KEY as FALLBACK_KEY, OPENAI_CHAT_URL } from "./api/_openai-key";

const PROXY_PATHS = new Set([
  "/openai-proxy.php",
  "/openai-proxy",
  "/api/openai/chat-completions",
]);

function readApiKey(mode: string): string {
  const env = loadEnv(mode, process.cwd(), "");
  return env.OPENAI_API_KEY || process.env.OPENAI_API_KEY || FALLBACK_KEY;
}

export function openaiDevProxy(): Plugin {
  return {
    name: "openai-dev-proxy",
    configureServer(server) {
      const apiKey = readApiKey(server.config.mode);

      server.middlewares.use((req, res, next) => {
        const url = req.url?.split("?")[0];
        if (!url || !PROXY_PATHS.has(url) || (req.method !== "POST" && req.method !== "OPTIONS")) {
          return next();
        }

        if (req.method === "OPTIONS") {
          res.statusCode = 204;
          res.setHeader("Access-Control-Allow-Origin", "*");
          res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
          res.setHeader("Access-Control-Allow-Headers", "Content-Type");
          res.end();
          return;
        }

        if (!apiKey) {
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.end(
            JSON.stringify({
              error: {
                message:
                  "OPENAI_API_KEY is not set. Add it to a local .env file and restart npm run dev.",
              },
            }),
          );
          return;
        }

        const chunks: Buffer[] = [];
        req.on("data", (chunk: Buffer) => chunks.push(chunk));
        req.on("end", async () => {
          try {
            const body = Buffer.concat(chunks).toString("utf8");
            const openaiRes = await fetch(OPENAI_CHAT_URL, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json",
              },
              body,
            });

            const text = await openaiRes.text();
            res.statusCode = openaiRes.status;
            res.setHeader("Content-Type", "application/json");
            res.end(text);
          } catch {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.end(
              JSON.stringify({ error: { message: "OpenAI proxy request failed" } }),
            );
          }
        });
      });
    },
  };
}
