/* Top-level views — Latest (home), Data, BI, AI — switched from the header and the URL hash. */
const PANES = ["home", "data", "bi", "ai"];
const DEFAULT = "home";

export function initPanes() {
  const panes = new Map(PANES.map((p) => [p, document.getElementById("pane-" + p)]));
  const links = document.querySelectorAll("[data-pane-link]");
  let current = null;

  function show(name) {
    if (name === current) return false;
    current = name;
    panes.forEach((el, key) => (el.hidden = key !== name));
    links.forEach((a) => {
      const on = a.dataset.paneLink === name;
      a.classList.toggle("active", on);
      if (on) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
    document.body.dataset.pane = name;
    document.dispatchEvent(new CustomEvent("pane:shown", { detail: { pane: name } }));
    return true;
  }

  function route(initial) {
    const id = decodeURIComponent(location.hash.slice(1));
    if (PANES.includes(id)) {
      const changed = show(id);
      if (changed || !initial) window.scrollTo(0, 0);
      return;
    }
    const target = id && document.getElementById(id);
    const owner = target && target.closest(".pane");
    if (owner) {
      show(owner.dataset.pane);
      requestAnimationFrame(() => target.scrollIntoView());
      return;
    }
    show(DEFAULT);
  }

  window.addEventListener("hashchange", () => route(false));
  route(true);
}
