import { NextResponse } from "next/server";
import portfolio from "@/app/data/portfolio.json";

// ---- simple in-memory rate limit (per region) ----
const hits = new Map<string, { count: number; ts: number }>();
function rateLimit(ip: string, max = 20, windowMs = 60_000) {
  const now = Date.now();
  const rec = hits.get(ip) ?? { count: 0, ts: now };
  if (now - rec.ts > windowMs) { rec.count = 0; rec.ts = now; }
  rec.count += 1;
  hits.set(ip, rec);
  return rec.count <= max; // 20 req/min/IP
}

// ---- build compact portfolio context for the model ----
function makeContext() {
  const proj = portfolio.projects.map(p =>
    `• ${p.name} — ${p.summary} (stack: ${p.stack.join(", ")}; demo: ${p.links.demo}; code: ${p.links.code})`
  ).join("\n");
  return `ABOUT IRTEFA:\n${portfolio.bio}\n\nPROJECTS:\n${proj}`;
}

export async function POST(req: Request) {
  try {
    // Optional domain lock (set ALLOWED_ORIGIN on Vercel if you want)
    const allowed = process.env.ALLOWED_ORIGIN?.split(",").map(s => s.trim()).filter(Boolean);
    const origin = req.headers.get("origin") ?? "";
    if (allowed && allowed.length > 0 && !allowed.some(a => origin.endsWith(a))) {
      return new Response("Forbidden", { status: 403 });
    }

    const ip = (req.headers.get("x-forwarded-for") || "anon").split(",")[0].trim();
    if (!rateLimit(ip)) return new Response("Rate limit", { status: 429 });

    const { query } = await req.json();
    const q = String(query || "").trim();
    if (!q) return NextResponse.json({ answer: "Ask me something about Irtefa’s work." }, { status: 200 });
    if (q.length > 800) return NextResponse.json({ answer: "Please shorten your question." }, { status: 400 });

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ answer: "Missing OPENAI_API_KEY. Add it in Vercel project settings." }, { status: 200 });
    }

    const context = makeContext();
    const messages = [
      { role: "system", content: "You are Irtefa’s portfolio assistant. Answer concisely from the provided context. If something isn’t in context, say you don’t know." },
      { role: "system", content: context },
      { role: "user", content: q }
    ];

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages,
        temperature: 0.3,
        max_tokens: 300
      })
    });

    const data = await res.json();
    const answer = data?.choices?.[0]?.message?.content ?? "No answer.";
    return NextResponse.json({ answer });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Unknown error" }, { status: 500 });
  }
}
