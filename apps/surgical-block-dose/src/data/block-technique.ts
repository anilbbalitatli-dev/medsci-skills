import { Technique, techniqueById } from "./techniques";

/**
 * Which canonical technique each surgery's block entry is an instance of.
 *
 * The two id spaces do not line up, and cannot be made to by string surgery:
 * `ankle-popliteal` is the `sciatic-popliteal` technique, `elbow-axillary` is
 * `axillary-plexus`, `gynlap-portsite` is `port-site`. Deriving one from the
 * other would work for most entries and be quietly wrong for the rest, so the
 * mapping is written out and the data audit checks it stays complete.
 *
 * With this in place, anything authored once per technique — the landmark note,
 * the nerve map, the paediatric category — reaches every surgery that lists
 * that block, instead of being copied per surgery and drifting.
 */
export const BLOCK_TECHNIQUE: Record<string, string> = {
  // Alt ekstremite
  "tka-acb": "acb",
  "tka-ipack": "ipack",
  "tka-femoral": "femoral",
  "tka-spinal": "spinal",
  "tha-spinal": "spinal",
  "tha-peng": "peng",
  "tha-fascia-iliaca": "fascia-iliaca",
  "acl-acb": "acb",
  "acl-femoral": "femoral",
  "ankle-popliteal": "sciatic-popliteal",
  "ankle-saphenous": "saphenous",
  "ankle-ankle-block": "ankle-block",
  "bka-femoral": "femoral",
  "bka-sciatic": "sciatic-popliteal",
  "bka-spinal": "spinal",
  "hipfx-fascia-iliaca": "fascia-iliaca",
  "hipfx-peng": "peng",
  "hipfx-spinal": "spinal",
  "varicose-saphenous": "saphenous",
  "varicose-tumescent": "tumescent",

  // Üst ekstremite
  "shoulder-interscalene": "interscalene",
  "shoulder-suprascapular": "suprascapular",
  "shoulder-axillary-nerve": "axillary-nerve",
  "elbow-infraclavicular": "infraclavicular",
  "elbow-axillary": "axillary-plexus",
  "hand-supraclavicular": "supraclavicular",
  "hand-infraclavicular": "infraclavicular",
  "hand-ivra": "ivra",

  // Karın duvarı
  "cs-spinal": "spinal",
  "cs-tap": "tap",
  "app-tap": "tap",
  "app-rectus-sheath": "rectus-sheath",
  "hernia-ilioinguinal": "ilioinguinal",
  "hernia-tap": "tap",
  "gynlap-tap": "tap",
  "gynlap-portsite": "port-site",

  // Toraks ve göğüs duvarı
  "breast-pecs2": "pecs2",
  "breast-serratus": "serratus",
  "breast-paravertebral": "paravertebral",
  "thora-paravertebral": "paravertebral",
  "thora-esp": "esp-thoracic",
  "thora-intercostal": "intercostal",

  // Omurga, baş-boyun, ürogenital
  "spine-esp": "esp-lumbar",
  "spine-wound-infiltration": "wound-infiltration",
  "thyroid-scpb": "scpb",
  "circ-penile": "penile",
  "circ-caudal": "caudal",
};

export function techniqueForBlock(blockId: string): Technique | undefined {
  const id = BLOCK_TECHNIQUE[blockId];
  return id ? techniqueById(id) : undefined;
}
