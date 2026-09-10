#!/usr/bin/env node
/**
 * Bir referans görselini tek adımda uygulamaya ekler.
 *
 * Görsel eklemek elle yapıldığında üç ayrı yeri tutturmak gerekiyordu: dosyayı
 * assets/reference altına koymak, block-images.ts içine require() satırı
 * yazmak ve reference-images.ts içindeki kaynak/lisans alanını doldurmak.
 * Üçüncüsü unutulduğunda görsel yayına atıfsız çıkar — bu yüzden script
 * kaynak bilgisini zorunlu tutar ve üç adımı birlikte yapar.
 *
 * Kullanım:
 *
 *   node scripts/add-reference-image.js --list
 *   node scripts/add-reference-image.js <dosya> --key usg-tap \
 *        --credit "Kendi arşivim — Dr. Ad Soyad, 2026" \
 *        [--caption "USG — ..."] [--noncommercial] [--force]
 *
 * --noncommercial, satıra @noncommercial işaretini koyar; ticari sürüm
 * hazırlanırken strip-noncommercial-assets.sh o satırları ve dosyaları
 * birlikte kaldırır. Kendi çektiğiniz görsellerde bu işaret gerekmez.
 */

const fs = require("fs");
const path = require("path");

const APP = path.resolve(__dirname, "..");
const REGISTRY = path.join(APP, "src/data/block-images.ts");
const DECLARATIONS = path.join(APP, "src/data/reference-images.ts");
const ASSETS = path.join(APP, "assets/reference");
const ALLOWED_EXT = new Set([".jpg", ".jpeg", ".png"]);

function fail(message) {
  console.error(`hata: ${message}`);
  process.exit(1);
}

function parseArgs(argv) {
  const args = { _: [] };
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === "--noncommercial") args.noncommercial = true;
    else if (token === "--force") args.force = true;
    else if (token === "--list") args.list = true;
    else if (token.startsWith("--")) {
      const value = argv[i + 1];
      if (value === undefined || value.startsWith("--")) fail(`${token} bir değer bekliyor`);
      args[token.slice(2)] = value;
      i += 1;
    } else args._.push(token);
  }
  return args;
}

/** Kayıtlı (yani dosyası olan) anahtarlar. */
function registeredKeys(source) {
  return new Set([...source.matchAll(/"([\w-]+)":\s*require\(/g)].map((m) => m[1]));
}

/**
 * Bir nesne girdisinin metindeki sınırlarını bulur.
 *
 * `key: "usg-tap"` satırından geriye doğru en yakın `{`, sonra süslü parantez
 * sayarak kapanışı. Düz regex'le yapılmıyor, çünkü caption alanları satır
 * kaydırıldığında girdinin şekli değişiyor.
 */
function entryRange(source, key) {
  const marker = source.indexOf(`key: "${key}"`);
  if (marker === -1) return null;
  const start = source.lastIndexOf("{", marker);
  let depth = 0;
  for (let i = start; i < source.length; i += 1) {
    if (source[i] === "{") depth += 1;
    else if (source[i] === "}") {
      depth -= 1;
      if (depth === 0) return { start, end: i + 1 };
    }
  }
  return null;
}

const VALUE = String.raw`(?:CREDIT_PENDING|JCM_2024\([^)]*\)|"(?:[^"\\]|\\.)*")`;

function replaceField(entry, field, value) {
  const pattern = new RegExp(`${field}:\\s*${VALUE}\\s*,`);
  if (!pattern.test(entry)) return null;
  // Fonksiyon biçimi: kaynak metni kullanıcıdan geliyor ve içinde `$&` gibi
  // bir dizi geçerse, düz string değişimi onu özel anlamıyla yorumlayıp
  // dosyanın başka bir parçasını metnin içine kopyalar.
  return entry.replace(pattern, () => `${field}: ${JSON.stringify(value)},`);
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const declarations = fs.readFileSync(DECLARATIONS, "utf8");
  const registry = fs.readFileSync(REGISTRY, "utf8");
  const registered = registeredKeys(registry);

  const declared = [...declarations.matchAll(/key: "([\w-]+)"/g)].map((m) => m[1]);

  if (args.list || args._.length === 0) {
    const pending = declared.filter((key) => !registered.has(key));
    console.log(`Kayıtlı görsel: ${registered.size} · bekleyen yuva: ${pending.length}\n`);
    for (const key of pending) {
      const range = entryRange(declarations, key);
      const caption = range
        ? (declarations.slice(range.start, range.end).match(/caption:\s*"((?:[^"\\]|\\.)*)"/) ?? [])[1]
        : undefined;
      console.log(`  ${key}\n    ${caption ?? ""}`);
    }
    if (!args.list) {
      console.log("\nEklemek için: node scripts/add-reference-image.js <dosya> --key <anahtar> --credit \"<kaynak>\"");
    }
    return;
  }

  const [file] = args._;
  const key = args.key;
  const credit = args.credit;

  if (!key) fail("--key gerekli (bekleyen yuvalar için --list)");
  if (!credit) fail("--credit gerekli: görselin kaynağı ve lisansı. Kaynaksız görsel eklenemez.");
  if (!fs.existsSync(file)) fail(`dosya bulunamadı: ${file}`);

  const ext = path.extname(file).toLowerCase();
  if (!ALLOWED_EXT.has(ext)) fail(`desteklenmeyen biçim: ${ext} (jpg veya png olmalı)`);

  const range = entryRange(declarations, key);
  if (!range) {
    fail(
      `"${key}" reference-images.ts içinde tanımlı değil.\n` +
        `       Bekleyen yuvalar için: node scripts/add-reference-image.js --list\n` +
        `       Yeni bir teknik için önce oraya bir yuva (key + caption) ekleyin.`
    );
  }
  if (registered.has(key) && !args.force) {
    fail(`"${key}" için zaten kayıtlı bir görsel var. Değiştirmek için --force ekleyin.`);
  }

  // 1. Dosya. Uzantı anahtarla birlikte kaydedilir; require() yolunda birebir
  //    aynı ad kullanılacağı için burada tahmin yürütülmez.
  const target = path.join(ASSETS, `${key}${ext === ".jpeg" ? ".jpg" : ext}`);
  fs.mkdirSync(ASSETS, { recursive: true });
  fs.copyFileSync(file, target);
  const sizeKb = Math.round(fs.statSync(target).size / 1024);

  // 2. Kaynak ve (verildiyse) açıklama.
  let entry = declarations.slice(range.start, range.end);
  const withCredit = replaceField(entry, "credit", credit);
  if (!withCredit) fail(`"${key}" girdisindeki credit alanı beklenen biçimde değil; elle düzenleyin.`);
  entry = withCredit;
  if (args.caption) {
    const withCaption = replaceField(entry, "caption", args.caption);
    if (!withCaption) fail(`"${key}" girdisindeki caption alanı beklenen biçimde değil; elle düzenleyin.`);
    entry = withCaption;
  }
  fs.writeFileSync(
    DECLARATIONS,
    declarations.slice(0, range.start) + entry + declarations.slice(range.end)
  );

  // 3. require() kaydı. Metro yolu derleme sırasında çözdüğü için satır
  //    birebir yazılmalıdır; değişkenden üretilemez.
  const marker = args.noncommercial ? " // @noncommercial" : "";
  const line = `  "${key}": require("../../assets/reference/${path.basename(target)}"),${marker}`;
  let nextRegistry = registry;
  if (registered.has(key)) {
    nextRegistry = registry.replace(new RegExp(`^ {2}"${key}":.*$`, "m"), () => line);
  } else {
    const SECTION = "\n  // Uygulamaya sonradan eklenen görseller.\n";
    if (!nextRegistry.includes(SECTION)) {
      nextRegistry = nextRegistry.replace(/\n};\n\nexport function getReferenceImage/, `\n${SECTION}};\n\nexport function getReferenceImage`);
    }
    nextRegistry = nextRegistry.replace(SECTION, () => `${SECTION}${line}\n`);
  }
  fs.writeFileSync(REGISTRY, nextRegistry);

  console.log(`eklendi: ${path.relative(APP, target)} (${sizeKb} KB)`);
  console.log(`  anahtar : ${key}`);
  console.log(`  kaynak  : ${credit}`);
  if (args.noncommercial) {
    console.log("  not     : @noncommercial işaretli — ticari sürümde strip script'i kaldırır.");
  }
  console.log("\nKontrol: npm run audit");
}

main();
