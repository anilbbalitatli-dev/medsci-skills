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
 * 2. **İlaç bekleme süreleri** — HENÜZ GİRİLMEDİ. Bu sayılar hastanın felç
 *    olup olmayacağını belirleyen sayılardır ve hafızadan yazılmaz. Her satır
 *    kaynağı girilene kadar "kaynak bekliyor" olarak görünür; uygulama eksik
 *    olanı gizlemek yerine gösterir.
 *
 * Değerleri girmek için: her ilacın `intervals` alanını doldurun ve `source`
 * satırına hangi kılavuzun hangi baskısından alındığını yazın. Kaynak
 * yazılmadan girilen bir değer denetimde hata verir.
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
      "Nöraksiyel bloklarla aynı kurallar uygulanır: kanama basıyla durdurulamaz ve kapalı bir aralıkta sinir basısı yapar. Antikoagülan zamanlaması burada kesin belirleyicidir; kateter çekimi de aynı kurallara tabidir.",
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

/**
 * İlaçlar listelenmiştir, süreler değil.
 *
 * Liste tam olsun diye Türkiye'de yaygın kullanılan ajanlar yazıldı; süreler
 * ASRA/ESRA tablosundan girilecek. Boş bırakmak kasıtlıdır: yaklaşık bir sayı
 * yazmak, hiç sayı yazmamaktan daha tehlikelidir.
 */
export const AGENTS: AnticoagulantAgent[] = [
  { id: "asa", name: "Asetilsalisilik asit", agentClass: "antiplatelet" },
  { id: "clopidogrel", name: "Klopidogrel", agentClass: "antiplatelet" },
  { id: "ticagrelor", name: "Tikagrelor", agentClass: "antiplatelet" },
  { id: "prasugrel", name: "Prasugrel", agentClass: "antiplatelet" },
  { id: "nsaid", name: "NSAİİ", agentClass: "antiplatelet" },
  {
    id: "enoxaparin-prophylactic",
    name: "Enoksaparin — profilaktik doz",
    agentClass: "lmwh",
  },
  {
    id: "enoxaparin-therapeutic",
    name: "Enoksaparin — tedavi dozu",
    agentClass: "lmwh",
  },
  { id: "ufh-sc", name: "Standart heparin — subkutan profilaksi", agentClass: "ufh" },
  { id: "ufh-iv", name: "Standart heparin — intravenöz infüzyon", agentClass: "ufh" },
  { id: "rivaroxaban", name: "Rivaroksaban", agentClass: "doac" },
  { id: "apixaban", name: "Apiksaban", agentClass: "doac" },
  { id: "edoxaban", name: "Edoksaban", agentClass: "doac" },
  { id: "dabigatran", name: "Dabigatran", agentClass: "doac" },
  { id: "warfarin", name: "Varfarin", agentClass: "vka" },
  { id: "fondaparinux", name: "Fondaparinuks", agentClass: "lmwh" },
  { id: "alteplase", name: "Alteplaz / trombolitik", agentClass: "thrombolytic" },
  { id: "herbal", name: "Sarımsak, ginkgo, ginseng", agentClass: "herbal" },
];

export const SOURCE_PENDING_NOTE =
  "Bekleme süreleri henüz girilmedi. Bu sayılar hafızadan yazılmaz: ASRA Regional Anesthesia and Pain Medicine antikoagülasyon kılavuzundan veya ESRA'nın güncel tablosundan, baskı bilgisiyle birlikte girilmelidir.";

export const HOW_TO_FILL =
  "src/data/anticoagulation.ts içindeki AGENTS listesinde her ilacın intervals ve source alanlarını doldurun; kaynağı yazılmamış bir değer denetimden geçmez.";

/** Girilmiş süresi olan ilaç var mı — ekranın hangi durumu göstereceğini belirler. */
export function hasIntervals(): boolean {
  return AGENTS.some((a) => a.intervals !== undefined);
}
