import { NextResponse } from "next/server";
import portfolio from "@/app/data/portfolio.json";
import projectDetails from "@/app/data/projectDetails.json";

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

// ---- type for project details ----
type ProjectDetailEntry = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  stack: string[];
  links: { demo?: string | null; code?: string | null };
  note?: string;
  metrics?: { label: string; value: string; icon: string }[];
  features?: string[];
  challenge?: string;
  solution?: string;
};

const details = projectDetails as Record<string, ProjectDetailEntry>;

// ---- build rich portfolio context for the model ----
function makeContext(projectHint?: string) {
  const sections: string[] = [];

  // 1. Bio
  sections.push(`ABOUT IRTEFA:\n${portfolio.bio}`);

  // 2. Featured projects with full details
  const featuredSection: string[] = ["FEATURED PROJECTS:"];
  portfolio.featured.forEach((fp, idx) => {
    const detailKey = Object.keys(details).find(k =>
      details[k].name.toLowerCase() === fp.name.toLowerCase() ||
      details[k].name.toLowerCase().includes(fp.name.toLowerCase().split(" ")[0])
    );
    const detail = detailKey ? details[detailKey] : null;

    let projectInfo = `\n${idx + 1}. ${fp.name}`;
    if (detail) {
      projectInfo += `\n   Tagline: ${detail.tagline}`;
      projectInfo += `\n   Description: ${detail.description}`;
      if (detail.challenge) projectInfo += `\n   Challenge: ${detail.challenge}`;
      if (detail.solution) projectInfo += `\n   Solution: ${detail.solution}`;
      if (detail.metrics && detail.metrics.length > 0) {
        const metricsStr = detail.metrics.map(m => `${m.value} ${m.label}`).join(", ");
        projectInfo += `\n   Impact: ${metricsStr}`;
      }
      projectInfo += `\n   Tech: ${detail.stack.join(", ")}`;
      if (detail.features && detail.features.length > 0) {
        projectInfo += `\n   Features: ${detail.features.join("; ")}`;
      }
      if (detail.links.demo) projectInfo += `\n   Demo: ${detail.links.demo}`;
      if (detail.note) projectInfo += `\n   Note: ${detail.note}`;
    } else {
      projectInfo += `\n   Summary: ${fp.summary}`;
      projectInfo += `\n   Tech: ${fp.stack.join(", ")}`;
      if (fp.links.demo) projectInfo += `\n   Demo: ${fp.links.demo}`;
      if (fp.links.code) projectInfo += `\n   Code: ${fp.links.code}`;
      if ((fp as any).note) projectInfo += `\n   Note: ${(fp as any).note}`;
    }
    featuredSection.push(projectInfo);
  });
  sections.push(featuredSection.join(""));

  // 3. Other projects with summaries
  const otherSection: string[] = ["\nOTHER PROJECTS:"];
  portfolio.projects.forEach(p => {
    let line = `• ${p.name} — ${p.summary} (${p.stack.join(", ")})`;
    if (p.links.demo) line += ` Demo: ${p.links.demo}`;
    if (p.links.code) line += ` Code: ${p.links.code}`;
    otherSection.push(line);
  });
  sections.push(otherSection.join("\n"));

  // 4. Skills (categorized)
  const skills = portfolio.skills;
  const skillsSection = `
SKILLS:
Languages: ${skills.languages.join(", ")}
AI/ML: ${skills.ai_ml.join(", ")}
Data: ${skills.data.join(", ")}
Web: ${skills.web.join(", ")}
Tools: ${skills.tools.join(", ")}`;
  sections.push(skillsSection);

  // 5. Project-specific deep context when relevant
  if (projectHint) {
    const hintLower = projectHint.toLowerCase();
    const matchedKey = Object.keys(details).find(k =>
      k.toLowerCase() === hintLower ||
      details[k].name.toLowerCase().includes(hintLower) ||
      hintLower.includes(k.toLowerCase())
    );

    if (matchedKey) {
      const detail = details[matchedKey];
      const deepContext = `
CURRENT PROJECT FOCUS - ${detail.name}:
This is the project the user wants to discuss. Provide detailed answers about it.
- Tagline: ${detail.tagline}
- Full Description: ${detail.description}
- Tech Stack: ${detail.stack.join(", ")}
${detail.challenge ? `- The Challenge: ${detail.challenge}` : ""}
${detail.solution ? `- The Solution: ${detail.solution}` : ""}
${detail.metrics ? `- Key Metrics: ${detail.metrics.map(m => `${m.value} ${m.label}`).join(", ")}` : ""}
${detail.features ? `- Features: ${detail.features.join("; ")}` : ""}
${detail.links.demo ? `- Live Demo: ${detail.links.demo}` : ""}
${detail.links.code ? `- Source Code: ${detail.links.code}` : ""}
${detail.note ? `- Note: ${detail.note}` : ""}`;
      sections.push(deepContext);
    }
  }

  return sections.join("\n\n");
}

// System prompt for the assistant
const SYSTEM_PROMPT = `You are Irtefa's portfolio assistant. You have comprehensive knowledge about his projects, skills, and experience.

Guidelines:
- Be friendly and professional
- Give detailed answers about projects when asked
- Highlight metrics and impact when relevant
- If asked about private/NDA projects, mention they exist but details are confidential
- If something isn't in your knowledge, say so honestly
- Keep responses concise but informative (2-4 sentences unless more detail requested)`;

type ChatMessage = { role: "user" | "assistant"; content: string };

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

    const body = await req.json();
    const { query, history, projectContext } = body as {
      query: string;
      history?: ChatMessage[];
      projectContext?: string;
    };

    const q = String(query || "").trim();
    if (!q) return NextResponse.json({ answer: "Ask me something about Irtefa's work." }, { status: 200 });
    if (q.length > 800) return NextResponse.json({ answer: "Please shorten your question." }, { status: 400 });

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ answer: "Missing OPENAI_API_KEY. Add it in Vercel project settings." }, { status: 200 });
    }

    // Build context with optional project hint
    const context = makeContext(projectContext);

    // Build messages array with conversation history
    const messages: { role: string; content: string }[] = [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "system", content: context }
    ];

    // Add conversation history (last 5 exchanges = 10 messages max)
    if (history && Array.isArray(history)) {
      const recentHistory = history.slice(-10);
      recentHistory.forEach(msg => {
        messages.push({ role: msg.role, content: msg.content });
      });
    }

    // Add current user query
    messages.push({ role: "user", content: q });

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
