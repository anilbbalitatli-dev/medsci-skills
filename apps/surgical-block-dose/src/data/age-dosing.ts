import { findMaxDose } from "./max-doses";
import { DrugMaxDose } from "./types";

/**
 * Age-adjusted local anaesthetic dose ceilings, and the arithmetic for adding
 * several blocks together.
 *
 * Two ideas drive this file, and both are the reason the combination builder
 * exists at all:
 *
 * 1. **Doses add up.** Two blocks that are each safe alone can exceed the
 *    ceiling together. Toxicity of amide local anaesthetics is treated as
 *    additive, so when different drugs are mixed the correct check is the sum
 *    of the fractions of each drug's maximum — not each drug against its own
 *    limit separately.
 *
 * 2. **Small patients run out of budget fast.** The ceiling scales with weight
 *    while the adult volumes in the technique catalogue do not. A 15 kg child
 *    reaches the ropivacaine ceiling at roughly 22 mL of 0.2% — less than one
 *    adult fascia iliaca block.
 *
 * The age modifiers below are conservative teaching adjustments reflecting
 * reduced α1-acid glycoprotein (higher free drug fraction) and immature
 * hepatic clearance in the youngest patients. They are NOT a validated
 * formula; institutional protocol and the drug label govern.
 */

export interface AgeBand {
  id: string;
  label: string;
  /** Multiplier applied to the adult mg/kg ceiling. */
  modifier: number;
  rationale: string;
  pediatric: boolean;
}

export const AGE_BANDS: AgeBand[] = [
  {
    id: "neonate",
    label: "Yenidoğan (0–1 ay)",
    modifier: 0.5,
    rationale:
      "α1-asit glikoprotein düşük olduğundan serbest ilaç fraksiyonu yüksek; hepatik klirens immatür. Amid lokal anesteziklerde belirgin doz azaltımı gerekir.",
    pediatric: true,
  },
  {
    id: "infant-1-6m",
    label: "Süt çocuğu (1–6 ay)",
    modifier: 0.7,
    rationale: "Protein bağlanması ve klirens hâlâ olgunlaşmamış; doz azaltımı sürer.",
    pediatric: true,
  },
  {
    id: "infant-6-12m",
    label: "Bebek (6–12 ay)",
    modifier: 0.8,
    rationale: "Klirens erişkine yaklaşır ancak güvenlik payı için ölçülü azaltım korunur.",
    pediatric: true,
  },
  {
    id: "child",
    label: "Çocuk (1–12 yaş)",
    modifier: 1,
    rationale:
      "mg/kg sınırları erişkinle aynıdır; asıl kısıt düşük vücut ağırlığının yarattığı küçük mutlak doz bütçesidir.",
    pediatric: true,
  },
  {
    id: "adolescent-adult",
    label: "Adölesan / Erişkin (12–70 yaş)",
    modifier: 1,
    rationale: "Standart erişkin sınırları.",
    pediatric: false,
  },
  {
    id: "elderly",
    label: "Yaşlı / kırılgan (>70 yaş)",
    modifier: 0.8,
    rationale:
      "Azalmış klirens, düşük kas kütlesi ve sık görülen kardiyak/hepatik komorbidite nedeniyle ihtiyatlı azaltım önerilir.",
    pediatric: false,
  },
];

export function ageBandById(id: string): AgeBand {
  return AGE_BANDS.find((b) => b.id === id) ?? AGE_BANDS[4];
}

/** Age-adjusted ceiling in mg for one drug. */
export function ceilingMg(maxDose: DrugMaxDose, weightKg: number, band: AgeBand, withEpi: boolean): number {
  const mgPerKg = withEpi && maxDose.withEpiMgPerKg ? maxDose.withEpiMgPerKg : maxDose.plainMgPerKg;
  const absoluteCap = withEpi && maxDose.withEpiMaxMg ? maxDose.withEpiMaxMg : maxDose.plainMaxMg;
  return Math.min(weightKg * mgPerKg * band.modifier, absoluteCap);
}

export interface DrugLoad {
  drug: string;
  maxDose: DrugMaxDose;
  /** Milligrams from the low and high end of the selected blocks' volume ranges. */
  mgLow: number;
  mgHigh: number;
  ceiling: number;
  /** Fraction of this drug's ceiling used, at the high end of the ranges. */
  fractionHigh: number;
  fractionLow: number;
}

export interface CombinationDose {
  loads: DrugLoad[];
  /** Additive toxicity: sum of each drug's fraction of its own ceiling. */
  totalFractionLow: number;
  totalFractionHigh: number;
  verdict: "ok" | "caution" | "exceeds";
  unknownDrugs: string[];
}

export interface SelectedBlockDose {
  drug: string;
  concentrationPercent: number;
  volumeMlLow: number;
  volumeMlHigh: number;
}

export function computeCombinationDose(
  blocks: SelectedBlockDose[],
  weightKg: number,
  band: AgeBand,
  withEpi: boolean
): CombinationDose {
  const byDrug = new Map<string, { mgLow: number; mgHigh: number }>();
  const unknownDrugs: string[] = [];

  for (const b of blocks) {
    const mgPerMl = b.concentrationPercent * 10;
    const entry = byDrug.get(b.drug) ?? { mgLow: 0, mgHigh: 0 };
    entry.mgLow += b.volumeMlLow * mgPerMl;
    entry.mgHigh += b.volumeMlHigh * mgPerMl;
    byDrug.set(b.drug, entry);
  }

  const loads: DrugLoad[] = [];
  for (const [drug, mg] of byDrug) {
    const maxDose = findMaxDose(drug);
    if (!maxDose) {
      unknownDrugs.push(drug);
      continue;
    }
    const ceiling = ceilingMg(maxDose, weightKg, band, withEpi);
    loads.push({
      drug,
      maxDose,
      mgLow: mg.mgLow,
      mgHigh: mg.mgHigh,
      ceiling,
      fractionLow: ceiling > 0 ? mg.mgLow / ceiling : 0,
      fractionHigh: ceiling > 0 ? mg.mgHigh / ceiling : 0,
    });
  }

  const totalFractionLow = loads.reduce((s, l) => s + l.fractionLow, 0);
  const totalFractionHigh = loads.reduce((s, l) => s + l.fractionHigh, 0);

  const verdict: CombinationDose["verdict"] =
    totalFractionHigh >= 1 ? "exceeds" : totalFractionHigh >= 0.75 ? "caution" : "ok";

  return { loads, totalFractionLow, totalFractionHigh, verdict, unknownDrugs };
}

/**
 * The most useful number for a small patient: how many millilitres of a given
 * concentration the whole case can have, before anything is drawn up.
 */
export function maxTotalVolumeMl(
  drug: string,
  concentrationPercent: number,
  weightKg: number,
  band: AgeBand,
  withEpi: boolean
): number | null {
  const maxDose = findMaxDose(drug);
  if (!maxDose || concentrationPercent <= 0) return null;
  return ceilingMg(maxDose, weightKg, band, withEpi) / (concentrationPercent * 10);
}
