#!/usr/bin/env node
/**
 * Cross-reference audit of the data set.
 *
 * The catalogue is now several tables that refer to each other by id —
 * techniques, nerve maps, guideline categories, sonoanatomy, images, surgeries.
 * Nothing in TypeScript checks that a technique named in one table exists in
 * the others, because they are all `Record<string, …>` keyed by free-form
 * strings. A missing entry does not fail the build; it just makes a feature
 * quietly do less. This finds those holes.
 *
 * Usage:  node scripts/audit-data.js
 * Exit code 1 if any error-level gap is found, so it can gate a commit.
 */
const { execFileSync } = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");

const APP = path.join(__dirname, "..");
const OUT = fs.mkdtempSync(path.join(os.tmpdir(), "sbd-audit-"));

function compile() {
  const entries = [
    "src/data/techniques.ts",
    "src/data/technique-nerves.ts",
    "src/data/pediatric-dosing.ts",
    "src/data/combination-analysis.ts",
    "src/data/surgeries.ts",
    "src/data/reference-images.ts",
    "src/data/sono-anatomy.ts",
    "src/data/nerves.ts",
    "src/data/block-finder.ts",
    "src/data/block-technique.ts",
  ];
  execFileSync(
    "npx",
    [
      "tsc",
      "--ignoreConfig",
      ...entries,
      "--outDir",
      OUT,
      // Pinned so the output layout does not shift with the entry list: without
      // it tsc infers the common root, and adding a file outside src/data would
      // silently move everything.
      "--rootDir",
      "src",
      "--module",
      "commonjs",
      "--target",
      "es2020",
      "--moduleResolution",
      "bundler",
      "--skipLibCheck",
    ],
    { cwd: APP, stdio: ["ignore", "ignore", "pipe"] }
  );
}

const problems = [];
const add = (level, area, message) => problems.push({ level, area, message });

function main() {
  compile();
  const load = (name) => require(path.join(OUT, "data", name));

  const { TECHNIQUES } = load("techniques");
  const { TECHNIQUE_NERVES } = load("technique-nerves");
  const { TECHNIQUE_CATEGORY } = load("pediatric-dosing");
  const { NERVES } = load("nerves");
  const { SURGERIES } = load("surgeries");
  const { USG } = load("reference-images");
  const sono = load("sono-anatomy");

  const techIds = new Set(TECHNIQUES.map((t) => t.id));
  const nerveIds = new Set(NERVES.map((n) => n.id));

  // ---- Every technique is described in every table that should know it ----
  for (const t of TECHNIQUES) {
    if (!TECHNIQUE_NERVES[t.id]) {
      add("error", "sinir haritası", `${t.id} (${t.name}) TECHNIQUE_NERVES içinde yok`);
    }
    if (!TECHNIQUE_CATEGORY[t.id]) {
      add("error", "pediatrik kategori", `${t.id} (${t.name}) TECHNIQUE_CATEGORY içinde yok`);
    }
    const levels = t.coverage.levels ?? [];
    if (levels.length === 0) {
      add(
        "info",
        "dermatom seviyesi",
        `${t.id} segmental seviye tanımlamıyor — dermatom aramasında hiç çıkmaz`
      );
    }
  }

  // ---- Nerve ids referenced from the technique map must exist ----
  for (const [id, map] of Object.entries(TECHNIQUE_NERVES)) {
    if (!techIds.has(id)) {
      add("error", "sinir haritası", `TECHNIQUE_NERVES '${id}' diye bir teknik yok`);
    }
    for (const t of map.targets ?? []) {
      if (!nerveIds.has(t.nerve)) {
        add("error", "sinir", `${id} → tanımsız sinir '${t.nerve}'`);
      }
    }
    for (const n of map.commonlyMissed ?? []) {
      if (!nerveIds.has(n)) {
        add("error", "sinir", `${id} → commonlyMissed tanımsız sinir '${n}'`);
      }
    }
    if ((map.targets ?? []).length === 0 && TECHNIQUE_CATEGORY[id]?.category !== "not-covered") {
      add(
        "warn",
        "sinir haritası",
        `${id} hiçbir sinir hedeflemiyor ama pediatrik kategorisi 'not-covered' değil`
      );
    }
  }

  // ---- Nerve graph integrity ----
  for (const n of NERVES) {
    for (const p of n.parents ?? []) {
      if (!nerveIds.has(p)) add("error", "sinir", `${n.id} → tanımsız üst yapı '${p}'`);
    }
    if (!n.structural && !n.sensory && !n.motor) {
      add("warn", "sinir", `${n.id} (${n.name}) ne duyu ne motor alan tanımlıyor`);
    }
  }

  // ---- Category ids must be real techniques ----
  for (const id of Object.keys(TECHNIQUE_CATEGORY)) {
    if (!techIds.has(id)) {
      add("error", "pediatrik kategori", `TECHNIQUE_CATEGORY '${id}' diye bir teknik yok`);
    }
  }

  // ---- Surgery blocks: required clinical fields ----
  const surgeryBlockIds = new Set();
  for (const s of SURGERIES) {
    for (const b of s.blocks) {
      surgeryBlockIds.add(b.id);
      if (!b.score) add("error", "cerrahi", `${s.id}/${b.id} skor tanımlamıyor`);
      if (!b.coverage) add("error", "cerrahi", `${s.id}/${b.id} kapsama tanımlamıyor`);
      if (!b.contraindications || b.contraindications.length === 0) {
        add("warn", "cerrahi", `${s.id}/${b.id} kontrendikasyon listesi boş`);
      }
    }
    if (!s.combinations || s.combinations.length === 0) {
      add("info", "cerrahi", `${s.id} (${s.name}) hiç kombinasyon tanımlamıyor`);
    }
    if (!s.clinicalNote) {
      add("info", "cerrahi", `${s.id} (${s.name}) klinik not içermiyor`);
    }
  }

  // ---- Reference images still waiting for a source ----
  for (const [key, img] of Object.entries(USG)) {
    if (String(img.credit).includes("girilmedi")) {
      add("info", "görsel", `${img.key} — dosya/kaynak bekliyor (${key})`);
    }
  }

  // ---- Every surgery block resolves to a canonical technique ----
  const { BLOCK_TECHNIQUE } = load("block-technique");
  for (const id of surgeryBlockIds) {
    const techId = BLOCK_TECHNIQUE[id];
    if (!techId) {
      add("error", "blok eşlemesi", `${id} hiçbir kanonik tekniğe eşlenmemiş`);
    } else if (!techIds.has(techId)) {
      add("error", "blok eşlemesi", `${id} → '${techId}' diye bir teknik yok`);
    }
  }
  for (const id of Object.keys(BLOCK_TECHNIQUE)) {
    if (!surgeryBlockIds.has(id)) {
      add("warn", "blok eşlemesi", `BLOCK_TECHNIQUE '${id}' artık hiçbir cerrahide yok`);
    }
  }

  // ---- Landmark notes ----
  //
  // Checked through the mapping, not on the block: the text is authored once per
  // technique and the card falls back to it, so an empty `landmarkNote` on a
  // surgery block is the normal case rather than a gap.
  for (const t of TECHNIQUES) {
    if (!t.landmark) add("warn", "landmark", `${t.id} (${t.name}) landmark notu yok`);
  }
  for (const s2 of SURGERIES) {
    for (const b of s2.blocks) {
      const tech = techIds.has(BLOCK_TECHNIQUE[b.id]) ? BLOCK_TECHNIQUE[b.id] : null;
      const resolved =
        b.landmarkNote || (tech && TECHNIQUES.find((t) => t.id === tech)?.landmark);
      if (!resolved) {
        add("warn", "landmark", `${s2.id}/${b.id} için hiçbir kaynaktan landmark notu çözülmüyor`);
      }
    }
  }

  // ---- Illustration: a real capture, a schematic, or neither ----
  //
  // Sonoanatomy specs are keyed by *image key* (usg-…), not by technique id, so
  // comparing them against technique ids reported every technique as missing.
  // What actually matters is whether a declared image slot has something to
  // show — a photograph, a drawing, or nothing at all.
  const sonoKeys = new Set(Object.keys(sono.SONO_ANATOMY ?? {}));
  // block-images.ts pulls in react-native and resolves real .jpg files through
  // require(), so it cannot be loaded outside the bundler. Its registry keys are
  // read from the source text instead.
  const registrySrc = fs.readFileSync(path.join(APP, "src/data/block-images.ts"), "utf8");
  const registered = new Set(
    Array.from(registrySrc.matchAll(/^\s*"([a-z0-9-]+)":\s*require\(/gm), (m) => m[1])
  );
  for (const img of Object.values(USG)) {
    const hasPhoto = registered.has(img.key);
    const hasSchematic = sonoKeys.has(img.key);
    if (!hasPhoto && !hasSchematic) {
      add("warn", "görsel", `${img.key} — ne gerçek görüntü ne şematik çizim var`);
    } else if (!hasSchematic) {
      add("info", "sonoanatomi", `${img.key} için şematik çizim yok (gerçek görüntü var)`);
    }
  }
  for (const key of sonoKeys) {
    if (!Object.values(USG).some((i) => i.key === key)) {
      add("warn", "sonoanatomi", `SONO_ANATOMY '${key}' hiçbir görsel yuvasına karşılık gelmiyor`);
    }
  }

  // ---- Every technique should be illustrated, or say why not ----
  //
  // The earlier version only inspected declared image slots, so a technique
  // with no slot at all was invisible to it — which is how twelve new blocks
  // shipped with nothing to look at. Checked per technique now.
  //
  // Landmark techniques are exempt: drawing an "ultrasound view" of a block
  // performed by palpation would invent a picture that does not exist.
  const NO_ULTRASOUND_VIEW = new Set([
    "ivra",
    "digital",
    "scalp-block",
    "pudendal",
    "genicular",
    "port-site",
    "wound-infiltration",
    "tumescent",
    "penile",
    "ankle-block",
    "caudal",
    "saphenous",
    "ipack",
    "ilioinguinal",
    "rectus-sheath",
    "scpb",
    "suprascapular",
    "axillary-nerve",
    "axillary-plexus",
  ]);
  const { imagesForTechnique } = load("reference-images");
  for (const t of TECHNIQUES) {
    if (NO_ULTRASOUND_VIEW.has(t.id)) continue;
    const slots = imagesForTechnique(t.id);
    if (slots.length === 0) {
      add("warn", "görsel", `${t.id} (${t.name}) hiçbir görsel yuvası tanımlamıyor`);
      continue;
    }
    if (!slots.some((s) => sonoKeys.has(s.key) || registered.has(s.key))) {
      add("warn", "görsel", `${t.id} yuvası var ama ne çizim ne gerçek görüntü içeriyor`);
    }
  }

  // ---- Report ----
  const order = { error: 0, warn: 1, info: 2 };
  problems.sort((a, b) => order[a.level] - order[b.level] || a.area.localeCompare(b.area));

  const counts = { error: 0, warn: 0, info: 0 };
  let lastArea = null;
  for (const p of problems) {
    counts[p.level] += 1;
    const head = `${p.level.toUpperCase()} [${p.area}]`;
    if (head !== lastArea) {
      console.log("");
      lastArea = head;
    }
    console.log(`${head}  ${p.message}`);
  }

  console.log(
    `\n${counts.error} hata · ${counts.warn} uyarı · ${counts.info} bilgi (toplam ${problems.length})`
  );
  fs.rmSync(OUT, { recursive: true, force: true });
  process.exit(counts.error > 0 ? 1 : 0);
}

main();
