// ── GOOGLE SHEETS CONFIGURATION ──────────────────────────────────────────────
//
// 1. Open your Google Sheet
// 2. File → Share → Publish to web
// 3. Choose "Entire document" and "Comma-separated values (.csv)"
// 4. Click Publish, copy the URL
// 5. Paste it below as SHEET_CSV_URL
//
// The published CSV URL looks like:
// https://docs.google.com/spreadsheets/d/e/XXXXX/pub?output=csv
//
// Your sheet must have these exact column headers in row 1:
//   id | name | actors | enablingConditions | incentives | barriers | financed | summary | examples
//
// For multi-value columns (actors, enablingConditions, incentives, barriers)
// separate values with a semicolon: e.g.  Financial institutions; Impact investors

export const SHEET_CSV_URL = "YOUR_PUBLISHED_CSV_URL_HERE";

// ── ALLOWED TAXONOMY VALUES ───────────────────────────────────────────────────
// These drive the filter UI. Values in the sheet must match exactly.

export const ACTOR_TYPES = [
  "Financial institutions",
  "Extractive & infrastructure",
  "Tourism & hospitality",
  "Corporations (voluntary)",
  "Impact investors",
  "Other partners",
];

export const ENABLING_CONDITIONS = [
  "Government political will",
  "Legal conservation framework",
  "Revenue retention mechanism",
  "Long-term tenure security",
  "Verified ecological baseline",
  "Enforcement & monitoring capacity",
  "Corporate nature-positive targets",
  "De-risking instruments available",
  "Market demand / site visitation",
  "Functioning governance structure",
];

export const FINANCED_CATEGORIES = [
  "Full management stack",
  "Operations",
  "Restoration",
  "Monitoring & technology",
  "Business development",
];

export const INCENTIVES = [
  "Regulatory compliance",
  "Reputational / brand benefit",
  "Financial return",
  "Risk reduction",
  "Nature-positive / ESG targets",
  "Long-term resource security",
  "Exclusive access rights",
  "Conservation mission",
];

export const BARRIERS = [
  "Weak enforcement / governance",
  "Revenue leakage to treasury",
  "High transaction costs",
  "Limited scale / accessibility",
  "No financial return",
  "Immature standards / market",
  "Annual funding cycle",
  "Restricted to visible activities",
  "Single revenue stream risk",
  "Additionality concerns",
];
