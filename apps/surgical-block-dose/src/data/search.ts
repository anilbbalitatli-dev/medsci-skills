import { closureFor } from "./combination-analysis";
import { SELECTABLE_LEVELS } from "./block-finder";
import { LOCAL_ANESTHETICS, LocalAnesthetic } from "./local-anesthetics";
import { findMaxDose } from "./max-doses";
import { NERVES, Nerve, rootsLabel } from "./nerves";
import { SURGERIES } from "./surgeries";
import { TECHNIQUES, Technique } from "./techniques";
import { DrugMaxDose, Surgery } from "./types";

/**
 * Uygulamanın tamamında arama.
 *
 * Arama kutusu yalnızca cerrahi adlarında çalışıyordu: "safen", "ESP",
 * "ropivakain" ya da "L3" yazan hiçbir şey bulamıyordu — oysa dördü de veride
 * duruyor. Referans uygulamasında insanın aklına gelen ilk kelime çoğu zaman
 * ameliyatın adı değil, bloğun ya da sinirin adıdır.
 *
 * Sonuçlar türlerine göre gruplanır, çünkü hepsi aynı şeye götürmez: cerrahi
 * ve blok kendi sayfasına, sinir onu bloklayan tekniklere, ilaç kendi tavanına,
 * dermatom da dermatom arayüzüne.
 *
 * Eşleşme aksan/harf duyarsız ve Türkçe'ye göre yapılır: "iliaka" ile
 * "İliaka", "buyuk" ile "büyük" aynı sonucu vermeli.
 */
export type SearchKind = "surgery" | "technique" | "nerve" | "drug" | "level";

export interface SurgeryResult {
  kind: "surgery";
  id: string;
  title: string;
  subtitle: string;
  surgery: Surgery;
}

export interface TechniqueResult {
  kind: "technique";
  id: string;
  title: string;
  subtitle: string;
  technique: Technique;
}

export interface NerveResult {
  kind: "nerve";
  id: string;
  title: string;
  subtitle: string;
  nerve: Nerve;
  /** Bu siniri tam bloklayan teknikler, en dar olandan başlayarak. */
  techniques: Technique[];
}

export interface DrugResult {
  kind: "drug";
  id: string;
  title: string;
  subtitle: string;
  drug: LocalAnesthetic;
  ceiling?: DrugMaxDose;
}

export interface LevelResult {
  kind: "level";
  id: string;
  title: string;
  subtitle: string;
  level: string;
}

export type SearchResult =
  | SurgeryResult
  | TechniqueResult
  | NerveResult
  | DrugResult
  | LevelResult;

export interface SearchResults {
  surgeries: SurgeryResult[];
  techniques: TechniqueResult[];
  nerves: NerveResult[];
  drugs: DrugResult[];
  levels: LevelResult[];
  total: number;
}

/**
 * Karşılaştırma için sadeleştirilmiş metin.
 *
 * Türkçe'de büyük/küçük harf dönüşümü İ/ı yüzünden yerel ayara bağlıdır;
 * ardından aksanlar düşürülür ki "İliaka" ile "iliaka", "büyük" ile "buyuk"
 * eşleşsin. Kullanıcı arama kutusuna Türkçe klavyeyle yazmak zorunda değildir.
 */
function fold(text: string): string {
  return text
    .toLocaleLowerCase("tr")
    .replace(/ı/g, "i")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

/** Baştan eşleşme, içeride eşleşmeden önce gelsin. */
function score(haystack: string, needle: string): number {
  const index = haystack.indexOf(needle);
  if (index < 0) return -1;
  return index === 0 ? 0 : 1;
}

/**
 * İlaçların latin/İngilizce yazılışları.
 *
 * Türkçe farmakopede "ropivakain", literatürde "ropivacaine" geçer; ikisini de
 * yazan aynı ilacı arıyordur. Harf sadeleştirmesiyle (c↔k) otomatik yapmak
 * yerine liste tutuluyor: otomatik dönüşüm "kokain"i "cocaine"e çevirirken
 * alakasız kelimeleri de birbirine yakınlaştırır.
 */
const DRUG_ALIASES: Record<string, string> = {
  Ropivakain: "ropivacaine",
  Levobupivakain: "levobupivacaine",
  Bupivakain: "bupivacaine marcaine",
  Lidokain: "lidocaine lignocaine xylocaine",
  Mepivakain: "mepivacaine",
  Prilokain: "prilocaine citanest",
};

function range([lo, hi]: [number, number]): string {
  return lo === hi ? `${lo}` : `${lo}–${hi}`;
}

/**
 * Sinir → onu tam bloklayan teknikler.
 *
 * Tersine indeks bir kez kurulur. Her tuşa basışta 44 tekniğin kapanışını
 * yeniden çıkarmak — arama kutusu her harfte yeniden çalıştığı için — yüzlerce
 * graf yürüyüşü demekti; katalog çalışma sırasında değişmediği için sonuç da
 * değişmez.
 *
 * Sıralama en dar bloktan başlar: "safen" arayan kişi tüm bacağı bloklayan
 * spinali değil, adduktor kanalı görmelidir.
 */
let blockedByIndex: Map<string, Technique[]> | undefined;

function techniquesBlocking(nerveId: string): Technique[] {
  if (!blockedByIndex) {
    const width = new Map<string, number>();
    const index = new Map<string, Technique[]>();
    for (const t of TECHNIQUES) {
      const closure = closureFor(t.id);
      width.set(t.id, closure.size);
      for (const [nerve, hit] of closure) {
        if (hit.status !== "full" || hit.incidental) continue;
        const list = index.get(nerve);
        if (list) list.push(t);
        else index.set(nerve, [t]);
      }
    }
    for (const list of index.values()) {
      list.sort((a, b) => (width.get(a.id) ?? 0) - (width.get(b.id) ?? 0));
    }
    blockedByIndex = index;
  }
  return blockedByIndex.get(nerveId) ?? [];
}

const MAX_PER_GROUP = 6;

/**
 * Tek harf aramaz.
 *
 * Katalogda 500'ün üzerinde aranabilir metin var; tek harf hepsinin yarısını
 * getirir ve liste cevap değil gürültü olur. Cerrahi adında tek harf eskiden
 * çalışıyordu ama orada da işe yaramıyordu.
 */
export const MIN_QUERY_LENGTH = 2;

export function searchEverything(query: string): SearchResults {
  const q = fold(query.trim());
  const empty: SearchResults = {
    surgeries: [],
    techniques: [],
    nerves: [],
    drugs: [],
    levels: [],
    total: 0,
  };
  if (q.length < MIN_QUERY_LENGTH) return empty;

  const rank = <T>(items: { value: T; text: string }[]) =>
    items
      .map(({ value, text }) => ({ value, s: score(fold(text), q) }))
      .filter((r) => r.s >= 0)
      .sort((a, b) => a.s - b.s)
      .slice(0, MAX_PER_GROUP)
      .map((r) => r.value);

  const surgeries = rank(
    SURGERIES.map((s) => ({
      value: {
        kind: "surgery" as const,
        id: s.id,
        title: s.name,
        subtitle: `${s.category} — ${s.region}`,
        surgery: s,
      },
      text: [s.name, s.category, s.region, ...s.aliases].join(" "),
    }))
  );

  const techniques = rank(
    TECHNIQUES.map((t) => ({
      value: {
        kind: "technique" as const,
        id: t.id,
        title: t.name,
        subtitle: t.region,
        technique: t,
      },
      // Teknik kimliği de aranır: "esp-thoracic" yazan da bulsun.
      text: [t.name, t.region, t.id.replace(/-/g, " ")].join(" "),
    }))
  );

  const nerves = rank(
    NERVES.filter((n) => !n.structural).map((n) => ({
      value: {
        kind: "nerve" as const,
        id: n.id,
        title: n.name,
        subtitle: [rootsLabel(n), n.sensory ?? n.motor].filter(Boolean).join(" · "),
        nerve: n,
        techniques: techniquesBlocking(n.id).slice(0, 4),
      },
      text: [n.name, n.id.replace(/-/g, " "), n.sensory ?? "", n.motor ?? ""].join(" "),
    }))
  );

  const drugs = rank(
    LOCAL_ANESTHETICS.map((la) => {
      const ceiling = findMaxDose(la.drug);
      return {
        value: {
          kind: "drug" as const,
          id: la.drug,
          title: la.label,
          // Tavan alt satırda mutlak sınırıyla birlikte veriliyor; burada
          // tekrar etmek aynı sayıyı iki kez yazmak olurdu.
          subtitle: `başlangıç ${range(la.onsetMin)} dk · süre ${range(la.durationHours)} sa`,
          drug: la,
          ceiling,
        },
        text: [la.label, DRUG_ALIASES[la.drug] ?? ""].join(" "),
      };
    })
  );

  const levels = rank(
    SELECTABLE_LEVELS.map((l) => ({
      value: {
        kind: "level" as const,
        id: l,
        title: l,
        subtitle: "Bu segmenti kapsayan blokları göster",
        level: l,
      },
      text: l,
    }))
  );

  return {
    surgeries,
    techniques,
    nerves,
    drugs,
    levels,
    total:
      surgeries.length + techniques.length + nerves.length + drugs.length + levels.length,
  };
}
