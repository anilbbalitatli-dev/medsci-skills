import { DermatomeLevel } from "./dermatome-figure";

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

/**
 * Coarse body regions, kept as supplementary metadata alongside the precise
 * `Coverage.levels` spinal segments that drive the dermatome figure.
 * Approximate/educational — real dermatomal boundaries vary between
 * individuals and overlap between adjacent nerves.
 */
export type BodyZone =
  | "head-neck"
  | "shoulder"
  | "upper-arm"
  | "forearm-hand"
  | "chest-upper"
  | "chest-lower"
  | "abdomen-upper"
  | "abdomen-mid"
  | "abdomen-lower"
  | "groin"
  | "thigh-anterior"
  | "thigh-medial"
  | "knee"
  | "lowerleg-anterior"
  | "foot-top"
  | "upper-back"
  | "lower-back"
  | "thigh-posterior"
  | "calf"
  | "heel-sole";

export interface Coverage {
  /** Approximate spinal segment levels, e.g. "L2–L4". */
  dermatomes: string;
  /** Plain-language description of expected motor block, if any. */
  motorEffect: string;
  /**
   * Segments to highlight on the ISNCSCI dermatome figure. Only C2-S1 exist in
   * that diagram — techniques covering S2-S5 (perineal) or non-segmental field
   * infiltration are described in `dermatomes` text instead and leave this empty.
   */
  levels?: DermatomeLevel[];
  frontZones?: BodyZone[];
  backZones?: BodyZone[];
}

/**
 * A real photographic/anatomical reference image (ultrasound capture,
 * anatomical plate). The actual file is resolved through the static asset
 * registry in ./block-images.ts by `key`.
 *
 * `credit` is REQUIRED and is always rendered under the image: every image in
 * this app must be either the author's own material, public domain, or under a
 * license that permits redistribution. Never add an image whose license you
 * cannot state on this line.
 */
export interface ReferenceImage {
  key: string;
  caption: string;
  credit: string;
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
  coverage: Coverage;
  images?: ReferenceImage[];
}

export interface BlockCombination {
  id: string;
  name: string;
  blockIds: string[];
  summary: string;
  score: TechniqueScore;
  doseWarning?: string;
  coverage: Coverage;
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
