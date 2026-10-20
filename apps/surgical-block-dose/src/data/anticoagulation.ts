/**
 * Antikoagülan alan hastada blok zamanlaması.
 *
 * Bu dosya bilerek iki parçadan oluşuyor ve parçaların **kaynak durumu
 * farklı**:
 *
 * 1. **Kanama riskine göre blok sınıflaması** — uygulamanın kendi
 *    gruplaması. Ölçüt açık: iğnenin derinliği, bası uygulanabilirliği ve
 *    kanamanın olduğu yerde yapacağı hasar. Nöraksiyel ve derin, basıya
 *    kapalı bloklar en katı kurallara tabidir; yüzeyel ve basıya açık bloklar
 *    en gevşek. ESRA ve ASRA'nın listeleri ayrıntıda birbirinden ayrılır, o
 *    yüzden burada gerekçesiyle birlikte veriliyor: okuyan kişi katılmadığı
 *    yeri görebilsin.
 *
 * 2. **İlaç bekleme süreleri** — ASRA'nın 5. baskısından (Kopp ve ark., Reg
 *    Anesth Pain Med 2025) alınmıştır. Bu sayılar hastanın felç olup
 *    olmayacağını belirlediği için hafızadan yazılmaz; her satırda kaynak ve
 *    kılavuzun kendi öneri derecesi durur. Kaynağı yazılmamış bir değer
 *    denetimden geçmez.
 *
 * Sayılar olgudur ve telif kapsamına girmez; kılavuzun cümleleri girer. Bu
 * yüzden değerler alınmış, ifadeler yeniden yazılmıştır — tablo kopyalanmadı.
 */

export type BleedingRiskTier = "high" | "intermediate" | "low";

export interface BleedingRiskInfo {
  tier: BleedingRiskTier;
  label: string;
  rule: string;
}

export const BLEEDING_RISK_TIERS: Record<BleedingRiskTier, BleedingRiskInfo> = {
  high: {
    tier: "high",
    label: "Yüksek riskli grup",
    rule:
      "Nöraksiyel bloklarla aynı kurallar uygulanır: kanama basıyla durdurulamaz ve kapalı bir aralıkta sinir basısı yapar. ASRA'nın 5. baskısı bekleme sürelerini yalnızca nöraksiyel için değil, derin pleksus ve derin periferik bloklar için de veriyor — aşağıdaki süreler bu grupta işler. Kateter çekimi de aynı kurallara tabidir.",
  },
  intermediate: {
    tier: "intermediate",
    label: "Orta riskli grup",
    rule:
      "Derin ama basıya kısmen açık ya da kanaması sinir basısına yol açmayan bloklar. Kılavuzlar bu grupta katı bir zamanlama vermez; karar hastanın kanama riski ve bloğun sağlayacağı yarara göre verilir.",
  },
  low: {
    tier: "low",
    label: "Düşük riskli grup",
    rule:
      "Yüzeyel, basıya açık bloklar. Antikoagülan tedavi altında da çoğu zaman yapılabilir; yine de damar ponksiyonundan kaçınmak için ultrason önerilir.",
  },
};

/** Teknik → kanama riski grubu ve o gruba konma gerekçesi. */
export const BLEEDING_RISK: Record<string, { tier: BleedingRiskTier; why: string }> = {
  spinal: { tier: "high", why: "Nöraksiyel; epidural hematom kord basısı yapar." },
  "epidural-lumbar": { tier: "high", why: "Nöraksiyel; kateter çekimi de aynı kurallara tabidir." },
  "epidural-thoracic": { tier: "high", why: "Nöraksiyel; torakal seviyede kord basısı daha ağır seyreder." },
  caudal: { tier: "high", why: "Nöraksiyel aralık; sakral kanal kapalı bir boşluktur." },
  paravertebral: { tier: "high", why: "Derin, basıya kapalı; epidural aralıkla komşu." },
  "esp-thoracic": { tier: "intermediate", why: "Derin fasya planı ama nöraksiyel aralığın dışında; kanama basıya açık değildir." },
  "esp-lumbar": { tier: "intermediate", why: "Derin fasya planı; nöraksiyel aralığın dışında." },
  "quadratus-lumborum": { tier: "intermediate", why: "Derin plan, retroperitona komşu; kanama geç fark edilebilir." },
  "deep-cervical": { tier: "high", why: "Vertebral arter ve hava yoluna komşu; boyunda hematom hava yolunu tehdit eder." },
  infraclavicular: { tier: "intermediate", why: "Aksiller damarlar iğne yolundadır ve derinlik nedeniyle bası güçtür." },
  supraclavicular: { tier: "intermediate", why: "Subklavyen artere komşu; kompresyon sınırlıdır." },
  interscalene: { tier: "intermediate", why: "Boyun bölgesi; hematom hava yolunu etkileyebilir." },
  "sciatic-subgluteal": { tier: "intermediate", why: "Derin; gluteal bölgede bası uygulanamaz." },
  obturator: { tier: "intermediate", why: "Derin pelvik plan; obturator damarlara komşu." },
  peng: { tier: "intermediate", why: "Derin plan; femoral damarlara komşu ama bası kısmen mümkündür." },
  "fascia-iliaca": { tier: "intermediate", why: "Derin fasya planı; hacim büyüktür, bası kısmen mümkündür." },
  pudendal: { tier: "intermediate", why: "İnternal pudendal artere komşu; bası uygulanamaz." },
  intercostal: { tier: "intermediate", why: "İnterkostal artere komşu; plevral boşluğa kanama olabilir." },
  parasternal: { tier: "intermediate", why: "İnternal torasik arter plan içindedir." },
  "sciatic-popliteal": { tier: "low", why: "Yüzeyel-orta derinlik; popliteal fossada bası uygulanabilir." },
  femoral: { tier: "low", why: "Yüzeyel ve basıya açık; femoral damar komşuluğu ultrasonla görülür." },
  acb: { tier: "low", why: "Yüzeyel; adduktor kanal basıya açıktır." },
  saphenous: { tier: "low", why: "Yüzeyel." },
  ipack: { tier: "low", why: "Popliteal artere komşu ama bası uygulanabilir." },
  genicular: { tier: "low", why: "Periost düzeyi; küçük hacim." },
  "ankle-block": { tier: "low", why: "Yüzeyel, basıya tamamen açık." },
  "wrist-block": { tier: "low", why: "Yüzeyel, basıya tamamen açık." },
  "axillary-plexus": { tier: "low", why: "Yüzeyel; aksiller arter basıya açıktır." },
  "axillary-nerve": { tier: "low", why: "Yüzeyel." },
  suprascapular: { tier: "low", why: "Yüzeyel; büyük damar komşuluğu yok." },
  scpb: { tier: "low", why: "Fasya üstü, yüzeyel." },
  tap: { tier: "low", why: "Karın duvarı planı; basıya kısmen açık." },
  "rectus-sheath": { tier: "low", why: "Epigastrik damarlara komşu ama yüzeyel." },
  ilioinguinal: { tier: "low", why: "Karın duvarı planı, yüzeyel." },
  serratus: { tier: "low", why: "Göğüs duvarı planı, yüzeyel." },
  pecs1: { tier: "low", why: "Göğüs duvarı planı, yüzeyel." },
  pecs2: { tier: "low", why: "Göğüs duvarı planı, yüzeyel." },
  "port-site": { tier: "low", why: "Cilt altı infiltrasyon." },
  "wound-infiltration": { tier: "low", why: "Cilt altı infiltrasyon." },
  tumescent: { tier: "low", why: "Cilt altı; adrenalinli solüsyon kanamayı azaltır." },
  "scalp-block": { tier: "low", why: "Yüzeyel; skalp damardan zengin olsa da bası uygulanabilir." },
  digital: { tier: "low", why: "Yüzeyel, küçük hacim." },
  penile: { tier: "low", why: "Yüzeyel." },
  ivra: { tier: "low", why: "Damar içi; iğne bir sinire veya derin plana girmez." },
};

export function bleedingRiskFor(techniqueId: string) {
  const entry = BLEEDING_RISK[techniqueId];
  if (!entry) return undefined;
  return { ...BLEEDING_RISK_TIERS[entry.tier], why: entry.why };
}

// ---------------------------------------------------------------------------
// İlaç bekleme süreleri — kaynak bekliyor
// ---------------------------------------------------------------------------

export type AgentClass =
  | "antiplatelet"
  | "lmwh"
  | "ufh"
  | "doac"
  | "vka"
  | "thrombolytic"
  | "herbal";

export const AGENT_CLASS_LABEL: Record<AgentClass, string> = {
  antiplatelet: "Antiagreganlar",
  lmwh: "Düşük molekül ağırlıklı heparin",
  ufh: "Standart heparin",
  doac: "Doğrudan oral antikoagülanlar",
  vka: "K vitamini antagonisti",
  thrombolytic: "Trombolitikler",
  herbal: "Bitkisel ürünler",
};

export interface AgentIntervals {
  /** Son dozdan girişime kadar beklenecek süre. */
  beforeBlock: string;
  /** Girişim ya da kateter çekiminden sonra ilk doza kadar. */
  afterBlock: string;
  /** Kateter dururken ilaca devam edilebilir mi. */
  withCatheter?: string;
  /** Böbrek yetmezliğinde değişen süre. */
  renal?: string;
}

export interface AnticoagulantAgent {
  id: string;
  name: string;
  agentClass: AgentClass;
  /** Kaynağıyla birlikte girilene kadar undefined kalır. */
  intervals?: AgentIntervals;
  /** Hangi kılavuzun hangi baskısı. Değer varsa bu da zorunludur. */
  source?: string;
  note?: string;
}

const ASRA = "ASRA PM 5. baskı — Kopp SL ve ark. Reg Anesth Pain Med 2025, doi:10.1136/rapm-2024-105766";

/**
 * Süreler ASRA'nın 5. baskısından alınmıştır (Kopp ve ark., 2025).
 *
 * Değerler olgu olarak alınmış, ifadeler kılavuzdan kopyalanmamıştır; kılavuz
 * metni yayıncının telifi altındadır, sayının kendisi değil. Her satırda
 * kaynak ve — kılavuzun kendi ağırlık derecesi bilgi taşıdığı için — öneri
 * derecesi yazılıdır.
 *
 * Kılavuzun bu baskısındaki en önemli yapısal nokta: kurallar yalnızca
 * nöraksiyel bloklar için değil, **derin pleksus ve derin periferik bloklar**
 * için de geçerlidir. Uygulamanın "yüksek riskli grup" sınıflaması bu yüzden
 * boş bir başlık değil; o gruptaki bloklarda aşağıdaki süreler işler.
 */
export const AGENTS: AnticoagulantAgent[] = [
  {
    id: "asa",
    name: "Asetilsalisilik asit",
    agentClass: "antiplatelet",
    intervals: {
      beforeBlock: "Bekleme gerekmez.",
      afterBlock: "Bekleme gerekmez.",
      withCatheter: "Kateter tutulabilir; çekim zamanlaması için kısıt yok.",
    },
    source: `${ASRA} (derece IC)`,
    note: "Tek başına NSAİİ/aspirin, blok yapılmasını engelleyecek bir risk düzeyi oluşturmaz. Başka bir antitrombotikle birlikteyse o ilacın kuralı işler.",
  },
  {
    id: "nsaid",
    name: "NSAİİ",
    agentClass: "antiplatelet",
    intervals: {
      beforeBlock: "Bekleme gerekmez.",
      afterBlock: "Bekleme gerekmez.",
      withCatheter: "Kateter tutulabilir.",
    },
    source: `${ASRA} (derece IC)`,
  },
  {
    id: "clopidogrel",
    name: "Klopidogrel",
    agentClass: "antiplatelet",
    intervals: {
      beforeBlock: "5–7 gün.",
      afterBlock: "Yükleme dozu verilmeyecekse hemen; yükleme dozu verilecekse kateter çekiminden 6 saat sonra.",
      withCatheter: "Etkisi ani başlamadığı için kateter 1–2 gün tutulabilir (yükleme dozu verilmemek kaydıyla).",
    },
    source: `${ASRA} (derece IIC)`,
    note: "Kısa uçta trombosit işlevi kısmen düzelmiş olur; kanama riski yüksek hastada uzun uç tercih edilir.",
  },
  {
    id: "prasugrel",
    name: "Prasugrel",
    agentClass: "antiplatelet",
    intervals: {
      beforeBlock: "7–10 gün.",
      afterBlock: "Yükleme dozu yoksa hemen; yükleme dozu verilecekse çekimden 6 saat sonra.",
      withCatheter: "Kateter tutulmaz — etkisi hızlı başlar.",
    },
    source: `${ASRA} (derece IIC)`,
  },
  {
    id: "ticagrelor",
    name: "Tikagrelor",
    agentClass: "antiplatelet",
    intervals: {
      beforeBlock: "5 gün.",
      afterBlock: "Yükleme dozu yoksa hemen; yükleme dozu verilecekse çekimden 6 saat sonra.",
      withCatheter: "Kateter tutulmaz — etkisi hızlı başlar.",
    },
    source: `${ASRA} (derece 2C)`,
    note: "Önceki baskıdaki 5–7 gün, trombosit işlevinin geri dönüş verilerine göre 5 güne indirildi.",
  },
  {
    id: "enoxaparin-prophylactic",
    name: "Enoksaparin — profilaktik doz",
    agentClass: "lmwh",
    intervals: {
      beforeBlock: "Son dozdan en az 12 saat sonra.",
      afterBlock:
        "Günde iki doz şemasında ilk doz ertesi gün ve girişimden en az 12 saat sonra; kateter çekimini izleyen en az 4 saat beklenir. Günde tek doz şemasında ilk doz girişimden ≥12 saat, ikinci doz ilkinden ≥24 saat sonra.",
      withCatheter:
        "Günde tek doz şemasında kateter tutulabilir; son dozdan 12 saat sonra çekilir. Günde iki doz şemasında kateter, ilaca başlanmadan önce çekilir.",
      renal: "12 saatten kısa sürede girişim gerekiyorsa anti-Xa düzeyi düşünülür; ≤0,1 IU/mL önerilir.",
    },
    source: `${ASRA} (derece IC)`,
    note: "Kanlı/travmatik girişimde ilk doz 24 saat ertelenir. LMWH 4 günden uzun sürdüyse girişim öncesi trombosit sayısı bakılır.",
  },
  {
    id: "enoxaparin-therapeutic",
    name: "Enoksaparin — tedavi dozu",
    agentClass: "lmwh",
    intervals: {
      beforeBlock: "Son dozdan en az 24 saat sonra.",
      afterBlock:
        "Kanama riski düşük/orta cerrahide 24 saat, yüksek riskli cerrahide 48–72 saat sonra yeniden başlanır. İlk doz girişimden en az 24 saat sonra olmalıdır.",
      withCatheter: "Kateter, ilk postoperatif dozdan 4 saat önce çekilir.",
      renal:
        "24 saatten kısa sürede girişim gerekiyorsa — özellikle 75 yaş üstü ve KrKl ≤30 mL/dk — anti-Xa düzeyi düşünülür; ≤0,1 IU/mL önerilir.",
    },
    source: `${ASRA} (derece IC)`,
  },
  {
    id: "ufh-sc",
    name: "Standart heparin — subkutan",
    agentClass: "ufh",
    intervals: {
      beforeBlock:
        "Düşük doz (5000 U, günde 2–3 kez): 4–6 saat veya normal koagülasyon. 7500–10 000 U günde iki kez ya da günlük ≤20 000 U: 12 saat. Doz başına >10 000 U ya da günlük >20 000 U: 24 saat.",
      afterBlock: "Düşük dozda kateter çekiminden hemen sonra verilebilir.",
      withCatheter: "Düşük dozda kateter tutulabilir; son dozdan en az 4–6 saat sonra çekilir.",
    },
    source: `${ASRA} (derece IIC)`,
    note: "Yüksek dozlarda girişim öncesi koagülasyon durumu (aPTT) doğrulanmalıdır.",
  },
  {
    id: "ufh-iv",
    name: "Standart heparin — intravenöz infüzyon",
    agentClass: "ufh",
    intervals: {
      beforeBlock: "İnfüzyon en az 4–6 saat durdurulur ve koagülasyon normale döner.",
      afterBlock: "İğne yerleştirmeden en az 1 saat sonra; kateter çekiminden 1 saat sonra yeniden heparinize edilir.",
      withCatheter: "Kateter, son dozdan 4–6 saat sonra ve koagülasyon değerlendirildikten sonra çekilir.",
    },
    source: `${ASRA} (derece IA)`,
    note: "Tam antikoagülasyon altındaki kalp cerrahisinde nöraksiyel/derin pleksus kateteri tutulmaması önerilir.",
  },
  {
    id: "rivaroxaban",
    name: "Rivaroksaban",
    agentClass: "doac",
    intervals: {
      beforeBlock: "Yüksek dozda en az 72 saat; düşük dozda en az 24 saat.",
      afterBlock: "Kanama riski düşük/orta girişimden 24 saat, yüksek riskli girişimden 48–72 saat sonra.",
      renal: "Düşük dozda KrKl <30 mL/dk ise 30 saat.",
    },
    source: `${ASRA} (derece IIC)`,
    note: "Süre kısaltılacaksa plazma düzeyi <30 ng/mL veya anti-Xa ≤0,1 IU/mL kabul edilebilir sayılır. Travmatik girişimde bir sonraki doz 24 saat ertelenir.",
  },
  {
    id: "apixaban",
    name: "Apiksaban",
    agentClass: "doac",
    intervals: {
      beforeBlock: "Yüksek dozda en az 72 saat; düşük dozda en az 36 saat.",
      afterBlock: "Kanama riski düşük/orta girişimden 24 saat, yüksek riskli girişimden 48–72 saat sonra.",
    },
    source: `${ASRA} (derece IIC)`,
    note: "Plazma düzeyi <30 ng/mL veya anti-Xa ≤0,1 IU/mL kabul edilebilir sayılır. Travmatik girişimde bir sonraki doz 48 saat ertelenir.",
  },
  {
    id: "edoxaban",
    name: "Edoksaban",
    agentClass: "doac",
    intervals: {
      beforeBlock: "Yüksek dozda en az 72 saat.",
      afterBlock: "Kanama riski düşük/orta girişimden 24 saat, yüksek riskli girişimden 48–72 saat sonra.",
    },
    source: `${ASRA} (derece IIC)`,
    note: "Kılavuz düşük doz için ayrı bir süre vermiyor. Plazma düzeyi <30 ng/mL veya anti-Xa ≤0,1 IU/mL kabul edilebilir sayılır.",
  },
  {
    id: "dabigatran",
    name: "Dabigatran",
    agentClass: "doac",
    intervals: {
      beforeBlock: "Yüksek dozda (KrKl ≥50 mL/dk) en az 72 saat; düşük dozda en az 48 saat.",
      afterBlock: "Kanama riski düşük/orta girişimden 24 saat, yüksek riskli girişimden 48–72 saat sonra.",
      renal:
        "KrKl 30–49 mL/dk ise yüksek dozda 120 saat. KrKl <30 mL/dk ise plazma düzeyi <30 ng/mL gösterilmedikçe blok önerilmez.",
    },
    source: `${ASRA} (derece IIC)`,
  },
  {
    id: "warfarin",
    name: "Varfarin",
    agentClass: "vka",
    intervals: {
      beforeBlock: "5 gün önce kesilir ve INR normale döndüğü doğrulanır.",
      afterBlock: "Çekimden sonra en az 48 saat nörolojik izlem sürdürülür.",
      withCatheter:
        "Kateter INR <1,5 iken çekilir. INR 1,5–3 arasında risk bilinmiyor; dikkatle tutulabilir ya da çekilebilir. INR >3 ise doz azaltılır veya atlanır.",
    },
    source: `${ASRA} (derece IB / IIC)`,
    note: "Epidural analjezi sırasında düşük doz varfarin alan hastada INR günlük izlenir.",
  },
  {
    id: "fondaparinux",
    name: "Fondaparinuks",
    agentClass: "lmwh",
    intervals: {
      beforeBlock:
        "Düşük dozda (2,5 mg/gün) böbrek işlevi normalse genç hastada 36, yaşlı hastada 42 saat.",
      afterBlock: "Kateter çekimi sonrası zamanlama için kılavuzda ayrı bir süre verilmiyor.",
      renal: "KrKl 30–50 mL/dk ise en az 58 saat.",
    },
    source: `${ASRA} (derece IIC)`,
  },
  {
    id: "alteplase",
    name: "Alteplaz / trombolitik",
    agentClass: "thrombolytic",
    intervals: {
      beforeBlock: "Kılavuz güvenli bir aralık tanımlamıyor; blok yapılmaması esastır.",
      afterBlock: "Son dozdan sonra en az 48 saat, 2 saatte bir nörolojik izlem.",
      withCatheter:
        "Beklenmedik biçimde trombolitik verilirse kateter çekim zamanı için kesin öneri yok; rezidüel etkiyi göstermek için fibrinojen düzeyi bakılması önerilir.",
    },
    source: `${ASRA} (derece IA / IC)`,
    note: "Kateter infüzyonu, nörolojik değerlendirmeyi bozmayacak en düşük konsantrasyonda sürdürülür.",
  },
  {
    id: "herbal",
    name: "Sarımsak, ginkgo, ginseng",
    agentClass: "herbal",
    intervals: {
      beforeBlock: "Kesilmesi gerekmez.",
      afterBlock: "Kısıt yok.",
      withCatheter: "Kısıt yok.",
    },
    source: `${ASRA} (derece IC)`,
    note: "Başka bir nedenle kesilecekse hemostazın normale dönmesi: sarımsak ~7 gün, ginkgo ~36 saat, ginseng ~24 saat.",
  },
];

export const SOURCE_PENDING_NOTE =
  "Bekleme süreleri henüz girilmedi. Bu sayılar hafızadan yazılmaz: ASRA veya ESRA kılavuzundan, baskı bilgisiyle birlikte girilmelidir.";

export const HOW_TO_FILL =
  "src/data/anticoagulation.ts içindeki AGENTS listesinde her ilacın intervals ve source alanlarını doldurun; kaynağı yazılmamış bir değer denetimden geçmez.";

/** Süreler girildiğinde ekranın başında gösterilen kaynak satırı. */
export const INTERVALS_SOURCE_NOTE =
  "Süreler ASRA PM 5. baskısından (Kopp SL ve ark., Reg Anesth Pain Med 2025) alınmış, kendi ifademizle yazılmıştır. Kılavuz bu önerileri nöraksiyel bloklarla birlikte derin pleksus ve derin periferik bloklar için de veriyor. Hasta başında kılavuzun kendi metni ve kurum protokolünüz esastır.";

/** Girilmiş süresi olan ilaç var mı — ekranın hangi durumu göstereceğini belirler. */
export function hasIntervals(): boolean {
  return AGENTS.some((a) => a.intervals !== undefined);
}
