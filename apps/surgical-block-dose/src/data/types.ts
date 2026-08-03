export type BlockRole = "primary" | "alternative" | "adjunct";

export interface LocalAnestheticChoice {
  drug: string;
  concentrationPercent: number;
  volumeMlRange: [number, number];
  note?: string;
}

export interface BlockOption {
  id: string;
  name: string;
  role: BlockRole;
  summary: string;
  anesthetics: LocalAnestheticChoice[];
  landmarkNote?: string;
}

export interface Surgery {
  id: string;
  name: string;
  category: string;
  aliases: string[];
  blocks: BlockOption[];
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
