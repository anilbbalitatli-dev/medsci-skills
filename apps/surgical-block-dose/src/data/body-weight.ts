/**
 * Hangi ağırlıkla dozlanacağı.
 *
 * Uygulama şimdiye kadar girilen kiloyu doğrudan mg/kg ile çarpıyordu. Obez
 * hastada bu yanlıştır ve yanlışlığın yönü tehlikelidir: yağ dokusu hem kötü
 * perfüzedir hem de amid lokal anesteziklerin ilk dağılım hacmine neredeyse
 * hiç katkı vermez. 150 kiloluk bir hastada toplam ağırlıkla hesaplanan mg/kg
 * bütçesi, hastanın gerçekten tolere edebileceğinin çok üstünde bir sayı
 * verir.
 *
 * Bu dosya dört ağırlığı da hesaplar ve hangisinin kullanılacağını kullanıcıya
 * bırakır. Sessizce "doğrusunu" seçmek iki nedenle yapılmadı:
 *
 * 1. Hangi ağırlığın kullanılacağı ilaca ve amaca göre değişir — yağsız
 *    ağırlık lokal anestezik tavanı için, düzeltilmiş ağırlık hidrofilik
 *    ilaçlar için, ideal ağırlık tidal volüm için kullanılır. Uygulama
 *    yalnızca lokal anestezik hesaplar, ama ekranı gören kişi başka bir soruyu
 *    da sorabiliyor olmalı.
 * 2. Bir düzeltme ekranda görünmeden bütün dozları değiştirirse, kullanıcı
 *    yanlış sayıya bakarken doğru baktığını sanır. Bu yüzden varsayılan
 *    değişmedi (toplam ağırlık) ve seçim yapıldığında hasta çubuğu bunu her
 *    ekranda yazar.
 *
 * Formüller yetişkin formülleridir. Çocukta ne Devine ne Janmahasatian
 * geçerlidir; büyüme eğrisi olmadan pediatrik "ideal ağırlık" hesaplanamaz, o
 * yüzden pediatrik yaş bantlarında düzeltme hiç sunulmaz.
 */

export type WeightBasis = "total" | "lean" | "ideal" | "adjusted";

export interface WeightBasisInfo {
  id: WeightBasis;
  label: string;
  short: string;
  /** Bu ağırlık ne için kullanılır. */
  useFor: string;
}

export const WEIGHT_BASES: WeightBasisInfo[] = [
  {
    id: "total",
    label: "Toplam (gerçek) ağırlık",
    short: "toplam",
    useFor:
      "Obez olmayan hastada doğru olan budur; başka bir ağırlığa geçmek gereksiz yere doz düşürür.",
  },
  {
    id: "lean",
    label: "Yağsız vücut ağırlığı (LBW)",
    short: "yağsız",
    useFor:
      "Obez hastada lokal anestezik tavanı ve lipid emülsiyon dozu için önerilen ağırlık; amid lokal anesteziklerin dağılım hacmi yağ dokusuyla artmaz.",
  },
  {
    id: "adjusted",
    label: "Düzeltilmiş ağırlık (ABW)",
    short: "düzeltilmiş",
    useFor:
      "İdeal ağırlığa yağ kütlesinin %40'ı eklenir. Hidrofilik ilaçların obez hastada dozlanmasında kullanılır; lokal anestezik için yağsız ağırlıktan daha cömerttir.",
  },
  {
    id: "ideal",
    label: "İdeal vücut ağırlığı (IBW)",
    short: "ideal",
    useFor:
      "Boydan hesaplanır, gerçek kompozisyonu bilmez. Tidal volüm hesabının ağırlığıdır; lokal anestezik tavanı için en ihtiyatlı seçenektir.",
  },
];

export function basisInfo(id: WeightBasis): WeightBasisInfo {
  return WEIGHT_BASES.find((b) => b.id === id) ?? WEIGHT_BASES[0];
}

export type Sex = "female" | "male";

/**
 * Devine (1974). Metrik hâli inç başına 2.3 kg'dan çevrilir; yuvarlanmış
 * "0.9 kg/cm" katsayısı 190 cm'de yarım kiloluk fark yapar, o yüzden çevrim
 * doğrudan yazılıyor.
 */
const KG_PER_CM = 2.3 / 2.54;
const BASE_CM = 152.4; // 5 ft

export function idealBodyWeight(heightCm: number, sex: Sex): number {
  const base = sex === "male" ? 50 : 45.5;
  return base + KG_PER_CM * (heightCm - BASE_CM);
}

export function bmi(weightKg: number, heightCm: number): number {
  const m = heightCm / 100;
  return weightKg / (m * m);
}

/**
 * Janmahasatian (2005). Yağsız kütlenin bugün tercih edilen tahmini; eski
 * James denklemi aşırı obezitede yağsız kütleyi düşerek saçma sonuç verir.
 */
export function leanBodyWeight(weightKg: number, heightCm: number, sex: Sex): number {
  const b = bmi(weightKg, heightCm);
  return sex === "male"
    ? (9270 * weightKg) / (6680 + 216 * b)
    : (9270 * weightKg) / (8780 + 244 * b);
}

export function adjustedBodyWeight(weightKg: number, heightCm: number, sex: Sex): number {
  const ibw = idealBodyWeight(heightCm, sex);
  return ibw + 0.4 * (weightKg - ibw);
}

export interface WeightSet {
  total: number;
  ideal: number;
  lean: number;
  adjusted: number;
  bmi: number;
  /** Devine bu boyun altında türetilmemiştir; sonuç gösterilir ama işaretlenir. */
  belowFormulaRange: boolean;
}

/** Formüllerin anlamlı olduğu boy aralığı; dışında hesap yapılmaz. */
export const MIN_HEIGHT_CM = 120;
export const MAX_HEIGHT_CM = 230;

export function weightSet(weightKg: number, heightCm: number, sex: Sex): WeightSet {
  return {
    total: weightKg,
    ideal: idealBodyWeight(heightCm, sex),
    lean: leanBodyWeight(weightKg, heightCm, sex),
    adjusted: adjustedBodyWeight(weightKg, heightCm, sex),
    bmi: bmi(weightKg, heightCm),
    belowFormulaRange: heightCm < BASE_CM,
  };
}

/**
 * Seçilen dayanağın kilogram karşılığı.
 *
 * Toplam ağırlığı hiçbir zaman aşmaz. Kısa boylu, zayıf bir hastada Devine
 * ideal ağırlığı gerçek ağırlığın üstüne çıkarabilir; "düzeltme" adı altında
 * dozu yükseltmek bu özelliğin tam tersi olurdu.
 */
export function dosingWeight(set: WeightSet, basis: WeightBasis): number {
  if (basis === "total") return set.total;
  return Math.min(set.total, set[basis]);
}

/** WHO sınıflaması; öneri metni buna dayanır. */
export const OBESITY_THRESHOLD = 30;

/**
 * Uygulamanın önerisi — karar değil, hatırlatma.
 *
 * Yalnızca BMI 30'un üstündeyken çıkar. Altında toplam ağırlık zaten doğru
 * cevaptır ve düzeltme önermek gereksiz doz kısıtlaması demektir.
 */
export function basisSuggestion(set: WeightSet, basis: WeightBasis): string | undefined {
  if (set.bmi < OBESITY_THRESHOLD) {
    return basis === "total"
      ? undefined
      : `BMI ${set.bmi.toFixed(1)} — obezite sınırının altında. Bu hastada toplam ağırlık kullanmak doğrudur; ${basisInfo(basis).short} ağırlık dozu gereksiz yere düşürür.`;
  }
  if (basis === "total") {
    return `BMI ${set.bmi.toFixed(1)} — toplam ağırlıkla hesaplanan mg/kg bütçesi bu hastada gerçek tolerans sınırının üstündedir. Lokal anestezik tavanı için yağsız ağırlık (${set.lean.toFixed(0)} kg) önerilir.`;
  }
  return undefined;
}
