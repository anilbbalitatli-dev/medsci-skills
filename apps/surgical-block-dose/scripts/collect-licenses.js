#!/usr/bin/env node
/**
 * Uygulamayla birlikte dağıtılan açık kaynak paketlerin lisans dökümünü üretir.
 *
 * MIT, BSD ve ISC gibi izin veren lisansların hepsi aynı şeyi ister: telif
 * bildirimi ve lisans metni, yazılımın dağıtıldığı her kopyada bulunsun. Bir
 * mobil uygulamada bunun karşılığı, ayarlar/hakkında ekranındaki lisans
 * listesidir. Uygulamada böyle bir ekran yoktu — 400 küsur paketin tamamı
 * bildirimsiz dağıtılıyordu.
 *
 * Liste `dependencies` ağacının tamamından üretilir. Metro'nun paketlemeye
 * gerçekten hangi modülleri kattığını dışarıdan kesin olarak bilmek zor
 * olduğu için kapsam bilerek geniş tutuluyor: fazladan atıf vermek zarar
 * vermez, eksik atıf vermek lisans ihlalidir.
 *
 * Çıktı `src/data/oss-licenses.ts` — üretilmiş dosyadır, elle düzenlenmez.
 *
 *   node scripts/collect-licenses.js
 */

const fs = require("fs");
const path = require("path");

const APP = path.join(__dirname, "..");
const OUT = path.join(APP, "src/data/oss-licenses.ts");
const MODULES = path.join(APP, "node_modules");

const LICENSE_FILES = [
  "LICENSE",
  "LICENSE.md",
  "LICENSE.txt",
  "license",
  "LICENCE",
  "LICENCE.md",
  "COPYING",
];

/** LICENSE dosyasından telif satırını çeker; bulunamazsa author alanına düşer. */
function copyrightOf(dir, pkg) {
  for (const name of LICENSE_FILES) {
    const file = path.join(dir, name);
    if (!fs.existsSync(file)) continue;
    const text = fs.readFileSync(file, "utf8");
    const line = text
      .split("\n")
      .map((l) => l.trim())
      .find((l) => /^copyright/i.test(l) && l.length > 12);
    if (line) return line.replace(/\s+/g, " ").slice(0, 160);
  }
  const author = pkg.author;
  if (typeof author === "string") return author.split("<")[0].trim();
  if (author && author.name) return author.name;
  return undefined;
}

function licenseOf(pkg) {
  if (typeof pkg.license === "string") return pkg.license;
  if (pkg.license && pkg.license.type) return pkg.license.type;
  if (Array.isArray(pkg.licenses) && pkg.licenses[0]) {
    return pkg.licenses[0].type ?? pkg.licenses[0];
  }
  return undefined;
}

function main() {
  const root = JSON.parse(fs.readFileSync(path.join(APP, "package.json"), "utf8"));
  const found = new Map();
  const missing = [];

  const walk = (name) => {
    if (found.has(name)) return;
    const dir = path.join(MODULES, name);
    const manifest = path.join(dir, "package.json");
    if (!fs.existsSync(manifest)) return;
    const pkg = JSON.parse(fs.readFileSync(manifest, "utf8"));
    const license = licenseOf(pkg);
    if (!license) missing.push(name);
    found.set(name, {
      name,
      version: pkg.version,
      license: license ?? "BELİRTİLMEMİŞ",
      copyright: copyrightOf(dir, pkg),
    });
    for (const dep of Object.keys(pkg.dependencies ?? {})) walk(dep);
  };

  Object.keys(root.dependencies ?? {}).forEach(walk);

  const packages = [...found.values()].sort((a, b) => a.name.localeCompare(b.name, "en"));
  const licenses = [...new Set(packages.map((p) => p.license))].sort();

  const body = `// ÜRETİLMİŞ DOSYA — elle düzenlemeyin.
// Kaynak: scripts/collect-licenses.js · ${packages.length} paket
//
// Uygulamayla dağıtılan açık kaynak paketlerin telif bildirimleri. İzin veren
// lisansların tamamı bildirimin dağıtımla birlikte taşınmasını şart koşar;
// bu liste onun karşılığıdır.

export interface OssPackage {
  name: string;
  version: string;
  license: string;
  copyright?: string;
}

export const OSS_PACKAGES: OssPackage[] = ${JSON.stringify(packages, null, 2)};

/** Listede geçen farklı lisans türleri. */
export const OSS_LICENSE_TYPES: string[] = ${JSON.stringify(licenses, null, 2)};
`;

  fs.writeFileSync(OUT, body);
  console.log(`${packages.length} paket · ${licenses.length} lisans türü → ${path.relative(APP, OUT)}`);
  console.log(licenses.join(", "));
  if (missing.length > 0) {
    console.error(`\nLisansı belirtilmemiş ${missing.length} paket: ${missing.join(", ")}`);
    process.exit(1);
  }
}

main();
