# Avertune — Communication Intelligence Platform

## Frontend-only Next.js 14 project. Backend integration ready.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v3 |
| Animation | Framer Motion + CSS |
| Icons | Lucide React |
| UI Primitives | Radix UI |
| Font | Playfair Display + Plus Jakarta Sans |

---

## Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout (fonts, meta)
│   ├── page.tsx                  # Root redirect → /marketing
│   ├── not-found.tsx             # 404 page
│   ├── marketing/                # Marketing site
│   │   ├── layout.tsx            # Nav + Footer wrapper
│   │   ├── page.tsx              # Home page
│   │   ├── modes/[slug]/         # Dynamic mode detail pages
│   │   ├── capabilities/[slug]/  # Dynamic capability detail pages
│   │   ├── solutions/            # Solutions index + detail
│   │   └── pricing/              # Pricing page
│   └── dashboard/                # App / dashboard (no nav)
│       ├── layout.tsx
│       └── page.tsx
│
├── components/
│   ├── ui/                       # Atomic design tokens → components
│   │   ├── Badge.tsx
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── MetricBar.tsx
│   │   ├── SectionHeading.tsx
│   │   └── index.ts
│   ├── layout/                   # Shell components (nav, footer)
│   │   ├── Navbar.tsx
│   │   ├── NavDropdown.tsx
│   │   ├── Footer.tsx
│   │   ├── AnnouncementBanner.tsx
│   │   └── index.ts
│   ├── marketing/                # Landing page sections
│   │   ├── HeroSection.tsx
│   │   ├── ModesSection.tsx
│   │   ├── HowItWorksSection.tsx
│   │   ├── IntelligenceScoreSection.tsx
│   │   ├── DifferentiatorsSection.tsx
│   │   ├── CompareSection.tsx
│   │   ├── FaqSection.tsx
│   │   ├── CtaSection.tsx
│   │   └── index.ts
│   ├── modes/                    # Mode detail page components
│   │   ├── ModeDetailHero.tsx
│   │   ├── ModeUseCases.tsx
│   │   └── ModeIntelligenceFlow.tsx
│   ├── capabilities/             # Capability detail page components
│   │   ├── CapabilityDetailHero.tsx
│   │   └── CapabilityFeatures.tsx
│   └── app/                      # Dashboard components
│       ├── AppSidebar.tsx
│       ├── AppTopbar.tsx
│       ├── ChatMessages.tsx
│       ├── ChatInput.tsx
│       ├── IntelligenceResultCard.tsx
│       ├── SessionIntelligencePanel.tsx
│       └── index.ts
│
└── lib/
    ├── constants/
    │   ├── modes.ts              # All mode data
    │   ├── capabilities.ts       # All capability data
    │   └── navigation.ts         # Nav + footer link data
    ├── hooks/
    │   ├── useReveal.ts          # Scroll animation hook
    │   └── useChat.ts            # Dashboard chat state
    ├── types/
    │   └── index.ts              # All TypeScript interfaces
    └── utils/
        └── index.ts              # cn(), formatTime(), etc.
```

---

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Type check
npm run type-check

# Build for production
npm run build
```

Open [http://localhost:3000](http://localhost:3000).

---

## Key Routes

| Route | Description |
|---|---|
| `/marketing` | Home / landing page |
| `/marketing/modes/professional` | Professional Mode detail |
| `/marketing/modes/sales` | Sales Mode detail |
| `/marketing/modes/relationship` | Relationship Mode detail |
| `/marketing/capabilities/reply-generator` | Reply Generator detail |
| `/marketing/capabilities/tone-checker` | Tone Checker detail |
| `/marketing/capabilities/intent-detector` | Intent Detector detail |
| `/marketing/capabilities/boundary-builder` | Boundary Builder detail |
| `/marketing/capabilities/follow-up-writer` | Follow-Up Writer detail |
| `/marketing/capabilities/difficult-email` | Difficult Email detail |
| `/marketing/capabilities/sales-negotiation` | Sales & Negotiation detail |
| `/marketing/solutions` | Solutions index |
| `/marketing/pricing` | Pricing page |
| `/dashboard` | App / Chat interface |

---

## Design System

### Color Tokens (Tailwind)
- `navy-*` — Primary brand navy (50–900)
- `violet-*` — Accent violet (50–900)
- `cream-*` — Background warm cream (50–500)
- `teal-*` — Success / positive (300–600)
- `amber-*` — Sales / warning (400–500)

### Typography
- `font-display` → Playfair Display (headings, italics)
- `font-body` → Plus Jakarta Sans (body, UI)

### Component Variants
All components accept a `variant` prop. Variants are defined as typed unions to prevent invalid usage.

---

## Backend Integration Points

The following hooks and components are wired for backend replacement:

### `src/lib/hooks/useChat.ts`
- `sendMessage()` — Replace the `setTimeout` mock with your actual API call
- Session persistence — Replace `useState` with your data layer (React Query, SWR, etc.)

### `src/components/app/ChatMessages.tsx`
- The `SAMPLE_RESULT` constant — Replace with live `IntelligenceResult` from your API
- Message rendering — `IntelligenceResult` type in `src/lib/types/index.ts` matches your backend JSON schema

### API Response Shape
Your backend should return data matching `IntelligenceResult` in `src/lib/types/index.ts`:

```json
{
  "mode": "professional",
  "scenario": "Salary Negotiation",
  "riskLevel": "low",
  "analysis": "...",
  "strategy": "...",
  "responses": [
    {
      "type": "Option 1 — Diplomatic & Firm",
      "reply": "...",
      "whyItWorks": "...",
      "likelyOutcome": "...",
      "confidence": 94
    }
  ],
  "scores": {
    "confidence": 94,
    "clarity": 9.1,
    "toneMatch": "Excellent",
    "escalationRisk": "low"
  }
}
```

---

## Adding New Pages

### New Mode
1. Add entry to `src/lib/constants/modes.ts`
2. Page auto-generates at `/marketing/modes/[id]` via `generateStaticParams`

### New Capability
1. Add entry to `src/lib/constants/capabilities.ts`
2. Page auto-generates at `/marketing/capabilities/[id]` via `generateStaticParams`

### New Section on Home
1. Create component in `src/components/marketing/`
2. Export from `src/components/marketing/index.ts`
3. Import in `src/app/marketing/page.tsx`
