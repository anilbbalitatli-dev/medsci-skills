import { COVERAGE } from "./coverage-presets";
import { Coverage, LocalAnestheticChoice } from "./types";

/**
 * Canonical, de-duplicated catalogue of the individual techniques the app
 * knows about.
 *
 * `SURGERIES` lists blocks per operation, so the same technique appears many
 * times (TAP under four surgeries, spinal under five) and sometimes under
 * slightly different names. The combination builder needs one entry per
 * technique, so it reads from here rather than de-duplicating by name.
 *
 * `typical` is the commonly cited adult single-shot regimen — the starting
 * point for the dose arithmetic, not a prescription. Paediatric volumes are
 * weight-scaled and do NOT follow these adult figures; see ./age-dosing.ts.
 */
export interface Technique {
  id: string;
  name: string;
  region: string;
  typical: LocalAnestheticChoice;
  coverage: Coverage;
  /** Per-side technique that is usually performed bilaterally. */
  bilateralByDefault?: boolean;
  note?: string;
}

export const TECHNIQUES: Technique[] = [
  // ---- Alt ekstremite -------------------------------------------------
  {
    id: "acb",
    name: "Adduktor Kanal Bloğu (ACB)",
    region: "Alt Ekstremite",
    typical: { drug: "Ropivakain", concentrationPercent: 0.2, volumeMlRange: [15, 20] },
    coverage: COVERAGE.acb,
  },
  {
    id: "ipack",
    name: "IPACK Bloğu",
    region: "Alt Ekstremite",
    typical: { drug: "Ropivakain", concentrationPercent: 0.2, volumeMlRange: [10, 15] },
    coverage: COVERAGE.ipack,
  },
  {
    id: "femoral",
    name: "Femoral Sinir Bloğu",
    region: "Alt Ekstremite",
    typical: { drug: "Ropivakain", concentrationPercent: 0.5, volumeMlRange: [15, 20] },
    coverage: COVERAGE.femoral,
  },
  {
    id: "sciatic-popliteal",
    name: "Siyatik Sinir Bloğu (Popliteal)",
    region: "Alt Ekstremite",
    typical: { drug: "Ropivakain", concentrationPercent: 0.5, volumeMlRange: [15, 20] },
    coverage: COVERAGE.poplitealSciatic,
  },
  {
    id: "saphenous",
    name: "Safen Sinir Bloğu",
    region: "Alt Ekstremite",
    typical: { drug: "Ropivakain", concentrationPercent: 0.5, volumeMlRange: [5, 10] },
    coverage: COVERAGE.saphenous,
  },
  {
    id: "ankle-block",
    name: "Ayak Bileği Bloğu (5 sinir)",
    region: "Alt Ekstremite",
    typical: { drug: "Lidokain", concentrationPercent: 1, volumeMlRange: [12, 18] },
    coverage: COVERAGE.ankleBlock,
  },
  {
    id: "peng",
    name: "PENG Bloğu",
    region: "Alt Ekstremite",
    typical: { drug: "Ropivakain", concentrationPercent: 0.2, volumeMlRange: [20, 25] },
    coverage: COVERAGE.peng,
  },
  {
    id: "fascia-iliaca",
    name: "Fasya İliaka Bloğu",
    region: "Alt Ekstremite",
    typical: { drug: "Ropivakain", concentrationPercent: 0.2, volumeMlRange: [30, 40] },
    coverage: COVERAGE.fasciaIliaca,
  },
  {
    id: "spinal",
    name: "Spinal Anestezi",
    region: "Nöraksiyel",
    typical: { drug: "Bupivakain (hiperbarik)", concentrationPercent: 0.5, volumeMlRange: [2.5, 3.5] },
    coverage: COVERAGE.spinalLowerLimb,
    note: "İntratekal doz, periferik blok dozlarından bağımsız değerlendirilir; toplam sistemik yük hesabına yine de dahil edilir.",
  },
  {
    id: "caudal",
    name: "Kaudal Blok",
    region: "Nöraksiyel",
    typical: { drug: "Ropivakain", concentrationPercent: 0.2, volumeMlRange: [10, 20] },
    coverage: COVERAGE.caudal,
    note: "Pediatrik hacim genellikle Armitage'a göre 0.5–1.25 mL/kg olarak hesaplanır; buradaki erişkin hacmi çocukta geçerli değildir.",
  },

  // ---- Üst ekstremite -------------------------------------------------
  {
    id: "interscalene",
    name: "İnterskalen Brakiyal Pleksus Bloğu",
    region: "Üst Ekstremite",
    typical: { drug: "Ropivakain", concentrationPercent: 0.5, volumeMlRange: [15, 20] },
    coverage: COVERAGE.interscalene,
  },
  {
    id: "suprascapular",
    name: "Suprascapular Sinir Bloğu",
    region: "Üst Ekstremite",
    typical: { drug: "Ropivakain", concentrationPercent: 0.5, volumeMlRange: [5, 10] },
    coverage: COVERAGE.suprascapular,
  },
  {
    id: "axillary-nerve",
    name: "Aksiller Sinir Bloğu",
    region: "Üst Ekstremite",
    typical: { drug: "Ropivakain", concentrationPercent: 0.5, volumeMlRange: [5, 10] },
    coverage: COVERAGE.axillaryNerve,
  },
  {
    id: "supraclavicular",
    name: "Supraklaviküler Brakiyal Pleksus Bloğu",
    region: "Üst Ekstremite",
    typical: { drug: "Ropivakain", concentrationPercent: 0.5, volumeMlRange: [20, 30] },
    coverage: COVERAGE.supraclavicular,
  },
  {
    id: "infraclavicular",
    name: "İnfraklaviküler Brakiyal Pleksus Bloğu",
    region: "Üst Ekstremite",
    typical: { drug: "Ropivakain", concentrationPercent: 0.5, volumeMlRange: [20, 30] },
    coverage: COVERAGE.infraclavicular,
  },
  {
    id: "axillary-plexus",
    name: "Aksiller Brakiyal Pleksus Bloğu",
    region: "Üst Ekstremite",
    typical: { drug: "Ropivakain", concentrationPercent: 0.5, volumeMlRange: [20, 30] },
    coverage: COVERAGE.axillaryPlexus,
  },
  {
    id: "ivra",
    name: "Bier Bloğu (IVRA)",
    region: "Üst Ekstremite",
    typical: { drug: "Lidokain (epinefrinsiz)", concentrationPercent: 0.5, volumeMlRange: [40, 50] },
    coverage: COVERAGE.ivra,
    note: "Turnike erken sönerse tüm doz aniden sistemik dolaşıma geçer; başka blokla kombine edilmesi önerilmez.",
  },

  // ---- Karın duvarı ---------------------------------------------------
  {
    id: "tap",
    name: "TAP Bloğu",
    region: "Karın Duvarı",
    typical: { drug: "Ropivakain", concentrationPercent: 0.375, volumeMlRange: [15, 20] },
    coverage: COVERAGE.tap,
    bilateralByDefault: true,
  },
  {
    id: "rectus-sheath",
    name: "Rektus Kılıf Bloğu",
    region: "Karın Duvarı",
    typical: { drug: "Ropivakain", concentrationPercent: 0.25, volumeMlRange: [10, 15] },
    coverage: COVERAGE.rectusSheath,
    bilateralByDefault: true,
  },
  {
    id: "ilioinguinal",
    name: "İlioinguinal–İliohipogastrik Blok",
    region: "Karın Duvarı",
    typical: { drug: "Ropivakain", concentrationPercent: 0.25, volumeMlRange: [10, 15] },
    coverage: COVERAGE.ilioinguinal,
  },
  {
    id: "port-site",
    name: "Port Yeri İnfiltrasyonu",
    region: "Karın Duvarı",
    typical: { drug: "Ropivakain", concentrationPercent: 0.5, volumeMlRange: [3, 5] },
    coverage: COVERAGE.portSiteInfiltration,
  },

  // ---- Toraks / göğüs duvarı -----------------------------------------
  {
    id: "pecs2",
    name: "PECS II Bloğu",
    region: "Toraks",
    typical: { drug: "Ropivakain", concentrationPercent: 0.375, volumeMlRange: [20, 30] },
    coverage: COVERAGE.pecs2,
  },
  {
    id: "serratus",
    name: "Serratus Anterior Plan Bloğu",
    region: "Toraks",
    typical: { drug: "Ropivakain", concentrationPercent: 0.375, volumeMlRange: [20, 30] },
    coverage: COVERAGE.serratus,
  },
  {
    id: "paravertebral",
    name: "Torasik Paravertebral Blok",
    region: "Toraks",
    typical: { drug: "Ropivakain", concentrationPercent: 0.5, volumeMlRange: [15, 20] },
    coverage: COVERAGE.paravertebralThoracotomy,
  },
  {
    id: "esp-thoracic",
    name: "Erektor Spina Plan Bloğu (Torasik)",
    region: "Toraks",
    typical: { drug: "Ropivakain", concentrationPercent: 0.375, volumeMlRange: [20, 30] },
    coverage: COVERAGE.espThoracotomy,
  },
  {
    id: "intercostal",
    name: "İnterkostal Sinir Bloğu",
    region: "Toraks",
    typical: { drug: "Ropivakain", concentrationPercent: 0.5, volumeMlRange: [3, 5] },
    coverage: COVERAGE.intercostal,
    note: "Hacim seviye başınadır; çok seviyeli uygulamada toplam doz hızla artar.",
  },

  // ---- Omurga / baş-boyun / diğer -------------------------------------
  {
    id: "esp-lumbar",
    name: "Erektor Spina Plan Bloğu (Lomber)",
    region: "Omurga",
    typical: { drug: "Ropivakain", concentrationPercent: 0.375, volumeMlRange: [20, 30] },
    coverage: COVERAGE.espLumbar,
    bilateralByDefault: true,
  },
  {
    id: "wound-infiltration",
    name: "Cerrahi Yara İnfiltrasyonu",
    region: "Omurga",
    typical: { drug: "Ropivakain", concentrationPercent: 0.5, volumeMlRange: [15, 20] },
    coverage: COVERAGE.woundInfiltration,
  },
  {
    id: "scpb",
    name: "Yüzeyel Servikal Pleksus Bloğu",
    region: "Baş-Boyun",
    typical: { drug: "Ropivakain", concentrationPercent: 0.375, volumeMlRange: [10, 15] },
    coverage: COVERAGE.scpb,
    bilateralByDefault: true,
  },
  {
    id: "penile",
    name: "Dorsal Penil Sinir Bloğu",
    region: "Ürogenital",
    typical: { drug: "Lidokain (epinefrinsiz)", concentrationPercent: 1, volumeMlRange: [2, 5] },
    coverage: COVERAGE.penileBlock,
    note: "Uç organ — epinefrinli solüsyon kullanılmaz.",
  },
];

export const TECHNIQUE_REGIONS = Array.from(new Set(TECHNIQUES.map((t) => t.region)));

export function techniqueById(id: string): Technique | undefined {
  return TECHNIQUES.find((t) => t.id === id);
}
