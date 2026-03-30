import { NextResponse } from "next/server";

// This route returns equity snapshot data.
// Replace with Financial Modeling Prep API calls when you add your API key.
// Set FMP_API_KEY in your .env.local file.

const TICKERS = ["YPF", "VIST", "PAM", "GGAL", "GLOB", "TX"];

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

async function fetchFromFMP(): Promise<CompanyData[] | null> {
  const apiKey = process.env.FMP_API_KEY;
  if (!apiKey) return null;

  try {
    const companies: CompanyData[] = [];

    for (const ticker of TICKERS) {
      try {
        const [quoteRes, ratiosRes] = await Promise.all([
          fetch(
            `https://financialmodelingprep.com/api/v3/quote/${ticker}?apikey=${apiKey}`
          ),
          fetch(
            `https://financialmodelingprep.com/api/v3/ratios-ttm/${ticker}?apikey=${apiKey}`
          ),
        ]);

        const quoteData = await quoteRes.json();
        const ratiosData = await ratiosRes.json();

        const quote = quoteData?.[0];
        const ratios = ratiosData?.[0];

        if (quote) {
          companies.push({
            ticker,
            name: quote.name || ticker,
            price: quote.price ?? null,
            marketCap: quote.marketCap
              ? Math.round(quote.marketCap / 1_000_000)
              : null,
            evEbitda: ratios?.enterpriseValueOverEBITDATTM ?? null,
            pe: ratios?.peRatioTTM ?? quote.pe ?? null,
            pbv: ratios?.priceToBookRatioTTM ?? null,
            ytdReturn: quote.ytd
              ? parseFloat((quote.ytd * 100).toFixed(1))
              : null,
          });
        }
      } catch {
        // Skip ticker on error, continue with others
        companies.push({
          ticker,
          name: ticker,
          price: null,
          marketCap: null,
          evEbitda: null,
          pe: null,
          pbv: null,
          ytdReturn: null,
        });
      }
    }

    return companies.length > 0 ? companies : null;
  } catch {
    return null;
  }
}

// Placeholder data used when FMP_API_KEY is not set
const PLACEHOLDER: CompanyData[] = [
  { ticker: "YPF", name: "YPF S.A.", price: 22.45, marketCap: 8830, evEbitda: 3.2, pe: 5.8, pbv: 1.1, ytdReturn: 18.4 },
  { ticker: "VIST", name: "Vista Energy", price: 48.70, marketCap: 4620, evEbitda: 5.1, pe: 9.2, pbv: 2.8, ytdReturn: 24.1 },
  { ticker: "PAM", name: "Pampa Energia", price: 68.30, marketCap: 4950, evEbitda: 4.8, pe: 7.4, pbv: 1.6, ytdReturn: 12.7 },
  { ticker: "GGAL", name: "Grupo Fin. Galicia", price: 54.20, marketCap: 8010, evEbitda: null, pe: 10.3, pbv: 2.4, ytdReturn: 31.5 },
  { ticker: "GLOB", name: "Globant", price: 185.60, marketCap: 7850, evEbitda: 22.1, pe: 32.5, pbv: 5.2, ytdReturn: -4.2 },
  { ticker: "TX", name: "Ternium", price: 34.80, marketCap: 6810, evEbitda: 4.5, pe: 8.9, pbv: 0.7, ytdReturn: -1.8 },
];

export async function GET() {
  const live = await fetchFromFMP();

  return NextResponse.json({
    companies: live ?? PLACEHOLDER,
    lastUpdated: new Date().toISOString().split("T")[0],
    source: live ? "Financial Modeling Prep" : "placeholder",
  });
}
