import { BLOCK_TECHNIQUE } from "./block-technique";
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
export const CREDIT_PENDING = "⚠ Kaynak/lisans bilgisi girilmedi";

/**
 * Muse et al. is CC BY 4.0, so unlike the CC BY-NC images elsewhere in this
 * file these may be used commercially. Only the authors' own ultrasound
 * captures are taken — that paper's Figures 1, 2 and 7 carry "reproduced with
 * permission" lines from other publishers, which puts them outside its licence.
 */
const JCM_2024 = (figure: string) =>
  `Muse IO, Deiling B, Grinman L, Hadeed MM, Elkassabany N. J Clin Med. 2024;13(12):3457, ${figure} (CC BY 4.0)`;

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
    caption:
      "USG — PENG: AIIS, iliopubik eminens (IPE), psoas tendonu; femoral sinir (FN) ve arter (FA) medialde",
    credit: JCM_2024("Fig. 6"),
  },
  fasciaIliaca: {
    key: "usg-fascia-iliaca",
    caption:
      "USG — Supra-inguinal fasya iliaka (SIFI): fasya iliaka düzlemi, iliakus kası, sartorius; DCIA landmark",
    credit: JCM_2024("Fig. 3"),
  },
  lfcn: {
    key: "usg-lfcn",
    caption:
      "USG — Lateral femoral kutanöz sinir (LFCN): sartorius ile tensor fascia latae arasında; fasya iliaka bloğunun hedeflerinden biri",
    credit: JCM_2024("Fig. 5"),
  },
  femoral: {
    key: "usg-femoral",
    caption:
      "USG — Femoral sinir (FN), femoral arter (FA) ve ven (FV); fasya iliaka düzlemi ve iliopsoas kası",
    credit: JCM_2024("Fig. 4"),
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

  // ---- Genişletme ile eklenen teknikler ----
  // Bu yuvalarda henüz gerçek ultrason görüntüsü yok; blok kartları şematik
  // sonoanatomi çizimine düşer (kaynak kısıtı olmayan, bu depoya özgü çizimler).
  quadratusLumborum: {
    key: "usg-quadratus-lumborum",
    caption: "USG — QL: transvers çıkıntı çevresinde erektör spina, quadratus lumborum ve psoas",
    credit: CREDIT_PENDING,
  },
  sciaticSubgluteal: {
    key: "usg-sciatic-subgluteal",
    caption: "USG — Subgluteal aralık: büyük trokanter, iskial tuberositas ve siyatik sinir",
    credit: CREDIT_PENDING,
  },
  obturator: {
    key: "usg-obturator",
    caption: "USG — İnteradduktor düzlem: adduktor longus, brevis ve magnus arasında ön/arka dallar",
    credit: CREDIT_PENDING,
  },
  wristBlock: {
    key: "usg-wrist-block",
    caption: "USG — Bilek: median sinir, fleksör tendonlar, radial ve ulnar arter",
    credit: CREDIT_PENDING,
  },
  deepCervical: {
    key: "usg-deep-cervical",
    caption: "USG — C4 transvers çıkıntı: anterior/posterior tüberkül ve sinir kökü",
    credit: CREDIT_PENDING,
  },
  parasternal: {
    key: "usg-parasternal",
    caption: "USG — Parasternal: kıkırdak kotlar, internal torasik arter ve pekto-interkostal düzlem",
    credit: CREDIT_PENDING,
  },
  pecs1: {
    key: "usg-pecs1",
    caption: "USG — PECS I: pektoralis majör/minör arası düzlem ve torakoakromiyal arterin pektoral dalı",
    credit: CREDIT_PENDING,
  },
  epiduralThoracic: {
    key: "usg-epidural-thoracic",
    caption: "USG — Torasik paramedian oblik: laminalar, interlaminar pencere ve epidural aralık",
    credit: CREDIT_PENDING,
  },

  ipack: {
    key: "usg-ipack",
    caption: "USG — IPACK: popliteal arter, femur posterior korteksi ve aradaki hedef aralık",
    credit: CREDIT_PENDING,
  },
  saphenous: {
    key: "usg-saphenous",
    caption: "USG — Safen sinir: sartorius, femoral arter ve vasto-adduktor membran",
    credit: CREDIT_PENDING,
  },
  ankleBlock: {
    key: "usg-ankle-block",
    caption: "USG — Ayak bileği: tibial sinir ve posterior tibial arter, medial malleol arkası",
    credit: CREDIT_PENDING,
  },
  caudal: {
    key: "usg-caudal",
    caption: "USG — Sakral hiatus: kornualar, sakrokoksigeal ligaman ve sakral kanal",
    credit: CREDIT_PENDING,
  },
  genicular: {
    key: "usg-genicular",
    caption: "USG — Genikular: femur metafiz korteksi ve genikular arter",
    credit: CREDIT_PENDING,
  },
  suprascapular: {
    key: "usg-suprascapular",
    caption: "USG — Suprascapular: supraspinöz fossa tabanı, çentik ve arter",
    credit: CREDIT_PENDING,
  },
  axillaryNerve: {
    key: "usg-axillary-nerve",
    caption: "USG — Aksiller sinir: humerus boynu ve posterior sirkumfleks humeral arter",
    credit: CREDIT_PENDING,
  },
  axillaryPlexus: {
    key: "usg-axillary-plexus",
    caption: "USG — Aksiller pleksus: aksiller arter çevresinde median, ulnar, radial ve muskülokutanöz",
    credit: CREDIT_PENDING,
  },
  rectusSheath: {
    key: "usg-rectus-sheath",
    caption: "USG — Rektus kılıfı: rektus kası, arka kılıf düzlemi ve epigastrik damarlar",
    credit: CREDIT_PENDING,
  },
  ilioinguinal: {
    key: "usg-ilioinguinal",
    caption: "USG — İlioinguinal/iliohipogastrik: ASIS medialinde iki sinir, kas katmanları arasında",
    credit: CREDIT_PENDING,
  },
  scpb: {
    key: "usg-scpb",
    caption: "USG — Yüzeyel servikal pleksus: SCM arka kenarı ve yüzeyel fasya altı",
    credit: CREDIT_PENDING,
  },
  pudendal: {
    key: "usg-pudendal",
    caption: "USG — Pudendal: iskial spina, sakrospinöz ligaman ve internal pudendal arter",
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
 * Technique id → images.
 *
 * This used to be keyed by *surgery block* id, which meant every new operation
 * had to re-declare the illustration for a block the catalogue already knew how
 * to draw — and adding twelve operations promptly left them all blank, because
 * nobody remembers to update a second table. Keying by canonical technique
 * makes a block inherit its illustration the moment it is mapped, so the gap
 * cannot reopen.
 */
const BY_TECHNIQUE: Record<string, ReferenceImage[]> = {
  // Alt ekstremite
  acb: [USG.adductorCanal],
  femoral: [USG.femoral],
  // The fascia iliaca block reliably takes the LFCN as well as the femoral
  // nerve, so the second capture shows where that nerve sits rather than
  // standing for a separate technique.
  "fascia-iliaca": [USG.fasciaIliaca, USG.lfcn],
  peng: [USG.peng],
  "sciatic-popliteal": [USG.poplitealSciatic],
  "sciatic-subgluteal": [USG.sciaticSubgluteal],
  obturator: [USG.obturator],

  // Nöraksiyel
  spinal: [USG.spinal],
  "epidural-lumbar": [USG.spinal],
  "epidural-thoracic": [USG.epiduralThoracic],

  // Üst ekstremite
  interscalene: [USG.interscalene],
  supraclavicular: [USG.supraclavicular],
  infraclavicular: [USG.infraclavicular],
  "wrist-block": [USG.wristBlock],
  "deep-cervical": [USG.deepCervical],

  // Karın duvarı
  tap: [USG.tap],
  "quadratus-lumborum": [USG.quadratusLumborum],

  // Toraks
  "esp-thoracic": [USG.esp],
  "esp-lumbar": [USG.esp],
  paravertebral: [USG.paravertebral],
  intercostal: [USG.intercostal],
  serratus: [USG.serratus],
  pecs2: [USG.pecs2],
  pecs1: [USG.pecs1],
  parasternal: [USG.parasternal],

  // Kalan USG teknikleri
  ipack: [USG.ipack],
  saphenous: [USG.saphenous],
  "ankle-block": [USG.ankleBlock],
  caudal: [USG.caudal],
  genicular: [USG.genicular],
  suprascapular: [USG.suprascapular],
  "axillary-nerve": [USG.axillaryNerve],
  "axillary-plexus": [USG.axillaryPlexus],
  "rectus-sheath": [USG.rectusSheath],
  ilioinguinal: [USG.ilioinguinal],
  scpb: [USG.scpb],
  pudendal: [USG.pudendal],
};

export function imagesForTechnique(techniqueId: string): ReferenceImage[] {
  return BY_TECHNIQUE[techniqueId] ?? [];
}

export function imagesForBlock(block: BlockOption): ReferenceImage[] {
  if (block.images) return block.images;
  const techniqueId = BLOCK_TECHNIQUE[block.id];
  return techniqueId ? (BY_TECHNIQUE[techniqueId] ?? []) : [];
}
