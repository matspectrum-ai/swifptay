# SwiftPay

Fintech platform for Pix payment processing. MVP replicating the core functionality of BuckPay with a different brand identity.

## Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14+ (App Router + RSC) on Vercel |
| Backend API | Next.js API Routes on VPS (Node.js 22) |
| Database | PostgreSQL 16 (self-hosted on VPS) |
| Cache | Redis 7 (on VPS) |
| Payments | OpenPix SDK (Pix) |
| Auth | Auth.js (Google OAuth via Supabase) |
| ORM | Prisma |
| Validation | Zod |
| Styling | TailwindCSS |
| API Docs | Swagger UI + OpenAPI 3.0 |
| Deploy | Docker Compose (VPS) + Vercel (frontend) |

## MVP Features

1. Authentication (Google OAuth via Supabase)
2. Dashboard (metrics, revenue chart, recent transactions)
3. Products CRUD
4. Checkout Pix via OpenPix
5. Public REST API with OpenAPI documentation
6. MultiPay abstraction layer (ready for N providers)
7. Transactions (list, filter, export CSV)
8. Balances and withdrawals
9. Compliance/KYC (basic)
10. Navigation (sidebar + bottom nav)
11. WhatsApp support
12. Notifications (webhooks + in-app)

## Design System

See [DESIGN.md](DESIGN.md) for the complete design system specification.

- **Colors:** Lime green (#7CFC00) + Black (#0A0A0A)
- **Fonts:** Space Grotesk (display), Inter (body), JetBrains Mono (data)
- **Style:** Revolut-inspired dark theme with lime accents

## Project Structure

```
SWIFPTAY/
├── .claude/
│   └── skills/gstack -> symlink to global gstack
├── .gstack/
│   └── config.yaml
├── .kilo/
│   ├── kilo.json
│   └── plans/
├── .gitignore
├── CLAUDE.md
├── DESIGN.md
├── SPEC.md
├── README.md
└── dashboard-preview.html
```

## Quick Start

1. Clone the repo
2. Copy `.env.example` to `.env` and fill in the values
3. Run `docker compose up -d` to start PostgreSQL, Redis, and Nginx
4. Run `npm install` and `npm run dev` to start the Next.js app
5. Open `http://localhost:3000`

## Deploy

### VPS (Backend)

```bash
# Build and start all services
make docker:build
make docker:up

# Or manually
docker compose up -d --build
```

The backend runs on `http://localhost:3001` (exposed via Nginx on ports 80/443).

### Vercel (Frontend)

```bash
# Deploy to Vercel
npx vercel --prod
```

Set the following environment variables in Vercel:
- `NEXTAUTH_URL` — your frontend URL
- `NEXTAUTH_SECRET` — a random secret
- `GOOGLE_CLIENT_ID` — Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` — Google OAuth client secret
- `API_BASE_URL` — your VPS API URL (e.g., `https://api.swiftpay.com.br`)
- `CORS_ORIGIN` — your frontend URL

### CI/CD

GitHub Actions automatically runs lint, tests, and builds on every push to `master`. Deploy to VPS and Vercel is triggered on merge to `master`.

Required GitHub Secrets:
- `VPS_USER` — SSH user for your VPS
- `VPS_HOST` — VPS hostname or IP
- `VERCEL_TOKEN` — Vercel API token
- `VERCEL_ORG_ID` — Vercel organization ID
- `VERCEL_PROJECT_ID` — Vercel project ID

## API Documentation

Once the server is running, the interactive API docs are available at:

- **Swagger UI:** `http://localhost:3000/api/docs`
- **OpenAPI JSON:** `http://localhost:3000/api/docs/openapi.json`

## License

MIT