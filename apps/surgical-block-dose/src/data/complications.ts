/**
 * Blok başına komplikasyonlar ve emilim hızına göre LAST riski.
 *
 * İki ayrı şey burada bir arada duruyor, çünkü ikisi de aynı soruyu yanıtlıyor:
 * bu blokta neye hazırlıklı olmalıyım?
 *
 * 1. **Emilim tepesi.** Aynı doz, enjekte edildiği yere göre farklı bir plazma
 *    tepesi yapar. Sıralama (interkostal > kaudal/epidural > pleksus >
 *    periferik > cilt altı) klasik öğretim bilgisidir ve doz tavanı tek başına
 *    bunu söylemez: tavanın altında kalan bir interkostal blok, aynı mg'ın
 *    femoral bloğundan daha yüksek plazma düzeyi yapar.
 *
 * 2. **Tekniğe özgü komplikasyon.** Her bloğun ortak riskleri (LAST, sinir
 *    hasarı, enfeksiyon, damar ponksiyonu) tek tek tekrarlanmaz — bunlar
 *    `UNIVERSAL` altında bir kez söylenir. Burada listelenenler o bloğa özgü
 *    olan, önceden bilinmesi kararı değiştirenlerdir: frenik felç, plevra
 *    yakınlığı, düşme riski, idrar retansiyonu gibi.
 *
 * Sıklık verilmeyen yerde uydurulmadı; "sık", "seyrek" gibi nitelemeler ancak
 * yaygın olarak bildirilen büyüklükler için kullanıldı.
 */

export type AbsorptionTier = "highest" | "high" | "moderate" | "low";

export interface AbsorptionInfo {
  tier: AbsorptionTier;
  label: string;
  detail: string;
}

export const ABSORPTION_TIERS: Record<AbsorptionTier, AbsorptionInfo> = {
  highest: {
    tier: "highest",
    label: "Çok hızlı emilim",
    detail:
      "Damardan zengin, geniş yüzeyli alan: aynı mg burada en yüksek plazma tepesini yapar. Tavanın altında kalmak tek başına güvence değildir.",
  },
  high: {
    tier: "high",
    label: "Hızlı emilim",
    detail: "Plazma tepesi periferik bloklardan belirgin yüksektir; toplam dozu buna göre planlayın.",
  },
  moderate: {
    tier: "moderate",
    label: "Orta emilim",
    detail: "Fasya planları ve pleksus blokları: hacim büyük olduğu için toplam mg hızla birikir.",
  },
  low: {
    tier: "low",
    label: "Yavaş emilim",
    detail: "Sınırlı yüzey; plazma tepesi düşüktür, ama tavan yine de geçerlidir.",
  },
};

/**
 * Teknik → emilim basamağı. Damar yakınlığı ve enjekte edilen yüzey belirler;
 * dozdan bağımsızdır.
 */
export const ABSORPTION: Record<string, AbsorptionTier> = {
  intercostal: "highest",
  parasternal: "high",
  caudal: "high",
  "epidural-lumbar": "high",
  "epidural-thoracic": "high",
  paravertebral: "high",
  tumescent: "high",
  "esp-thoracic": "moderate",
  "esp-lumbar": "moderate",
  serratus: "moderate",
  pecs1: "moderate",
  pecs2: "moderate",
  tap: "moderate",
  "quadratus-lumborum": "moderate",
  "rectus-sheath": "moderate",
  ilioinguinal: "moderate",
  "fascia-iliaca": "moderate",
  interscalene: "moderate",
  supraclavicular: "moderate",
  infraclavicular: "moderate",
  "axillary-plexus": "moderate",
  "deep-cervical": "moderate",
  scpb: "low",
  femoral: "moderate",
  obturator: "moderate",
  "sciatic-subgluteal": "moderate",
  "sciatic-popliteal": "moderate",
  acb: "low",
  saphenous: "low",
  ipack: "low",
  peng: "low",
  genicular: "low",
  "ankle-block": "low",
  "wrist-block": "low",
  "axillary-nerve": "low",
  suprascapular: "low",
  digital: "low",
  "scalp-block": "moderate",
  pudendal: "moderate",
  penile: "low",
  "port-site": "low",
  "wound-infiltration": "low",
  spinal: "low",
  ivra: "highest",
};

export type ComplicationSeverity = "critical" | "notable" | "nuisance";

export interface Complication {
  title: string;
  detail: string;
  severity: ComplicationSeverity;
}

/** Her bloğun ortak riskleri; blok kartlarında tekrarlanmaz. */
export const UNIVERSAL: Complication[] = [
  {
    title: "Lokal anestezik sistemik toksisitesi",
    detail:
      "Her blokta olasıdır. Aspirasyon, bölünmüş doz, ultrason eşliğinde iğne ucunun izlenmesi ve lipid emülsiyonuna hazır olmak ortak korunma yollarıdır.",
    severity: "critical",
  },
  {
    title: "Sinir hasarı",
    detail:
      "Geçici nörolojik semptom seyrek, kalıcı hasar çok seyrektir. İntranöral enjeksiyon basıncı ve parestezi eşliğinde enjeksiyon riski artırır.",
    severity: "notable",
  },
  {
    title: "Damar ponksiyonu ve hematom",
    detail: "Antikoagülan kullanan hastada kompresyona uygun olmayan derin bloklar ayrıca değerlendirilir.",
    severity: "notable",
  },
  { title: "Enfeksiyon", detail: "Tek enjeksiyonda seyrek; kateterlerde süreyle artar.", severity: "nuisance" },
];

/**
 * Tekniğe özgü, önceden bilinmesi kararı değiştiren komplikasyonlar.
 * Listelenmeyen teknikler yalnızca ortak riskleri ve emilim basamağını gösterir.
 */
export const COMPLICATIONS: Record<string, Complication[]> = {
  interscalene: [
    {
      title: "Frenik sinir felci",
      detail:
        "Klasik hacimlerde neredeyse her hastada geçici hemidiyafram felci olur; solunum rezervi sınırlı hastada (ağır KOAH, tek akciğer) kontrendikasyona yakındır.",
      severity: "critical",
    },
    {
      title: "Horner sendromu, ses kısıklığı",
      detail: "Stellat gangliyon ve rekürren laringeal sinire yayılım; geçicidir ama hastaya önceden söylenmelidir.",
      severity: "nuisance",
    },
    {
      title: "Epidural/intratekal yayılım",
      detail: "Çok seyrek; iğne çok medial yönlendirilirse kök kılıfı boyunca yayılım bildirilmiştir.",
      severity: "critical",
    },
  ],
  supraclavicular: [
    {
      title: "Pnömotoraks",
      detail:
        "Plevra iğne yolunun hemen altındadır. Ultrason eşliğinde risk düşüktür ama sıfır değildir; ayaktan hastada geç pnömotoraks açısından bilgilendirme gerekir.",
      severity: "critical",
    },
    {
      title: "Frenik felç",
      detail: "İnterskalene göre daha seyrek — yaklaşık üçte bir–yarı oranında bildirilir.",
      severity: "notable",
    },
  ],
  infraclavicular: [
    {
      title: "Damar ponksiyonu (aksiller damarlar)",
      detail: "İğne yolu aksiller arter ve ven çevresindedir; derin konum nedeniyle kompresyon güçtür.",
      severity: "notable",
    },
    { title: "Pnömotoraks", detail: "Medial yaklaşımda ve zayıf hastada bildirilmiştir.", severity: "critical" },
  ],
  "deep-cervical": [
    {
      title: "Frenik felç ve vertebral arter enjeksiyonu",
      detail:
        "Vertebral artere enjeksiyon çok küçük hacimde bile ani nöbet yapar. İki taraflı derin blok yapılmaz.",
      severity: "critical",
    },
  ],
  paravertebral: [
    {
      title: "Pnömotoraks",
      detail: "Plevra hedef aralığın hemen önündedir; derinlik ultrasonla doğrulanmalıdır.",
      severity: "critical",
    },
    {
      title: "Epidural yayılım ve hipotansiyon",
      detail: "Tek taraflı beklenen blok iki taraflı olabilir; sempatik blokaj hipotansiyon yapar.",
      severity: "notable",
    },
  ],
  intercostal: [
    {
      title: "Pnömotoraks",
      detail: "Kot alt kenarındaki oluk plevraya bitişiktir; çok seviyeli blokta risk seviye sayısıyla artar.",
      severity: "critical",
    },
    {
      title: "En yüksek plazma tepesi",
      detail:
        "Bütün rejyonal tekniklerin içinde aynı mg için en yüksek plazma düzeyini yapar; çok seviyeli blokta toplam doz kolayca tavana dayanır.",
      severity: "critical",
    },
  ],
  spinal: [
    {
      title: "Hipotansiyon ve bradikardi",
      detail: "Sempatik blokaj seviyeye bağlıdır; yüksek blokta kardiyoakseleratör lifler (T1–T4) de tutulur.",
      severity: "critical",
    },
    {
      title: "Postdural ponksiyon baş ağrısı",
      detail: "İnce, kalem uçlu iğnelerle seyrekleşir; genç ve gebe hastalarda daha sıktır.",
      severity: "notable",
    },
    { title: "İdrar retansiyonu", detail: "Sakral kökler geç çözülür; taburculuk kriterlerine girer.", severity: "nuisance" },
  ],
  "epidural-lumbar": [
    {
      title: "Dural ponksiyon ve baş ağrısı",
      detail: "Kalın iğne nedeniyle ponksiyon olursa baş ağrısı olasılığı yüksektir.",
      severity: "notable",
    },
    {
      title: "Epidural hematom",
      detail:
        "Seyrek ama felçle sonuçlanabilir. Antikoagülan zamanlaması bu blokta kesin belirleyicidir; kateter çekimi de aynı kurallara tabidir.",
      severity: "critical",
    },
    { title: "Hipotansiyon", detail: "Sempatik blokaja bağlı; konsantrasyonla ölçeklenir.", severity: "notable" },
  ],
  "epidural-thoracic": [
    {
      title: "Epidural hematom",
      detail: "Lomber epiduralle aynı kurallar; torakal seviyede kord basısı sonucu daha ağırdır.",
      severity: "critical",
    },
    {
      title: "Hipotansiyon",
      detail: "Torakal sempatik blokaj hipotansiyonun ana kaynağıdır; sıvı yerine vazopressör tercih edilir.",
      severity: "notable",
    },
  ],
  caudal: [
    {
      title: "Yanlış yerleşim",
      detail: "Sakral kanal dışına, damara veya kemik iliğine enjeksiyon; ultrason doğrulaması riski azaltır.",
      severity: "notable",
    },
    { title: "İdrar retansiyonu", detail: "Yüksek hacimlerde ve lokal anestezik yoğunluğu arttıkça sıklaşır.", severity: "nuisance" },
  ],
  femoral: [
    {
      title: "Kuadriseps zayıflığı ve düşme",
      detail:
        "Diz ekstansiyonu zayıflar; ayağa kalkacak hastada düşme riski artar. Ambulatuvar cerrahide adduktor kanal tercih edilmesinin sebebi budur.",
      severity: "critical",
    },
  ],
  "fascia-iliaca": [
    {
      title: "Kuadriseps zayıflığı",
      detail: "Femoral sinir kapsandığı için düşme riski femoral blokla aynıdır.",
      severity: "notable",
    },
    { title: "Yüksek hacim", detail: "30–40 mL kullanılır; konsantrasyon buna göre seyreltilmelidir.", severity: "notable" },
  ],
  "sciatic-subgluteal": [
    {
      title: "Ayak düşmesi ve basınç yarası",
      detail:
        "Motor blok saatlerce sürer; duyusuz ayakta pozisyon ve topuk basıncı ayrıca korunmalıdır.",
      severity: "notable",
    },
  ],
  "sciatic-popliteal": [
    {
      title: "Duyusuz ayakta yaralanma",
      detail: "Taburcu edilen hastaya blok çözülene kadar yük vermemesi ve ayağı koruması anlatılmalıdır.",
      severity: "notable",
    },
  ],
  tap: [
    {
      title: "Peritona veya organa giriş",
      detail: "Hepatik/dalak yaralanması bildirilmiştir; ultrason eşliğinde iğne ucu görülmelidir.",
      severity: "critical",
    },
    {
      title: "İki taraflı yüksek toplam doz",
      detail: "İki taraf yapıldığında mg iki katına çıkar; tavan hesabı tek taraf üzerinden yapılmamalıdır.",
      severity: "notable",
    },
  ],
  "quadratus-lumborum": [
    {
      title: "Kuadriseps zayıflığı",
      detail: "Lomber pleksusa yayılım bildirilmiştir; ambulasyon planı buna göre yapılır.",
      severity: "notable",
    },
    { title: "Peritona giriş", detail: "Derin plan; iğne ucu sürekli izlenmelidir.", severity: "notable" },
  ],
  "rectus-sheath": [
    { title: "Periton ve epigastrik damar", detail: "Arka kılıf ile periton arasındaki mesafe incedir.", severity: "notable" },
  ],
  ilioinguinal: [
    {
      title: "Femoral sinire yayılım",
      detail: "Enjeksiyon derin olursa geçici kuadriseps zayıflığı olur; ayaktan hastada düşme riski doğurur.",
      severity: "notable",
    },
    { title: "Kolon perforasyonu", detail: "Landmark tekniğinde çocuklarda bildirilmiştir.", severity: "critical" },
  ],
  pecs2: [
    { title: "Pnömotoraks", detail: "Kot ve plevra plan altındadır; iğne ucu izlenmelidir.", severity: "critical" },
  ],
  serratus: [
    { title: "Pnömotoraks", detail: "Plan kot yüzeyindedir; derinleşen iğne plevraya ulaşır.", severity: "critical" },
  ],
  parasternal: [
    {
      title: "İnternal torasik arter",
      detail: "Plan arterin hemen yanındadır; renkli Doppler ile tanımlanmadan enjeksiyon yapılmaz.",
      severity: "critical",
    },
  ],
  ivra: [
    {
      title: "Turnike gevşemesi",
      detail:
        "Turnikenin erken açılması bütün dozu tek seferde dolaşıma verir. En az 20–30 dakika şişirilmiş kalmalı, açılırken kademeli bırakılmalıdır.",
      severity: "critical",
    },
    {
      title: "Bupivakain kullanılmaz",
      detail: "Kardiyotoksisitesi nedeniyle bu teknikte kesin olarak dışlanır; prilokain veya lidokain kullanılır.",
      severity: "critical",
    },
  ],
  scpb: [
    { title: "Yanlışlıkla derin enjeksiyon", detail: "Fasya altına geçilirse frenik sinir tutulabilir.", severity: "notable" },
  ],
  "scalp-block": [
    {
      title: "İntravasküler enjeksiyon",
      detail: "Skalp damardan çok zengindir; aspirasyon ve bölünmüş doz özellikle önemlidir.",
      severity: "critical",
    },
  ],
  tumescent: [
    {
      title: "Geç plazma tepesi",
      detail:
        "Lidokainin tepe düzeyi 8–12 saat sonra görülebilir; hasta işlem bittiğinde iyi görünse de izlem süresi buna göre planlanır.",
      severity: "critical",
    },
  ],
  digital: [
    {
      title: "Dolaşım",
      detail:
        "Hacim küçük tutulur; parmakta basınç etkisinden kaçınılır. Vazokonstriktör kullanımı bugün dışlanmasa da tartışmalıdır ve kurum protokolüne bakılır.",
      severity: "notable",
    },
  ],
  penile: [
    {
      title: "Adrenalin kullanılmaz",
      detail: "Uç arter dolaşımı nedeniyle vazokonstriktörlü solüsyon kesinlikle kullanılmaz.",
      severity: "critical",
    },
  ],
  pudendal: [
    { title: "İntravasküler enjeksiyon", detail: "İnternal pudendal arter hedefe bitişiktir.", severity: "notable" },
  ],
  "axillary-plexus": [
    { title: "Damar ponksiyonu", detail: "Aksiller arter hedeflerin ortasındadır; transarteriyel teknikte hematom sıktır.", severity: "notable" },
  ],
  peng: [
    {
      title: "Kuadriseps zayıflığı",
      detail:
        "Yüksek hacimde femoral sinire yayılım bildirilmiştir; 'motor koruyucu' beklentisi her zaman gerçekleşmez.",
      severity: "notable",
    },
  ],
  acb: [
    {
      title: "Kısmi kuadriseps etkisi",
      detail:
        "Vastus medialis dalı kanaldan geçer; blok tam anlamıyla motor koruyucu değildir, ilk mobilizasyonda dikkat gerekir.",
      severity: "nuisance",
    },
  ],
};

export function complicationsFor(techniqueId: string): Complication[] {
  return COMPLICATIONS[techniqueId] ?? [];
}

export function absorptionFor(techniqueId: string): AbsorptionInfo | undefined {
  const tier = ABSORPTION[techniqueId];
  return tier ? ABSORPTION_TIERS[tier] : undefined;
}

/** Emilim sıralamasının kendisi — LAST ekranında tablo olarak gösterilir. */
export const ABSORPTION_ORDER: { tier: AbsorptionTier; examples: string }[] = [
  { tier: "highest", examples: "İnterkostal, IVRA (turnike açılırken)" },
  { tier: "high", examples: "Kaudal, epidural, paravertebral, tümesan" },
  { tier: "moderate", examples: "Pleksus blokları, fasya planları (TAP, ESP, QL, fasya iliaka)" },
  { tier: "low", examples: "Periferik tek sinir blokları, cilt altı infiltrasyon" },
];
