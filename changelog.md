## [2026-06-12 07:58] — frontend mode
- Fixed /about page rendering on client-side navigation: replaced window.matchMedia() in PageTransition render with useReducedMotion hook; removed clipPath from page variants (opacity-only transition) to prevent IntersectionObserver interference with BioSection/Timeline useInView
- Added 2.5D scene tokens to lib/animations.ts (layerScrollSpeeds, layerZDepths, layerScales, scenePerspective, floatingCardConfigs, tiltOnScrollVariants)
- Created lib/scene-layers.ts — 6 inline SVG strings (mountains, clouds, waves, pine, petals, seal) for dark-mode-aware inlined SVGs
- Created SceneContainer — CSS 3D perspective wrapper with container-scoped mouse tracking and scroll tracking
- Created SceneLayer — individual SVG layer at translateZ depth with scroll-driven translateY
- Created FloatingArtworkCard — kakejiku-styled floating card with sinusoidal drift and mouse tilt
- Refactored HeroParallax — abstract CSS gradients replaced with SceneContainer + 6× SceneLayer + 5× FloatingArtworkCard
- Added tiltOnScroll prop to KakejikuCard — rotateX tilt-on-scroll-into-view variant
- Build: 0 errors, 62/62 tests passing
- Files touched: components/PageTransition.tsx, lib/animations.ts, lib/scene-layers.ts, components/SceneContainer.tsx, components/SceneLayer.tsx, components/FloatingArtworkCard.tsx, components/HeroParallax.tsx, components/KakejikuCard.tsx
- Suggested next: testing mode — because components are updated and need visual and integration test coverage

## [2026-06-12 08:45] — frontend mode
- Fixed text contrast issues across the site — systemic problem where `text-mist/60`, `text-sumi/80`, and `text-sumi/70` Tailwind opacity classes reduced contrast below readable levels:
  - **Lightbox.tsx**: attribution `text-mist/60`→`text-mist` (2.3:1 → 4.8:1 WCAG AA), description `text-sumi/80`→`text-sumi`
  - **HeroParallax.tsx**: strengthened title backdrop from 30%→50% washi opacity at center, added 10% at 60% radius guard ring, expanded coverage (w-[90%]→w-[95%], aspect-[3/2]→[4/3])
  - **app/page.tsx**: artist bio `text-sumi/80`→`text-sumi`, series descriptions `text-sumi/70`→`text-sumi`
  - **app/about/page.tsx**: credits `text-mist/60`→`text-mist`
  - **ContactForm.tsx**: success message `text-sumi/80`→`text-sumi`
  - **Timeline.tsx**: event text `text-sumi/80`→`text-sumi`
  - **BioSection.tsx**: bio text `text-sumi/80`→`text-sumi`
- Build: 0 errors
- Files touched: components/Lightbox.tsx, components/HeroParallax.tsx, app/page.tsx, app/about/page.tsx, components/ContactForm.tsx, components/Timeline.tsx, components/BioSection.tsx
- Suggested next: testing mode — verify lightbox and hero contrast in both light/dark themes via browser testing

## [2026-06-12 08:55] — frontend mode
- Added lightbox to homepage "Featured Masterworks" grid: HomePage is a Server Component, so created new `HomeGalleryClient` Client Component (`components/HomeGalleryClient.tsx`) to manage lightbox open/close/prev/next state — same GalleryMasonry pattern as the /work page
- Homepage KakejikuCards now pass `onOpen` prop; clicking a card opens the full Lightbox with navigation between the 5 featured grid artworks
- Build: 0 errors
- Files touched: components/HomeGalleryClient.tsx (new), app/page.tsx
- Suggested next: testing mode — verify lightbox on homepage works in both light/dark themes

## [2026-06-12 09:00] — frontend mode
- **Second pass contrast fix**: Lightbox metadata text (series/year, JP title, counter, attribution) changed from `text-mist` to `text-sumi` — contrast improved from 4.8:1 to 10.9:1 (light) / 13.7:1 (dark) for full readability
- **Hero title backdrop** strengthened: washi opacity center 50%→85%, mid 25%→50%, added 20% guard at 60%. Blur reduced 40px→30px for tighter contrast shield. Subtitle and scroll label changed from `text-mist` to `text-sumi`
- **Duplicate heading fix**: ContactForm.tsx had its own `<h2>Get in Touch</h2>` that duplicated the one in AboutPageClient.tsx — removed from ContactForm
- Build: 0 errors
- Files touched: components/Lightbox.tsx, components/HeroParallax.tsx, components/ContactForm.tsx
- Suggested next: testing mode — verify all fixes in browser for both light/dark themes
