# 🐾 Check-A-Paw — AI Compliance Workspace

**Check-A-Paw** is a self-contained, browser-based AI compliance workspace that helps Marketing, Product, and Policy teams review documents for risky language before they go public. It wraps a strict keyword-flagging engine in a playful, anime-inspired interface guided by a reactive Shiba Inu auditor.

## Features

- **Multi-Role Compliance Scanning** — Switch between Marketing, Product Manager, and Policy dictionaries to flag role-specific risks in one click.
- **Two-Tier Risk Highlighting** — Critical breaches (🔴 red) and tone/context warnings (🟡 yellow) are highlighted inline so problems are immediately visible.
- **Smart Recommendations** — Hover any flagged word to see a Creative alternative (conversion-optimised) and a Conservative alternative (legally bulletproof).
- **Human-in-the-Loop Override** — Approve context-specific exceptions: the word turns green, the counter updates, and the in-memory whitelist prevents re-flagging on future scans.
- **Side-by-Side Purification** — Generate and compare your original text against the cleansed version, choosing Creative or Conservative replacement style.
- **One-Click Copy** — Copy the safe version to your clipboard with a Check-A-Paw Approval Badge toast.
- **Shiba Inu State Machine** — A delightful anime pup avatar guides you through every phase with contextual dialogue.

## How to Run

1. **Clone or download** this repository.
2. **Double-click `index.html`** — it opens in any modern browser with no build step, no server, and no dependencies to install.
   - All assets (Tailwind CSS) are loaded via CDN, so an internet connection is required on first load.
3. Select a **Role Tag** (Marketing / Product Manager / Policy), then click **🐾 Sniff Out Risks** to scan the sample text.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Markup | HTML5 |
| Styles | [Tailwind CSS 2.2.19](https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css) via CDN |
| Logic | Vanilla JavaScript (ES6+) — no frameworks |
| Delivery | Single self-contained `index.html` |

## Workflow Phases

| Phase | Description |
|-------|-------------|
| **1 — Ingestion & Context Filtering** | Choose your role tag to activate the right compliance dictionary. |
| **2 — Context-Aware Inspection** | The engine scans your text and highlights every flagged keyword by severity tier. |
| **3 — Rectification & HITL Feedback** | Hover flagged words for Creative/Conservative suggestions, or override to whitelist. |
| **4 — Final Synthesis & Safe Generation** | Purify the document, compare side-by-side, and copy the clean version for legal hand-off. |