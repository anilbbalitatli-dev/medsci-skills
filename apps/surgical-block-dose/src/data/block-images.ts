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
  // are NOT covered by this repository's MIT license.
  "usg-paravertebral": require("../../assets/reference/usg-paravertebral.jpg"),
  "usg-intercostal": require("../../assets/reference/usg-intercostal.jpg"),
  "usg-esp": require("../../assets/reference/usg-esp.jpg"),
  "usg-pecs2": require("../../assets/reference/usg-pecs2.jpg"),
  "usg-serratus": require("../../assets/reference/usg-serratus.jpg"),
};

export function getReferenceImage(key: string): ImageSourcePropType | undefined {
  return REFERENCE_IMAGES[key];
}
