# Project Rules

1. This is a mobile-first static H5 built with Vue 3, Vite, and TypeScript.
2. Do not add a backend, database, authentication, analytics SDK, or AI API.
3. Do not add Pinia, a large UI framework, chart library, animation framework, Tailwind, SSR, or Nuxt.
4. Business logic in `src/core` must remain pure TypeScript and must not access the DOM, browser storage, the network, the current time, or true randomness.
5. Tools, scores, labels, titles, and verdicts must be configuration-driven.
6. Use SVG for the in-page radar chart and Canvas for the share image.
7. Vue Router must use hash history.
8. Run `npm run typecheck`, `npm run test`, and `npm run build` after every functional change.
9. Do not modify scoring or title rules without updating tests and documentation.
10. Do not replace existing Chinese copy unless the task explicitly requests it.
11. Keep the mobile UI usable from 320px to 430px; constrain the centered desktop container to 520px.
12. Never silently ignore malformed shared-result parameters.
13. Preserve deterministic output: the same tools and captain must produce the same result.
14. Treat the v1.0 frozen decisions in `docs/PRODUCT_SPEC.md` as the product baseline.

