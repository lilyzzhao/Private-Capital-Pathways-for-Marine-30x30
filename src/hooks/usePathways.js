import { useState, useEffect } from "react";
import Papa from "papaparse";
import { SHEET_CSV_URL } from "../config.js";

// Parse a semicolon-separated cell into a trimmed array
// Handles extra whitespace, smart quotes, and BOM characters
const splitCell = (str) => {
  if (!str) return [];
  return str
    .replace(/[\u200B-\u200D\uFEFF]/g, "") // strip zero-width/BOM chars
    .replace(/[""]/g, '"')                  // normalise smart quotes
    .split(";")
    .map(s => s.trim())
    .filter(Boolean);
};

// Normalise a string for comparison — trim and collapse internal whitespace
const norm = (s) => (s || "").replace(/\s+/g, " ").trim();

// Map a raw CSV row to a pathway object
// Row keys are normalised to handle slight header variations
const rowToPathway = (row) => {
  // Normalise all keys in case Google Sheets adds spaces to headers
  const r = {};
  Object.keys(row).forEach(k => { r[norm(k)] = row[k]; });

  return {
    id: Number(r.id),
    name: norm(r.name),
    actors: splitCell(r.actors),
    enablingConditions: splitCell(r.enablingConditions),
    incentives: splitCell(r.incentives),
    barriers: splitCell(r.barriers),
    financed: norm(r.financed),
    summary: norm(r.summary),
    examples: norm(r.examples),
  };
};

export function usePathways() {
  const [pathways, setPathways] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    if (!SHEET_CSV_URL || SHEET_CSV_URL === "YOUR_PUBLISHED_CSV_URL_HERE") {
      setError("no_url");
      setLoading(false);
      return;
    }

    // Add cache-busting param so we always get fresh data
    const url = `${SHEET_CSV_URL}&cachebust=${Date.now()}`;

    Papa.parse(url, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length && !results.data.length) {
          setError("parse_error");
        } else {
          const parsed = results.data
            .map(rowToPathway)
            .filter(p => p.id && p.name);
          
          // Debug: log first pathway so we can verify values match taxonomy
          if (parsed.length > 0) {
            console.log("✅ Pathways loaded:", parsed.length);
            console.log("🔍 First pathway actors:", parsed[0].actors);
            console.log("🔍 First pathway financed:", parsed[0].financed);
            console.log("🔍 First pathway conditions:", parsed[0].enablingConditions);
          }
          
          setPathways(parsed);
          setLastUpdated(new Date());
        }
        setLoading(false);
      },
      error: () => {
        setError("fetch_error");
        setLoading(false);
      },
    });
  }, []);

  return { pathways, loading, error, lastUpdated };
}
