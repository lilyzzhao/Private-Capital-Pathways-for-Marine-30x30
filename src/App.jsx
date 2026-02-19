import { useState, useMemo } from "react";
import {
  ACTOR_TYPES, ENABLING_CONDITIONS, FINANCED_CATEGORIES,
  INCENTIVES, BARRIERS,
} from "./config.js";
import { usePathways } from "./hooks/usePathways.js";

// ── DESIGN TOKENS ─────────────────────────────────────────────────────────────

const C = {
  ocean: "#0D3D45", teal: "#1A7A85", tealLight: "#E3F4F6", tealMid: "#6DB8C1",
  sand: "#F7F3EC", white: "#FFFFFF", dark: "#1C2B2D", grey: "#6B7B7D",
  greyLight: "#EDF1F2", green: "#1B6B3A", greenLight: "#E8F5EE",
  amber: "#7A4F00", amberLight: "#FFF4DC", red: "#8B1A1A", redLight: "#FDECEA",
};

const FINANCED_COLORS = {
  "Full management stack":    { bg: "#E3F4F6", text: "#0D3D45", dot: "#1A7A85" },
  "Operations":               { bg: "#E8F5EE", text: "#1B4D2E", dot: "#2E7D52" },
  "Restoration":              { bg: "#FFF4DC", text: "#7A4F00", dot: "#C47F00" },
  "Monitoring & technology":  { bg: "#F0EAFB", text: "#4A2080", dot: "#7C4DCC" },
  "Business development":     { bg: "#FDECEA", text: "#8B1A1A", dot: "#CC3333" },
};

const ACTOR_COLORS = {
  "Financial institutions":      "#1A7A85",
  "Extractive & infrastructure": "#8B4513",
  "Tourism & hospitality":       "#1B6B3A",
  "Corporations (voluntary)":    "#6B3FA0",
  "Impact investors":            "#1A5A8A",
  "Other partners":              "#888",
};

// ── SUB-COMPONENTS ────────────────────────────────────────────────────────────

function Chip({ label, active, onClick, color }) {
  return (
    <button onClick={onClick} style={{
      padding: "3px 9px", borderRadius: 20, fontSize: 11, cursor: "pointer",
      border: `1.5px solid ${active ? color : "#D8E2E4"}`,
      background: active ? color : C.white, color: active ? C.white : C.grey,
      transition: "all 0.15s", lineHeight: 1.5, fontWeight: active ? 600 : 400,
      fontFamily: "Georgia, 'Times New Roman', serif",
    }}>{label}</button>
  );
}

function Tag({ text, bg, tc, dot }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      padding: "2px 8px", borderRadius: 3, fontSize: 11,
      fontFamily: "Georgia, 'Times New Roman', serif",
      background: bg, color: tc, marginRight: 4, marginBottom: 4, lineHeight: 1.6,
    }}>
      {dot && <span style={{ width: 6, height: 6, borderRadius: "50%", background: dot, flexShrink: 0 }} />}
      {text}
    </span>
  );
}

function FilterGroup({ label, description, options, selected, onToggle, color }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: C.grey, marginBottom: 3 }}>{label}</div>
      {description && <div style={{ fontSize: 10.5, color: "#aaa", marginBottom: 6, lineHeight: 1.4 }}>{description}</div>}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
        {options.map(opt => (
          <Chip key={opt} label={opt}
            active={Array.isArray(selected) ? selected.includes(opt) : selected === opt}
            onClick={() => onToggle(opt)} color={color} />
        ))}
      </div>
    </div>
  );
}

function PathwayCard({ p, dimmed }) {
  const [open, setOpen] = useState(false);
  const fc = FINANCED_COLORS[p.financed] || { bg: C.greyLight, text: C.dark, dot: C.grey };

  return (
    <div style={{
      background: C.white, borderRadius: 10, marginBottom: 10, overflow: "hidden",
      border: `1.5px solid ${dimmed ? "#EDF1F2" : "#C8DFE2"}`,
      boxShadow: dimmed ? "none" : "0 2px 10px rgba(13,61,69,0.07)",
      transition: "all 0.2s", opacity: dimmed ? 0.38 : 1,
    }}>
      <div onClick={() => setOpen(!open)} style={{ padding: "13px 16px", cursor: "pointer" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
          <div style={{ display: "flex", gap: 10, alignItems: "flex-start", flex: 1 }}>
            <div style={{
              width: 28, height: 28, borderRadius: "50%", background: C.ocean, color: C.white,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 12, fontWeight: 700, fontFamily: "Georgia, serif",
              flexShrink: 0, marginTop: 1,
            }}>{p.id}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "Georgia, serif", fontWeight: 700, fontSize: 14, color: C.ocean, marginBottom: 7, lineHeight: 1.3 }}>{p.name}</div>
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 4 }}>
                {p.actors.map(a => (
                  <span key={a} style={{
                    display: "inline-flex", alignItems: "center", gap: 5,
                    padding: "3px 9px", borderRadius: 12, fontSize: 11,
                    fontFamily: "Georgia, serif", background: C.greyLight, color: C.dark, marginBottom: 2,
                  }}>
                    <span style={{ width: 7, height: 7, borderRadius: "50%", background: ACTOR_COLORS[a] || "#999", flexShrink: 0 }} />
                    {a}
                  </span>
                ))}
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: 5,
                  padding: "3px 10px", borderRadius: 4, fontSize: 11,
                  fontFamily: "Georgia, serif", background: fc.bg, color: fc.text,
                  fontWeight: 600, border: `1px solid ${fc.dot}44`, marginBottom: 2, marginLeft: 2,
                }}>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: fc.dot }} />
                  {p.financed}
                </span>
              </div>
            </div>
          </div>
          <span style={{ color: C.teal, fontSize: 13, flexShrink: 0, marginTop: 6 }}>{open ? "▲" : "▼"}</span>
        </div>
      </div>

      {open && (
        <div style={{ borderTop: `1px solid ${C.greyLight}`, background: "#FAFCFC", padding: "14px 16px 16px" }}>
          <p style={{ fontFamily: "Georgia, serif", fontSize: 12.5, color: "#444", lineHeight: 1.75, marginBottom: 14 }}>{p.summary}</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: C.grey, marginBottom: 6 }}>Enabling Conditions</div>
              {p.enablingConditions.map(c => <Tag key={c} text={c} bg={C.greenLight} tc={C.green} dot="#2E7D52" />)}
            </div>
            <div>
              <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: C.grey, marginBottom: 6 }}>Incentives</div>
              {p.incentives.map(i => <Tag key={i} text={i} bg={C.amberLight} tc={C.amber} dot="#C47F00" />)}
            </div>
            <div>
              <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: C.grey, marginBottom: 6 }}>Barriers</div>
              {p.barriers.map(b => <Tag key={b} text={b} bg={C.redLight} tc={C.red} dot="#CC3333" />)}
            </div>
          </div>
          <div style={{ borderTop: `1px solid ${C.greyLight}`, paddingTop: 10 }}>
            <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: C.grey, marginBottom: 4 }}>Examples</div>
            <div style={{ fontFamily: "Georgia, serif", fontSize: 11.5, color: "#666", lineHeight: 1.7 }}>{p.examples}</div>
          </div>
        </div>
      )}
    </div>
  );
}

// Shared header component used by loading/error screens too
function AppHeader() {
  return (
    <div style={{ background: C.ocean, padding: "22px 28px 18px", borderBottom: `3px solid ${C.teal}` }}>
      <div style={{ maxWidth: 1140, margin: "0 auto" }}>
        <div style={{ fontSize: 9.5, letterSpacing: "0.2em", textTransform: "uppercase", color: C.tealMid, marginBottom: 6 }}>STRI–WEF · Marine 30×30</div>
        <h1 style={{ color: C.white, fontSize: 21, fontWeight: 700, margin: "0 0 4px" }}>Private Capital Pathway Explorer</h1>
        <p style={{ color: "#8BBFC5", fontSize: 12, margin: 0, lineHeight: 1.65 }}>Filter by actor type, enabling conditions, incentives, and barriers to identify pathways relevant to your context.</p>
      </div>
    </div>
  );
}

function LoadingScreen() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", gap: 16, color: C.grey }}>
      <div style={{ fontSize: 32 }}>🌊</div>
      <div style={{ fontFamily: "Georgia, serif", fontSize: 15 }}>Loading pathway data…</div>
      <div style={{ fontSize: 12, color: "#aaa" }}>Fetching from Google Sheets</div>
    </div>
  );
}

function SetupScreen() {
  return (
    <div style={{ maxWidth: 640, margin: "60px auto", padding: "0 28px", fontFamily: "Georgia, serif" }}>
      <div style={{ fontSize: 32, marginBottom: 16, textAlign: "center" }}>🌊</div>
      <h2 style={{ color: C.ocean, fontSize: 18, marginBottom: 12 }}>Connect your Google Sheet</h2>
      <p style={{ color: C.grey, fontSize: 13, lineHeight: 1.8, marginBottom: 20 }}>
        The pathway data is managed in a Google Sheet. To connect it, open <code style={{ background: C.greyLight, padding: "1px 5px", borderRadius: 3 }}>src/config.js</code> and paste your published CSV URL into <code style={{ background: C.greyLight, padding: "1px 5px", borderRadius: 3 }}>SHEET_CSV_URL</code>.
      </p>
      <div style={{ background: C.greyLight, borderRadius: 8, padding: "14px 16px", marginBottom: 20 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: C.ocean, marginBottom: 10 }}>How to get your published CSV URL</div>
        {["Open your Google Sheet", "File → Share → Publish to web", "Select 'Entire document' and 'Comma-separated values (.csv)'", "Click Publish → copy the URL", "Paste it into src/config.js as SHEET_CSV_URL"].map((step, i) => (
          <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8, fontSize: 12, color: C.dark, lineHeight: 1.6 }}>
            <span style={{ width: 20, height: 20, borderRadius: "50%", background: C.teal, color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, flexShrink: 0 }}>{i + 1}</span>
            {step}
          </div>
        ))}
      </div>
      <div style={{ background: "#FFF4DC", borderRadius: 8, padding: "12px 16px" }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: C.amber, marginBottom: 6 }}>Required column headers (row 1)</div>
        <code style={{ fontSize: 11, color: C.dark, lineHeight: 2 }}>
          id · name · actors · enablingConditions · incentives · barriers · financed · summary · examples
        </code>
        <div style={{ fontSize: 11, color: C.amber, marginTop: 8 }}>
          Multi-value columns (actors, conditions, incentives, barriers): separate values with a semicolon <strong>;</strong>
        </div>
      </div>
    </div>
  );
}

function ErrorScreen({ error }) {
  return (
    <div style={{ maxWidth: 520, margin: "60px auto", padding: "0 28px", textAlign: "center", fontFamily: "Georgia, serif" }}>
      <div style={{ fontSize: 32, marginBottom: 12 }}>⚠️</div>
      <div style={{ color: C.red, fontSize: 15, marginBottom: 8 }}>Could not load pathway data</div>
      <div style={{ color: C.grey, fontSize: 12, lineHeight: 1.7 }}>
        {error === "fetch_error"
          ? "The Google Sheet could not be reached. Check that the sheet is published and the URL in config.js is correct."
          : "There was a problem parsing the sheet data. Check that your column headers match exactly and that values use semicolons as separators."}
      </div>
    </div>
  );
}

// ── MAIN APP ──────────────────────────────────────────────────────────────────

export default function App() {
  const { pathways: PATHWAYS, loading, error, lastUpdated } = usePathways();

  const [actorF, setActorF] = useState([]);
  const [condF, setCondF] = useState([]);
  const [incF, setIncF] = useState([]);
  const [barF, setBarF] = useState([]);
  const [finF, setFinF] = useState(null);

  const toggleM = (setter, arr, val) =>
    setter(arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val]);
  const clearAll = () => { setActorF([]); setCondF([]); setIncF([]); setBarF([]); setFinF(null); };
  const hasFilters = actorF.length || condF.length || incF.length || barF.length || finF;

  const matches = useMemo(() => PATHWAYS.map(p => {
    if (actorF.length && !actorF.some(a => p.actors.includes(a))) return false;
    if (condF.length && !condF.some(c => p.enablingConditions.includes(c))) return false;
    if (incF.length && !incF.some(i => p.incentives.includes(i))) return false;
    if (barF.length && !barF.some(b => p.barriers.includes(b))) return false;
    if (finF && p.financed !== finF) return false;
    return true;
  }), [actorF, condF, incF, barF, finF]);

  const matchCount = matches.filter(Boolean).length;

  if (loading) return (
    <div style={{ minHeight: "100vh", background: C.sand }}>
      <AppHeader />
      <LoadingScreen />
    </div>
  );
  if (error === "no_url") return (
    <div style={{ minHeight: "100vh", background: C.sand }}>
      <AppHeader />
      <SetupScreen />
    </div>
  );
  if (error) return (
    <div style={{ minHeight: "100vh", background: C.sand }}>
      <AppHeader />
      <ErrorScreen error={error} />
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: C.sand, fontFamily: "Georgia, 'Times New Roman', serif" }}>
      <AppHeader />

      <div style={{ maxWidth: 1140, margin: "0 auto", padding: "22px 28px", display: "grid", gridTemplateColumns: "264px 1fr", gap: 22 }}>

        {/* ── SIDEBAR ── */}
        <div>
          <div style={{ background: C.white, borderRadius: 10, padding: "16px 15px", border: `1.5px solid #D4E5E8`, marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: C.ocean }}>Filters</div>
              {hasFilters && (
                <button onClick={clearAll} style={{ fontSize: 10.5, color: C.teal, background: "none", border: "none", cursor: "pointer", textDecoration: "underline", fontFamily: "inherit" }}>clear all</button>
              )}
            </div>

            <div style={{ borderBottom: `1px solid ${C.greyLight}`, paddingBottom: 14, marginBottom: 14 }}>
              <FilterGroup label="Private Sector Actor" description="Who is deploying capital"
                options={ACTOR_TYPES} selected={actorF} onToggle={v => toggleM(setActorF, actorF, v)} color={C.teal} />
            </div>

            <div style={{ borderBottom: `1px solid ${C.greyLight}`, paddingBottom: 14, marginBottom: 14 }}>
              <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: C.grey, marginBottom: 3 }}>What is Being Financed</div>
              <div style={{ fontSize: 10.5, color: "#aaa", marginBottom: 8, lineHeight: 1.4 }}>Select one</div>
              {FINANCED_CATEGORIES.map(cat => {
                const fc = FINANCED_COLORS[cat];
                const active = finF === cat;
                return (
                  <button key={cat} onClick={() => setFinF(active ? null : cat)} style={{
                    display: "flex", alignItems: "center", gap: 7, width: "100%",
                    textAlign: "left", padding: "6px 9px", borderRadius: 6, marginBottom: 4,
                    cursor: "pointer", border: `1.5px solid ${active ? fc.dot : "#E0EAEC"}`,
                    background: active ? fc.bg : C.white, color: active ? fc.text : C.dark,
                    fontFamily: "Georgia, serif", fontSize: 11.5,
                    fontWeight: active ? 700 : 400, transition: "all 0.15s",
                  }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: fc.dot, flexShrink: 0 }} />
                    {cat}
                  </button>
                );
              })}
            </div>

            <div style={{ borderBottom: `1px solid ${C.greyLight}`, paddingBottom: 14, marginBottom: 14 }}>
              <FilterGroup label="Enabling Conditions" description="Conditions present in your context"
                options={ENABLING_CONDITIONS} selected={condF} onToggle={v => toggleM(setCondF, condF, v)} color={C.green} />
            </div>

            <div style={{ borderBottom: `1px solid ${C.greyLight}`, paddingBottom: 14, marginBottom: 14 }}>
              <FilterGroup label="Incentives for Private Actor"
                options={INCENTIVES} selected={incF} onToggle={v => toggleM(setIncF, incF, v)} color="#C47F00" />
            </div>

            <FilterGroup label="Barriers to Address"
              options={BARRIERS} selected={barF} onToggle={v => toggleM(setBarF, barF, v)} color={C.red} />
          </div>

          {/* Legend */}
          <div style={{ background: C.white, borderRadius: 10, padding: "13px 14px", border: `1.5px solid #D4E5E8` }}>
            <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: C.ocean, marginBottom: 10 }}>Actor Key</div>
            {ACTOR_TYPES.map(a => (
              <div key={a} style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 6 }}>
                <span style={{ width: 9, height: 9, borderRadius: "50%", background: ACTOR_COLORS[a], flexShrink: 0 }} />
                <span style={{ fontSize: 11, color: C.dark }}>{a}</span>
              </div>
            ))}
            <div style={{ borderTop: `1px solid ${C.greyLight}`, marginTop: 10, paddingTop: 10 }}>
              <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: C.ocean, marginBottom: 8 }}>Financed Category</div>
              {FINANCED_CATEGORIES.map(cat => {
                const fc = FINANCED_COLORS[cat];
                return (
                  <div key={cat} style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 6 }}>
                    <span style={{ width: 9, height: 9, borderRadius: "50%", background: fc.dot, flexShrink: 0 }} />
                    <span style={{ fontSize: 11, color: C.dark }}>{cat}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── RESULTS ── */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div style={{ fontSize: 13, color: C.grey }}>
              <span style={{ fontWeight: 700, color: C.ocean, fontSize: 20 }}>{matchCount}</span>
              <span style={{ marginLeft: 5 }}>of {PATHWAYS.length} pathways</span>
              {hasFilters && <span style={{ color: C.teal }}> matching</span>}
            </div>
            {hasFilters && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4, justifyContent: "flex-end" }}>
                {[
                  ...actorF.map(f => ({ f, clear: () => toggleM(setActorF, actorF, f) })),
                  ...condF.map(f => ({ f, clear: () => toggleM(setCondF, condF, f) })),
                  ...incF.map(f => ({ f, clear: () => toggleM(setIncF, incF, f) })),
                  ...barF.map(f => ({ f, clear: () => toggleM(setBarF, barF, f) })),
                  ...(finF ? [{ f: finF, clear: () => setFinF(null) }] : []),
                ].map(({ f, clear }, i) => (
                  <span key={i} style={{
                    display: "inline-flex", alignItems: "center", gap: 4,
                    background: C.tealLight, borderRadius: 12, padding: "2px 8px", fontSize: 10.5, color: C.ocean,
                  }}>
                    {f} <span onClick={clear} style={{ cursor: "pointer", color: C.teal, fontWeight: 700 }}>×</span>
                  </span>
                ))}
              </div>
            )}
          </div>

          {matchCount === 0 ? (
            <div style={{ textAlign: "center", padding: "70px 20px", color: C.grey }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>🌊</div>
              <div style={{ fontSize: 15, marginBottom: 6 }}>No pathways match these filters</div>
              <div style={{ fontSize: 12 }}>Try removing some filters to broaden the search</div>
            </div>
          ) : (
            PATHWAYS.map((p, i) => <PathwayCard key={p.id} p={p} dimmed={!matches[i]} />)
          )}
        </div>
      </div>

      {/* Footer */}
      {lastUpdated && (
        <div style={{ textAlign: "center", padding: "16px 28px 24px", color: "#aaa", fontSize: 10.5, fontFamily: "Georgia, serif" }}>
          Data loaded from Google Sheets · {lastUpdated.toLocaleTimeString()} · <a href="#" onClick={e => { e.preventDefault(); window.location.reload(); }} style={{ color: C.teal, textDecoration: "none" }}>refresh</a>
        </div>
      )}
    </div>
  );
}
