# SwiftPay — Design System

## Brand

**Name:** SwiftPay
**Tagline:** Pagamentos instantâneos.
**Mood:** Moderno, limpo, confiável, rápido.

## Color Palette

| Token | Value | Usage |
|---|---|---|
| `--color-primary` | `#7CFC00` | CTAs, links, highlights |
| `--color-primary-dark` | `#3D5A00` | Hover states, dark text on light |
| `--color-primary-light` | `#A8E600` | Gradients, glows |
| `--color-bg` | `#0A0A0A` | Page background |
| `--color-surface` | `#111111` | Cards, panels |
| `--color-surface-elevated` | `#1A1A1A` | Headers, nav bars |
| `--color-surface-glass` | `rgba(255,255,255,0.03)` | Glassmorphism surfaces |
| `--color-text` | `#FFFFFF` | Primary text |
| `--color-text-secondary` | `#8A8A8A` | Secondary text, labels |
| `--color-success` | `#7CFC00` | Success states |
| `--color-error` | `#FF3B3B` | Error states |
| `--color-warning` | `#FFB800` | Warning states |

## Typography

| Role | Font | Weight |
|---|---|---|
| Display | Space Grotesk | 700–800 |
| Body | Inter | 400–600 |
| Mono (data) | JetBrains Mono | 400–500 |

## Visual Language

Inspired by **Revolut's design system** adapted for SwiftPay's brand:

- **Dark theme** — black backgrounds with depth through layered surfaces
- **Lime accent** — vibrant green for CTAs, active states, and highlights
- **Glassmorphism** — backdrop blur on topbar and bottom nav
- **Generous border-radius** — 16px cards, 12px mini-cards, 8px buttons
- **Subtle glow** — `box-shadow: 0 0 30px rgba(124,252,0,0.08)` on primary elements
- **Gradient text** — primary text uses lime gradient for the logo and key values
- **Bottom navigation** — fixed bottom bar with active indicator (dot + glow)
- **Top bar** — fixed, blurred backdrop, search input, notification badge, avatar
- **Depth** — layered cards with subtle borders (`rgba(255,255,255,0.04)`)
- **Hover micro-interactions** — lift on buttons, glow on icons, bar chart hover

## Spacing

| Token | Value |
|---|---|
| `--space-xs` | 4px |
| `--space-sm` | 8px |
| `--space-md` | 16px |
| `--space-lg` | 24px |
| `--space-xl` | 32px |

## Border Radius

| Token | Value | Usage |
|---|---|---|
| `--radius` | 16px | Cards, modals |
| `--radius-sm` | 12px | Mini-cards, tables |
| `--radius-xs` | 8px | Buttons, inputs, badges |

## Shadows

| Token | Value |
|---|---|
| `--shadow-sm` | `0 1px 3px rgba(0,0,0,0.4)` |
| `--shadow-md` | `0 4px 16px rgba(0,0,0,0.5)` |
| `--shadow-glow` | `0 0 30px rgba(124,252,0,0.08)` |
| `--shadow-glow-strong` | `0 0 40px rgba(124,252,0,0.15)` |

## Components

### Buttons
- **Primary** — lime background, black text, glow shadow
- **Secondary** — transparent, lime border, lime text
- **Icon** — 44x44px circle, surface background, lime glow on hover
- **Hover** — lift (`translateY(-1px)`), stronger glow

### Cards
- Surface background, subtle border, 16px radius
- Hover: border shifts to lime tint, subtle shadow

### Status Pills
- **Completed** — lime background + text
- **Pending** — amber background + text
- **Failed** — red background + text
- Dot indicator (6px circle) before label text

### Navigation
- **Sidebar** (desktop) — fixed left, 240px, surface background
- **Bottom nav** (mobile) — fixed bottom, glassmorphism, active dot indicator
- **Top bar** — fixed top, blur backdrop, search + actions

### Data Display
- **Amounts** — JetBrains Mono, right-aligned in tables
- **Positive values** — lime green
- **Negative values** — red
- **Large values** — Space Grotesk, tight letter-spacing

## Layout

- **Max content width** — 1200px centered
- **Desktop** — sidebar + main content
- **Mobile** — bottom nav + full-width content
- **Grid** — 4-column mini-cards, 2-column detail sections

## Design Tokens File

See `tokens.css` for CSS custom properties export.

## OpenDesign

This design system can be imported into OpenDesign (nexu-io/open-design) as a `DESIGN.md` package for visual prototyping and mockup generation.