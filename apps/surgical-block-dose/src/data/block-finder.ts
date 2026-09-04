import { analyzeCombination, Finding } from "./combination-analysis";
import { DERMATOME_LEVELS, POSTERIOR_LEVELS } from "./dermatome-figure";
import { TECHNIQUES, Technique } from "./techniques";

/**
 * The reverse lookup: given the segments you want anaesthetised, which blocks
 * reach them?
 *
 * Two numbers matter, and collapsing them into one score would hide the more
 * interesting half. **Coverage** is how much of what you asked for a technique
 * reaches. **Overshoot** is how much it reaches that you did not ask for — and
 * that is where the clinical judgement lives. A spinal anaesthetic "covers"
 * a request for L3–L4 perfectly while also blocking fourteen segments you never
 * wanted, both legs and the bladder along with them. Ranked on coverage alone
 * it would sit at the top of every lower-limb search.
 *
 * So matches are ranked by coverage first, then by how little they overshoot,
 * and both figures are carried through to the UI rather than folded away.
 */

/** Every segment either figure can display, head to toe. */
export const SELECTABLE_LEVELS: string[] = (() => {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const l of [...DERMATOME_LEVELS, ...POSTERIOR_LEVELS]) {
    if (seen.has(l)) continue;
    seen.add(l);
    out.push(l);
  }
  return out;
})();

const LEVEL_INDEX = new Map(SELECTABLE_LEVELS.map((l, i) => [l, i]));

export function sortLevels(levels: Iterable<string>): string[] {
  return Array.from(levels).sort(
    (a, b) => (LEVEL_INDEX.get(a) ?? 999) - (LEVEL_INDEX.get(b) ?? 999)
  );
}

/**
 * Named regions, so the common case is one tap rather than eleven.
 * These are the request ranges people actually arrive with, not anatomical
 * definitions — a thoracotomy request is "the levels a thoracotomy hurts at".
 */
export const LEVEL_PRESETS: { id: string; label: string; levels: string[] }[] = [
  { id: "shoulder", label: "Omuz", levels: ["C5", "C6"] },
  { id: "arm", label: "Kol / el", levels: ["C5", "C6", "C7", "C8", "T1"] },
  { id: "breast", label: "Meme / ön göğüs", levels: ["T2", "T3", "T4", "T5", "T6"] },
  { id: "thoracotomy", label: "Torakotomi", levels: ["T4", "T5", "T6", "T7", "T8"] },
  { id: "upper-abdomen", label: "Üst karın", levels: ["T6", "T7", "T8", "T9", "T10"] },
  { id: "lower-abdomen", label: "Alt karın", levels: ["T10", "T11", "T12", "L1"] },
  { id: "groin", label: "Kasık", levels: ["T12", "L1", "L2"] },
  { id: "hip", label: "Kalça", levels: ["L1", "L2", "L3", "L4"] },
  { id: "knee", label: "Diz", levels: ["L3", "L4", "S1", "S2"] },
  { id: "foot", label: "Ayak", levels: ["L4", "L5", "S1", "S2"] },
  { id: "perineum", label: "Perine", levels: ["S2", "S3"] },
];

export interface BlockMatch {
  technique: Technique;
  /** Requested levels this technique reaches. */
  covered: string[];
  /** Requested levels it does not reach. */
  missing: string[];
  /** Levels it blocks that were not requested. */
  overshoot: string[];
  /** Share of the request covered, 0–1. */
  coverage: number;
  complete: boolean;
}

function levelsOf(t: Technique): string[] {
  return (t.coverage.levels ?? []) as string[];
}

function matchOne(technique: Technique, requested: Set<string>): BlockMatch | null {
  const mine = new Set(levelsOf(technique));
  // Techniques with no segmental coverage (field infiltration) cannot answer a
  // dermatome question at all, so they are left out rather than shown at zero.
  if (mine.size === 0) return null;

  const covered = sortLevels([...requested].filter((l) => mine.has(l)));
  const missing = sortLevels([...requested].filter((l) => !mine.has(l)));
  const overshoot = sortLevels([...mine].filter((l) => !requested.has(l)));

  return {
    technique,
    covered,
    missing,
    overshoot,
    coverage: requested.size > 0 ? covered.length / requested.size : 0,
    complete: missing.length === 0,
  };
}

export function findBlocks(requestedLevels: string[]): BlockMatch[] {
  const requested = new Set(requestedLevels);
  if (requested.size === 0) return [];

  return TECHNIQUES.map((t) => matchOne(t, requested))
    .filter((m): m is BlockMatch => m !== null && m.covered.length > 0)
    .sort((a, b) => {
      if (a.complete !== b.complete) return a.complete ? -1 : 1;
      if (b.coverage !== a.coverage) return b.coverage - a.coverage;
      return a.overshoot.length - b.overshoot.length;
    });
}

export interface PairMatch {
  techniques: [Technique, Technique];
  covered: string[];
  missing: string[];
  overshoot: string[];
  coverage: number;
  complete: boolean;
  /** Verdicts from the combination analysis, so a bad pair is never silent. */
  findings: Finding[];
}

/**
 * Two-block answers, for requests no single technique can fill.
 *
 * Pairs whose analysis flags them as redundant or to be avoided are dropped
 * rather than shown with a warning: this list is a set of suggestions, and
 * suggesting something the app elsewhere says not to do would be incoherent.
 * Remaining findings are carried through so a merely cautionary pair still
 * arrives with its caveat attached.
 */
export function findPairs(requestedLevels: string[], limit = 6): PairMatch[] {
  const requested = new Set(requestedLevels);
  if (requested.size === 0) return [];

  const singles = TECHNIQUES.map((t) => matchOne(t, requested)).filter(
    (m): m is BlockMatch => m !== null && m.covered.length > 0
  );

  const pairs: PairMatch[] = [];
  for (let i = 0; i < singles.length; i++) {
    for (let j = i + 1; j < singles.length; j++) {
      const a = singles[i];
      const b = singles[j];

      // Each partner has to bring something the other does not, or the pair is
      // just the better block plus a passenger.
      const aSet = new Set(a.covered);
      const bSet = new Set(b.covered);
      if (b.covered.every((l) => aSet.has(l))) continue;
      if (a.covered.every((l) => bSet.has(l))) continue;

      const union = new Set([...levelsOf(a.technique), ...levelsOf(b.technique)]);
      const covered = sortLevels([...requested].filter((l) => union.has(l)));
      const missing = sortLevels([...requested].filter((l) => !union.has(l)));
      const overshoot = sortLevels([...union].filter((l) => !requested.has(l)));

      const { findings } = analyzeCombination([a.technique.id, b.technique.id]);
      if (findings.some((f) => f.severity === "avoid" || f.severity === "redundant")) continue;

      pairs.push({
        techniques: [a.technique, b.technique],
        covered,
        missing,
        overshoot,
        coverage: covered.length / requested.size,
        complete: missing.length === 0,
        findings,
      });
    }
  }

  return pairs
    .sort((x, y) => {
      if (x.complete !== y.complete) return x.complete ? -1 : 1;
      if (y.coverage !== x.coverage) return y.coverage - x.coverage;
      if (x.overshoot.length !== y.overshoot.length) return x.overshoot.length - y.overshoot.length;
      // Prefer pairs the analysis actively endorses over merely tolerable ones.
      const endorsed = (p: PairMatch) =>
        p.findings.some((f) => f.severity === "complementary") ? 0 : 1;
      return endorsed(x) - endorsed(y);
    })
    .slice(0, limit);
}
