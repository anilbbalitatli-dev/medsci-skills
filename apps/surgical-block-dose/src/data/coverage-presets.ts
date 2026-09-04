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
    levels: ["L3", "L4"],
    frontZones: ["thigh-medial", "knee", "lowerleg-anterior"],
  } satisfies Coverage,
  ipack: {
    dermatomes: "L3–S1 (diz eklem dalları)",
    motorEffect: "Yok/minimal; tibial ve peroneal sinirlerin motor lifleri genellikle korunur.",
    levels: ["L3", "L4", "L5", "S1"],
    backZones: ["knee"],
  } satisfies Coverage,
  femoral: {
    dermatomes: "L2–L4",
    motorEffect: "Kuadriseps kas gücünde belirgin azalma (diz ekstansiyonu zayıflar); düşme riski artar.",
    levels: ["L2", "L3", "L4"],
    frontZones: ["thigh-anterior", "knee"],
  } satisfies Coverage,
  spinalLowerLimb: {
    dermatomes: "T10–S5 (kalça, bacak ve alt karının tamamı, iki taraflı)",
    motorEffect: "Yoğun, iki taraflı alt ekstremite motor bloğu (kalça-diz-ayak bileği hareketlerinin tamamı etkilenir).",
    levels: ["T10", "T11", "T12", "L1", "L2", "L3", "L4", "L5", "S1", "S2", "S3"],
    frontZones: ["abdomen-mid", "abdomen-lower", "groin", "thigh-anterior", "thigh-medial", "knee", "lowerleg-anterior", "foot-top"],
    backZones: ["thigh-posterior", "knee", "calf", "heel-sole"],
  } satisfies Coverage,
  spinalCesarean: {
    dermatomes: "T4–S5 (göbek üstünden bacaklara, iki taraflı)",
    motorEffect: "Yoğun, iki taraflı alt ekstremite ve karın duvarı motor bloğu.",
    levels: ["T4", "T5", "T6", "T7", "T8", "T9", "T10", "T11", "T12", "L1", "L2", "L3", "L4", "L5", "S1", "S2", "S3"],
    frontZones: ["abdomen-upper", "abdomen-mid", "abdomen-lower", "groin", "thigh-anterior", "thigh-medial", "knee", "lowerleg-anterior", "foot-top"],
    backZones: ["thigh-posterior", "knee", "calf", "heel-sole"],
  } satisfies Coverage,
  peng: {
    dermatomes: "L2–L4 (kalça eklemi artiküler dalları)",
    motorEffect: "Yok/minimal; kuadriseps gücü korunur.",
    levels: ["L2", "L3", "L4"],
    frontZones: ["groin", "thigh-anterior"],
  } satisfies Coverage,
  fasciaIliaca: {
    dermatomes: "L1–L4 (femoral, lateral femoral kutanöz ± obturator)",
    motorEffect: "Değişken; genellikle hafif, bazen orta derecede kuadriseps etkisi olabilir.",
    levels: ["L1", "L2", "L3", "L4"],
    frontZones: ["thigh-anterior", "thigh-medial", "groin"],
  } satisfies Coverage,
  interscalene: {
    dermatomes: "C5–C6 (üst trunkus)",
    motorEffect: "Omuz ve dirsek fleksiyonunda belirgin güçsüzlük; el genellikle daha az etkilenir.",
    levels: ["C5", "C6"],
    frontZones: ["shoulder", "upper-arm"],
  } satisfies Coverage,
  suprascapular: {
    dermatomes: "C5–C6 (omuz eklemi artiküler dalları)",
    motorEffect: "Omuz çevresi kaslarında (supraspinatus, infraspinatus) hafif güçsüzlük.",
    levels: ["C5", "C6"],
    frontZones: ["shoulder"],
  } satisfies Coverage,
  axillaryNerve: {
    dermatomes: "C5–C6 (deltoid bölgesi)",
    motorEffect: "Deltoid kasında hafif güçsüzlük.",
    levels: ["C5", "C6"],
    frontZones: ["shoulder"],
  } satisfies Coverage,
  suprascapularAxillaryCombo: {
    dermatomes: "C5–C6",
    motorEffect: "Omuz çevresinde hafif-orta güçsüzlük; dirsek ve el hareketleri etkilenmez.",
    levels: ["C5", "C6"],
    frontZones: ["shoulder"],
  } satisfies Coverage,
  supraclavicular: {
    dermatomes: "C5–T1 (kolun tamamı)",
    motorEffect: "Kolun tamamında (omuzdan ele) belirgin motor blok.",
    levels: ["C5", "C6", "C7", "C8", "T1"],
    frontZones: ["shoulder", "upper-arm", "forearm-hand"],
  } satisfies Coverage,
  infraclavicular: {
    dermatomes: "C5–T1 (dirsek altı ağırlıklı, omuz değişken)",
    motorEffect: "Dirsek, önkol ve elde belirgin motor blok; omuz hareketleri daha az tutarlı etkilenir.",
    levels: ["C5", "C6", "C7", "C8", "T1"],
    frontZones: ["upper-arm", "forearm-hand"],
  } satisfies Coverage,
  axillaryPlexus: {
    dermatomes: "C6–T1 (median/ulnar/radial/muskülokutanöz; omuz hariç)",
    motorEffect: "Dirsek altında belirgin motor blok; omuz hareketleri korunur.",
    levels: ["C6", "C7", "C8", "T1"],
    frontZones: ["upper-arm", "forearm-hand"],
  } satisfies Coverage,
  ivra: {
    dermatomes: "Turnike altındaki tüm ekstremite (segmental değil, difüz)",
    motorEffect: "Turnike süresince ekstremitenin tamamında motor blok; turnike inince hızla geri döner.",
    levels: ["C6", "C7", "C8", "T1"],
    frontZones: ["forearm-hand"],
  } satisfies Coverage,
  tap: {
    dermatomes: "T10–L1",
    motorEffect: "Yok (yalnızca duyusal; karın duvarı kas gücü fonksiyonel olarak etkilenmez).",
    levels: ["T10", "T11", "T12", "L1"],
    frontZones: ["abdomen-mid", "abdomen-lower", "groin"],
  } satisfies Coverage,
  rectusSheath: {
    dermatomes: "T9–T11 (periumbilikal)",
    motorEffect: "Yok (yalnızca duyusal).",
    levels: ["T9", "T10", "T11"],
    frontZones: ["abdomen-upper", "abdomen-mid", "abdomen-lower"],
  } satisfies Coverage,
  ilioinguinal: {
    dermatomes: "L1 (± T12)",
    motorEffect: "Yok (duyusal); nadiren femoral sinire yakınlık nedeniyle hafif kuadriseps etkisi bildirilmiştir.",
    levels: ["T12", "L1"],
    frontZones: ["groin", "abdomen-lower"],
  } satisfies Coverage,
  pecs2: {
    dermatomes: "T2–T6 (ön-yan göğüs duvarı, aksilla)",
    motorEffect: "Pektoral kaslarda hafif güçsüzlük (fonksiyonel önemi sınırlı).",
    levels: ["T2", "T3", "T4", "T5", "T6"],
    frontZones: ["chest-upper", "chest-lower", "shoulder"],
  } satisfies Coverage,
  serratus: {
    dermatomes: "T2–T9 (lateral göğüs duvarı)",
    motorEffect: "Uzun torasik/torakodorsal sinir etkisiyle hafif skapular kas güçsüzlüğü olabilir.",
    levels: ["T2", "T3", "T4", "T5", "T6", "T7", "T8", "T9"],
    frontZones: ["chest-upper", "chest-lower", "abdomen-upper"],
  } satisfies Coverage,
  paravertebralBreast: {
    dermatomes: "İşlem seviyesine göre T2–T6",
    motorEffect: "İlgili seviyelerde hafif interkostal kas güçsüzlüğü.",
    levels: ["T2", "T3", "T4", "T5", "T6"],
    frontZones: ["chest-upper", "chest-lower"],
  } satisfies Coverage,
  scpb: {
    dermatomes: "C2–C4 (anterolateral boyun)",
    motorEffect: "Yok (yalnızca duyusal dallar).",
    levels: ["C2", "C3", "C4"],
    frontZones: ["head-neck"],
  } satisfies Coverage,
  paravertebralThoracotomy: {
    dermatomes: "İşlem seviyesine göre T4–T8",
    motorEffect: "İlgili seviyelerde interkostal kas güçsüzlüğü.",
    levels: ["T4", "T5", "T6", "T7", "T8"],
    frontZones: ["chest-lower", "abdomen-upper"],
    backZones: ["upper-back"],
  } satisfies Coverage,
  espThoracotomy: {
    dermatomes: "T4–T8 (yaklaşık; yayılım değişken)",
    motorEffect: "İlgili seviyelerde hafif interkostal kas güçsüzlüğü.",
    levels: ["T4", "T5", "T6", "T7", "T8"],
    frontZones: ["chest-lower", "abdomen-upper"],
    backZones: ["upper-back"],
  } satisfies Coverage,
  intercostal: {
    dermatomes: "Enjekte edilen seviye(ler)",
    motorEffect: "İlgili seviyede interkostal kas güçsüzlüğü.",
    levels: ["T4", "T5", "T6", "T7", "T8"],
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
    levels: ["L3", "L4"],
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
    levels: ["L4", "L5", "S1", "S2"],
    frontZones: ["lowerleg-anterior", "foot-top"],
    backZones: ["calf", "heel-sole"],
  } satisfies Coverage,
  ankleBlock: {
    dermatomes: "L4–S2 (ayağın tamamı)",
    motorEffect: "Ayağın küçük iç kaslarında hafif etki; yürüyüşü anlamlı etkilemez.",
    levels: ["L4", "L5", "S1", "S2"],
    frontZones: ["foot-top"],
    backZones: ["heel-sole"],
  } satisfies Coverage,
  penileBlock: {
    dermatomes: "S2–S4 (pudendal sinir dalları)",
    motorEffect: "Yok (duyusal).",
    levels: ["S2", "S3"],
    frontZones: ["groin"],
  } satisfies Coverage,
  caudal: {
    dermatomes: "S2–S5 (± daha yukarısı, hacme bağlı)",
    motorEffect: "Hacme bağlı olarak alt ekstremitede geçici hafif motor blok olabilir.",
    levels: ["S1", "S2", "S3"],
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
    levels: ["T10", "T11", "T12", "L1", "L2"],
    backZones: ["lower-back"],
  } satisfies Coverage,

  // ---- Nöraksiyel ----
  epiduralLumbar: {
    dermatomes: "Kateter seviyesine göre T10–S5 (iki taraflı)",
    motorEffect:
      "Konsantrasyona bağlı; analjezik konsantrasyonlarda (%0.1–0.2) yürüyüş korunabilir, anestezik konsantrasyonlarda belirgin alt ekstremite motor bloğu olur.",
    levels: ["T10", "T11", "T12", "L1", "L2", "L3", "L4", "L5", "S1"],
    frontZones: ["abdomen-lower", "groin", "thigh-anterior", "thigh-medial", "knee", "lowerleg-anterior"],
    backZones: ["lower-back", "thigh-posterior", "calf"],
  } satisfies Coverage,
  epiduralThoracic: {
    dermatomes: "Kateter seviyesi çevresinde yaklaşık T4–T10 (iki taraflı, segmental)",
    motorEffect:
      "Alt ekstremite motor bloğu beklenmez; ilgili seviyelerde interkostal kas gücü azalır. Sempatik blokaj nedeniyle hipotansiyon görülebilir.",
    levels: ["T4", "T5", "T6", "T7", "T8", "T9", "T10"],
    frontZones: ["chest-lower", "abdomen-upper", "abdomen-mid"],
    backZones: ["upper-back"],
  } satisfies Coverage,

  // ---- Gövde ----
  quadratusLumborum: {
    dermatomes: "T7–L1 (yayılıma bağlı; torakolumbar fasya üzerinden paravertebral alana)",
    motorEffect: "Yok/minimal; karın duvarı kas gücü fonksiyonel olarak korunur.",
    levels: ["T7", "T8", "T9", "T10", "T11", "T12", "L1"],
    frontZones: ["abdomen-upper", "abdomen-mid", "abdomen-lower"],
    backZones: ["lower-back"],
  } satisfies Coverage,
  parasternal: {
    dermatomes: "T2–T6 anterior kutanöz dallar (parasternal bant)",
    motorEffect: "Yok (yalnızca duyusal anterior dallar).",
    levels: ["T2", "T3", "T4", "T5", "T6"],
    frontZones: ["chest-upper", "chest-lower"],
  } satisfies Coverage,
  pecs1: {
    dermatomes: "Segmental değil — pektoral sinirlerin motor alanı",
    motorEffect: "Pektoralis majör ve minörde güçsüzlük; cilt duyusu bu blokla kapsanmaz.",
    frontZones: ["chest-upper"],
  } satisfies Coverage,

  // ---- Alt ekstremite ----
  sciaticSubgluteal: {
    dermatomes: "L4–S3 (uyluk arkası dahil, safen alanı hariç bacağın tamamı)",
    motorEffect:
      "Hamstringler dahil diz altındaki tüm kaslarda motor blok; popliteal yaklaşımın aksine diz fleksiyonu da etkilenir.",
    levels: ["L4", "L5", "S1", "S2"],
    frontZones: ["lowerleg-anterior", "foot-top"],
    backZones: ["thigh-posterior", "calf", "heel-sole"],
  } satisfies Coverage,
  obturator: {
    dermatomes: "L2–L4 (uyluk medial yüzü — değişken; diz posteromedial kapsülü)",
    motorEffect:
      "Adduktor kaslarda belirgin güçsüzlük. TUR-M sırasında obturator refleksi (adduktor sıçraması) önlemek için kullanılır.",
    levels: ["L2", "L3", "L4"],
    frontZones: ["thigh-medial"],
  } satisfies Coverage,
  genicular: {
    dermatomes: "L3–S1 (diz eklem kapsülünün artiküler dalları)",
    motorEffect: "Yok; yalnızca artiküler duyusal dallar hedeflenir.",
    levels: ["L3", "L4", "L5", "S1"],
    frontZones: ["knee"],
    backZones: ["knee"],
  } satisfies Coverage,

  // ---- Üst ekstremite ----
  wristBlock: {
    dermatomes: "C6–T1 (median, ulnar ve radial sinirlerin el dalları)",
    motorEffect:
      "El içi küçük kaslarda güçsüzlük olabilir; bilek ve parmak uzun kasları korunur, el bileği hareketi etkilenmez.",
    levels: ["C6", "C7", "C8", "T1"],
    frontZones: ["forearm-hand"],
  } satisfies Coverage,
  digital: {
    dermatomes: "Yalnızca ilgili parmak (segmental değil)",
    motorEffect: "Yok.",
    frontZones: ["forearm-hand"],
  } satisfies Coverage,

  // ---- Baş-boyun ----
  scalp: {
    dermatomes:
      "Trigeminal dallar (supraorbital, supratroklear, zigomatikotemporal, aurikulotemporal) + C2–C3 (oksipital sinirler)",
    motorEffect: "Yok (yalnızca duyusal); frontalis hareketinde geçici etki olabilir.",
    levels: ["C2", "C3"],
    frontZones: ["head-neck"],
  } satisfies Coverage,
  deepCervical: {
    dermatomes: "C2–C4 (derin servikal pleksus — yüzeyel dallara ek olarak derin yapılar)",
    motorEffect:
      "Boyun kaslarında güçsüzlük; frenik sinir yakınlığı nedeniyle hemidiyafram felci ve rekürren laringeal sinir tutulumu riski taşır.",
    levels: ["C2", "C3", "C4"],
    frontZones: ["head-neck"],
  } satisfies Coverage,

  // ---- Ürogenital / perine ----
  pudendal: {
    dermatomes: "S2–S4 (perine, dış genital bölge, anal kanal)",
    motorEffect: "Perine kasları ve eksternal sfinkterde güçsüzlük.",
    levels: ["S2", "S3"],
    frontZones: ["groin"],
  } satisfies Coverage,
} as const;
