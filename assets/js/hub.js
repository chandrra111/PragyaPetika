import { openLightbox } from "./lightbox.js";

const $ = (id) => document.getElementById(id);
export const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
export const EXT = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="12" height="12" aria-hidden="true" style="vertical-align:-1px;margin-left:3px"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`;
const debounce = (fn, ms = 120) => {
  let t;
  return (...a) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...a), ms);
  };
};
const tokens = (q) => q.toLowerCase().split(/\s+/).filter(Boolean);

const PALETTE = ["#8b5cf6", "#0ea5e9", "#14b8a6", "#f59e0b", "#ec4899", "#6366f1"];
const CAT_COLORS = { build: "#6366f1", agents: "#14b8a6", growth: "#f59e0b", ops: "#0ea5e9", know: "#8b5cf6", media: "#ec4899" };
const initial = (n) => (String(n).match(/[A-Za-z0-9]/) || ["?"])[0].toUpperCase();
const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function runCount(el) {
  const to = Number(el.dataset.n);
  if (reduceMotion) return void (el.textContent = to);
  el.textContent = 0;
  const t0 = performance.now();
  const tick = (t) => {
    const k = Math.min(1, (t - t0) / 1000);
    el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3)));
    if (k < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
  setTimeout(() => (el.textContent = to), 1250);
}
const countIO =
  "IntersectionObserver" in window
    ? new IntersectionObserver((entries, o) => entries.forEach((e) => e.isIntersecting && (runCount(e.target), o.unobserve(e.target))), { threshold: 0.3 })
    : null;
function statTiles(el, pairs) {
  el.innerHTML = pairs.map(([v, l]) => `<div class="stat-tile"><b data-n="${v}">${v}</b><span>${l}</span></div>`).join("");
  if (countIO) el.querySelectorAll("b").forEach((b) => countIO.observe(b));
}
/* Scrolling strip of clickable chips: each one runs a search in its hub. */
function marquee(el, hubKey, entries) {
  const chip = (e, dup) =>
    `<button type="button" class="hh-chip" data-hero-q="${esc(e.q)}" data-hero-p="${hubKey}"${dup ? ' tabindex="-1" aria-hidden="true"' : ""}>${esc(e.label)}</button>`;
  el.innerHTML = entries.map((e) => chip(e, false)).join("") + entries.map((e) => chip(e, true)).join("");
}
const HERO = { ai: { tab: "explore", sec: "ai" }, dbx: { tab: "dbx-updates", sec: "data" }, bi: { tab: "bi-updates", sec: "bi" } };
function showResults(p, scroll) {
  const { tab, sec } = HERO[p];
  const btn = document.querySelector(`#${sec} [data-tab="${tab}"]`);
  if (btn && !btn.classList.contains("active")) btn.click();
  if (scroll) document.querySelector(`#${sec} .hub-body`).scrollIntoView({ behavior: "smooth", block: "start" });
}
function wireHero() {
  document.querySelectorAll("[data-hero-q]").forEach((b) =>
    b.addEventListener("click", () => {
      const p = b.dataset.heroP;
      const inp = $(p + "Search");
      inp.value = b.dataset.heroQ;
      inp.dispatchEvent(new Event("input"));
      showResults(p, true);
    })
  );
  Object.keys(HERO).forEach((p) => {
    const inp = $(p + "Search");
    inp.addEventListener("input", () => showResults(p, false));
    inp.addEventListener("keydown", (e) => e.key === "Enter" && showResults(p, true));
  });
}

/* ---------- sharing helpers ---------- */
const SITE = "https://pragyapetika.com/";
const STATUS_NOTE = {
  GA: "Generally available.",
  Beta: "Beta: pilot it on non-critical work first.",
  Preview: "Preview: check limits in the official docs before relying on it.",
  Frontier: "Limited early access: not for general use yet.",
  Retiring: "Retirement: plan your move before it stops working.",
};
const TAGS = {
  dbx: { base: ["Databricks", "DataEngineering"], ai: ["GenAI", "AIAgents"], gov: ["UnityCatalog", "DataGovernance"], eng: ["Lakeflow", "DataPipelines"], share: ["DeltaLake", "OpenData"], bi: ["PowerBI", "Analytics"], plat: ["Serverless", "CloudData"] },
  bi: { base: ["PowerBI", "MicrosoftFabric"], ai: ["Copilot", "AI"], report: ["DataViz", "Reporting"], model: ["DAX", "SemanticModel"], gov: ["DataGovernance", "Analytics"], dev: ["DataOps", "PBIP"], conn: ["BusinessIntelligence", "Analytics"] },
};

export function toast(msg) {
  let t = document.getElementById("toast");
  if (!t) {
    t = document.createElement("div");
    t.id = "toast";
    t.className = "toast";
    t.setAttribute("role", "status");
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => t.classList.remove("show"), 2600);
}

export async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch (e) {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.cssText = "position:fixed;opacity:0";
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand("copy");
    } catch (err) {
      /* ignore */
    }
    ta.remove();
  }
  toast("Copied. Paste it into your LinkedIn post.");
}

/* A LinkedIn-ready post in the "hook, what's new, heads-up, why it matters, source" shape. */
export function updatePost({ item, story, feed }) {
  const lines = [`🚀 ${story ? story.hook : item.title}`, ""];
  if (story) story.bullets.forEach((b) => lines.push(`✅ ${b}`));
  else lines.push(item.summary);
  const note = story && story.watch ? story.watch : STATUS_NOTE[item.status];
  if (item.status !== "GA" || (story && story.watch)) lines.push(`⚠️ ${note}`);
  if (story) lines.push("", `💡 Why it matters: ${story.why}`);
  lines.push("", `Source: ${item.url}`, `More updates, summarised in plain language: ${SITE}#${feed.hash}`);
  const tags = [...TAGS[feed.p === "dbx" ? "dbx" : "bi"].base, ...(TAGS[feed.p === "dbx" ? "dbx" : "bi"][item.theme] || [])];
  lines.push("", tags.map((t) => "#" + t).join(" "));
  return lines.join("\n");
}

function toolPost(t, categoryLabel, similar) {
  const lines = [`🧰 AI tool spotlight: ${t.n}`, "", t.d, "", `✅ Category: ${categoryLabel}`];
  if (t.o) lines.push("✅ Open source");
  if (similar.length) lines.push(`✅ Similar tools: ${similar.map((s) => s.n).join(", ")}`);
  lines.push("⚠️ Check pricing, data terms and security before using any tool with company data.");
  lines.push("", `Browse the full searchable AI tools index: ${SITE}#ai`, "", "#AI #AITools #GenerativeAI #Productivity");
  return lines.join("\n");
}

export async function initHub() {
  try {
    const [dbx, bi, ai, st] = await Promise.all([import("../data/databricks.js"), import("../data/bi.js"), import("../data/ai-tools.js"), import("../data/stories.js")]);
    initFeed({
      p: "dbx",
      hash: "data",
      stories: st.dbxStories,
      themes: dbx.dbxThemes,
      rows: dbx.dbxUpdates.map(([theme, status, title, summary, url]) => ({ theme, status, title, summary, url })),
      linkLabel: "Official release notes",
      insights: dbx.dbxInsights,
      topics: dbx.dbxTopics,
      infographics: dbx.dbxInfographics,
      sources: [
        { name: "Databricks platform release notes", url: dbx.dbxReleaseNotes, lead: "Facts" },
        ...dbx.dbxSources.map((s) => ({ ...s, lead: "Reading list" })),
      ],
    });
    initFeed({
      p: "bi",
      hash: "bi",
      stories: st.biStories,
      themes: bi.biThemes,
      rows: bi.biUpdates.map(([theme, status, title, summary, src]) => ({ theme, status, title, summary, url: bi.biSources[src] })),
      linkLabel: "Official docs",
      insights: bi.biInsights,
      topics: bi.biTopics,
      infographics: bi.biInfographics,
      sources: [
        { name: "What's new in Power BI (Microsoft Learn)", url: bi.biSources.p, lead: "Facts" },
        { name: "Power BI monthly updates archive", url: bi.biSources.a, lead: "Facts" },
        { name: "What's new in Microsoft Fabric", url: bi.biSources.f, lead: "Facts" },
        ...bi.biNewsSources.map((s) => ({ ...s, lead: "Reading list" })),
      ],
    });
    initAI(ai);
    wireHero();
  } catch (err) {
    console.error("Hub failed to load", err);
    ["dbxList", "biList", "aiGrid"].forEach((id) => {
      const el = $(id);
      if (el) el.innerHTML = `<div class="empty-note">Couldn't load this section. Please refresh the page.</div>`;
    });
  }
}

/* ===================== Release digests (Databricks, Power BI) ===================== */
function initFeed({ p, hash, stories, themes, rows, linkLabel, insights, topics, infographics, sources }) {
  const id = (s) => $(p + s);
  const items = rows;
  const gaCount = items.filter((i) => i.status === "GA").length;
  const earlyCount = items.filter((i) => ["Beta", "Preview", "Frontier"].includes(i.status)).length;

  statTiles(id("Stats"), [
    [items.length, "curated updates"],
    [gaCount, "generally available"],
    [earlyCount, "in beta or preview"],
    [Object.keys(themes).length, "themes"],
  ]);
  marquee(
    id("Marquee"),
    p,
    [...stories.map((st) => items.find((i) => i.title === st.title)).filter(Boolean), ...items.filter((i) => i.status === "GA")]
      .filter((i, n, a) => a.indexOf(i) === n)
      .slice(0, 24)
      .map((i) => ({ label: i.title, q: i.title }))
  );

  const colorOf = {};
  Object.keys(themes).forEach((k, n) => (colorOf[k] = PALETTE[n % PALETTE.length]));

  /* ---------- Top stories: editorial briefs ---------- */
  const feed = { p, hash };
  const storyCards = stories
    .map((s) => ({ s, item: items.find((i) => i.title === s.title) }))
    .filter((x) => x.item);
  id("Stories").innerHTML = storyCards
    .map(({ s, item }, n) => {
      const warn = s.watch || (item.status !== "GA" ? STATUS_NOTE[item.status] : "");
      return `<article class="story${n === 0 ? " lead" : ""}" style="--c:${colorOf[item.theme]}" data-story="${n}">
        <div class="story-meta"><span class="theme-tag">${esc(themes[item.theme])}</span><span class="status s-${item.status.toLowerCase()}">${esc(item.status)}</span></div>
        <h3>${esc(s.hook)}</h3>
        <p class="story-title">${esc(item.title)}</p>
        <ul class="story-list">${s.bullets.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>
        ${warn ? `<p class="story-warn"><b>Heads-up.</b> ${esc(warn)}</p>` : ""}
        <p class="story-why"><b>Why it matters.</b> ${esc(s.why)}</p>
        <div class="story-who">${s.who.map((w) => `<span>${esc(w)}</span>`).join("")}</div>
        <div class="story-actions">
          <a href="${item.url}" target="_blank" rel="noopener noreferrer">${linkLabel}${EXT}</a>
          <button type="button" data-copy-story="${n}">Copy as LinkedIn post</button>
        </div>
      </article>`;
    })
    .join("");
  /* ---------- Spotlight strip above the full list ---------- */
  const spot = [];
  storyCards.forEach(({ s, item }) => {
    if (item.status === "GA" && spot.length < 3 && !spot.some((x) => x.item.theme === item.theme)) spot.push({ s, item });
  });
  Object.keys(themes).forEach((k) => {
    const hit = items.find((i) => i.theme === k && i.status === "GA");
    if (hit && spot.length < 3 && !spot.some((x) => x.item.theme === k)) spot.push({ s: stories.find((x) => x.title === hit.title), item: hit });
  });
  id("Spot").innerHTML = `<div class="spot-head"><h3>Spotlight</h3><span>Generally available and worth knowing</span></div><div class="spot-grid">${spot
    .map(
      ({ s, item }, n) => `<article class="spot-card" style="--c:${colorOf[item.theme]}">
        <span class="theme-tag">${esc(themes[item.theme])}</span>
        <h4>${esc(s ? s.hook : item.title)}</h4>
        <p>${esc(s ? s.bullets[0] : item.summary)}</p>
        <div class="spot-actions"><a href="${item.url}" target="_blank" rel="noopener noreferrer">${linkLabel}${EXT}</a><button type="button" data-copy-spot="${n}">Copy as LinkedIn post</button></div>
      </article>`
    )
    .join("")}</div>`;
  id("Spot").addEventListener("click", (e) => {
    const b = e.target.closest("[data-copy-spot]");
    if (!b) return;
    const { s, item } = spot[Number(b.dataset.copySpot)];
    copyText(updatePost({ item, story: s, feed }));
  });

  id("Stories").addEventListener("click", (e) => {
    const b = e.target.closest("[data-copy-story]");
    if (!b) return;
    const { s, item } = storyCards[Number(b.dataset.copyStory)];
    copyText(updatePost({ item, story: s, feed }));
  });

  const state = { theme: "all", status: "all", q: "", shown: 30 };
  const themeCounts = {};
  items.forEach((i) => (themeCounts[i.theme] = (themeCounts[i.theme] || 0) + 1));

  const chipBar = id("ThemeChips");
  chipBar.innerHTML =
    `<button type="button" class="fchip" data-theme="all" aria-pressed="true">All<span class="n">${items.length}</span></button>` +
    Object.entries(themes)
      .map(([k, label]) => `<button type="button" class="fchip" style="--c:${colorOf[k]}" data-theme="${k}" aria-pressed="false"><i class="dot"></i>${esc(label)}<span class="n">${themeCounts[k] || 0}</span></button>`)
      .join("");

  const statuses = [...new Set(items.map((i) => i.status))];
  id("Status").innerHTML = `<option value="all">All statuses</option>` + statuses.map((s) => `<option>${esc(s)}</option>`).join("");

  function filtered() {
    const tk = tokens(state.q);
    return items.filter(
      (i) =>
        (state.theme === "all" || i.theme === state.theme) &&
        (state.status === "all" || i.status === state.status) &&
        tk.every((t) => (i.title + " " + i.summary).toLowerCase().includes(t))
    );
  }

  function render() {
    const list = filtered();
    id("List").innerHTML =
      list
        .slice(0, state.shown)
        .map(
          (i) => `<li class="upd" style="--c:${colorOf[i.theme]}">
          <div class="upd-meta"><span class="theme-tag">${esc(themes[i.theme])}</span><span class="status s-${i.status.toLowerCase()}">${esc(i.status)}</span></div>
          <h4>${esc(i.title)}</h4>
          <p>${esc(i.summary)}</p>
          ${i.status !== "GA" && STATUS_NOTE[i.status] ? `<p class="upd-note">${esc(STATUS_NOTE[i.status])}</p>` : ""}
          <div class="upd-actions"><a href="${i.url}" target="_blank" rel="noopener noreferrer">${linkLabel}${EXT}</a><button type="button" data-copy-row="${items.indexOf(i)}">Copy as LinkedIn post</button></div></li>`
        )
        .join("") || `<li><div class="empty-note">No updates match those filters. Try clearing the search.</div></li>`;
    id("Count").textContent = `${list.length} of ${items.length} updates`;
    id("Spot").hidden = state.theme !== "all" || state.status !== "all" || !!state.q;
    id("More").hidden = list.length <= state.shown;
  }

  chipBar.addEventListener("click", (e) => {
    const b = e.target.closest(".fchip");
    if (!b) return;
    state.theme = b.dataset.theme;
    state.shown = 30;
    chipBar.querySelectorAll(".fchip").forEach((c) => c.setAttribute("aria-pressed", String(c === b)));
    render();
  });
  id("List").addEventListener("click", (e) => {
    const b = e.target.closest("[data-copy-row]");
    if (!b) return;
    const item = items[Number(b.dataset.copyRow)];
    const s = stories.find((x) => x.title === item.title);
    copyText(updatePost({ item, story: s, feed }));
  });
  id("Status").addEventListener("change", (e) => ((state.status = e.target.value), (state.shown = 30), render()));
  id("Search").addEventListener("input", debounce((e) => ((state.q = e.target.value.trim()), (state.shown = 30), render())));
  id("More").querySelector("button").addEventListener("click", () => ((state.shown += 30), render()));
  render();

  id("Insights").innerHTML = insights
    .map((t, i) => `<article class="card insight-card"><div class="num">0${i + 1}</div><h3>${esc(t.title)}</h3><p>${esc(t.body)}</p></article>`)
    .join("");

  id("Info").innerHTML = infographics
    .map(
      (g) => `<figure class="card info-card">
        <button type="button" class="thumb" data-id="${g.id}" aria-label="View ${esc(g.title)} full size">
          <img src="${g.file}.svg" width="1200" height="675" loading="lazy" alt="Infographic: ${esc(g.title)}">
        </button>
        <figcaption>
          <strong>${esc(g.title)}</strong>
          <p>${esc(g.caption)}</p>
          <div class="info-links"><a href="${g.file}.png" download>Download PNG</a><a href="${g.file}.svg" target="_blank" rel="noopener">Open SVG</a></div>
        </figcaption></figure>`
    )
    .join("");
  id("Info").addEventListener("click", (e) => {
    const b = e.target.closest("button.thumb");
    if (!b) return;
    const g = infographics.find((x) => x.id === b.dataset.id);
    openLightbox({ image: g.file + ".svg", title: g.title, subtitle: esc(g.caption), linkUrl: g.file + ".png", linkLabel: "Download PNG", wide: true, download: true });
  });

  id("Topics").innerHTML = topics
    .map((t) => `<article class="card topic-card"><div class="area">${esc(t.area)}</div><h3>${esc(t.title)}</h3><p>${esc(t.body)}</p><div class="from">Topic seen in: ${esc(t.from)}</div></article>`)
    .join("");

  id("Sources").innerHTML = sources
    .map((s) => `<li>${esc(s.lead)}: <a href="${s.url}" target="_blank" rel="noopener noreferrer">${esc(s.name)}</a></li>`)
    .join("");
}

/* ================================ AI ================================ */
const STOP = new Set(
  ("a an and are as at be by can for from get gets has have in into is it its just let lets like make makes more new no not of on one or out over per so that the their them then this to turn turns up use used uses using via what when which who will with within without you your yours about across after all also any app apps based before being between both but each every few how if instead may much other our own same several should some such than there these they those through too very was we were while ai tool tools work works helps help gives give built build builds lets one two three plus ready full real own way ways every most many without both single show shows see sees keep keeps find finds ask asks answer answers").split(
    /\s+/
  )
);

const BEST_FOR = {
  build: "Developers, makers and product teams",
  agents: "Teams automating work with assistants and agents",
  growth: "Sales, marketing and growth teams",
  ops: "Finance, operations and reporting teams",
  know: "Students, researchers and knowledge workers",
  media: "Creators, designers and content teams",
};

function initAI({ aiCategories, aiTools, aiPicks }) {
  const tools = aiTools.map((t, i) => {
    const words = new Set((t.d.toLowerCase().match(/[a-z][a-z-]{2,}/g) || []).filter((w) => !STOP.has(w)));
    return { ...t, i, words, hay: (t.n + " " + t.d).toLowerCase() };
  });
  const byName = new Map(tools.map((t) => [t.n.toLowerCase(), t]));
  const catCounts = {};
  tools.forEach((t) => (catCounts[t.c] = (catCounts[t.c] || 0) + 1));
  const ossCount = tools.filter((t) => t.o).length;
  const recentCount = tools.filter((t) => t.r).length;
  const linkedCount = tools.filter((t) => t.u || t.g).length;

  statTiles($("aiStats"), [
    [tools.length, "tools indexed"],
    [Object.keys(aiCategories).length, "categories"],
    [ossCount, "open source"],
    [linkedCount, "with a direct link"],
  ]);
  marquee(
    $("aiMarquee"),
    "ai",
    tools
      .filter((t) => t.r && (t.u || t.g))
      .slice(0, 28)
      .map((t) => ({ label: t.n, q: t.n }))
  );

  const state = { cat: "all", q: "", oss: false, recent: false, linked: false, sort: "az", shown: 24 };

  const catBar = $("aiCats");
  catBar.innerHTML =
    `<button type="button" class="fchip" data-cat="all" aria-pressed="true">All<span class="n">${tools.length}</span></button>` +
    Object.entries(aiCategories)
      .map(([k, l]) => `<button type="button" class="fchip" style="--c:${CAT_COLORS[k]}" data-cat="${k}" aria-pressed="false"><i class="dot"></i>${esc(l)}<span class="n">${catCounts[k] || 0}</span></button>`)
      .join("");

  $("aiOss").insertAdjacentHTML("beforeend", `<span class="n">${ossCount}</span>`);
  $("aiRecent").insertAdjacentHTML("beforeend", `<span class="n">${recentCount}</span>`);
  $("aiLinked").insertAdjacentHTML("beforeend", `<span class="n">${linkedCount}</span>`);

  function score(t, tk) {
    let s = 0;
    const name = t.n.toLowerCase();
    tk.forEach((x) => {
      if (name === x) s += 6;
      else if (name.startsWith(x)) s += 4;
      else if (name.includes(x)) s += 3;
      else s += 1;
    });
    return s;
  }

  function filtered() {
    const tk = tokens(state.q);
    const list = tools.filter(
      (t) =>
        (state.cat === "all" || t.c === state.cat) &&
        (!state.oss || t.o) &&
        (!state.recent || t.r) &&
        (!state.linked || t.u || t.g) &&
        tk.every((x) => t.hay.includes(x))
    );
    const az = (a, b) => a.n.localeCompare(b.n, "en", { sensitivity: "base" });
    if (tk.length) list.sort((a, b) => score(b, tk) - score(a, tk) || az(a, b));
    else if (state.sort === "featured") list.sort((a, b) => (b.r ? 1 : 0) - (a.r ? 1 : 0) || az(a, b));
    return list;
  }

  const searchUrl = (n) => `https://duckduckgo.com/?q=${encodeURIComponent(n + " AI tool")}`;

  function cardHTML(t) {
    const links = [];
    if (t.u) links.push(`<a href="${t.u}" target="_blank" rel="noopener noreferrer nofollow">Visit${EXT}</a>`);
    if (t.g) links.push(`<a href="${t.g}" target="_blank" rel="noopener noreferrer nofollow">GitHub${EXT}</a>`);
    if (!t.u && !t.g) links.push(`<a href="${searchUrl(t.n)}" target="_blank" rel="noopener noreferrer nofollow">Search the web${EXT}</a>`);
    const badges = [
      t.o ? `<span class="badge-mini b-oss">Open source</span>` : "",
      t.r ? `<span class="badge-mini b-new">Recently featured</span>` : "",
      t.p ? `<span class="badge-mini b-promo">Sponsored in newsletter</span>` : "",
    ].join("");
    return `<article class="card tool-card" style="--c:${CAT_COLORS[t.c]}" data-i="${t.i}">
      <header><span class="avatar" aria-hidden="true">${initial(t.n)}</span><div class="th"><h4>${esc(t.n)}</h4><span class="cat-tag">${esc(aiCategories[t.c])}</span></div></header>
      <p>${esc(t.d)}</p>
      ${badges ? `<div class="tool-badges">${badges}</div>` : ""}
      <div class="tool-actions">${links.join("")}<button type="button" class="insight-btn" aria-expanded="false">Insights</button></div>
      <div class="tool-insight" hidden></div></article>`;
  }

  function render() {
    const list = filtered();
    $("aiGrid").innerHTML = list.slice(0, state.shown).map(cardHTML).join("") || `<div class="empty-note" style="grid-column:1/-1">No tools match. Try fewer words, or clear a filter.</div>`;
    $("aiCount").textContent = `${list.length} of ${tools.length} tools`;
    $("aiFeat").hidden = !!state.q || state.cat !== "all" || state.oss || state.recent || state.linked;
    $("aiMore").hidden = list.length <= state.shown;
  }

  const reset = () => (state.shown = 24);
  catBar.addEventListener("click", (e) => {
    const b = e.target.closest(".fchip");
    if (!b) return;
    state.cat = b.dataset.cat;
    reset();
    catBar.querySelectorAll(".fchip").forEach((c) => c.setAttribute("aria-pressed", String(c === b)));
    render();
  });
  [["aiOss", "oss"], ["aiRecent", "recent"], ["aiLinked", "linked"]].forEach(([id, key]) => {
    $(id).addEventListener("click", () => {
      state[key] = !state[key];
      $(id).setAttribute("aria-pressed", String(state[key]));
      reset();
      render();
    });
  });
  $("aiSort").addEventListener("change", (e) => ((state.sort = e.target.value), reset(), render()));
  $("aiSearch").addEventListener("input", debounce((e) => ((state.q = e.target.value.trim()), reset(), render())));
  $("aiMore").querySelector("button").addEventListener("click", () => ((state.shown += 24), render()));

  function setSearch(text) {
    $("aiSearch").value = text;
    state.q = text;
    reset();
    document.querySelector('#aiTabs [data-tab="explore"]').click();
    render();
    $("aiSearch").focus({ preventScroll: true });
    $("ai").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function related(t) {
    return tools
      .filter((o) => o.i !== t.i && o.c === t.c)
      .map((o) => ({ o, s: [...t.words].filter((w) => o.words.has(w)).length }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s || a.o.n.localeCompare(b.o.n))
      .slice(0, 4)
      .map((x) => x.o);
  }

  $("aiGrid").addEventListener("click", (e) => {
    const btn = e.target.closest(".insight-btn");
    if (btn) {
      const card = btn.closest(".tool-card");
      const box = card.querySelector(".tool-insight");
      const t = tools[Number(card.dataset.i)];
      const open = btn.getAttribute("aria-expanded") === "true";
      if (!open && !box.dataset.built) {
        const kws = [...t.words].slice(0, 6);
        const rel = related(t);
        box.innerHTML =
          `<h5>Best for</h5><div class="row"><span>${esc(BEST_FOR[t.c])}</span></div>` +
          `<h5>Key themes</h5><div class="row">${kws.map((k) => `<button type="button" class="mini-chip" data-q="${esc(k)}">${esc(k)}</button>`).join("") || "<span>No themes detected.</span>"}</div>` +
          `<h5>Similar tools in ${esc(aiCategories[t.c])}</h5><div class="row">${rel.map((r) => `<button type="button" class="mini-chip" data-q="${esc(r.n)}">${esc(r.n)}</button>`).join("") || "<span>No close matches.</span>"}</div>` +
          `<div class="row"><span class="story-warn inline"><b>Heads-up.</b> Check pricing and data terms before using any tool with company data.</span></div>` +
          `<div class="row"><button type="button" class="copy-post">Copy as LinkedIn post</button></div>`;
        box.dataset.built = "1";
      }
      box.hidden = open;
      btn.setAttribute("aria-expanded", String(!open));
      btn.textContent = open ? "Insights" : "Hide insights";
      return;
    }
    const cp = e.target.closest(".copy-post");
    if (cp) {
      const t = tools[Number(cp.closest(".tool-card").dataset.i)];
      copyText(toolPost(t, aiCategories[t.c], related(t).slice(0, 3)));
      return;
    }
    const chip = e.target.closest(".mini-chip");
    if (chip) setSearch(chip.dataset.q);
  });

  render();

  /* ---------- Insights panel ---------- */
  const kwCount = {};
  tools.forEach((t) => t.words.forEach((w) => (kwCount[w] = (kwCount[w] || 0) + 1)));
  const topKw = Object.entries(kwCount).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, 18);
  const maxCat = Math.max(...Object.values(catCounts));
  const catsSorted = Object.entries(catCounts).sort((a, b) => b[1] - a[1]);
  const pct = (n) => Math.round((n / tools.length) * 100);
  const [topCat, topCatN] = catsSorted[0];
  const [lowCat, lowCatN] = catsSorted[catsSorted.length - 1];

  $("aiInsights").innerHTML = `
    <div class="insight-cols">
      <div class="card panel-card">
        <h3>Where the tools cluster</h3>
        <p class="sub">Tools per category — select one to explore it.</p>
        ${catsSorted
          .map(
            ([k, n]) => `<div class="bar-row"><button type="button" data-cat="${k}">${esc(aiCategories[k])}</button><div class="bar-track"><div class="bar-fill" style="width:${(n / maxCat) * 100}%"></div></div><div class="v">${n}</div></div>`
          )
          .join("")}
        <h3 style="margin-top:30px">What the tools are trying to do</h3>
        <p class="sub">Most frequent themes across all descriptions — select one to search.</p>
        <div class="kw-cloud">${topKw.map(([w, n]) => `<button type="button" class="kw" data-q="${esc(w)}">${esc(w)}<small>${n}</small></button>`).join("")}</div>
      </div>
      <div class="card panel-card">
        <h3>Reading the index</h3>
        <div class="fact-list">
          <p><b>${esc(aiCategories[topCat])}</b> is the largest category with ${topCatN} tools (${pct(topCatN)}%); <b>${esc(aiCategories[lowCat])}</b> is the smallest at ${lowCatN} (${pct(lowCatN)}%).</p>
          <p>Only <b>${ossCount}</b> tools (${pct(ossCount)}%) are open source, so most of this market is commercial and priced per seat or by usage.</p>
          <p><b>${recentCount}</b> tools were featured in recent roundups; ${linkedCount} have a direct link here.</p>
        </div>
        <h3 style="margin-top:28px">Before you adopt a tool</h3>
        <ul class="check-list">
          <li>Where does your data go, and can you opt out of training on it?</li>
          <li>Does it support SSO and role-based access for a team rollout?</li>
          <li>Can you export your work if the vendor changes pricing or disappears?</li>
          <li>Is the pricing predictable at your usage, not only at the free tier?</li>
          <li>Who owns the output, and does your policy allow it for client work?</li>
        </ul>
      </div>
    </div>`;
  $("aiInsights").addEventListener("click", (e) => {
    const c = e.target.closest("[data-cat]");
    if (c) {
      catBar.querySelector(`[data-cat="${c.dataset.cat}"]`).click();
      document.querySelector('#aiTabs [data-tab="explore"]').click();
      $("ai").scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    const k = e.target.closest("[data-q]");
    if (k) setSearch(k.dataset.q);
  });

  /* ---------- Shortlist ---------- */
  $("aiShortlist").innerHTML = aiPicks
    .map((p) => {
      const t = byName.get(p.name.toLowerCase());
      const link = t && (t.u || t.g);
      return `<article class="card pick-card"><h3>${esc(p.name)}</h3><p>${esc(p.why)}</p>${link ? `<a href="${link}" target="_blank" rel="noopener noreferrer nofollow">Visit${EXT}</a>` : t ? `<a href="${searchUrl(t.n)}" target="_blank" rel="noopener noreferrer nofollow">Search the web${EXT}</a>` : ""}</article>`;
    })
    .join("");

  /* ---------- Featured strip on the Explore tab ---------- */
  const feat = aiPicks.slice(0, 4).map((p) => ({ p, t: byName.get(p.name.toLowerCase()) })).filter((x) => x.t);
  $("aiFeat").innerHTML = `<div class="spot-head"><h3>Editor’s picks</h3><span>A few worth a look first</span></div><div class="spot-grid four">${feat
    .map(({ p, t }, n) => {
      const href = t.u || t.g || searchUrl(t.n);
      return `<article class="spot-card" style="--c:${CAT_COLORS[t.c]}"><span class="avatar" aria-hidden="true">${initial(t.n)}</span><h4>${esc(t.n)}</h4><p>${esc(p.why)}</p><div class="spot-actions"><a href="${href}" target="_blank" rel="noopener noreferrer nofollow">${t.u || t.g ? "Visit" : "Search the web"}${EXT}</a><button type="button" data-copy-feat="${n}">Copy as LinkedIn post</button></div></article>`;
    })
    .join("")}</div>`;
  $("aiFeat").addEventListener("click", (e) => {
    const b = e.target.closest("[data-copy-feat]");
    if (!b) return;
    const { p, t } = feat[Number(b.dataset.copyFeat)];
    copyText(toolPost({ ...t, d: p.why }, aiCategories[t.c], related(t).slice(0, 3)));
  });
  render();
}
