# Personal Portfolio — Aalok Barnawal

A personal portfolio website designed for **Aalok Barnawal** — Graphic Designer & Front-End Developer, showcasing visual identities, graphic design projects, and modern web experiences.

---

## 📁 Project Structure

```
.
├── css/
│   ├── style.css             # Main stylesheet (tokens, animations, components, responsive layout)
│   └── 404.css               # Dedicated stylesheet for the 404 error page
├── js/
│   ├── main.js               # Interactive features, typewriter, counters, preloader, form
│   └── 404.js                # 3D tilt interaction for 404 artwork
├── fonts/
│   └── Barbra-High.ttf       # Custom BARBRA display font (navbar & footer logo)
├── images/
│   ├── hero-image.webp       # Hero portrait photograph
│   ├── work-brand-identity.png   # Brand Identity project mockup
│   ├── work-web-design.png       # Web Design landing page mockup
│   ├── work-poster-design.png    # Poster / Visual Campaign mockup
│   └── work-social-media.png     # Social Media Design grid mockup
├── favicon/                  # Complete favicon suite & web manifest
│   ├── apple-touch-icon.png
│   ├── favicon-96x96.png
│   ├── favicon.ico
│   ├── favicon.svg
│   └── site.webmanifest
├── index.html                # Main portfolio single-page application
├── 404.html                  # Custom 404 error page
├── commit_msg.txt            # Git commit message record
└── README.md                 # Project documentation
```

---

## 🛠️ Technology Stack

- **Structure**: Semantic HTML5 with modern Open Graph metadata and accessibility attributes.
- **Styling**: Pure Vanilla CSS3 with custom properties (tokens), multi-layer glassmorphism, responsive CSS Grid / Flexbox, and CSS keyframe animations.
- **Interactivity**: Lightweight, modular Vanilla JavaScript (ES6+) with `IntersectionObserver` and `requestAnimationFrame`.
- **Typography**: 
  - **BARBRA** (`Barbra-High.ttf` via `@font-face`) — for the `"Aalok."` logo.
  - **Sora** (Google Fonts) — for bold geometric headings, section numbers, stats, and tags.
  - **Inter** (Google Fonts) — for clean, readable body copy and metadata.
- **Iconography**: FontAwesome 6.5.1 for all UI elements, tool tags, and social icons.
- **Form Handling**: Web3Forms integration for AJAX contact form submission with real-time states.

---

## ✨ Features & Highlights

### 🎨 Visual Identity & Theme
- **Dark Aesthetic**: Deep charcoal (`#080808`) background with ambient gradient glows (`orange`, `pink`, `purple`).
- **Custom Logo**: Styled with the decorative **BARBRA** typeface.
- **Subtle Texture**: SVG noise overlay and interactive cursor glow on fine-pointer devices.
- **Scroll Progress**: 3px gradient progress bar fixed to the top of the viewport.

### 🚀 Interactive Sections
- **Enhanced Preloader**: Dynamic `0% → 100%` numeric counter with gradient progress fill.
- **Navigation**:
  - Sticky glassmorphism header that blurs and adapts on scroll.
  - Real-time active link tracking via `IntersectionObserver`.
  - Mobile hamburger menu with smooth toggle and full-screen backdrop-blur overlay.
- **Hero**:
  - High-impact headline: *"Crafting Visuals That Resonate."*
  - **Typewriter Effect**: Character-by-character rotating tagline cycling through designer roles (*Graphic Designer*, *Front-End Developer*, *Brand Identity Creator*, *Visual Storyteller*, *Creative Thinker*).
  - 3D perspective mouse tilt on hero portrait card and parallax motion on floating geometric shapes.
  - Animated scroll-down indicator.
- **About Me**:
  - Top-aligned 2-column layout balancing headline, narrative bio, and paired metric cards.
  - **Metric Stat Cards**: Scroll-triggered animated counters for *Years Experience* and *Projects Completed*.
  - **Creative Profile Card ("Who I Am")**: Interactive glass showcase with icon badges, role pills (*Graphic Designer*, *Front-End Developer*), live active status indicator, and interactive tool tags (*Figma*, *Photoshop*, *Illustrator*).
- **Services**: Glass cards with FontAwesome icons, ambient hover glow, and 3D lift.
- **Skills & Tools Marquee**: Categorized into *Design* and *Development* toolkits, paired with an infinite auto-scrolling brand ticker.
- **Selected Work**: Curated 2×2 project grid featuring realistic mockups, category pills, light-sweep shine animations, 3D mouse tilt, and *"View Project ↗"* glass overlays.
- **Process Timeline**: Connected 4-step workflow (`01 Discover`, `02 Explore`, `03 Create`, `04 Refine`) with responsive 2-column mobile grid.
- **Contact & Footer**:
  - Web3Forms asynchronous submission with live status feedback.
  - Direct social link badges (Instagram, Behance, GitHub, LinkedIn).
  - Floating back-to-top button and animated heartbeat footer credit.
- **Custom 404 Error Page**: Matching typography, 3D interactive floating card, and quick return CTA buttons.

---

## 💻 Local Development

1. Clone or download the repository:
   ```bash
   git clone https://github.com/aalokbarnawal/Personal-Portfolio.git
   ```
2. Open `index.html` directly in your browser, or launch with a local static server (e.g. Live Server in VS Code):
   ```bash
   npx serve .
   ```

---

## 📄 License & Credits

© 2026 **Aalok Barnawal**. All rights reserved. Designed & built with creativity.