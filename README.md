# Blume by Binu

A handmade fuzzy-wire-flower shop, built as a surprise. Next.js + Tailwind,
with eSewa checkout wired up.

## Running it locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000. The site runs against eSewa's **public
test environment** by default, so you can click all the way through
checkout with fake money before going live — use eSewa's test credentials
(any test eSewa ID/MPIN from their sandbox docs) when the eSewa page opens.

## Adding or editing products

There's no database or admin panel — products live in one plain file:

`data/products.ts`

Each product is an object with a name, price (in NPR), image URL,
category, description, and optional colors. Duplicate an existing entry
and edit the fields; `id` should be a short unique slug (used as the
cart key, so don't change an `id` once real orders start coming in).

Swap the placeholder Unsplash image URLs for real photos of Binu's work —
either host them somewhere (e.g. Cloudinary, or drop files into `/public`
and reference them as `/your-file.jpg`).

This keeps things simple since you're the one managing updates. If you
later want Binu to add products herself without touching code, the
natural next step is a small database (e.g. Supabase or a headless CMS)
behind a basic admin page — happy to help build that when you're ready.

## Going live with eSewa

1. Register as an eSewa merchant and get your real `product_code` (merchant
   code) and `secret_key` from the merchant dashboard.
2. Copy `.env.example` to `.env.local` and fill in:
   - `ESEWA_PRODUCT_CODE`
   - `ESEWA_SECRET_KEY`
   - `ESEWA_BASE_URL` (eSewa's live form-submission URL)
   - `ESEWA_STATUS_URL` (eSewa's live transaction-status URL)
3. Never commit `.env.local` — it's already in `.gitignore`.

## Adding Khalti as a second payment option later

The checkout flow is isolated in `app/checkout/page.tsx` and
`lib/esewa.ts` / `app/api/esewa/*`. To add Khalti, you'd mirror that
pattern: a `lib/khalti.ts` helper, an `/api/khalti/initiate` route, and a
payment method choice on the checkout page. Worth doing once you know
which gateway customers actually prefer.

## Deploying

The easiest path is Vercel (built by the Next.js team, generous free
tier):

```bash
npm i -g vercel
vercel
```

Add your `.env.local` values as environment variables in the Vercel
project settings before your first production deploy.

## Structure

```
app/                 pages (home, shop, product detail, cart, checkout, about)
app/api/esewa/       server routes that sign and verify eSewa payments
components/          Header, Footer, ProductCard, CartContext, WireDivider
data/products.ts     product catalog — edit this to add/change items
lib/esewa.ts         eSewa signature + config helpers
```
