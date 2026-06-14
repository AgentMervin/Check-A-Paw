// ═══════════════════════════════════════════════════════════════════════════
//  Check-A-Paw · Foundry IQ grounding proxy
//  ---------------------------------------------------------------------------
//  Microsoft IQ intelligence layer: FOUNDRY IQ (Azure AI Foundry).
//
//  The browser NEVER sees an API key. The PWA POSTs a compliance question here,
//  and this function asks Azure OpenAI to answer it *grounded in the Foundry IQ
//  knowledge base* (the managed Azure AI Search index behind Foundry IQ) using
//  the "On Your Data" retrieval-augmented-generation pattern. The model can only
//  answer from the knowledge base, and returns citations to the source docs.
//
//  All endpoints/keys come from app settings (local.settings.json for dev).
// ═══════════════════════════════════════════════════════════════════════════
'use strict';

const { app } = require('@azure/functions');

const SYSTEM_PROMPT = [
  'You are Check-A-Paw, an AI compliance reviewer for product, marketing and policy teams.',
  'Answer ONLY from the retrieved Foundry IQ knowledge base passages.',
  'For each compliance risk, name the regulation/article and give one concrete, safer rewrite.',
  'If the knowledge base does not cover the question, say so plainly. Never invent regulations.'
].join(' ');

app.http('complianceGround', {
  methods: ['POST'],
  authLevel: 'anonymous',
  handler: async (request, context) => {
    let body;
    try {
      body = await request.json();
    } catch {
      return json(400, { error: 'Request body must be JSON: { "query": "..." }' });
    }

    const query = (body && typeof body.query === 'string') ? body.query.trim() : '';
    if (!query) {
      return json(400, { error: 'Missing "query" string in request body.' });
    }

    const cfg = readConfig();
    if (cfg.missing.length) {
      // Graceful, explicit failure so the front-end can fall back to the local scan.
      return json(503, {
        error: 'Foundry IQ is not configured yet.',
        missingSettings: cfg.missing,
        hint: 'Fill these in api/local.settings.json (dev) or the Function App settings (prod).'
      });
    }

    const url = `${trimSlash(cfg.openAiEndpoint)}/openai/deployments/${cfg.deployment}` +
      `/chat/completions?api-version=2024-10-21`;

    const payload = {
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: query }
      ],
      temperature: 0.2,
      max_tokens: 800,
      // ── Foundry IQ retrieval layer: ground answers in the knowledge base ──
      data_sources: [
        {
          type: 'azure_search',
          parameters: {
            endpoint: cfg.searchEndpoint,
            index_name: cfg.knowledgeBase,
            authentication: { type: 'api_key', key: cfg.searchApiKey },
            in_scope: true,
            top_n_documents: 5,
            query_type: 'simple'
          }
        }
      ]
    };

    let upstream;
    try {
      upstream = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': cfg.openAiApiKey
        },
        body: JSON.stringify(payload)
      });
    } catch (err) {
      context.error('Foundry IQ request failed', err);
      return json(502, { error: 'Could not reach Foundry IQ / Azure OpenAI.' });
    }

    if (!upstream.ok) {
      const detail = await safeText(upstream);
      context.error('Foundry IQ returned an error', upstream.status, detail);
      return json(502, { error: 'Foundry IQ returned an error.', status: upstream.status });
    }

    const data = await upstream.json();
    const message = data?.choices?.[0]?.message ?? {};
    const answer = message.content || 'No grounded answer was returned.';
    const citations = (message.context?.citations || []).map((c) => ({
      title: c.title || null,
      content: c.content || null,
      url: c.url || null,
      filepath: c.filepath || null
    }));

    return json(200, {
      source: 'Foundry IQ',
      knowledgeBase: cfg.knowledgeBase,
      answer,
      citations
    });
  }
});

// ── helpers ────────────────────────────────────────────────────────────────
function readConfig() {
  const get = (k) => (process.env[k] || '').trim();
  const cfg = {
    openAiEndpoint: get('AZURE_OPENAI_ENDPOINT'),
    deployment: get('AZURE_OPENAI_DEPLOYMENT'),
    openAiApiKey: get('AZURE_OPENAI_API_KEY'),
    searchEndpoint: get('AZURE_SEARCH_ENDPOINT'),
    searchApiKey: get('AZURE_SEARCH_API_KEY'),
    knowledgeBase: get('KNOWLEDGE_BASE_NAME')
  };
  const required = {
    AZURE_OPENAI_ENDPOINT: cfg.openAiEndpoint,
    AZURE_OPENAI_DEPLOYMENT: cfg.deployment,
    AZURE_OPENAI_API_KEY: cfg.openAiApiKey,
    AZURE_SEARCH_ENDPOINT: cfg.searchEndpoint,
    AZURE_SEARCH_API_KEY: cfg.searchApiKey,
    KNOWLEDGE_BASE_NAME: cfg.knowledgeBase
  };
  cfg.missing = Object.keys(required).filter((k) => !required[k]);
  return cfg;
}

function trimSlash(s) {
  return s.replace(/\/+$/, '');
}

async function safeText(res) {
  try { return await res.text(); } catch { return ''; }
}

function json(status, obj) {
  return {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    jsonBody: obj
  };
}
