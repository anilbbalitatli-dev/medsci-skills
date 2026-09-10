import { AgeBand } from "./age-dosing";
import { LOCAL_ANESTHETICS } from "./local-anesthetics";
import { Technique } from "./techniques";

/**
 * Kateter, infüzyon ve yeniden doz.
 *
 * Uygulama şimdiye kadar yalnızca tek atımı biliyordu: bir blok yapılır, dozu
 * hesaplanır, iş biter. Oysa postoperatif analjezinin büyük kısmı kateterden
 * yürür ve orada sorulan sorular başkadır — hangi bloğa kateter konur, hangi
 * hızda ne verilir, blok ne zaman çözülür, çözüldüğünde ne yapılır.
 *
 * İki şey bilinçli olarak ayrı tutuluyor:
 *
 * 1. **Tek atım tavanı infüzyonu yönetmez.** mg/kg tek doz sınırı bir bolusun
 *    tepe plazma düzeyi içindir. Saatlerce süren infüzyonda soru birikimdir ve
 *    sınır mg/kg/saat cinsindendir. Uygulamanın tek atım tavanını infüzyona
 *    uygulamak, 24 saatte verilen 480 mg ropivakaini "tavanı 2,4 kat aştı"
 *    diye kırmızıya boyardı — oysa 0,3 mg/kg/sa ile giden 70 kiloluk bir
 *    hastada bu beklenen değerdir.
 *
 * 2. **Yeniden doz bir "tekrar" değildir.** Kateteri olmayan tek atım bloğu
 *    çözüldüğünde bloğu yenilemek çoğu zaman seçenek değildir; asıl karar
 *    çözülmeden önce sistemik analjeziye geçmektir. Bu yüzden zaman çizelgesi
 *    "ne zaman tekrarla" değil "ne zaman hazırlan" diye okunur.
 *
 * Rejimler tek bir kılavuzdan gelmiyor — sürekli periferik blok için
 * uluslararası kabul görmüş tek bir doz tablosu yok. Bunlar yaygın öğretim
 * aralıklarıdır ve kurumdan kuruma değişir; ekran bunu her yerde söyler.
 */

export type CatheterRoute = "perineural" | "epidural" | "fascial";

export interface CatheterRegimen {
  techniqueId: string;
  route: CatheterRoute;
  /** Tipik infüzyon konsantrasyonu (%). */
  concentrationPercent: number;
  /** Bazal hız aralığı, mL/sa. */
  basalMlPerHour: [number, number];
  /** Hasta kontrollü bolus, mL. */
  bolusMl?: number;
  /** Bolus kilidi, dakika. */
  lockoutMin?: number;
  /** Bu kateterde dikkat edilen şey. */
  note: string;
}

/**
 * Infüzyon konsantrasyonu tek atımdan düşüktür ve bu tesadüf değil: kateterin
 * amacı duyusal analjeziyi sürdürmek, motor bloğu sürdürmek değildir. %0.2
 * ropivakain bunun yerleşik karşılığıdır; %0.5 ile giden bir kateter hastayı
 * yatağa bağlar ve düşme riski yaratır.
 */
export const INFUSION_CONCENTRATION_RATIONALE =
  "İnfüzyon konsantrasyonu tek atımdan düşüktür: amaç analjeziyi sürdürmek, motor bloğu sürdürmek değil. Yoğun motor blok hem mobilizasyonu hem de sinir hasarının erken fark edilmesini engeller.";

export const CATHETER_REGIMENS: CatheterRegimen[] = [
  // ---- Üst ekstremite ----
  {
    techniqueId: "interscalene",
    route: "perineural",
    concentrationPercent: 0.2,
    basalMlPerHour: [4, 6],
    bolusMl: 4,
    lockoutMin: 30,
    note: "Frenik etki bazal hızla sürer; solunum rezervi kısıtlı hastada bazal hızı düşük tutup bolusa yaslanmak tercih edilir. Tek taraflı kalmak zorundadır.",
  },
  {
    techniqueId: "supraclavicular",
    route: "perineural",
    concentrationPercent: 0.2,
    basalMlPerHour: [4, 6],
    bolusMl: 4,
    lockoutMin: 30,
    note: "Kateterin yeri interskalene göre daha stabildir; plevra yakınlığı nedeniyle yerleştirme sırasında görüntüleme şart.",
  },
  {
    techniqueId: "infraclavicular",
    route: "perineural",
    concentrationPercent: 0.2,
    basalMlPerHour: [5, 8],
    bolusMl: 5,
    lockoutMin: 30,
    note: "Derin ve kas içinden geçen tünel sayesinde kateter yerinde en iyi duran üst ekstremite yaklaşımıdır; el ve önkol cerrahisinde tercih edilir.",
  },
  {
    techniqueId: "axillary-plexus",
    route: "perineural",
    concentrationPercent: 0.2,
    basalMlPerHour: [5, 8],
    bolusMl: 5,
    lockoutMin: 30,
    note: "Kateter yüzeyeldir ve kol hareketiyle kolay yer değiştirir; tespit kalitesi sonucun büyük bölümünü belirler.",
  },

  // ---- Alt ekstremite ----
  {
    techniqueId: "femoral",
    route: "perineural",
    concentrationPercent: 0.2,
    basalMlPerHour: [5, 8],
    bolusMl: 5,
    lockoutMin: 30,
    note: "Kuadriseps zayıflığı bazal hızla sürer. Diz protezinde erken mobilizasyon isteniyorsa adduktor kanal kateteri tercih edilir.",
  },
  {
    techniqueId: "acb",
    route: "perineural",
    concentrationPercent: 0.2,
    basalMlPerHour: [5, 8],
    bolusMl: 5,
    lockoutMin: 30,
    note: "Kuadrisepsi büyük ölçüde koruduğu için diz protezinde standart kateter hâline gelmiştir; yüksek hacimli bolus proksimale yayılıp femoral bloğa dönüşebilir.",
  },
  {
    techniqueId: "sciatic-popliteal",
    route: "perineural",
    concentrationPercent: 0.2,
    basalMlPerHour: [4, 6],
    bolusMl: 5,
    lockoutMin: 30,
    note: "Ayak düşmesi beklenen bulgudur ve hastaya önceden söylenmelidir; aksi hâlde sinir hasarı sanılır. Ayak bileği ortezi ve düşme önlemi planlanır.",
  },
  {
    techniqueId: "sciatic-subgluteal",
    route: "perineural",
    concentrationPercent: 0.2,
    basalMlPerHour: [5, 8],
    bolusMl: 5,
    lockoutMin: 30,
    note: "Hamstring zayıflığı da eklenir; yatak içi hareket ve transfer planı buna göre yapılır.",
  },
  {
    techniqueId: "fascia-iliaca",
    route: "fascial",
    concentrationPercent: 0.2,
    basalMlPerHour: [6, 10],
    bolusMl: 10,
    lockoutMin: 60,
    note: "Fasya planı kateteri hacme dayanır: bazal hız düşükse ilaç yayılmaz ve blok daralarak yalnızca femorale döner.",
  },

  // ---- Gövde ve fasya planları ----
  {
    techniqueId: "esp-thoracic",
    route: "fascial",
    concentrationPercent: 0.2,
    basalMlPerHour: [6, 10],
    bolusMl: 10,
    lockoutMin: 60,
    note: "Yayılım hacme bağlı olduğu için aralıklı bolus, düşük bazal hızdan üstündür. İki taraflı konulduğunda toplam doz iki katına çıkar.",
  },
  {
    techniqueId: "esp-lumbar",
    route: "fascial",
    concentrationPercent: 0.2,
    basalMlPerHour: [6, 10],
    bolusMl: 10,
    lockoutMin: 60,
    note: "Torasik ESP ile aynı mantık; lomber düzeyde yayılım daha değişkendir ve kapsama seviyesi hastadan hastaya oynar.",
  },
  {
    techniqueId: "paravertebral",
    route: "perineural",
    concentrationPercent: 0.2,
    basalMlPerHour: [5, 10],
    bolusMl: 5,
    lockoutMin: 60,
    note: "Epiduralin tek taraflı alternatifidir ve hemodinamik etkisi belirgin daha azdır; buna karşılık epidural yayılım ve plevra delinmesi olasılığı sürer.",
  },
  {
    techniqueId: "serratus",
    route: "fascial",
    concentrationPercent: 0.2,
    basalMlPerHour: [5, 10],
    bolusMl: 10,
    lockoutMin: 60,
    note: "Kot kırığı ve torakotomide kullanılır; kateter kas planları arasında kaydığı için tespit ve günlük kontrol önemlidir.",
  },
  {
    techniqueId: "tap",
    route: "fascial",
    concentrationPercent: 0.2,
    basalMlPerHour: [5, 8],
    bolusMl: 10,
    lockoutMin: 60,
    note: "Yalnızca somatik karın duvarı ağrısını karşılar; visseral ağrı için tek başına yetmez. İki taraflı konulduğunda toplam doz iki katına çıkar.",
  },
  {
    techniqueId: "quadratus-lumborum",
    route: "fascial",
    concentrationPercent: 0.2,
    basalMlPerHour: [5, 8],
    bolusMl: 10,
    lockoutMin: 60,
    note: "TAP'a göre daha geniş ve daha proksimal yayılım hedeflenir; buna karşılık yayılımın öngörülebilirliği düşüktür.",
  },

  // ---- Nöraksiyel ----
  {
    techniqueId: "epidural-thoracic",
    route: "epidural",
    concentrationPercent: 0.1,
    basalMlPerHour: [4, 8],
    bolusMl: 4,
    lockoutMin: 20,
    note: "Analjezik konsantrasyonda opioid eklenir ve bazal hız düşük tutulur. Hipotansiyon, idrar retansiyonu ve — antikoagülan alan hastada — epidural hematom için günlük nörolojik takip zorunludur.",
  },
  {
    techniqueId: "epidural-lumbar",
    route: "epidural",
    concentrationPercent: 0.1,
    basalMlPerHour: [6, 12],
    bolusMl: 5,
    lockoutMin: 20,
    note: "Motor blok hem mobilizasyonu hem de gelişen bir hematomun erken bulgusunu maskeler; konsantrasyon bu yüzden mümkün olan en düşükte tutulur.",
  },
];

export function regimenFor(techniqueId: string): CatheterRegimen | undefined {
  return CATHETER_REGIMENS.find((r) => r.techniqueId === techniqueId);
}

export const CATHETER_ROUTES: { id: CatheterRoute; label: string }[] = [
  { id: "perineural", label: "Perinöral" },
  { id: "fascial", label: "Fasya planı" },
  { id: "epidural", label: "Epidural" },
];

/**
 * Erişkinde sürekli infüzyon tavanları, mg/kg/saat.
 *
 * Tek atım tavanından ayrı bir büyüklüktür ve karıştırılması hem yanlış
 * alarma hem de yanlış güvene yol açar. Pediatrik karşılıkları kılavuzlarda
 * yayımlıdır ve `pediatric-dosing.ts` içindedir; erişkinde eşdeğer bir
 * kılavuz tablosu yoktur, aşağıdakiler yaygın öğretim değerleridir.
 *
 * Sayı bir hedef değil bir üst sınırdır: rutin postoperatif kateter %0.2
 * ropivakainle 6–8 mL/sa giderken 70 kiloluk bir hastada 0,2 mg/kg/sa
 * dolayındadır, yani sınırın epeyce altında.
 */
export interface AdultInfusionLimit {
  drug: string;
  mgPerKgPerHour: number;
  note: string;
}

export const ADULT_INFUSION_LIMITS: AdultInfusionLimit[] = [
  {
    drug: "Ropivakain",
    mgPerKgPerHour: 0.5,
    note: "Sağlıklı erişkinde 72 saate kadar süren infüzyonlarda yaygın kullanılan üst sınır.",
  },
  {
    drug: "Levobupivakain",
    mgPerKgPerHour: 0.4,
    note: "Ropivakainden daha ihtiyatlı tutulur; birikim eğilimi daha belirgindir.",
  },
  {
    drug: "Bupivakain",
    mgPerKgPerHour: 0.4,
    note: "Kardiyotoksisitesi yüksek olduğundan uzun infüzyonlarda tercih edilmez; kullanılıyorsa sınıra yaklaşılmamalıdır.",
  },
];

export function adultInfusionLimit(drug: string): AdultInfusionLimit | undefined {
  return ADULT_INFUSION_LIMITS.find((l) =>
    drug.toLowerCase().startsWith(l.drug.toLowerCase())
  );
}

/**
 * Karaciğer ve böbrek yetmezliğinde infüzyon sınırı düşer, çünkü sorun
 * bolusun tepe düzeyi değil birikimin dengeye gelmesidir. Uygulama bu
 * düzeltmeyi yapmaz; söylemek yapmaktan daha dürüst.
 */
export const INFUSION_ACCUMULATION_NOTE =
  "Sürekli infüzyonda asıl risk tek dozun tepe düzeyi değil, 24–48 saatte oluşan birikimdir. Karaciğer yetmezliğinde klirens, böbrek yetmezliğinde ise toksik metabolitin atılımı bozulur ve sınır düşer; kalp yetmezliği hepatik kan akımını azaltarak aynı sonucu doğurur. Uygulama bu düzeltmeleri yapmaz — bu hastalarda sınıra yaklaşmayın ve günlük değerlendirin.";

export interface InfusionLoad {
  mgPerHour: number;
  mgPer24h: number;
  /** Hasta ağırlığı biliniyorsa mg/kg/sa. */
  mgPerKgPerHour?: number;
  limit?: AdultInfusionLimit;
  /** Sınırın ne kadarı kullanılıyor (0–1+); ağırlık ve sınır varsa. */
  fraction?: number;
}

/**
 * Bir infüzyon hızının yükü.
 *
 * mL/sa klinikte ayarlanan sayıdır ama toksisiteyi belirleyen mg'dır; ikisinin
 * arasındaki çevrimi ekranda yapmak, konsantrasyonu yükseltmenin ne anlama
 * geldiğini görünür kılar.
 */
export function infusionLoad(
  mlPerHour: number,
  concentrationPercent: number,
  drug: string,
  weightKg?: number
): InfusionLoad {
  const mgPerHour = mlPerHour * concentrationPercent * 10;
  const limit = adultInfusionLimit(drug);
  const mgPerKgPerHour = weightKg && weightKg > 0 ? mgPerHour / weightKg : undefined;
  return {
    mgPerHour,
    mgPer24h: mgPerHour * 24,
    mgPerKgPerHour,
    limit,
    fraction:
      mgPerKgPerHour !== undefined && limit ? mgPerKgPerHour / limit.mgPerKgPerHour : undefined,
  };
}

/** Pediatrik hastada erişkin sınırı geçerli değildir; ekran bunu söyler. */
export const PEDIATRIC_INFUSION_REDIRECT =
  "Bu sınırlar erişkin içindir. Çocukta infüzyon hızları kılavuzlarda yaşa göre ayrı verilir ve belirgin daha düşüktür — Pediatrik Doz ekranındaki infüzyon tablosunu kullanın.";

// ---------------------------------------------------------------------------
// Yeniden doz / çözülme
// ---------------------------------------------------------------------------

export interface WearOffPlan {
  drug: string;
  onsetMin: [number, number];
  durationHours: [number, number];
  /** Sistemik analjeziye başlanması gereken saat aralığı. */
  prepareAtHours: [number, number];
}

/**
 * Blok ne zaman çözülür ve ondan önce ne yapılır.
 *
 * "Hazırlan" saati, sürenin alt ucundan bir saat önce alınır. Sebebi
 * farmakolojik değil, örgütsel: oral analjezik istemi, ilacın servise
 * ulaşması ve etkisinin başlaması birlikte bir saati bulur. Bloğun çözüldüğü
 * anda başlanan analjezi geç kalmıştır — hastanın ağrıyla uyanması, kateteri
 * olmayan tek atım blokta en sık görülen kusurdur.
 *
 * Süreler tek atım, adjuvansız ve sağlıklı erişkin varsayımıyladır. Deksametazon
 * ya da perinöral deksmedetomidin eklendiyse süre uzar; ekran bunu hatırlatır
 * ama sayıyı değiştirmez, çünkü uzamanın miktarı bloktan bloğa değişir.
 */
export const PREPARE_LEAD_HOURS = 1;

export function wearOffPlan(drug: string): WearOffPlan | undefined {
  const la = LOCAL_ANESTHETICS.find((l) =>
    drug.toLowerCase().startsWith(l.drug.toLowerCase())
  );
  if (!la) return undefined;
  const [lo, hi] = la.durationHours;
  return {
    drug: la.label,
    onsetMin: la.onsetMin,
    durationHours: la.durationHours,
    prepareAtHours: [Math.max(0, lo - PREPARE_LEAD_HOURS), hi],
  };
}

export const ADJUVANT_PROLONGS_NOTE =
  "Deksametazon (perinöral veya IV) ve perinöral deksmedetomidin blok süresini belirgin uzatır; bu çizelge adjuvansız tek atım içindir.";

/**
 * Kateteri olmayan blokta "yeniden doz" çoğu zaman yoktur.
 *
 * Tek atım bir bloğu aynı iğneyle yenilemek, ilk bloğun ne kadarının
 * çözüldüğünü bilmeden ikinci bir tam doz vermek demektir; toplam doz tavana
 * eklenir ve ilk enjeksiyonun ödemi/anatomiyi bozması ikinci girişimi
 * zorlaştırır. Uygulamanın verdiği cevap bu yüzden "tekrarla" değil.
 */
export const NO_CATHETER_NOTE =
  "Bu blok için kateter rejimi tanımlı değil. Tek atım blok çözüldüğünde aynı bloğu yenilemek genellikle seçenek değildir: verilen ikinci doz ilk dozun üstüne toplam tavana eklenir ve ilk enjeksiyonun yarattığı ödem ikinci girişimi zorlaştırır. Süre dolmadan sistemik analjeziye geçin; kateter gerekiyorsa baştan planlanmalıdır.";

/** Bir tekniğin tipik ilacından çıkarılan çözülme planı. */
export function wearOffFor(technique: Technique): WearOffPlan | undefined {
  return wearOffPlan(technique.typical.drug);
}

/** Yaş bandı erişkin sınırlarının geçerli olduğu bant mı. */
export function adultLimitsApply(band: AgeBand): boolean {
  return !band.pediatric;
}
