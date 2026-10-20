/**
 * Adjuvan dozları.
 *
 * Karışım hesaplayıcı hangi adjuvandan kaç mg/µg girdiğini zaten söylüyordu
 * ama **ne kadar verilmesi gerektiğini** söylemiyordu; sayı tek başına
 * "doğru mu" sorusunu yanıtlamaz. Burada her adjuvanın yola göre olağan
 * aralığı, bloğa ne kattığı ve dikkat edilecek yanı duruyor.
 *
 * Aralıklar yola göre ayrılmıştır, çünkü aynı ilacın perinöral ve intratekal
 * dozu arasında on kat fark olabilir: 100 µg morfin intratekal olağan bir doz,
 * perinöral ise anlamsızdır. Bu yüzden karışım hesaplayıcıda önce yol seçilir.
 *
 * Değerler genel öğretim kaynaklarındaki olağan aralıklardır; tek bir kılavuzun
 * tablosu değildir ve kurumdan kuruma değişir. Endikasyon dışı olanlar ayrıca
 * işaretlenmiştir.
 */

export type AdjuvantRoute = "perineural" | "epidural" | "intrathecal";

export const ADJUVANT_ROUTES: { id: AdjuvantRoute; label: string; note: string }[] = [
  {
    id: "perineural",
    label: "Perinöral",
    note: "Periferik sinir ve fasya planı blokları.",
  },
  { id: "epidural", label: "Epidural", note: "Bolus dozları; infüzyonda konsantrasyon ayrı hesaplanır." },
  { id: "intrathecal", label: "İntratekal", note: "Spinal anestezide tek doz." },
];

export interface AdjuvantDose {
  /** STOCK_SOLUTIONS içindeki karşılığı. */
  stockId: string;
  route: AdjuvantRoute;
  unit: "mg" | "µg";
  /** Sabit aralık. */
  min?: number;
  max?: number;
  /** Ağırlığa bağlı aralık (birim/kg); varsa sabit aralığın yerine geçer. */
  perKgMin?: number;
  perKgMax?: number;
  /** Ağırlığa bağlı dozun aşılmaması gereken üst sınırı. */
  absoluteMax?: number;
  /** Bloğa ne katıyor. */
  effect: string;
  caution?: string;
  /** Endikasyon dışı ya da kanıtı sınırlı kullanım. */
  offLabel?: boolean;
}

export const ADJUVANT_DOSES: AdjuvantDose[] = [
  // ---- Perinöral ----
  {
    stockId: "dexa",
    route: "perineural",
    unit: "mg",
    min: 4,
    max: 8,
    effect:
      "Uzun etkili lokal anestezikle blok süresini yaklaşık 6–8 saat uzatır; en tutarlı etkiyi gösteren adjuvandır.",
    caution:
      "Koruyucusuz preparat tercih edilir. Aynı dozun damar yolundan verilmesi benzer uzama sağlar — perinöral vermek zorunlu değildir.",
  },
  {
    stockId: "dexmed",
    route: "perineural",
    unit: "µg",
    perKgMin: 0.5,
    perKgMax: 1,
    absoluteMax: 100,
    effect: "Blok süresini yaklaşık 4–6 saat uzatır, başlangıcı da bir miktar hızlandırır.",
    caution: "Bradikardi, hipotansiyon ve sedasyon yapar; ayaktan hastada ve yaşlıda dikkat.",
  },
  {
    stockId: "clonidine",
    route: "perineural",
    unit: "µg",
    perKgMin: 0.5,
    perKgMax: 1,
    absoluteMax: 150,
    effect: "Süreyi yaklaşık 2 saat uzatır.",
    caution: "150 µg üzerinde hipotansiyon, bradikardi ve sedasyon belirginleşir; ek fayda getirmez.",
  },
  {
    stockId: "adrenaline",
    route: "perineural",
    unit: "µg",
    min: 50,
    max: 100,
    effect:
      "20 mL karışımda 1:400.000–1:200.000 (2,5–5 µg/mL): damar içi enjeksiyonun erken göstergesi olur ve plazma tepesini düşürür.",
    caution:
      "Uç arter dolaşımının sınırlı olduğu yerlerde (parmak, penis) ve dolaşımı bozuk ekstremitede kullanılmaz.",
  },
  {
    stockId: "fentanyl",
    route: "perineural",
    unit: "µg",
    effect:
      "Perinöral opioidin blok süresine katkısı gösterilememiştir; etkisi sistemik emilimle açıklanır.",
    caution: "Karışıma eklemek yerine gerekiyorsa sistemik verilmesi daha öngörülebilirdir.",
    offLabel: true,
  },

  // ---- Epidural ----
  {
    stockId: "fentanyl",
    route: "epidural",
    unit: "µg",
    min: 50,
    max: 100,
    effect: "Bolusun başlangıcını hızlandırır ve kalitesini artırır; infüzyonda 2 µg/mL yaygındır.",
    caution: "Kaşıntı, bulantı; yüksek dozda solunum depresyonu.",
  },
  {
    stockId: "morphine",
    route: "epidural",
    unit: "mg",
    min: 2,
    max: 4,
    effect: "12–24 saat süren analjezi sağlar.",
    caution:
      "Geç solunum depresyonu riski nedeniyle 12–24 saat izlem gerekir; uyku apnesi olan hastada doz azaltılır.",
  },
  {
    stockId: "clonidine",
    route: "epidural",
    unit: "µg",
    min: 75,
    max: 150,
    effect: "Analjeziyi uzatır, opioid gereksinimini azaltır.",
    caution: "Hipotansiyon ve bradikardi; sedasyon.",
  },
  {
    stockId: "adrenaline",
    route: "epidural",
    unit: "µg",
    min: 15,
    max: 100,
    effect:
      "Test dozunda damar içi yerleşimi gösterir (15 µg); karışımda 1:200.000 emilimi yavaşlatır.",
    caution: "Uteroplasental dolaşımı etkileyebileceği için obstetrik kullanımı tartışmalıdır.",
  },

  // ---- İntratekal ----
  {
    stockId: "fentanyl",
    route: "intrathecal",
    unit: "µg",
    min: 10,
    max: 25,
    effect: "Bloğun kalitesini artırır, viseral ağrıyı azaltır; etkisi 2–4 saat sürer.",
    caution: "Kaşıntı sıktır. Erken solunum depresyonu seyrektir ama olabilir.",
  },
  {
    // Stok 10 mg/mL olduğu için hesap mg üzerinden döner; aralık da mg
    // cinsinden yazılmalı, yoksa 0,1 mg'lık doğru bir doz "aralığın altında"
    // görünür. Denetim bu tutarsızlığı yakalar.
    stockId: "morphine",
    route: "intrathecal",
    unit: "mg",
    min: 0.1,
    max: 0.2,
    effect: "0,1–0,2 mg (100–200 µg): 18–24 saat analjezi; sezaryen ve büyük ortopedik cerrahide yaygındır.",
    caution:
      "Geç solunum depresyonu 24 saate kadar görülebilir; izlem ve naloksona hazır olmak gerekir. 200 µg üzeri ek fayda getirmeden yan etkiyi artırır.",
  },
  {
    stockId: "clonidine",
    route: "intrathecal",
    unit: "µg",
    min: 15,
    max: 75,
    effect: "Duyusal bloğu uzatır, titremeyi azaltır.",
    caution: "Hipotansiyon ve bradikardi doza bağlı artar.",
  },
  {
    stockId: "dexmed",
    route: "intrathecal",
    unit: "µg",
    min: 3,
    max: 10,
    effect: "Duyusal ve motor bloğu uzatır.",
    caution: "Nörotoksisite verisi sınırlıdır; koruyucusuz preparat ve düşük doz tercih edilir.",
    offLabel: true,
  },
];

export function adjuvantDose(stockId: string, route: AdjuvantRoute): AdjuvantDose | undefined {
  return ADJUVANT_DOSES.find((d) => d.stockId === stockId && d.route === route);
}

export type RangeVerdict = "below" | "inRange" | "above" | "unknown" | "noRange";

export interface RangeCheck {
  verdict: RangeVerdict;
  /** Aralığın bu hastadaki karşılığı, gösterilecek biçimde. */
  rangeLabel?: string;
}

/**
 * Verilen miktarın aralığa göre yeri.
 *
 * Ağırlığa bağlı aralıklarda kilo yoksa `unknown` döner — tahmini bir kilo
 * uydurup "aralıkta" demek, aralığı hiç göstermemekten daha kötüdür.
 */
export function checkRange(
  dose: AdjuvantDose | undefined,
  amount: number,
  weightKg?: number
): RangeCheck {
  if (!dose) return { verdict: "unknown" };

  if (dose.perKgMin !== undefined && dose.perKgMax !== undefined) {
    if (!weightKg) return { verdict: "unknown" };
    const min = dose.perKgMin * weightKg;
    const max = Math.min(dose.perKgMax * weightKg, dose.absoluteMax ?? Infinity);
    return {
      verdict: amount < min ? "below" : amount > max ? "above" : "inRange",
      rangeLabel: `${round(min)}–${round(max)} ${dose.unit}`,
    };
  }

  if (dose.min === undefined || dose.max === undefined) return { verdict: "noRange" };
  return {
    verdict: amount < dose.min ? "below" : amount > dose.max ? "above" : "inRange",
    rangeLabel: `${dose.min}–${dose.max} ${dose.unit}`,
  };
}

function round(value: number): number {
  return value >= 10 ? Math.round(value) : Math.round(value * 10) / 10;
}

export const ADJUVANT_SOURCE_NOTE =
  "Aralıklar genel öğretim kaynaklarındaki olağan değerlerdir; tek bir kılavuzun tablosu değildir. Kurum protokolünüz ve ilacın kısa ürün bilgisi esastır.";
