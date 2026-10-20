/**
 * Pleksus şemaları: brakiyal, lomber, sakral.
 *
 * Hepsi aynı soruyu yanıtlar — iğne pleksusun neresinde? — ve hepsi aynı
 * biçimde çalışır: yapılar bir zincir olarak çizilir, her yaklaşım o zincir
 * üzerinde bir seviye (yatay çizgi) ya da tek bir hedef (halka) olarak
 * işaretlenir, renkler `closureFor` çıktısından gelir. Şemaların kendi
 * doğruluk kaynağı yoktur; bir tekniğin hedefleri değişirse şema onunla
 * değişir.
 *
 * Koordinatlar `nerves.ts` çizgesinden türetilemez: o çizge neyin neyi
 * blokladığını bilir, yapıların nerede durduğunu bilmez. Çizgede olmayan ara
 * basamaklar (brakiyal divizyonlar, spinal kökler) burada yalnızca çizim için
 * vardır ve rengini besledikleri yapıdan alır (`statusVia`).
 *
 * Renk = **bloğun ulaştığı yapı**. Kökler hiçbir zaman dolu boyanmaz: hiçbir
 * yaklaşım kökü hedeflemez, dolu bir kök iğnenin kendi seviyesinin
 * proksimaline ulaştığını söylerdi. Lifleri bloklanan bir yapıya gidiyorsa
 * yalnızca çerçeveleri renklenir.
 *
 * Şemalar öğretim amaçlı basitleştirmedir. Bilinçli olarak çizilmeyenler:
 * lomberde aksesuar obturator siniri (insanların bir bölümünde bulunur ve
 * çizimde obturatorun üstüne biner), her iki tarafta da komşu pleksuslarla
 * kesişen dallar (safen lomber şemada, sural iki peroneal/tibial arasında).
 */

/** Düğümün nasıl çizileceği. */
export type PlexusShape = "root" | "hub" | "pip" | "branch";

export interface PlexusNode {
  id: string;
  label: string;
  x: number;
  y: number;
  shape: PlexusShape;
  /** Çizgedeki karşılığı; rengi buradan gelir. */
  nerveId?: string;
  /** Çizgede karşılığı olmayan düğümler rengi buradan alır. */
  statusVia?: string;
  /** hub genişliği (varsayılan 70). */
  width?: number;
  anchor?: "middle" | "start" | "end";
  labelAbove?: boolean;
  labelBeside?: boolean;
}

export interface PlexusEdge {
  from: string;
  to: string;
}

export interface PlexusApproach {
  techniqueId: string;
  label: string;
  /** Seviye çizgisinin y'si — iğnenin zincirdeki yeri. */
  y?: number;
  /** Seviye yerine tek tek yapıları işaretleyen bloklar. */
  markNodes?: string[];
  caption: string;
}

export interface PlexusDiagram {
  id: PlexusId;
  label: string;
  /** Ekranın başındaki bir cümlelik tanım. */
  summary: string;
  viewBox: { width: number; height: number };
  nodes: PlexusNode[];
  edges: PlexusEdge[];
  approaches: PlexusApproach[];
  /** Şemanın öğrettiği noktalar. */
  lessons: { title: string; detail: string }[];
}

export type PlexusId = "brachial" | "lumbar" | "sacral";

// ---------------------------------------------------------------------------
// Brakiyal pleksus
// ---------------------------------------------------------------------------

const BRACHIAL: PlexusDiagram = {
  id: "brachial",
  label: "Brakiyal",
  summary:
    "Kök → trunkus → divizyon → kord → uç sinir. Üst ekstremite bloklarının hepsi bu zincirin bir yerine iğne koyar; kapsamı belirleyen de iğnenin seviyesidir.",
  viewBox: { width: 320, height: 400 },
  nodes: [
    // Kökler (ventral rami C5–T1)
    { id: "c5", label: "C5", x: 32, y: 26, shape: "root", statusVia: "upper-trunk" },
    { id: "c6", label: "C6", x: 86, y: 26, shape: "root", statusVia: "upper-trunk" },
    { id: "c7", label: "C7", x: 140, y: 26, shape: "root", statusVia: "middle-trunk" },
    { id: "c8", label: "C8", x: 194, y: 26, shape: "root", statusVia: "lower-trunk" },
    { id: "t1", label: "T1", x: 248, y: 26, shape: "root", statusVia: "lower-trunk" },

    // Trunkuslar
    { id: "upper", label: "Üst", x: 59, y: 92, shape: "hub", width: 62, nerveId: "upper-trunk" },
    { id: "middle", label: "Orta", x: 140, y: 92, shape: "hub", width: 62, nerveId: "middle-trunk" },
    { id: "lower", label: "Alt", x: 221, y: 92, shape: "hub", width: 62, nerveId: "lower-trunk" },

    // Suprascapular sinir trunkustan ayrılır — kordların proksimalinde. Şemadaki
    // yeri, infraklaviküler bloğun onu neden kaçırdığının cevabıdır.
    {
      id: "suprascapular",
      label: "Suprascapular",
      x: 20,
      y: 126,
      shape: "branch",
      nerveId: "suprascapular",
      anchor: "start",
      labelBeside: true,
    },

    // Divizyonlar
    { id: "upper-ant", label: "ön", x: 38, y: 182, shape: "pip", statusVia: "upper-trunk" },
    { id: "upper-post", label: "arka", x: 80, y: 182, shape: "pip", statusVia: "upper-trunk" },
    { id: "middle-ant", label: "ön", x: 119, y: 182, shape: "pip", statusVia: "middle-trunk" },
    { id: "middle-post", label: "arka", x: 161, y: 182, shape: "pip", statusVia: "middle-trunk" },
    { id: "lower-ant", label: "ön", x: 200, y: 182, shape: "pip", statusVia: "lower-trunk" },
    { id: "lower-post", label: "arka", x: 242, y: 182, shape: "pip", statusVia: "lower-trunk" },

    // Kordlar
    { id: "lateral", label: "Lateral", x: 59, y: 246, shape: "hub", width: 72, nerveId: "lateral-cord" },
    { id: "posterior", label: "Posterior", x: 140, y: 246, shape: "hub", width: 72, nerveId: "posterior-cord" },
    { id: "medial", label: "Medial", x: 221, y: 246, shape: "hub", width: 72, nerveId: "medial-cord" },

    // Uç sinirler
    { id: "mc", label: "Muskülokut.", x: 40, y: 320, shape: "branch", nerveId: "musculocutaneous" },
    { id: "axn", label: "Aksiller sinir", x: 122, y: 320, shape: "branch", nerveId: "axillary-nerve" },
    { id: "rad", label: "Radial", x: 204, y: 320, shape: "branch", nerveId: "radial" },
    { id: "med", label: "Median", x: 62, y: 372, shape: "branch", nerveId: "median" },
    { id: "uln", label: "Ulnar", x: 152, y: 372, shape: "branch", nerveId: "ulnar" },
    {
      id: "mabc",
      label: "M. antebrakiyal kut.",
      x: 248,
      y: 372,
      shape: "branch",
      nerveId: "medial-antebrachial-cutaneous",
      anchor: "end",
    },
  ],
  edges: [
    { from: "c5", to: "upper" },
    { from: "c6", to: "upper" },
    { from: "c7", to: "middle" },
    { from: "c8", to: "lower" },
    { from: "t1", to: "lower" },

    { from: "upper", to: "suprascapular" },

    { from: "upper", to: "upper-ant" },
    { from: "upper", to: "upper-post" },
    { from: "middle", to: "middle-ant" },
    { from: "middle", to: "middle-post" },
    { from: "lower", to: "lower-ant" },
    { from: "lower", to: "lower-post" },

    // Ön divizyonlar fleksör tarafa (lateral ve medial kord), arka
    // divizyonların üçü birden posterior korda gider.
    { from: "upper-ant", to: "lateral" },
    { from: "middle-ant", to: "lateral" },
    { from: "upper-post", to: "posterior" },
    { from: "middle-post", to: "posterior" },
    { from: "lower-post", to: "posterior" },
    { from: "lower-ant", to: "medial" },

    { from: "lateral", to: "mc" },
    { from: "lateral", to: "med" },
    { from: "medial", to: "med" },
    { from: "medial", to: "uln" },
    { from: "medial", to: "mabc" },
    { from: "posterior", to: "axn" },
    { from: "posterior", to: "rad" },
  ],
  approaches: [
    {
      techniqueId: "interscalene",
      label: "İnterskalen",
      y: 58,
      caption:
        "Kök/üst trunkus düzeyi. Alt trunkus çoğu zaman korunur: ulnar taraf açık kalır, el cerrahisi için yetersizdir. Frenik sinir neredeyse her hastada etkilenir.",
    },
    {
      techniqueId: "supraclavicular",
      label: "Supraklaviküler",
      y: 152,
      caption:
        "Trunkus/divizyon düzeyi — üç trunkus bir arada, kolun tamamı için en yoğun blok. Suprascapular sinir enjeksiyon noktasının proksimalinde ayrılmış olabilir.",
    },
    {
      techniqueId: "infraclavicular",
      label: "İnfraklaviküler",
      y: 214,
      caption:
        "Kord düzeyi. Omuz dalları (suprascapular, aksiller) bu noktanın proksimalinde ayrıldığı için kapsanmaz; dirsek ve altı için güvenilirdir.",
    },
    {
      techniqueId: "axillary-plexus",
      label: "Aksiller pleksus",
      y: 288,
      caption:
        "Uç sinir düzeyi. Muskülokutanöz sinir korakobrakiyalis içinde ayrı seyrettiği için genellikle ayrı enjeksiyon ister; omuz ve aksilla kapsanmaz.",
    },
    {
      techniqueId: "suprascapular",
      label: "Suprascapular",
      markNodes: ["suprascapular"],
      caption:
        "Trunkustan ayrılan tek bir dal hedeflenir: omuz kapsülünün büyük bölümü kapsanır, kol motor gücü korunur.",
    },
    {
      techniqueId: "axillary-nerve",
      label: "Aksiller sinir",
      markNodes: ["axn"],
      caption:
        "Posterior kordun dalı, humerus boynu düzeyinde. Suprascapular blokla birlikte omuz için pleksus bloğuna alternatif oluşturur.",
    },
    {
      techniqueId: "wrist-block",
      label: "Bilek",
      caption:
        "Şemanın distalinde kalır: median, ulnar ve radial sinirlerin bilek düzeyindeki uç dalları. Önkol ve turnike bölgesi kapsanmaz.",
    },
    {
      techniqueId: "ivra",
      label: "IVRA",
      caption:
        "Anatomik bir düzeyde değil, turnike altındaki damar yatağında etki eder; kolun tamamı turnike süresince bloke olur.",
    },
  ],
  lessons: [
    {
      title: "İnterskalen ulnar tarafı açık bırakır.",
      detail:
        "İğne kök/üst trunkus düzeyindedir; alt trunkus (C8–T1) çoğu zaman korunur. Omuz için doğru, el için değil.",
    },
    {
      title: "Suprascapular sinir trunkustan ayrılır.",
      detail:
        "Kordların proksimalinde olduğu için infraklaviküler blok onu kaçırır — omuz kapsülünün büyük bölümü açık kalır.",
    },
    {
      title: "Aksiller blok uç sinir düzeyindedir.",
      detail:
        "Muskülokutanöz sinir korakobrakiyalis içinde ayrı seyrettiği için ayrı enjeksiyon ister; omuz ve aksilla hiç kapsanmaz.",
    },
  ],
};

// ---------------------------------------------------------------------------
// Lomber pleksus
// ---------------------------------------------------------------------------

const LUMBAR: PlexusDiagram = {
  id: "lumbar",
  label: "Lomber",
  summary:
    "L1–L4 kökleri psoas kası içinde birleşir ve altı dal verir. Kalça ve uyluk ön yüzünün tamamı buradan gelir; blok seçimi, hangi dalların iğnenin distalinde kaldığına bakar.",
  viewBox: { width: 360, height: 400 },
  nodes: [
    { id: "l1", label: "L1", x: 50, y: 24, shape: "root", statusVia: "lumbar-plexus" },
    { id: "l2", label: "L2", x: 130, y: 24, shape: "root", statusVia: "lumbar-plexus" },
    { id: "l3", label: "L3", x: 210, y: 24, shape: "root", statusVia: "lumbar-plexus" },
    { id: "l4", label: "L4", x: 290, y: 24, shape: "root", statusVia: "lumbar-plexus" },

    {
      id: "plexus",
      label: "Lomber Pleksus",
      x: 180,
      y: 84,
      shape: "hub",
      width: 150,
      nerveId: "lumbar-plexus",
    },

    // Karın duvarı ve kasık dalları
    { id: "ihg", label: "İliohipogastrik", x: 52, y: 134, shape: "branch", nerveId: "iliohypogastric" },
    { id: "iin", label: "İlioinguinal", x: 168, y: 134, shape: "branch", nerveId: "ilioinguinal" },
    {
      id: "gfn",
      label: "Genitofemoral",
      x: 300,
      y: 134,
      shape: "branch",
      nerveId: "genitofemoral",
      anchor: "end",
    },

    // Ana gövdeler
    { id: "lfcn", label: "LFCN", x: 40, y: 200, shape: "branch", nerveId: "lateral-femoral-cutaneous" },
    { id: "fem", label: "Femoral", x: 160, y: 200, shape: "hub", width: 86, nerveId: "femoral" },
    { id: "obt", label: "Obturator", x: 295, y: 200, shape: "hub", width: 96, nerveId: "obturator" },

    // Femoral dalları
    {
      id: "afc",
      label: "Ant. femoral kut.",
      x: 60,
      y: 268,
      shape: "branch",
      nerveId: "anterior-femoral-cutaneous",
    },
    { id: "quad", label: "Kuadriseps", x: 175, y: 268, shape: "branch", nerveId: "nerve-to-quadriceps" },
    {
      id: "obt-art",
      label: "Obturator kalça artiküler",
      x: 340,
      y: 268,
      shape: "branch",
      nerveId: "obturator-articular-hip",
      anchor: "end",
    },
    { id: "vm", label: "Vastus medialis", x: 66, y: 336, shape: "branch", nerveId: "nerve-to-vastus-medialis" },
    { id: "saph", label: "Safen", x: 186, y: 336, shape: "branch", nerveId: "saphenous" },
    {
      id: "fem-art",
      label: "Femoral kalça artiküler",
      x: 340,
      y: 336,
      shape: "branch",
      nerveId: "femoral-articular-hip",
      anchor: "end",
    },
  ],
  edges: [
    { from: "l1", to: "plexus" },
    { from: "l2", to: "plexus" },
    { from: "l3", to: "plexus" },
    { from: "l4", to: "plexus" },

    { from: "plexus", to: "ihg" },
    { from: "plexus", to: "iin" },
    { from: "plexus", to: "gfn" },
    { from: "plexus", to: "lfcn" },
    { from: "plexus", to: "fem" },
    { from: "plexus", to: "obt" },

    { from: "fem", to: "afc" },
    { from: "fem", to: "quad" },
    { from: "fem", to: "vm" },
    { from: "fem", to: "saph" },
    { from: "fem", to: "fem-art" },
    { from: "obt", to: "obt-art" },
  ],
  approaches: [
    {
      techniqueId: "fascia-iliaca",
      label: "Fasya iliaka",
      y: 176,
      caption:
        "Fasya iliaka düzlemi — femoral ve lateral femoral kutanöz sinir güvenilir biçimde tutulur. Obturator klasik olarak iddia edilir ama pratikte sıklıkla tutulmaz; şemada bu yüzden kısmi görünür.",
    },
    {
      techniqueId: "femoral",
      label: "Femoral",
      markNodes: ["fem"],
      caption:
        "Sinir gövdesi hedeflenir: safen dahil bütün dalları birlikte tutulur, kuadriseps zayıflar. LFCN ve obturator kapsanmaz.",
    },
    {
      techniqueId: "acb",
      label: "Adduktor kanal",
      markNodes: ["saph", "vm"],
      caption:
        "Adduktor kanalda safen sinir ve vastus medialis dalı. Kuadrisepsin ana motor dalları proksimalde ayrıldığı için korunur — femoral bloktan farkı budur.",
    },
    {
      techniqueId: "saphenous",
      label: "Safen",
      markNodes: ["saph"],
      caption: "Tek duyusal dal: bacağın iç yüzü ve medial malleol. Hiçbir motor dal tutulmaz.",
    },
    {
      techniqueId: "peng",
      label: "PENG",
      markNodes: ["fem-art", "obt-art"],
      caption:
        "Yalnızca kalça kapsülünün artiküler dalları; kuadriseps motor dalları korunur. Aksesuar obturator siniri de hedeflenir — şemada çizilmemiştir, çünkü herkeste bulunmaz.",
    },
    {
      techniqueId: "obturator",
      label: "Obturator",
      markNodes: ["obt"],
      caption:
        "Adduktor kaslar ve kalça kapsülünün medial bölümü. Tek başına cerrahi anestezi vermez; TUR-M'de adduktor sıçramasını önlemek için kullanılır.",
    },
    {
      techniqueId: "ilioinguinal",
      label: "İlioinguinal–iliohipogastrik",
      markNodes: ["iin", "ihg"],
      caption:
        "Kasık fıtığı onarımının duyusal ayağı. Genitofemoral sinirin genital dalı ayrı seyreder ve bu blokla güvenilir biçimde tutulmaz.",
    },
    {
      techniqueId: "quadratus-lumborum",
      label: "QL",
      markNodes: ["ihg", "iin"],
      caption:
        "Asıl kapsaması torasik sinirlerdedir (T7–L1); bu şemada yalnızca lomber ucu — iliohipogastrik ve ilioinguinal — görünür.",
    },
  ],
  lessons: [
    {
      title: "Femoral blok ile adduktor kanal bloğu aynı sinirin iki farklı yeridir.",
      detail:
        "Femoral gövde bloklandığında safen de içindedir ve kuadriseps zayıflar; adduktor kanalda ise motor dallar çoktan ayrılmıştır. Aynı anda ikisini yapmak kapsama eklemez, yalnızca doz ekler.",
    },
    {
      title: "LFCN ve obturator femoral bloğun dışındadır.",
      detail:
        "Üçü de pleksustan ayrı ayrı çıkar. Uyluk lateral yüzü veya adduktor kaslar gerekiyorsa femoral blok tek başına yetmez; fasya iliaka düzlemi ya da ayrı enjeksiyon gerekir.",
    },
    {
      title: "PENG kapsülü tutar, kuadrisepsi bırakır.",
      detail:
        "Hedef yalnızca artiküler dallardır. Kalça kırığında düşme riskini artırmadan analjezi sağlamasının sebebi budur.",
    },
  ],
};

// ---------------------------------------------------------------------------
// Sakral pleksus
// ---------------------------------------------------------------------------

const SACRAL: PlexusDiagram = {
  id: "sacral",
  label: "Sakral",
  summary:
    "L4–S4 kökleri pelvis arka duvarında birleşir. Bacağın arka yüzü, diz altının tamamı ve perine buradan gelir; siyatik sinirin nerede bloklandığı hangi kasların çalışmaya devam edeceğini belirler.",
  viewBox: { width: 360, height: 470 },
  nodes: [
    { id: "l4", label: "L4", x: 40, y: 24, shape: "root", statusVia: "sacral-plexus" },
    { id: "l5", label: "L5", x: 100, y: 24, shape: "root", statusVia: "sacral-plexus" },
    { id: "s1", label: "S1", x: 160, y: 24, shape: "root", statusVia: "sacral-plexus" },
    { id: "s2", label: "S2", x: 220, y: 24, shape: "root", statusVia: "sacral-plexus" },
    { id: "s3", label: "S3", x: 280, y: 24, shape: "root", statusVia: "sacral-plexus" },
    { id: "s4", label: "S4", x: 336, y: 24, shape: "root", statusVia: "sacral-plexus" },

    {
      id: "plexus",
      label: "Sakral Pleksus",
      x: 180,
      y: 86,
      shape: "hub",
      width: 150,
      nerveId: "sacral-plexus",
    },

    { id: "sgn", label: "Sup. gluteal", x: 48, y: 138, shape: "branch", nerveId: "superior-gluteal" },
    { id: "ign", label: "İnf. gluteal", x: 150, y: 138, shape: "branch", nerveId: "inferior-gluteal" },
    {
      id: "pfc",
      label: "Post. femoral kut.",
      x: 300,
      y: 138,
      shape: "branch",
      nerveId: "posterior-femoral-cutaneous",
      anchor: "end",
    },

    { id: "sci", label: "Siyatik", x: 140, y: 202, shape: "hub", width: 86, nerveId: "sciatic" },
    {
      id: "pud",
      label: "Pudendal",
      x: 318,
      y: 202,
      shape: "branch",
      nerveId: "pudendal",
      anchor: "end",
    },

    { id: "ham", label: "Hamstring dalları", x: 66, y: 252, shape: "branch", nerveId: "nerve-to-hamstrings" },
    {
      id: "knee-art",
      label: "Diz artiküler",
      x: 196,
      y: 252,
      shape: "branch",
      nerveId: "sciatic-articular-knee",
    },
    {
      id: "dpn",
      label: "Dorsal penil",
      x: 340,
      y: 252,
      shape: "branch",
      nerveId: "dorsal-nerve-of-penis",
      anchor: "end",
    },

    { id: "tib", label: "Tibial", x: 108, y: 322, shape: "hub", width: 80, nerveId: "tibial" },
    { id: "cpn", label: "Kommon peroneal", x: 258, y: 322, shape: "hub", width: 122, nerveId: "common-peroneal" },

    { id: "mpl", label: "Medial plantar", x: 46, y: 396, shape: "branch", nerveId: "medial-plantar" },
    { id: "lpl", label: "Lateral plantar", x: 148, y: 396, shape: "branch", nerveId: "lateral-plantar" },
    { id: "calc", label: "M. kalkaneal", x: 232, y: 396, shape: "branch", nerveId: "medial-calcaneal" },
    {
      id: "spn",
      label: "Yüzeyel peroneal",
      x: 336,
      y: 396,
      shape: "branch",
      nerveId: "superficial-peroneal",
      anchor: "end",
    },
    { id: "sur", label: "Sural", x: 120, y: 446, shape: "branch", nerveId: "sural" },
    { id: "dpe", label: "Derin peroneal", x: 258, y: 446, shape: "branch", nerveId: "deep-peroneal" },
  ],
  edges: [
    { from: "l4", to: "plexus" },
    { from: "l5", to: "plexus" },
    { from: "s1", to: "plexus" },
    { from: "s2", to: "plexus" },
    { from: "s3", to: "plexus" },
    { from: "s4", to: "plexus" },

    { from: "plexus", to: "sgn" },
    { from: "plexus", to: "ign" },
    { from: "plexus", to: "pfc" },
    { from: "plexus", to: "sci" },
    { from: "plexus", to: "pud" },

    { from: "sci", to: "ham" },
    { from: "sci", to: "knee-art" },
    { from: "sci", to: "tib" },
    { from: "sci", to: "cpn" },
    { from: "pud", to: "dpn" },

    { from: "tib", to: "mpl" },
    { from: "tib", to: "lpl" },
    { from: "tib", to: "calc" },
    // Sural sinir iki kaynaktan beslenir; bu yüzden tek bir dalın bloğu onu
    // ancak kısmen tutar.
    { from: "tib", to: "sur" },
    { from: "cpn", to: "sur" },
    { from: "cpn", to: "spn" },
    { from: "cpn", to: "dpe" },
  ],
  approaches: [
    {
      techniqueId: "caudal",
      label: "Kaudal",
      y: 56,
      caption:
        "Sakral hiatustan kök düzeyi: pleksusun tamamı iki taraflı olarak kapsanır. Hacim arttıkça lomber seviyelere de yayılır.",
    },
    {
      techniqueId: "sciatic-subgluteal",
      label: "Subgluteal siyatik",
      y: 178,
      caption:
        "Hamstring dalları henüz ayrılmamıştır: diz fleksiyonu da tutulur. Uyluk arka yüzü cildi (posterior femoral kutanöz) bu düzeyde ayrı seyreder ve güvenilir biçimde kapsanmaz.",
    },
    {
      techniqueId: "sciatic-popliteal",
      label: "Popliteal siyatik",
      y: 292,
      caption:
        "Hamstring ve diz artiküler dalları bu noktanın proksimalinde ayrılmıştır; diz fleksiyonu korunur. Bacağın iç yüzü safen sinirin (lomber pleksus) alanıdır, kapsanmaz.",
    },
    {
      techniqueId: "ankle-block",
      label: "Ayak bileği",
      y: 362,
      caption:
        "Beş sinirin ayak bileği düzeyindeki uç dalları. Safen sinir de bloklanır ama o lomber pleksustandır — bu şemada görünmez.",
    },
    {
      techniqueId: "ipack",
      label: "IPACK",
      markNodes: ["knee-art"],
      caption:
        "Yalnızca diz arka kapsülünün duyusal dalları. Tibial ve peroneal gövdeler korunduğu için ayak hareketi ve düşme muayenesi bozulmaz.",
    },
    {
      techniqueId: "pudendal",
      label: "Pudendal",
      markNodes: ["pud"],
      caption:
        "Perine ve dış genital bölge. Doğum analjezisinde ve anorektal cerrahide kullanılır; alt ekstremite kapsanmaz.",
    },
    {
      techniqueId: "penile",
      label: "Dorsal penil",
      markNodes: ["dpn"],
      caption:
        "Pudendal sinirin uç dalı. Sünnette tek başına yeterlidir; perinenin geri kalanı kapsanmaz.",
    },
  ],
  lessons: [
    {
      title: "Subgluteal ile popliteal arasındaki fark hamstringlerdir.",
      detail:
        "Hamstring motor dalları siyatikten uylukta ayrılır. Subgluteal blok onları da tutar (diz fleksiyonu gider), popliteal blok tutmaz.",
    },
    {
      title: "Bacağın iç yüzü sakral pleksusa ait değildir.",
      detail:
        "Safen sinir femoralin dalıdır. Ayak bileği ve diz altı cerrahisinde siyatik blok tek başına medial bölgeyi açık bırakır; safen/adduktor kanal eklenir.",
    },
    {
      title: "Sural sinir iki kaynaktan beslenir.",
      detail:
        "Tibial ve kommon peroneal dallarının birleşimidir. Yalnızca birinin bloklandığı durumlarda kısmi kalır — şemada kesikli kenarla görünür.",
    },
  ],
};

export const PLEXUS_DIAGRAMS: Record<PlexusId, PlexusDiagram> = {
  brachial: BRACHIAL,
  lumbar: LUMBAR,
  sacral: SACRAL,
};

export const PLEXUS_ORDER: PlexusId[] = ["brachial", "lumbar", "sacral"];

/** Blok kartında şemayı tetikleyen teknikler. */
export const PLEXUS_TECHNIQUE_IDS = new Set(
  PLEXUS_ORDER.flatMap((id) => PLEXUS_DIAGRAMS[id].approaches.map((a) => a.techniqueId))
);

export function diagramForTechnique(techniqueId: string): PlexusDiagram | undefined {
  return PLEXUS_ORDER.map((id) => PLEXUS_DIAGRAMS[id]).find((d) =>
    d.approaches.some((a) => a.techniqueId === techniqueId)
  );
}

export function approachFor(
  diagram: PlexusDiagram,
  techniqueId: string
): PlexusApproach | undefined {
  return diagram.approaches.find((a) => a.techniqueId === techniqueId);
}
