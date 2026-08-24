/**
 * What each technique actually puts local anaesthetic onto, in nerves.
 *
 * Two things make this less mechanical than it looks:
 *
 * 1. A block is performed at a *point along* a nerve, not at its origin. A
 *    popliteal sciatic block leaves the hamstring branches working because they
 *    have already left the trunk by then. So techniques target the most distal
 *    structure they reliably reach — `sciatic-popliteal` names the tibial and
 *    common peroneal nerves rather than "sciatic", and the ankle block names
 *    the five terminal nerves rather than their parents.
 *
 * 2. Being downstream of a blocked structure does not guarantee being blocked.
 *    `commonlyMissed` lists nerves the graph would otherwise call covered but
 *    which this particular approach is known to spare — the lateral cutaneous
 *    branches escaping a lateral TAP injection, the shoulder escaping a
 *    supraclavicular block.
 */
export type Reliability = "consistent" | "variable";

export interface NerveTarget {
  nerve: string;
  reliability: Reliability;
  /**
   * Not an aim of the technique — an unavoidable neighbour that gets blocked
   * too, and matters clinically (phrenic palsy after an interscalene block).
   */
  incidental?: boolean;
  note?: string;
}

export interface TechniqueNerveMap {
  targets: NerveTarget[];
  /**
   * Nerves downstream of a target that this approach nonetheless commonly
   * fails to reach. Downgraded to "variable" instead of counted as covered.
   */
  commonlyMissed?: string[];
  /** Spinal segments the technique is normally quoted at. */
  segments?: string;
  /** Explains the choice of targets where it is not self-evident. */
  note?: string;
}

export const TECHNIQUE_NERVES: Record<string, TechniqueNerveMap> = {
  // ---- Alt ekstremite ---------------------------------------------------
  acb: {
    targets: [
      { nerve: "saphenous", reliability: "consistent" },
      {
        nerve: "nerve-to-vastus-medialis",
        reliability: "consistent",
        note: "Adduktor kanaldan geçer; bu yüzden ACB tam anlamıyla 'motor koruyucu' değildir.",
      },
    ],
    segments: "L3–L4",
    note: "Kuadriseps ana motor dallarına ulaşmaz — femoral bloktan farkı budur.",
  },
  ipack: {
    targets: [{ nerve: "sciatic-articular-knee", reliability: "consistent" }],
    segments: "L4–S2 (artiküler)",
    note: "Yalnızca diz arka kapsülünün duyusal dalları hedeflenir; tibial/peroneal gövdeler korunur.",
  },
  femoral: {
    targets: [{ nerve: "femoral", reliability: "consistent" }],
    segments: "L2–L4",
    note: "Sinir gövdesi bloke edildiği için tüm dalları (safen dahil) birlikte tutulur.",
  },
  "sciatic-popliteal": {
    targets: [
      { nerve: "tibial", reliability: "consistent" },
      { nerve: "common-peroneal", reliability: "consistent" },
    ],
    segments: "L4–S3",
    note: "Popliteal seviyede hamstring dalları çoktan ayrılmıştır; diz fleksiyonu korunur.",
  },
  saphenous: {
    targets: [{ nerve: "saphenous", reliability: "consistent" }],
    segments: "L3–L4",
  },
  "ankle-block": {
    targets: [
      { nerve: "medial-plantar", reliability: "consistent" },
      { nerve: "lateral-plantar", reliability: "consistent" },
      { nerve: "medial-calcaneal", reliability: "consistent" },
      { nerve: "deep-peroneal", reliability: "consistent" },
      { nerve: "superficial-peroneal", reliability: "consistent" },
      { nerve: "sural", reliability: "consistent" },
      { nerve: "saphenous", reliability: "consistent" },
    ],
    segments: "L4–S2",
    note: "Beş sinirin ayak bileği seviyesindeki uç dalları hedeflenir; baldır ve bacak korunur.",
  },
  peng: {
    targets: [
      { nerve: "femoral-articular-hip", reliability: "consistent" },
      { nerve: "accessory-obturator", reliability: "consistent" },
      { nerve: "obturator-articular-hip", reliability: "variable" },
    ],
    segments: "L2–L4 (artiküler)",
    note: "Yalnızca kalça kapsülünün artiküler dalları; kuadriseps motor dalları korunur.",
  },
  "fascia-iliaca": {
    targets: [
      { nerve: "femoral", reliability: "consistent" },
      { nerve: "lateral-femoral-cutaneous", reliability: "consistent" },
      {
        nerve: "obturator",
        reliability: "variable",
        note: "Klasik olarak iddia edilir, pratikte sıklıkla tutulmaz.",
      },
    ],
    segments: "L1–L4",
  },
  spinal: {
    targets: [
      { nerve: "lumbar-spinal-nerve", reliability: "consistent" },
      { nerve: "sacral-plexus", reliability: "consistent" },
      {
        nerve: "thoracic-spinal-nerve",
        reliability: "variable",
        note: "Ulaşılan seviyeye bağlı; doz, barisite ve pozisyonla değişir.",
      },
    ],
    segments: "Seviyeye göre T4/T10–S5",
    note: "Kök düzeyinde blokaj — aşağıdaki tüm periferik sinirler iki taraflı olarak kapsanır.",
  },
  caudal: {
    targets: [
      { nerve: "sacral-plexus", reliability: "consistent" },
      {
        nerve: "lumbar-spinal-nerve",
        reliability: "variable",
        note: "Hacme bağlı; yüksek hacimde lomber seviyelere yayılır.",
      },
    ],
    segments: "S2–S5 (± lomber)",
  },

  // ---- Üst ekstremite ---------------------------------------------------
  interscalene: {
    targets: [
      { nerve: "upper-trunk", reliability: "consistent" },
      { nerve: "middle-trunk", reliability: "variable" },
      {
        nerve: "phrenic",
        reliability: "consistent",
        incidental: true,
        note: "Klasik hacimlerde neredeyse her hastada geçici hemidiyafram felci olur.",
      },
      { nerve: "cervical-plexus-superficial", reliability: "variable", incidental: true },
    ],
    segments: "C5–C6 (± C7)",
    note: "Alt trunkus genellikle korunur — ulnar taraf açık kalır, el cerrahisi için yetersizdir.",
  },
  suprascapular: {
    targets: [{ nerve: "suprascapular", reliability: "consistent" }],
    segments: "C5–C6",
  },
  "axillary-nerve": {
    targets: [{ nerve: "axillary-nerve", reliability: "consistent" }],
    segments: "C5–C6",
  },
  supraclavicular: {
    targets: [
      { nerve: "upper-trunk", reliability: "consistent" },
      { nerve: "middle-trunk", reliability: "consistent" },
      { nerve: "lower-trunk", reliability: "consistent" },
      {
        nerve: "phrenic",
        reliability: "variable",
        incidental: true,
        note: "İnterskalene göre daha seyrek (yaklaşık üçte bir–yarı oranında bildirilir).",
      },
    ],
    commonlyMissed: ["suprascapular"],
    segments: "C5–T1",
    note: "Kolun tamamı için en yoğun blok; omuz kapsülü kapsaması güvenilir değildir.",
  },
  infraclavicular: {
    targets: [
      { nerve: "lateral-cord", reliability: "consistent" },
      { nerve: "posterior-cord", reliability: "consistent" },
      { nerve: "medial-cord", reliability: "consistent" },
    ],
    commonlyMissed: ["suprascapular", "axillary-nerve"],
    segments: "C5–T1 (dirsek altı ağırlıklı)",
    note: "Kord düzeyinde blokaj; omuz dalları enjeksiyon noktasının proksimalinde ayrılmış olabilir.",
  },
  "axillary-plexus": {
    targets: [
      { nerve: "median", reliability: "consistent" },
      { nerve: "ulnar", reliability: "consistent" },
      { nerve: "radial", reliability: "consistent" },
      {
        nerve: "musculocutaneous",
        reliability: "variable",
        note: "Korakobrakiyalis içinde ayrı seyreder; genellikle ayrı enjeksiyon gerektirir.",
      },
      { nerve: "medial-antebrachial-cutaneous", reliability: "consistent" },
    ],
    segments: "C6–T1",
    note: "Uç sinir düzeyinde blokaj; omuz ve aksilla kapsanmaz.",
  },
  ivra: {
    targets: [
      { nerve: "median", reliability: "consistent" },
      { nerve: "ulnar", reliability: "consistent" },
      { nerve: "radial", reliability: "consistent" },
      { nerve: "musculocutaneous", reliability: "consistent" },
      { nerve: "medial-antebrachial-cutaneous", reliability: "consistent" },
    ],
    segments: "Turnike altı (segmental değil)",
    note: "Sinire değil, dokuya difüzyonla etki eder; turnike inince etki hızla kaybolur.",
  },

  // ---- Karın duvarı -----------------------------------------------------
  tap: {
    targets: [
      { nerve: "intercostal", reliability: "consistent" },
      { nerve: "subcostal", reliability: "consistent" },
      { nerve: "iliohypogastric", reliability: "variable" },
      { nerve: "ilioinguinal", reliability: "variable" },
    ],
    commonlyMissed: ["intercostal-lateral-cutaneous"],
    segments: "T10–L1",
    note: "Lateral yaklaşımda lateral kutanöz dallar enjeksiyon noktasının arkasında ayrılır. Yalnızca somatik — viseral ağrıyı kapsamaz.",
  },
  "rectus-sheath": {
    targets: [{ nerve: "intercostal-anterior-cutaneous", reliability: "consistent" }],
    segments: "T9–T11",
    note: "Uç anterior kutanöz dallar rektus kılıfına girerken hedeflenir — orta hat/periumbilikal alan.",
  },
  ilioinguinal: {
    targets: [
      { nerve: "ilioinguinal", reliability: "consistent" },
      { nerve: "iliohypogastric", reliability: "consistent" },
    ],
    segments: "L1 (± T12)",
  },
  "port-site": {
    targets: [],
    segments: "Segmental değil",
    note: "İnsizyon çevresindeki uç sinir dallarına infiltrasyon; adlandırılmış bir siniri hedeflemez.",
  },

  // ---- Toraks -----------------------------------------------------------
  pecs2: {
    targets: [
      { nerve: "lateral-pectoral", reliability: "consistent" },
      { nerve: "medial-pectoral", reliability: "consistent" },
      { nerve: "intercostal-lateral-cutaneous", reliability: "consistent" },
      { nerve: "intercostobrachial", reliability: "consistent" },
      { nerve: "long-thoracic", reliability: "variable" },
      { nerve: "thoracodorsal", reliability: "variable" },
    ],
    segments: "T2–T6",
    note: "Aksillayı kapsayan tek göğüs duvarı bloğudur (interkostobrakiyal dahil).",
  },
  serratus: {
    targets: [
      { nerve: "intercostal-lateral-cutaneous", reliability: "consistent" },
      {
        nerve: "intercostobrachial",
        reliability: "variable",
        note: "Yayılım T2'ye ulaşırsa aksilla da kapsanabilir.",
      },
      { nerve: "long-thoracic", reliability: "variable" },
      { nerve: "thoracodorsal", reliability: "variable" },
    ],
    segments: "T2–T9",
    note: "Lateral göğüs duvarı; parasternal/orta hat bölgesi kapsanmaz.",
  },
  paravertebral: {
    targets: [
      { nerve: "thoracic-spinal-nerve", reliability: "consistent" },
      { nerve: "thoracic-sympathetic-chain", reliability: "consistent" },
    ],
    segments: "Enjekte edilen seviyeler (tipik T4–T8)",
    note: "Spinal sinir daha dallanmadan tutulur: dorsal ramus, interkostal sinir ve sempatik zincir birlikte bloke olur. Göğüs duvarı bloklarının referansı budur.",
  },
  "esp-thoracic": {
    targets: [
      { nerve: "thoracic-dorsal-ramus", reliability: "consistent" },
      {
        nerve: "intercostal",
        reliability: "variable",
        note: "Ventral ramusa yayılım tartışmalıdır; ön göğüs duvarı kapsaması güvenilir değildir.",
      },
      { nerve: "thoracic-sympathetic-chain", reliability: "variable" },
    ],
    segments: "T4–T8 (yayılım değişken)",
    note: "Paravertebral bloğun daha yüzeyel ve daha güvenli, ama daha az öngörülebilir alternatifi.",
  },
  intercostal: {
    targets: [{ nerve: "intercostal", reliability: "consistent" }],
    segments: "Enjekte edilen seviye(ler)",
    note: "Dorsal ramus ve sempatik zincir kapsanmaz; sırt ve viseral bileşen açık kalır.",
  },

  // ---- Omurga / baş-boyun / diğer ---------------------------------------
  "esp-lumbar": {
    targets: [
      { nerve: "lumbar-dorsal-ramus", reliability: "consistent" },
      { nerve: "thoracic-dorsal-ramus", reliability: "variable" },
    ],
    segments: "T10–L2 (posterior)",
  },
  "wound-infiltration": {
    targets: [],
    segments: "Segmental değil",
    note: "İnsizyon hattındaki uç dallara infiltrasyon.",
  },
  scpb: {
    targets: [{ nerve: "cervical-plexus-superficial", reliability: "consistent" }],
    segments: "C2–C4",
  },
  penile: {
    targets: [{ nerve: "dorsal-nerve-of-penis", reliability: "consistent" }],
    segments: "S2–S4",
  },
};
