import { DrugMaxDose } from "@/data/types";

export function concentrationToMgPerMl(concentrationPercent: number): number {
  return concentrationPercent * 10;
}

export function volumeRangeToMgRange(
  concentrationPercent: number,
  volumeMlRange: [number, number]
): [number, number] {
  const mgPerMl = concentrationToMgPerMl(concentrationPercent);
  return [volumeMlRange[0] * mgPerMl, volumeMlRange[1] * mgPerMl];
}

export function maxRecommendedMg(
  maxDose: DrugMaxDose,
  weightKg: number,
  withEpi: boolean
): number {
  const mgPerKg = withEpi && maxDose.withEpiMgPerKg ? maxDose.withEpiMgPerKg : maxDose.plainMgPerKg;
  const cap = withEpi && maxDose.withEpiMaxMg ? maxDose.withEpiMaxMg : maxDose.plainMaxMg;
  return Math.min(weightKg * mgPerKg, cap);
}
