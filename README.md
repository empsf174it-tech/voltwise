# Voltwise

Electronics Gadgets Comparison & Review Guide

## Features
- Premium dark design system: floating glass navbar, aurora gradients, film grain, bento grids, cursor-spotlight cards
- Plain HTML/CSS/JS (no frameworks, no build step)
- Semantic HTML and fully responsive layout
- Scroll-reveal animations and count-up stats (respects `prefers-reduced-motion`)
- Interactive **Device Matchmaker** on the home page (category, budget slider, priority weighting, live re-ranking)
- Feature matrix, verified reader reviews, pros & cons breakdowns and tracked affiliate links
- WCAG 2.1 AA minded, with JSON-LD schema integration for SEO

## Pages Included
- `index.html` (Home, with the interactive Device Matchmaker)
- `about.html` (About Us, with the "Our story" timeline)
- `services.html` (Services, with the "How it works" steps)
- `reviews.html` (Reviews Hub with dynamic filtering and a scoring scale)
- `compare.html` (Feature matrix for 2–4 devices and category winners)
- `review-detail.html` (Review template: pros & cons breakdown, verdict, verified reader reviews, alternatives)
- `contact.html` (Contact form with validation and contact channels)
- `404.html` (Not Found page and popular destinations)

## Update log

### Feature matrix (`compare.html`, `assets/js/compare.js`)
- Replaces the old comparison table. Compare **2–4 devices** side by side, rows grouped under collapsible headers (Price & score, Display, Performance, Battery, Camera, Connectivity, Build).
- Values are text, numbers (tabular mono numerals) or check/x icons with screen-reader text.
- Add/remove devices: "Add" is disabled at 4 and "Remove" at 2, with an inline `role="status"` message explaining why.
- **Best overall** (highest Voltwise score) and **Best value** (score per dollar) are recalculated for the current selection and highlighted per column.
- "Show differences only" toggle hides rows where every selected device matches.
- Sticky header row + sticky first column; scrolling stays inside `.matrix-scroll` (no page-level overflow at 360px).
- All data is demo data, defined in `compare.js`.

### Verified user reviews (`review-detail.html`, `assets/js/reviews.js`)
- Rating summary: 4.5/5 average from 1,284 reviews with a 5→1 star distribution (872 / 254 / 89 / 38 / 31).
- Review cards with name/initials, stars, date, title, body and a **Verified** badge (`aria-label="Verified purchase"`).
- Client-side sort (newest / highest / lowest), "Verified only" filter, reset and a no-results state.
- JSON-LD `aggregateRating` (`4.5`, `1284` reviews, best 5, worst 1) matches the visible numbers.
- The editorial score (**/10**, cyan ring, "Editorial score") is labelled and styled separately from the reader rating (**/5**, amber stars, "Reader rating").
- Demo reviews only; the verification badges are placeholders.

### Pros & cons breakdown
- `review-detail.html`: pros/cons grouped by Display, Performance, Battery, Camera, Build & value, using equal-height blocks. The verdict box follows directly after.
- `reviews.html`: each hub card shows the top 2 pros and top 1 con.

### Affiliate link tracking
Every "Check price" button (reviews hub cards, feature matrix headers, review detail verdict, home matchmaker result) follows this scheme:

```html
<!-- AFFILIATE_LINK -->
<a href="https://merchant.example/product?utm_source=voltwise&utm_medium=affiliate&utm_campaign=[page]&utm_content=[product-slug]"
   rel="sponsored noopener" target="_blank"
   data-affiliate="true"
   data-product-id="[product-slug]"
   data-merchant="[merchant-name]"
   data-placement="[hero|card|matrix|detail|sticky]">Check price</a>
```

| Parameter | Convention |
|---|---|
| `utm_source` | always `voltwise` |
| `utm_medium` | always `affiliate` |
| `utm_campaign` | page: `home`, `reviews`, `compare`, `review-detail` |
| `utm_content` | product slug, e.g. `titanium-pro-max` |
| `data-placement` | `card` (hub cards, matchmaker), `matrix` (matrix headers), `detail` (review verdict); `hero` and `sticky` are reserved |

- `main.js` has one delegated click listener for `a[data-affiliate="true"]`, so links rendered later by JS (matrix, matchmaker) are tracked too. It pushes `{ event: 'affiliate_click', product_id, merchant, placement, page, link_url }` to `window.dataLayer`, which is initialised defensively. Replace the `<!-- GA_TAG -->` placeholder in each page's `<head>` with your analytics snippet.
- A disclosure line sits next to each cluster of Check price buttons (one above the matrix, one above the hub grid), and the footer disclosure is unchanged.

### Copy
- `index.html` and `services.html` now describe the feature matrix, verified reviews and pros & cons breakdown. Benchmark score bars are no longer marketed as a headline feature; they remain on `review-detail.html`.

## Setup
No build step required. Just serve the directory via any static web server (e.g., Live Server, `npx serve`, Python `http.server`).

## Assets
- `assets/css/style.css`: design tokens and all components
- `assets/js/main.js`: nav, scroll reveal, card spotlight, count-ups, form validation
- `assets/js/matchmaker.js`: Device Matchmaker data and logic (demo data)
- `assets/js/compare.js`: feature matrix data and logic (demo data)
- `assets/js/reviews.js`: reader review sorting/filtering and rating distribution bars
- `assets/js/filters.js`: reviews hub filtering
- Typography: Outfit (headings), Manrope (body), JetBrains Mono (data/numerals).
- Icons: Phosphor Icons (CDN)
- Images: Unsplash (placeholder imagery). All prices and specs are demo data.
