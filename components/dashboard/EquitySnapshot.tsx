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
  { ticker: "YPF", name: "YPF S.A.", price: 22.45, marketCap: 8830, evEbitda: 3.2, pe: 5.8, pbv: 1.1, ytdReturn: 18.4 },
  { ticker: "VIST", name: "Vista Energy", price: 48.70, marketCap: 4620, evEbitda: 5.1, pe: 9.2, pbv: 2.8, ytdReturn: 24.1 },
  { ticker: "PAM", name: "Pampa Energia", price: 68.30, marketCap: 4950, evEbitda: 4.8, pe: 7.4, pbv: 1.6, ytdReturn: 12.7 },
  { ticker: "GGAL", name: "Grupo Fin. Galicia", price: 54.20, marketCap: 8010, evEbitda: null, pe: 10.3, pbv: 2.4, ytdReturn: 31.5 },
  { ticker: "GLOB", name: "Globant", price: 185.60, marketCap: 7850, evEbitda: 22.1, pe: 32.5, pbv: 5.2, ytdReturn: -4.2 },
  { ticker: "TX", name: "Ternium", price: 34.80, marketCap: 6810, evEbitda: 4.5, pe: 8.9, pbv: 0.7, ytdReturn: -1.8 },
];

function formatNum(val: number | null, decimals = 1): string {
  if (val === null) return "N/A";
  return val.toFixed(decimals);
}

function formatMktCap(val: number | null): string {
  if (val === null) return "N/A";
  if (val >= 1000) return `$${(val / 1000).toFixed(1)}B`;
  return `$${val}M`;
}

function formatReturn(val: number | null): string {
  if (val === null) return "N/A";
  const sign = val >= 0 ? "+" : "";
  return `${sign}${val.toFixed(1)}%`;
}

export default function EquitySnapshot() {
  const [companies, setCompanies] = useState<CompanyData[]>(COMPANIES);
  const [lastUpdated, setLastUpdated] = useState("2026-03-28");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchEquity() {
      setLoading(true);
      try {
        const res = await fetch("/api/equity");
        if (res.ok) {
          const json = await res.json();
          setCompanies(json.companies);
          setLastUpdated(json.lastUpdated);
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
    <section className="bg-navy-800 rounded-xl border border-navy-600 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">Equity Snapshot</h2>
        <span className="text-xs text-gray-500">Updated: {lastUpdated}</span>
      </div>
      {loading && (
        <div className="text-center text-gray-500 text-sm py-2">Loading...</div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-navy-600 text-gray-400">
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
                className="border-b border-navy-600/50 last:border-b-0 hover:bg-navy-700/30 transition-colors"
              >
                <td className="py-2.5 pr-3">
                  <span className="font-semibold text-white">{c.ticker}</span>
                  <span className="block text-xs text-gray-500">{c.name}</span>
                </td>
                <td className="text-right py-2.5 px-3 font-mono tabular-nums text-white">
                  ${formatNum(c.price, 2)}
                </td>
                <td className="text-right py-2.5 px-3 font-mono tabular-nums text-gray-300">
                  {formatMktCap(c.marketCap)}
                </td>
                <td className="text-right py-2.5 px-3 font-mono tabular-nums text-gray-300">
                  {c.evEbitda ? `${formatNum(c.evEbitda)}x` : "N/A"}
                </td>
                <td className="text-right py-2.5 px-3 font-mono tabular-nums text-gray-300">
                  {formatNum(c.pe)}x
                </td>
                <td className="text-right py-2.5 px-3 font-mono tabular-nums text-gray-300">
                  {formatNum(c.pbv)}x
                </td>
                <td
                  className={`text-right py-2.5 pl-3 font-mono tabular-nums font-medium ${
                    c.ytdReturn !== null && c.ytdReturn >= 0
                      ? "text-accent-green"
                      : "text-accent-red"
                  }`}
                >
                  {formatReturn(c.ytdReturn)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-gray-500 mt-3">
        Source: Financial Modeling Prep. Prices in USD (ADR). N/A = not applicable for sector.
      </p>
    </section>
  );
}
