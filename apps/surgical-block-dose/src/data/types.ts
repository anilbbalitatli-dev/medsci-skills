export type BlockRole = "primary" | "alternative" | "adjunct";

export interface LocalAnestheticChoice {
  drug: string;
  concentrationPercent: number;
  volumeMlRange: [number, number];
  note?: string;
}

/**
 * Safety/convenience scores (1-5, higher = better) are educational comparison
 * indicators derived from how the literature qualitatively describes each
 * technique (major-complication likelihood, depth/proximity to vulnerable
 * structures, performance time, landmark/ultrasound clarity). They are not
 * validated clinical risk scores and must not be used as one.
 */
export interface TechniqueScore {
  safety: number;
  convenience: number;
  rationale: string;
}

export interface BlockOption {
  id: string;
  name: string;
  role: BlockRole;
  summary: string;
  anesthetics: LocalAnestheticChoice[];
  landmarkNote?: string;
  contraindications?: string[];
  score: TechniqueScore;
}

export interface BlockCombination {
  id: string;
  name: string;
  blockIds: string[];
  summary: string;
  score: TechniqueScore;
  doseWarning?: string;
}

export interface Surgery {
  id: string;
  name: string;
  category: string;
  region: string;
  aliases: string[];
  blocks: BlockOption[];
  combinations?: BlockCombination[];
  clinicalNote?: string;
}

export interface DrugMaxDose {
  drug: string;
  plainMgPerKg: number;
  plainMaxMg: number;
  withEpiMgPerKg?: number;
  withEpiMaxMg?: number;
  source: string;
}
