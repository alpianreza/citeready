# COORDINATION NOTE — from Eiran (Muse) to Antigravity (PC agent)
Date: 2026-11-19 (Day 1 of the 30-day challenge)
Status: Owner appointed Eiran as coordinator for the CiteReady launch execution. Eiran verifies and reports to the owner; the owner keeps all spending/publishing approvals.

## Owner decisions (2026-11-19, via Eiran)

1. DOMAIN — No new domain purchase. The site will live at **https://citeready.eiran.tech** (subdomain of the owner's registered domain eiran.tech, active until Oct 2027). Do NOT plan around citeready.dev; that domain is unregistered and will not be bought for now. The `contactEmail` in `site/config.js` still points to citeready.dev — flagging as TBD until the owner confirms a working mailbox.
2. PAYMENTS — The owner has ALREADY created a **Gumroad** account. Use Gumroad as the primary checkout channel. Polar.sh setup is deferred (not needed for launch). Products and prices are unchanged: Pro CLI $19 (upload `dist/citeready-pro-v1.0.0.zip`), Done-For-You Fix Pack $29, Agency Ship Pack $49. Listing copy in `marketing/polar-and-gumroad-listings.md` applies to Gumroad as well.
3. DEPLOYMENT — Eiran handles deploying `site/` (GitHub Pages via the owner's GitHub) and the DNS step with the owner (one CNAME record: `citeready` -> hosting target, exact value supplied by Eiran). Agy does not need to deploy anything.

## Division of labor

- Agy (PC): keep the product/code as the source of truth in this folder; if Gumroad checkout URLs are created, update `site/config.js` (proCli / dfyStarter / agencyShip) OR tell Eiran and Eiran will sync the deployed copy. Launch posts stay DRAFT until the owner approves publication.
- Eiran: deployment, DNS coordination, verification of the live site and checkout links, daily status reports to the owner.
- Owner: creates the 3 Gumroad products (copy/prices/file are ready) or logs Gumroad into Eiran's browser; adds the DNS CNAME record (or provides registrar access); approves launch posts before anything is published.

## Rules that stay in force

- No spending, no new paid services, no mass outreach, no publishing without the owner's explicit approval.
- Revenue claims only from verifiable transactions (ledger.json stays the source of truth).

## Open items right now

- [ ] Gumroad: 3 products created + checkout URLs produced.
- [ ] site/config.js: checkout URLs filled in.
- [ ] Deploy site/ + DNS CNAME for citeready.eiran.tech.
- [ ] Verify live site (HTTP 200, scanner works, sample report opens, checkout buttons resolve).
- [ ] Owner approval for launch posts + 1-on-1 outreach.
