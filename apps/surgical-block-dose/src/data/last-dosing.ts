/**
 * LAST'ta lipid emülsiyonu dozları.
 *
 * LAST ekranı "lipid emülsiyonu getirtin" diyordu ama kaç mL demiyordu.
 * Panik anında aranan tek şey odur ve hesabı kilo başına yapılır; uygulamanın
 * hasta çubuğu zaten kiloyu tutuyor.
 *
 * ASRA kontrol listesi 70 kg'ı eşik alır: altında her şey mL/kg, üstünde sabit
 * hacimler verilir. Sabit hacimlerin sebebi pratiktir — 100 mL bir şişedir ve
 * krizde bölünmüş hesap yapılmaz. Uygulama ikisini de aynı biçimde gösterir ve
 * hangi kuralın işlediğini söyler.
 *
 * Ağırlık, *yağsız* vücut ağırlığı üzerinden hesaplanmalıdır. Hasta çubuğuna
 * boy girildiyse ekran yağsız ağırlığı kendisi hesaplar ve dozları onunla
 * verir — bu, kullanıcının seçtiği doz dayanağından bağımsızdır, çünkü burada
 * hangi ağırlığın kullanılacağı tercih değil kılavuzun şartıdır. Boy yoksa
 * girilen gerçek ağırlık kullanılır ve obez hastada hacmin olduğundan yüksek
 * çıktığı açıkça yazılır.
 */

export const LAST_SOURCE =
  "ASRA Local Anesthetic Systemic Toxicity Checklist (2020) — özetlenmiştir.";

/** 70 kg ve üstünde kontrol listesi sabit hacimlere geçer. */
export const FIXED_DOSE_THRESHOLD_KG = 70;

/** İlk 30 dakikada aşılmaması gereken toplam. */
export const MAX_ML_PER_KG = 12;

export interface LipidStep {
  label: string;
  /** Hesaplanmış hacim/hız metni. */
  value: string;
  detail: string;
}

export interface LipidPlan {
  /** Sabit hacim kuralı mı, mL/kg kuralı mı işledi. */
  rule: "fixed" | "perKg";
  steps: LipidStep[];
  /** İlk yarım saatte aşılmaması gereken toplam hacim. */
  ceilingMl: number;
}

const ml = (value: number) => `${Math.round(value)} mL`;

/**
 * 20'lik (%20) lipid emülsiyonu planı.
 *
 * Basamaklar kontrol listesinin sırasıyla verilir: bolus → infüzyon → yanıt
 * yoksa tekrar. "Yanıt yoksa" basamağını ayrı tutmak önemli, çünkü krizde
 * ikinci bolusun serbest olduğu değil, *koşullu* olduğu unutulur.
 *
 * İki ağırlık ayrı ayrı alınıyor ve bu bir ayrıntı değil:
 *
 * - `dosingKg` mL/kg aritmetiğinin ağırlığıdır ve yağsız ağırlık olmalıdır.
 * - `thresholdKg` 70 kg eşiğinin okunduğu ağırlıktır ve hastanın gerçek
 *   kilosudur.
 *
 * İkisini birleştirmek 120 kilo bir hastayı "70 kg altı" koluna düşürüyordu:
 * yağsız ağırlığı 57 kg çıkıyor ve ekran sabit hacim yerine mL/kg hesabı
 * gösteriyordu. Kontrol listesi eşiği başucunda hastaya bakarak okunur; yağsız
 * ağırlık oradaki soruyu yanıtlamaz, yalnızca çarpımın ağırlığıdır.
 */
export function lipidPlan(dosingKg: number, thresholdKg: number = dosingKg): LipidPlan {
  const weightKg = dosingKg;
  const fixed = thresholdKg >= FIXED_DOSE_THRESHOLD_KG;
  const ceilingMl = MAX_ML_PER_KG * weightKg;

  if (fixed) {
    return {
      rule: "fixed",
      ceilingMl,
      steps: [
        {
          label: "Bolus",
          value: "100 mL",
          detail: "%20 lipid emülsiyonu, 2–3 dakikada hızlı puşe.",
        },
        {
          label: "İnfüzyon",
          value: "200–250 mL / 15–20 dk",
          detail: "Bolusun hemen ardından başlanır ve dolaşım düzelene kadar sürdürülür.",
        },
        {
          label: "Yanıt yoksa",
          value: "100 mL bolus tekrarı",
          detail:
            "Dolaşım kararsızlığı sürüyorsa bolus bir–iki kez tekrarlanabilir ve infüzyon hızı iki katına çıkarılabilir.",
        },
      ],
    };
  }

  return {
    rule: "perKg",
    ceilingMl,
    steps: [
      {
        label: "Bolus",
        value: ml(1.5 * weightKg),
        detail: "1,5 mL/kg %20 lipid emülsiyonu, 2–3 dakikada.",
      },
      {
        label: "İnfüzyon",
        value: `${(0.25 * weightKg).toFixed(1)} mL/dk (≈ ${ml(15 * weightKg)}/sa)`,
        detail: "0,25 mL/kg/dk; dolaşım düzelene kadar sürdürülür.",
      },
      {
        label: "Yanıt yoksa",
        value: `${ml(1.5 * weightKg)} bolus · ${(0.5 * weightKg).toFixed(1)} mL/dk`,
        detail:
          "Bolus bir–iki kez tekrarlanabilir; infüzyon hızı 0,5 mL/kg/dk'ya çıkarılır.",
      },
    ],
  };
}

/** Kilo girilmeden de okunması gereken kurallar. */
export const LIPID_RULES: string[] = [
  "Toplam hacim ilk 30 dakikada yaklaşık 12 mL/kg'ı aşmamalıdır.",
  "Doz yağsız vücut ağırlığına göre hesaplanır. Hasta çubuğuna boy girildiyse bu ekran yağsız ağırlığı kendisi hesaplar; boy yoksa girilen gerçek ağırlık kullanılır ve obez hastada hacim olduğundan yüksek çıkar.",
  "Propofol lipid emülsiyonunun yerini tutmaz: içindeki lipid miktarı tedavi edici değildir ve kardiyovasküler depresyonu derinleştirir.",
  "Lipid, resüsitasyonun yerine değil yanında verilir; hava yolu, oksijenizasyon ve göğüs kompresyonu önceliklidir.",
];

/** LAST'a özgü resüsitasyon farkları — standart ACLS'ten ayrıldığı yerler. */
export interface ResuscitationNote {
  title: string;
  detail: string;
  /** Kaçınılması gereken bir şeyse kırmızı gösterilir. */
  avoid?: boolean;
  /** Kilo girildiyse metnin yerine bu geçer. */
  weightAware?: (weightKg: number) => string;
}

export const RESUSCITATION_NOTES: ResuscitationNote[] = [
  {
    title: "Adrenalin dozu küçültülür",
    detail:
      "LAST kaynaklı arrestte 1 µg/kg ve altı bolus önerilir (70 kg için ≈ 70 µg); standart 1 mg dozları lipid ile toparlanmayı zorlaştırır.",
    weightAware: (weightKg) =>
      `LAST kaynaklı arrestte 1 µg/kg ve altı bolus önerilir — bu hastada ≤ ${Math.round(weightKg)} µg. Standart 1 mg dozları lipid ile toparlanmayı zorlaştırır.`,
  },
  {
    title: "Vazopressin verilmez",
    detail: "Hayvan çalışmalarında sonuçları kötüleştirdiği için önerilmez.",
    avoid: true,
  },
  {
    title: "Kalsiyum kanal blokeri ve beta bloker verilmez",
    detail: "Zaten baskılanmış miyokardı daha da baskılar.",
    avoid: true,
  },
  {
    title: "Ek lokal anestezik verilmez",
    detail: "Aritmi için lidokain dahil hiçbir lokal anestezik kullanılmaz.",
    avoid: true,
  },
  {
    title: "Uzun resüsitasyon",
    detail:
      "Toparlanma bir saati bulabilir; kardiyopulmoner baypas/ECMO ulaşılabilirse erken haber verilir.",
  },
  {
    title: "İzlem sürer",
    detail:
      "Kardiyovasküler olayda en az 4–6 saat, sınırlı SSS bulgusunda en az 2 saat monitörize izlem.",
  },
];
