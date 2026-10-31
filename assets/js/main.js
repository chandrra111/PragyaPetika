import { initTheme } from "./theme.js";
import { initNav } from "./nav.js";
import { initTabs } from "./tabs.js";
import { initReveal } from "./reveal.js";
import { initHub } from "./hub.js";
import { initHome } from "./home.js";
import { initPanes } from "./panes.js";

function hideLoadingVeil() {
  const veil = document.getElementById("loadingVeil");
  if (veil) veil.classList.add("hide");
}

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initNav();
  initTabs();
  initHub();
  initHome();
  initPanes();
  initReveal();
  document.getElementById("year").textContent = new Date().getFullYear();
  requestAnimationFrame(() => setTimeout(hideLoadingVeil, 150));
});
