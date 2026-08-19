#!/usr/bin/env node
/**
 * Builds src/data/font-categories/{movie,music,game,logo,book}.json from the
 * Google Fonts catalog.
 *
 * Source precedence:
 *   1. If $GOOGLE_FONTS_API_KEY is set, fetch the Developer API
 *      (https://www.googleapis.com/webfonts/v1/webfonts?key=...).
 *   2. Otherwise try the public metadata endpoint
 *      (https://fonts.google.com/metadata/fonts) which is auth-free.
 *   3. Otherwise fall back to the embedded curated list (./fallback-catalog.mjs).
 *
 * Raw response is cached at scripts/.cache/webfonts.json (git-ignored).
 *
 * Buckets the families into our 5 intent categories using a mix of:
 *   - Google's `category` taxonomy (serif / sans-serif / display / handwriting / monospace)
 *   - Name pattern overrides (e.g., "Press Start 2P" → game)
 *   - Hard-coded famous-font hints
 *
 * Each output entry: { slug, family, category, googleQuery, stack }
 */

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { FALLBACK_CATALOG } from "./fallback-catalog.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const CACHE_FILE = resolve(__dirname, ".cache", "webfonts.json");
const OUT_DIR = resolve(ROOT, "src", "data", "font-categories");

const CATEGORIES = ["movie", "music", "game", "logo", "book"];

const PER_CATEGORY = 200;

/** Pattern overrides - applied before the Google taxonomy bucket. */
const NAME_OVERRIDES = [
  { test: /(press\s*start|pixel|vt323|silkscreen|jersey|kode\s*mono|major\s*mono|workbench|honk|sixtyfour|nabla|orbitron|tourney|audiowide|bungee|monoton|wallpoet|black\s*ops|faster\s*one|joti|rubik\s*pixels|rubik\s*glitch|rubik\s*bubbles|rubik\s*broken|rubik\s*microbe|rubik\s*moonrocks|rubik\s*puddles|rubik\s*scribble|rubik\s*spray|rubik\s*storm|rubik\s*vinyl|rubik\s*wet|rubik\s*beastly|rubik\s*lines|geo|special\s*elite|share\s*tech\s*mono|cutive\s*mono)/i, category: "game" },
  { test: /(pacifico|lobster|allura|great\s*vibes|dancing\s*script|sacramento|satisfy|kaushan|cookie|tangerine|parisienne|alex\s*brush|yellowtail|niconne|euphoria|grand\s*hotel|leckerli|kalam|caveat|shadows\s*into\s*light|amatic|patrick\s*hand|gloria\s*hallelujah|architects\s*daughter|covered\s*by\s*your\s*grace|nothing\s*you\s*could\s*do|over\s*the\s*rainbow|reenie\s*beanie|rock\s*salt|shadow\s*into\s*light|special\s*elite|swanky\s*and\s*moo\s*moo|the\s*girl\s*next\s*door|just\s*another\s*hand|loved\s*by\s*the\s*king)/i, category: "music" },
  { test: /(bebas|cinzel|oswald|creepster|monoton|playfair\s*display|abril\s*fatface|alfa\s*slab\s*one|anton|fjalla\s*one|big\s*shoulders|cormorant|prata|della\s*respira|gravitas\s*one|bowlby|black\s*ops|chango|gabarito|girassol|special\s*gothic|trade\s*winds|metal\s*mania|nosifer|butcherman|eater|jolly\s*lodger|new\s*rocker|piedra|pirata|rye)/i, category: "movie" },
  { test: /(inter|manrope|montserrat|poppins|nunito|raleway|rubik$|work\s*sans|space\s*grotesk|plus\s*jakarta|dm\s*sans|outfit|geist|figtree|onest|albert\s*sans|public\s*sans|epilogue|hanken|sora|urbanist|red\s*hat|barlow|karla|asap|chivo|exo|titillium|quicksand|comfortaa|cabin|hind|catamaran|josefin|libre\s*franklin|fira\s*sans|noto\s*sans$|source\s*sans)/i, category: "logo" },
];

async function fetchJson(url) {
  const res = await fetch(url, {
    headers: { "user-agent": "installfont-catalog/1.0" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText} for ${url}`);
  return res.json();
}

/** Returns array of { family, category, weights } from whichever source works. */
async function loadCatalog() {
  if (existsSync(CACHE_FILE)) {
    try {
      const cached = JSON.parse(await readFile(CACHE_FILE, "utf8"));
      if (Array.isArray(cached?.items) && cached.items.length > 0) {
        console.log(`[catalog] using cached ${cached.items.length} families from ${CACHE_FILE}`);
        return cached.items;
      }
    } catch {
      /* fall through */
    }
  }

  const key = process.env.GOOGLE_FONTS_API_KEY;
  if (key) {
    try {
      const url = `https://www.googleapis.com/webfonts/v1/webfonts?key=${key}&sort=popularity`;
      console.log("[catalog] fetching Google Fonts Developer API…");
      const json = await fetchJson(url);
      const items = (json.items ?? []).map((it) => ({
        family: it.family,
        category: it.category,
        weights: it.variants ?? ["regular"],
      }));
      await persistCache(items);
      return items;
    } catch (err) {
      console.warn(`[catalog] developer API failed: ${err.message}`);
    }
  }

  try {
    console.log("[catalog] fetching public metadata endpoint…");
    const json = await fetchJson("https://fonts.google.com/metadata/fonts");
    const families = json.familyMetadataList ?? json.familyList ?? [];
    if (families.length > 0) {
      const items = families.map((it) => ({
        family: it.family,
        category: it.category?.toLowerCase().replace(/\s+/g, "-") ?? "display",
        weights: Object.keys(it.fonts ?? {}),
      }));
      await persistCache(items);
      return items;
    }
  } catch (err) {
    console.warn(`[catalog] public metadata failed: ${err.message}`);
  }

  console.log(`[catalog] falling back to embedded list (${FALLBACK_CATALOG.length} families)`);
  return FALLBACK_CATALOG;
}

async function persistCache(items) {
  await mkdir(dirname(CACHE_FILE), { recursive: true });
  await writeFile(
    CACHE_FILE,
    JSON.stringify({ fetchedAt: new Date().toISOString(), items }, null, 2),
    "utf8",
  );
  console.log(`[catalog] cached ${items.length} families at ${CACHE_FILE}`);
}

function slugify(label) {
  return label
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function fallbackForCategory(cat) {
  switch (cat) {
    case "book":
      return "serif";
    case "music":
    case "movie":
    case "game":
      return "system-ui";
    case "logo":
    default:
      return "sans-serif";
  }
}

function googleStackFor(family, cat) {
  return `'${family}', ${fallbackForCategory(cat)}`;
}

function bucketize(items) {
  const buckets = { movie: [], music: [], game: [], logo: [], book: [] };
  const seen = new Set();

  // Pass 1: name pattern overrides
  for (const it of items) {
    const override = NAME_OVERRIDES.find((rule) => rule.test.test(it.family));
    if (override && !seen.has(it.family)) {
      buckets[override.category].push(it);
      seen.add(it.family);
    }
  }

  // Pass 2: Google taxonomy fallbacks
  for (const it of items) {
    if (seen.has(it.family)) continue;
    const gcat = (it.category || "").toLowerCase();
    let target = null;
    if (gcat === "serif") target = "book";
    else if (gcat === "sans-serif") target = "logo";
    else if (gcat === "display") target = "movie";
    else if (gcat === "handwriting") target = "music";
    else if (gcat === "monospace") target = "game";
    if (target) {
      buckets[target].push(it);
      seen.add(it.family);
    }
  }

  // Trim & pad to ~PER_CATEGORY entries each.
  const overflow = [];
  for (const cat of CATEGORIES) {
    if (buckets[cat].length > PER_CATEGORY) {
      overflow.push(...buckets[cat].slice(PER_CATEGORY));
      buckets[cat] = buckets[cat].slice(0, PER_CATEGORY);
    }
  }
  for (const cat of CATEGORIES) {
    while (buckets[cat].length < PER_CATEGORY && overflow.length > 0) {
      buckets[cat].push(overflow.shift());
    }
  }

  return buckets;
}

function serialize(items, cat, takenSlugs) {
  return items.map((it) => {
    let slug = slugify(it.family);
    let suffix = 2;
    while (takenSlugs.has(slug)) {
      slug = `${slugify(it.family)}-${suffix++}`;
    }
    takenSlugs.add(slug);
    const familyParam = it.family.replace(/ /g, "+");
    return {
      slug,
      family: it.family,
      category: cat,
      googleQuery: `${familyParam}:wght@400`,
      stack: googleStackFor(it.family, cat),
    };
  });
}

async function main() {
  const items = await loadCatalog();
  if (!items || items.length === 0) {
    throw new Error("Empty catalog - refusing to write empty category files.");
  }

  const buckets = bucketize(items);
  await mkdir(OUT_DIR, { recursive: true });

  const takenSlugs = new Set();
  const summary = {};
  for (const cat of CATEGORIES) {
    const entries = serialize(buckets[cat], cat, takenSlugs);
    const file = resolve(OUT_DIR, `${cat}.json`);
    await writeFile(file, JSON.stringify(entries, null, 2) + "\n", "utf8");
    summary[cat] = entries.length;
    console.log(`[catalog] wrote ${entries.length} → ${file}`);
  }

  console.log("[catalog] done:", summary);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
