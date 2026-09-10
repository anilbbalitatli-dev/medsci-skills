import { localAnestheticByName } from "./local-anesthetics";

/**
 * Working out what is actually in the syringe.
 *
 * Mixtures are made by drawing up stock solutions and diluting, and the two
 * numbers people get wrong are opposite ends of the same sum: how many
 * milligrams went in (fixed the moment the drug is drawn up, and unchanged by
 * dilution) and what the final concentration is (which dilution changes and
 * which is what actually determines motor block). Adding saline lowers the
 * second without touching the first — a distinction worth showing side by side,
 * because "I diluted it" is not a dose reduction.
 */
export type StockKind = "la" | "adjuvant" | "diluent";

export interface StockSolution {
  id: string;
  label: string;
  kind: StockKind;
  /** Matches the ceiling table by prefix; local anaesthetics only. */
  drug?: string;
  /** For a local anaesthetic, the label strength as a percentage. */
  concentrationPercent?: number;
  /** For an adjuvant, how much of it each millilitre holds. */
  strengthPerMl?: number;
  unit?: "mg" | "µg";
  note?: string;
}

/** Presentations as they come off the shelf, so nothing has to be converted by hand. */
export const STOCK_SOLUTIONS: StockSolution[] = [
  // ---- Lokal anestezikler ----
  { id: "bupi-05", label: "Bupivakain %0.5", kind: "la", drug: "Bupivakain", concentrationPercent: 0.5 },
  { id: "bupi-025", label: "Bupivakain %0.25", kind: "la", drug: "Bupivakain", concentrationPercent: 0.25 },
  {
    id: "bupi-05-hb",
    label: "Bupivakain %0.5 (hiperbarik)",
    kind: "la",
    drug: "Bupivakain",
    concentrationPercent: 0.5,
    note: "İntratekal kullanım için; dekstroz içerir, seyreltmek barisiteyi bozar.",
  },
  { id: "levo-05", label: "Levobupivakain %0.5", kind: "la", drug: "Levobupivakain", concentrationPercent: 0.5 },
  { id: "levo-025", label: "Levobupivakain %0.25", kind: "la", drug: "Levobupivakain", concentrationPercent: 0.25 },
  { id: "ropi-075", label: "Ropivakain %0.75", kind: "la", drug: "Ropivakain", concentrationPercent: 0.75 },
  { id: "ropi-05", label: "Ropivakain %0.5", kind: "la", drug: "Ropivakain", concentrationPercent: 0.5 },
  { id: "ropi-02", label: "Ropivakain %0.2", kind: "la", drug: "Ropivakain", concentrationPercent: 0.2 },
  { id: "lido-2", label: "Lidokain %2", kind: "la", drug: "Lidokain", concentrationPercent: 2 },
  { id: "lido-1", label: "Lidokain %1", kind: "la", drug: "Lidokain", concentrationPercent: 1 },
  { id: "prilo-2", label: "Prilokain %2", kind: "la", drug: "Prilokain", concentrationPercent: 2 },
  { id: "mepi-2", label: "Mepivakain %2", kind: "la", drug: "Mepivakain", concentrationPercent: 2 },

  // ---- Adjuvanlar ----
  { id: "fentanyl", label: "Fentanil 50 µg/mL", kind: "adjuvant", strengthPerMl: 50, unit: "µg" },
  {
    id: "morphine",
    label: "Morfin 10 mg/mL",
    kind: "adjuvant",
    strengthPerMl: 10,
    unit: "mg",
    note: "Nöraksiyel kullanımda çok daha düşük dozlar gerekir; sulandırılmadan verilmez.",
  },
  { id: "dexmed", label: "Deksmedetomidin 100 µg/mL", kind: "adjuvant", strengthPerMl: 100, unit: "µg" },
  { id: "dexa", label: "Deksametazon 4 mg/mL", kind: "adjuvant", strengthPerMl: 4, unit: "mg" },
  { id: "clonidine", label: "Klonidin 150 µg/mL", kind: "adjuvant", strengthPerMl: 150, unit: "µg" },
  {
    id: "adrenaline",
    label: "Adrenalin 1 mg/mL (1:1000)",
    kind: "adjuvant",
    strengthPerMl: 1000,
    unit: "µg",
    note: "1:200.000 için 20 mL karışıma 0.1 mL eklenir (5 µg/mL).",
  },

  // ---- Sulandırıcı ----
  { id: "saline", label: "Serum fizyolojik %0.9", kind: "diluent" },
];

export function stockById(id: string): StockSolution | undefined {
  return STOCK_SOLUTIONS.find((s) => s.id === id);
}

export interface MixtureItem {
  stockId: string;
  volumeMl: number;
}

export interface MixtureComponentResult {
  stock: StockSolution;
  volumeMl: number;
  /** Amount delivered, in the stock's own unit. Absent for diluent. */
  amount?: number;
  unit?: "mg" | "µg";
  /** Strength in the finished syringe, once diluted. */
  finalConcentrationPercent?: number;
  finalPerMl?: number;
}

export interface MixtureResult {
  totalVolumeMl: number;
  components: MixtureComponentResult[];
  /** Local anaesthetic milligrams, summed per drug across all components. */
  laTotals: { drug: string; mg: number; finalPercent: number }[];
}

export function computeMixture(items: MixtureItem[]): MixtureResult {
  const totalVolumeMl = items.reduce((sum, i) => sum + (i.volumeMl || 0), 0);

  const components: MixtureComponentResult[] = [];
  const byDrug = new Map<string, number>();

  for (const item of items) {
    const stock = stockById(item.stockId);
    if (!stock || !item.volumeMl) continue;
    const volumeMl = item.volumeMl;

    if (stock.kind === "la" && stock.concentrationPercent !== undefined) {
      const mg = volumeMl * stock.concentrationPercent * 10;
      byDrug.set(stock.drug!, (byDrug.get(stock.drug!) ?? 0) + mg);
      components.push({
        stock,
        volumeMl,
        amount: mg,
        unit: "mg",
        finalConcentrationPercent: totalVolumeMl > 0 ? mg / totalVolumeMl / 10 : 0,
        finalPerMl: totalVolumeMl > 0 ? mg / totalVolumeMl : 0,
      });
    } else if (stock.kind === "adjuvant" && stock.strengthPerMl !== undefined) {
      const amount = volumeMl * stock.strengthPerMl;
      components.push({
        stock,
        volumeMl,
        amount,
        unit: stock.unit,
        finalPerMl: totalVolumeMl > 0 ? amount / totalVolumeMl : 0,
      });
    } else {
      components.push({ stock, volumeMl });
    }
  }

  const laTotals = Array.from(byDrug.entries()).map(([drug, mg]) => ({
    drug,
    mg,
    finalPercent: totalVolumeMl > 0 ? mg / totalVolumeMl / 10 : 0,
  }));

  return { totalVolumeMl, components, laTotals };
}

/** Human label for a drug's usual role, used to caption the final strength. */
export function describeFinalStrength(drug: string, finalPercent: number): string | undefined {
  const la = localAnestheticByName(drug);
  if (!la) return undefined;
  if (la.analgesia !== undefined && finalPercent <= la.analgesia * 1.2) {
    return "Analjezik aralık — motor korunması beklenir";
  }
  if (la.surgical !== undefined && finalPercent >= la.surgical * 0.8) {
    return "Cerrahi anestezi aralığı — belirgin motor blok beklenir";
  }
  return "Ara konsantrasyon — motor etki değişken";
}
