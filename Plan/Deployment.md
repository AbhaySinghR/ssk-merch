# Deployment & Backend Plan — SSK Merch

## Context

The site currently runs as a browse-only shop demo:
- "Add to Cart" is a UI-only stub — no real cart exists yet.
- The alumni sign-in/registration form writes to a local JSON file
  (`data/registrations.json`), which only works for local development —
  Vercel's filesystem isn't persistent across deployments/invocations.
- There is no order capture, no database, and no admin view of any kind.

The goal of this phase: turn this into a real small-business backend. The
shop owner needs to capture **every** registration and order detail (customer
info, shipping address, items/sizes/quantities) so they can manage inventory
and fulfill shipments — and they need a way to actually see that data day to
day.

### Decisions already made (do not re-litigate these without checking with the
business owner first)
- **Database:** Supabase (Postgres + free hosted dashboard).
- **Payment:** Out of scope for this phase. Checkout captures order + shipping
  details only; the owner follows up and collects payment manually (UPI/bank
  transfer/COD) and marks orders paid/shipped by hand. A real payment gateway
  (Razorpay is the standard choice for India) can be added later without
  reworking this plan.
- **Admin access:** A simple password-protected `/admin` page on the site
  (not just the Supabase dashboard) — single shared password, not multi-user
  accounts. This is a one-shop-owner tool, not a team auth system.
- **Order fields required:** customer name, phone, email, full shipping
  address (line 1/2, city, state, pincode), items ordered (product, size,
  quantity), and order notes.
- **Hosting:** Vercel (first-party Next.js support, free tier).
- **Domain:** `saikap.in`, already purchased via GoDaddy. DNS records will need
  to be added there manually once Vercel issues them — whoever does this step
  needs GoDaddy account access.

## Current codebase context (read before starting)

- `src/lib/products.ts` — `Product` type (`slug, name, category,
  categoryLabel, price, sizes, fabric, description, images`) plus
  `getAllProducts/getProductBySlug/getCategories/getAllSizes/getPriceBounds`.
  **Prices here are the source of truth** — checkout must re-derive price
  server-side from this catalog by slug, never trust a client-submitted price.
- `src/components/shop/AddToCartButton.tsx` — currently just shows fake
  "Added!" feedback via `setTimeout`. Takes only `productName` as a prop. This
  needs to become a real cart-add action.
- `src/components/shop/SizeSelector.tsx` — manages its own local `selected`
  size state today, totally disconnected from `AddToCartButton`. These two
  need to share state so "Add to Cart" knows which size was picked.
- `src/app/shop/[slug]/page.tsx` — Server Component rendering the gallery,
  `SizeSelector`, and `AddToCartButton` side by side with no shared state.
- `src/app/sign-in/actions.ts` + `src/lib/registrations.ts` — Server Action
  using a `useActionState`-style `RegisterState`/`RegisterFieldErrors` shape;
  validates fields then calls `saveRegistration()`, which appends to the JSON
  file. **Only the persistence call needs to change** — validation and the
  form UI are fine as-is.
- `src/lib/resend.ts` — established pattern worth copying: export the client
  as `null` if its env var isn't set, so local dev without credentials doesn't
  crash, and callers degrade gracefully (log + continue) instead of throwing.
  Use this same shape for the new Supabase client.
- `src/components/Navbar.tsx` — client component (`"use client"`, already has
  `useState` for the mobile menu), `navLinks` array, hardcoded "SIGN IN" link.
  The cart icon belongs here.
- No cart, auth, session, or admin code exists anywhere in the repo yet. No
  `@supabase/supabase-js` or any auth library is installed.
- Live GitHub repo: `https://github.com/AbhaySinghR/ssk-merch` (`main`
  branch). A previous static GitHub Pages preview exists on a `gh-pages`
  branch — that was a throwaway static mirror for an early visual preview and
  is unrelated to this production deployment; ignore it.

## Implementation steps

### 1. Supabase project + schema
- `npm install @supabase/supabase-js`.
- Create a Supabase project (supabase.com — or via `npx supabase login` /
  `supabase projects create` if scripting it). Grab the Project URL and the
  `service_role` key from Settings → API.
- Create three tables. Enable Row Level Security on all three but add **no
  policies** — i.e. default-deny for the public `anon` key. All reads/writes
  go through server-side code using the `service_role` key, which bypasses
  RLS; the browser never talks to Supabase directly.
  - `registrations`: `id uuid pk default gen_random_uuid()`, `title`,
    `first_name`, `last_name`, `email`, `phone`, `school_number`, `batch`,
    `created_at timestamptz default now()`
  - `orders`: `id uuid pk`, `customer_name`, `phone`, `email`,
    `address_line1`, `address_line2`, `city`, `state`, `pincode`, `notes`,
    `status text default 'pending'`, `total_amount numeric`,
    `created_at timestamptz default now()`
  - `order_items`: `id uuid pk`, `order_id uuid references orders(id)`,
    `product_slug`, `product_name`, `size`, `quantity int`,
    `unit_price numeric`
- New file `src/lib/supabase.ts`: server-only client built from
  `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`, exported as `null` when those
  env vars are absent (mirror `src/lib/resend.ts`).

### 2. Real cart
- New `src/components/cart/CartContext.tsx`: client Context + `useCart()`
  hook. `CartItem = { slug, name, image, size, price, quantity }`. Persist to
  `localStorage` (hydrate in a `useEffect` on mount — it's not available
  server-side — and write on every change). Actions: `addItem`,
  `updateQuantity`, `removeItem`, `clear`.
- Wrap the app with `<CartProvider>` in `src/app/layout.tsx`.
- New `src/components/shop/ProductPurchasePanel.tsx` (client component):
  replaces the separate `SizeSelector` + `AddToCartButton` placement in
  `[slug]/page.tsx` with one component holding shared `selectedSize` state.
  `AddToCartButton` calls `addItem({ ...product, size: selectedSize, quantity:
  1 })` instead of the fake timeout.
- New `src/components/cart/CartIcon.tsx`, added into `Navbar.tsx`: bag icon +
  item-count badge, links to `/cart`.
- New `src/app/cart/page.tsx` + `src/components/cart/CartView.tsx`: list
  items, quantity +/- and remove, subtotal, "Proceed to Checkout" →
  `/checkout`, plus an empty-cart state.

### 3. Checkout → Supabase
- New `src/app/checkout/page.tsx` + `src/components/checkout/CheckoutForm.tsx`
  (client): collects customer name, phone, email, address line 1/2, city,
  state, pincode, notes, alongside a read-only cart summary.
- On submit, call the Server Action **directly as a function** from the
  `onSubmit` handler — `await placeOrder({ customer, items: cartItems })` —
  rather than a plain `<form action>`, so the cart array can be passed as a
  real JS argument instead of being encoded into hidden form fields. (This is
  documented under "Event Handlers" for Server Functions in the Next.js
  docs — same mechanism, just invoked from code instead of a form.)
- New `src/app/checkout/actions.ts`: `placeOrder` Server Action —
  validates the address fields, **re-looks-up each item's current price
  server-side via `getProductBySlug`** (never trust a client-submitted
  price), inserts one `orders` row + N `order_items` rows through the
  Supabase client, returns success + order id.
- On success, `CheckoutForm` calls `useCart().clear()` and shows an inline
  "Order placed" success state — same pattern `RegisterForm` already uses for
  its success branch. No separate confirmation route needed.

### 4. Migrate registrations off the JSON file
- Edit `src/app/sign-in/actions.ts`: keep all existing validation exactly as
  it is. Replace the `saveRegistration(...)` (JSON file) call with a Supabase
  insert into `registrations`. Keep `saveRegistration` only as a local-dev
  fallback used when the Supabase client is `null` (no env vars set) — same
  graceful-degradation shape already used for Resend.

### 5. Admin dashboard (password-protected)
This is a single-shop-owner tool, not a multi-user system — a shared password
is intentional and sufficient. No bcrypt/JWT library needed.
- Env vars: `ADMIN_PASSWORD` (what gets typed in to log in) and
  `ADMIN_SESSION_SECRET` (a long random string, never shown in any UI, used
  only as the cookie's value).
- New `src/app/admin/login/page.tsx` + `src/app/admin/login/actions.ts`:
  Server Action checks the submitted password against `ADMIN_PASSWORD`; on
  match, sets an httpOnly `admin_session` cookie equal to
  `ADMIN_SESSION_SECRET`.
- New `middleware.ts`: for any `/admin` path except `/admin/login`, check the
  `admin_session` cookie equals `ADMIN_SESSION_SECRET`; redirect to
  `/admin/login` if it doesn't match.
- New `src/app/admin/page.tsx` (Server Component): fetch registrations and
  orders (with their `order_items`) from Supabase, render as two tables
  styled to match the site. Each order row should get a small status-update
  control (`pending → shipped → delivered`) via an inline Server Action —
  this is the actual "send shipments" workflow the owner needs.
- A logout action/link that clears the `admin_session` cookie.

### 6. Deploy to Vercel + connect saikap.in
- Push the current branch to GitHub `main`
  (`https://github.com/AbhaySinghR/ssk-merch`).
- Install the Vercel CLI, `npx vercel login` (browser device-code auth, same
  flow pattern as `gh auth login`), `vercel link`, then set every env var with
  `vercel env add` — `RESEND_API_KEY`, `SUPABASE_URL`,
  `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET` — then
  `vercel --prod` to deploy. (All of this is also doable through the Vercel
  web dashboard if preferred — import the GitHub repo, it auto-detects
  Next.js, add the same env vars under Project Settings → Environment
  Variables.)
- Add `saikap.in` as a domain on the Vercel project (dashboard: Project
  Settings → Domains). Vercel will display the DNS records needed — typically
  an A record for the apex domain and a CNAME for `www`.
- **Add those DNS records in GoDaddy's DNS management** — this requires
  GoDaddy account access and has to be done by whoever holds that account;
  it's the one step Vercel/CLI can't do for you.

## Verification checklist
- [ ] `npx tsc --noEmit` and `npm run lint` clean.
- [ ] Local: add multiple products/sizes to cart; cart icon count updates and
      survives a page reload (localStorage persistence working).
- [ ] Complete a checkout; confirm a row lands in Supabase's `orders` and
      matching rows in `order_items`.
- [ ] Submit the sign-in form; confirm a row lands in Supabase's
      `registrations`.
- [ ] Visit `/admin` while logged out → redirected to `/admin/login`.
- [ ] Wrong password on `/admin/login` → rejected. Correct password → both
      tables visible and populated.
- [ ] Update an order's status from the admin page and confirm it persists
      on refresh.
- [ ] After Vercel deploy: repeat the cart → checkout → Supabase check
      against the live `*.vercel.app` URL.
- [ ] After `saikap.in` DNS propagates: repeat the same check against the
      custom domain, and confirm HTTPS is issued correctly.

## Open items for whoever picks this up
- Need a Supabase project created and its `service_role` key (don't use the
  `anon` key for server-side writes).
- Need `ADMIN_PASSWORD` and a generated `ADMIN_SESSION_SECRET` decided before
  deploying.
- Need GoDaddy account access to add DNS records for `saikap.in` once Vercel
  issues them.
- Payment gateway integration is explicitly deferred — don't add Razorpay/etc.
  without re-confirming scope with the business owner first.
