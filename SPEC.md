# SwiftPay — MVP Specification

## Overview

SwiftPay is a fintech platform for Pix payment processing. The MVP replicates the core functionality of BuckPay with a different brand identity, targeting merchants who need to receive and manage Pix payments.

**Version:** 1.0.0
**Status:** Draft
**Date:** 2026-07-31

---

## 1. Problem Statement

Merchants need a simple, fast way to receive Pix payments, manage products, and track transactions. Existing solutions are complex or expensive. SwiftPay provides a clean, modern interface with OpenPix as the payment provider and a public API for third-party integrations.

## 2. Goals

- Deliver a functional MVP in 18-30 working days
- Provide a seamless Pix payment experience (sub-150ms QR code generation)
- Expose a public REST API with OpenAPI documentation
- Support multi-provider architecture from day one (OpenPix in MVP)
- Maintain data sovereignty (all data on VPS, no managed DB)

## 3. Target Users

- **Primary:** Merchants (small to medium businesses) receiving Pix payments
- **Secondary:** Developers integrating SwiftPay into their own systems via API
- **Tertiary:** Internal admin team managing the platform

## 4. MVP Features

### 4.1 Authentication

| Requirement | Detail |
|---|---|
| Google OAuth | Via Supabase Auth |
| Email/password fallback | Supabase Auth |
| Session management | JWT with refresh token |
| Roles | `merchant`, `admin` |
| Protection | Middleware on all protected routes |
| Security | CSRF protection, rate limiting on login |

### 4.2 Dashboard

| Requirement | Detail |
|---|---|
| Metrics display | Balance, revenue, expenses, transaction count |
| Revenue chart | Bar chart for last 7 days |
| Recent transactions | Last 10 transactions |
| Quick actions | Receive Pix, Withdraw, New Product |
| Responsiveness | Desktop + mobile |
| Real-time | Polling every 30s for balance updates |

### 4.3 Products (CRUD)

| Requirement | Detail |
|---|---|
| Create | Name, description, price, category |
| List | Paginated (20/page), searchable |
| Update | All fields editable |
| Delete | Soft delete |
| Activate/Deactivate | Toggle product availability |
| QR Code | Auto-generated per product |

### 4.4 Checkout Pix via OpenPix

| Requirement | Detail |
|---|---|
| QR Code generation | Via OpenPix SDK |
| Value validation | Min R$ 0.01, Max R$ 50.000,00 |
| Transaction storage | Status `pending` on creation |
| Webhook processing | OpenPix callback updates status |
| Status flow | `pending` → `completed` / `failed` |
| Expiration | QR codes expire after 24 hours |

### 4.5 Public REST API

| Requirement | Detail |
|---|---|
| Authentication | API Key via `X-API-Key` header |
| Rate limiting | 100 requests/minute per key |
| Format | JSON request/response |
| Versioning | URL-based (`/api/v1/`) |
| Error format | Standardized error envelope |

#### API Endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/v1/charges` | Create a Pix charge | API Key |
| GET | `/api/v1/charges/:id` | Get charge details | API Key |
| GET | `/api/v1/charges` | List charges with filters | API Key |
| POST | `/api/v1/products` | Create a product | API Key |
| GET | `/api/v1/products` | List products | API Key |
| PUT | `/api/v1/products/:id` | Update a product | API Key |
| DELETE | `/api/v1/products/:id` | Delete a product | API Key |
| GET | `/api/v1/transactions` | List transactions | API Key |
| GET | `/api/v1/balance` | Get account balance | API Key |
| POST | `/api/v1/withdrawals` | Request a withdrawal | API Key |
| GET | `/api/v1/webhooks` | List webhooks | API Key |
| POST | `/api/v1/webhooks` | Create a webhook | API Key |
| PUT | `/api/v1/webhooks/:id` | Update a webhook | API Key |
| DELETE | `/api/v1/webhooks/:id` | Delete a webhook | API Key |

### 4.6 API Documentation

| Requirement | Detail |
|---|---|
| OpenAPI spec | `/api/docs/openapi.json` |
| Swagger UI | `/api/docs` |
| Request/response examples | Every endpoint |
| Error codes | Documented with descriptions |
| Quickstart guide | Step-by-step integration guide |
| Webhook guide | Signature verification, retry logic |

### 4.7 MultiPay Abstraction Layer

| Requirement | Detail |
|---|---|
| Interface | `PixProvider` with `createPayment`, `processWebhook`, `getStatus`, `healthCheck` |
| OpenPix adapter | First implementation |
| Provider registry | Database-driven configuration |
| Smart routing | Priority-based with circuit breaker |
| Extensibility | New providers via adapter pattern |

### 4.8 Transactions

| Requirement | Detail |
|---|---|
| List with filters | Date range, status, type, method |
| Pagination | 20 per page |
| Detail view | Full transaction metadata |
| Export | CSV download |
| Statuses | `pending`, `completed`, `failed`, `refunded` |

### 4.9 Balances and Withdrawals

| Requirement | Detail |
|---|---|
| Balance check | Real-time balance query |
| Withdrawal request | Min R$ 10.00 via Pix |
| Daily limit | R$ 5.000,00 |
| History | List of past withdrawals |
| Status flow | `processing` → `completed` / `failed` |

### 4.10 Compliance/KYC (Basic)

| Requirement | Detail |
|---|---|
| Merchant registration | CNPJ/CPF |
| Document upload | Identity and business docs |
| Verification status | `pending`, `verified`, `rejected` |
| Transaction limits | Based on KYC level |

### 4.11 Navigation

| Requirement | Detail |
|---|---|
| Sidebar (desktop) | Fixed left, 240px, menu items |
| Bottom nav (mobile) | Fixed bottom, 4 items |
| Top bar | Search, notifications, avatar |
| Route protection | Redirect to login if unauthenticated |

### 4.12 WhatsApp Support

| Requirement | Detail |
|---|---|
| Support link | Direct WhatsApp link |
| Floating button | Bottom-right corner |
| Pre-filled message | Default support query |

### 4.13 Notifications

| Requirement | Detail |
|---|---|
| Webhooks | External event notifications |
| In-app toasts | Real-time status updates |
| Badge count | Unread notification count |
| Event types | Payment received, payment failed, withdrawal processed |

## 5. Technical Architecture

### 5.1 Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14+ (App Router + RSC) on Vercel |
| Backend API | Next.js API Routes on VPS (Node.js 22) |
| Database | PostgreSQL 16 (self-hosted on VPS) |
| Cache | Redis 7 (on VPS) |
| Payments | OpenPix SDK |
| Auth | Auth.js (Google OAuth) |
| ORM | Prisma |
| Validation | Zod |
| Styling | TailwindCSS |
| API Docs | Swagger UI + OpenAPI 3.0 |
| Reverse Proxy | Nginx (SSL, rate limiting) |
| Deployment | Docker Compose on VPS + Vercel for frontend |

### 5.2 Infrastructure

- **VPS:** 12GB RAM, Docker Compose
- **Frontend:** Vercel (Edge Network)
- **Backend:** Single Node.js process on VPS
- **Database:** PostgreSQL in Docker container
- **Cache:** Redis in Docker container
- **SSL:** Nginx with Let's Encrypt auto-renewal

### 5.3 Data Model

#### `users`
- `id` (UUID, PK)
- `email` (string, unique)
- `name` (string)
- `password_hash` (string, nullable)
- `avatar_url` (string, nullable)
- `kyc_status` (enum: `pending`, `verified`, `rejected`)
- `role` (enum: `merchant`, `admin`)
- `created_at` (timestamp)
- `updated_at` (timestamp)

#### `products`
- `id` (UUID, PK)
- `user_id` (UUID, FK → users)
- `name` (string)
- `description` (text, nullable)
- `price` (decimal)
- `category` (string, nullable)
- `is_active` (boolean, default true)
- `qr_code_data` (text, nullable)
- `created_at` (timestamp)
- `updated_at` (timestamp)

#### `charges`
- `id` (UUID, PK)
- `user_id` (UUID, FK → users)
- `product_id` (UUID, FK → products, nullable)
- `amount` (decimal)
- `pix_key` (string)
- `status` (enum: `pending`, `completed`, `failed`, `expired`)
- `openpix_transaction_id` (string, nullable)
- `qr_code_url` (text, nullable)
- `expires_at` (timestamp)
- `created_at` (timestamp)
- `completed_at` (timestamp, nullable)

#### `transactions`
- `id` (UUID, PK)
- `user_id` (UUID, FK → users)
- `charge_id` (UUID, FK → charges, nullable)
- `type` (enum: `income`, `expense`)
- `method` (enum: `pix`)
- `amount` (decimal)
- `status` (enum: `pending`, `completed`, `failed`, `refunded`)
- `provider` (string, default `openpix`)
- `metadata` (jsonb, nullable)
- `created_at` (timestamp)

#### `withdrawals`
- `id` (UUID, PK)
- `user_id` (UUID, FK → users)
- `amount` (decimal)
- `pix_key` (string)
- `status` (enum: `processing`, `completed`, `failed`)
- `transaction_id` (UUID, FK → transactions, nullable)
- `created_at` (timestamp)
- `completed_at` (timestamp, nullable)

#### `providers`
- `id` (UUID, PK)
- `name` (string)
- `api_key` (string, encrypted)
- `base_url` (string)
- `status` (enum: `active`, `inactive`, `degraded`)
- `priority` (integer)
- `fee_percent` (decimal)
- `config` (jsonb, nullable)
- `created_at` (timestamp)

#### `api_keys`
- `id` (UUID, PK)
- `user_id` (UUID, FK → users)
- `key_hash` (string)
- `name` (string)
- `permissions` (jsonb)
- `last_used_at` (timestamp, nullable)
- `is_active` (boolean, default true)
- `created_at` (timestamp)

#### `webhooks`
- `id` (UUID, PK)
- `user_id` (UUID, FK → users)
- `url` (string)
- `secret` (string, encrypted)
- `events` (jsonb)
- `is_active` (boolean, default true)
- `created_at` (timestamp)

#### `webhook_deliveries`
- `id` (UUID, PK)
- `webhook_id` (UUID, FK → webhooks)
- `payload` (jsonb)
- `status` (enum: `pending`, `delivered`, `failed`)
- `response` (text, nullable)
- `attempts` (integer, default 0)
- `next_retry_at` (timestamp, nullable)
- `created_at` (timestamp)

## 6. Design System

See `DESIGN.md` for the complete design system specification.

### Key Tokens

| Token | Value |
|---|---|
| Primary color | `#7CFC00` (Lime) |
| Background | `#0A0A0A` (Black) |
| Surface | `#111111` |
| Surface elevated | `#1A1A1A` |
| Text | `#FFFFFF` |
| Text secondary | `#8A8A8A` |
| Display font | Space Grotesk |
| Body font | Inter |
| Mono font | JetBrains Mono |
| Border radius | 16px (cards), 12px (mini-cards), 8px (buttons) |

## 7. Performance Targets

| Metric | Target |
|---|---|
| QR Code generation | < 150ms p95 |
| API response time | < 200ms p95 |
| Dashboard load | < 1s (SSR) |
| Database query | < 15ms |
| Uptime | 99.9% |

## 8. Security Requirements

- All API endpoints require authentication (API Key or JWT)
- API keys are hashed before storage
- Webhook signatures verified with HMAC-SHA256
- Rate limiting on all public endpoints
- SQL injection prevention via Prisma ORM
- XSS prevention via Next.js built-in protections
- CORS configured for Vercel frontend origin only
- HTTPS enforced (Nginx + Let's Encrypt)
- Sensitive data (API keys, webhook secrets) encrypted at rest

## 9. Success Criteria

The MVP is considered complete when:

1. All 13 features are implemented and functional
2. Test coverage > 80% for API routes
3. Dashboard loads in < 1 second
4. QR Code generation < 150ms p95
5. API documentation is live at `/api/docs`
6. Deploy pipeline works (Vercel + VPS Docker Compose)
7. Security audit passes (no critical vulnerabilities)
10. Merchant can complete end-to-end flow: register → create product → receive Pix payment → see transaction → request withdrawal

## 10. Out of Scope (MVP)

- Credit card payments
- Boleto payments
- Multiple payment providers beyond OpenPix (adapter ready, no active providers)
- Affiliate system
- Advanced analytics/reporting
- Email notifications
- Mobile app (responsive web only)
- Multi-tenant isolation (single-tenant for MVP)
- Advanced KYC/compliance
- Adquirente integration
- BuckMembers/loyalty program
- Automation/workflows
- Achievements/gamification

## 11. Timeline Estimate

| Phase | Duration |
|---|---|
| Setup & scaffolding | 2 days |
| Auth + Dashboard | 4 days |
| Products CRUD | 3 days |
| Checkout + OpenPix integration | 4 days |
| API + Documentation | 4 days |
| Transactions + Balances + Withdrawals | 3 days |
| MultiPay layer + Provider registry | 2 days |
| Compliance/KYC + Notifications | 2 days |
| QA + Testing | 3 days |
| Polish + Deploy | 2 days |
| **Total** | **29 working days** |

## 12. Risks

| Risk | Mitigation |
|---|---|
| OpenPix API changes | Adapter pattern isolates provider-specific logic |
| VPS downtime | Automated backups, monitoring, Let's Encrypt renewal |
| Security vulnerability | Regular dependency updates, security headers, rate limiting |
| Scope creep | Strict MVP feature list, defer non-critical items |
| Performance under load | Redis caching, connection pooling, horizontal scaling ready |

## 13. Decisions Log

| Date | Decision | Rationale |
|---|---|---|
| 2026-07-31 | Stack: Next.js + VPS + PostgreSQL + Redis | Cost-effective, full control, fits 12GB VPS |
| 2026-07-31 | Payment provider: OpenPix | Brazilian Pix provider, reliable API |
| 2026-07-31 | MultiPay abstraction from day one | Enables scaling to N providers without refactoring |
| 2026-07-31 | Hybrid deploy: Vercel (frontend) + VPS (backend) | Best of both worlds: CDN for frontend, control for backend |
| 2026-07-31 | Design: Revolut-inspired + lime green + black | Modern fintech aesthetic, brand differentiation |
| 2026-07-31 | API-first approach with public REST API | Enables third-party integrations, developer ecosystem |
| 2026-07-31 | OpenAPI + Swagger for API docs | Industry standard, auto-generated, interactive |