# 🐾 Check-A-Paw — AI Compliance Workspace

**Check-A-Paw** is a self-contained, browser-based AI compliance workspace that helps Marketing, Product, and Policy teams review documents for risky language before they go public. It wraps a strict keyword-flagging engine in a playful, anime-inspired interface guided by a reactive Shiba Inu auditor.

## Features

- **Weighted Role Dictionaries (`WEIGHT_DICTIONARIES`)** — Each role keyword includes severity (`red` / `yellow`) and human-readable legal/policy reasons.
- **Two-Tier Risk Highlighting with Traceable IDs** — Every flagged match is wrapped with a unique `data-id`, plus `data-keyword` / `data-severity` metadata.
- **Smart Recommendations + Reasoning** — Hover or click any flagged word to see severity status, legal/policy rationale, and Creative/Conservative alternatives.
- **Immersive Human-in-the-Loop Override** — Click/hover any flagged token to open a regulatory-card popover and apply `[🐾 Override & Ingest to Whitelist]`.
- **Phase 3 Remediation Matrix** — Live toggle pills let reviewers whitelist or restore flagged items while counters stay synchronized.
- **3-Path AI Optimization Generator** — `【✨ Optimize & Polish Document】` produces parallel Creative, Conservative, and Check-A-Paw delivery variants.
- **Independent Copy Per Variant** — Each optimization tab has its own copy button with `✅ Copied!` success state.
- **Shiba Inu State Machine** — A delightful anime pup avatar guides you through every phase with contextual dialogue.

## How to Run

1. **Clone or download** this repository.
2. **Double-click `index.html`** — it opens in any modern browser with no build step, no server, and no dependencies to install.
   - All assets (Tailwind CSS) are loaded via CDN, so an internet connection is required on first load.
3. Select a **Role Tag** (Marketing / Product Manager / Policy), then click **🐾 Sniff Out Risks**.
4. Review highlights, use **[Ignore & Whitelist 🐾]** where needed, then click **【✨ Optimize & Polish Document】**.

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
| **3 — Rectification & HITL Feedback** | Use the remediation matrix and inline cards to whitelist/restore each flagged item in real time. |
| **4 — Final Synthesis & Safe Generation** | Generate three parallel safe paths (Creative / Conservative / Check-A-Paw) with independent copy actions. |