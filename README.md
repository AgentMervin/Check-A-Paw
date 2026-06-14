# 🐾 Check-A-Paw — AI Compliance Workspace

**Check-A-Paw** is an enterprise-grade AI compliance workspace designed to solve high-risk, high-friction bottlenecks in the modern content and product delivery pipeline. By wrapping rigid, intimidating regulatory boundaries into a delightful, anime/pet-inspired interactive experience, the application bridges the gap between commercial growth aspirations and bulletproof legal safety.

> **Now a responsive, installable PWA!** Check-A-Paw adapts gracefully from large desktops down to phones and can be added to your home screen for a full-screen, native-app experience — no app store required.

## Features

- **Weighted Role Dictionaries (`WEIGHT_DICTIONARIES`)** — Each role keyword includes severity (`red` / `yellow`) and human-readable legal/policy reasons.
- **Two-Tier Risk Highlighting with Traceable IDs** — Every flagged match is wrapped with a unique `data-id`, plus `data-keyword` / `data-severity` metadata.
- **Smart Recommendations + Reasoning** — Hover or click any flagged word to see severity status, legal/policy rationale, and Creative/Conservative alternatives.
- **Immersive Human-in-the-Loop Override** — Click/hover any flagged token to open a regulatory-card popover and apply `[🐾 Override & Ingest to Whitelist]`.
- **Phase 3 Remediation Matrix** — Live toggle pills let reviewers whitelist or restore flagged items while counters stay synchronized.
- **3-Path AI Optimization Generator** — `【✨ Optimize & Polish Document】` produces parallel Creative, Conservative, and Check-A-Paw delivery variants.
- **Independent Copy Per Variant** — Each optimization tab has its own copy button with `✅ Copied!` success state.
- **Shiba Inu State Machine** — A delightful anime pup avatar guides you through every phase with contextual dialogue.
- **Fully Responsive Layout** — Dual-pane dashboard collapses to a single scrollable column on phones; all tap targets meet 44 px minimum.
- **Installable PWA** — Add to home screen on iOS and Android for a full-screen standalone experience.

## How to Run

### Option 1 — Double-click `index.html` (desktop, quick local use)

1. **Clone or download** this repository.
2. **Double-click `index.html`** — it opens in any modern browser with no build step, no server, and no dependencies to install.
   - All assets (Tailwind CSS) are loaded via CDN, so an internet connection is required on first load.
   - ⚠️ **Note:** the service worker and "Install" button are disabled when the file runs over the `file://` protocol. This is expected and the app works perfectly — you just won't get offline caching or "Add to Home Screen" from a local file.
3. Select a **Role Tag** (Marketing / Product Manager / Policy), then click **🐾 Sniff Out Risks**.
4. Review highlights, use **[Override & Ingest to Whitelist 🐾]** where needed, then click **【✨ Optimize & Polish Document】**.

### Option 2 — Serve over HTTPS with GitHub Pages (recommended for the full PWA experience)

Serving over HTTPS unlocks the service worker, offline caching, and the "Install" button.

1. Push this repository to GitHub (if you haven't already).
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select **`master`** (or `main`) branch and **`/ (root)`** folder, then click **Save**.
5. GitHub Pages will publish the app at `https://<your-username>.github.io/<repo-name>/`.
6. Open that URL on desktop or mobile to get:
   - ✅ Offline support (service worker caches core assets)
   - ✅ "Install Check-A-Paw 🐾" button in the header
   - ✅ "Add to Home Screen" prompts on Android/Chrome and iOS/Safari

## Adding to Home Screen

### Android / Chrome
1. Open the GitHub Pages URL in Chrome.
2. Tap the **"Install Check-A-Paw 🐾"** button that appears in the app header, **or** tap the browser menu (⋮) → **Install app**.
3. The app will install and appear on your home screen like a native app.

### iOS / Safari
1. Open the GitHub Pages URL in Safari.
2. Tap the **Share** icon (box with arrow) at the bottom of the screen.
3. Scroll down and tap **Add to Home Screen**.
4. Give it a name (defaults to "Check-A-Paw") and tap **Add**.
5. The app icon will appear on your home screen and launch in full-screen mode.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Markup | HTML5 |
| Styles | [Tailwind CSS 2.2.19](https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css) via CDN |
| Logic | Vanilla JavaScript (ES6+) — no frameworks |
| PWA | Web App Manifest + Service Worker |
| Delivery | Single `index.html` + small PWA support files |

## File Structure

```
index.html               ← Main application (all logic lives here)
manifest.webmanifest     ← PWA manifest (name, icons, theme colours)
service-worker.js        ← Offline caching service worker
icons/
  icon-192.png           ← Standard app icon (192 × 192)
  icon-512.png           ← Standard app icon (512 × 512)
  icon-maskable-512.png  ← Maskable icon for Android adaptive launchers
  apple-touch-icon.png   ← iOS home-screen icon (180 × 180)
```

## Workflow Phases

| Phase | Description |
|-------|-------------|
| **1 — Ingestion & Context Filtering** | Choose your role tag to activate the right compliance dictionary. |
| **2 — Context-Aware Inspection** | The engine scans your text and highlights every flagged keyword by severity tier. |
| **3 — Rectification & HITL Feedback** | Use the remediation matrix and inline cards to whitelist/restore each flagged item in real time. |
| **4 — Final Synthesis & Safe Generation** | Generate three parallel safe paths (Creative / Conservative / Check-A-Paw) with independent copy actions. |
