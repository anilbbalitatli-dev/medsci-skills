/**
 * Brakiyal pleksusun şeması ve yaklaşımların hangi seviyede çalıştığı.
 *
 * Kapsama listesi "interskalen alt trunkusu genellikle korur" diyebiliyor ama
 * bunu *gösteremiyordu*. Oysa üst ekstremite bloklarının tamamı tek bir soruya
 * dayanır: iğne pleksusun neresinde? Kök, trunkus, kord ve uç sinir sırası
 * bilindiğinde interskalenin neden ulnar tarafı açık bıraktığı, infraklaviküler
 * bloğun neden suprascapular siniri kaçırdığı kendiliğinden görünür.
 *
 * Koordinatlar `nerves.ts` çizgesinden türetilemez: o çizge neyin neyi
 * blokladığını bilir, nerede durduğunu bilmez. Kökler (C5–T1) ve divizyonlar da
 * orada yoktur — hiçbir teknik tek bir divizyonu bloklamadığı için çizgeye
 * girmeleri gereksiz gürültü olurdu. Burada çizim için varlar ve renklerini
 * besledikleri trunkustan alırlar (`statusVia`).
 *
 * Renk şu anlama gelir: **bloğun ulaştığı yapı**. Kökler kendi başlarına hedef
 * olmadıkları için rengi besledikleri trunkustan alır — supraklaviküler blokta
 * C8 renklenir (alt trunkus hedeftir), infraklaviküler blokta renksiz kalır
 * (iğne kord düzeyinde, yani kökün distalindedir). Seviye çizgisi iğnenin
 * nerede olduğunu ayrıca gösterir.
 */

export type PlexusColumn = "root" | "trunk" | "division" | "cord" | "branch";

export interface PlexusNode {
  id: string;
  label: string;
  x: number;
  y: number;
  column: PlexusColumn;
  /** Çizgedeki karşılığı; rengi buradan gelir. */
  nerveId?: string;
  /** Çizgede karşılığı olmayan düğümler (kök, divizyon) rengi buradan alır. */
  statusVia?: string;
  /** Etiketin düğüme göre yeri; dar yerlerde metni taşımak için. */
  anchor?: "middle" | "start" | "end";
  /** Etiket düğümün altında değil üstünde çizilir. */
  labelAbove?: boolean;
  /** Etiket düğümün yanında, aynı hizada çizilir. */
  labelBeside?: boolean;
}

export interface PlexusEdge {
  from: string;
  to: string;
}

export interface PlexusApproach {
  techniqueId: string;
  label: string;
  /** Seviye çizgisinin y'si; uç sinir düzeyinden distaldeki bloklarda yok. */
  y?: number;
  /** Çizgi yerine tek bir düğümü işaretleyen bloklar (suprascapular gibi). */
  markNode?: string;
  caption: string;
}

export const PLEXUS_VIEWBOX = { width: 320, height: 400 };

export const PLEXUS_NODES: PlexusNode[] = [
  // ---- Kökler (ventral rami C5–T1) ----
  { id: "c5", label: "C5", x: 32, y: 26, column: "root", statusVia: "upper-trunk" },
  { id: "c6", label: "C6", x: 86, y: 26, column: "root", statusVia: "upper-trunk" },
  { id: "c7", label: "C7", x: 140, y: 26, column: "root", statusVia: "middle-trunk" },
  { id: "c8", label: "C8", x: 194, y: 26, column: "root", statusVia: "lower-trunk" },
  { id: "t1", label: "T1", x: 248, y: 26, column: "root", statusVia: "lower-trunk" },

  // ---- Trunkuslar ----
  { id: "upper", label: "Üst", x: 59, y: 92, column: "trunk", nerveId: "upper-trunk" },
  { id: "middle", label: "Orta", x: 140, y: 92, column: "trunk", nerveId: "middle-trunk" },
  { id: "lower", label: "Alt", x: 221, y: 92, column: "trunk", nerveId: "lower-trunk" },

  // Suprascapular sinir trunkustan ayrılır — kordların proksimalinde. Şemadaki
  // yeri, infraklaviküler bloğun onu neden kaçırdığının cevabıdır.
  {
    id: "suprascapular",
    label: "Suprascapular",
    x: 20,
    y: 126,
    column: "branch",
    nerveId: "suprascapular",
    anchor: "start",
    labelBeside: true,
  },

  // ---- Divizyonlar (her trunkus ön ve arka olarak ikiye ayrılır) ----
  { id: "upper-ant", label: "ön", x: 38, y: 182, column: "division", statusVia: "upper-trunk" },
  { id: "upper-post", label: "arka", x: 80, y: 182, column: "division", statusVia: "upper-trunk" },
  { id: "middle-ant", label: "ön", x: 119, y: 182, column: "division", statusVia: "middle-trunk" },
  { id: "middle-post", label: "arka", x: 161, y: 182, column: "division", statusVia: "middle-trunk" },
  { id: "lower-ant", label: "ön", x: 200, y: 182, column: "division", statusVia: "lower-trunk" },
  { id: "lower-post", label: "arka", x: 242, y: 182, column: "division", statusVia: "lower-trunk" },

  // ---- Kordlar ----
  { id: "lateral", label: "Lateral", x: 59, y: 246, column: "cord", nerveId: "lateral-cord" },
  { id: "posterior", label: "Posterior", x: 140, y: 246, column: "cord", nerveId: "posterior-cord" },
  { id: "medial", label: "Medial", x: 221, y: 246, column: "cord", nerveId: "medial-cord" },

  // ---- Uç sinirler ----
  { id: "mc", label: "Muskülokut.", x: 40, y: 320, column: "branch", nerveId: "musculocutaneous" },
  { id: "axn", label: "Aksiller sinir", x: 122, y: 320, column: "branch", nerveId: "axillary-nerve" },
  { id: "rad", label: "Radial", x: 204, y: 320, column: "branch", nerveId: "radial" },
  { id: "med", label: "Median", x: 62, y: 372, column: "branch", nerveId: "median" },
  { id: "uln", label: "Ulnar", x: 152, y: 372, column: "branch", nerveId: "ulnar" },
  {
    id: "mabc",
    label: "M. antebrakiyal kut.",
    x: 248,
    y: 372,
    column: "branch",
    nerveId: "medial-antebrachial-cutaneous",
    anchor: "end",
  },
];

export const PLEXUS_EDGES: PlexusEdge[] = [
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

  // Ön divizyonlar fleksör tarafa (lateral ve medial kord), arka divizyonların
  // üçü birden posterior korda gider.
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
];

/** Şemada gösterilebilen yaklaşımlar, proksimalden distale. */
export const PLEXUS_APPROACHES: PlexusApproach[] = [
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
    markNode: "suprascapular",
    caption:
      "Trunkustan ayrılan tek bir dal hedeflenir: omuz kapsülünün büyük bölümü kapsanır, kol motor gücü korunur.",
  },
  {
    techniqueId: "axillary-nerve",
    label: "Aksiller sinir",
    markNode: "axn",
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
];

export function approachFor(techniqueId: string): PlexusApproach | undefined {
  return PLEXUS_APPROACHES.find((a) => a.techniqueId === techniqueId);
}

/** Şemanın anlattığı bloklar — blok kartında şemayı bu liste tetikler. */
export const PLEXUS_TECHNIQUE_IDS = new Set(PLEXUS_APPROACHES.map((a) => a.techniqueId));
