import { DrugMaxDose } from "./types";

/**
 * Reference maximum single-dose limits, as commonly cited in regional anesthesia
 * references (e.g. NYSORA, BJA Education, Miller's Anesthesia). These are general
 * teaching figures, not a substitute for institutional protocol or the drug's
 * official prescribing information — confirm both before clinical use.
 */
export const MAX_DOSES: DrugMaxDose[] = [
  {
    drug: "Lidokain",
    plainMgPerKg: 4.5,
    plainMaxMg: 300,
    withEpiMgPerKg: 7,
    withEpiMaxMg: 500,
    source: "NYSORA / BJA Education — genel referans",
  },
  {
    drug: "Bupivakain",
    plainMgPerKg: 2,
    plainMaxMg: 150,
    withEpiMgPerKg: 2.5,
    withEpiMaxMg: 175,
    source: "NYSORA / BJA Education — genel referans",
  },
  {
    drug: "Levobupivakain",
    plainMgPerKg: 2,
    plainMaxMg: 150,
    source: "NYSORA / BJA Education — genel referans",
  },
  {
    drug: "Ropivakain",
    plainMgPerKg: 3,
    plainMaxMg: 200,
    source: "NYSORA / BJA Education — genel referans",
  },
  {
    drug: "Mepivakain",
    plainMgPerKg: 4.4,
    plainMaxMg: 300,
    withEpiMgPerKg: 7,
    withEpiMaxMg: 500,
    source: "NYSORA / BJA Education — genel referans",
  },
  {
    drug: "Prilokain",
    plainMgPerKg: 6,
    plainMaxMg: 400,
    withEpiMgPerKg: 8,
    withEpiMaxMg: 600,
    source: "NYSORA / BJA Education — genel referans",
  },
];

export function findMaxDose(drug: string): DrugMaxDose | undefined {
  return MAX_DOSES.find((d) => drug.toLowerCase().startsWith(d.drug.toLowerCase()));
}
