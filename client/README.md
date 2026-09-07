---
name: Alpine Horizon
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#404944'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#707974'
  outline-variant: '#bfc9c3'
  surface-tint: '#2b6954'
  primary: '#003527'
  on-primary: '#ffffff'
  primary-container: '#064e3b'
  on-primary-container: '#80bea6'
  inverse-primary: '#95d3ba'
  secondary: '#006591'
  on-secondary: '#ffffff'
  secondary-container: '#39b8fd'
  on-secondary-container: '#004666'
  tertiary: '#442800'
  on-tertiary: '#ffffff'
  tertiary-container: '#623c00'
  on-tertiary-container: '#f69f0d'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#b0f0d6'
  primary-fixed-dim: '#95d3ba'
  on-primary-fixed: '#002117'
  on-primary-fixed-variant: '#0b513d'
  secondary-fixed: '#c9e6ff'
  secondary-fixed-dim: '#89ceff'
  on-secondary-fixed: '#001e2f'
  on-secondary-fixed-variant: '#004c6e'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
  text-main: '#1E293B'
  text-muted: '#64748B'
  glass-stroke: rgba(255, 255, 255, 0.4)
  mountain-mist: '#E2E8F0'
typography:
  display-lg:
    fontFamily: Montserrat
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Montserrat
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 42px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Montserrat
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-sm:
    fontFamily: Montserrat
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.08em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 48px
---

## Brand & Style

The design system is engineered to evoke the majestic, serene, and premium essence of Northern Pakistan’s landscapes. It targets high-end travelers seeking both adventure and luxury, blending the ruggedness of the mountains with the sophistication of modern SaaS interfaces.

The aesthetic follows a **Glassmorphic Modern** direction. It utilizes the depth of "Snow White" backgrounds paired with "Deep Mountain Green" to establish authority and trust. Visual interest is generated through semi-transparent layers, backdrop blurs, and organic gradients that mimic the transition from forest to sky. The interface remains breathable and editorial, prioritizing immersive photography and a refined, airy atmosphere.

## Colors

This color palette is inspired by the natural biomes of the Karakoram and Himalayan ranges.

- **Primary (Deep Mountain Green):** Used for primary brand moments, heavy headers, and main calls to action. It conveys stability and the lush valleys.
- **Secondary (Sky Blue):** Used for interactive elements, links, and progress indicators, reflecting the clear high-altitude skies.
- **Accents (Warm Gold):** Reserved for "Premium" tags, star ratings, and subtle highlights that mimic sunlight on peaks.
- **Background (Snow White):** A cool-toned off-white that prevents screen glare and maintains a clean, modern canvas.
- **Text (Dark Charcoal):** High-contrast legibility for body copy and headings, ensuring accessibility against the light background.

Gradients should be used sparingly, primarily as overlays on photography, transitioning from a transparent top to a `primary_color_hex` base to ensure text legibility.

## Typography

The typography strategy balances the geometric, high-fashion impact of **Montserrat** for headings with the extreme legibility and technical precision of **Inter** for UI and body text.

- **Headlines:** Use Montserrat to create a sense of scale. Tracking should be slightly tightened on larger display sizes to maintain a premium "editorial" feel.
- **Body:** Use Inter for all functional text. The line height is generous (1.5x) to ensure content remains readable during long-form destination reading.
- **Labels:** Small labels and metadata should use `label-caps` to create clear hierarchy between structural labels and user content.

## Layout & Spacing

The design system utilizes a **12-column fluid grid** for desktop and a **4-column grid** for mobile. 

- **Vertical Rhythm:** Built on an 8px base unit. Component heights, internal padding, and section margins must always be multiples of 8.
- **White Space:** Heavy use of whitespace is required to separate travel packages and high-resolution imagery. Section blocks should typically have `80px` to `120px` of vertical padding on desktop.
- **Adaptive Rules:** On mobile, margins reduce to `16px` and card layouts stack vertically. On tablet and desktop, the `container-max` ensures content remains legible on ultra-wide displays.

## Elevation & Depth

This design system avoids traditional heavy drop shadows in favor of **Tonal Layers** and **Glassmorphism**.

- **Surface Layers:** The base is `Snow White`. Floating cards use a pure `#FFFFFF` background with a very soft, diffused shadow (`0px 10px 30px rgba(30, 41, 59, 0.05)`).
- **Glassmorphism:** Navigation bars and filter panels should use a backdrop blur of `12px` and a semi-transparent white fill (`rgba(255, 255, 255, 0.7)`). A `1px` solid border using `glass-stroke` must be applied to define the edges.
- **Active States:** Elements being interacted with should "lift" slightly by increasing the shadow spread and reducing the backdrop blur transparency.

## Shapes

The shape language is "Soft-Modern." It uses a consistent `0.5rem` (8px) radius for standard components to maintain a friendly yet professional appearance.

- **Small Components:** Checkboxes and small tags use `4px` (Soft).
- **Cards & Hero Sections:** Use `1rem` (16px) or `1.5rem` (24px) to create a more organic, premium containers for photography.
- **Interactive Elements:** Buttons utilize the standard `8px` radius, unless they are secondary "pill" filters which use the maximum radius.

## Components

- **Buttons:** 
  - *Primary:* Deep Mountain Green fill, white text, subtle `2px` hover lift.
  - *Secondary:* Clear background, Sky Blue border, and text.
- **Cards:** The core of the system. Images must have a `16px` corner radius. Content should be padded by `24px`. Use glassmorphic overlays for price tags or "Quick View" buttons placed over the image.
- **Chips/Badges:** Small, pill-shaped tags for "Trending," "Luxury," or "Eco-friendly" using low-saturation versions of the accent colors with `label-caps` typography.
- **Inputs:** Minimalist style with a `1px` border in `mountain-mist`. On focus, the border transitions to `Sky Blue` with a soft outer glow.
- **Photography:** All imagery should have a consistent cool temperature or high-vibrance natural look. Never use harsh borders around images; let the `rounded-xl` shape define them.
- **Navigation:** A sticky top bar using glassmorphism is mandatory to maintain context while the user scrolls through immersive destination pages.