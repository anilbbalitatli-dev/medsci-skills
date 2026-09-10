import { NerveCoverage } from "./combination-analysis";
import { nerveById } from "./nerves";

/**
 * Kapsanan sinirleri düz liste yerine ağaç olarak düzenler.
 *
 * Kapsama listesi çizgeden düz bir liste olarak çıkıyordu: femoral bloğunda
 * safen, ön kutanöz dallar ve kas dalları femoralle aynı seviyede, "dalı olduğu
 * için" etiketiyle yan yana duruyordu. Bilgi doğruydu ama ilişkiyi
 * göstermiyordu — hangi dalın hangi ana sinirden geldiği okurun kafasında
 * kurulmak zorundaydı. Nöraksiyel bir blokta bu otuz küsur satır demek.
 *
 * Burada her sinir, kapsanan **en yakın atasının** altına yerleşir. Ana sinir
 * kapalıyken dalları görünmez; ana sinire dokunulduğunda açılır. Böylece liste
 * hem kısalır hem de asıl söylemek istediği şeyi söyler: bu dallar, o ana
 * sinir bloklandığı için bloklanmıştır.
 *
 * "En yakın kapsanan ata" demek gerekiyor, çünkü aradaki basamaklar çoğu zaman
 * listede yoktur: kordlar ve trunkuslar `structural` olduğu için kapsama
 * listesine girmez. Medyan sinirin ebeveyni lateral/medial kordlardır, ama
 * listede görünen atası brakiyal pleksusun kendisi değil — bu yüzden zincir
 * yukarı doğru, listede bulunan ilk düğüme kadar izlenir.
 */
export interface CoverageNode {
  entry: NerveCoverage;
  children: CoverageNode[];
  /** Her derinlikteki dal sayısı; başlıktaki "N dal" rozetinde kullanılır. */
  branchCount: number;
}

/** Listede yer alan en yakın ata; yoksa undefined (kök satır olur). */
function nearestCoveredAncestor(id: string, covered: Set<string>): string | undefined {
  const seen = new Set<string>([id]);
  let frontier = nerveById(id)?.parents ?? [];
  while (frontier.length > 0) {
    const next: string[] = [];
    for (const parentId of frontier) {
      if (seen.has(parentId)) continue;
      seen.add(parentId);
      if (covered.has(parentId)) return parentId;
      next.push(...(nerveById(parentId)?.parents ?? []));
    }
    frontier = next;
  }
  return undefined;
}

export function buildCoverageTree(coverage: NerveCoverage[]): CoverageNode[] {
  const covered = new Set(coverage.map((c) => c.nerve.id));
  const nodes = new Map<string, CoverageNode>(
    coverage.map((c) => [c.nerve.id, { entry: c, children: [], branchCount: 0 }])
  );

  const roots: CoverageNode[] = [];
  // Sıra kapsama listesinden gelir; o da NERVES'in anatomik sırasıdır, yani
  // dallar ana sinirin altında yukarıdan aşağıya doğru dizilir.
  for (const c of coverage) {
    const node = nodes.get(c.nerve.id)!;
    const parentId = nearestCoveredAncestor(c.nerve.id, covered);
    const parent = parentId ? nodes.get(parentId) : undefined;
    if (parent) parent.children.push(node);
    else roots.push(node);
  }

  const count = (node: CoverageNode): number => {
    node.branchCount = node.children.reduce((sum, child) => sum + 1 + count(child), 0);
    return node.branchCount;
  };
  roots.forEach(count);

  return roots;
}
