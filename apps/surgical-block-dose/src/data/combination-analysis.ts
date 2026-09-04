import { Nerve, NERVES, nerveById } from "./nerves";
import { Reliability, TECHNIQUE_NERVES } from "./technique-nerves";
import { Technique, techniqueById } from "./techniques";

/**
 * Works out what a set of blocks actually covers, nerve by nerve, and which of
 * them are not pulling their weight.
 *
 * The central question this answers is the one that makes combinations go
 * wrong: adding a second block feels like adding coverage, but if the second
 * block's nerves are already inside the first one's territory it adds only
 * drug. Femoral plus saphenous is the clean example — the saphenous nerve is a
 * terminal branch of the femoral, so the second injection buys nothing and
 * spends part of the dose budget.
 *
 * Coverage propagates down the nerve graph: block a structure and everything
 * distal to it goes too. Where a nerve draws from several parents and only some
 * are blocked, it comes out partial rather than covered — that is how the
 * interscalene block ends up correctly shown as sparing the ulnar side.
 */
export type CoverageStatus = "full" | "partial";

export interface CoverageSource {
  techniqueId: string;
  techniqueName: string;
  /** Named as a target, as opposed to reached by being downstream of one. */
  direct: boolean;
  reliability: Reliability;
  /** Blocked as an unavoidable neighbour rather than on purpose. */
  incidental: boolean;
  note?: string;
}

export interface NerveCoverage {
  nerve: Nerve;
  status: CoverageStatus;
  sources: CoverageSource[];
  /** Reached by more than one of the selected blocks. */
  duplicated: boolean;
}

interface Reached {
  status: CoverageStatus;
  direct: boolean;
  reliability: Reliability;
  incidental: boolean;
  note?: string;
}

/**
 * Everything one technique reaches, with each nerve's status resolved.
 *
 * Propagation runs to a fixpoint rather than as a single walk, because a nerve
 * with several parents cannot be judged until every parent has been decided.
 */
export function closureFor(techniqueId: string): Map<string, Reached> {
  const map = TECHNIQUE_NERVES[techniqueId];
  const out = new Map<string, Reached>();
  if (!map) return out;

  for (const t of map.targets) {
    out.set(t.nerve, {
      status: "full",
      direct: true,
      reliability: t.reliability,
      incidental: Boolean(t.incidental),
      note: t.note,
    });
  }

  let changed = true;
  while (changed) {
    changed = false;
    for (const nerve of NERVES) {
      if (out.has(nerve.id)) continue;
      const parents = nerve.parents ?? [];
      if (parents.length === 0) continue;
      const covered = parents.filter((p) => out.get(p)?.status === "full");
      if (covered.length === 0) continue;

      const from = out.get(covered[0])!;
      out.set(nerve.id, {
        // Fibres that reach this nerve through an unblocked parent are still
        // conducting, so a nerve is only fully blocked when every parent is.
        status: covered.length === parents.length ? "full" : "partial",
        direct: false,
        reliability: from.reliability,
        incidental: from.incidental,
      });
      changed = true;
    }
  }

  for (const missed of map.commonlyMissed ?? []) {
    const entry = out.get(missed);
    if (entry && !entry.direct) {
      out.set(missed, { ...entry, status: "partial", reliability: "variable" });
    }
  }

  return out;
}

export type FindingSeverity = "avoid" | "redundant" | "caution" | "complementary";

export interface Finding {
  id: string;
  severity: FindingSeverity;
  title: string;
  detail: string;
  /** Techniques the finding is about, for highlighting in the UI. */
  techniqueIds: string[];
}

interface InteractionRule {
  id: string;
  /** Fires when every listed technique is selected. */
  when: string[];
  severity: FindingSeverity;
  title: string;
  detail: string;
}

/**
 * Any two of these are different ways in to the same plexus, so combining them
 * doubles the dose without extending the territory.
 */
const BRACHIAL_PLEXUS_APPROACHES = [
  "interscalene",
  "supraclavicular",
  "infraclavicular",
  "axillary-plexus",
];

/**
 * Facts about how techniques are used that the anatomy graph is too coarse to
 * carry. The graph knows which nerves a block reaches; it does not know that a
 * lateral TAP injection spreads unreliably to the midline, or that two
 * approaches to the same plexus are alternatives rather than partners.
 *
 * A `complementary` rule also suppresses the automatic redundancy warning for
 * that pair — clinical practice overrides the graph where the graph is coarser
 * than the practice.
 */
const INTERACTION_RULES: InteractionRule[] = [
  // ---- Aynı yapıya farklı yaklaşımlar ----
  ...BRACHIAL_PLEXUS_APPROACHES.flatMap((a, i) =>
    BRACHIAL_PLEXUS_APPROACHES.slice(i + 1).map((b) => ({
      id: `plexus-${a}-${b}`,
      when: [a, b],
      severity: "avoid" as const,
      title: "Aynı pleksusa iki farklı yaklaşım",
      detail:
        "Her ikisi de brakiyal pleksusu hedefler; yalnızca giriş noktaları farklıdır. Birlikte yapıldığında kapsama genişlemez ama lokal anestezik dozu ikiye katlanır. Biri seçilmelidir.",
    }))
  ),
  {
    id: "interscalene-supraclavicular-phrenic",
    when: ["interscalene", "supraclavicular"],
    severity: "avoid",
    title: "Frenik yükü katlanır",
    detail:
      "Her iki blok da frenik sinire yayılabilir. Aynı tarafta üst üste yapılması hemidiyafram felci olasılığını artırır; iki taraflı uygulama solunum yetmezliğine yol açabileceği için kabul edilmez.",
  },
  {
    id: "spinal-caudal",
    when: ["spinal", "caudal"],
    severity: "avoid",
    title: "İki ayrı nöraksiyel girişim",
    detail:
      "Spinal anestezi zaten sakral kökleri kapsar. Üzerine kaudal blok eklemek ek kapsama sağlamaz, toplam dozu ve nöraksiyel girişim riskini artırır.",
  },
  {
    id: "ivra-combination",
    when: ["ivra"],
    severity: "caution",
    title: "Bier bloğu kombinasyona uygun değildir",
    detail:
      "Turnike erken sönerse tüm doz bir anda sistemik dolaşıma geçer. Bu nedenle IVRA'nın üzerine başka blok eklenmesi, toplam doz sınır içinde görünse bile önerilmez.",
  },

  // ---- Alt ekstremite ----
  {
    id: "femoral-acb",
    when: ["femoral", "acb"],
    severity: "redundant",
    title: "ACB, femoral bloğun içinde kalır",
    detail:
      "Adduktor kanal bloğu safen siniri ve vastus medialis dalını tutar; her ikisi de femoral sinirin dallarıdır ve femoral blokla zaten kapsanır. ACB'nin tek avantajı olan kuadriseps koruması da femoral blok yapılınca ortadan kalkar.",
  },
  {
    id: "femoral-peng",
    when: ["femoral", "peng"],
    severity: "caution",
    title: "PENG'in motor koruma avantajı kaybolur",
    detail:
      "PENG yalnızca kalça kapsülünün artiküler dallarını tutarak kuadriseps gücünü korumak için tercih edilir. Femoral blok eklendiğinde kuadriseps zaten zayıflar; PENG'i seçmenin gerekçesi kalmaz.",
  },
  {
    id: "fascia-iliaca-peng",
    when: ["fascia-iliaca", "peng"],
    severity: "caution",
    title: "Kalça kapsülünde çakışma",
    detail:
      "Fasya iliaka bloğu femoral siniri gövde düzeyinde tuttuğu için kalçanın femoral artiküler dallarını zaten kapsar. PENG'in ek katkısı yalnızca aksesuar obturator dallarıyla sınırlı kalır.",
  },
  {
    id: "acb-ipack",
    when: ["acb", "ipack"],
    severity: "complementary",
    title: "Diz cerrahisinin motor koruyucu ikilisi",
    detail:
      "ACB dizin ön-iç duyusunu, IPACK arka kapsülünü kapsar; ikisi de motor dalları büyük ölçüde korur. Erken mobilizasyon hedeflenen diz protezinde standart kombinasyondur.",
  },
  {
    id: "femoral-sciatic",
    when: ["femoral", "sciatic-popliteal"],
    severity: "complementary",
    title: "Bacağın tamamı kapsanır — ama yük verilemez",
    detail:
      "İki blok farklı pleksuslardan gelir ve birbirini tamamlar. Buna karşılık kuadriseps ve ayak bileği birlikte bloke olduğu için hasta bacağını hiç kullanamaz; düşme riski ve mobilizasyon planı buna göre yapılmalıdır.",
  },
  {
    id: "sciatic-ankle",
    when: ["sciatic-popliteal", "ankle-block"],
    severity: "redundant",
    title: "Ayak bileği bloğu popliteal bloğun distalinde kalır",
    detail:
      "Ayak bileği bloğunun beş sinirinden dördü (tibial uç dalları, yüzeyel ve derin peroneal, sural) siyatik sinirin dallarıdır ve popliteal blokla zaten tutulur. Geriye yalnızca safen siniri kalır — bunun için tek başına safen bloğu yeterlidir.",
  },
  {
    id: "spinal-peripheral-lower",
    when: ["spinal"],
    severity: "caution",
    title: "Spinal zaten her şeyi kapsıyor",
    detail:
      "Spinal anestezi kök düzeyinde blokaj yapar; alt ekstremitedeki tüm periferik sinirler iki taraflı olarak kapsanır. Üzerine eklenen periferik blok ameliyat sırasında ek kapsama sağlamaz — ancak spinal sönünce devreye girecek postoperatif analjezi amacıyla eklenmesi mantıklıdır. Gerekçe bu ise doz bütçesi buna göre planlanmalıdır.",
  },

  // ---- Gövde ----
  {
    id: "paravertebral-esp",
    when: ["paravertebral", "esp-thoracic"],
    severity: "redundant",
    title: "Aynı segmentlere iki yaklaşım",
    detail:
      "Paravertebral blok spinal siniri daha dallanmadan tutar; ESP'nin hedeflediği dorsal ramus da bunun içindedir. ESP genellikle paravertebralın daha güvenli alternatifi olarak seçilir, tamamlayıcısı olarak değil.",
  },
  {
    id: "paravertebral-intercostal",
    when: ["paravertebral", "intercostal"],
    severity: "redundant",
    title: "İnterkostal blok paravertebralin distalinde kalır",
    detail:
      "Paravertebral blok interkostal siniri kaynağında tutar. Aynı seviyelere ayrıca interkostal blok yapmak kapsama eklemez; farklı seviyeler hedefleniyorsa bu ayrıca belirtilmelidir.",
  },
  {
    id: "esp-intercostal",
    when: ["esp-thoracic", "intercostal"],
    severity: "caution",
    title: "Kısmi çakışma",
    detail:
      "ESP'nin ventral ramusa yayılımı değişkendir; interkostal blok bu boşluğu doldurabilir. Ancak aynı seviyelerde yapılırsa doz iki kez harcanmış olur.",
  },
  {
    id: "pecs2-serratus",
    when: ["pecs2", "serratus"],
    severity: "caution",
    title: "Lateral göğüs duvarında çakışma",
    detail:
      "Her iki blok da lateral kutanöz dalları hedefler. PECS II'nin ek katkısı pektoral sinirler ve aksilla (interkostobrakiyal); yalnızca bu bölgeler gerekiyorsa serratus eklemek doz israfıdır.",
  },
  {
    id: "tap-rectus",
    when: ["tap", "rectus-sheath"],
    severity: "complementary",
    title: "Yan duvar ve orta hat birlikte",
    detail:
      "Lateral TAP enjeksiyonunun orta hatta yayılımı güvenilir değildir. Orta hat insizyonlarında rektus kılıf bloğu bu boşluğu kapatır — ikisi aynı sinirlerin farklı uçlarını hedefler.",
  },
  {
    id: "tap-ilioinguinal",
    when: ["tap", "ilioinguinal"],
    severity: "caution",
    title: "L1 seviyesinde çakışma",
    detail:
      "TAP bloğu ilioinguinal ve iliohipogastrik sinirleri değişken de olsa kapsar. Kasık cerrahisinde hedeflenen tek bölge burasıysa iki bloğu birlikte yapmak yerine birini seçmek daha az doz harcar.",
  },

  // ---- Üst ekstremite, distal dallar ----
  {
    id: "interscalene-suprascapular",
    when: ["interscalene", "suprascapular"],
    severity: "redundant",
    title: "Suprascapular sinir üst trunkusun dalıdır",
    detail:
      "İnterskalen blok üst trunkusu tuttuğu için suprascapular sinir zaten kapsanır. Suprascapular bloğun anlamı, interskalen yerine motor koruyucu bir alternatif olmasıdır — ikisi birlikte değil, biri diğerinin yerine seçilir.",
  },
  {
    id: "interscalene-axillary-nerve",
    when: ["interscalene", "axillary-nerve"],
    severity: "redundant",
    title: "Aksiller sinir zaten kapsanıyor",
    detail:
      "Aksiller sinir C5–C6 liflerini taşır ve posterior kord aracılığıyla üst trunkustan çıkar; interskalen blokla birlikte tutulur.",
  },
  {
    id: "suprascapular-axillary-combo",
    when: ["suprascapular", "axillary-nerve"],
    severity: "complementary",
    title: "Motor koruyucu omuz kombinasyonu",
    detail:
      "İki sinir birlikte omuz ekleminin duyusunun büyük kısmını karşılar; interskalen bloğun aksine frenik sinir ve alt trunkus korunur. Solunum rezervi sınırlı hastada tercih edilir.",
  },
];

/**
 * Nerves whose absence from a selection is worth saying out loud, because a
 * plausible-looking combination leaves them open.
 */
const GAP_RULES: { when: string[]; nerve: string; title: string; detail: string }[] = [
  {
    when: BRACHIAL_PLEXUS_APPROACHES,
    nerve: "intercostobrachial",
    title: "Turnike ağrısı açık kalıyor",
    detail:
      "İnterkostobrakiyal sinir T2'den gelir ve brakiyal pleksusun parçası değildir; hiçbir pleksus bloğu onu kapsamaz. Turnike kullanılacaksa aksillaya ayrı bir cilt altı infiltrasyon gerekir.",
  },
];

export interface CombinationAnalysis {
  /** Named nerves the selection reaches, in anatomical order. */
  coverage: NerveCoverage[];
  findings: Finding[];
  /** Per technique, the nerves nothing else in the selection covers. */
  uniqueContribution: Record<string, Nerve[]>;
}

export function analyzeCombination(techniqueIds: string[]): CombinationAnalysis {
  const techniques = techniqueIds
    .map((id) => techniqueById(id))
    .filter((t): t is Technique => Boolean(t));

  const closures = new Map<string, Map<string, Reached>>();
  for (const t of techniques) closures.set(t.id, closureFor(t.id));

  // ---- Nerve-by-nerve coverage ----
  const coverage: NerveCoverage[] = [];
  for (const nerve of NERVES) {
    if (nerve.structural) continue;
    const sources: CoverageSource[] = [];
    for (const t of techniques) {
      const hit = closures.get(t.id)?.get(nerve.id);
      if (!hit) continue;
      sources.push({
        techniqueId: t.id,
        techniqueName: t.name,
        direct: hit.direct,
        reliability: hit.reliability,
        incidental: hit.incidental,
        note: hit.note,
      });
    }
    if (sources.length === 0) continue;
    coverage.push({
      nerve,
      status: sources.some(
        (s) => closures.get(s.techniqueId)?.get(nerve.id)?.status === "full"
      )
        ? "full"
        : "partial",
      sources,
      duplicated: sources.filter((s) => !s.incidental).length > 1,
    });
  }

  // ---- Findings from curated rules ----
  const findings: Finding[] = [];
  const selected = new Set(techniqueIds);
  for (const rule of INTERACTION_RULES) {
    if (!rule.when.every((id) => selected.has(id))) continue;
    // Single-technique rules are only interesting once something else is there
    // to interact with.
    if (rule.when.length === 1 && techniqueIds.length < 2) continue;
    findings.push({
      id: rule.id,
      severity: rule.severity,
      title: rule.title,
      detail: rule.detail,
      techniqueIds: rule.when,
    });
  }

  const complementaryPairs = new Set(
    findings
      .filter((f) => f.severity === "complementary" && f.techniqueIds.length === 2)
      .map((f) => [...f.techniqueIds].sort().join("|"))
  );

  // ---- Redundancy from the graph ----
  const uniqueContribution: Record<string, Nerve[]> = {};
  for (const t of techniques) {
    const mine = closures.get(t.id)!;
    const unique: Nerve[] = [];
    for (const [nerveId, hit] of mine) {
      if (hit.incidental) continue;
      const nerve = nerveById(nerveId);
      if (!nerve || nerve.structural) continue;
      const coveredElsewhere = techniques.some(
        (other) => other.id !== t.id && closures.get(other.id)?.has(nerveId)
      );
      if (!coveredElsewhere) unique.push(nerve);
    }
    uniqueContribution[t.id] = unique;
  }

  if (techniques.length > 1) {
    for (const t of techniques) {
      const map = TECHNIQUE_NERVES[t.id];
      // Infiltration techniques target no named nerve, so "no unique nerve" is
      // their normal state rather than a sign of redundancy.
      if (!map || map.targets.length === 0) continue;
      if (uniqueContribution[t.id].length > 0) continue;

      const subsumers = techniques.filter((other) => {
        if (other.id === t.id) return false;
        if (complementaryPairs.has([t.id, other.id].sort().join("|"))) return false;
        const theirs = closures.get(other.id)!;
        return [...closures.get(t.id)!.keys()].every((n) => theirs.has(n));
      });
      if (subsumers.length === 0) continue;
      if (findings.some((f) => f.severity !== "complementary" && f.techniqueIds.includes(t.id)))
        continue;

      findings.push({
        id: `redundant-${t.id}`,
        severity: "redundant",
        title: `${t.name} ek kapsama getirmiyor`,
        detail: `Bu bloğun tuttuğu sinirlerin tamamı ${subsumers
          .map((s) => s.name)
          .join(" / ")} tarafından zaten kapsanıyor. Kombinasyona kapsama eklemez, yalnızca doz ekler.`,
        techniqueIds: [t.id, ...subsumers.map((s) => s.id)],
      });
    }
  }

  // ---- Gaps ----
  for (const gap of GAP_RULES) {
    if (!gap.when.some((id) => selected.has(id))) continue;
    const covered = coverage.some((c) => c.nerve.id === gap.nerve);
    if (covered) continue;
    findings.push({
      id: `gap-${gap.nerve}`,
      severity: "caution",
      title: gap.title,
      detail: gap.detail,
      techniqueIds: gap.when.filter((id) => selected.has(id)),
    });
  }

  const order: Record<FindingSeverity, number> = {
    avoid: 0,
    redundant: 1,
    caution: 2,
    complementary: 3,
  };
  findings.sort((a, b) => order[a.severity] - order[b.severity]);

  return { coverage, findings, uniqueContribution };
}
