import { DermatomeLevel, PosteriorLevel } from "./dermatome-figure";

/**
 * Peripheral nerve anatomy as a directed acyclic graph.
 *
 * The point of modelling nerves rather than "coverage" text is that the
 * clinically important facts about a combination are *relational*: the
 * saphenous nerve is a terminal branch of the femoral, so blocking the femoral
 * has already blocked the saphenous and adding a saphenous block buys nothing.
 * That kind of statement should fall out of the anatomy, not be hand-written
 * once per pair — there are hundreds of pairs and they would drift.
 *
 * So: each nerve names the structures it arises from, and blocking a nerve is
 * taken to block everything distal to it. A nerve with several parents (the
 * radial nerve draws from all three trunks) is only *fully* blocked when every
 * parent is blocked; block one trunk and it comes out partial, which is exactly
 * why an interscalene injection leaves the hand working.
 *
 * Territories are the usual textbook descriptions. Real innervation varies
 * between people and adjacent nerves overlap at every border, so treat these as
 * the teaching version, not a map of the patient in front of you.
 */
export type NerveModality = "sensory" | "motor" | "mixed";

export interface Nerve {
  id: string;
  name: string;
  /**
   * Structures this nerve arises from. Blocking any ancestor blocks this nerve;
   * when there are several parents, all of them must be blocked for the block
   * to be complete. Empty for plexus roots and spinal nerves.
   */
  parents?: string[];
  /** Contributing spinal segments, e.g. ["L2", "L3", "L4"]. */
  roots: string[];
  modality: NerveModality;
  /** Sensory territory, if the nerve carries sensation. */
  sensory?: string;
  /** Muscles supplied and the functional consequence of blocking them. */
  motor?: string;
  /** Segments this nerve alone accounts for on the dermatome figures. */
  levels?: (DermatomeLevel | PosteriorLevel)[];
  /**
   * Set on structures that are conduits rather than named nerves (plexus,
   * trunks, cords). They drive the graph but are noise in a coverage list.
   */
  structural?: boolean;
}

export const NERVES: Nerve[] = [
  // ---- Servikal ---------------------------------------------------------
  {
    id: "cervical-plexus",
    name: "Servikal Pleksus",
    roots: ["C1", "C2", "C3", "C4"],
    modality: "mixed",
    structural: true,
  },
  {
    id: "cervical-plexus-superficial",
    name: "Yüzeyel Servikal Pleksus Dalları",
    parents: ["cervical-plexus"],
    roots: ["C2", "C3", "C4"],
    modality: "sensory",
    sensory: "Anterolateral boyun, kulak arkası ve altı, klavikula üstü cilt",
    levels: ["C2", "C3", "C4"],
  },
  {
    id: "phrenic",
    name: "Frenik Sinir",
    parents: ["cervical-plexus"],
    roots: ["C3", "C4", "C5"],
    modality: "motor",
    motor: "Diyafram — bloke olursa o taraf hemidiyafram felç olur, solunum rezervi düşer",
  },

  // ---- Brakiyal pleksus -------------------------------------------------
  {
    id: "brachial-plexus",
    name: "Brakiyal Pleksus",
    roots: ["C5", "C6", "C7", "C8", "T1"],
    modality: "mixed",
    structural: true,
  },
  {
    id: "upper-trunk",
    name: "Üst Trunkus",
    parents: ["brachial-plexus"],
    roots: ["C5", "C6"],
    modality: "mixed",
    structural: true,
  },
  {
    id: "middle-trunk",
    name: "Orta Trunkus",
    parents: ["brachial-plexus"],
    roots: ["C7"],
    modality: "mixed",
    structural: true,
  },
  {
    id: "lower-trunk",
    name: "Alt Trunkus",
    parents: ["brachial-plexus"],
    roots: ["C8", "T1"],
    modality: "mixed",
    structural: true,
  },
  {
    id: "lateral-cord",
    name: "Lateral Kord",
    parents: ["upper-trunk", "middle-trunk"],
    roots: ["C5", "C6", "C7"],
    modality: "mixed",
    structural: true,
  },
  {
    id: "posterior-cord",
    name: "Posterior Kord",
    parents: ["upper-trunk", "middle-trunk", "lower-trunk"],
    roots: ["C5", "C6", "C7", "C8", "T1"],
    modality: "mixed",
    structural: true,
  },
  {
    id: "medial-cord",
    name: "Medial Kord",
    parents: ["lower-trunk"],
    roots: ["C8", "T1"],
    modality: "mixed",
    structural: true,
  },
  {
    id: "suprascapular",
    name: "Suprascapular Sinir",
    parents: ["upper-trunk"],
    roots: ["C5", "C6"],
    modality: "mixed",
    sensory: "Omuz ekleminin posterosuperior kapsülü (eklem duyusunun ~%70'i)",
    motor: "Supraspinatus, infraspinatus — abduksiyon başlangıcı ve dış rotasyon zayıflar",
    levels: ["C5", "C6"],
  },
  {
    id: "axillary-nerve",
    name: "Aksiller Sinir",
    parents: ["posterior-cord"],
    roots: ["C5", "C6"],
    modality: "mixed",
    sensory: "Omuz lateral yüzü (deltoid üzeri 'rozet' alanı), eklem kapsülünün ön-alt kısmı",
    motor: "Deltoid, teres minor — omuz abduksiyonu zayıflar",
    levels: ["C5", "C6"],
  },
  {
    id: "musculocutaneous",
    name: "Muskülokutanöz Sinir",
    parents: ["lateral-cord"],
    roots: ["C5", "C6", "C7"],
    modality: "mixed",
    sensory: "Önkolun lateral yüzü (lateral antebrakiyal kutanöz dal)",
    motor: "Biceps, brachialis, coracobrachialis — dirsek fleksiyonu zayıflar",
    levels: ["C5", "C6"],
  },
  {
    id: "radial",
    name: "Radial Sinir",
    parents: ["posterior-cord"],
    roots: ["C5", "C6", "C7", "C8", "T1"],
    modality: "mixed",
    sensory: "Kol ve önkolun arka yüzü, el sırtının radial yarısı",
    motor: "Triceps, bilek ve parmak ekstansörleri — 'düşük el'",
    levels: ["C6", "C7", "C8"],
  },
  {
    id: "median",
    name: "Median Sinir",
    parents: ["lateral-cord", "medial-cord"],
    roots: ["C6", "C7", "C8", "T1"],
    modality: "mixed",
    sensory: "Avuç içi radial tarafı, 1.–3. parmaklar ve 4. parmağın radial yarısı",
    motor: "Önkol fleksörlerinin çoğu, tenar kaslar — kavrama ve başparmak oppozisyonu zayıflar",
    levels: ["C6", "C7", "C8"],
  },
  {
    id: "ulnar",
    name: "Ulnar Sinir",
    parents: ["medial-cord"],
    roots: ["C8", "T1"],
    modality: "mixed",
    sensory: "El sırtı ve avuç içinin ulnar tarafı, 5. parmak ve 4. parmağın ulnar yarısı",
    motor: "El içi küçük kaslar, fleksör carpi ulnaris — parmakların ince hareketleri zayıflar",
    levels: ["C8", "T1"],
  },
  {
    id: "medial-antebrachial-cutaneous",
    name: "Medial Antebrakiyal Kutanöz Sinir",
    parents: ["medial-cord"],
    roots: ["C8", "T1"],
    modality: "sensory",
    sensory: "Önkolun medial yüzü",
    levels: ["C8", "T1"],
  },
  {
    id: "medial-brachial-cutaneous",
    name: "Medial Brakiyal Kutanöz Sinir",
    parents: ["medial-cord"],
    roots: ["T1"],
    modality: "sensory",
    sensory: "Kolun medial yüzü",
    levels: ["T1"],
  },
  {
    id: "long-thoracic",
    name: "Uzun Torasik Sinir",
    parents: ["brachial-plexus"],
    roots: ["C5", "C6", "C7"],
    modality: "motor",
    motor: "Serratus anterior — skapula stabilizasyonu bozulur ('kanat skapula')",
  },
  {
    id: "thoracodorsal",
    name: "Torakodorsal Sinir",
    parents: ["posterior-cord"],
    roots: ["C6", "C7", "C8"],
    modality: "motor",
    motor: "Latissimus dorsi — kol adduksiyonu/iç rotasyonu zayıflar",
  },
  {
    id: "lateral-pectoral",
    name: "Lateral Pektoral Sinir",
    parents: ["lateral-cord"],
    roots: ["C5", "C6", "C7"],
    modality: "motor",
    motor: "Pectoralis major — fonksiyonel önemi sınırlı",
  },
  {
    id: "medial-pectoral",
    name: "Medial Pektoral Sinir",
    parents: ["medial-cord"],
    roots: ["C8", "T1"],
    modality: "motor",
    motor: "Pectoralis major ve minor — fonksiyonel önemi sınırlı",
  },

  // ---- Torakal ----------------------------------------------------------
  /**
   * Thoracic segments are modelled as one generic spinal nerve rather than
   * twelve, because every technique here is quoted as a level range and the
   * interesting relationships (paravertebral vs. ESP vs. intercostal) are about
   * *where along the nerve* the injection sits, not which number it is.
   */
  {
    id: "thoracic-spinal-nerve",
    name: "Torasik Spinal Sinir (seçilen seviyeler)",
    roots: ["T1", "T12"],
    modality: "mixed",
    structural: true,
  },
  {
    id: "thoracic-dorsal-ramus",
    name: "Torasik Dorsal Ramus",
    parents: ["thoracic-spinal-nerve"],
    roots: ["T1", "T12"],
    modality: "mixed",
    sensory: "Sırtın orta hatta yakın cildi",
    motor: "Paraspinal kaslar",
  },
  {
    id: "intercostal",
    name: "İnterkostal Sinir (torasik ventral ramus)",
    parents: ["thoracic-spinal-nerve"],
    roots: ["T1", "T11"],
    modality: "mixed",
    sensory: "İlgili seviyenin göğüs/karın duvarı bandı",
    motor: "İnterkostal kaslar — seviye başına solunum katkısı küçük, çok seviyede toplanır",
  },
  {
    id: "intercostal-lateral-cutaneous",
    name: "Lateral Kutanöz Dal",
    parents: ["intercostal"],
    roots: ["T2", "T11"],
    modality: "sensory",
    sensory: "Göğüs/karın duvarının yan yüzü",
  },
  {
    id: "intercostal-anterior-cutaneous",
    name: "Anterior Kutanöz Dal",
    parents: ["intercostal"],
    roots: ["T2", "T11"],
    modality: "sensory",
    sensory: "Orta hatta yakın ön göğüs/karın duvarı (parasternal, periumbilikal)",
  },
  {
    /**
     * Anatomically the lateral cutaneous branch of T2, but deliberately left
     * without a parent: the generic thoracic nerve above stands for "whatever
     * levels this technique is quoted at", and every trunk block in the
     * catalogue is quoted well below T2. Hanging this off it would have a TAP
     * block at T10–L1 claiming to anaesthetise the axilla.
     */
    id: "intercostobrachial",
    name: "İnterkostobrakiyal Sinir",
    roots: ["T2"],
    modality: "sensory",
    sensory: "Aksilla ve kolun medial-proksimal yüzü — turnike ağrısının kaynağı",
    levels: ["T2"],
  },
  {
    id: "thoracic-sympathetic-chain",
    name: "Torasik Sempatik Zincir",
    parents: ["thoracic-spinal-nerve"],
    roots: ["T1", "T12"],
    modality: "mixed",
    motor: "Sempatik blokaj — ilgili tarafta vazodilatasyon; yüksek seviyede hipotansiyon",
  },
  {
    id: "subcostal",
    name: "Subkostal Sinir",
    parents: ["thoracic-spinal-nerve"],
    roots: ["T12"],
    modality: "mixed",
    sensory: "Karın alt duvarı, kalça üstü cilt",
    levels: ["T12"],
  },

  // ---- Lomber pleksus ---------------------------------------------------
  {
    id: "lumbar-spinal-nerve",
    name: "Lomber Spinal Sinir",
    roots: ["L1", "L5"],
    modality: "mixed",
    structural: true,
  },
  {
    id: "lumbar-dorsal-ramus",
    name: "Lomber Dorsal Ramus",
    parents: ["lumbar-spinal-nerve"],
    roots: ["L1", "L5"],
    modality: "mixed",
    sensory: "Bel bölgesinin orta hatta yakın cildi ve faset eklemleri",
    motor: "Lomber paraspinal kaslar",
  },
  {
    id: "lumbar-plexus",
    name: "Lomber Pleksus",
    parents: ["lumbar-spinal-nerve"],
    roots: ["L1", "L2", "L3", "L4"],
    modality: "mixed",
    structural: true,
  },
  {
    id: "iliohypogastric",
    name: "İliohipogastrik Sinir",
    parents: ["lumbar-plexus"],
    roots: ["L1"],
    modality: "sensory",
    sensory: "Karın alt duvarı, suprapubik bölge ve kalçanın üst-yan cildi",
    levels: ["L1"],
  },
  {
    id: "ilioinguinal",
    name: "İlioinguinal Sinir",
    parents: ["lumbar-plexus"],
    roots: ["L1"],
    modality: "sensory",
    sensory: "Kasık kıvrımı, skrotum/labium ön kısmı, uyluk üst-iç cildi",
    levels: ["L1"],
  },
  {
    id: "genitofemoral",
    name: "Genitofemoral Sinir",
    parents: ["lumbar-plexus"],
    roots: ["L1", "L2"],
    modality: "mixed",
    sensory: "Skrotum/labium (genital dal), femoral üçgen üstü cilt (femoral dal)",
    levels: ["L1", "L2"],
  },
  {
    id: "lateral-femoral-cutaneous",
    name: "Lateral Femoral Kutanöz Sinir",
    parents: ["lumbar-plexus"],
    roots: ["L2", "L3"],
    modality: "sensory",
    sensory: "Uyluğun lateral yüzü",
    levels: ["L2", "L3"],
  },
  {
    id: "femoral",
    name: "Femoral Sinir",
    parents: ["lumbar-plexus"],
    roots: ["L2", "L3", "L4"],
    modality: "mixed",
    sensory: "Uyluk ön yüzü, diz medial kısmı ve bacağın iç yüzü (dalları aracılığıyla)",
    motor: "Kuadriseps — diz ekstansiyonu; blokta hasta bacağını düz tutamaz",
    levels: ["L2", "L3", "L4"],
  },
  {
    id: "anterior-femoral-cutaneous",
    name: "Anterior Femoral Kutanöz Dallar",
    parents: ["femoral"],
    roots: ["L2", "L3"],
    modality: "sensory",
    sensory: "Uyluğun ön yüzü",
    levels: ["L2", "L3"],
  },
  {
    id: "nerve-to-quadriceps",
    name: "Kuadriseps Motor Dalları",
    parents: ["femoral"],
    roots: ["L2", "L3", "L4"],
    modality: "motor",
    motor: "Rectus femoris, vastus lateralis/intermedius — diz ekstansiyonu belirgin zayıflar, düşme riski",
  },
  {
    id: "nerve-to-vastus-medialis",
    name: "Vastus Medialis Dalı",
    parents: ["femoral"],
    roots: ["L3", "L4"],
    modality: "motor",
    motor:
      "Vastus medialis — adduktor kanaldan geçtiği için ACB'de kısmen tutulur; diz ekstansiyonuna katkısı sınırlıdır",
  },
  {
    id: "saphenous",
    name: "Safen Sinir",
    parents: ["femoral"],
    roots: ["L3", "L4"],
    modality: "sensory",
    sensory: "Bacağın medial yüzü, medial malleol, ayağın iç kenarı; diz medial cildi",
    levels: ["L3", "L4"],
  },
  {
    id: "femoral-articular-hip",
    name: "Femoral Kalça Artiküler Dalları",
    parents: ["femoral"],
    roots: ["L2", "L3", "L4"],
    modality: "sensory",
    sensory: "Kalça ekleminin ön kapsülü (kapsül duyusunun büyük kısmı)",
  },
  {
    id: "obturator",
    name: "Obturator Sinir",
    parents: ["lumbar-plexus"],
    roots: ["L2", "L3", "L4"],
    modality: "mixed",
    sensory: "Uyluğun medial yüzü (değişken), diz ekleminin posteromedial kapsülü",
    motor: "Adduktor kaslar — bacak adduksiyonu zayıflar",
    levels: ["L2", "L3", "L4"],
  },
  {
    id: "obturator-articular-hip",
    name: "Obturator Kalça Artiküler Dalları",
    parents: ["obturator"],
    roots: ["L2", "L3", "L4"],
    modality: "sensory",
    sensory: "Kalça ekleminin alt-ön kapsülü",
  },
  {
    id: "accessory-obturator",
    name: "Aksesuar Obturator Sinir",
    parents: ["lumbar-plexus"],
    roots: ["L3", "L4"],
    modality: "sensory",
    sensory: "Kalça ön kapsülüne katkı — yalnızca kişilerin ~%10-20'sinde bulunur",
  },

  // ---- Sakral pleksus ---------------------------------------------------
  {
    id: "sacral-plexus",
    name: "Sakral Pleksus",
    roots: ["L4", "L5", "S1", "S2", "S3", "S4"],
    modality: "mixed",
    structural: true,
  },
  {
    id: "superior-gluteal",
    name: "Superior Gluteal Sinir",
    parents: ["sacral-plexus"],
    roots: ["L4", "L5", "S1"],
    modality: "motor",
    motor: "Gluteus medius/minimus — kalça abduksiyonu, tek ayak üstünde denge zayıflar",
  },
  {
    id: "inferior-gluteal",
    name: "İnferior Gluteal Sinir",
    parents: ["sacral-plexus"],
    roots: ["L5", "S1", "S2"],
    modality: "motor",
    motor: "Gluteus maximus — kalçadan kalkma (sandalyeden doğrulma) zayıflar",
  },
  {
    id: "posterior-femoral-cutaneous",
    name: "Posterior Femoral Kutanöz Sinir",
    parents: ["sacral-plexus"],
    roots: ["S1", "S2", "S3"],
    modality: "sensory",
    sensory: "Uyluğun arka yüzü, gluteal kıvrım altı",
    levels: ["S1", "S2", "S3"],
  },
  {
    id: "sciatic",
    name: "Siyatik Sinir",
    parents: ["sacral-plexus"],
    roots: ["L4", "L5", "S1", "S2", "S3"],
    modality: "mixed",
    sensory: "Diz altındaki bacağın tamamı (safen alanı hariç) ve ayak",
    motor: "Hamstringler ve diz altındaki tüm kaslar — ayak hiç hareket etmez",
    levels: ["L4", "L5", "S1", "S2"],
  },
  {
    id: "sciatic-articular-knee",
    name: "Siyatik Diz Artiküler Dalları",
    parents: ["sciatic"],
    roots: ["L4", "L5", "S1", "S2"],
    modality: "sensory",
    sensory: "Diz ekleminin arka kapsülü — IPACK'in hedefi",
  },
  {
    id: "nerve-to-hamstrings",
    name: "Hamstring Motor Dalları",
    parents: ["sciatic"],
    roots: ["L5", "S1", "S2"],
    modality: "motor",
    motor: "Biceps femoris, semitendinosus, semimembranosus — diz fleksiyonu zayıflar",
  },
  {
    id: "tibial",
    name: "Tibial Sinir",
    parents: ["sciatic"],
    roots: ["L4", "L5", "S1", "S2", "S3"],
    modality: "mixed",
    sensory: "Bacak arka yüzü (dallar aracılığıyla), ayak tabanı",
    motor: "Gastroknemius, soleus, derin fleksörler — plantar fleksiyon kaybolur",
    levels: ["S1", "S2"],
  },
  {
    id: "medial-plantar",
    name: "Medial Plantar Sinir",
    parents: ["tibial"],
    roots: ["S1", "S2"],
    modality: "mixed",
    sensory: "Ayak tabanının iç kısmı ve ilk üç parmak tabanı",
  },
  {
    id: "lateral-plantar",
    name: "Lateral Plantar Sinir",
    parents: ["tibial"],
    roots: ["S1", "S2", "S3"],
    modality: "mixed",
    sensory: "Ayak tabanının dış kısmı ve 4.–5. parmak tabanı",
  },
  {
    id: "medial-calcaneal",
    name: "Medial Kalkaneal Dal",
    parents: ["tibial"],
    roots: ["S1", "S2"],
    modality: "sensory",
    sensory: "Topuk cildi",
  },
  {
    id: "common-peroneal",
    name: "Kommon Peroneal Sinir",
    parents: ["sciatic"],
    roots: ["L4", "L5", "S1", "S2"],
    modality: "mixed",
    sensory: "Bacağın ön-dış yüzü ve ayak sırtı (dalları aracılığıyla)",
    motor: "Dorsifleksiyon ve eversiyon — blokta 'düşük ayak'",
    levels: ["L4", "L5", "S1"],
  },
  {
    id: "superficial-peroneal",
    name: "Yüzeyel Peroneal Sinir",
    parents: ["common-peroneal"],
    roots: ["L4", "L5", "S1"],
    modality: "mixed",
    sensory: "Ayak sırtının büyük kısmı, bacak alt-dış yüzü",
    motor: "Peroneus longus/brevis — ayak eversiyonu zayıflar",
    levels: ["L4", "L5", "S1"],
  },
  {
    id: "deep-peroneal",
    name: "Derin Peroneal Sinir",
    parents: ["common-peroneal"],
    roots: ["L4", "L5"],
    modality: "mixed",
    sensory: "1.–2. parmak arası cilt bandı (dar ama karakteristik alan)",
    motor: "Tibialis anterior, parmak ekstansörleri — dorsifleksiyon kaybolur, 'düşük ayak'",
    levels: ["L4", "L5"],
  },
  {
    id: "sural",
    name: "Sural Sinir",
    parents: ["tibial", "common-peroneal"],
    roots: ["S1", "S2"],
    modality: "sensory",
    sensory: "Bacağın posterolateral alt yüzü, ayağın dış kenarı, 5. parmak",
    levels: ["S1", "S2"],
  },
  {
    id: "pudendal",
    name: "Pudendal Sinir",
    parents: ["sacral-plexus"],
    roots: ["S2", "S3", "S4"],
    modality: "mixed",
    sensory: "Perine, dış genital bölge, anal kanal",
    motor: "Perine kasları, eksternal sfinkter",
    levels: ["S2", "S3"],
  },
  {
    id: "dorsal-nerve-of-penis",
    name: "Dorsal Penil Sinir",
    parents: ["pudendal"],
    roots: ["S2", "S3", "S4"],
    modality: "sensory",
    sensory: "Penis derisi ve glans",
    levels: ["S2", "S3"],
  },
];

const BY_ID = new Map(NERVES.map((n) => [n.id, n]));

export function nerveById(id: string): Nerve | undefined {
  return BY_ID.get(id);
}

/**
 * Every nerve lying distal to `id`, itself included. Blocking a nerve blocks
 * everything it goes on to become, which is what makes "the saphenous is
 * already in there" computable rather than hand-written.
 */
export function descendantsOf(id: string): Set<string> {
  const out = new Set<string>();
  const walk = (current: string) => {
    if (out.has(current)) return;
    out.add(current);
    for (const n of NERVES) {
      if (n.parents?.includes(current)) walk(n.id);
    }
  };
  walk(id);
  return out;
}

/** Spinal segments a nerve carries, expanded from the stored root list. */
export function rootsLabel(nerve: Nerve): string {
  if (nerve.roots.length === 0) return "";
  if (nerve.roots.length === 1) return nerve.roots[0];
  return `${nerve.roots[0]}–${nerve.roots[nerve.roots.length - 1]}`;
}
