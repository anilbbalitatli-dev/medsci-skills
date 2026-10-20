#!/usr/bin/env node
/**
 * Folds `expo export --platform web` output into one self-contained HTML file.
 *
 * Usage:
 *   npx expo export --platform web
 *   node scripts/build-web-artifact.js [out.html]
 *
 * The result is meant to be opened from a static host that serves it at an
 * arbitrary nested path and blocks every cross-origin request, so everything
 * has to travel inside the file: the bundle is inlined as a script, and each
 * asset the bundle names by URL becomes a data: URI.
 *
 * The routing shim matters as much as the inlining. expo-router reads
 * `location.pathname` on boot to decide which route to render; served from
 * something like /_f/1786949082-3c10/ it sees a path that matches no route and
 * renders "Unmatched Route". Rewriting the visible path to "/" before the
 * bundle runs makes it resolve the index route as intended.
 */
const fs = require("fs");
const path = require("path");

const DIST = path.join(__dirname, "..", "dist");
const outPath = process.argv[2] ?? path.join(DIST, "surgical-block-dose.html");

const MIME = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ttf": "font/ttf",
  ".otf": "font/otf",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ico": "image/x-icon",
};

function dataUri(absPath) {
  const ext = path.extname(absPath).toLowerCase();
  const mime = MIME[ext] ?? "application/octet-stream";
  return `data:${mime};base64,${fs.readFileSync(absPath).toString("base64")}`;
}

function walk(dir) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

const html = fs.readFileSync(path.join(DIST, "index.html"), "utf8");

const scriptMatch = html.match(/<script src="(\/_expo\/[^"]+)"[^>]*><\/script>/);
if (!scriptMatch) {
  console.error("dist/index.html has no bundle <script> tag — did the export succeed?");
  process.exit(1);
}
const bundlePath = path.join(DIST, scriptMatch[1]);
let bundle = fs.readFileSync(bundlePath, "utf8");

// Assets are referenced by absolute URL inside the bundle; swap each one for
// its inline payload. Longest paths first so no replacement is a prefix of a
// path still waiting to be replaced.
const assets = walk(path.join(DIST, "assets")).sort((a, b) => b.length - a.length);
let inlined = 0;
for (const file of assets) {
  const url = "/" + path.relative(DIST, file).split(path.sep).join("/");
  if (!bundle.includes(url)) continue;
  bundle = bundle.split(url).join(dataUri(file));
  inlined += 1;
}

const faviconFile = path.join(DIST, "favicon.ico");
const favicon = fs.existsSync(faviconFile) ? dataUri(faviconFile) : null;

const shim = `<script>
// expo-router resolves the initial route from location.pathname. The artifact
// host serves this file from a nested path, so present "/" to the router while
// leaving the real URL in the address bar untouched for the user.
(function () {
  try {
    if (location.pathname !== "/") {
      history.replaceState(history.state, "", "/" + location.search + location.hash);
    }
  } catch (e) {}
})();
</script>`;

// Both replacements pass a function rather than a string. A string replacement
// would give `$&`, `$'` and `` $` `` their special meaning, and a minified
// bundle is full of `$` — that silently splices chunks of the surrounding HTML
// into the middle of the script and the page boots into raw source text.
let out = html
  .replace(scriptMatch[0], () => `${shim}\n<script>\n${bundle}\n</script>`)
  .replace(
    '<link rel="icon" href="/favicon.ico" />',
    () => (favicon ? `<link rel="icon" href="${favicon}" />` : "")
  );

fs.writeFileSync(outPath, out);

const mb = (Buffer.byteLength(out) / 1024 / 1024).toFixed(2);
console.log(`${outPath}  ${mb} MB  (${inlined} asset(s) inlined)`);
if (Buffer.byteLength(out) > 16 * 1024 * 1024) {
  console.error("Over the 16 MB artifact limit.");
  process.exit(1);
}
