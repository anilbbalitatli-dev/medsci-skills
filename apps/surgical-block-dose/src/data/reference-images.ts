import { BlockOption, ReferenceImage } from "./types";

/**
 * Which reference images the app expects, and where they belong.
 *
 * Images are keyed by *technique*, not by surgery, so a single ultrasound
 * capture of (say) the TAP plane serves every surgery that uses a TAP block.
 * Until the file is registered in ./block-images.ts, each declared slot
 * renders as a labelled "pending" placeholder — so this file doubles as the
 * in-app checklist of what still needs to be sourced.
 *
 * `credit` must be replaced with the real source + license the moment an image
 * is added; the placeholder below is deliberately loud so an uncredited image
 * cannot ship unnoticed.
 */
const CREDIT_PENDING = "⚠ Kaynak/lisans bilgisi girilmedi";

export const USG: Record<string, ReferenceImage> = {
  adductorCanal: {
    key: "usg-adductor-canal",
    caption: "USG — Adduktor kanal: femoral arter, safen sinir, sartorius kası",
    credit: CREDIT_PENDING,
  },
  interscalene: {
    key: "usg-interscalene",
    caption: "USG — İnterskalen oluk: C5-C6-C7 kökleri, ön/orta skalen kaslar",
    credit: CREDIT_PENDING,
  },
  supraclavicular: {
    key: "usg-supraclavicular",
    caption: "USG — Supraklaviküler: subklavyen arter, pleksus demeti, 1. kot, plevra",
    credit: CREDIT_PENDING,
  },
  infraclavicular: {
    key: "usg-infraclavicular",
    caption: "USG — İnfraklaviküler: aksiller arter çevresinde lateral/posterior/medial kordlar",
    credit: CREDIT_PENDING,
  },
  poplitealSciatic: {
    key: "usg-popliteal-sciatic",
    caption: "USG — Popliteal fossa: siyatik sinirin tibial ve peroneal dallara ayrılma noktası",
    credit: CREDIT_PENDING,
  },
  tap: {
    key: "usg-tap",
    caption: "USG — TAP düzlemi: eksternal/internal oblik ve transversus abdominis kasları",
    credit: CREDIT_PENDING,
  },
  peng: {
    key: "usg-peng",
    caption: "USG — PENG: iliopubik eminens, psoas tendonu, femoral arter",
    credit: CREDIT_PENDING,
  },
  fasciaIliaca: {
    key: "usg-fascia-iliaca",
    caption: "USG — Fasya iliaka: sartorius, iliakus kası ve fasya iliaka düzlemi",
    credit: CREDIT_PENDING,
  },
  esp: {
    key: "usg-esp",
    caption: "USG — ESP: T5 ve T7 seviyesinde trapezius, romboid, erektor spina ve transvers çıkıntı",
    credit: "Park D, Chang MC. J Yeungnam Med Sci. 2022;39(3):190-199, Fig. 5 (CC BY-NC 4.0, ultrason panellerine kırpıldı)",
  },
  pecs2: {
    key: "usg-pecs2",
    caption: "USG — PECS: pektoralis majör/minör, serratus anterior, kotlar ve torakoakromiyal arter",
    credit: "Park D, Chang MC. J Yeungnam Med Sci. 2022;39(3):190-199, Fig. 6 (CC BY-NC 4.0, ultrason panellerine kırpıldı)",
  },
  paravertebral: {
    key: "usg-paravertebral",
    caption: "USG — Torasik paravertebral: transvers çıkıntı, plevra ve iğne yolu",
    credit: "Park D, Chang MC. J Yeungnam Med Sci. 2022;39(3):190-199, Fig. 3 (CC BY-NC 4.0, ultrason panellerine kırpıldı)",
  },
  intercostal: {
    key: "usg-intercostal",
    caption: "USG — İnterkostal: kotlar, interkostal arter ve kas tabakaları, plevra",
    credit: "Park D, Chang MC. J Yeungnam Med Sci. 2022;39(3):190-199, Fig. 4 (CC BY-NC 4.0, ultrason panellerine kırpıldı)",
  },
  serratus: {
    key: "usg-serratus",
    caption: "USG — Serratus düzlemi: latissimus dorsi, teres majör, serratus anterior ve kot",
    credit: "Park D, Chang MC. J Yeungnam Med Sci. 2022;39(3):190-199, Fig. 7 (CC BY-NC 4.0, ultrason panellerine kırpıldı)",
  },
  spinal: {
    key: "usg-spinal",
    caption: "USG — Lomber omurga: spinöz çıkıntılar ve interlaminar pencere",
    credit: CREDIT_PENDING,
  },
};

/** Anatomical plates for the dermatome reference screen. */
export const ANATOMY: Record<string, ReferenceImage> = {
  dermatomeAnterior: {
    key: "anatomy-dermatome-anterior",
    caption: "Dermatomlar — ön görünüm",
    credit: CREDIT_PENDING,
  },
  dermatomePosterior: {
    key: "anatomy-dermatome-posterior",
    caption: "Dermatomlar — arka görünüm",
    credit: CREDIT_PENDING,
  },
};

/**
 * Block id → images. Several ids share one image because they are the same
 * technique performed for different surgeries.
 */
const BY_BLOCK_ID: Record<string, ReferenceImage[]> = {
  "tka-acb": [USG.adductorCanal],
  "acl-acb": [USG.adductorCanal],
  "tka-spinal": [USG.spinal],
  "tha-spinal": [USG.spinal],
  "cs-spinal": [USG.spinal],
  "tha-peng": [USG.peng],
  "hipfx-peng": [USG.peng],
  "tha-fascia-iliaca": [USG.fasciaIliaca],
  "hipfx-fascia-iliaca": [USG.fasciaIliaca],
  "shoulder-interscalene": [USG.interscalene],
  "hand-supraclavicular": [USG.supraclavicular],
  "hand-infraclavicular": [USG.infraclavicular],
  "elbow-infraclavicular": [USG.infraclavicular],
  "ankle-popliteal": [USG.poplitealSciatic],
  "bka-sciatic": [USG.poplitealSciatic],
  "app-tap": [USG.tap],
  "cs-tap": [USG.tap],
  "hernia-tap": [USG.tap],
  "gynlap-tap": [USG.tap],
  "thora-esp": [USG.esp],
  "thora-paravertebral": [USG.paravertebral],
  "breast-paravertebral": [USG.paravertebral],
  "thora-intercostal": [USG.intercostal],
  "breast-serratus": [USG.serratus],
  "spine-esp": [USG.esp],
  "breast-pecs2": [USG.pecs2],
};

export function imagesForBlock(block: BlockOption): ReferenceImage[] {
  return block.images ?? BY_BLOCK_ID[block.id] ?? [];
}
