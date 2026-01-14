# InsureAI Project Instructions

## Project Overview
InsureAI is a Thai insurance comparison and recommendation platform with AI-powered assistance.

**Live URL:** https://www.xn--q3cxxb8a4e.life (ประกัน.life)

---

## Community Data Scraping Status

### Latest Scrape: 2026-01-11
- **Source:** Facebook Group "ซื้อ-ขาย ประกันชีวิต"
- **Group URL:** https://www.facebook.com/groups/1674878202817882/
- **Total Posts Scraped:** 45
- **Total Comments:** 429
- **Data Location:** `web/src/data/community-seed-data-real.ts`

### Data Processing Applied:
- All author names anonymized with Thai pseudonyms (e.g., "สมชาย ก.", "วิภา ร.")
- Original source URLs preserved for reference
- Content categorized into: question, knowledge, story, tip, news
- Comments embedded within post documents

### To Scrape More Data:
1. Visit the Facebook group and identify new valuable posts
2. Update `community-seed-data-real.ts` with new posts
3. Run seed endpoint: `POST /api/admin/seed-community`
4. Verify data in MongoDB Atlas

---

## Key Features Status

| Feature | Status | Notes |
|---------|--------|-------|
| AI Assist Chat | ✅ Working | Uses Gemini API with fallback keys |
| Community Forum | ✅ Working | Seeded from Facebook data |
| Insurance Wizard | ✅ Working | Multi-step questionnaire |
| Plan Comparison | ✅ Working | Compares user plans with recommendations |
| Blog | ✅ Working | Educational content |
| Lead Capture | ✅ Working | Stores in MongoDB |

---

## Environment Setup

### Required Environment Variables
```env
# Database
MONGODB_URI=mongodb+srv://[user]:[password]@insuredev.f5pbceu.mongodb.net/insureai

# AI APIs
GEMINI_API_KEY=your-gemini-key
GEMINI_KEY_RESERVES=key1,key2,key3  # Comma-separated backup keys

# Authentication
NEXTAUTH_SECRET=your-secret
NEXTAUTH_URL=http://localhost:3000
```

### Development
```bash
cd web
npm install
npm run dev
```

---

## Important Files

- **AI Assist:** `web/src/app/api/ai-assist/route.ts`
- **Community API:** `web/src/app/api/community/posts/route.ts`
- **Community Seed Data:** `web/src/data/community-seed-data-real.ts`
- **MongoDB Functions:** `web/src/lib/mongodb.ts`
- **Plans Config:** `web/src/data/plans-config.ts`

---

## Notes for Future Development

1. **Easy Claims Feature:** Removed from landing page (2026-01-14) - feature not supported
2. **Community Post Details:** Click on post to view full content and comments
3. **AI Assist:** Uses streaming responses with JSON structured output
4. **Sitemap:** Auto-generated at `/sitemap.xml`, includes all main pages

---

*Last updated: 2026-01-14*
