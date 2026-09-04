import { BlockCategory, TECHNIQUE_CATEGORY } from "./pediatric-dosing";
import { Technique } from "./techniques";

/**
 * The local anaesthetics a given block can be done with, and at what strength.
 *
 * The catalogue quotes one or two drugs per block, which reads as if the choice
 * were part of the technique. It is not. **Volume is a property of the block**
 * — it is the size of the compartment being filled — while **concentration is a
 * property of the goal**: dense surgical anaesthesia or motor-sparing
 * analgesia. So the same block can be done with any of the amide agents at the
 * strength that matches the intent, and this table expresses that rather than
 * repeating a drug list per block.
 *
 * The equivalences are the conventional teaching ones. They are not
 * bioequivalence claims: onset, duration and cardiotoxicity differ, which is
 * why each row carries them.
 */
export type LaPurpose = "analgesia" | "surgical";

export interface LocalAnesthetic {
  /** Matched against the ceiling table by prefix, as elsewhere. */
  drug: string;
  label: string;
  /** Usual strength for motor-sparing analgesia, where the agent has a role. */
  analgesia?: number;
  /** Usual strength for dense surgical block. */
  surgical?: number;
  onsetMin: [number, number];
  durationHours: [number, number];
  note?: string;
}

export const LOCAL_ANESTHETICS: LocalAnesthetic[] = [
  {
    drug: "Ropivakain",
    label: "Ropivakain",
    analgesia: 0.2,
    surgical: 0.5,
    onsetMin: [10, 20],
    durationHours: [6, 12],
    note: "Düşük konsantrasyonda duyu-motor ayrışması belirgindir; kardiyotoksisitesi bupivakainden düşüktür.",
  },
  {
    drug: "Levobupivakain",
    label: "Levobupivakain",
    analgesia: 0.125,
    surgical: 0.5,
    onsetMin: [15, 30],
    durationHours: [6, 12],
    note: "Rasemik bupivakainin S-enantiyomeri; etki profili benzer, kardiyotoksisitesi daha düşüktür.",
  },
  {
    drug: "Bupivakain",
    label: "Bupivakain",
    analgesia: 0.125,
    surgical: 0.5,
    onsetMin: [15, 30],
    durationHours: [6, 12],
    note: "En kardiyotoksik amid; intravasküler enjeksiyonda resüsitasyona dirençli aritmi yapabilir.",
  },
  {
    drug: "Lidokain",
    label: "Lidokain",
    analgesia: 0.5,
    surgical: 1.5,
    onsetMin: [5, 15],
    durationHours: [1.5, 3],
    note: "Hızlı başlar, kısa sürer; uzun cerrahide tek başına yetersiz kalır.",
  },
  {
    drug: "Mepivakain",
    label: "Mepivakain",
    surgical: 1.5,
    onsetMin: [10, 20],
    durationHours: [2, 4],
    note: "Lidokainden biraz daha uzun; günübirlik cerrahide hızlı dönüş istendiğinde tercih edilir.",
  },
  {
    drug: "Prilokain",
    label: "Prilokain",
    surgical: 1.5,
    onsetMin: [10, 20],
    durationHours: [2, 3],
    note: "Yüksek dozda methemoglobinemi riski taşır; IVRA'da tercih edilen ajanlardandır.",
  },
];

export function localAnestheticByName(drug: string): LocalAnesthetic | undefined {
  return LOCAL_ANESTHETICS.find((l) => drug.toLowerCase().startsWith(l.drug.toLowerCase()));
}

/**
 * Which agents a particular technique may be done with.
 *
 * Most blocks take any amide, so the exceptions are the content here — and two
 * of them are safety facts rather than preferences. Bupivacaine and
 * levobupivacaine are excluded from intravenous regional anaesthesia because a
 * failed tourniquet delivers the whole dose intravascularly, and that is the
 * canonical way to cause a cardiac arrest that will not respond to
 * resuscitation. Intrathecal choice is left to the catalogue entry because
 * baricity, not concentration, drives it.
 */
const EXCLUSIONS: Record<string, { drugs: string[]; reason: string }> = {
  ivra: {
    drugs: ["Bupivakain", "Levobupivakain", "Ropivakain"],
    reason:
      "Turnike erken sönerse tüm doz bir anda damar içine geçer. Uzun etkili amidler bu senaryoda resüsitasyona dirençli kardiyak arreste yol açabileceği için IVRA'da kullanılmaz — lidokain veya prilokain tercih edilir.",
  },
  tumescent: {
    drugs: ["Bupivakain", "Levobupivakain", "Ropivakain", "Mepivakain", "Prilokain"],
    reason:
      "Tümesan teknik seyreltik lidokain ve epinefrin üzerine kuruludur; dozlama da bu ajana özgü literatüre dayanır.",
  },
};

/** Techniques whose agent choice is not a simple concentration equivalence. */
const CURATED_ONLY = new Set(["spinal"]);

const SHORT_ACTING_UNSUITABLE: BlockCategory[] = ["caudal", "epidural"];

export interface LaChoice {
  la: LocalAnesthetic;
  concentrationPercent: number;
  purpose: LaPurpose;
  /** Present when this agent carries a caveat for this particular block. */
  caution?: string;
}

/**
 * Reads intent off the catalogued regimen rather than asking every technique to
 * declare it: a long-acting amide quoted at or below 0.25% is being used to
 * spare motor function, and above that to produce a surgical block.
 */
export function purposeOf(technique: Technique): LaPurpose {
  const { drug, concentrationPercent } = technique.typical;
  const la = localAnestheticByName(drug);
  if (!la) return "surgical";
  if (la.analgesia === undefined) return "surgical";
  return concentrationPercent <= (la.analgesia + (la.surgical ?? la.analgesia)) / 2
    ? "analgesia"
    : "surgical";
}

export function laChoicesFor(technique: Technique): LaChoice[] {
  if (CURATED_ONLY.has(technique.id)) return [];

  const purpose = purposeOf(technique);
  const excluded = EXCLUSIONS[technique.id];
  const category = TECHNIQUE_CATEGORY[technique.id]?.category;

  return LOCAL_ANESTHETICS.flatMap((la) => {
    if (excluded?.drugs.includes(la.drug)) return [];

    const strength = purpose === "analgesia" ? la.analgesia : la.surgical;
    if (strength === undefined) return [];

    // A block meant to last into the postoperative period cannot be done with an
    // agent that wears off inside three hours; saying so beats listing it
    // without comment.
    let caution: string | undefined;
    if (la.durationHours[1] <= 4 && purpose === "analgesia") {
      caution = "Etki süresi kısa — postoperatif analjezi için tek başına yetersiz kalır.";
    }
    if (la.durationHours[1] <= 4 && category && SHORT_ACTING_UNSUITABLE.includes(category)) {
      caution = "Nöraksiyel kullanımda kısa etki süresi nedeniyle genellikle tercih edilmez.";
    }

    return [{ la, concentrationPercent: strength, purpose, caution }];
  });
}

export function exclusionReason(techniqueId: string): string | undefined {
  return EXCLUSIONS[techniqueId]?.reason;
}
