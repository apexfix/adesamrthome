# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Homeowners in metropolitan Adelaide, South Australia, fitting a smart lock to their own front door. Two groups place most orders (confirmed by the owner, 2026-11-21):

- Chinese-speaking homeowners, many of whom already own a lock bought in China or online and need someone able to fit it.
- English-speaking local homeowners who want keyless entry and need both the lock and the fitting.

Secondary audiences with their own pages: Airbnb and rental hosts, property managers, new-home builders.

Their situation: they are unsure whether a smart lock will fit their door, worried about a tradesperson cutting into the door badly, and often holding a lock that locksmiths have declined to install.

## Product Purpose

ADE Smart Home supplies and installs smart locks, installs compatible locks the customer already owns, and sells Dahua CCTV camera kits. The website exists to turn a search or a referral into a quote request (the form, a text message or an email).

Success, per the owner: more people clicking through from Google search results, and more visitors requesting a quote. Both are low today.

## Positioning

**They fit the locks other installers will not.** Imported and online-bought locks, non-standard mortise bodies, doors that need new cut-outs, old digital-lock replacements. The door is checked from photos before anything is booked.

Supporting facts:

- One named installer, John, does the door check, the fitting, the setup with the customer and the clean-up. Google reviewers name him.
- The price is confirmed before booking. No deposit and no online payment.
- English and Chinese are both spoken.

## Operating Context

- The customer sends door photos (outside face, inside face, door edge, frame) by form, SMS or email.
- Compatibility, scope and price are confirmed remotely; then a visit is booked.
- On site: fitting with jigs and specialist tools, app, fingerprint and PIN setup with the customer, vacuum clean-up.
- Service area: Adelaide metro. Hours: Mon–Sat 8am–6pm.

## Capabilities and Constraints

- **Contact is text message and email only. No phone calls.** No `tel:` links and no "call" wording anywhere.
- Prices: supply-and-install packages from $699; installation only $200 (compact lock) or $350 (full-size standard 6068 mortise); Dahua 2-camera kits from $443.
- Brands supplied: Lockin (X9, S6 Max, V5 Max, SV40, S50M Pro, Veno Pro, Ola Slim), Kaadas K70 SE. Other brands are installed when compatible.
- There is no online checkout. Every sale goes through a quote.
- Next.js 16 App Router, Tailwind 4, deployed on Vercel. Product and SEO data live in `src/lib/`.
- Existing URLs, titles, structured data and internal links carry search value and must survive a redesign.
- English site at `/`, one Chinese page at `/zh`.
- Undecided: ABN, licence and insurance details, installer photo, Google review count (placeholders in `src/lib/seoData.ts` stay hidden while empty).

## Brand Commitments

- Name: ADE Smart Home. Logo at `public/img/logo.png`.
- Voice in existing copy: plain, specific, trade-honest (states what is included and what is quoted separately).
- The owner finds the current black-and-gold look too much like an AI-generated site and wants it replaced.

## Evidence on Hand

- Real installation photos on customers' doors: `public/img/products/*/real-install-*.jpg`, `public/img/installations/`. Phone photos; some show household items.
- Twelve installation stories and guides in `content/posts/`.
- Three named Google reviews (Celia, Longxiang, Jingbo Zhou), all five-star, quoted in `src/components/GoogleReviews.tsx`.
- Google Business Profile: `https://g.page/r/Cak2vtUI0QLfEBM`.
- The owner can supply: newly shot photos, installation video, before-and-after pairs. None are in the repository yet.
- Not available, and not to be invented: review count, years in business, licence numbers, customer counts, response-time promises.

## Product Principles

1. Show the hard jobs. Proof that a difficult door or an imported lock was fitted well does more than any claim.
2. The door check comes first. Every path leads to sending door photos, never to a payment.
3. Say the price and what it covers once, where the visitor decides.
4. A person, not a brand. John is who turns up; the site should make that visible.
5. Text, not calls. Every contact route respects that.

## Accessibility & Inclusion

Chinese-speaking customers are a primary audience; the Chinese route must be easy to find from the English site. Existing work targets keyboard focus, reduced motion and forced-colours support, which a redesign should keep.
