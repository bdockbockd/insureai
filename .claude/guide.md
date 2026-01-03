# InsureAI Project Guide

## Overview
AI-powered insurance recommendation platform backed by Allianz for Thailand & Southeast Asia markets.

## Status
MVP COMPLETE - Ready for deployment

## Repository
https://github.com/bdockbockd/insureai

## Tech Stack
- Framework: Next.js 16 (Full-Stack)
- Database: MongoDB Atlas
- Styling: Tailwind CSS, Framer Motion
- State: Zustand
- Deployment: Vercel

## Features Built
- Landing page with hero, features, testimonials, CTA
- 7-step insurance wizard with personalized recommendations
- Plan comparison tool (upload existing plan vs Allianz)
- Lead capture (LINE ID, phone, email) with modal forms
- Blog for content marketing
- API routes for leads and insurance plans
- Mobile-first responsive design

## Quick Start
```bash
cd web
nvm use 20
npm install
cp .env.example .env.local
# Add MONGODB_URI
npm run dev
```

## Next Steps
1. Deploy to Vercel
2. Connect real MongoDB Atlas
3. Add LINE notification for new leads
4. Integrate with Allianz product API

## Key Files
- `web/src/app/page.tsx` - Landing page
- `web/src/app/wizard/page.tsx` - Insurance wizard
- `web/src/app/compare/page.tsx` - Plan comparison
- `web/src/app/blog/page.tsx` - Blog
- `web/src/app/api/leads/route.ts` - Lead capture API
- `web/src/app/api/plans/route.ts` - Insurance plans API

## Market Research
See `/MARKET_RESEARCH.md` and `/PITCH_DECK.md`
