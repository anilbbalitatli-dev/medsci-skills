/**
 * Summarized from the ASRA (American Society of Regional Anesthesia and Pain
 * Medicine) Local Anesthetic Systemic Toxicity (LAST) checklist. This is a
 * quick-reference summary, not the full protocol — follow your institution's
 * emergency protocol and the complete ASRA checklist during a real event.
 */
export const LAST_EARLY_SYMPTOMS = [
  "Ağız çevresinde uyuşma / karıncalanma",
  "Ağızda metalik tat",
  "Kulak çınlaması (tinnitus)",
  "Ajitasyon, konfüzyon, huzursuzluk",
  "Baş dönmesi, görme/işitme bozukluğu",
];

export const LAST_LATE_SYMPTOMS = [
  "Nöbet (konvülsiyon)",
  "Bilinç kaybı, SSS depresyonu",
  "Kardiyak aritmiler, ileti bloğu, bradikardi",
  "Kardiyovasküler kollaps / asistoli",
  "Not: bazı olgularda önce nörolojik belirti olmadan doğrudan kardiyovasküler kollaps görülebilir.",
];

export interface LastStep {
  title: string;
  detail: string;
}

export const LAST_MANAGEMENT: LastStep[] = [
  {
    title: "1. Enjeksiyonu durdur, yardım çağır",
    detail:
      "Lokal anestezik uygulamasını hemen durdurun. Yardım isteyin ve mümkünse lipid emülsiyonunu getirtin.",
  },
  {
    title: "2. Havayolu ve oksijenizasyon",
    detail:
      "%100 oksijen verin, havayolunu güvence altına alın. Hafif hiperventilasyon; hipoksi ve asidozdan kaçının (LAST'ı ağırlaştırır).",
  },
  {
    title: "3. Nöbet kontrolü",
    detail:
      "Tercihen benzodiazepin kullanın. Hemodinamik olarak stabil değilse yüksek doz propofoldan kaçının. Gerekmedikçe süksinilkolin kullanmayın.",
  },
  {
    title: "4. Lipid emülsiyon (%20) tedavisi",
    detail:
      "1.5 mL/kg (yağsız vücut ağırlığı) IV bolus, 1 dakikada; ardından 0.25 mL/kg/dk infüzyon. Kardiyovasküler kollaps devam ederse bolusu 1-2 kez tekrarlayın; hipotansiyon sürerse infüzyonu 0.5 mL/kg/dk'ya çıkarın. İlk 30 dakikada ~12 mL/kg üst sınırını göz önünde bulundurun.",
  },
  {
    title: "5. Kardiyak arrestte ACLS'de değişiklikler",
    detail:
      "Standart ACLS uygulayın ancak: epinefrin dozlarını küçük tutun (≤1 mcg/kg aralığında), vazopressinden kaçının, kalsiyum kanal blokerleri/beta blokerlerden kaçının, antiaritmik olarak lokal anestezik (ör. lidokain) kullanmayın.",
  },
  {
    title: "6. Uzamış resüsitasyona hazırlıklı olun",
    detail:
      "Ventriküler aritmi gelişirse resüsitasyon 1 saatten uzun sürebilir; mümkünse erken kardiyopulmoner bypass seçeneğini değerlendirin.",
  },
  {
    title: "7. Olay sonrası izlem",
    detail:
      "Kardiyovasküler olay sonrası en az 12 saat, yalnızca nöbet sonrası en az 2 saat monitörize edin (geç nüks riski). Olguyu kurumunuzun/ASRA'nın bildirim sistemine kaydedin.",
  },
];

export const LAST_SOURCE_NOTE =
  "Kaynak: ASRA Local Anesthetic Systemic Toxicity (LAST) Checklist — özetlenmiştir. Gerçek bir olayda kurumunuzun tam acil protokolünü ve ASRA'nın güncel tam kontrol listesini izleyin.";
