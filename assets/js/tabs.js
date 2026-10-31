export function initTabs() {
  document.querySelectorAll(".tabbar").forEach((bar) => {
    const section = bar.closest("section");
    const buttons = Array.from(bar.querySelectorAll(".tab-btn"));
    const panels = Array.from(section.querySelectorAll(".tab-panel"));

    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const target = btn.dataset.tab;
        buttons.forEach((b) => {
          b.classList.toggle("active", b === btn);
          b.setAttribute("aria-selected", String(b === btn));
        });
        panels.forEach((p) => {
          const isActive = p.dataset.panel === target;
          p.classList.toggle("active", isActive);
          if (isActive) {
            document.dispatchEvent(new CustomEvent("tab:shown", { detail: { panel: target } }));
          }
        });
      });
    });
  });
}
