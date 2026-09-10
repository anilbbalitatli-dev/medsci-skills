import { ImageSourcePropType } from "react-native";

/**
 * Static asset registry for reference images (ultrasound captures, anatomical
 * plates).
 *
 * Metro resolves `require()` at build time, so every image must be listed here
 * literally — you cannot build the path from a variable. Adding an image is
 * therefore two steps:
 *
 *   1. Drop the file into `assets/reference/` (see the README there for the
 *      naming, format, and licensing rules).
 *   2. Add one line below, keyed by the same string used in the block's
 *      `images[].key`.
 *
 * Until step 2 is done the app renders a labelled "image pending" placeholder
 * in that slot rather than failing, so declared-but-missing images are visible
 * instead of silent.
 *
 * Every entry must have a stated license in its `credit` field at the usage
 * site — own material, public domain, or an explicitly redistributable
 * license. Do not add copyrighted textbook/atlas/commercial images.
 */
export const REFERENCE_IMAGES: Record<string, ImageSourcePropType> = {
  // Park D, Chang MC. J Yeungnam Med Sci. 2022;39(3):190-199 — CC BY-NC 4.0.
  // Cropped to the ultrasound panels; see THIRD-PARTY-LICENSES.md. These files
  // are NOT covered by this repository's MIT license and may not be used
  // commercially. Entries carrying the marker at the end of the line are
  // stripped by scripts/strip-noncommercial-assets.sh — keep that marker on
  // any future entry with the same restriction.
  "usg-paravertebral": require("../../assets/reference/usg-paravertebral.jpg"), // @noncommercial
  "usg-intercostal": require("../../assets/reference/usg-intercostal.jpg"), // @noncommercial
  "usg-esp": require("../../assets/reference/usg-esp.jpg"), // @noncommercial
  "usg-pecs2": require("../../assets/reference/usg-pecs2.jpg"), // @noncommercial
  "usg-serratus": require("../../assets/reference/usg-serratus.jpg"), // @noncommercial

  // Muse IO et al. J Clin Med. 2024;13(12):3457 — CC BY 4.0, commercial use
  // permitted. Deliberately unmarked: these survive the strip script. Only the
  // authors' own figures are taken; Figures 1, 2 and 7 of that paper are
  // reproduced there under permission from other publishers, so the article's
  // CC BY licence does not extend to them and they are not used here.
  "usg-fascia-iliaca": require("../../assets/reference/usg-fascia-iliaca.jpg"),
  "usg-femoral": require("../../assets/reference/usg-femoral.jpg"),
  "usg-lfcn": require("../../assets/reference/usg-lfcn.jpg"),
  "usg-peng": require("../../assets/reference/usg-peng.jpg"),
};

export function getReferenceImage(key: string): ImageSourcePropType | undefined {
  return REFERENCE_IMAGES[key];
}
