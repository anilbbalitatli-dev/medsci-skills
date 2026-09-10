/**
 * Paediatric local anaesthetic ceilings, as the guidelines actually state them.
 *
 * The structural point, and the reason this file exists separately from
 * ./max-doses.ts: **neither guideline gives one maximum per drug.** Both set the
 * limit per *technique*. Ropivacaine is capped at 2 mg/kg caudally, 1.7 mg/kg
 * epidurally, 0.5 mg/kg intrathecally and 0.75 mg/kg in a fascial plane — those
 * are four different numbers for one drug, and a `maxDose[drug]` table cannot
 * express any of them. So the lookup here is keyed by (category, drug).
 *
 * Two sources, and they disagree in places. ESRA/ASRA is treated as primary
 * because it is the peer-reviewed joint document with locatable page numbers;
 * SFAR/ADARPEF is recorded alongside it and every disagreement is listed in
 * CONFLICTS rather than being averaged away or silently dropped. Where a
 * guideline says nothing, this file says nothing — see GAPS.
 *
 * Sources
 * -------
 * [A] Suresh S, Ecoffey C, Bosenberg A, Lonnqvist PA, de Oliveira GS Jr,
 *     de Leon Casasola O, de Andrés J, Ivani G. ESRA/ASRA Recommendations on
 *     Local Anesthetics and Adjuvants Dosage in Pediatric Regional Anesthesia.
 *     Reg Anesth Pain Med. 2018;43(2):211-216. doi:10.1097/AAP.0000000000000702
 *
 * [B] SFAR / ADARPEF. Recommandations Formalisées d'Experts — Anesthésie
 *     loco-régionale en pédiatrie, Question 1, sections 1-4. (The retrieved PDF
 *     carried no publication year or page numbers, so entries cite the section
 *     number; the text places the underlying literature at 2008-2009.)
 *
 * Known objection: Tsui BCH, Boretsky K, Berde C. Maximum Recommended Dosage of
 * Ropivacaine and Bupivacaine for Pediatric Regional Anesthesia. Reg Anesth Pain
 * Med. 2018;43(8):895-896 (PMID 30339619) is a published letter contesting [A]'s
 * maxima. Its full text has not been read and none of its figures appear here.
 */

export type BlockCategory =
  | "caudal"
  | "epidural"
  | "spinal"
  | "psb-upper"
  | "psb-lower"
  | "fascial-plane"
  /** No guideline in this file covers the technique. */
  | "not-covered";

export const CATEGORY_LABELS: Record<BlockCategory, string> = {
  caudal: "Kaudal blok",
  epidural: "Epidural (lomber / torasik)",
  spinal: "Spinal (intratekal)",
  "psb-upper": "Periferik sinir bloğu — üst ekstremite",
  "psb-lower": "Periferik sinir bloğu — alt ekstremite",
  "fascial-plane": "Fasyal plan bloğu",
  "not-covered": "Kılavuz kapsamı dışında",
};

export const SOURCE_A =
  "ESRA/ASRA 2018 — Suresh ve ark. Reg Anesth Pain Med. 2018;43(2):211-216";
export const SOURCE_B = "SFAR/ADARPEF — RFE Anesthésie loco-régionale en pédiatrie, Soru 1";

export interface PediatricSingleShotLimit {
  category: BlockCategory;
  /** Matched against the technique's drug name by prefix, as in max-doses.ts. */
  drug: string;
  /** Lower end where the guideline quotes a range; the ceiling is mgPerKg. */
  mgPerKgLow?: number;
  mgPerKg: number;
  source: string;
  note?: string;
}

/**
 * Single-shot ceilings from [A]. Ranges are reproduced as ranges: the guideline
 * quotes 0.5-1.5 mg/kg for a limb block, and flattening that to its top would
 * quietly turn a range into a target.
 */
export const PEDIATRIC_SINGLE_SHOT: PediatricSingleShotLimit[] = [
  // ---- Kaudal ----
  { category: "caudal", drug: "Ropivakain", mgPerKg: 2, source: `${SOURCE_A}, s.213` },
  { category: "caudal", drug: "Bupivakain", mgPerKg: 2.5, source: `${SOURCE_A}, s.213` },
  { category: "caudal", drug: "Levobupivakain", mgPerKg: 2.5, source: `${SOURCE_A}, s.213` },

  // ---- Epidural ----
  { category: "epidural", drug: "Ropivakain", mgPerKg: 1.7, source: `${SOURCE_A}, s.213` },
  { category: "epidural", drug: "Bupivakain", mgPerKg: 1.7, source: `${SOURCE_A}, s.213` },
  { category: "epidural", drug: "Levobupivakain", mgPerKg: 1.7, source: `${SOURCE_A}, s.213` },

  // ---- Spinal ----
  {
    category: "spinal",
    drug: "Ropivakain",
    mgPerKg: 0.5,
    source: `${SOURCE_A}, s.213`,
  },
  {
    category: "spinal",
    drug: "Bupivakain",
    mgPerKg: 1,
    source: `${SOURCE_A}, s.212`,
    note: "Ağırlığa göre değişir — aşağıdaki ağırlık tablosuna bakın. Buradaki değer en küçük hasta (<5 kg) içindir.",
  },

  // ---- Periferik sinir blokları ----
  {
    category: "psb-upper",
    drug: "Ropivakain",
    mgPerKgLow: 0.5,
    mgPerKg: 1.5,
    source: `${SOURCE_A}, s.213`,
  },
  {
    category: "psb-upper",
    drug: "Bupivakain",
    mgPerKgLow: 0.5,
    mgPerKg: 1.5,
    source: `${SOURCE_A}, s.213`,
  },
  {
    category: "psb-upper",
    drug: "Levobupivakain",
    mgPerKgLow: 0.5,
    mgPerKg: 1.5,
    source: `${SOURCE_A}, s.213`,
  },
  {
    category: "psb-lower",
    drug: "Ropivakain",
    mgPerKgLow: 0.5,
    mgPerKg: 1.5,
    source: `${SOURCE_A}, s.213`,
  },
  {
    category: "psb-lower",
    drug: "Bupivakain",
    mgPerKgLow: 0.5,
    mgPerKg: 1.5,
    source: `${SOURCE_A}, s.213`,
  },

  // ---- Fasyal plan ----
  {
    category: "fascial-plane",
    drug: "Ropivakain",
    mgPerKgLow: 0.25,
    mgPerKg: 0.75,
    source: `${SOURCE_A}, s.213`,
  },
  {
    category: "fascial-plane",
    drug: "Bupivakain",
    mgPerKgLow: 0.25,
    mgPerKg: 0.75,
    source: `${SOURCE_A}, s.213`,
  },
];

/** Spinal bupivacaine 0.5%, identical in both guidelines. */
export const SPINAL_BUPIVACAINE_BY_WEIGHT = [
  { label: "<5 kg", maxWeightKg: 5, mgPerKg: 1 },
  { label: "5–15 kg", maxWeightKg: 15, mgPerKg: 0.4 },
  { label: ">15 kg", maxWeightKg: Infinity, mgPerKg: 0.3 },
] as const;

export const SPINAL_BUPIVACAINE_SOURCE = `${SOURCE_A}, s.212 · ${SOURCE_B} 1-4-1-2`;

/**
 * Continuous infusion. The builder is single-shot only, so nothing computes
 * against this — it exists for the reference screen, where a clinician running
 * a catheter needs it and would otherwise reach for a worse source.
 */
export interface PediatricInfusionLimit {
  route: "epidural" | "perineural";
  drug: string;
  ageLabel: string;
  mgPerKgPerHour: number;
  source: string;
}

export const PEDIATRIC_INFUSION: PediatricInfusionLimit[] = [
  // [A] — bands: <3 ay / 3 ay–1 yaş / >1 yaş
  { route: "epidural", drug: "Bupivakain / levobupivakain", ageLabel: "<3 ay", mgPerKgPerHour: 0.2, source: `${SOURCE_A}, s.213` },
  { route: "epidural", drug: "Bupivakain / levobupivakain", ageLabel: "3 ay – 1 yaş", mgPerKgPerHour: 0.3, source: `${SOURCE_A}, s.213` },
  { route: "epidural", drug: "Bupivakain / levobupivakain", ageLabel: ">1 yaş", mgPerKgPerHour: 0.4, source: `${SOURCE_A}, s.213` },
  { route: "epidural", drug: "Ropivakain", ageLabel: "<3 ay", mgPerKgPerHour: 0.2, source: `${SOURCE_A}, s.213` },
  { route: "epidural", drug: "Ropivakain", ageLabel: "3 ay – 1 yaş", mgPerKgPerHour: 0.3, source: `${SOURCE_A}, s.213` },
  { route: "epidural", drug: "Ropivakain", ageLabel: ">1 yaş", mgPerKgPerHour: 0.4, source: `${SOURCE_A}, s.213` },
  { route: "perineural", drug: "Ropivakain / bupivakain %0.2", ageLabel: "yaş ayrımı yok", mgPerKgPerHour: 0.3, source: `${SOURCE_A}, s.213-214 (0.1–0.3 aralığı)` },

  // [B] — bands: <1 ay / <6 ay / >6 ay
  { route: "epidural", drug: "Ropivakain", ageLabel: "<1 ay", mgPerKgPerHour: 0.2, source: `${SOURCE_B} 1-4-2` },
  { route: "epidural", drug: "Ropivakain", ageLabel: "<6 ay", mgPerKgPerHour: 0.3, source: `${SOURCE_B} 1-4-2` },
  { route: "epidural", drug: "Ropivakain", ageLabel: ">6 ay", mgPerKgPerHour: 0.4, source: `${SOURCE_B} 1-4-2` },
  { route: "perineural", drug: "Ropivakain", ageLabel: "<1 ay / <6 ay / >6 ay", mgPerKgPerHour: 0.4, source: `${SOURCE_B} 1-4-2 (epidural ile aynı bantlar: 0.20 / 0.30 / 0.40)` },
];

export const INFUSION_CONCENTRATION_NOTE =
  "Ropivakain epidural infüzyonda konsantrasyon sınırı: çocukta ≤2 mg/mL, süt çocuğunda 1 mg/mL " +
  `(${SOURCE_B} 1-4-2).`;

/**
 * Where the two guidelines give different answers. These are shown rather than
 * resolved: picking one silently would hide that the question is open.
 */
export const CONFLICTS: { topic: string; a: string; b: string }[] = [
  {
    topic: "İnfüzyon yaş bantları",
    a: "<3 ay 0.2 · 3 ay–1 yaş 0.3 · >1 yaş 0.4 mg/kg/sa",
    b: "<1 ay 0.2 · <6 ay 0.3 · >6 ay 0.4 mg/kg/sa",
  },
  {
    topic: "Perinöral infüzyon tavanı",
    a: "Tüm yaşlarda 0.1–0.3 mg/kg/sa",
    b: ">6 ayda 0.40 mg/kg/sa'e izin veriyor",
  },
  {
    topic: "Kaudal levobupivakain",
    a: "2.5 mg/kg",
    b: "2 mg/kg",
  },
  {
    topic: "Periferik blok tek doz tavanı",
    a: "0.5–1.5 mg/kg",
    b: "Hacim sınırı 0.5 mL/kg — ropivakain %0.2'de ≈1.0, levobupivakain %0.25'te ≈1.25 mg/kg'a denk gelir",
  },
  {
    topic: "Rasemik bupivakainin yeri",
    a: "Kaudal, epidural ve periferik blok için doz vermeye devam ediyor",
    b: "Kullanımı 'muhtemelen' yalnızca spinal ile sınırlanmalı",
  },
];

/** Questions the sources in this file do not answer. */
export const GAPS: { topic: string; detail: string }[] = [
  {
    topic: "Lidokain",
    detail:
      "Her iki kılavuz da pediatrik lidokain için mg/kg sınırı vermiyor. Lidokain içeren teknikler bu ekranda kılavuz sınırı olmadan gösterilir; erişkin sınırının ağırlıkla ölçeklenmesi bu uygulamanın kendi ihtiyatlı varsayımıdır, kılavuz değildir.",
  },
  {
    topic: "Prematüre / düşük doğum ağırlığı",
    detail:
      "Ayrı bir doz önerisi bulunamadı. ESRA/ASRA prematürede spinal blok süresinin term bebeğe göre farklı olduğunu belirtir ama doz vermez; SFAR/ADARPEF 44–60 hafta postkonsepsiyonel yaşta apne riskini ele alır, doz vermez.",
  },
  {
    topic: "Kombinasyon tavanı",
    detail:
      "Her iki kılavuz da sınırları tek bir teknik için verir. Birden fazla bloğun toplamı için sayısal bir tavan yoktur. Bu uygulamadaki toplam doz hesabı, toksisitenin toplandığı ilkesine dayanan kendi ihtiyatlı kuralımızdır — kılavuz kaynaklı değildir.",
  },
  {
    topic: "Torakal ve gövde plan blokları",
    detail:
      "ESRA/ASRA'nın fasyal plan örnekleri rektus kılıfı, TAP ve fasya iliakadır. Paravertebral, ESP, PECS, serratus ve interkostal blokları adıyla saymaz; bu uygulamada bunlara fasyal plan sınırı benzeşim yoluyla uygulanır ve arayüzde 'benzeşim' olarak işaretlenir.",
  },
];

/**
 * Which guideline category a technique falls under.
 *
 * `basis` separates the techniques a guideline names outright from the ones
 * classed by analogy. That distinction is the difference between quoting a
 * source and extending it, and the UI shows which one is happening.
 */
export interface TechniqueCategory {
  category: BlockCategory;
  basis: "explicit" | "inferred";
}

export const TECHNIQUE_CATEGORY: Record<string, TechniqueCategory> = {
  // Named in [A]'s own lists
  caudal: { category: "caudal", basis: "explicit" },
  spinal: { category: "spinal", basis: "explicit" },
  "epidural-lumbar": { category: "epidural", basis: "explicit" },
  "epidural-thoracic": { category: "epidural", basis: "explicit" },
  femoral: { category: "psb-lower", basis: "explicit" },
  "sciatic-popliteal": { category: "psb-lower", basis: "explicit" },
  acb: { category: "psb-lower", basis: "explicit" },
  interscalene: { category: "psb-upper", basis: "explicit" },
  supraclavicular: { category: "psb-upper", basis: "explicit" },
  infraclavicular: { category: "psb-upper", basis: "explicit" },
  "axillary-plexus": { category: "psb-upper", basis: "explicit" },
  tap: { category: "fascial-plane", basis: "explicit" },
  "rectus-sheath": { category: "fascial-plane", basis: "explicit" },
  "fascia-iliaca": { category: "fascial-plane", basis: "explicit" },

  // Same class of block, not named in the guideline
  "sciatic-subgluteal": { category: "psb-lower", basis: "inferred" },
  obturator: { category: "psb-lower", basis: "inferred" },
  genicular: { category: "psb-lower", basis: "inferred" },
  "quadratus-lumborum": { category: "fascial-plane", basis: "inferred" },
  "wrist-block": { category: "psb-upper", basis: "inferred" },
  pecs1: { category: "fascial-plane", basis: "inferred" },
  parasternal: { category: "fascial-plane", basis: "inferred" },
  "deep-cervical": { category: "psb-upper", basis: "inferred" },
  "scalp-block": { category: "psb-upper", basis: "inferred" },
  pudendal: { category: "psb-lower", basis: "inferred" },
  saphenous: { category: "psb-lower", basis: "inferred" },
  "ankle-block": { category: "psb-lower", basis: "inferred" },
  suprascapular: { category: "psb-upper", basis: "inferred" },
  "axillary-nerve": { category: "psb-upper", basis: "inferred" },
  scpb: { category: "psb-upper", basis: "inferred" },
  penile: { category: "psb-lower", basis: "inferred" },
  ipack: { category: "fascial-plane", basis: "inferred" },
  peng: { category: "fascial-plane", basis: "inferred" },
  ilioinguinal: { category: "fascial-plane", basis: "inferred" },
  pecs2: { category: "fascial-plane", basis: "inferred" },
  serratus: { category: "fascial-plane", basis: "inferred" },
  paravertebral: { category: "fascial-plane", basis: "inferred" },
  "esp-thoracic": { category: "fascial-plane", basis: "inferred" },
  "esp-lumbar": { category: "fascial-plane", basis: "inferred" },
  intercostal: { category: "fascial-plane", basis: "inferred" },

  // Nothing in these guidelines applies
  ivra: { category: "not-covered", basis: "explicit" },
  digital: { category: "not-covered", basis: "explicit" },
  "port-site": { category: "not-covered", basis: "explicit" },
  "wound-infiltration": { category: "not-covered", basis: "explicit" },
  // Tumescent dosing follows its own literature entirely — dilute solution with
  // epinephrine, subcutaneous, delayed peak — and neither guideline addresses it.
  tumescent: { category: "not-covered", basis: "explicit" },
};

/** Drug names in the catalogue carry qualifiers ("Bupivakain (hiperbarik)"). */
function drugMatches(catalogueDrug: string, limitDrug: string): boolean {
  return catalogueDrug.toLowerCase().startsWith(limitDrug.toLowerCase());
}

export function pediatricLimitFor(
  techniqueId: string,
  drug: string
): PediatricSingleShotLimit | undefined {
  const cat = TECHNIQUE_CATEGORY[techniqueId];
  if (!cat || cat.category === "not-covered") return undefined;
  return PEDIATRIC_SINGLE_SHOT.find(
    (l) => l.category === cat.category && drugMatches(drug, l.drug)
  );
}

/** Spinal bupivacaine is the one limit that reads off weight, not category. */
export function spinalBupivacaineMgPerKg(weightKg: number): number {
  return (
    SPINAL_BUPIVACAINE_BY_WEIGHT.find((b) => weightKg < b.maxWeightKg)?.mgPerKg ??
    SPINAL_BUPIVACAINE_BY_WEIGHT[SPINAL_BUPIVACAINE_BY_WEIGHT.length - 1].mgPerKg
  );
}

export type PediatricVerdict = "within" | "over" | "no-guideline";

export interface PediatricBlockCheck {
  techniqueId: string;
  techniqueName: string;
  drug: string;
  category: BlockCategory;
  basis: "explicit" | "inferred";
  /** Milligrams the technique's typical regimen delivers, low and high. */
  mgLow: number;
  mgHigh: number;
  mgPerKgLow: number;
  mgPerKgHigh: number;
  limit?: PediatricSingleShotLimit;
  /** The ceiling in mg for this patient, when a guideline supplies one. */
  ceilingMg?: number;
  verdict: PediatricVerdict;
}

export interface PediatricBlockInput {
  techniqueId: string;
  techniqueName: string;
  drug: string;
  mgLow: number;
  mgHigh: number;
}

/**
 * Checks each block against its own guideline ceiling.
 *
 * Deliberately per block rather than summed: this is what the guidelines
 * actually state, and reporting it separately from the additive total keeps the
 * sourced check distinct from this app's own combination rule.
 */
export function checkPediatricBlocks(
  blocks: PediatricBlockInput[],
  weightKg: number
): PediatricBlockCheck[] {
  return blocks.map((b) => {
    const cat = TECHNIQUE_CATEGORY[b.techniqueId] ?? {
      category: "not-covered" as BlockCategory,
      basis: "explicit" as const,
    };
    const limit = pediatricLimitFor(b.techniqueId, b.drug);

    let mgPerKg = limit?.mgPerKg;
    if (cat.category === "spinal" && limit && drugMatches(b.drug, "Bupivakain")) {
      mgPerKg = spinalBupivacaineMgPerKg(weightKg);
    }

    const ceiling = mgPerKg !== undefined ? mgPerKg * weightKg : undefined;
    const verdict: PediatricVerdict =
      ceiling === undefined ? "no-guideline" : b.mgHigh > ceiling ? "over" : "within";

    return {
      techniqueId: b.techniqueId,
      techniqueName: b.techniqueName,
      drug: b.drug,
      category: cat.category,
      basis: cat.basis,
      mgLow: b.mgLow,
      mgHigh: b.mgHigh,
      mgPerKgLow: weightKg > 0 ? b.mgLow / weightKg : 0,
      mgPerKgHigh: weightKg > 0 ? b.mgHigh / weightKg : 0,
      limit: limit && mgPerKg !== undefined ? { ...limit, mgPerKg } : limit,
      ceilingMg: ceiling,
      verdict,
    };
  });
}
