# Personal Portfolio — Aalok Barnawal

A personal portfolio website designed for **Aalok Barnawal** — Graphic Designer & Front-End Developer, showcasing visual identities, graphic design projects, and modern web experiences.

---

## 📁 Project Structure

```
.
├── css/
│   ├── style.css             # Main stylesheet (tokens, animations, components, responsive layout)
│   ├── 404.css               # Dedicated stylesheet for the 404 error page
│   └── admin.css             # Admin dashboard stylesheet (dark glassmorphism, responsive grid)
├── js/
│   ├── main.js               # Dynamic Firestore hydration, typewriter, counters, preloader, form
│   ├── firebase-config.js    # Firebase Firestore SDK initialization & Cloudinary service layer
│   ├── admin.js              # CMS dashboard logic (auth, form binding, Cloudinary upload)
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
├── index.html                # Main portfolio single-page application (Firestore-hydrated)
├── cms.html                  # CMS Dashboard for content management & image uploads
├── 404.html                  # Custom 404 error page
├── _redirects                # Netlify / Cloudflare routing (/cms rewrite & 404 fallback)
└── README.md                 # Project documentation
```

---

## ⚡ CMS Dashboard & Dynamic Content

The portfolio includes a built-in **CMS Dashboard** (`https://aalokbarnawal.com.np/cms` / `cms.html`) backed by **Firebase Firestore** and **Cloudinary** for managing editable content without touching code:

- **Hero Section**: Edit Headline lines, manage rotating typewriter role taglines, update hero description, and upload new Hero photographs via Cloudinary.
- **About Me**: Edit section titles, bio lead text, paragraphs, and experience metric counter target values.
- **WHO I AM**: Manage role pills, creative focus, live availability status, and core tools chips.
- **WHAT I DO (Services)**: Add new service cards via Modal, update icons and descriptions, reorder, or delete cards.
- **Skills & Toolkits**: Add/remove skill chips for Design and Development; manage tools marquee icons.
- **Selected Work (Projects)**: Dynamically add projects via Modal with preview image upload (Cloudinary), project name, description, tools used tags, and live links.
- **Contact & Socials**: Update public email, availability status, and social media links.

### Cloudinary Image Upload Setup

Image uploads from the Admin Panel use direct unsigned uploads to keep the API Secret safe from client-side exposure:

1. In your [Cloudinary Dashboard](https://cloudinary.com/console) (`tqwlcy09`), go to **Settings > Upload > Upload Presets**.
2. Click **Add upload preset**.
3. Set **Upload preset name** to `portfolio_uploads` and **Signing Mode** to `Unsigned`.
4. Click **Save**.

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
  - High-impact headline: _"Crafting Visuals That Resonate."_
  - **Typewriter Effect**: Character-by-character rotating tagline cycling through designer roles (_Graphic Designer_, _Front-End Developer_, _Brand Identity Creator_, _Visual Storyteller_, _Creative Thinker_).
  - 3D perspective mouse tilt on hero portrait card and parallax motion on floating geometric shapes.
  - Animated scroll-down indicator.
- **About Me**:
  - Top-aligned 2-column layout balancing headline, narrative bio, and paired metric cards.
  - **Metric Stat Cards**: Scroll-triggered animated counters for _Years Experience_ and _Projects Completed_.
  - **Creative Profile Card ("Who I Am")**: Interactive glass showcase with icon badges, role pills (_Graphic Designer_, _Front-End Developer_), live active status indicator, and interactive tool tags (_Figma_, _Photoshop_, _Illustrator_).
- **Services**: Glass cards with FontAwesome icons, ambient hover glow, and 3D lift.
- **Skills & Tools Marquee**: Categorized into _Design_ and _Development_ toolkits, paired with an infinite auto-scrolling brand ticker.
- **Selected Work**: Curated 2×2 project grid featuring realistic mockups, category pills, light-sweep shine animations, 3D mouse tilt, and _"View Project ↗"_ glass overlays.
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
