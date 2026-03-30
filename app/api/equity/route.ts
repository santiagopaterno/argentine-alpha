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
  const YahooFinance = (await import("yahoo-finance2")).default;
  const yf = new YahooFinance({ suppressNotices: ["yahooSurvey"] });

  // Get ARS/USD rate for currency conversion
  let arsUsdRate = 1420; // fallback
  try {
    const fxRes = await fetch("https://dolarapi.com/v1/dolares/oficial");
    const fxData = await fxRes.json();
    arsUsdRate = fxData.venta || 1420;
  } catch {
    // Use fallback rate
  }

  const companies: CompanyData[] = [];

  for (const { symbol, name } of TICKERS) {
    try {
      /* eslint-disable @typescript-eslint/no-explicit-any */
      const quote: any = await yf.quote(symbol);
      const marketCap: number = quote.marketCap;
      const price: number = quote.regularMarketPrice;

      // Try fundamentalsTimeSeries for accurate balance sheet data
      let evEbitda: number | null = null;
      let pbv: number | null = null;

      try {
        const fts: any[] = await yf.fundamentalsTimeSeries(symbol, {
          period1: "2024-01-01",
          period2: "2025-12-31",
          type: "annual",
          module: "all",
        });
        const latest = fts[fts.length - 1];

        if (latest) {
          const equity = latest.commonStockEquity ?? latest.stockholdersEquity;
          const totalDebt = latest.totalDebt ?? 0;
          const cash =
            latest.cashEquivalents ??
            latest.cashAndCashEquivalents ??
            0;
          const ebitda = latest.normalizedEBITDA ?? latest.EBITDA;

          // Detect if values are in ARS: if equity > 50x market cap, convert
          const needsFx = equity != null && equity > marketCap * 50;
          const fx = needsFx ? arsUsdRate : 1;

          if (equity) {
            pbv = parseFloat((marketCap / (equity / fx)).toFixed(2));
          }
          if (ebitda) {
            const ev = marketCap + totalDebt / fx - cash / fx;
            evEbitda = parseFloat((ev / (ebitda / fx)).toFixed(1));
          }
        }
      } catch {
        // fundamentalsTimeSeries not available for this ticker
      }

      // Fallback to defaultKeyStatistics for tickers without fundamentals data
      if (evEbitda === null || pbv === null) {
        try {
          const summary: any = await yf.quoteSummary(symbol, {
            modules: ["defaultKeyStatistics", "financialData"],
          });
          const ks = summary?.defaultKeyStatistics;
          const fd = summary?.financialData;

          // Only use these if the values are reasonable (same-currency tickers)
          if (evEbitda === null && ks?.enterpriseToEbitda != null) {
            const val = ks.enterpriseToEbitda;
            if (val > 0 && val < 100) evEbitda = parseFloat(val.toFixed(1));
          }
          if (pbv === null) {
            const val = ks?.priceToBook ?? fd?.priceToBook;
            if (val != null && val > 0 && val < 100) {
              pbv = parseFloat(val.toFixed(2));
            }
          }
        } catch {
          // Skip
        }
      }

      companies.push({
        ticker: symbol,
        name: quote.shortName || quote.longName || name,
        price,
        marketCap: Math.round(marketCap / 1_000_000),
        evEbitda,
        pe: quote.trailingPE
          ? parseFloat(quote.trailingPE.toFixed(1))
          : null,
        pbv,
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
  } catch {
    // Fall through to placeholder
  }

  return NextResponse.json({
    companies: PLACEHOLDER,
    lastUpdated: new Date().toISOString().split("T")[0],
    source: "placeholder",
  });
}
