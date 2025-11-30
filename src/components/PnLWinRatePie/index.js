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
  linePos: "#22c55e",
  lineNeg: "#ef4444",
};

const LOOKBACKS = [
  { key: "1d", label: "1D", seconds: 1 * 24 * 60 * 60 },
  { key: "7d", label: "7D", seconds: 7 * 24 * 60 * 60 },
  { key: "30d", label: "30D", seconds: 30 * 24 * 60 * 60 },
  { key: "1y", label: "1Y", seconds: 365 * 24 * 60 * 60 },
];

export default function PnLWinRatePie({
  symbols = DEFAULT_SYMBOLS,
  exchange = "binance",
  db, // optional ?db=
  size = 210,
  strokeWidth = 18,
  palette = {},
}) {
  const colors = useMemo(() => ({ ...DEFAULT_COLORS, ...palette }), [palette]);
  const [rangeKey, setRangeKey] = useState("7d");
  const [stats, setStats] = useState({ win: 0, loss: 0 });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const API_BASE = process.env.REACT_APP_API_BASE || "";

  useEffect(() => {
    let cancelled = false;

    const fetchAll = async () => {
      setLoading(true);
      setErr("");

      const nowSec = Math.floor(Date.now() / 1000);
      const lookback =
        LOOKBACKS.find((l) => l.key === rangeKey) || LOOKBACKS[1];
      const fromSec = nowSec - lookback.seconds;

      let win = 0;
      let loss = 0;

      try {
        await Promise.all(
          symbols.map(async (sym) => {
            const qs = new URLSearchParams({
              exchange,
              symbol: sym,
            });
            if (db) qs.set("db", db);

            const res = await fetch(
              `${API_BASE}/api/coin-stats?${qs.toString()}`
            );
            if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
            const json = await res.json();

            const trades = Array.isArray(json.trades) ? json.trades : [];
            for (const t of trades) {
              const ct = Number(t.close_timestamp_s);
              if (!Number.isFinite(ct) || ct < fromSec || ct > nowSec) continue;

              // Prefer real_net_pnl, fallback to real_pnl if needed
              let pnl = null;
              if (typeof t.real_net_pnl === "number") pnl = t.real_net_pnl;
              else if (typeof t.real_pnl === "number") pnl = t.real_pnl;

              if (pnl == null) continue;
              if (pnl > 0) win += 1;
              else if (pnl < 0) loss += 1;
              // pnl === 0 is ignored (neither win nor loss)
            }
          })
        );

        if (!cancelled) setStats({ win, loss });
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
  }, [symbols.join(","), exchange, db, rangeKey]);

  const totalTrades = stats.win + stats.loss;
  const winRate = totalTrades > 0 ? stats.win / totalTrades : 0;
  const lossRate = totalTrades > 0 ? stats.loss / totalTrades : 0;

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const winLength = circumference * winRate;

  const cx = size / 2;
  const cy = size / 2;

  const css = `
  .pnlPie-wrap {
    background:${colors.bg};
    color:${colors.text};
    border:1px solid #1e293b;
    border-radius:14px;
    overflow:hidden;
    font-family:Inter,ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial;
  }
  .pnlPie-toolbar{
    display:flex;
    align-items:center;
    gap:8px;
    padding:10px 12px;
    border-bottom:1px solid #1e293b;
    background:linear-gradient(180deg,#111a2e,#0e1628);
  }
  .pnlPie-title{
    font-weight:700;
    font-size:14px;
    opacity:.9;
    margin-right:10px;
  }
  .pnlPie-btn{
    height:28px;
    border-radius:9999px;
    border:1px solid #334155;
    background:#0b1220;
    color:${colors.text};
    font-size:12px;
    padding:0 10px;
    cursor:pointer;
  }
  .pnlPie-btn.active{
    border-color:#38bdf8;
    box-shadow:0 0 0 3px rgba(56,189,248,.2);
  }
  .pnlPie-status{
    margin-left:auto;
    font-size:12px;
    opacity:.8;
  }
  .pnlPie-body{
    padding:12px;
    text-align:center;
  }
  .pnlPie-empty{
    font-size:13px;
    opacity:.8;
    padding:20px 0;
  }
  .pnlPie-mainLabel{
    font-size:20px;
    font-weight:700;
    fill:${colors.text};
  }
  .pnlPie-subLabel{
    font-size:12px;
    fill:${colors.text};
    opacity:.8;
  }
  .pnlPie-legend{
    display:flex;
    flex-wrap:wrap;
    justify-content:center;
    gap:8px;
    margin-top:10px;
  }
  .pill{
    border-radius:9999px;
    padding:2px 10px;
    font-size:12px;
    border:1px solid #334155;
    background:#0f172a;
  }
  .pill.pos{
    color:#16a34a;
    border-color:#14532d;
    background:rgba(34,197,94,.1);
  }
  .pill.neg{
    color:#ef4444;
    border-color:#7f1d1d;
    background:rgba(239,68,68,.1);
  }
  `;

  return (
    <div className="pnlPie-wrap">
      <style>{css}</style>

      <div className="pnlPie-toolbar">
        <div className="pnlPie-title">Win Rate (All Symbols)</div>
        {LOOKBACKS.map((lb) => (
          <button
            key={lb.key}
            className={`pnlPie-btn ${rangeKey === lb.key ? "active" : ""}`}
            onClick={() => setRangeKey(lb.key)}
            type="button"
          >
            {lb.label}
          </button>
        ))}
        <div className="pnlPie-status">
          {loading ? (
            "Loading…"
          ) : err ? (
            <span style={{ color: "#fca5a5" }}>{err}</span>
          ) : null}
        </div>
      </div>

      <div className="pnlPie-body">
        {totalTrades === 0 ? (
          <div className="pnlPie-empty">No trades in selected range.</div>
        ) : (
          <svg
            width={size}
            height={size}
            role="img"
            aria-label="Win rate pie chart"
          >
            {/* base circle = 100% losses in red */}
            <circle
              cx={cx}
              cy={cy}
              r={radius}
              fill="none"
              stroke={colors.neg}
              strokeWidth={strokeWidth}
              transform={`rotate(-90 ${cx} ${cy})`}
              opacity="0.85"
            />
            {/* green arc = wins */}
            <circle
              cx={cx}
              cy={cy}
              r={radius}
              fill="none"
              stroke={colors.pos}
              strokeWidth={strokeWidth}
              strokeDasharray={`${winLength} ${circumference - winLength}`}
              strokeDashoffset={0}
              transform={`rotate(-90 ${cx} ${cy})`}
              strokeLinecap="round"
            />

            {/* labels in center */}
            <text
              x={cx}
              y={cy - 4}
              textAnchor="middle"
              className="pnlPie-mainLabel"
            >
              {(winRate * 100).toFixed(1)}%
            </text>
            <text
              x={cx}
              y={cy + 14}
              textAnchor="middle"
              className="pnlPie-subLabel"
            >
              win rate
            </text>
          </svg>
        )}

        <div className="pnlPie-legend">
          <span className="pill pos">Wins: {stats.win}</span>
          <span className="pill neg">Losses: {stats.loss}</span>
          <span className="pill">
            Range: {LOOKBACKS.find((l) => l.key === rangeKey)?.label}
          </span>
          <span className="pill">Total trades: {totalTrades}</span>
        </div>
      </div>
    </div>
  );
}
