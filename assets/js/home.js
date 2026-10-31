import { openLightbox } from "./lightbox.js";
import { esc, EXT, copyText, updatePost } from "./hub.js";

/* "Latest" landing view: one search across all three pillars, the pillar cards, top stories and infographics. */
const $ = (id) => document.getElementById(id);
const tokens = (q) => q.toLowerCase().split(/\s+/).filter(Boolean);
const debounce = (fn, ms = 120) => {
  let t;
  return (...a) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...a), ms);
  };
};

const PILLARS = {
  data: { label: "Data", color: "#0ea5e9", search: "dbxSearch", feed: { p: "dbx", hash: "data" }, link: "Official release notes" },
  bi: { label: "BI", color: "#f59e0b", search: "biSearch", feed: { p: "bi", hash: "bi" }, link: "Official docs" },
  ai: { label: "AI", color: "#8b5cf6", search: "aiSearch" },
};

/* Jump to a pillar and run the same search there. */
function openPillar(key, q) {
  if (q)
    document.addEventListener(
      "pane:shown",
      () =>
        requestAnimationFrame(() => {
          const inp = $(PILLARS[key].search);
          inp.value = q;
          inp.dispatchEvent(new Event("input"));
          document.querySelector(`#${key} .hub-body`).scrollIntoView({ behavior: "smooth", block: "start" });
        }),
      { once: true }
    );
  location.hash = key;
}

export async function initHome() {
  try {
    const [dbx, bi, ai, st] = await Promise.all([import("../data/databricks.js"), import("../data/bi.js"), import("../data/ai-tools.js"), import("../data/stories.js")]);
    const rows = {
      data: dbx.dbxUpdates.map(([theme, status, title, summary, url]) => ({ theme, status, title, summary, url })),
      bi: bi.biUpdates.map(([theme, status, title, summary, src]) => ({ theme, status, title, summary, url: bi.biSources[src] })),
    };
    const themes = { data: dbx.dbxThemes, bi: bi.biThemes };
    const tools = ai.aiTools;

    stats(rows, tools, st, dbx.dbxInfographics.length + bi.biInfographics.length);
    search(rows, tools, ai.aiCategories);
    pillars(rows, tools, ai.aiCategories);
    latest(rows, themes, st, ai);
    infographics([...dbx.dbxInfographics.slice(0, 2), ...bi.biInfographics.slice(0, 2)]);
  } catch (err) {
    console.error("Home failed to load", err);
    $("homeLatest").innerHTML = `<div class="empty-note">Couldn't load the latest updates. Please refresh the page.</div>`;
  }
}

function stats(rows, tools, st, infoCount) {
  const pairs = [
    [rows.data.length + rows.bi.length, "curated updates"],
    [tools.length, "AI tools indexed"],
    [st.dbxStories.length + st.biStories.length, "top stories"],
    [infoCount, "infographics"],
  ];
  $("homeStats").innerHTML = pairs.map(([v, l]) => `<div class="stat-tile"><b>${v}</b><span>${l}</span></div>`).join("");
}

/* ---------- One search box, results grouped by pillar ---------- */
function search(rows, tools, cats) {
  const box = $("homeResults");
  const input = $("homeSearch");
  const match = (tk, text) => tk.every((t) => text.toLowerCase().includes(t));

  function group(key, list, total, html) {
    const p = PILLARS[key];
    return `<div class="hr-group" style="--c:${p.color}">
      <div class="hr-head"><span class="pillar-tag">${p.label}</span><b>${total}</b> match${total === 1 ? "" : "es"}</div>
      ${list.length ? `<ul>${list.map(html).join("")}</ul>` : `<p class="hr-none">Nothing here for that search.</p>`}
      ${total ? `<button type="button" class="hr-all" data-open="${key}">See all in ${p.label} &rarr;</button>` : ""}
    </div>`;
  }

  function render() {
    const q = input.value.trim();
    box.hidden = !q;
    if (!q) return;
    const tk = tokens(q);
    const d = rows.data.filter((i) => match(tk, i.title + " " + i.summary));
    const b = rows.bi.filter((i) => match(tk, i.title + " " + i.summary));
    const a = tools.filter((t) => match(tk, t.n + " " + t.d));
    const upd = (i) => `<li><a href="${i.url}" target="_blank" rel="noopener noreferrer">${esc(i.title)}${EXT}</a><p>${esc(i.summary)}</p></li>`;
    const tool = (t) => `<li><button type="button" class="hr-tool" data-tool="${esc(t.n)}">${esc(t.n)}</button><span class="hr-cat">${esc(cats[t.c])}</span><p>${esc(t.d)}</p></li>`;
    box.innerHTML = `<p class="hr-sum">${d.length + b.length + a.length} results for &ldquo;${esc(q)}&rdquo;</p><div class="hr-grid">${group("data", d.slice(0, 4), d.length, upd)}${group("bi", b.slice(0, 4), b.length, upd)}${group("ai", a.slice(0, 4), a.length, tool)}</div>`;
  }

  input.addEventListener("input", debounce(render));
  render(); // the browser may restore a previous query on reload
  input.addEventListener("keydown", (e) => e.key === "Enter" && box.scrollIntoView({ behavior: "smooth", block: "start" }));
  box.addEventListener("click", (e) => {
    const all = e.target.closest("[data-open]");
    if (all) return openPillar(all.dataset.open, input.value.trim());
    const t = e.target.closest("[data-tool]");
    if (t) openPillar("ai", t.dataset.tool);
  });
  document.querySelectorAll("[data-home-q]").forEach((b) =>
    b.addEventListener("click", () => {
      input.value = b.dataset.homeQ;
      render();
      box.scrollIntoView({ behavior: "smooth", block: "start" });
    })
  );
}

/* ---------- The three pillars ---------- */
function pillars(rows, tools, cats) {
  const ga = (list) => list.filter((i) => i.status === "GA").length;
  const cards = [
    { key: "data", title: "Data Engineering", blurb: "Databricks releases decoded: Lakehouse, Unity Catalog, Lakeflow, Genie and agents.", n: rows.data.length, unit: "updates", extra: `${ga(rows.data)} generally available` },
    { key: "bi", title: "BI & Analytics", blurb: "Power BI and Microsoft Fabric without the noise: DAX, semantic models, Copilot and reporting.", n: rows.bi.length, unit: "updates", extra: `${ga(rows.bi)} generally available` },
    { key: "ai", title: "AI & GenAI", blurb: "A searchable index of AI tools, with categories, similar options and an editor's shortlist.", n: tools.length, unit: "tools", extra: `${Object.keys(cats).length} categories` },
  ];
  $("homePillars").innerHTML = cards
    .map(
      (c) => `<a class="pillar-card" href="#${c.key}" style="--c:${PILLARS[c.key].color}">
        <span class="pillar-tag">${PILLARS[c.key].label}</span>
        <h3>${c.title}</h3>
        <p>${c.blurb}</p>
        <div class="pillar-n"><b>${c.n}</b> ${c.unit}<span>${c.extra}</span></div>
        <em>Open ${PILLARS[c.key].label} &rarr;</em>
      </a>`
    )
    .join("");
}

/* ---------- Latest: Data and BI stories interleaved, then AI picks ---------- */
function latest(rows, themes, st, ai) {
  const pick = (key, stories) =>
    stories.map((s) => ({ key, s, item: rows[key].find((i) => i.title === s.title) })).filter((x) => x.item);
  const d = pick("data", st.dbxStories);
  const b = pick("bi", st.biStories);
  const mixed = [];
  for (let n = 0; n < Math.max(d.length, b.length); n++) {
    if (d[n]) mixed.push(d[n]);
    if (b[n]) mixed.push(b[n]);
  }
  const shown = mixed.slice(0, 6);

  $("homeLatest").innerHTML = shown
    .map(({ key, s, item }, n) => {
      const p = PILLARS[key];
      return `<article class="story latest-card" style="--c:${p.color}">
        <div class="story-meta"><span class="pillar-tag">${p.label}</span><span class="theme-tag">${esc(themes[key][item.theme])}</span><span class="status s-${item.status.toLowerCase()}">${esc(item.status)}</span></div>
        <h3>${esc(s.hook)}</h3>
        <p class="story-title">${esc(item.title)}</p>
        <p class="story-why"><b>Why it matters.</b> ${esc(s.why)}</p>
        <div class="story-actions">
          <a href="${item.url}" target="_blank" rel="noopener noreferrer">${p.link}${EXT}</a>
          <button type="button" data-copy-latest="${n}">Copy as LinkedIn post</button>
          <button type="button" data-more="${key}">More in ${p.label} &rarr;</button>
        </div>
      </article>`;
    })
    .join("");
  $("homeLatest").addEventListener("click", (e) => {
    const c = e.target.closest("[data-copy-latest]");
    if (c) {
      const { key, s, item } = shown[Number(c.dataset.copyLatest)];
      return copyText(updatePost({ item, story: s, feed: PILLARS[key].feed }));
    }
    const m = e.target.closest("[data-more]");
    if (m) {
      document.querySelector(`#${m.dataset.more} [data-tab="${m.dataset.more === "data" ? "dbx" : "bi"}-stories"]`).click();
      location.hash = m.dataset.more;
    }
  });

  const byName = new Map(ai.aiTools.map((t) => [t.n.toLowerCase(), t]));
  $("homePicks").innerHTML = ai.aiPicks
    .slice(0, 4)
    .map((p) => {
      const t = byName.get(p.name.toLowerCase());
      return `<button type="button" class="pick-chip" data-tool="${esc(p.name)}"><b>${esc(p.name)}</b><span>${esc(t ? ai.aiCategories[t.c] : "AI tool")}</span><small>${esc(p.why)}</small></button>`;
    })
    .join("");
  $("homePicks").addEventListener("click", (e) => {
    const b = e.target.closest("[data-tool]");
    if (b) openPillar("ai", b.dataset.tool);
  });
}

function infographics(list) {
  $("homeInfo").innerHTML = list
    .map(
      (g) => `<figure class="card info-card">
        <button type="button" class="thumb" data-id="${g.id}" aria-label="View ${esc(g.title)} full size">
          <img src="${g.file}.svg" width="1200" height="675" loading="lazy" alt="Infographic: ${esc(g.title)}">
        </button>
        <figcaption><strong>${esc(g.title)}</strong><p>${esc(g.caption)}</p></figcaption></figure>`
    )
    .join("");
  $("homeInfo").addEventListener("click", (e) => {
    const b = e.target.closest("button.thumb");
    if (!b) return;
    const g = list.find((x) => x.id === b.dataset.id);
    openLightbox({ image: g.file + ".svg", title: g.title, subtitle: esc(g.caption), linkUrl: g.file + ".png", linkLabel: "Download PNG", wide: true, download: true });
  });
}
