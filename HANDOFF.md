# Pragya Petika: handoff notes

**Pragya Petika** (प्रज्ञा पेटिका, "a box of wisdom") is *The Technology Knowledge Hub*. It is an independent digest of what's new in **Data, BI and AI**, curated by Balachandra Srinevasalu.

- Live domain: `pragyapetika.com`
- Repo: `github.com/chandrra111/PragyaPetika`
- Hosting: GitHub Pages

These notes record every decision so a fresh chat can continue without the earlier history.

## Decisions so far

| Topic | Decision |
|---|---|
| Name | **Pragya Petika**, chosen over Sanjaya, Petika, Darshbox, Insight Kosha, Prajna Petika and Jnabox. |
| Descriptor | "The Technology Knowledge Hub". It shows in the header and the page title. |
| Headline | "Your box of what's new in Data, BI and AI". This replaced "Explore. Learn. Stay Ahead.", which was too generic. |
| Structure | A **Latest** home view plus three pillars: **Data** (Databricks), **BI** (Power BI and Fabric) and **AI** (tools index). Microsoft Fabric sits under BI and Data, not as its own pillar. |
| Deferred | *Technical Guides* and *Tools & Tutorials*. Add them only once about 5 real guides exist, because empty sections look worse than none. |
| Brand look | Navy and blue (the gold, amber and violet accents were swapped for blues so the site no longer looks like the profile site or a stock AI page). Plus Jakarta Sans for display text and Inter for body text. The icon is a blue casket (`assets/img/favicon.svg`). |
| AI tool logos | Each tool card shows the tool's real site icon (via Google's favicon service) when its domain is listed in `assets/data/ai-sites.js`, or the GitHub owner's avatar for open-source tools. Others show their first letter. |
| Link to profile | "Curated by Balachandra Srinevasalu" appears in About and the footer, and links to balachandra-srinevasalu.com. |
| Other domains | Optionally register `prajnapetika.com` and `pragyapetika.in` and redirect them here. |

## Where the content came from

The content was copied from the profile site (`C:\CURE\Chandrra\CV\Bala\portfolio`). That site still has its own AI, Data and BI tabs. When you update content, update this repo. If you want both sites in sync, change both or remove the tabs from the profile site.

## Project structure

No build step: static HTML, CSS and ES modules.

```
index.html               # header, Latest (home) view + About, Data, BI and AI views, footer
CNAME  robots.txt  sitemap.xml  .nojekyll
assets/
  css/  variables, base, components, animations, responsive  # design system (from the profile site)
        hub.css, hub-v2.css                                   # Data / BI / AI hub styles
        petika.css                                            # brand + Latest view + About
  js/   main.js        # entry point
        home.js        # Latest view: cross-pillar search, pillar cards, stories, AI picks, infographics
        hub.js         # Data / BI / AI hubs
        panes.js       # #home / #data / #bi / #ai routing
        theme.js nav.js tabs.js reveal.js lightbox.js
  data/ databricks.js  # dbxUpdates rows: [theme, status, title, summary, url], insights, topics, sources, infographics
        bi.js          # biUpdates rows: [theme, status, title, summary, sourceKey]
        ai-tools.js    # aiTools {n, d, c, u?, g?, o?, r?, p?}, aiCategories, aiPicks
        ai-sites.js    # tool name -> official domain, for logos and a Visit link
        stories.js     # Top stories; each title must match an update title exactly
  img/  databricks/, bi/   # infographics as .svg (shown) and .png (download)
```

## Editing content

- **New update:** add a row to `dbxUpdates` or `biUpdates`. It appears in its hub, in the cross-pillar search and in the stats.
- **Top story:** add an entry to `stories.js` whose `title` matches an update exactly. The Latest view alternates Data and BI stories and shows the first 6.
- **AI tool:** add an object to `aiTools`. The Latest view shows the first 4 entries of `aiPicks`. To give it a real logo, add its name and checked domain to `ai-sites.js`.
- **Infographic:** save the `.svg` and `.png` under `assets/img/...` and add the entry to `*Infographics`. The Latest view shows the first 2 from Data and the first 2 from BI.

## Run it locally

```bash
python -m http.server 8140
```

Then open http://localhost:8140. ES modules don't load from `file://`, so open the page through the server.

## Go-live checklist

1. Push `main` to GitHub.
2. At the domain registrar, set the DNS records:
   - Four **A** records for `@`: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`.
   - One **CNAME** record for `www` pointing to `chandrra111.github.io`.
3. In GitHub, go to Settings → Pages:
   - Set the source to `main` and the root folder `/`.
   - Set the custom domain to `pragyapetika.com`.
   - Tick **Enforce HTTPS** once the certificate is issued.
4. Add the site to Google Search Console and submit `sitemap.xml`.

## Ideas for later

- **Dates:** add a date per update so "Latest" can sort by recency. Dates were removed in the profile site.
- **Guides:** add a Guides section once there are about 5 real guides.
- **Social image:** replace the `og:image` with a dedicated 1200×630 image. It currently reuses an infographic.
- **Share on LinkedIn:** the old "Copy as LinkedIn post" buttons were removed (the pasted text looked poor). If sharing comes back, use a "Share on LinkedIn" link (`https://www.linkedin.com/sharing/share-offsite/?url=...`) pointing at a page with good Open Graph tags. The old post-text builders are in git history before this change.
- **Newsletter or RSS:** offer a weekly email or RSS feed of the newest updates.
