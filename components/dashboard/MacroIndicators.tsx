"use client";

import { useEffect, useState } from "react";

interface MacroData {
  officialRate: number | null;
  blueRate: number | null;
  mepRate: number | null;
  cclRate: number | null;
  fxGap: number | null;
  countryRisk: number | null;
  reserves: number | null;
  cpiMonthly: number | null;
  lastUpdated: string;
}

const PLACEHOLDER: MacroData = {
  officialRate: 1085.0,
  blueRate: 1210.0,
  mepRate: 1175.0,
  cclRate: 1195.0,
  fxGap: 11.5,
  countryRisk: 680,
  reserves: 28450,
  cpiMonthly: 2.7,
  lastUpdated: "2026-03-28",
};

function IndicatorRow({
  label,
  value,
  format,
  subtext,
}: {
  label: string;
  value: number | null;
  format: "currency" | "percent" | "number" | "billions";
  subtext?: string;
}) {
  const formatted = (() => {
    if (value === null) return "—";
    switch (format) {
      case "currency":
        return `ARS ${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      case "percent":
        return `${value.toFixed(1)}%`;
      case "number":
        return value.toLocaleString("en-US");
      case "billions":
        return `USD ${(value / 1000).toFixed(1)}B`;
    }
  })();

  return (
    <div className="flex items-center justify-between py-3 border-b border-navy-600/50 last:border-b-0">
      <div>
        <p className="text-sm text-gray-400">{label}</p>
        {subtext && <p className="text-xs text-gray-500 mt-0.5">{subtext}</p>}
      </div>
      <p className="text-lg font-semibold text-white font-mono tabular-nums">
        {formatted}
      </p>
    </div>
  );
}

export default function MacroIndicators() {
  const [data, setData] = useState<MacroData>(PLACEHOLDER);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchMacro() {
      setLoading(true);
      try {
        const res = await fetch("/api/macro");
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch {
        // Keep placeholder data on error
      } finally {
        setLoading(false);
      }
    }
    fetchMacro();
  }, []);

  return (
    <section className="bg-navy-800 rounded-xl border border-navy-600 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">Macro Indicators</h2>
        <span className="text-xs text-gray-500">
          Updated: {data.lastUpdated}
        </span>
      </div>
      {loading && (
        <div className="text-center text-gray-500 text-sm py-2">Loading...</div>
      )}
      <div>
        <IndicatorRow label="USD/ARS Official" value={data.officialRate} format="currency" subtext="BCRA reference rate" />
        <IndicatorRow label="USD/ARS Blue" value={data.blueRate} format="currency" subtext="Parallel market" />
        <IndicatorRow label="USD/ARS MEP" value={data.mepRate} format="currency" subtext="Dolar bolsa" />
        <IndicatorRow label="USD/ARS CCL" value={data.cclRate} format="currency" subtext="Contado con liquidacion" />
        <IndicatorRow label="FX Gap (Blue vs Official)" value={data.fxGap} format="percent" />
        <IndicatorRow label="Country Risk (EMBI+)" value={data.countryRisk} format="number" subtext="Basis points" />
        <IndicatorRow label="BCRA Reserves" value={data.reserves} format="billions" />
        <IndicatorRow label="Monthly CPI" value={data.cpiMonthly} format="percent" subtext="Month-over-month" />
      </div>
    </section>
  );
}
