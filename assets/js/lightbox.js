let overlay, imageEl, titleEl, subtitleEl, linkEl, lastFocused;

function build() {
  overlay = document.createElement("div");
  overlay.className = "lightbox-overlay";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-hidden", "true");
  overlay.innerHTML = `
    <div class="lightbox-box">
      <button class="lightbox-close" type="button" aria-label="Close">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
      <img class="lightbox-img" alt="">
      <div class="lightbox-caption">
        <h3 class="lightbox-title"></h3>
        <p class="lightbox-subtitle"></p>
        <a class="btn btn-outline btn-sm lightbox-link" target="_blank" rel="noopener">
          <span class="lightbox-link-label"></span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
        </a>
      </div>
    </div>`;
  document.body.appendChild(overlay);

  imageEl = overlay.querySelector(".lightbox-img");
  titleEl = overlay.querySelector(".lightbox-title");
  subtitleEl = overlay.querySelector(".lightbox-subtitle");
  linkEl = overlay.querySelector(".lightbox-link");

  overlay.querySelector(".lightbox-close").addEventListener("click", closeLightbox);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeLightbox();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.classList.contains("open")) closeLightbox();
  });
}

export function openLightbox({ image, title, subtitle, linkUrl, linkLabel, wide, download }) {
  if (!overlay) build();

  lastFocused = document.activeElement;
  overlay.querySelector(".lightbox-box").classList.toggle("wide", !!wide);
  if (download) linkEl.setAttribute("download", "");
  else linkEl.removeAttribute("download");
  imageEl.src = image;
  imageEl.alt = title || "";
  titleEl.textContent = title || "";
  subtitleEl.innerHTML = subtitle || "";

  if (linkUrl) {
    linkEl.href = linkUrl;
    linkEl.querySelector(".lightbox-link-label").textContent = linkLabel || "View source";
    linkEl.style.display = "";
  } else {
    linkEl.style.display = "none";
  }

  overlay.classList.add("open");
  overlay.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  overlay.querySelector(".lightbox-close").focus();
}

export function closeLightbox() {
  if (!overlay) return;
  overlay.classList.remove("open");
  overlay.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  if (lastFocused) lastFocused.focus();
}
