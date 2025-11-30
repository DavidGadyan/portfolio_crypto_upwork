import React, { useEffect, useMemo, useState } from "react";

const DEFAULT_SYMBOLS = [
  "ADAUSDT",
  "BTCUSDT",
  "ETHUSDT",
  "SOLUSDT",
  "XRPUSDT",
  "DOGEUSDT",
  "PEPEUSDT",
  "TRUMPUSDT",
];

const DEFAULT_COLORS = {
  bg: "#0b1220",
  grid: "#1f2a44",
  text: "#cbd5e1",
  pos: "#22c55e",
  neg: "#ef4444",
};

// --- helpers ---

// convert various timestamp formats -> seconds
function toSec(v) {
  if (v == null) return undefined;
  if (typeof v === "number") {
    if (v > 2_000_000_000_000) return Math.floor(v / 1000); // ms
    return v; // seconds
  }
  const s = String(v);
  if (/^\d{13}$/.test(s)) return Math.floor(Number(s) / 1000); // ms
  if (/^\d{10}$/.test(s)) return Number(s); // sec
  const d = new Date(s);
  const t = d.getTime();
  return Number.isFinite(t) ? Math.floor(t / 1000) : undefined;
}

// choose a close time for the trade (raw Firestore object)
function getCloseSec(t) {
  return (
    toSec(t.close_timestamp) ??
    toSec(t.exit) ??
    toSec(t.close_time) ??
    toSec(t.timestamp) ??
    toSec(t.entry_timestamp)
  );
}

// choose P&L for trade (prefer real_profit_loss)
function getPL(t) {
  if (typeof t.real_profit_loss === "number") return t.real_profit_loss;
  if (t.real_profit_loss != null) {
    const v = Number(t.real_profit_loss);
    if (Number.isFinite(v)) return v;
  }

  if (typeof t.real_net_profit_loss === "number") return t.real_net_profit_loss;
  if (t.real_net_profit_loss != null) {
    const v = Number(t.real_net_profit_loss);
    if (Number.isFinite(v)) return v;
  }

  if (typeof t.real_net_pnl === "number") return t.real_net_pnl;
  if (t.real_net_pnl != null) {
    const v = Number(t.real_net_pnl);
    if (Number.isFinite(v)) return v;
  }

  if (typeof t.real_pnl === "number") return t.real_pnl;
  if (t.real_pnl != null) {
    const v = Number(t.real_pnl);
    if (Number.isFinite(v)) return v;
  }

  return undefined;
}

/**
 * MaxDrawdown
 * -----------
 * - Fetches ALL trades for symbols from /api/coin-stats/raw
 * - Uses real_profit_loss (preferred) for each trade
 * - Builds equity from startingBalance by applying each trade P&L in time order
 * - Max Drawdown = (minEquity - startingBalance) / startingBalance (negative or 0)
 * - Profit Factor = totalProfits / |totalLosses|, 0..∞
 * - Renders both as big numeric KPIs in one card.
 */
export default function MaxDrawdown({
  symbols = DEFAULT_SYMBOLS,
  exchange = "binance",
  db,
  startingBalance = 100,
  palette = {},
}) {
  const colors = useMemo(() => ({ ...DEFAULT_COLORS, ...palette }), [palette]);

  const [maxDrawdown, setMaxDrawdown] = useState(null); // fraction, e.g. -0.25
  const [profitFactor, setProfitFactor] = useState(null); // number or Infinity
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const API_BASE = process.env.REACT_APP_API_BASE || "";

  useEffect(() => {
    let cancelled = false;

    const fetchAll = async () => {
      setLoading(true);
      setErr("");

      try {
        // collect per-trade PL with timestamps
        const allTrades = [];

        await Promise.all(
          symbols.map(async (sym) => {
            const qs = new URLSearchParams({ exchange, symbol: sym });
            if (db) qs.set("db", db);

            const url = `${API_BASE}/api/coin-stats/raw?${qs.toString()}`;
            const res = await fetch(url);
            if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);

            const json = await res.json();
            const trades = Array.isArray(json.trades) ? json.trades : [];

            for (const t of trades) {
              const ctSec = getCloseSec(t);
              if (!Number.isFinite(ctSec)) continue;

              const pl = getPL(t);
              if (!Number.isFinite(pl)) continue;

              allTrades.push({ ts: ctSec, pl });
            }
          })
        );

        if (cancelled) return;

        if (!allTrades.length) {
          setMaxDrawdown(null);
          setProfitFactor(null);
          setLoading(false);
          return;
        }

        // sort trades by close time
        allTrades.sort((a, b) => a.ts - b.ts);

        // compute equity path, max drawdown from initial balance only
        let equity = startingBalance;
        let minEquity = startingBalance;
        let totalProfits = 0;
        let totalLosses = 0;

        for (const { pl } of allTrades) {
          equity += pl;
          if (equity < minEquity) minEquity = equity;

          if (pl > 0) totalProfits += pl;
          else if (pl < 0) totalLosses += pl; // negative
        }

        const ddFraction =
          startingBalance > 0
            ? (minEquity - startingBalance) / startingBalance
            : null;

        let pf = null;
        if (totalLosses < 0) {
          pf = totalProfits / Math.abs(totalLosses);
        } else if (totalProfits > 0 && totalLosses === 0) {
          pf = Infinity;
        } else {
          pf = 0;
        }

        setMaxDrawdown(ddFraction);
        setProfitFactor(pf);
      } catch (e) {
        if (!cancelled) setErr(e.message || "Failed to load");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchAll();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [symbols.join(","), exchange, db, startingBalance]);

  const css = `
  .risk-wrap{
    background:${colors.bg};
    color:${colors.text};
    border:1px solid #1e293b;
    border-radius:14px;
    overflow:hidden;
    font-family:Inter,ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial;
  }
  .risk-toolbar{
    display:flex;
    align-items:center;
    padding:10px 12px;
    border-bottom:1px solid #1e293b;
    background:linear-gradient(180deg,#111a2e,#0e1628);
  }
  .risk-title{
    font-weight:700;
    font-size:14px;
    opacity:.9;
  }
  .risk-status{
    margin-left:auto;
    font-size:12px;
    opacity:.8;
  }
  .risk-body{
    padding:16px 18px 18px;
  }
  .risk-grid{
    display:flex;
    gap:16px;
    flex-wrap:wrap;
  }
  .risk-card{
    flex:1 1 160px;
    min-width:0;
  }
  .risk-label{
    font-size:21px;
    text-transform:uppercase;
    letter-spacing:.06em;
    opacity:.75;
    margin-bottom:4px;
  }
  .risk-value{
    font-size:50px;
    font-weight:700;
    line-height:1.1;
  }
  .risk-value--dd{
    color:${colors.neg};
  }
  .risk-value--pf{
    color:${colors.pos};
  }
  .risk-help{
    margin-top:10px;
    font-size:12px;
    opacity:.7;
  }
  `;

  const hasMetrics = maxDrawdown !== null && profitFactor !== null;

  const ddDisplay =
    maxDrawdown == null ? "—" : `${(maxDrawdown * 100).toFixed(2)}%`; // negative or 0

  let pfDisplay = "—";
  if (profitFactor === Infinity) {
    pfDisplay = "∞";
  } else if (typeof profitFactor === "number") {
    pfDisplay = profitFactor.toFixed(2);
  }

  return (
    <div className="risk-wrap">
      <style>{css}</style>

      <div className="risk-toolbar">
        <div className="risk-title">Max Drawdown & PF</div>
        <div className="risk-status">
          {loading ? "Loading…" : err ? <span>{err}</span> : null}
        </div>
      </div>

      <div className="risk-body">
        {!hasMetrics && !loading && !err ? (
          <div style={{ fontSize: 13, opacity: 0.8 }}>No trades available.</div>
        ) : (
          <div className="risk-grid">
            <div className="risk-card">
              <div className="risk-label">Max Drawdown</div>
              <div className="risk-value risk-value--dd">{ddDisplay}</div>
            </div>
            <div className="risk-card">
              <div className="risk-label">Profit Factor</div>
              <div className="risk-value risk-value--pf">{pfDisplay}</div>
            </div>
          </div>
        )}

        <div className="risk-help">
          Profit factor is total profits divided by total losses. A value of 2.0
          means the strategy earns $2 for every $1 it loses.
        </div>
      </div>
    </div>
  );
}
