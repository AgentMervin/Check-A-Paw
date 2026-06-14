# Check-A-Paw · Foundry IQ API

A minimal **Azure Functions** proxy that satisfies the hackathon's Microsoft IQ
requirement by integrating **Foundry IQ** (Azure AI Foundry). It grounds a
compliance question in your Foundry IQ knowledge base and returns the answer
plus source citations.

The browser **never** sees an API key — all secrets live in the Function's app
settings (`local.settings.json` for dev).

```
Browser PWA  ──POST /api/complianceGround──▶  Azure Function
                                               │
                                               ├─▶ Azure OpenAI (chat)
                                               └─▶ Foundry IQ knowledge base
                                                   (Azure AI Search index)
```

## Files

| File | Purpose |
|------|---------|
| `src/functions/complianceGround.js` | HTTP-triggered function (Node v4 model). |
| `local.settings.json` | Dev-only secrets/config. **Git-ignored.** |
| `host.json` | Functions host config. |
| `package.json` | Dependencies (`@azure/functions`). |

## Setup

1. **Install the tools** (once):
   ```bash
   npm i -g azure-functions-core-tools@4 --unsafe-perm true
   ```

2. **Install dependencies:**
   ```bash
   cd api
   npm install
   ```

3. **Fill in `local.settings.json`** — each key has a `//`-prefixed comment
   explaining it:

   | Setting | What it is |
   |---------|------------|
   | `FOUNDRY_PROJECT_ENDPOINT` | Your Azure AI Foundry project endpoint. |
   | `KNOWLEDGE_BASE_NAME` | The Foundry IQ knowledge base / Azure AI Search index name. |
   | `AZURE_OPENAI_ENDPOINT` | Your Azure OpenAI resource endpoint. |
   | `AZURE_OPENAI_DEPLOYMENT` | Chat deployment name (e.g. `gpt-4o-mini`). |
   | `AZURE_OPENAI_API_KEY` | Azure OpenAI key (server-side secret). |
   | `AZURE_SEARCH_ENDPOINT` | Azure AI Search endpoint (the engine behind Foundry IQ). |
   | `AZURE_SEARCH_API_KEY` | Azure AI Search query key (server-side secret). |

4. **Run the function:**
   ```bash
   func start
   ```
   It listens on `http://localhost:7071/api/complianceGround`.

## Same-origin demo

The browser calls a relative path (`/api/complianceGround`), so the static site
and the Function must share an origin. Use the bundled proxy from the project
root:

```bash
# Terminal 1 — the Function
cd api && func start

# Terminal 2 — static site + /api proxy, all on one origin
python3 serve.py            # http://localhost:8765
```

`serve.py` serves the PWA and forwards `/api/*` to the Function on `:7071`.

## Request / response

**Request**
```http
POST /api/complianceGround
Content-Type: application/json

{ "query": "Can I track user behavior without consent?" }
```

**Response (200)**
```json
{
  "source": "Foundry IQ",
  "knowledgeBase": "checkapaw-compliance-kb",
  "answer": "…grounded answer…",
  "citations": [{ "title": "GDPR Art. 6", "url": null, "filepath": null }]
}
```

If the settings aren't filled in, the function returns `503` with a
`missingSettings` list, and the PWA falls back to its local dictionary search.

## Production

Set the same keys in the Function App's **Application settings** (Azure Portal
or `az functionapp config appsettings set`) — never in browser code or source
control.
