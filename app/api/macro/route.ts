import { NextResponse } from "next/server";

export const revalidate = 300; // cache for 5 minutes

interface DolarApiEntry {
  moneda: string;
  casa: string;
  nombre: string;
  compra: number;
  venta: number;
  fechaActualizacion: string;
}

interface RiesgoEntry {
  valor: number;
  fecha: string;
}

async function fetchFXRates() {
  const res = await fetch("https://dolarapi.com/v1/dolares", {
    next: { revalidate: 300 },
  });
  if (!res.ok) return null;
  const data: DolarApiEntry[] = await res.json();

  const find = (casa: string) => data.find((d) => d.casa === casa);

  const oficial = find("oficial");
  const blue = find("blue");
  const mep = find("bolsa");
  const ccl = find("contadoconliqui");

  return {
    officialRate: oficial?.venta ?? null,
    blueRate: blue?.venta ?? null,
    mepRate: mep?.venta ?? null,
    cclRate: ccl?.venta ?? null,
    fxUpdated: blue?.fechaActualizacion ?? null,
  };
}

async function fetchCountryRisk() {
  try {
    const res = await fetch(
      "https://api.argentinadatos.com/v1/finanzas/indices/riesgo-pais/ultimo",
      { next: { revalidate: 300 } }
    );
    if (!res.ok) return null;
    const data: RiesgoEntry = await res.json();
    return { countryRisk: data.valor, riskDate: data.fecha };
  } catch {
    return null;
  }
}

export async function GET() {
  const [fx, risk] = await Promise.all([fetchFXRates(), fetchCountryRisk()]);

  const officialRate = fx?.officialRate ?? null;
  const blueRate = fx?.blueRate ?? null;

  const fxGap =
    officialRate && blueRate
      ? parseFloat((((blueRate - officialRate) / officialRate) * 100).toFixed(1))
      : null;

  const now = new Date().toISOString();

  const data = {
    officialRate,
    blueRate,
    mepRate: fx?.mepRate ?? null,
    cclRate: fx?.cclRate ?? null,
    fxGap,
    countryRisk: risk?.countryRisk ?? null,
    // Reserves and CPI are published infrequently — keep as manual entry
    reserves: 28450,
    cpiMonthly: 2.7,
    lastUpdated: now.split("T")[0],
    source: fx ? "dolarapi.com / argentinadatos.com" : "placeholder",
  };

  return NextResponse.json(data);
}
