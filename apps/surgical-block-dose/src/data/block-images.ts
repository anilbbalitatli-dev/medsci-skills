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
  // Example (uncomment once the file exists):
  // "usg-interscalene": require("../../assets/reference/usg-interscalene.jpg"),
  // "grays-dermatome-anterior": require("../../assets/reference/grays-dermatome-anterior.png"),
};

export function getReferenceImage(key: string): ImageSourcePropType | undefined {
  return REFERENCE_IMAGES[key];
}
