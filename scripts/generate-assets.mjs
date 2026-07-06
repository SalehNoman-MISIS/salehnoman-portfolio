/**
 * Generates all non-photographic assets for the portfolio:
 *   - branded SVG architecture diagrams for private/UI projects
 *   - favicon (SVG + .ico + PNG sizes) and apple-touch-icon
 *   - a 1200×630 Open Graph image
 *   - PWA manifest icons
 *   - copies résumé PDFs into /public
 *   - mirrors screenshots into /assets/screenshots (deliverable location)
 *
 * Run with:  npm run gen:assets
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
// Canonical source for generated diagrams + copied figures.
const SS = path.join(root, "assets", "screenshots");
const PUB = path.join(root, "public");

// ---------------------------------------------------------------------------
// Brand palette + SVG kit
// ---------------------------------------------------------------------------
const C = {
  accent: "#2E73B8",
  accentStrong: "#1F5FA6",
  navy: "#123E73",
  barStart: "#5B9BD5",
  barEnd: "#9AC6EC",
  tint: "#E8F2FC",
  card: "#F3F9FF",
  hairline: "#CBE0F5",
  ink: "#22303F",
  muted: "#5E6B7A",
  white: "#FFFFFF",
};
const FONT =
  "'Inter','Helvetica Neue',Helvetica,Arial,system-ui,sans-serif";
const W = 1040;
const H = 650;

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function textLines(x, y, lines, opts = {}) {
  const {
    size = 15,
    weight = 600,
    fill = C.navy,
    anchor = "middle",
    lh = 18,
  } = opts;
  const arr = Array.isArray(lines) ? lines : [lines];
  return arr
    .map(
      (l, i) =>
        `<text x="${x}" y="${y + i * lh}" font-family="${FONT}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}" dominant-baseline="middle">${esc(
          l,
        )}</text>`,
    )
    .join("");
}

/** rounded box with a bold title and optional sub-lines, vertically centered */
function box(x, y, w, h, title, opts = {}) {
  const {
    variant = "plain",
    sub = [],
    r = 14,
    titleSize = 16,
    subSize = 12,
  } = opts;
  let fill = C.white,
    stroke = C.hairline,
    tcol = C.navy,
    scol = C.muted,
    sw = 1.5;
  if (variant === "accent") {
    fill = C.accent;
    stroke = C.accentStrong;
    tcol = C.white;
    scol = "#DCEBFA";
  } else if (variant === "tint") {
    fill = C.tint;
    stroke = C.hairline;
  } else if (variant === "navy") {
    fill = C.navy;
    stroke = C.navy;
    tcol = C.white;
    scol = "#B9CEE8";
  }
  const subArr = Array.isArray(sub) ? sub : [sub];
  const hasSub = subArr.length > 0 && subArr[0];
  const cx = x + w / 2;
  const cy = y + h / 2;
  const titleY = hasSub ? cy - subArr.length * 7 : cy;
  let out = `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;
  out += textLines(cx, titleY, title, {
    size: titleSize,
    weight: 700,
    fill: tcol,
    lh: 19,
  });
  if (hasSub) {
    const subY = titleY + (Array.isArray(title) ? title.length : 1) * 18 + 2;
    out += textLines(cx, subY, subArr, {
      size: subSize,
      weight: 500,
      fill: scol,
      lh: 15,
    });
  }
  return out;
}

function arrow(x1, y1, x2, y2, opts = {}) {
  const { color = C.accent, dashed = false, width = 2.5 } = opts;
  const dash = dashed ? `stroke-dasharray="6 5"` : "";
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${width}" ${dash} marker-end="url(#ah)"/>`;
}

function chip(cx, cy, label, w = 150) {
  const x = cx - w / 2;
  return `<rect x="${x}" y="${cy - 15}" width="${w}" height="30" rx="15" fill="${C.white}" stroke="${C.hairline}" stroke-width="1.5"/>${textLines(
    cx,
    cy,
    label,
    { size: 12.5, weight: 600, fill: C.accentStrong },
  )}`;
}

function frame(title, sub, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${esc(
    title,
  )}">
  <defs>
    <marker id="ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M0 0 L10 5 L0 10 z" fill="${C.accent}"/>
    </marker>
    <linearGradient id="bar" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${C.barStart}"/><stop offset="1" stop-color="${C.barEnd}"/>
    </linearGradient>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="${C.card}"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" rx="20" fill="url(#bg)"/>
  <rect x="1" y="1" width="${W - 2}" height="${H - 2}" rx="19" fill="none" stroke="${C.hairline}" stroke-width="2"/>
  <rect x="34" y="40" width="6" height="30" rx="3" fill="${C.accent}"/>
  <text x="52" y="56" font-family="${FONT}" font-size="24" font-weight="800" fill="${C.navy}">${esc(title)}</text>
  ${sub ? `<text x="52" y="80" font-family="${FONT}" font-size="14" font-weight="500" fill="${C.muted}">${esc(sub)}</text>` : ""}
  ${body}
</svg>`;
}

// ---------------------------------------------------------------------------
// Diagrams
// ---------------------------------------------------------------------------
const diagrams = {};

// ---- AI Job Scraping Platform -------------------------------------------
diagrams["ai-job-scraping-platform/pipeline.svg"] = frame(
  "Ingestion pipeline",
  "From a job-board URL to a clean, deduplicated feed in the CMS",
  (() => {
    const steps = [
      { t: ["Source", "config"], s: "YAML / AI-built" },
      { t: ["Fetch"], s: "basic · stealth · PW" },
      { t: ["Parse"], s: "CSS selectors" },
      { t: ["Normalize"], s: "schema map" },
      { t: ["Dedupe +", "freshness"], s: "first / last seen" },
      { t: ["Directus", "CMS"], s: "load" },
    ];
    const n = steps.length;
    const bw = 148,
      bh = 92,
      gap = (W - 80 - bw * n) / (n - 1),
      y = 260;
    let out = "";
    steps.forEach((st, i) => {
      const x = 40 + i * (bw + gap);
      const variant = i === 0 ? "tint" : i === n - 1 ? "accent" : "plain";
      out += box(x, y, bw, bh, st.t, { sub: [st.s], variant });
      if (i < n - 1)
        out += arrow(x + bw + 6, y + bh / 2, x + bw + gap - 6, y + bh / 2);
    });
    out += textLines(W / 2, 200, "FastAPI + Playwright orchestration", {
      size: 14,
      weight: 600,
      fill: C.accentStrong,
    });
    out += `<rect x="40" y="410" width="${W - 80}" height="150" rx="14" fill="${C.tint}" stroke="${C.hairline}" stroke-width="1.5"/>`;
    out += textLines(W / 2, 440, "Quality gates at load time", {
      size: 14,
      weight: 700,
      fill: C.navy,
    });
    ["Schema validation", "Timestamp normalization", "Dedup rules", "Freshness tracking"].forEach(
      (c, i) => {
        out += chip(150 + i * 230, 505, c, 200);
      },
    );
    return out;
  })(),
);

diagrams["ai-job-scraping-platform/agent-builder.svg"] = frame(
  "Agentic source builder",
  "An LLM turns any URL into a validated scraper config",
  (() => {
    let out = "";
    out += box(60, 150, 200, 90, ["Paste job-", "board URL"], {
      variant: "tint",
    });
    out += box(340, 150, 220, 90, ["LLM agent", "(Claude / GPT)"], {
      variant: "accent",
      sub: ["drives a live browser"],
    });
    out += box(640, 150, 200, 90, ["Snapshot", "DOM"], {});
    out += box(640, 320, 200, 90, ["Infer listing +", "pagination"], {});
    out += box(340, 320, 220, 90, ["Validate", "against live"], {
      sub: ["retry if invalid"],
    });
    out += box(60, 320, 200, 100, ["SourceConfig", "✓ ready"], {
      variant: "navy",
      sub: ["opens in editor"],
    });
    out += arrow(260, 195, 335, 195);
    out += arrow(560, 195, 635, 195);
    out += arrow(740, 240, 740, 315);
    out += arrow(640, 365, 565, 365);
    out += arrow(340, 365, 265, 365);
    // feedback loop
    out += `<path d="M450 320 C 450 280, 450 250, 450 245" fill="none" stroke="${C.barStart}" stroke-width="2.5" stroke-dasharray="6 5" marker-end="url(#ah)"/>`;
    out += textLines(490, 285, "iterate", {
      size: 12,
      weight: 600,
      fill: C.muted,
      anchor: "start",
    });
    out += textLines(W / 2, 500, "Human reviews, tweaks, and accepts the generated source", {
      size: 14,
      weight: 500,
      fill: C.muted,
    });
    return out;
  })(),
);

diagrams["ai-job-scraping-platform/architecture.svg"] = frame(
  "System architecture",
  "FastAPI orchestration over Playwright fetchers and the LLM SDK",
  (() => {
    let out = "";
    out += box(320, 120, 400, 70, "Dashboard — Alpine.js", {
      variant: "tint",
      sub: ["Sources · Runs · Generate with AI"],
    });
    out += arrow(W / 2, 190, W / 2, 225);
    out += box(300, 230, 440, 74, "FastAPI server  (:8890)", {
      variant: "accent",
      sub: ["REST API · scheduling · health checks"],
    });
    const mods = [
      { t: ["Fetchers"], s: "basic·stealth·PW" },
      { t: ["LLM SDK"], s: "Claude / GPT" },
      { t: ["SQLite"], s: "sources · runs" },
    ];
    mods.forEach((m, i) => {
      const x = 90 + i * 300;
      out += box(x, 370, 260, 88, m.t, { sub: [m.s] });
      out += arrow(x + 130, 360, x + 130, 366);
      out += `<line x1="${W / 2}" y1="330" x2="${x + 130}" y2="360" stroke="${C.accent}" stroke-width="2"/>`;
    });
    out += box(360, 520, 320, 74, "Directus — headless CMS", {
      variant: "navy",
      sub: ["normalized jobs + companies"],
    });
    out += arrow(220, 458, 400, 520);
    return out;
  })(),
);

// ---- Data Enrichment Platform -------------------------------------------
diagrams["data-enrichment-platform/architecture.svg"] = frame(
  "System architecture",
  "React ↔ Flask ↔ Playwright / Scrapling ↔ CMS",
  (() => {
    let out = "";
    out += box(60, 250, 200, 100, ["React", "frontend"], {
      variant: "tint",
      sub: ["6-step wizard"],
    });
    out += box(360, 250, 220, 100, ["Flask API", "(:5001)"], {
      variant: "accent",
      sub: ["orchestrator"],
    });
    out += arrow(260, 300, 355, 300);
    out += arrow(355, 320, 260, 320, { color: C.barStart });
    const right = [
      { t: ["Playwright /", "Scrapling"], s: "crawl + extract", y: 120 },
      { t: ["Contact", "extractor"], s: "email·phone·social", y: 250 },
      { t: ["SMTP", "verifier"], s: "validate emails", y: 380 },
    ];
    right.forEach((r) => {
      out += box(680, r.y, 220, 96, r.t, { sub: [r.s] });
      out += arrow(580, 300, 675, r.y + 48);
    });
    out += box(360, 470, 220, 90, ["Directus", "CMS"], {
      variant: "navy",
      sub: ["read / push back"],
    });
    out += arrow(470, 350, 470, 465);
    return out;
  })(),
);

diagrams["data-enrichment-platform/wizard.svg"] = frame(
  "Guided enrichment wizard",
  "Non-developers go from a source to verified exports in six steps",
  (() => {
    const steps = ["Source", "Connect", "Fields", "Enrich", "Review", "Export"];
    const subs = [
      "CMS or URL list",
      "Directus auth",
      "map + filter",
      "crawl + verify",
      "results table",
      "JSON·CSV·TSV",
    ];
    let out = "";
    const bw = 150,
      bh = 120,
      n = steps.length;
    const gap = (W - 80 - bw * n) / (n - 1);
    const y = 250;
    steps.forEach((st, i) => {
      const x = 40 + i * (bw + gap);
      const variant = i === n - 1 ? "accent" : "plain";
      out += `<circle cx="${x + bw / 2}" cy="${y + 30}" r="19" fill="${
        i === n - 1 ? C.accent : C.tint
      }" stroke="${C.hairline}" stroke-width="1.5"/>`;
      out += textLines(x + bw / 2, y + 30, String(i + 1), {
        size: 17,
        weight: 800,
        fill: i === n - 1 ? C.white : C.accentStrong,
      });
      out += `<rect x="${x}" y="${y + 62}" width="${bw}" height="58" rx="12" fill="${
        variant === "accent" ? C.accent : C.white
      }" stroke="${variant === "accent" ? C.accentStrong : C.hairline}" stroke-width="1.5"/>`;
      out += textLines(x + bw / 2, y + 80, st, {
        size: 15,
        weight: 700,
        fill: variant === "accent" ? C.white : C.navy,
      });
      out += textLines(x + bw / 2, y + 100, subs[i], {
        size: 11.5,
        weight: 500,
        fill: variant === "accent" ? "#DCEBFA" : C.muted,
      });
      if (i < n - 1)
        out += arrow(x + bw + 4, y + 30, x + bw + gap - 4, y + 30, {
          width: 2,
        });
    });
    return out;
  })(),
);

diagrams["data-enrichment-platform/gmaps-finder.svg"] = frame(
  "Google-Maps website finder",
  "Backfills missing company websites before enrichment runs",
  (() => {
    let out = "";
    out += box(50, 260, 210, 110, ["CMS records", "missing website"], {
      variant: "tint",
      sub: ["Google Maps URL"],
    });
    out += box(330, 260, 240, 110, ["Visit listing", "(StealthyFetcher)"], {
      variant: "accent",
    });
    out += box(640, 260, 220, 110, ["Extract", "business website"], {});
    out += box(640, 430, 220, 90, ["Write back", "to Directus"], {
      variant: "navy",
    });
    out += arrow(260, 315, 325, 315);
    out += arrow(570, 315, 635, 315);
    out += arrow(750, 370, 750, 425);
    out += textLines(W / 2, 570, "Live progress · stop / resume support", {
      size: 14,
      weight: 500,
      fill: C.muted,
    });
    return out;
  })(),
);

// ---- Browser Automation Agents ------------------------------------------
diagrams["browser-automation-agents/flow-engine.svg"] = frame(
  "Flow Builder engine",
  "26 step types compose reusable browser agents into workflows",
  (() => {
    let out = "";
    const cats = [
      ["Variables", "set · read"],
      ["Conditions", "if / else"],
      ["Loops", "for-each"],
      ["Error handling", "try / catch"],
      ["run_agent", "embed agent"],
      ["run_flow", "sub-flows"],
    ];
    cats.forEach((c, i) => {
      const x = 60 + (i % 3) * 310;
      const y = 130 + Math.floor(i / 3) * 96;
      out += box(x, y, 280, 78, [c[0]], { sub: [c[1]], variant: "tint" });
    });
    out += box(300, 350, 440, 70, "Flow engine — ordered typed steps", {
      variant: "accent",
    });
    out += arrow(W / 2, 322, W / 2, 348);
    out += box(300, 470, 440, 84, ["7 reusable browser agents"], {
      variant: "navy",
      sub: ["results feed subsequent steps"],
    });
    out += arrow(W / 2, 420, W / 2, 468);
    return out;
  })(),
);

diagrams["browser-automation-agents/architecture.svg"] = frame(
  "System architecture",
  "Dashboard → Express → flow engine → Playwright, exposed to n8n",
  (() => {
    let out = "";
    out += box(320, 110, 400, 66, "Dashboard — Alpine.js", { variant: "tint" });
    out += arrow(W / 2, 176, W / 2, 208);
    out += box(300, 214, 440, 78, "Express server  (:4020)", {
      variant: "accent",
      sub: ["/n8n/execute · 3 modes · SSE logs"],
    });
    out += box(120, 360, 350, 96, ["Flow engine"], {
      sub: ["26 step types · variables · loops"],
    });
    out += box(570, 360, 350, 96, ["Agent functions"], {
      sub: ["register·login·search·post·…"],
    });
    out += arrow(400, 292, 300, 358);
    out += arrow(640, 292, 700, 358);
    out += box(300, 520, 440, 74, "Playwright — stealth Chromium", {
      variant: "navy",
      sub: ["in-memory sessions · 2h TTL"],
    });
    out += arrow(295, 456, 430, 520);
    out += arrow(745, 456, 610, 520);
    out += box(760, 214, 210, 78, ["n8n Cloud"], {
      sub: ["via ngrok tunnel"],
    });
    out += arrow(755, 253, 745, 253, { dashed: true });
    return out;
  })(),
);

diagrams["browser-automation-agents/agents.svg"] = frame(
  "Reusable browser agents",
  "Composable as steps inside any flow",
  (() => {
    const agents = [
      "Register",
      "Login",
      "Confirm email",
      "Search threads",
      "Post reply",
      "Create thread",
      "Generate comment",
    ];
    let out = "";
    agents.forEach((a, i) => {
      const cols = 4;
      const x = 70 + (i % cols) * 230;
      const y = 170 + Math.floor(i / cols) * 150;
      out += box(x, y, 200, 110, [a], {
        variant: i === 6 ? "accent" : "plain",
        sub: [`agent ${i + 1}`],
      });
    });
    out += textLines(W / 2, 590, "Each agent shares the running browser session", {
      size: 14,
      weight: 500,
      fill: C.muted,
    });
    return out;
  })(),
);

// ---- Backlink Price Aggregator ------------------------------------------
diagrams["backlink-price-aggregator/workflow.svg"] = frame(
  "Pricing workflow",
  "Every domain priced across five marketplaces, cheapest written to a Sheet",
  (() => {
    let out = "";
    out += box(50, 270, 180, 100, ["Domain list"], {
      variant: "tint",
      sub: ["from the Sheet"],
    });
    const markets = ["Domainboosting", "Whitepress DE", "Whitepress EN", "Trustfactory", "Bazoom"];
    markets.forEach((m, i) => {
      const y = 90 + i * 96;
      out += box(320, y, 220, 74, [m], { sub: ["price + availability"] });
      out += arrow(230, 320, 315, y + 37);
      out += arrow(540, y + 37, 625, 320);
    });
    out += box(630, 270, 180, 100, ["Pick", "cheapest"], { variant: "accent" });
    out += box(860, 270, 140, 100, ["Google", "Sheet"], { variant: "navy" });
    out += arrow(810, 320, 855, 320);
    return out;
  })(),
);

diagrams["backlink-price-aggregator/security.svg"] = frame(
  "Credential security",
  "PBKDF2 + Fernet — the master password is never stored",
  (() => {
    let out = "";
    out += box(60, 270, 200, 100, ["Master", "password"], {
      variant: "tint",
      sub: ["entered per session"],
    });
    out += box(330, 270, 200, 100, ["PBKDF2", "key derivation"], {});
    out += box(600, 270, 200, 100, ["Fernet", "encryption"], {
      variant: "accent",
    });
    out += box(600, 440, 200, 90, ["Credentials", "at rest"], {
      variant: "navy",
      sub: ["ciphertext only"],
    });
    out += arrow(260, 320, 325, 320);
    out += arrow(530, 320, 595, 320);
    out += arrow(700, 370, 700, 435);
    out += `<rect x="840" y="270" width="150" height="100" rx="14" fill="none" stroke="${C.hairline}" stroke-width="1.5" stroke-dasharray="6 5"/>`;
    out += textLines(915, 305, "Master pw", {
      size: 13,
      weight: 700,
      fill: C.muted,
    });
    out += textLines(915, 328, "never", { size: 13, weight: 700, fill: C.muted });
    out += textLines(915, 348, "persisted", {
      size: 13,
      weight: 700,
      fill: C.muted,
    });
    return out;
  })(),
);

diagrams["backlink-price-aggregator/architecture.svg"] = frame(
  "Architecture",
  "Local web UI over anti-detect browsers, synced to Google Sheets",
  (() => {
    let out = "";
    out += box(330, 120, 380, 70, "Local web UI  (:8765)", { variant: "tint" });
    out += arrow(W / 2, 190, W / 2, 224);
    out += box(320, 230, 400, 76, "Python backend", {
      variant: "accent",
      sub: ["encrypted vault · per-platform rules"],
    });
    out += box(90, 380, 300, 100, ["Anti-detect browsers"], {
      sub: ["Camoufox · Incogniton"],
    });
    out += box(650, 380, 300, 100, ["Google Sheets API"], {
      sub: ["service account"],
    });
    out += arrow(400, 306, 260, 378);
    out += arrow(640, 306, 780, 378);
    out += box(330, 540, 380, 66, "Packaged .exe — GitHub Actions CI", {
      variant: "navy",
    });
    out += arrow(W / 2, 480, W / 2, 538, { color: C.barStart, dashed: true });
    return out;
  })(),
);

// ---- Gender Prediction Model --------------------------------------------
diagrams["gender-prediction-model/pipeline.svg"] = frame(
  "End-to-end ML pipeline",
  "Multi-source ingestion to a macro-F1-tuned classifier",
  (() => {
    let out = "";
    const sources = ["train", "test", "labels", "geo", "referer vec"];
    sources.forEach((s, i) => {
      out += box(50, 110 + i * 82, 150, 62, [s], { variant: "tint" });
      out += arrow(200, 141 + i * 82, 255, 300);
    });
    out += box(260, 265, 170, 74, ["Merge"], { sub: ["join on keys"] });
    out += box(470, 265, 190, 74, ["Feature", "engineering"], {});
    out += box(700, 265, 220, 74, ["CatBoost /", "LightGBM"], {
      variant: "accent",
    });
    out += arrow(430, 302, 465, 302);
    out += arrow(660, 302, 695, 302);
    out += box(470, 430, 190, 80, ["k-fold CV +", "threshold tuning"], {});
    out += box(700, 430, 220, 80, ["macro-F1", "objective"], {
      variant: "navy",
    });
    out += arrow(810, 339, 810, 428);
    out += arrow(660, 470, 695, 470);
    out += arrow(560, 339, 560, 428);
    return out;
  })(),
);

diagrams["gender-prediction-model/roc-pr.svg"] = frame(
  "Model evaluation",
  "ROC and precision–recall versus baseline",
  (() => {
    let out = "";
    const plot = (ox, oy, w, h, title, curveUp) => {
      let s = `<rect x="${ox}" y="${oy}" width="${w}" height="${h}" rx="10" fill="${C.white}" stroke="${C.hairline}" stroke-width="1.5"/>`;
      // axes
      s += `<line x1="${ox + 40}" y1="${oy + h - 34}" x2="${ox + w - 20}" y2="${oy + h - 34}" stroke="${C.muted}" stroke-width="1.5"/>`;
      s += `<line x1="${ox + 40}" y1="${oy + 20}" x2="${ox + 40}" y2="${oy + h - 34}" stroke="${C.muted}" stroke-width="1.5"/>`;
      // gridlines
      for (let i = 1; i <= 3; i++) {
        const gy = oy + 20 + ((h - 54) / 4) * i;
        s += `<line x1="${ox + 40}" y1="${gy}" x2="${ox + w - 20}" y2="${gy}" stroke="${C.tint}" stroke-width="1"/>`;
      }
      const x0 = ox + 40,
        y0 = oy + h - 34,
        x1 = ox + w - 20,
        y1 = oy + 22;
      // baseline: diagonal for ROC, horizontal for PR
      if (curveUp) {
        s += `<line x1="${x0}" y1="${y0}" x2="${x1}" y2="${y1}" stroke="${C.muted}" stroke-width="1.5" stroke-dasharray="5 4"/>`;
      } else {
        const by = y0 - (y0 - y1) * 0.32;
        s += `<line x1="${x0}" y1="${by}" x2="${x1}" y2="${by}" stroke="${C.muted}" stroke-width="1.5" stroke-dasharray="5 4"/>`;
      }
      // model curve
      const c = curveUp
        ? `M${x0} ${y0} C ${x0 + 40} ${y1 + 10}, ${x0 + 90} ${y1}, ${x1} ${y1}`
        : `M${x0} ${y1} C ${ox + w * 0.55} ${y1}, ${x1 - 40} ${y1 + (y0 - y1) * 0.4}, ${x1} ${y0}`;
      s += `<path d="${c}" fill="none" stroke="url(#bar)" stroke-width="4"/>`;
      s += textLines(ox + w / 2, oy + 12, title, {
        size: 14,
        weight: 700,
        fill: C.navy,
      });
      return s;
    };
    out += plot(50, 120, 440, 420, "ROC curve", true);
    out += plot(550, 120, 440, 420, "Precision–Recall", false);
    out += chip(760, 585, "model", 120);
    out += `<line x1="180" y1="585" x2="230" y2="585" stroke="${C.muted}" stroke-width="2" stroke-dasharray="5 4"/>`;
    out += textLines(300, 585, "baseline", {
      size: 12.5,
      weight: 600,
      fill: C.muted,
    });
    return out;
  })(),
);

diagrams["gender-prediction-model/feature-importance.svg"] = frame(
  "Feature importance",
  "Which engineered signals drove the model",
  (() => {
    let out = "";
    const feats = [
      ["referer vector", 0.92],
      ["geo region", 0.74],
      ["session depth", 0.63],
      ["time-of-day", 0.51],
      ["category mix", 0.44],
      ["device class", 0.33],
      ["visit recency", 0.24],
    ];
    const x0 = 260,
      maxW = 680;
    feats.forEach((f, i) => {
      const y = 130 + i * 62;
      out += textLines(x0 - 18, y + 16, f[0], {
        size: 14,
        weight: 600,
        fill: C.navy,
        anchor: "end",
      });
      out += `<rect x="${x0}" y="${y}" width="${maxW}" height="32" rx="8" fill="${C.tint}"/>`;
      out += `<rect x="${x0}" y="${y}" width="${maxW * f[1]}" height="32" rx="8" fill="url(#bar)"/>`;
      out += textLines(x0 + maxW * f[1] + 24, y + 16, f[1].toFixed(2), {
        size: 12.5,
        weight: 700,
        fill: C.accentStrong,
        anchor: "start",
      });
    });
    return out;
  })(),
);

// ---- Tutoring Website ---------------------------------------------------
diagrams["tutoring-website/architecture.svg"] = frame(
  "Architecture",
  "A static front end talking directly to Supabase (Postgres)",
  (() => {
    let out = "";
    out += box(120, 260, 260, 120, ["Static front end", "(React)"], {
      variant: "tint",
      sub: ["services · about · booking"],
    });
    out += box(650, 260, 280, 120, ["Supabase"], {
      variant: "accent",
      sub: ["Postgres · Auth · REST"],
    });
    out += arrow(380, 300, 645, 300);
    out += arrow(645, 340, 380, 340, { color: C.barStart });
    out += textLines(512, 292, "book lesson", {
      size: 12.5,
      weight: 600,
      fill: C.muted,
    });
    out += textLines(512, 355, "confirmation", {
      size: 12.5,
      weight: 600,
      fill: C.muted,
    });
    out += box(650, 450, 280, 80, ["bookings table"], {
      variant: "navy",
      sub: ["defined SQL schema"],
    });
    out += arrow(790, 380, 790, 448);
    out += textLines(250, 470, "Zero backend to maintain", {
      size: 14,
      weight: 600,
      fill: C.accentStrong,
    });
    return out;
  })(),
);

diagrams["tutoring-website/mockup.svg"] = frame(
  "Responsive layout",
  "Desktop and mobile views of the booking site",
  (() => {
    let out = "";
    // desktop browser mock
    out += `<rect x="60" y="120" width="560" height="420" rx="14" fill="${C.white}" stroke="${C.hairline}" stroke-width="2"/>`;
    out += `<rect x="60" y="120" width="560" height="40" rx="14" fill="${C.tint}"/>`;
    out += `<rect x="60" y="150" width="560" height="10" fill="${C.tint}"/>`;
    ["#E06C6C", "#E8B84B", "#5FB47A"].forEach((c, i) => {
      out += `<circle cx="${86 + i * 22}" cy="140" r="6" fill="${c}"/>`;
    });
    out += `<rect x="90" y="185" width="230" height="26" rx="6" fill="${C.navy}"/>`;
    out += `<rect x="90" y="225" width="330" height="12" rx="6" fill="${C.hairline}"/>`;
    out += `<rect x="90" y="245" width="290" height="12" rx="6" fill="${C.hairline}"/>`;
    out += `<rect x="90" y="285" width="150" height="40" rx="20" fill="${C.accent}"/>`;
    out += textLines(165, 305, "Book a lesson", {
      size: 13,
      weight: 700,
      fill: C.white,
    });
    [0, 1, 2].forEach((i) => {
      out += `<rect x="${90 + i * 165}" y="360" width="145" height="150" rx="12" fill="${C.card}" stroke="${C.hairline}" stroke-width="1.5"/>`;
      out += `<circle cx="${120 + i * 165}" cy="392" r="14" fill="${C.barStart}"/>`;
      out += `<rect x="${102 + i * 165}" y="420" width="120" height="10" rx="5" fill="${C.hairline}"/>`;
      out += `<rect x="${102 + i * 165}" y="440" width="90" height="10" rx="5" fill="${C.hairline}"/>`;
    });
    // phone mock
    out += `<rect x="720" y="150" width="220" height="400" rx="26" fill="${C.white}" stroke="${C.hairline}" stroke-width="2"/>`;
    out += `<rect x="720" y="150" width="220" height="54" rx="26" fill="${C.navy}"/>`;
    out += textLines(830, 180, "Tutoring", {
      size: 15,
      weight: 800,
      fill: C.white,
    });
    out += `<rect x="748" y="230" width="164" height="90" rx="12" fill="${C.tint}"/>`;
    out += `<rect x="770" y="252" width="120" height="12" rx="6" fill="${C.accent}"/>`;
    out += `<rect x="770" y="276" width="90" height="10" rx="5" fill="${C.hairline}"/>`;
    out += `<rect x="770" y="294" width="100" height="10" rx="5" fill="${C.hairline}"/>`;
    out += `<rect x="748" y="340" width="164" height="44" rx="22" fill="${C.accent}"/>`;
    out += textLines(830, 362, "Book now", {
      size: 13,
      weight: 700,
      fill: C.white,
    });
    [0, 1].forEach((i) => {
      out += `<rect x="748" y="${404 + i * 62}" width="164" height="50" rx="10" fill="${C.card}" stroke="${C.hairline}" stroke-width="1.5"/>`;
    });
    return out;
  })(),
);

// ---------------------------------------------------------------------------
// Favicon / OG / manifest
// ---------------------------------------------------------------------------
function monogramSvg(size, rounded = true) {
  const r = rounded ? Math.round(size * 0.22) : 0;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="${C.barStart}"/><stop offset="1" stop-color="${C.accentStrong}"/>
  </linearGradient></defs>
  <rect width="${size}" height="${size}" rx="${r}" fill="url(#g)"/>
  <text x="50%" y="53%" font-family="${FONT}" font-size="${Math.round(
    size * 0.5,
  )}" font-weight="800" fill="#ffffff" text-anchor="middle" dominant-baseline="central" letter-spacing="-1">SN</text>
</svg>`;
}

function ogSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#EAF4FE"/><stop offset="1" stop-color="#FFFFFF"/>
    </linearGradient>
    <linearGradient id="mono" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${C.barStart}"/><stop offset="1" stop-color="${C.accentStrong}"/>
    </linearGradient>
    <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
      <path d="M48 0H0V48" fill="none" stroke="#2E73B8" stroke-opacity="0.06" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#grid)"/>
  <circle cx="1090" cy="70" r="230" fill="#5B9BD5" opacity="0.14"/>
  <circle cx="120" cy="600" r="180" fill="#9AC6EC" opacity="0.16"/>
  <rect x="80" y="86" width="96" height="96" rx="22" fill="url(#mono)"/>
  <text x="128" y="140" font-family="${FONT}" font-size="52" font-weight="800" fill="#ffffff" text-anchor="middle">SN</text>
  <text x="196" y="128" font-family="${FONT}" font-size="30" font-weight="700" fill="${C.accentStrong}">Saleh Noman</text>
  <text x="196" y="164" font-family="${FONT}" font-size="19" font-weight="500" fill="${C.muted}">Moscow · M.Sc. Data Science (Red Diploma)</text>
  <text x="80" y="300" font-family="${FONT}" font-size="66" font-weight="800" fill="${C.navy}">Data Scientist &amp;</text>
  <text x="80" y="374" font-family="${FONT}" font-size="66" font-weight="800" fill="${C.navy}">Automation Engineer</text>
  <text x="80" y="430" font-family="${FONT}" font-size="25" font-weight="500" fill="${C.ink}">ML · web scraping · ETL · AI-assisted development</text>
  ${(() => {
    // flow the stat chips left-to-right with measured widths + a gap
    const chips = ["100% Fortune-500 ATS detection", "8+ shipped projects", "GPA 5.0 / 5.0"];
    let x = 80;
    return chips
      .map((t) => {
        const w = Math.round(t.length * 11.4 + 48);
        const el = `<rect x="${x}" y="486" width="${w}" height="52" rx="26" fill="#ffffff" stroke="${C.hairline}" stroke-width="2"/><text x="${
          x + w / 2
        }" y="519" font-family="${FONT}" font-size="20" font-weight="600" fill="${C.accentStrong}" text-anchor="middle">${t}</text>`;
        x += w + 20;
        return el;
      })
      .join("");
  })()}
  <rect x="0" y="614" width="1200" height="16" fill="${C.accent}"/>
</svg>`;
}

function ico(pngs) {
  // pngs: [{size, buf}]
  const count = pngs.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(count, 4);
  const dir = Buffer.alloc(16 * count);
  let offset = 6 + 16 * count;
  const bodies = [];
  pngs.forEach((p, i) => {
    const d = dir.subarray(i * 16, i * 16 + 16);
    d.writeUInt8(p.size >= 256 ? 0 : p.size, 0);
    d.writeUInt8(p.size >= 256 ? 0 : p.size, 1);
    d.writeUInt8(0, 2);
    d.writeUInt8(0, 3);
    d.writeUInt16LE(1, 4);
    d.writeUInt16LE(32, 6);
    d.writeUInt32LE(p.buf.length, 8);
    d.writeUInt32LE(offset, 12);
    offset += p.buf.length;
    bodies.push(p.buf);
  });
  return Buffer.concat([header, dir, ...bodies]);
}

// ---------------------------------------------------------------------------
async function main() {
  // 1. diagrams
  let count = 0;
  for (const [rel, svg] of Object.entries(diagrams)) {
    const out = path.join(SS, rel);
    await fs.mkdir(path.dirname(out), { recursive: true });
    await fs.writeFile(out, svg.trim() + "\n", "utf8");
    count++;
  }
  console.log(`✓ ${count} branded SVG diagrams`);

  await fs.mkdir(PUB, { recursive: true });

  // 2. favicon.svg + apple touch + png icons
  await fs.writeFile(path.join(PUB, "favicon.svg"), monogramSvg(64), "utf8");
  const iconSizes = [16, 32, 48, 180, 192, 512];
  const pngBufs = {};
  for (const s of iconSizes) {
    pngBufs[s] = await sharp(Buffer.from(monogramSvg(s)))
      .resize(s, s)
      .png()
      .toBuffer();
  }
  await fs.writeFile(path.join(PUB, "apple-touch-icon.png"), pngBufs[180]);
  await fs.writeFile(path.join(PUB, "icon-192.png"), pngBufs[192]);
  await fs.writeFile(path.join(PUB, "icon-512.png"), pngBufs[512]);
  await fs.writeFile(path.join(PUB, "favicon-32.png"), pngBufs[32]);
  await fs.writeFile(
    path.join(PUB, "favicon.ico"),
    ico([
      { size: 16, buf: pngBufs[16] },
      { size: 32, buf: pngBufs[32] },
      { size: 48, buf: pngBufs[48] },
    ]),
  );
  console.log("✓ favicon set (svg, ico, png, apple-touch)");

  // 3. OG image
  await sharp(Buffer.from(ogSvg()))
    .png()
    .toFile(path.join(PUB, "og-image.png"));
  console.log("✓ og-image.png (1200×630)");

  // 4. résumé PDFs → public/resume
  const resumeSrc = path.join(root, "assets", "resume");
  const resumeDst = path.join(PUB, "resume");
  await fs.mkdir(resumeDst, { recursive: true });
  for (const f of await fs.readdir(resumeSrc)) {
    if (f.toLowerCase().endsWith(".pdf")) {
      await fs.copyFile(path.join(resumeSrc, f), path.join(resumeDst, f));
    }
  }
  console.log("✓ résumé PDFs copied to public/resume");

  // 5. headshot placeholder (only if a real one hasn't been dropped in)
  const headshotPath = path.join(PUB, "headshot.png");
  const headshotSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${C.barStart}"/><stop offset="1" stop-color="${C.accentStrong}"/></linearGradient>
    <linearGradient id="fig" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF" stop-opacity="0.95"/><stop offset="1" stop-color="${C.tint}" stop-opacity="0.9"/></linearGradient>
  </defs>
  <rect width="600" height="600" fill="url(#bg)"/>
  <circle cx="300" cy="240" r="96" fill="url(#fig)"/>
  <path d="M132 520 c0 -104 75 -168 168 -168 c93 0 168 64 168 168 z" fill="url(#fig)"/>
  <circle cx="510" cy="90" r="120" fill="#ffffff" opacity="0.08"/>
  <circle cx="80" cy="540" r="90" fill="#ffffff" opacity="0.07"/>
</svg>`;
  const hasHeadshot = await fs
    .access(headshotPath)
    .then(() => true)
    .catch(() => false);
  if (hasHeadshot) {
    console.log("• headshot already exists — leaving it in place");
  } else {
    await sharp(Buffer.from(headshotSvg)).png().toFile(headshotPath);
    console.log("✓ headshot placeholder (public/headshot.png)");
  }

  // 6. mirror screenshots into public/screenshots (served by Next.js)
  const served = path.join(PUB, "screenshots");
  async function copyDir(src, dst) {
    await fs.mkdir(dst, { recursive: true });
    for (const e of await fs.readdir(src, { withFileTypes: true })) {
      const s = path.join(src, e.name);
      const d = path.join(dst, e.name);
      if (e.isDirectory()) await copyDir(s, d);
      else await fs.copyFile(s, d);
    }
  }
  await copyDir(SS, served);
  console.log("✓ mirrored screenshots to public/screenshots");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
