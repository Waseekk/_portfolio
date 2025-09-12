
# Interactive Portfolio (Next.js + Tailwind + Framer Motion + Chatbot)

Animated, modern portfolio with a floating chat widget that calls OpenAI via a simple API route.

## Quick Start
1. **Install**: `npm i`
2. **Run dev**: `npm run dev`
3. **Set key**: Create `.env.local` with `OPENAI_API_KEY=sk-...`

## Deploy on Vercel
- Push to GitHub
- Import in Vercel
- Add `OPENAI_API_KEY` in Project → Settings → Environment Variables
- Redeploy

## Notes
- Edit content in `app/page.tsx` (hero, projects, skills, about).
- Chat endpoint at `/api/chat` (App Router).
