import { Surgery } from "./types";

/**
 * Reference dataset only. Block choice and doses are commonly cited teaching
 * ranges (NYSORA-style regional anesthesia references, BJA Education, Miller's
 * Anesthesia) for common presentations of each procedure — not a prescription.
 * Real cases vary by surgical approach, patient factors, coagulation status,
 * and institutional protocol; always confirm independently before clinical use.
 */
export const SURGERIES: Surgery[] = [
  {
    id: "tka",
    name: "Total Diz Protezi (TKA)",
    category: "Ortopedi — Alt Ekstremite",
    aliases: ["diz protezi", "diz artroplastisi", "knee replacement"],
    clinicalNote:
      "Motor güç kaybını sınırlamak için kuadriseps-koruyucu yaklaşım (adduktor kanal ± IPACK) günümüzde femoral bloğa göre daha sık tercih edilir.",
    blocks: [
      {
        id: "tka-acb",
        name: "Adduktor Kanal Bloğu (ACB)",
        role: "primary",
        summary: "Kuadriseps kuvvetini büyük ölçüde koruyan, erken mobilizasyona uygun ana analjezi yöntemi.",
        anesthetics: [
          { drug: "Ropivakain %0.2", concentrationPercent: 0.2, volumeMlRange: [15, 20] },
          { drug: "Bupivakain %0.25", concentrationPercent: 0.25, volumeMlRange: [15, 20] },
        ],
      },
      {
        id: "tka-ipack",
        name: "IPACK Bloğu (posterior diz kapsülü)",
        role: "adjunct",
        summary: "Posterior diz ağrısını hedefler; ACB'ye eklenerek analjeziyi tamamlar.",
        anesthetics: [{ drug: "Ropivakain %0.2", concentrationPercent: 0.2, volumeMlRange: [10, 15] }],
      },
      {
        id: "tka-femoral",
        name: "Femoral Sinir Bloğu",
        role: "alternative",
        summary: "Daha güçlü analjezi sağlar ancak kuadriseps güçsüzlüğü ve düşme riski nedeniyle ACB'ye göre ikinci planda.",
        anesthetics: [{ drug: "Ropivakain %0.5", concentrationPercent: 0.5, volumeMlRange: [15, 20] }],
      },
      {
        id: "tka-spinal",
        name: "Spinal Anestezi",
        role: "alternative",
        summary: "Nörovasküler blokla birlikte veya tek başına anestezi yöntemi olarak.",
        anesthetics: [{ drug: "Bupivakain %0.5 (hiperbarik)", concentrationPercent: 0.5, volumeMlRange: [2.5, 3.5], note: "≈12.5–17.5 mg intratekal" }],
      },
    ],
  },
  {
    id: "tha",
    name: "Total Kalça Protezi (THA)",
    category: "Ortopedi — Alt Ekstremite",
    aliases: ["kalça protezi", "kalça artroplastisi", "hip replacement"],
    blocks: [
      {
        id: "tha-spinal",
        name: "Spinal Anestezi",
        role: "primary",
        summary: "Kalça cerrahisinde sıklıkla tercih edilen ana anestezi yöntemi.",
        anesthetics: [{ drug: "Bupivakain %0.5 (hiperbarik)", concentrationPercent: 0.5, volumeMlRange: [2.5, 3.5], note: "≈12.5–17.5 mg intratekal" }],
      },
      {
        id: "tha-peng",
        name: "PENG Bloğu (Pericapsular Nerve Group)",
        role: "adjunct",
        summary: "Motor tutulumu minimal düzeyde tutarak kalça eklem kapsülü ağrısını hedefler.",
        anesthetics: [{ drug: "Ropivakain %0.2", concentrationPercent: 0.2, volumeMlRange: [20, 25] }],
      },
      {
        id: "tha-fascia-iliaca",
        name: "Fasya İliaka Bloğu",
        role: "alternative",
        summary: "PENG'e alternatif, femoral ve lateral femoral kutanöz sinirleri de kapsayan geniş saha bloğu.",
        anesthetics: [{ drug: "Ropivakain %0.2", concentrationPercent: 0.2, volumeMlRange: [30, 40] }],
      },
    ],
  },
  {
    id: "acl",
    name: "ACL Rekonstrüksiyonu (Artroskopik Diz Ligaman Onarımı)",
    category: "Ortopedi — Alt Ekstremite",
    aliases: ["çapraz bağ ameliyatı", "diz artroskopisi"],
    blocks: [
      {
        id: "acl-acb",
        name: "Adduktor Kanal Bloğu (ACB)",
        role: "primary",
        summary: "Ayaktan/günübirlik cerrahide erken yürümeyi engellemeyen tercih edilen blok.",
        anesthetics: [{ drug: "Ropivakain %0.2", concentrationPercent: 0.2, volumeMlRange: [15, 20] }],
      },
      {
        id: "acl-femoral",
        name: "Femoral Sinir Bloğu",
        role: "alternative",
        summary: "Daha yaygın motor blok riski taşır; günübirlik cerrahide daha az tercih edilir.",
        anesthetics: [{ drug: "Ropivakain %0.5", concentrationPercent: 0.5, volumeMlRange: [15, 20] }],
      },
    ],
  },
  {
    id: "ankle-foot",
    name: "Ayak / Ayak Bileği Cerrahisi",
    category: "Ortopedi — Alt Ekstremite",
    aliases: ["ayak cerrahisi", "ayak bileği cerrahisi", "hallux valgus"],
    blocks: [
      {
        id: "ankle-popliteal",
        name: "Popliteal Siyatik Sinir Bloğu",
        role: "primary",
        summary: "Ayak bileği turnikesine ve cerrahisine yeterli anestezi/analjezi sağlar.",
        anesthetics: [{ drug: "Ropivakain %0.5", concentrationPercent: 0.5, volumeMlRange: [15, 20] }],
      },
      {
        id: "ankle-saphenous",
        name: "Safen Sinir Bloğu",
        role: "adjunct",
        summary: "Medial ayak bileği/ayak bölgesi için popliteal bloğa eklenir.",
        anesthetics: [{ drug: "Ropivakain %0.5", concentrationPercent: 0.5, volumeMlRange: [5, 10] }],
      },
      {
        id: "ankle-ankle-block",
        name: "Ayak Bileği Bloğu (5 sinir)",
        role: "alternative",
        summary: "Kısa süreli ön/orta ayak cerrahisinde tek başına yeterli olabilir.",
        anesthetics: [{ drug: "Lidokain %1–2", concentrationPercent: 1, volumeMlRange: [12, 18], note: "5 sinire paylaştırılır" }],
      },
    ],
  },
  {
    id: "shoulder-arthroscopy",
    name: "Omuz Artroskopisi / Rotator Manşet Onarımı",
    category: "Ortopedi — Üst Ekstremite",
    aliases: ["omuz ameliyatı", "rotator manşet", "shoulder surgery"],
    clinicalNote: "Frenik sinir bloğu riski nedeniyle solunum rezervi kısıtlı hastalarda düşük volüm veya alternatif bloklar (supraskapular + aksiller) düşünülmelidir.",
    blocks: [
      {
        id: "shoulder-interscalene",
        name: "İnterskalen Brakiyal Pleksus Bloğu",
        role: "primary",
        summary: "Omuz cerrahisi için altın standart rejyonel teknik.",
        anesthetics: [
          { drug: "Ropivakain %0.5", concentrationPercent: 0.5, volumeMlRange: [15, 20] },
          { drug: "Bupivakain %0.5", concentrationPercent: 0.5, volumeMlRange: [15, 20] },
        ],
      },
      {
        id: "shoulder-suprascapular-axillary",
        name: "Suprascapular + Aksiller Sinir Bloğu",
        role: "alternative",
        summary: "Frenik sinir tutulumunu azaltmayı hedefleyen, solunum fonksiyonu kısıtlı hastalarda tercih edilebilecek kombinasyon.",
        anesthetics: [{ drug: "Ropivakain %0.5", concentrationPercent: 0.5, volumeMlRange: [10, 15] }],
      },
    ],
  },
  {
    id: "hand-forearm",
    name: "El / Önkol Cerrahisi",
    category: "Ortopedi — Üst Ekstremite",
    aliases: ["el cerrahisi", "önkol cerrahisi", "karpal tünel"],
    blocks: [
      {
        id: "hand-supraclavicular",
        name: "Supraklaviküler Brakiyal Pleksus Bloğu",
        role: "primary",
        summary: "\"Brakiyal pleksusun spinali\" — dirsek altı cerrahide hızlı ve güvenilir blok.",
        anesthetics: [{ drug: "Ropivakain %0.5", concentrationPercent: 0.5, volumeMlRange: [20, 30] }],
      },
      {
        id: "hand-infraclavicular",
        name: "İnfraklaviküler Brakiyal Pleksus Bloğu",
        role: "alternative",
        summary: "Kateter yerleştirmeye daha uygun anatomik pozisyon.",
        anesthetics: [{ drug: "Ropivakain %0.5", concentrationPercent: 0.5, volumeMlRange: [20, 30] }],
      },
      {
        id: "hand-ivra",
        name: "Bier Bloğu (İntravenöz Rejyonel Anestezi)",
        role: "alternative",
        summary: "Kısa süreli (<60 dk), turnikeli distal el/önkol cerrahisi için hızlı alternatif.",
        anesthetics: [{ drug: "Lidokain %0.5 (epinefrinsiz)", concentrationPercent: 0.5, volumeMlRange: [40, 50], note: "≈3 mg/kg, epinefrin içermemeli" }],
      },
    ],
  },
  {
    id: "cesarean",
    name: "Sezaryen (C/S)",
    category: "Obstetrik",
    aliases: ["sezaryen", "c-section", "cesarean section"],
    clinicalNote: "Acil/kombine spinal-epidural gibi durumlarda teknik seçimi klinik senaryoya göre değişir; bu yalnızca elektif/rutin spinal için tipik bir referanstır.",
    blocks: [
      {
        id: "cs-spinal",
        name: "Spinal Anestezi",
        role: "primary",
        summary: "Elektif sezaryende standart teknik; genellikle intratekal opioid ile kombine edilir.",
        anesthetics: [
          { drug: "Bupivakain %0.5 (hiperbarik)", concentrationPercent: 0.5, volumeMlRange: [1.6, 2.2], note: "≈8–11 mg intratekal" },
        ],
      },
      {
        id: "cs-tap",
        name: "TAP Bloğu",
        role: "adjunct",
        summary: "İntratekal opioid verilemediğinde veya ek postoperatif analjezi için.",
        anesthetics: [{ drug: "Ropivakain %0.375", concentrationPercent: 0.375, volumeMlRange: [15, 20], note: "her iki tarafa" }],
      },
    ],
  },
  {
    id: "appendectomy",
    name: "Açık / Laparoskopik Apendektomi",
    category: "Genel Cerrahi",
    aliases: ["apendektomi", "appendectomy"],
    blocks: [
      {
        id: "app-tap",
        name: "TAP Bloğu (Transversus Abdominis Plane)",
        role: "primary",
        summary: "Genel anesteziye ek olarak karın duvarı ağrısını hedefleyen postoperatif analjezi bloğu.",
        anesthetics: [{ drug: "Ropivakain %0.25–0.375", concentrationPercent: 0.25, volumeMlRange: [15, 20], note: "her iki tarafa" }],
      },
      {
        id: "app-rectus-sheath",
        name: "Rektus Kılıf Bloğu",
        role: "alternative",
        summary: "Orta hat/periumbilikal port yerlerinde ek analjezi için.",
        anesthetics: [{ drug: "Ropivakain %0.25", concentrationPercent: 0.25, volumeMlRange: [10, 15] }],
      },
    ],
  },
  {
    id: "inguinal-hernia",
    name: "İnguinal Herni Onarımı",
    category: "Genel Cerrahi",
    aliases: ["kasık fıtığı", "inguinal herni", "hernia repair"],
    blocks: [
      {
        id: "hernia-ilioinguinal",
        name: "İlioinguinal–İliohipogastrik Sinir Bloğu",
        role: "primary",
        summary: "Kasık bölgesi cerrahisi için hedefe yönelik saha bloğu; cerrah tarafından intraoperatif de uygulanabilir.",
        anesthetics: [{ drug: "Ropivakain %0.25", concentrationPercent: 0.25, volumeMlRange: [10, 15] }],
      },
      {
        id: "hernia-tap",
        name: "TAP Bloğu",
        role: "alternative",
        summary: "İlioinguinal bloğa alternatif veya ek olarak.",
        anesthetics: [{ drug: "Ropivakain %0.25–0.375", concentrationPercent: 0.25, volumeMlRange: [15, 20] }],
      },
    ],
  },
];

export function searchSurgeries(query: string): Surgery[] {
  const q = query.trim().toLocaleLowerCase("tr");
  if (!q) return SURGERIES;
  return SURGERIES.filter((s) => {
    const haystack = [s.name, s.category, ...s.aliases].join(" ").toLocaleLowerCase("tr");
    return haystack.includes(q);
  });
}
