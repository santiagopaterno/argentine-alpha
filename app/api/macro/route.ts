import { NextResponse } from "next/server";

// This route returns macro indicator data.
// Replace placeholder values with live API calls (BCRA, Ambito, etc.) when ready.

export async function GET() {
  const data = {
    officialRate: 1085.0,
    blueRate: 1210.0,
    mepRate: 1175.0,
    cclRate: 1195.0,
    fxGap: parseFloat((((1210.0 - 1085.0) / 1085.0) * 100).toFixed(1)),
    countryRisk: 680,
    reserves: 28450,
    cpiMonthly: 2.7,
    lastUpdated: "2026-03-28",
  };

  return NextResponse.json(data);
}
