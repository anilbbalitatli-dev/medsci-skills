import { BLOCK_TECHNIQUE } from "./block-technique";
import { closureFor } from "./combination-analysis";
import { Nerve, nerveById } from "./nerves";
import { SURGERIES } from "./surgeries";
import { TECHNIQUE_NERVES } from "./technique-nerves";
import { TECHNIQUES, Technique } from "./techniques";

/**
 * "Blok tutmadı, ne ekleyeyim?"
 *
 * Bu soru uygulamada zaten yanıtlanabilir durumdaydı ama kullanıcının üç ayrı
 * ekranı kafasında birleştirmesini gerektiriyordu: bu teknik hangi sinirleri
 * sık kaçırır, o sinir kimin dalı, hangi blok ona ulaşır. Üçü de veride var —
 * dolayısıyla elle yazılmış bir "kurtarma tablosu" hem gereksiz hem de
 * kaçınılmaz olarak veriden sapardı.
 *
 * Aday sinirler üç yerden gelir:
 *
 * - `commonlyMissed`: tekniğin bilinen zayıf noktaları (supraklaviküler blokta
 *   suprascapular gibi).
 * - Kapanışta **kısmi** kalanlar: lifleri bloklanmamış bir kökten gelmeye
 *   devam edenler. İnterskalen blokta radial ve aksiller sinir böyledir.
 * - **Komşu alan**: aynı ameliyatta bu bloğun yanına konan blokların tuttuğu
 *   ama bunun hiç tutmadığı sinirler. Klasik kurtarma vakaları buradan çıkar —
 *   popliteal siyatikten sonra ayağın iç kenarı ağrıyorsa cevap safen sinirdir
 *   ve safen bu bloğun kapanışında hiç yoktur, "kısmi" bile değildir.
 *
 * Yalnızca **duyusal alanı olan** sinirler önerilir: kurtarma ağrı için
 * yapılır, torakodorsal gibi saf motor dallar listeyi doldurmaktan başka işe
 * yaramaz. Kurtarma bloğu olarak da yalnızca o siniri **tam** kapsayanlar
 * gösterilir; kısmi kapsayan bir bloğu önermek aynı boşluğu ikinci kez
 * bırakmak olur.
 */

export type RescueReason = "missed" | "partial" | "adjacent";

/**
 * Öneri, sinir başına değil **eklenecek blok** başına verilir.
 *
 * Sinir başına verildiğinde aynı cevap birkaç kez yazılıyordu (tibial, medial
 * plantar, lateral plantar → hepsi "popliteal siyatik"), üstelik ata/dal
 * ilişkisini kırpmaya çalışmak bazen doğru cevabı siliyordu: popliteal
 * bloktan sonra açık kalan yer safen sinirdir, "femoral" değil. Blok başına
 * gruplayınca ikisi de aynı satırda buluşuyor ve soru asıl sorulduğu biçimde
 * yanıtlanıyor: ne eklersem neyi kapatırım?
 */
export interface RescueOption {
  technique: Technique;
  /** Bu bloğun kapatacağı, hâlâ açık olan sinirler. */
  nerves: Nerve[];
  /** Açık kalma sebeplerinin en güçlüsü. */
  reason: RescueReason;
}

/** Panel bundan uzun olursa okunmaz. */
const MAX_OPTIONS = 3;
const MAX_NERVES_PER_OPTION = 4;

/**
 * Kurtarma önerisi olarak gösterilmeyen teknikler.
 *
 * Nöraksiyel bloğa veya IVRA'ya geçmek bir "üstüne ekleme" değil, plan
 * değişikliğidir: hastanın pozisyonu, turnikesi ve izlemi değişir. Panelin
 * altındaki not bu seçeneği ayrıca hatırlatır, ama listeye girerse tek
 * enjeksiyonluk bir tamamlama gibi görünür.
 */
const NOT_A_TOP_UP = new Set([
  "spinal",
  "epidural-lumbar",
  "epidural-thoracic",
  "caudal",
  "ivra",
  "tumescent",
]);

/** Aynı ameliyatta bu bloğun yanında listelenen teknikler. */
function siblingTechniques(techniqueId: string): Set<string> {
  const siblings = new Set<string>();
  for (const surgery of SURGERIES) {
    const techs = surgery.blocks
      .map((b) => BLOCK_TECHNIQUE[b.id])
      .filter((id): id is string => Boolean(id));
    if (!techs.includes(techniqueId)) continue;
    for (const id of techs) if (id !== techniqueId) siblings.add(id);
  }
  return siblings;
}

/** Bu siniri kapatan en dar bloğun kapsama büyüklüğü. */
function narrowestRescueSize(nerveId: string, covers: Map<string, string[]>): number {
  const ids = covers.get(nerveId);
  if (!ids || ids.length === 0) return Infinity;
  return Math.min(...ids.map((id) => closureFor(id).size));
}

export function rescueFor(techniqueId: string): RescueOption[] {
  const map = TECHNIQUE_NERVES[techniqueId];
  if (!map) return [];

  const closure = closureFor(techniqueId);
  const targeted = new Set(map.targets.map((t) => t.nerve));
  const candidates = new Map<string, RescueReason>();

  const consider = (id: string, reason: RescueReason) => {
    const nerve = nerveById(id);
    // Yapısal düğümler (kord, trunkus, pleksus) gösterilmez; kurtarma ağrı
    // için yapıldığından duyusal alanı olmayan saf motor dallar da girmez.
    if (!nerve || nerve.structural || !nerve.sensory) return;
    if (!candidates.has(id)) candidates.set(id, reason);
  };

  for (const id of map.commonlyMissed ?? []) consider(id, "missed");

  for (const [id, hit] of closure) {
    if (hit.status !== "partial" || hit.incidental) continue;
    // Doğrudan hedeflenen bir sinirin kısmi kalması tekniğin tanımı gereğidir
    // (interskalende orta trunkus gibi); kurtarma önerisi oraya değil, sonuçta
    // açık kalan uç sinire yapılır.
    if (targeted.has(id)) continue;
    consider(id, "partial");
  }

  for (const siblingId of siblingTechniques(techniqueId)) {
    if (NOT_A_TOP_UP.has(siblingId)) continue;
    for (const [id, hit] of closureFor(siblingId)) {
      if (hit.status !== "full" || hit.incidental) continue;
      if (closure.get(id)?.status === "full") continue;
      consider(id, "adjacent");
    }
  }

  if (candidates.size === 0) return [];

  // Sinir → onu tam kapatan teknikler.
  const covers = new Map<string, string[]>();
  for (const nerveId of candidates.keys()) {
    const covering = TECHNIQUES.filter((t) => {
      if (t.id === techniqueId || NOT_A_TOP_UP.has(t.id)) return false;
      const hit = closureFor(t.id).get(nerveId);
      return hit?.status === "full" && !hit.incidental;
    }).map((t) => t.id);
    if (covering.length > 0) covers.set(nerveId, covering);
  }

  const order: Record<RescueReason, number> = { missed: 0, partial: 1, adjacent: 2 };

  // Adaylar önem sırasına dizilir: bilinen zayıf nokta > kısmi > komşu alan;
  // eşitlikte saf duyusal sinir önce gelir (kurtarma ağrı içindir), sonra onu
  // kapatan blok sayısı az olan — yani daha özgül olan.
  const ranked = [...candidates.entries()].sort((a, b) => {
    const byReason = order[a[1]] - order[b[1]];
    if (byReason !== 0) return byReason;
    const [na, nb] = [nerveById(a[0])!, nerveById(b[0])!];
    const sensoryOnly = (n: typeof na) => (n.modality === "sensory" ? 0 : 1);
    const bySensory = sensoryOnly(na) - sensoryOnly(nb);
    if (bySensory !== 0) return bySensory;
    // Son ölçüt: en küçük ek girişimle kapanan boşluk önce. Safen sinir için
    // tek bir safen bloğu yeterlidir, femoral için femoral bloğun tamamı
    // gerekir — önce küçük olanı öner.
    return narrowestRescueSize(a[0], covers) - narrowestRescueSize(b[0], covers);
  });

  const remaining = new Set(candidates.keys());
  const options: RescueOption[] = [];

  // Her adım, sıradaki en önemli açık sinir için **en dar** bloğu seçer.
  // "En çok sinir kapatan" değil: kurtarmada istenen ek kapsama değil, eksik
  // olan yerdir. Seçilen blok yol boyunca kapattığı diğer açık sinirleri de
  // aynı satırda toplar.
  for (const [nerveId] of ranked) {
    if (!remaining.has(nerveId) || options.length >= MAX_OPTIONS) continue;
    const candidatesForNerve = covers.get(nerveId);
    if (!candidatesForNerve || candidatesForNerve.length === 0) continue;

    const chosen = candidatesForNerve
      .slice()
      .sort((a, b) => closureFor(a).size - closureFor(b).size)[0];
    const technique = TECHNIQUES.find((t) => t.id === chosen)!;
    const closed = [...remaining].filter((id) => covers.get(id)?.includes(chosen));

    options.push({
      technique,
      nerves: closed
        .map((id) => nerveById(id)!)
        .sort((a, b) => order[candidates.get(a.id)!] - order[candidates.get(b.id)!])
        .slice(0, MAX_NERVES_PER_OPTION),
      reason: closed.reduce<RescueReason>(
        (acc, id) => (order[candidates.get(id)!] < order[acc] ? candidates.get(id)! : acc),
        "adjacent"
      ),
    });
    for (const id of closed) remaining.delete(id);
  }

  return options;
}

export const RESCUE_REASON_LABEL: Record<RescueReason, string> = {
  missed: "bu yaklaşımın bilinen zayıf noktası",
  partial: "lifleri kısmen bloklanmamış kökten geliyor",
  adjacent: "komşu alan — bu blok hiç kapsamıyor",
};
