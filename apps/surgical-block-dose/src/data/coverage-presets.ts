import { Coverage } from "./types";

/**
 * Shared coverage presets so the same nerve/technique has identical
 * dermatome/motor/zone info everywhere it appears across surgeries.
 * Approximate/educational — see Coverage in ./types.ts.
 */
export const COVERAGE = {
  acb: {
    dermatomes: "L3–L4 (safen sinir)",
    motorEffect: "Minimal; kuadriseps gücü büyük ölçüde korunur (yalnızca hafif vastus medialis etkisi olabilir).",
    frontZones: ["thigh-medial", "knee", "lowerleg-anterior"],
  } satisfies Coverage,
  ipack: {
    dermatomes: "L3–S1 (diz eklem dalları)",
    motorEffect: "Yok/minimal; tibial ve peroneal sinirlerin motor lifleri genellikle korunur.",
    backZones: ["knee"],
  } satisfies Coverage,
  femoral: {
    dermatomes: "L2–L4",
    motorEffect: "Kuadriseps kas gücünde belirgin azalma (diz ekstansiyonu zayıflar); düşme riski artar.",
    frontZones: ["thigh-anterior", "knee"],
  } satisfies Coverage,
  spinalLowerLimb: {
    dermatomes: "T10–S5 (kalça, bacak ve alt karının tamamı, iki taraflı)",
    motorEffect: "Yoğun, iki taraflı alt ekstremite motor bloğu (kalça-diz-ayak bileği hareketlerinin tamamı etkilenir).",
    frontZones: ["abdomen-mid", "abdomen-lower", "groin", "thigh-anterior", "thigh-medial", "knee", "lowerleg-anterior", "foot-top"],
    backZones: ["thigh-posterior", "knee", "calf", "heel-sole"],
  } satisfies Coverage,
  spinalCesarean: {
    dermatomes: "T4–S5 (göbek üstünden bacaklara, iki taraflı)",
    motorEffect: "Yoğun, iki taraflı alt ekstremite ve karın duvarı motor bloğu.",
    frontZones: ["abdomen-upper", "abdomen-mid", "abdomen-lower", "groin", "thigh-anterior", "thigh-medial", "knee", "lowerleg-anterior", "foot-top"],
    backZones: ["thigh-posterior", "knee", "calf", "heel-sole"],
  } satisfies Coverage,
  peng: {
    dermatomes: "L2–L4 (kalça eklemi artiküler dalları)",
    motorEffect: "Yok/minimal; kuadriseps gücü korunur.",
    frontZones: ["groin", "thigh-anterior"],
  } satisfies Coverage,
  fasciaIliaca: {
    dermatomes: "L1–L4 (femoral, lateral femoral kutanöz ± obturator)",
    motorEffect: "Değişken; genellikle hafif, bazen orta derecede kuadriseps etkisi olabilir.",
    frontZones: ["thigh-anterior", "thigh-medial", "groin"],
  } satisfies Coverage,
  interscalene: {
    dermatomes: "C5–C6 (üst trunkus)",
    motorEffect: "Omuz ve dirsek fleksiyonunda belirgin güçsüzlük; el genellikle daha az etkilenir.",
    frontZones: ["shoulder", "upper-arm"],
  } satisfies Coverage,
  suprascapular: {
    dermatomes: "C5–C6 (omuz eklemi artiküler dalları)",
    motorEffect: "Omuz çevresi kaslarında (supraspinatus, infraspinatus) hafif güçsüzlük.",
    frontZones: ["shoulder"],
  } satisfies Coverage,
  axillaryNerve: {
    dermatomes: "C5–C6 (deltoid bölgesi)",
    motorEffect: "Deltoid kasında hafif güçsüzlük.",
    frontZones: ["shoulder"],
  } satisfies Coverage,
  suprascapularAxillaryCombo: {
    dermatomes: "C5–C6",
    motorEffect: "Omuz çevresinde hafif-orta güçsüzlük; dirsek ve el hareketleri etkilenmez.",
    frontZones: ["shoulder"],
  } satisfies Coverage,
  supraclavicular: {
    dermatomes: "C5–T1 (kolun tamamı)",
    motorEffect: "Kolun tamamında (omuzdan ele) belirgin motor blok.",
    frontZones: ["shoulder", "upper-arm", "forearm-hand"],
  } satisfies Coverage,
  infraclavicular: {
    dermatomes: "C5–T1 (dirsek altı ağırlıklı, omuz değişken)",
    motorEffect: "Dirsek, önkol ve elde belirgin motor blok; omuz hareketleri daha az tutarlı etkilenir.",
    frontZones: ["upper-arm", "forearm-hand"],
  } satisfies Coverage,
  axillaryPlexus: {
    dermatomes: "C6–T1 (median/ulnar/radial/muskülokutanöz; omuz hariç)",
    motorEffect: "Dirsek altında belirgin motor blok; omuz hareketleri korunur.",
    frontZones: ["upper-arm", "forearm-hand"],
  } satisfies Coverage,
  ivra: {
    dermatomes: "Turnike altındaki tüm ekstremite (segmental değil, difüz)",
    motorEffect: "Turnike süresince ekstremitenin tamamında motor blok; turnike inince hızla geri döner.",
    frontZones: ["forearm-hand"],
  } satisfies Coverage,
  tap: {
    dermatomes: "T10–L1",
    motorEffect: "Yok (yalnızca duyusal; karın duvarı kas gücü fonksiyonel olarak etkilenmez).",
    frontZones: ["abdomen-mid", "abdomen-lower", "groin"],
  } satisfies Coverage,
  rectusSheath: {
    dermatomes: "T9–T11 (periumbilikal)",
    motorEffect: "Yok (yalnızca duyusal).",
    frontZones: ["abdomen-upper", "abdomen-mid", "abdomen-lower"],
  } satisfies Coverage,
  ilioinguinal: {
    dermatomes: "L1 (± T12)",
    motorEffect: "Yok (duyusal); nadiren femoral sinire yakınlık nedeniyle hafif kuadriseps etkisi bildirilmiştir.",
    frontZones: ["groin", "abdomen-lower"],
  } satisfies Coverage,
  pecs2: {
    dermatomes: "T2–T6 (ön-yan göğüs duvarı, aksilla)",
    motorEffect: "Pektoral kaslarda hafif güçsüzlük (fonksiyonel önemi sınırlı).",
    frontZones: ["chest-upper", "chest-lower", "shoulder"],
  } satisfies Coverage,
  serratus: {
    dermatomes: "T2–T9 (lateral göğüs duvarı)",
    motorEffect: "Uzun torasik/torakodorsal sinir etkisiyle hafif skapular kas güçsüzlüğü olabilir.",
    frontZones: ["chest-upper", "chest-lower", "abdomen-upper"],
  } satisfies Coverage,
  paravertebralBreast: {
    dermatomes: "İşlem seviyesine göre T2–T6",
    motorEffect: "İlgili seviyelerde hafif interkostal kas güçsüzlüğü.",
    frontZones: ["chest-upper", "chest-lower"],
  } satisfies Coverage,
  scpb: {
    dermatomes: "C2–C4 (anterolateral boyun)",
    motorEffect: "Yok (yalnızca duyusal dallar).",
    frontZones: ["head-neck"],
  } satisfies Coverage,
  paravertebralThoracotomy: {
    dermatomes: "İşlem seviyesine göre T4–T8",
    motorEffect: "İlgili seviyelerde interkostal kas güçsüzlüğü.",
    frontZones: ["chest-lower", "abdomen-upper"],
    backZones: ["upper-back"],
  } satisfies Coverage,
  espThoracotomy: {
    dermatomes: "T4–T8 (yaklaşık; yayılım değişken)",
    motorEffect: "İlgili seviyelerde hafif interkostal kas güçsüzlüğü.",
    frontZones: ["chest-lower", "abdomen-upper"],
    backZones: ["upper-back"],
  } satisfies Coverage,
  intercostal: {
    dermatomes: "Enjekte edilen seviye(ler)",
    motorEffect: "İlgili seviyede interkostal kas güçsüzlüğü.",
    frontZones: ["chest-lower", "abdomen-upper"],
    backZones: ["upper-back"],
  } satisfies Coverage,
  portSiteInfiltration: {
    dermatomes: "Yalnızca port yeri çevresi (segmental değil)",
    motorEffect: "Yok.",
    frontZones: ["abdomen-lower"],
  } satisfies Coverage,
  saphenous: {
    dermatomes: "L3–L4 (medial bacak/ayak; yalnızca duyusal)",
    motorEffect: "Yok (saf duyusal sinir).",
    frontZones: ["lowerleg-anterior", "foot-top"],
  } satisfies Coverage,
  tumescent: {
    dermatomes: "Ven trasesi boyunca lokal (segmental değil)",
    motorEffect: "Yok.",
    frontZones: ["thigh-medial", "lowerleg-anterior"],
  } satisfies Coverage,
  poplitealSciatic: {
    dermatomes: "L4–S3 (safen hariç bacağın/ayağın tamamı)",
    motorEffect: "Ayak bileği ve ayak parmaklarında belirgin motor blok (aktifken 'ayak düşmesi' hissi).",
    frontZones: ["lowerleg-anterior", "foot-top"],
    backZones: ["calf", "heel-sole"],
  } satisfies Coverage,
  ankleBlock: {
    dermatomes: "L4–S2 (ayağın tamamı)",
    motorEffect: "Ayağın küçük iç kaslarında hafif etki; yürüyüşü anlamlı etkilemez.",
    frontZones: ["foot-top"],
    backZones: ["heel-sole"],
  } satisfies Coverage,
  penileBlock: {
    dermatomes: "S2–S4 (pudendal sinir dalları)",
    motorEffect: "Yok (duyusal).",
    frontZones: ["groin"],
  } satisfies Coverage,
  caudal: {
    dermatomes: "S2–S5 (± daha yukarısı, hacme bağlı)",
    motorEffect: "Hacme bağlı olarak alt ekstremitede geçici hafif motor blok olabilir.",
    frontZones: ["groin"],
    backZones: ["lower-back"],
  } satisfies Coverage,
  woundInfiltration: {
    dermatomes: "Yalnızca insizyon hattı (segmental değil)",
    motorEffect: "Yok.",
    backZones: ["lower-back"],
  } satisfies Coverage,
  espLumbar: {
    dermatomes: "T10–L2 (posterior, insizyon hattı boyunca)",
    motorEffect: "Yok/minimal (paraspinal kaslarda hafif etki olabilir).",
    backZones: ["lower-back"],
  } satisfies Coverage,
} as const;
