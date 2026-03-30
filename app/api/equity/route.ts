import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const TICKERS = [
  { symbol: "YPF", name: "YPF S.A." },
  { symbol: "VIST", name: "Vista Energy" },
  { symbol: "PAM", name: "Pampa Energia" },
  { symbol: "GGAL", name: "Grupo Fin. Galicia" },
  { symbol: "GLOB", name: "Globant" },
  { symbol: "TX", name: "Ternium" },
];

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

async function fetchFromYahoo(): Promise<CompanyData[]> {
  // Dynamic import + lazy init to avoid module-level issues in serverless
  const YahooFinance = (await import("yahoo-finance2")).default;
  const yf = new YahooFinance({ suppressNotices: ["yahooSurvey"] });

  const companies: CompanyData[] = [];

  for (const { symbol, name } of TICKERS) {
    try {
      /* eslint-disable @typescript-eslint/no-explicit-any */
      const quote: any = await yf.quote(symbol);

      let summary: any = null;
      try {
        summary = await yf.quoteSummary(symbol, {
          modules: ["defaultKeyStatistics", "financialData"],
        });
      } catch {
        // Some tickers may not have full summary data
      }

      const keyStats = summary?.defaultKeyStatistics;
      const financialData = summary?.financialData;

      companies.push({
        ticker: symbol,
        name: quote?.shortName || quote?.longName || name,
        price: quote?.regularMarketPrice ?? null,
        marketCap: quote?.marketCap
          ? Math.round(quote.marketCap / 1_000_000)
          : null,
        evEbitda: keyStats?.enterpriseToEbitda ?? null,
        pe: quote?.trailingPE ?? null,
        pbv: keyStats?.priceToBook ?? financialData?.priceToBook ?? null,
        ytdReturn: null,
      });
      /* eslint-enable @typescript-eslint/no-explicit-any */
    } catch (err) {
      console.error(`[equity] ${symbol} failed:`, err);
      companies.push({
        ticker: symbol,
        name,
        price: null,
        marketCap: null,
        evEbitda: null,
        pe: null,
        pbv: null,
        ytdReturn: null,
      });
    }
  }

  return companies;
}

// Placeholder data used as fallback
const PLACEHOLDER: CompanyData[] = [
  { ticker: "YPF", name: "YPF S.A.", price: 22.45, marketCap: 8830, evEbitda: 3.2, pe: 5.8, pbv: 1.1, ytdReturn: 18.4 },
  { ticker: "VIST", name: "Vista Energy", price: 48.70, marketCap: 4620, evEbitda: 5.1, pe: 9.2, pbv: 2.8, ytdReturn: 24.1 },
  { ticker: "PAM", name: "Pampa Energia", price: 68.30, marketCap: 4950, evEbitda: 4.8, pe: 7.4, pbv: 1.6, ytdReturn: 12.7 },
  { ticker: "GGAL", name: "Grupo Fin. Galicia", price: 54.20, marketCap: 8010, evEbitda: null, pe: 10.3, pbv: 2.4, ytdReturn: 31.5 },
  { ticker: "GLOB", name: "Globant", price: 185.60, marketCap: 7850, evEbitda: 22.1, pe: 32.5, pbv: 5.2, ytdReturn: -4.2 },
  { ticker: "TX", name: "Ternium", price: 34.80, marketCap: 6810, evEbitda: 4.5, pe: 8.9, pbv: 0.7, ytdReturn: -1.8 },
];

export async function GET() {
  let error: string | undefined;

  try {
    const companies = await fetchFromYahoo();
    const hasData = companies.some((c) => c.price !== null);

    if (hasData) {
      return NextResponse.json({
        companies,
        lastUpdated: new Date().toISOString().split("T")[0],
        source: "Yahoo Finance",
      });
    }
    error = "All tickers returned null prices";
  } catch (err) {
    error = err instanceof Error ? err.message : String(err);
  }

  return NextResponse.json({
    companies: PLACEHOLDER,
    lastUpdated: new Date().toISOString().split("T")[0],
    source: "placeholder",
    _debug: error,
  });
}
