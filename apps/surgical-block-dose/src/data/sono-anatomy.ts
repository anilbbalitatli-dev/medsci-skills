/**
 * Schematic sonoanatomy diagrams — original line drawings, not ultrasound
 * captures.
 *
 * These are the labelled schematics that regional anesthesia references
 * conventionally print beside a real ultrasound image: they show which
 * structure is which and where the needle goes. They are deliberately drawn
 * as diagrams so they cannot be mistaken for an actual scan, and they are
 * approximate — probe angle, patient habitus, and anatomical variation change
 * the real picture.
 *
 * Coordinate space is a 320x200 viewBox representing the ultrasound screen:
 * x = probe footprint (left/right per each spec's `orientation`), y = depth,
 * increasing downward.
 */

export type Tissue =
  | "artery"
  | "vein"
  | "nerve"
  | "muscle"
  | "muscleDeep"
  | "bone"
  | "shadow"
  | "fascia"
  | "pleura"
  | "target";

export interface SonoShape {
  tissue: Tissue;
  ellipse?: { cx: number; cy: number; rx: number; ry: number };
  path?: string;
  label?: string;
  marker?: [number, number];
}

export interface SonoSpec {
  title: string;
  /** What the left and right edges of the screen correspond to on the patient. */
  orientation: string;
  probe: string;
  shapes: SonoShape[];
  needle?: { from: [number, number]; to: [number, number]; label: string };
  note?: string;
}

const e = (
  tissue: Tissue,
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  label?: string,
  marker?: [number, number]
): SonoShape => ({ tissue, ellipse: { cx, cy, rx, ry }, label, marker });

const p = (tissue: Tissue, d: string, label?: string, marker?: [number, number]): SonoShape => ({
  tissue,
  path: d,
  label,
  marker,
});

/** Keyed by the same technique key used for real reference images. */
export const SONO_ANATOMY: Record<string, SonoSpec> = {
  "usg-adductor-canal": {
    title: "Adduktor kanal — transvers kesit",
    orientation: "Sol: lateral · Sağ: medial",
    probe: "Lineer prob, uyluk ortası medial yüz, transvers",
    shapes: [
      e("muscle", 55, 130, 62, 62, "Vastus medialis"),
      e("muscleDeep", 272, 140, 60, 58, "Adduktor longus / magnus"),
      e("muscle", 160, 50, 74, 26, "Sartorius kası"),
      p("fascia", "M86,72 Q160,84 234,72", "Adduktor kanal çatısı (vastoadduktor membran)", [232, 62]),
      e("vein", 160, 132, 20, 15, "Femoral ven"),
      e("artery", 160, 98, 18, 18, "Femoral arter"),
      e("nerve", 186, 80, 8, 7, "Safen sinir"),
    ],
    needle: { from: [12, 158], to: [176, 88], label: "İğne — in-plane, lateralden medial" },
    note: "Safen sinir tipik olarak arterin anterolateralindedir; enjeksiyon arterin hemen çevresine yapılır.",
  },

  "usg-interscalene": {
    title: "İnterskalen oluk — transvers kesit",
    orientation: "Sol: anteromedial · Sağ: posterolateral",
    probe: "Lineer prob, krikoid kıkırdak hizası (C6), transvers",
    shapes: [
      p("muscle", "M0,22 Q90,14 178,30 L172,54 Q88,40 0,48 Z", "Sternokleidomastoid", [70, 34]),
      e("muscle", 104, 112, 44, 36, "Ön skalen kası"),
      e("muscle", 236, 122, 52, 42, "Orta skalen kası"),
      e("nerve", 163, 78, 9, 9, "C5 kökü"),
      e("nerve", 170, 102, 10, 10, "C6 kökü"),
      e("nerve", 177, 126, 9, 9, "C7 kökü"),
      p("target", "M148,64 Q160,102 168,142", "Enjeksiyon düzlemi (skalenler arası)", [126, 150]),
    ],
    needle: { from: [312, 168], to: [190, 112], label: "İğne — in-plane, lateralden mediale" },
    note: "Üç kök dikey dizilimiyle 'trafik lambası' görünümü verir. Frenik sinir ön skalen kasının üzerinde seyreder.",
  },

  "usg-supraclavicular": {
    title: "Supraklaviküler bölge — koronal oblik kesit",
    orientation: "Sol: medial · Sağ: lateral",
    probe: "Lineer prob, klavikula üstü çukur, koronal oblik",
    shapes: [
      p("muscle", "M0,18 Q160,10 320,20 L320,44 Q160,36 0,44 Z", "Cilt altı / kaslar", [42, 30]),
      e("artery", 138, 106, 24, 24, "Subklavyen arter"),
      e("nerve", 186, 88, 9, 9, "Brakiyal pleksus (trunkuslar/divizyonlar)"),
      e("nerve", 202, 100, 8, 8),
      e("nerve", 190, 110, 8, 8),
      e("nerve", 205, 78, 7, 7),
      p("bone", "M96,146 Q126,134 158,146", "1. kot", [110, 158]),
      p("shadow", "M96,148 L158,148 L166,200 L88,200 Z"),
      p("pleura", "M166,146 Q236,156 320,166", "Plevra", [268, 152]),
      p("shadow", "M166,150 Q236,160 320,170 L320,200 L166,200 Z"),
    ],
    needle: { from: [314, 62], to: [212, 96], label: "İğne — in-plane, lateralden mediale" },
    note: "'Corner pocket' (arter ile 1. kot arası köşe) klasik hedeftir. Plevra medial-derinde, iğne ucu daima görüş içinde tutulmalıdır.",
  },

  "usg-infraclavicular": {
    title: "İnfraklaviküler bölge — parasagittal kesit",
    orientation: "Sol: sefalik · Sağ: kaudal",
    probe: "Lineer prob, korakoid çıkıntının mediali, parasagittal",
    shapes: [
      p("muscle", "M0,16 Q160,8 320,18 L320,48 Q160,40 0,48 Z", "Pektoralis majör", [46, 30]),
      p("muscle", "M0,52 Q160,44 320,54 L320,80 Q160,72 0,78 Z", "Pektoralis minör", [46, 64]),
      e("artery", 168, 118, 23, 23, "Aksiller arter"),
      e("vein", 226, 132, 24, 17, "Aksiller ven"),
      e("nerve", 146, 90, 9, 8, "Lateral kord"),
      e("nerve", 172, 148, 9, 8, "Posterior kord"),
      e("nerve", 198, 116, 9, 8, "Medial kord"),
      p("pleura", "M0,182 Q160,176 320,184", "Plevra (derinde)", [58, 192]),
    ],
    needle: { from: [40, 22], to: [166, 146], label: "İğne — in-plane, sefalikten kaudale (dik açı)" },
    note: "Hedef, arterin posteriorundaki 'U' boşluğudur; buraya yapılan enjeksiyon üç kordu da sarar.",
  },

  "usg-popliteal-sciatic": {
    title: "Popliteal fossa — transvers kesit",
    orientation: "Sol: lateral · Sağ: medial",
    probe: "Lineer prob, popliteal kıvrımın 5-8 cm proksimali, transvers",
    shapes: [
      e("muscle", 46, 104, 58, 66, "Biceps femoris"),
      e("muscle", 278, 112, 58, 64, "Semimembranosus / semitendinosus"),
      e("nerve", 186, 60, 12, 11, "Ortak peroneal sinir"),
      e("nerve", 148, 68, 14, 12, "Tibial sinir"),
      p("fascia", "M120,48 Q166,36 214,50", "Paraneural kılıf", [116, 38]),
      e("vein", 156, 118, 16, 12, "Popliteal ven"),
      e("artery", 158, 152, 15, 15, "Popliteal arter"),
    ],
    needle: { from: [10, 34], to: [132, 62], label: "İğne — in-plane, lateralden mediale" },
    note: "Prob proksimale kaydırıldıkça iki sinir birleşerek siyatik siniri oluşturur; enjeksiyon ayrılma noktasının hemen proksimaline yapılır.",
  },

  "usg-tap": {
    title: "Transversus abdominis düzlemi — transvers kesit",
    orientation: "Sol: lateral · Sağ: medial (orta aksiller hat)",
    probe: "Lineer prob, kosta kenarı ile iliak krest arası, transvers",
    shapes: [
      p("muscle", "M0,30 Q160,22 320,32 L320,58 Q160,48 0,56 Z", "Eksternal oblik", [48, 42]),
      p("muscle", "M0,60 Q160,52 320,62 L320,104 Q160,94 0,100 Z", "İnternal oblik", [48, 80]),
      p("muscle", "M0,108 Q160,98 320,108 L320,134 Q160,124 0,132 Z", "Transversus abdominis", [56, 120]),
      p("target", "M14,104 Q160,96 306,106", "TAP düzlemi (hedef)", [244, 92]),
      p("fascia", "M0,140 Q160,130 320,140", "Periton", [268, 150]),
      e("muscleDeep", 160, 190, 150, 40, "Barsak ansları (derinde)", [160, 186]),
    ],
    needle: { from: [8, 46], to: [150, 102], label: "İğne — in-plane, anteriordan posteriora" },
    note: "Lokal anestezik iki kas arasında hipoekoik mekik şeklinde yayılır; yayılım görülmüyorsa iğne ucu yanlış düzlemdedir.",
  },

  "usg-peng": {
    title: "PENG — iliopubik eminens düzeyi",
    orientation: "Sol: lateral · Sağ: medial",
    probe: "Kurvilineer prob, ASIS'ten iliopubik eminense oblik",
    shapes: [
      p("muscle", "M0,26 Q160,18 320,28 L320,54 Q160,46 0,54 Z", "Cilt altı / sartorius", [46, 38]),
      e("muscle", 146, 96, 78, 38, "Psoas kası ve tendonu"),
      p("bone", "M64,150 Q150,128 236,152", "İliopubik eminens (IPE)", [78, 164]),
      p("shadow", "M64,154 Q150,132 236,156 L242,200 L58,200 Z"),
      p("target", "M96,132 Q152,116 214,134", "Hedef düzlem (psoas tendonu ile kemik arası)", [222, 118]),
      e("artery", 276, 84, 19, 19, "Femoral arter"),
    ],
    needle: { from: [10, 30], to: [150, 126], label: "İğne — in-plane, lateralden mediale, kemiğe temas" },
    note: "İğne ucu kemikle temas ettirilir, ardından hafif geri çekilip psoas tendonunun altına enjeksiyon yapılır.",
  },

  "usg-fascia-iliaca": {
    title: "Fasya iliaka — suprainguinal transvers kesit",
    orientation: "Sol: lateral · Sağ: medial",
    probe: "Lineer prob, inguinal ligamanın hemen üstü, transvers",
    shapes: [
      e("muscle", 108, 62, 76, 30, "Sartorius kası"),
      e("muscle", 128, 140, 108, 54, "İliakus kası"),
      p("bone", "M40,180 Q150,164 250,182", "İlium (kemik)", [56, 192]),
      p("shadow", "M40,184 Q150,168 250,186 L250,200 L40,200 Z"),
      p("target", "M28,104 Q140,90 244,106", "Fasya iliaka (hedef düzlem — altına enjeksiyon)", [246, 92]),
      e("nerve", 214, 118, 11, 9, "Femoral sinir"),
      e("artery", 276, 112, 18, 18, "Femoral arter"),
    ],
    needle: { from: [8, 40], to: [136, 100], label: "İğne — in-plane, lateralden mediale" },
    note: "Lokal anestezik fasyanın altında kraniyal yönde yayılmalı; fasyanın üstünde kalırsa blok başarısız olur.",
  },

  "usg-esp": {
    title: "Erektor spina düzlemi — parasagittal kesit",
    orientation: "Sol: sefalik · Sağ: kaudal (orta hattın 2-3 cm laterali)",
    probe: "Lineer prob, transvers çıkıntı üzerinde, parasagittal",
    shapes: [
      p("muscle", "M0,24 Q160,16 320,26 L320,52 Q160,44 0,52 Z", "Trapezius / romboid", [48, 36]),
      p("muscle", "M0,56 Q160,48 320,58 L320,120 Q160,112 0,118 Z", "Erektor spina kas grubu", [56, 88]),
      p("bone", "M56,128 L124,128 L124,148 L56,148 Z", "Transvers çıkıntı", [90, 160]),
      p("shadow", "M56,150 L124,150 L124,200 L56,200 Z"),
      p("bone", "M196,128 L264,128 L264,148 L196,148 Z"),
      p("shadow", "M196,150 L264,150 L264,200 L196,200 Z"),
      p("target", "M40,124 Q160,116 280,124", "Hedef düzlem (kasın altı, kemiğin üstü)", [282, 110]),
    ],
    needle: { from: [10, 34], to: [96, 126], label: "İğne — in-plane, kemiğe temas edene kadar" },
    note: "İğne transvers çıkıntının kemiğine değdirilir; enjeksiyon kemik ile kas arasında kraniokaudal yayılır.",
  },

  "usg-pecs2": {
    title: "PECS II — 3.-4. kot düzeyi",
    orientation: "Sol: medial · Sağ: lateral",
    probe: "Lineer prob, klavikula altı, kotlara oblik",
    shapes: [
      p("muscle", "M0,22 Q160,14 320,24 L320,54 Q160,46 0,52 Z", "Pektoralis majör", [46, 34]),
      p("muscle", "M0,58 Q140,50 260,64 L254,92 Q136,80 0,86 Z", "Pektoralis minör", [50, 72]),
      p("muscle", "M0,96 Q160,88 320,100 L320,124 Q160,112 0,120 Z", "Serratus anterior", [58, 108]),
      p("target", "M20,56 Q140,48 246,60", "PECS I düzlemi (majör–minör arası)", [250, 44]),
      p("target", "M20,94 Q150,84 288,98", "PECS II düzlemi (minör–serratus arası)", [292, 84]),
      p("bone", "M52,140 Q84,128 116,140", "Kot", [66, 154]),
      p("shadow", "M52,142 L116,142 L120,200 L48,200 Z"),
      p("bone", "M196,144 Q228,132 260,144"),
      p("shadow", "M196,146 L260,146 L264,200 L192,200 Z"),
      p("pleura", "M120,158 Q160,150 196,158", "Plevra (kotlar arası)", [158, 172]),
    ],
    needle: { from: [8, 30], to: [172, 96], label: "İğne — in-plane, medialden laterale" },
    note: "İki ayrı düzleme enjeksiyon yapılır; kotlar arasında plevra görünür olduğundan iğne ucu sürekli izlenmelidir.",
  },

  "usg-spinal": {
    title: "Lomber omurga — paramedian sagittal oblik kesit",
    orientation: "Sol: sefalik · Sağ: kaudal",
    probe: "Kurvilineer prob, orta hattın 1-2 cm laterali, sagittal oblik",
    shapes: [
      p("muscle", "M0,20 Q160,14 320,22 L320,62 Q160,54 0,60 Z", "Paraspinal kaslar", [50, 38]),
      p("bone", "M28,78 L84,78 L92,104 L36,104 Z", "Lamina", [58, 116]),
      p("shadow", "M36,106 L92,106 L96,200 L30,200 Z"),
      p("bone", "M132,78 L188,78 L196,104 L140,104 Z"),
      p("shadow", "M140,106 L196,106 L200,200 L134,200 Z"),
      p("bone", "M236,78 L292,78 L300,104 L244,104 Z"),
      p("shadow", "M244,106 L300,106 L304,200 L238,200 Z"),
      p("pleura", "M96,116 Q114,110 132,116", "Ligamentum flavum / dura (interlaminar pencere)", [114, 128]),
      p("pleura", "M200,116 Q218,110 236,116"),
      p("target", "M96,140 Q116,134 134,140", "İntratekal aralık", [140, 152]),
    ],
    needle: { from: [12, 30], to: [110, 132], label: "İğne — interlaminar pencereden" },
    note: "Laminalar 'testere dişi' görünümü verir; enjeksiyon iki lamina arasındaki pencereden yapılır. USG çoğunlukla seviye ve derinlik belirlemek için kullanılır, iğne genelde USG eşliğinde gerçek zamanlı ilerletilmez.",
  },

  // ---- Genişletme ile eklenen teknikler ----
  "usg-quadratus-lumborum": {
    title: "Quadratus lumborum — 'shamrock' görünümü",
    orientation: "Sol: posterior · Sağ: anterior (yan yatış, böğür)",
    probe: "Kurvilineer prob, iliak krestin üzerinde, L4 transvers çıkıntı hizasında",
    shapes: [
      p("muscle", "M0,20 Q160,14 320,22 L320,44 Q160,38 0,46 Z", "Cilt altı / latissimus dorsi", [50, 32]),
      e("muscle", 74, 84, 62, 34, "Erektör spina"),
      e("muscle", 158, 122, 46, 26, "Quadratus lumborum"),
      e("muscleDeep", 254, 126, 58, 34, "Psoas majör"),
      p("bone", "M126,152 Q160,140 194,152", "L4 transvers çıkıntı", [196, 166]),
      p("shadow", "M126,156 Q160,144 194,156 L200,200 L120,200 Z"),
      p("target", "M92,110 Q126,104 150,102", "QL2 hedefi (kasın posterioru)", [40, 106]),
    ],
    needle: { from: [8, 44], to: [136, 106], label: "İğne — in-plane, posteriordan anteriora" },
    note: "Üç kas transvers çıkıntının çevresinde yonca yaprağı gibi dizilir; çıkıntı bulunmadan hedef düzlem güvenilir şekilde ayırt edilemez.",
  },
  "usg-sciatic-subgluteal": {
    title: "Siyatik sinir — subgluteal aralık",
    orientation: "Sol: lateral (büyük trokanter) · Sağ: medial (iskial tuberositas)",
    probe: "Kurvilineer prob, trokanter ile tuberositas arasını birleştiren hatta transvers",
    shapes: [
      p("muscle", "M0,24 Q160,16 320,26 L320,74 Q160,66 0,76 Z", "Gluteus maksimus", [54, 50]),
      p("bone", "M6,120 Q46,96 86,122", "Büyük trokanter", [10, 138]),
      p("shadow", "M6,124 Q46,100 86,126 L92,200 L0,200 Z"),
      p("bone", "M232,124 Q272,100 312,126", "İskial tuberositas", [252, 142]),
      p("shadow", "M232,128 Q272,104 312,130 L318,200 L226,200 Z"),
      e("nerve", 162, 104, 48, 13, "Siyatik sinir (yassı, hiperekoik)"),
      p("fascia", "M92,88 Q162,80 230,88", "Subgluteal fasyal aralık", [230, 76]),
    ],
    needle: { from: [10, 40], to: [128, 100], label: "İğne — in-plane, lateralden mediale" },
    note: "Popliteal seviyeden farklı olarak hamstring dalları henüz ayrılmamıştır; blok diz fleksiyonunu da zayıflatır.",
  },
  "usg-obturator": {
    title: "Obturator sinir — interadduktor düzlem",
    orientation: "Sol: lateral · Sağ: medial (uyluk üst-iç yüzü)",
    probe: "Lineer prob, inguinal kıvrımın hemen altında, transvers",
    shapes: [
      p("muscle", "M0,26 Q160,20 320,28 L320,66 Q160,58 0,66 Z", "Pektineus / adduktor longus", [46, 44]),
      p("muscle", "M0,72 Q160,64 320,74 L320,114 Q160,106 0,114 Z", "Adduktor brevis", [48, 92]),
      p("muscleDeep", "M0,120 Q160,112 320,122 L320,168 Q160,158 0,166 Z", "Adduktor magnus", [52, 142]),
      p("target", "M40,70 Q160,62 280,72", "Ön dal (longus–brevis arası)", [246, 56]),
      p("target", "M40,118 Q160,110 280,120", "Arka dal (brevis–magnus arası)", [246, 132]),
    ],
    needle: { from: [8, 38], to: [150, 114], label: "İğne — in-plane, lateralden mediale; iki düzlem sırayla" },
    note: "Tek enjeksiyonla iki dalın birlikte tutulması hedeflenir; ayrı ayrı enjeksiyon başarı oranını artırır.",
  },
  "usg-wrist-block": {
    title: "Median sinir — bilek seviyesi",
    orientation: "Sol: radial · Sağ: ulnar",
    probe: "Yüksek frekanslı lineer prob, distal önkol volar yüzü, transvers",
    shapes: [
      p("muscle", "M0,22 Q160,16 320,24 L320,40 Q160,34 0,42 Z", "Cilt altı", [42, 30]),
      e("muscle", 78, 62, 20, 13, "Fleksör karpi radialis tendonu"),
      e("muscle", 152, 58, 16, 11, "Palmaris longus tendonu"),
      e("nerve", 118, 78, 22, 13, "Median sinir (bal peteği görünümü)", [180, 76]),
      e("artery", 44, 74, 12, 12, "Radial arter"),
      e("artery", 268, 78, 12, 12, "Ulnar arter"),
      e("nerve", 244, 90, 14, 10, "Ulnar sinir", [286, 104]),
      p("muscleDeep", "M0,108 Q160,100 320,110 L320,150 Q160,142 0,150 Z", "Derin fleksör tendonlar", [56, 130]),
      p("bone", "M40,166 Q160,154 290,166", "Radius / ulna", [150, 180]),
    ],
    needle: { from: [10, 36], to: [98, 74], label: "İğne — in-plane, radialden ulnara" },
    note: "Median sinir tendonlardan bal peteği iç yapısıyla ayrılır; probu hafifçe eğerek tendonların parlaklığının değişmesi (anizotropi) ayrımı kolaylaştırır.",
  },
  "usg-parasternal": {
    title: "Parasternal düzlem — pekto-interkostal",
    orientation: "Sol: lateral · Sağ: medial (sternum kenarı)",
    probe: "Yüksek frekanslı lineer prob, sternum kenarının 1–2 cm lateralinde, parasagittal",
    shapes: [
      p("muscle", "M0,24 Q160,18 320,26 L320,58 Q160,52 0,60 Z", "Pektoralis majör", [50, 42]),
      p("bone", "M28,92 Q64,76 100,94", "3. kıkırdak kot", [30, 108]),
      p("shadow", "M28,96 Q64,80 100,98 L104,200 L24,200 Z"),
      p("bone", "M212,92 Q248,76 284,94", "4. kıkırdak kot", [252, 108]),
      p("shadow", "M212,96 Q248,80 284,98 L288,200 L208,200 Z"),
      p("target", "M40,68 Q160,60 280,70", "Pekto-interkostal düzlem (hedef)", [230, 54]),
      e("artery", 176, 104, 8, 8, "İnternal torasik arter"),
      p("muscleDeep", "M104,116 Q160,108 210,116 L210,132 Q160,124 104,132 Z", "Transversus torasis"),
      p("pleura", "M104,146 Q160,140 212,146", "Plevra", [160, 160]),
    ],
    needle: { from: [8, 38], to: [150, 66], label: "İğne — in-plane, lateralden mediale" },
    note: "İnternal torasik arter sternum kenarına çok yakındır ve renkli Doppler ile mutlaka görülmelidir; plevra derinlikte sürekli takip edilir.",
  },
  "usg-pecs1": {
    title: "PECS I — pektoralis majör/minör arası",
    orientation: "Sol: medial · Sağ: lateral (klavikula altı)",
    probe: "Lineer prob, klavikula altı 2-3. kot düzeyi, oblik-sagittal",
    shapes: [
      p("muscle", "M0,26 Q160,18 320,28 L320,62 Q160,54 0,62 Z", "Pektoralis majör", [48, 44]),
      p("muscle", "M40,76 Q170,66 320,78 L320,110 Q170,100 40,110 Z", "Pektoralis minör", [92, 94]),
      p("target", "M50,70 Q170,60 300,72", "Hedef düzlem (iki kas arası)", [242, 56]),
      e("artery", 196, 68, 8, 8, "Torakoakromiyal arter — pektoral dal"),
      p("bone", "M96,140 Q136,122 176,142", "Kot", [98, 158]),
      p("shadow", "M96,144 Q136,126 176,146 L182,200 L90,200 Z"),
      p("pleura", "M182,150 Q248,144 316,152", "Plevra", [258, 166]),
    ],
    needle: { from: [8, 40], to: [156, 66], label: "İğne — in-plane, medialden laterale" },
    note: "Torakoakromiyal arterin pektoral dalı düzlemi doğrulayan landmark'tır. Bu blok yalnızca pektoral sinirleri tutar; cilt duyusu kapsanmaz.",
  },
  "usg-epidural-thoracic": {
    title: "Torasik epidural — paramedian oblik kesit",
    orientation: "Sol: sefalik · Sağ: kaudal (orta hattın 1–2 cm lateralinde)",
    probe: "Kurvilineer prob, paramedian sagittal oblik",
    shapes: [
      p("muscle", "M0,20 Q160,14 320,22 L320,58 Q160,52 0,60 Z", "Paraspinal kaslar", [50, 40]),
      p("bone", "M18,96 Q54,74 90,98", "Lamina", [14, 114]),
      p("shadow", "M18,100 Q54,78 90,102 L96,200 L12,200 Z"),
      p("bone", "M138,96 Q174,74 210,98", "Lamina", [148, 114]),
      p("shadow", "M138,100 Q174,78 210,102 L216,200 L132,200 Z"),
      p("bone", "M258,96 Q294,74 320,100", "Lamina", [268, 114]),
      p("shadow", "M258,100 Q294,78 320,104 L320,200 L252,200 Z"),
      p("target", "M96,120 Q116,114 134,120", "Ligamentum flavum / epidural aralık", [96, 138]),
      p("fascia", "M96,134 Q116,128 134,134", "Posterior dura"),
    ],
    needle: { from: [10, 34], to: [110, 118], label: "İğne — paramedian, belirgin sefalik açıyla interlaminar pencereden" },
    note: "Torasik seviyede laminalar kiremit gibi üst üste biner; interlaminar pencere lomber bölgeye göre çok dardır ve iğne açısı buna göre dikleştirilir. Aralığın kendisi direnç kaybı ile bulunur, USG seviye ve derinlik tahmini içindir.",
  },
  "usg-deep-cervical": {
    title: "Derin servikal pleksus — C4 transvers çıkıntı",
    orientation: "Sol: anterior · Sağ: posterior",
    probe: "Lineer prob, sternokleidomastoidin posterior kenarında, transvers",
    shapes: [
      p("muscle", "M0,24 Q120,16 240,26 L240,58 Q120,50 0,58 Z", "Sternokleidomastoid", [40, 42]),
      e("artery", 60, 92, 18, 18, "Karotis arter"),
      e("vein", 116, 84, 22, 15, "İnternal juguler ven"),
      p("bone", "M186,120 Q214,104 242,122", "Anterior tüberkül", [176, 138]),
      p("bone", "M262,118 Q290,102 318,120", "Posterior tüberkül", [274, 136]),
      p("shadow", "M186,124 Q252,104 318,124 L320,200 L182,200 Z"),
      e("nerve", 252, 112, 14, 10, "C4 sinir kökü (tüberküller arası)", [206, 92]),
      p("muscle", "M140,68 Q220,60 300,70 L300,92 Q220,84 140,92 Z", "Skalen kaslar"),
    ],
    needle: { from: [312, 46], to: [258, 106], label: "İğne — in-plane, posteriordan anteriora" },
    note: "Frenik sinir ön skalen kasın yüzeyinde hemen komşudur; bu blok iki taraflı uygulanmaz ve vertebral arter derinlikte akılda tutulmalıdır.",
  },

  // ---- Kalan USG teknikleri ----
  "usg-ipack": {
    title: "IPACK — popliteal arter ile femur arası",
    orientation: "Sol: medial · Sağ: lateral (diz arkası)",
    probe: "Kurvilineer prob, popliteal krukta femur kondilleri düzeyinde, transvers",
    shapes: [
      p("muscle", "M0,22 Q160,16 320,24 L320,52 Q160,46 0,54 Z", "Cilt altı / hamstring tendonları", [46, 38]),
      e("artery", 118, 84, 17, 17, "Popliteal arter"),
      e("vein", 158, 82, 15, 13, "Popliteal ven"),
      e("nerve", 206, 74, 15, 11, "Tibial sinir (hedef değil)", [244, 62]),
      p("bone", "M40,140 Q160,120 296,142", "Femur posterior korteksi", [50, 158]),
      p("shadow", "M40,144 Q160,124 296,146 L300,200 L36,200 Z"),
      p("target", "M70,116 Q160,100 268,118", "Hedef aralık (arter ile kemik arası)", [232, 104]),
    ],
    needle: { from: [8, 40], to: [140, 112], label: "İğne — in-plane, medialden laterale" },
    note: "Enjeksiyon arterin derinine, kemiğin hemen önüne yapılır; sinir gövdeleri kasıtlı olarak korunur, bu yüzden motor blok beklenmez.",
  },
  "usg-saphenous": {
    title: "Safen sinir — adduktor kanal distali",
    orientation: "Sol: lateral · Sağ: medial (uyluk alt-iç yüzü)",
    probe: "Lineer prob, uyluğun distal 1/3'ünde, transvers",
    shapes: [
      p("muscle", "M0,24 Q160,18 320,26 L320,50 Q160,44 0,52 Z", "Cilt altı", [42, 36]),
      e("muscle", 96, 82, 62, 30, "Sartorius"),
      e("artery", 196, 96, 15, 15, "Femoral (yüzeyel) arter"),
      e("nerve", 224, 80, 11, 8, "Safen sinir", [262, 66]),
      p("muscleDeep", "M0,132 Q160,124 320,134 L320,180 Q160,172 0,178 Z", "Vastus medialis", [56, 156]),
      p("fascia", "M40,66 Q160,58 288,68", "Vasto-adduktor membran", [40, 56]),
    ],
    needle: { from: [8, 38], to: [206, 78], label: "İğne — in-plane, lateralden mediale, sartoriusun altına" },
    note: "Sinir arterin hemen lateral-üstünde küçük ve hiperekoiktir; görülemezse arter çevresine perivasküler enjeksiyon yapılır.",
  },
  "usg-ankle-block": {
    title: "Tibial sinir — medial malleol arkası",
    orientation: "Sol: posterior · Sağ: anterior (medial ayak bileği)",
    probe: "Yüksek frekanslı lineer prob, medial malleolün hemen arkasında, transvers",
    shapes: [
      p("muscle", "M0,22 Q160,16 320,24 L320,44 Q160,38 0,46 Z", "Cilt altı", [40, 32]),
      e("artery", 150, 76, 12, 12, "Posterior tibial arter"),
      e("nerve", 108, 82, 15, 11, "Tibial sinir", [58, 70]),
      e("muscle", 216, 78, 22, 14, "Fleksör tendonlar"),
      p("bone", "M188,124 Q252,106 318,126", "Tibia / medial malleol", [206, 142]),
      p("shadow", "M188,128 Q252,110 318,130 L320,200 L184,200 Z"),
    ],
    needle: { from: [10, 36], to: [96, 78], label: "İğne — in-plane, posteriordan anteriora, arterin arkasına" },
    note: "Ayak bileği bloğunun beş sinirinden yalnızca tibial güvenilir şekilde USG ile görülür; kalan dördü cilt altı halka infiltrasyonu ile yapılır.",
  },
  "usg-caudal": {
    title: "Sakral hiatus — transvers ve sagittal görünüm",
    orientation: "Sol: sol kornu · Sağ: sağ kornu",
    probe: "Yüksek frekanslı lineer prob, sakral kornualar üzerinde transvers",
    shapes: [
      p("muscle", "M0,20 Q160,14 320,22 L320,44 Q160,38 0,46 Z", "Cilt altı", [40, 32]),
      p("bone", "M56,84 Q86,64 116,86", "Sol sakral kornu", [40, 100]),
      p("shadow", "M56,88 Q86,68 116,90 L120,200 L52,200 Z"),
      p("bone", "M204,84 Q234,64 264,86", "Sağ sakral kornu", [236, 100]),
      p("shadow", "M204,88 Q234,68 264,90 L268,200 L200,200 Z"),
      p("fascia", "M118,90 Q160,82 202,90", "Sakrokoksigeal ligaman", [160, 76]),
      p("target", "M118,112 Q160,104 202,112", "Sakral kanal (hedef)", [206, 122]),
      p("bone", "M110,138 Q160,128 210,138", "Sakrumun ön duvarı"),
    ],
    needle: { from: [12, 34], to: [150, 108], label: "İğne — kornualar arasından, ligamanı geçtikten sonra düzleştirilir" },
    note: "İki kornu ve aralarındaki ligaman 'kurbağa gözü' görünümü verir. Ligaman geçildikten sonra iğne açısı düşürülmezse sakrumun ön duvarı delinir.",
  },
  "usg-genicular": {
    title: "Genikular sinir — periost-diafiz birleşimi",
    orientation: "Sol: proksimal · Sağ: distal (femur metafizi)",
    probe: "Lineer prob, femur/tibia metafizinde kemik konturu boyunca",
    shapes: [
      p("muscle", "M0,24 Q160,18 320,26 L320,58 Q160,52 0,60 Z", "Cilt altı / vastus", [46, 42]),
      p("bone", "M0,120 Q90,108 150,128 Q220,150 320,146", "Femur korteksi (metafiz-diafiz geçişi)", [40, 138]),
      p("shadow", "M0,124 Q90,112 150,132 Q220,154 320,150 L320,200 L0,200 Z"),
      e("artery", 158, 106, 9, 9, "Genikular arter (landmark)"),
      p("target", "M132,116 Q158,110 184,118", "Hedef — periost üzeri", [196, 104]),
    ],
    needle: { from: [10, 40], to: [146, 112], label: "İğne — in-plane, kemiğe temas edene kadar" },
    note: "Sinirin kendisi görülmez; hedef, arterin komşuluğundaki periost yüzeyidir. Kemiğe temas endpoint olarak kullanılır.",
  },
  "usg-suprascapular": {
    title: "Suprascapular sinir — supraspinöz fossa",
    orientation: "Sol: medial · Sağ: lateral",
    probe: "Lineer prob, skapula spinasının üzerinde, koronal oblik",
    shapes: [
      p("muscle", "M0,22 Q160,16 320,24 L320,50 Q160,44 0,52 Z", "Trapezius", [40, 34]),
      p("muscle", "M0,58 Q160,50 320,60 L320,96 Q160,88 0,96 Z", "Supraspinatus", [50, 76]),
      p("bone", "M0,116 Q110,110 168,116 Q210,122 250,150", "Supraspinöz fossa tabanı ve çentik", [30, 132]),
      p("shadow", "M0,120 Q110,114 168,120 Q210,126 250,154 L250,200 L0,200 Z"),
      e("artery", 196, 108, 8, 8, "Suprascapular arter"),
      p("target", "M150,112 Q186,114 214,124", "Hedef — çentiğin tabanı", [226, 100]),
    ],
    needle: { from: [8, 36], to: [178, 110], label: "İğne — in-plane, medialden laterale, fossa tabanına" },
    note: "Sinir arterin hemen altında ve transvers skapular ligamanın derininde seyreder; kemik taban görülmeden enjeksiyon yapılmaz.",
  },
  "usg-axillary-nerve": {
    title: "Aksiller sinir — humerus boynu, posterior yaklaşım",
    orientation: "Sol: superior · Sağ: inferior (omuz arkası)",
    probe: "Lineer prob, deltoidin arka kenarında, humerus boynu hizasında",
    shapes: [
      p("muscle", "M0,22 Q160,16 320,24 L320,66 Q160,58 0,66 Z", "Deltoid", [46, 44]),
      e("artery", 154, 96, 11, 11, "Posterior sirkumfleks humeral arter"),
      e("nerve", 194, 98, 13, 9, "Aksiller sinir", [230, 84]),
      p("bone", "M40,134 Q160,118 296,136", "Humerus boynu", [52, 152]),
      p("shadow", "M40,138 Q160,122 296,140 L300,200 L36,200 Z"),
      p("target", "M120,114 Q170,108 216,116", "Hedef — kemik ile deltoid arası", [240, 122]),
    ],
    needle: { from: [8, 38], to: [174, 106], label: "İğne — in-plane, superiordan inferiora" },
    note: "Arter sinirin en güvenilir landmark'ıdır; renkli Doppler ile doğrulanır. Kemiğe temas derinlik sınırını verir.",
  },
  "usg-axillary-plexus": {
    title: "Aksiller pleksus — arter çevresi dört sinir",
    orientation: "Sol: superior (radial) · Sağ: inferior (ulnar)",
    probe: "Yüksek frekanslı lineer prob, aksillada pektoralis majör kenarında, transvers",
    shapes: [
      p("muscle", "M0,20 Q160,14 320,22 L320,42 Q160,36 0,44 Z", "Cilt altı", [40, 30]),
      e("artery", 160, 92, 20, 20, "Aksiller arter"),
      e("vein", 208, 118, 16, 11, "Aksiller ven"),
      e("nerve", 160, 58, 13, 9, "Median sinir (12 yön)", [196, 46]),
      e("nerve", 116, 116, 13, 9, "Radial sinir (6–8 yön)", [56, 128]),
      e("nerve", 214, 74, 12, 9, "Ulnar sinir (3 yön)", [250, 60]),
      e("nerve", 88, 66, 14, 10, "Muskülokutanöz (korakobrakiyalis içinde)", [30, 54]),
      p("muscle", "M40,140 Q160,130 320,142 L320,180 Q160,170 40,178 Z", "Konjoint tendon / humerus", [70, 162]),
    ],
    needle: { from: [8, 34], to: [140, 76], label: "İğne — in-plane; her sinir için ayrı enjeksiyon" },
    note: "Muskülokutanöz sinir arter çevresinde değil, korakobrakiyalis kası içinde ayrı seyreder; ayrıca aranmazsa dirsek fleksiyonu ve önkol lateral duyusu açık kalır.",
  },
  "usg-rectus-sheath": {
    title: "Rektus kılıfı — arka kılıf düzlemi",
    orientation: "Sol: lateral · Sağ: medial (orta hat)",
    probe: "Lineer prob, umbilikus hizasında, transvers",
    shapes: [
      p("muscle", "M0,26 Q160,20 320,28 L320,44 Q160,38 0,46 Z", "Cilt altı", [42, 34]),
      e("muscle", 168, 84, 130, 34, "Rektus abdominis"),
      p("target", "M52,118 Q168,110 286,120", "Arka kılıf ile kas arası (hedef)", [242, 106]),
      p("fascia", "M46,126 Q168,118 292,128", "Posterior rektus kılıfı", [56, 140]),
      e("artery", 92, 112, 7, 7, "İnferior epigastrik arter"),
      p("fascia", "M40,152 Q168,144 300,154", "Periton", [280, 166]),
      e("muscleDeep", 168, 190, 150, 34, "Barsak ansları (derinde)"),
    ],
    needle: { from: [8, 40], to: [150, 114], label: "İğne — in-plane, lateralden mediale" },
    note: "Kas ile arka kılıf arasındaki potansiyel aralık açılır; epigastrik damarlar bu düzlemde seyreder ve Doppler ile görülmelidir.",
  },
  "usg-ilioinguinal": {
    title: "İlioinguinal / iliohipogastrik — ASIS medialinde",
    orientation: "Sol: lateral (ASIS) · Sağ: medial",
    probe: "Yüksek frekanslı lineer prob, ASIS'in medial-kaudalinde, oblik",
    shapes: [
      p("muscle", "M0,26 Q160,20 320,28 L320,54 Q160,48 0,56 Z", "Eksternal oblik", [46, 40]),
      p("muscle", "M0,60 Q160,54 320,64 L320,100 Q160,92 0,98 Z", "İnternal oblik", [48, 80]),
      p("muscle", "M0,106 Q160,98 320,108 L320,132 Q160,124 0,130 Z", "Transversus abdominis", [56, 118]),
      e("nerve", 132, 102, 10, 7, "İlioinguinal sinir"),
      e("nerve", 176, 100, 10, 7, "İliohipogastrik sinir", [214, 88]),
      p("bone", "M4,120 Q34,104 62,124", "ASIS", [6, 138]),
      p("shadow", "M4,124 Q34,108 62,128 L66,200 L0,200 Z"),
      p("target", "M92,104 Q154,96 214,104", "Hedef düzlem (iki kas arası)", [246, 118]),
    ],
    needle: { from: [10, 40], to: [140, 98], label: "İğne — in-plane, lateralden mediale" },
    note: "İki sinir genellikle yan yana görülür ve ASIS'e yakınlıkları landmark'tır. USG ile gereken hacim landmark tekniğe göre belirgin düşüktür.",
  },
  "usg-scpb": {
    title: "Yüzeyel servikal pleksus — SCM arka kenarı",
    orientation: "Sol: anterior · Sağ: posterior",
    probe: "Lineer prob, SCM'nin orta noktasında, transvers",
    shapes: [
      p("muscle", "M0,24 Q160,18 320,26 L320,42 Q160,36 0,44 Z", "Cilt altı / platisma", [40, 32]),
      e("muscle", 118, 82, 96, 34, "Sternokleidomastoid"),
      p("target", "M196,90 Q226,86 258,94", "Hedef — SCM arka kenarının altı", [262, 78]),
      e("nerve", 220, 100, 12, 8, "Yüzeyel servikal pleksus dalları"),
      p("muscleDeep", "M150,124 Q240,116 320,126 L320,164 Q240,156 150,162 Z", "Skalen kaslar", [200, 146]),
      e("vein", 62, 116, 20, 13, "İnternal juguler ven"),
    ],
    needle: { from: [312, 44], to: [232, 94], label: "İğne — in-plane, posteriordan anteriora, kas altına girmeden" },
    note: "Enjeksiyon yüzeyel fasyanın altına yapılır; iğne SCM'nin derinine ilerletilirse derin servikal pleksusa ve frenik sinire ulaşılır.",
  },
  "usg-pudendal": {
    title: "Pudendal sinir — iskial spina düzeyi",
    orientation: "Sol: medial · Sağ: lateral (transgluteal yaklaşım)",
    probe: "Kurvilineer prob, gluteal bölgede iskial spina hizasında, transvers",
    shapes: [
      p("muscle", "M0,22 Q160,16 320,24 L320,64 Q160,56 0,64 Z", "Gluteus maksimus", [50, 44]),
      p("bone", "M180,124 Q226,102 274,126", "İskial spina", [212, 142]),
      p("shadow", "M180,128 Q226,106 274,130 L280,200 L174,200 Z"),
      p("fascia", "M60,110 Q140,102 186,120", "Sakrospinöz ligaman", [50, 100]),
      e("artery", 146, 110, 9, 9, "İnternal pudendal arter"),
      e("nerve", 118, 116, 12, 8, "Pudendal sinir", [70, 130]),
      p("target", "M92,110 Q136,104 176,116", "Hedef — ligamanın hemen medial-altı", [86, 96]),
    ],
    needle: { from: [312, 46], to: [150, 112], label: "İğne — in-plane, lateralden mediale, spinaya temas ederek" },
    note: "Sinir arterin medialindedir; arter Doppler ile bulunup sinir ona göre konumlandırılır. İskial spinaya kemik teması derinliği doğrular.",
  },
};

export function sonoSpecFor(key: string): SonoSpec | undefined {
  return SONO_ANATOMY[key];
}
