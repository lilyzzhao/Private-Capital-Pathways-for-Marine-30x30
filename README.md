# Marine 30×30 · Private Capital Pathway Explorer

An interactive tool for exploring private capital pathways for marine protected area finance, developed as part of the STRI–WEF Marine 30×30 initiative.

## Architecture

```
marine30x30/
├── src/
│   ├── config.js              ← SHEET URL + taxonomy constants
│   ├── hooks/usePathways.js   ← fetches & parses Google Sheets CSV
│   ├── App.jsx                ← UI (filtering, layout, cards)
│   └── main.jsx               ← entry point
├── index.html
├── package.json
└── vite.config.js
```

**Data flow:** Google Sheet → published as CSV → fetched on page load by `usePathways.js` → parsed by PapaParse → rendered by `App.jsx`.  
Taxonomy constants (actor types, conditions, etc.) live in `config.js` and drive the filter UI.

---

## Step 1 — Set up your Google Sheet

### Sheet structure
Create a Google Sheet with these **exact column headers in row 1**:

| id | name | actors | enablingConditions | incentives | barriers | financed | summary | examples |
|----|------|--------|--------------------|------------|----------|----------|---------|---------|

### Multi-value columns
For columns that hold multiple values (`actors`, `enablingConditions`, `incentives`, `barriers`), separate values with a **semicolon**:

```
Financial institutions; Impact investors
```

### Allowed values

**actors** — must be one or more of:
- Financial institutions
- Extractive & infrastructure
- Tourism & hospitality
- Corporations (voluntary)
- Impact investors
- Other partners

**financed** — must be exactly one of:
- Full management stack
- Operations
- Restoration
- Monitoring & technology
- Business development

**enablingConditions / incentives / barriers** — see `src/config.js` for the full allowed lists. Values must match exactly (spelling, capitalisation, ampersands).

---

## Step 2 — Publish the sheet as CSV

1. File → Share → **Publish to web**
2. Select **Entire document** and **Comma-separated values (.csv)**
3. Click **Publish** → copy the URL
4. Open `src/config.js` and paste the URL as `SHEET_CSV_URL`

The URL looks like:
```
https://docs.google.com/spreadsheets/d/e/XXXXX/pub?output=csv
```

---

## Step 3 — Local development

```bash
npm install
npm run dev
```
Open http://localhost:5173

---

## Step 4 — Deploy to Netlify via GitHub

### First deployment
1. Push this repo to GitHub
2. Go to [netlify.com](https://netlify.com) → **Add new site → Import from Git**
3. Connect your GitHub repo
4. Set **build command:** `npm run build`
5. Set **publish directory:** `dist`
6. Click Deploy

### Ongoing updates
- **Pathway content changes:** edit the Google Sheet directly — live on next page load, no redeploy needed
- **Taxonomy or UI changes:** edit `config.js` or `App.jsx`, push to GitHub → Netlify auto-redeploys

---

## Updating taxonomy values

If you add a new enabling condition, barrier, incentive, or actor type:
1. Add it to the relevant array in `src/config.js`
2. Use the exact same string in the Google Sheet
3. Push to GitHub — Netlify redeploys automatically

---

## Built with

- [React 18](https://react.dev)
- [Vite](https://vitejs.dev)
- [PapaParse](https://www.papaparse.com/) — CSV parsing
- Data: Google Sheets (published as CSV)

