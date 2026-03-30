"use client";

import { useEffect, useState } from "react";

interface CompanyData {
  ticker: string;
  name: string;
  price: number | null;
  marketCap: number | null;
  evEbitda: number | null;
  pe: number | null;
  pbv: number | null;
  ytdReturn: number | null;
}

const COMPANIES: CompanyData[] = [
  { ticker: "YPF", name: "YPF S.A.", price: null, marketCap: null, evEbitda: null, pe: null, pbv: null, ytdReturn: null },
  { ticker: "VIST", name: "Vista Energy", price: null, marketCap: null, evEbitda: null, pe: null, pbv: null, ytdReturn: null },
  { ticker: "PAM", name: "Pampa Energia", price: null, marketCap: null, evEbitda: null, pe: null, pbv: null, ytdReturn: null },
  { ticker: "GGAL", name: "Grupo Fin. Galicia", price: null, marketCap: null, evEbitda: null, pe: null, pbv: null, ytdReturn: null },
  { ticker: "GLOB", name: "Globant", price: null, marketCap: null, evEbitda: null, pe: null, pbv: null, ytdReturn: null },
  { ticker: "TX", name: "Ternium", price: null, marketCap: null, evEbitda: null, pe: null, pbv: null, ytdReturn: null },
];

function formatNum(val: number | null, decimals = 1): string {
  if (val === null) return "—";
  return val.toFixed(decimals);
}

function formatMktCap(val: number | null): string {
  if (val === null) return "—";
  if (val >= 1000) return `$${(val / 1000).toFixed(1)}B`;
  return `$${val}M`;
}

function formatReturn(val: number | null): string {
  if (val === null) return "—";
  const sign = val >= 0 ? "+" : "";
  return `${sign}${val.toFixed(1)}%`;
}

export default function EquitySnapshot() {
  const [companies, setCompanies] = useState<CompanyData[]>(COMPANIES);
  const [lastUpdated, setLastUpdated] = useState("—");
  const [source, setSource] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEquity() {
      try {
        const res = await fetch("/api/equity");
        if (res.ok) {
          const json = await res.json();
          setCompanies(json.companies);
          setLastUpdated(json.lastUpdated);
          setSource(json.source);
        }
      } catch {
        // Keep placeholder data
      } finally {
        setLoading(false);
      }
    }
    fetchEquity();
  }, []);

  return (
    <section className="panel">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg text-heading">Equity Snapshot</h2>
        <span className="text-xs text-subtle">
          {loading ? "Loading..." : `Updated: ${lastUpdated}`}
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-themed text-muted">
              <th className="text-left py-2 pr-3 font-medium">Ticker</th>
              <th className="text-right py-2 px-3 font-medium">Price</th>
              <th className="text-right py-2 px-3 font-medium">Mkt Cap</th>
              <th className="text-right py-2 px-3 font-medium">EV/EBITDA</th>
              <th className="text-right py-2 px-3 font-medium">P/E</th>
              <th className="text-right py-2 px-3 font-medium">P/BV</th>
              <th className="text-right py-2 pl-3 font-medium">YTD</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((c) => (
              <tr
                key={c.ticker}
                className="border-b border-themed-subtle last:border-b-0 hover-row transition-colors"
              >
                <td className="py-2.5 pr-3">
                  <span className="font-semibold text-primary">{c.ticker}</span>
                  <span className="block text-xs text-subtle">{c.name}</span>
                </td>
                <td className="text-right py-2.5 px-3 font-mono tabular-nums text-primary">
                  {c.price ? `$${formatNum(c.price, 2)}` : "—"}
                </td>
                <td className="text-right py-2.5 px-3 font-mono tabular-nums text-secondary">
                  {formatMktCap(c.marketCap)}
                </td>
                <td className="text-right py-2.5 px-3 font-mono tabular-nums text-secondary">
                  {c.evEbitda ? `${formatNum(c.evEbitda)}x` : "N/A"}
                </td>
                <td className="text-right py-2.5 px-3 font-mono tabular-nums text-secondary">
                  {c.pe ? `${formatNum(c.pe)}x` : "—"}
                </td>
                <td className="text-right py-2.5 px-3 font-mono tabular-nums text-secondary">
                  {c.pbv ? `${formatNum(c.pbv)}x` : "—"}
                </td>
                <td
                  className={`text-right py-2.5 pl-3 font-mono tabular-nums font-medium ${
                    c.ytdReturn !== null && c.ytdReturn >= 0
                      ? "text-accent-green"
                      : c.ytdReturn !== null
                        ? "text-accent-red"
                        : "text-secondary"
                  }`}
                >
                  {formatReturn(c.ytdReturn)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-subtle mt-3">
        Source: {source || "Financial Modeling Prep"}. Prices in USD (ADR). N/A = not applicable for sector.
      </p>
    </section>
  );
}
