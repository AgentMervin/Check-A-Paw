'use strict';

// ════════════════════════════════════════════════════════════
// Check-A-Paw — COMPLIANCE DICTIONARY DATA
//
// This file holds the data that drives the compliance scanner:
//   • WEIGHT_DICTIONARIES — role-aware keyword → severity/reason map
//   • SUGGESTIONS         — creative & conservative rewrite options
//
// It is loaded BEFORE the main inline <script> in index.html. Both
// constants are declared at the top level of a classic (non-module)
// script, so they live in the shared global lexical scope and are
// directly accessible from the application logic in index.html.
//
// Keeping the dictionary data here lets us tune, extend, or swap the
// rule set without touching the application code.
// ════════════════════════════════════════════════════════════


// ──────────────────────────────────────────────────────────
// WEIGHTED CONTEXTUAL DICTIONARIES
//
// This object is the heart of Optimization 1. Each role maps keyword
// phrases to an object with:
//   - severity: "red" (critical) or "yellow" (contextual warning)
//   - reason: plain-language legal/policy rationale shown to humans
//
// IMPORTANT: The required canonical entries requested by product are
// preserved exactly and can be safely extended with realistic extras.
// ──────────────────────────────────────────────────────────
const ENRICHED_COMPLIANCE_DICTIONARY = {
  // Scenario/Role Level
  product_manager: {
    // The Flagged Keyword
    "track user behavior": { 
      severity: "Red", 
      code: "GDPR-ART-6-BREACH",
      topic: "Data Privacy & Governance",
      verticals: ["SaaS", "E-commerce", "FinTech"],
      
      // Deep Knowledge Context
      short_description: "Unlawful processing of persistent personal identifier data without an explicit opt-in mechanism.",
      legal_brief: "Under GDPR Article 6, lawful basis for tracking requires unambiguous, freely given consent. Passive tracking via cookies or background session logs without active user acknowledgment exposes the organization to tier-2 administrative fines (up to €20m or 4% of global turnover).",
      
      // Multi-Option Text Rewrites (For the Delivery Page)
      alternatives: {
        creative: "optimize user experience journeys using aggregated analytics",
        conservative: "analyze non-identifiable, system-level usage metrics upon receiving explicit user authorization",
        check_a_paw: "safely map out our users' digital adventures while keeping their privacy boundaries locked up tight 🐾"
      },

      // Human-in-the-Loop Override Prompts (For the Whitelist Step)
      mitigation_strategies: [
        "Implement a clear Opt-In Cookie Consent Banner prior to script execution.",
        "Anonymize IP addresses and strip personally identifiable information (PII) before storage.",
        "Document an active Data Protection Impact Assessment (DPIA) for this product feature."
      ]
    }
  }
};

const WEIGHT_DICTIONARIES = {
  marketing: {
    'miracle':             { severity: 'red',    reason: 'Unverified health/performance claim' },
    'best in class':       { severity: 'red',    reason: 'FTC compliance violation regarding unsubstantiated superlatives' },
    'cheapest':            { severity: 'red',    reason: 'FTC compliance violation regarding unsubstantiated superlatives' },
    '100% guaranteed':     { severity: 'red',    reason: 'Deceptive commercial practice risk under consumer protection law' },
    'risk-free':           { severity: 'red',    reason: 'Deceptive commercial practice risk under consumer protection law' },
    'officially certified':{ severity: 'yellow', reason: 'Requires strict institutional credentials.' },
    'government approved': { severity: 'yellow', reason: 'Requires strict institutional credentials.' },
    'top-tier':            { severity: 'yellow', reason: 'Requires verifiable benchmarks for comparative advertising.' }
  },
  pm: {
    'track user behavior': { severity: 'red',    reason: 'GDPR Article 6 Non-compliance' },
    'without consent':     { severity: 'red',    reason: 'CCPA opt-out workflow breach' },
    'save credentials':    { severity: 'red',    reason: 'Critical OWASP data security vulnerability' },
    'track user location': { severity: 'yellow', reason: 'Location data collection requires explicit opt-in and retention policy.' },
    'instant loading':     { severity: 'yellow', reason: 'Unrealistic technical SLA commitment in PRDs.' }
  },
  policy: {
    'massive crackdown':   { severity: 'red',    reason: 'Aggressive public relations phrasing; highly sensitive tone' },
    'regime\'s propaganda':{ severity: 'red',    reason: 'Inflammatory geopolitical stance; major corporate neutrality risk' },
    'total ban':           { severity: 'red',    reason: 'Extreme qualitative language lacking diplomatic ambiguity' },
    'completely overhaul': { severity: 'yellow', reason: 'Unstable, hostile corporate tone for public memos.' },
    'destroy market competitors': { severity: 'yellow', reason: 'Unstable, hostile corporate tone for public memos.' }
  }
};


// ──────────────────────────────────────────────────────────
// SUGGESTIONS MAP
//
// Provides creative (engagement-optimised) and conservative
// (legally-safe) alternatives for each flagged keyword.
// A generic '_fallback' entry is used when no specific match exists.
// ──────────────────────────────────────────────────────────

const SUGGESTIONS = {

  /* ---- Marketing ---------------------------------------- */
  'best': {
    creative:     'among the top-rated',
    conservative: 'highly regarded in independent evaluations'
  },
  'fastest': {
    creative:     'exceptionally quick',
    conservative: 'designed for high-speed performance'
  },
  '100% guaranteed': {
    creative:     'backed by our satisfaction commitment',
    conservative: 'subject to our terms-based satisfaction policy'
  },
  'miracle': {
    creative:     'remarkably effective',
    conservative: 'clinically-informed, evidence-based solution'
  },
  'risk-free': {
    creative:     'worry-free trial available',
    conservative: 'subject to stated return-policy conditions'
  },
  'cheapest': {
    creative:     'exceptional value for money',
    conservative: 'competitively priced within market benchmarks'
  },
  'unbeatable': {
    creative:     'outstanding, hard-to-match value',
    conservative: 'subject to comparative market analysis'
  },
  'best in class': {
    creative:     'a leading option in its category',
    conservative: 'independently benchmarked within its segment'
  },
  'number one': {
    creative:     'a top-performing option',
    conservative: 'among the leading providers as measured by [source]'
  },
  'number 1': {
    creative:     'a top-performing option',
    conservative: 'among the leading providers as measured by [source]'
  },
  'overnight results': {
    creative:     'rapid, noticeable results',
    conservative: 'results may vary; see clinical data for timelines'
  },

  /* ---- Product Manager ---------------------------------- */
  'track user': {
    creative:     'analyse engagement patterns',
    conservative: 'collect anonymised interaction data with user consent'
  },
  'track user behavior': {
    creative:     'analyse engagement patterns with transparent permissions',
    conservative: 'collect behavioural analytics only with explicit lawful consent'
  },
  'sell data': {
    creative:     'share anonymised insights with trusted partners',
    conservative: 'transfer de-identified aggregate data to authorised third parties under Data Processing Agreements'
  },
  'without consent': {
    creative:     'with streamlined, one-tap permissions',
    conservative: 'only upon obtaining explicit informed consent per applicable privacy regulations'
  },
  'location tracking': {
    creative:     'location-based personalisation (opt-in)',
    conservative: 'geolocation services activated only with explicit opt-in consent'
  },
  'save credentials': {
    creative:     'enable secure remembered login',
    conservative: 'store authentication tokens using industry-standard encryption'
  },
  'collect data': {
    creative:     'gather usage insights',
    conservative: 'process personal data in accordance with our Privacy Policy and applicable law'
  },
  'monitor': {
    creative:     'review for quality assurance',
    conservative: 'conduct audited oversight with documented justification'
  },
  'harvest data': {
    creative:     'aggregate platform signals',
    conservative: 'collect data under explicit consent and data-minimisation principles'
  },

  /* ---- Policy ------------------------------------------- */
  'regime': {
    creative:     'administration',
    conservative: 'governing authority'
  },
  'propaganda': {
    creative:     'messaging campaign',
    conservative: 'official communications'
  },
  'regime\'s propaganda': {
    creative:     'state messaging campaign',
    conservative: 'government communications narrative'
  },
  'censorship': {
    creative:     'content moderation',
    conservative: 'regulated content governance framework'
  },
  'total ban': {
    creative:     'comprehensive restriction',
    conservative: 'regulatory prohibition subject to due process'
  },
  'absolute ban': {
    creative:     'blanket restriction',
    conservative: 'unconditional regulatory prohibition'
  },
  'massive crackdown': {
    creative:     'significant enforcement initiative',
    conservative: 'structured enforcement measures'
  },
  'extremist': {
    creative:     'fringe',
    conservative: 'individuals holding views outside established norms'
  },
  'radical': {
    creative:     'unconventional',
    conservative: 'non-mainstream'
  },

  /* ---- Shared base --------------------------------------- */
  'fraud': {
    creative:     'deceptive conduct',
    conservative: 'conduct prohibited under applicable fraud statutes'
  },
  'illegal': {
    creative:     'non-compliant',
    conservative: 'in violation of applicable laws and regulations'
  },

  /* ---- Generic fallback (used when no specific entry exists) */
  '_fallback': {
    creative:     '[consider a more nuanced creative alternative]',
    conservative: '[consult legal counsel for compliant phrasing]'
  }
};
