# InsureAI - AI-Powered Insurance Platform

InsureAI is an intelligent insurance recommendation platform backed by Allianz, designed to help users find the perfect insurance plan in 60 seconds. Built for Allianz agents to grow their customer base across Thailand, Southeast Asia, Korea, and Japan.

## Features

- **AI-Powered Recommendations**: Smart algorithm matches users with optimal insurance plans
- **Plan Comparison**: Upload existing plans and see side-by-side comparisons
- **Multi-Channel Lead Capture**: LINE ID, phone, and email integration
- **Insurance Wizard**: Guided questionnaire for personalized recommendations
- **Blog & Content**: SEO-optimized content marketing platform
- **Mobile-First Design**: Optimized for mobile users (primary audience in Thailand)

## Quick Start

### Prerequisites

- Node.js 20+ (use `nvm use 20`)
- MongoDB Atlas account (free tier available)
- Optional: LINE Developer account for notifications

### Setup

```bash
# Clone repository
git clone https://github.com/bdockbockd/insureai.git
cd insureai/web

# Install dependencies
npm install

# Set up environment
cp .env.example .env.local
# Edit .env.local with your credentials

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | Yes |
| `NEXTAUTH_SECRET` | Secret for NextAuth | Optional |
| `LINE_CHANNEL_ACCESS_TOKEN` | LINE API token for notifications | Optional |
| `ANTHROPIC_API_KEY` | For AI-powered features | Optional |

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **UI Components**: Custom components inspired by shadcn/ui
- **State Management**: Zustand
- **Database**: MongoDB Atlas
- **Deployment**: Vercel

## Project Structure

```
web/
├── src/
│   ├── app/               # Next.js App Router pages
│   │   ├── api/           # API routes
│   │   ├── blog/          # Blog pages
│   │   ├── compare/       # Plan comparison
│   │   └── wizard/        # Insurance questionnaire
│   ├── components/
│   │   ├── forms/         # Form components
│   │   ├── sections/      # Page sections
│   │   └── ui/            # UI components
│   ├── lib/               # Utilities & database
│   ├── store/             # Zustand stores
│   └── types/             # TypeScript types
├── public/                # Static assets
└── package.json
```

## Key Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page with hero, features, testimonials |
| `/wizard` | 7-step insurance questionnaire |
| `/compare` | Compare existing plan vs Allianz |
| `/blog` | Insurance insights and news |

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/leads` | POST | Create new lead |
| `/api/leads` | GET | Get recent leads (admin) |
| `/api/plans` | GET | Get insurance plans with filters |
| `/api/plans` | POST | Get AI recommendations |

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

```bash
# Push to GitHub
git add .
git commit -m "Initial InsureAI setup"
git push origin main
```

### MongoDB Setup

1. Create free cluster at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Get connection string
3. Add to `MONGODB_URI` in Vercel environment

## Business Model

### Revenue Streams

1. **Commission on Sales**: Commission from Allianz for each policy sold
2. **Lead Generation**: Qualified leads for insurance agents
3. **Premium Subscription**: Enhanced features for agents
4. **Affiliate Revenue**: Referral fees from partner services

### Target Markets

- **Primary**: Thailand (Bangkok, major cities)
- **Secondary**: Singapore, Malaysia, Vietnam
- **Expansion**: Korea, Japan

## Marketing Strategy

1. **Content Marketing**: SEO-optimized blog articles
2. **Social Media**: Facebook, Instagram, TikTok
3. **LINE Official Account**: Direct engagement in Thailand
4. **Influencer Partnerships**: Insurance/finance content creators
5. **Google Ads**: High-intent search campaigns

## License

Proprietary - All rights reserved

## Contact

- Website: https://insureai.com
- Email: support@insureai.com
- LINE: @InsureAI
