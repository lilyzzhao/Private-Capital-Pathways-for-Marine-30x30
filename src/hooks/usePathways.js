import { useState, useEffect } from "react";
import Papa from "papaparse";
import { SHEET_CSV_URL } from "../config.js";

// Parse a semicolon-separated cell into a trimmed array
const splitCell = (str) =>
  str ? str.split(";").map(s => s.trim()).filter(Boolean) : [];

// Map a raw CSV row to a pathway object
const rowToPathway = (row) => ({
  id: Number(row.id),
  name: (row.name || "").trim(),
  actors: splitCell(row.actors),
  enablingConditions: splitCell(row.enablingConditions),
  incentives: splitCell(row.incentives),
  barriers: splitCell(row.barriers),
  financed: (row.financed || "").trim(),
  summary: (row.summary || "").trim(),
  examples: (row.examples || "").trim(),
});

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
            .filter(p => p.id && p.name); // skip empty rows
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
