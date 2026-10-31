/* Power BI & Fabric — what's new.
 * Source of facts: Microsoft Learn "What's new in Power BI", the Power BI monthly updates archive and Microsoft Fabric "What's new" (public documentation, linked below).
 * Every entry is a short paraphrase written for this site; nothing is copied from newsletters or docs.
 * Independent notes — not affiliated with or endorsed by Microsoft. Power BI, Microsoft Fabric, Copilot and related names are trademarks of Microsoft.
 */

export const biSources = {
  p: "https://learn.microsoft.com/en-us/power-bi/fundamentals/whats-new",
  a: "https://learn.microsoft.com/en-us/power-bi/fundamentals/desktop-latest-update-archive",
  f: "https://learn.microsoft.com/en-us/fabric/fundamentals/whats-new",
};

export const biThemes = {
  ai: "Copilot, agents & Fabric Apps",
  report: "Report design & visuals",
  model: "Semantic models & DAX",
  gov: "Governance, apps & sharing",
  dev: "Developer workflow",
  conn: "Data, mobile & embedding",
};

/* [theme, status, title, summary, source]   status: GA | Preview | Frontier | Update | Retiring */
export const biUpdates = [
  // ---------- Copilot, agents & Fabric Apps ----------
  ["ai", "Preview", "Fabric Apps on semantic models", "Build operational data apps on top of a semantic model and reuse the governance and business logic already defined there.", "a"],
  ["ai", "Update", "Lighter permissions for Fabric App users", "People who only consume a Fabric App now need Read, not Build, on the underlying semantic model; authors still need Build.", "p"],
  ["ai", "Preview", "Copilot in web modeling", "Describe a change in plain language and Copilot inspects the model and applies renames, relationships or new DAX measures.", "a"],
  ["ai", "Preview", "Agent skills for report authoring", "Skills for Fabric let an AI assistant plan, build, validate and publish a report from natural-language prompts.", "a"],
  ["ai", "Preview", "Power BI Desktop Bridge", "Lets agents and tools connect to a running Desktop session so reports can be authored and checked iteratively.", "a"],
  ["ai", "Frontier", "Data answers in Microsoft 365 Copilot", "Business questions can be answered from governed Power BI reports and models inside Microsoft 365 Copilot Chat and related surfaces.", "a"],
  ["ai", "GA", "Fabric IQ in Microsoft 365 Copilot", "Governed Power BI content now powers answers in Microsoft 365 Copilot Chat and Copilot Cowork.", "f"],
  ["ai", "Update", "Copilot Summary reads bookmark-hidden visuals", "Summaries and the Copilot narrative visual can now include visuals that a display-only bookmark reveals; row- and object-level security still apply.", "p"],
  ["ai", "Update", "One-click summaries", "A ribbon Summarize button creates a report-wide summary, and a visual-header option summarises a single visual.", "a"],
  ["ai", "Preview", "Narrative visual in customer apps", "The Copilot narrative visual can be embedded in apps where viewers do not sign in.", "a"],
  ["ai", "Update", "Copilot in the mobile apps", "In-report Copilot on mobile now supports conversational chat, AI visuals and citations, plus dictation on iPhone and iPad.", "a"],
  ["ai", "Update", "Narrative visual defaults to Copilot mode", "For users with a Copilot licence the narrative visual starts in Copilot mode and accepts longer text.", "a"],
  ["ai", "Update", "Better Explore for large models", "Explore adds perspectives for big models, show/hide totals, matrix auto-expand and carry-over of matrix formatting.", "a"],
  ["ai", "Preview", "Auto-descriptions for semantic models", "Copilot drafts a description for a semantic model that owners can edit and regenerate.", "f"],
  ["ai", "Preview", "Smarter data agents", "Fabric data agents get a newer model, longer result sets, topic guidance, ontology context and feedback review from creators.", "f"],
  ["ai", "Preview", "Advanced DAX generation for agents", "A data agent can plan, inspect model values, refine its reasoning and then run a final DAX query before it answers.", "f"],
  ["ai", "Preview", "Better natural-language-to-SQL for agents", "Improved accuracy and transparency when agents turn questions into SQL across lakehouses, warehouses and mirrored databases.", "f"],
  ["ai", "Preview", "Service principals for data agents", "Custom apps and other agents can call the data-agent API under an application identity instead of a person.", "f"],
  ["ai", "Preview", "Observability for agent calls", "Latency, status and errors are surfaced for every data-agent call made from a Foundry agent.", "f"],
  ["ai", "Preview", "Fabric Apps backend as code", "An open-source SDK and command line define an app's backend in code and deploy it to Fabric.", "f"],
  ["ai", "Preview", "Functions, connectors and secrets for Fabric Apps", "Apps gain Fabric data connectors, PostgreSQL support, server-side functions and secret storage.", "f"],
  ["ai", "Preview", "Anonymous access for Fabric Apps", "An app can expose chosen operations to visitors who are not signed in, within tenant settings and data-model roles.", "f"],
  ["ai", "Preview", "Inline code completion in notebooks", "Copilot suggests Python as you type in Fabric notebooks.", "f"],

  // ---------- Report design & visuals ----------
  ["report", "GA", "Modern visual defaults and the Theme pane", "New reports start on the Fluent 2 base theme, and a Theme pane sets palettes, text styles and page properties and imports or exports themes.", "p"],
  ["report", "GA", "Date picker for slicers", "Relative selections that roll forward, a calendar, a slider and a single-date mode in one slicer.", "p"],
  ["report", "GA", "Centre value in donut charts", "Show a value in the middle of a donut without overlaying a card; it follows filters, drill and selection.", "p"],
  ["report", "GA", "Matrix column-header expand and collapse", "Plus and minus icons on matrix column headers when more than one field sits in Columns.", "p"],
  ["report", "Update", "Default freeze for matrix row headers", "Authors set the default frozen state of row headers in the format pane and it is saved with the report.", "p"],
  ["report", "GA", "OneLake image URLs in visuals", "Images stored in OneLake can feed image visuals, table and matrix cells, cards, slicers and icons, authenticated as the viewer; maps can link to OneLake files too.", "p"],
  ["report", "GA", "Outer padding on bar, column, line and waterfall charts", "A Layout setting controls the space between the plot edge and the first and last categories.", "p"],
  ["report", "GA", "Faster Azure Maps reference layers", "Shape matching renders faster and filtering, cross-highlighting and zoom feel smoother with no configuration.", "p"],
  ["report", "GA", "Azure Maps reloads on filter and auto-zooms", "Filtering to a smaller set brings back points beyond the first 30,000 and fits the view to what remains.", "p"],
  ["report", "GA", "More slicer dropdown and hierarchy styling", "Border colour, rounded corners, open-icon colour and an accent bar for dropdowns, and icon colours for hierarchy slicers.", "p"],
  ["report", "Update", "Comments on reports in org apps", "Viewers comment on pages and visuals inside an org app, start threads and @mention colleagues.", "p"],
  ["report", "Preview", "Customise the current theme", "A Format-pane experience for report-wide visual defaults, palettes and page size, with theme export.", "a"],
  ["report", "GA", "Conditional formatting for line charts and legends", "Gradient or measure-driven colours extend to line charts and legend-based visuals.", "a"],
  ["report", "Update", "Easier report page tabs", "Reordering and arrow paging are improved so pages move more easily across a long tab strip.", "a"],
  ["report", "GA", "Shape map upgrades", "Built-in maps, custom TopoJSON or GeoJSON uploads, URL references and downloads for reuse.", "a"],
  ["report", "GA", "Matrix auto-expand for new hierarchy levels", "Rows and columns can expand newly added hierarchy levels automatically.", "a"],
  ["report", "GA", "Fixed and default widths for tables and matrices", "Exact pixel widths, a default width, rule-based widths and an auto-size option.", "a"],
  ["report", "GA", "Bar and column axis improvements", "A rounded-range control, and axis ranges that no longer shift when data labels are switched on.", "a"],
  ["report", "Update", "Scatter charts keep edge markers visible", "Bubbles and markers near the plot boundary stay fully in view without manual axis tuning.", "a"],
  ["report", "GA", "Card hover images", "Hover-state image formatting for cards, including alternate source, transparency and effects.", "a"],
  ["report", "GA", "Sentence-style tooltips", "Explain a value in a short sentence without building a whole tooltip page.", "a"],
  ["report", "GA", "Selection icon colours for slicers", "Set selection icon colours for better contrast, especially on dark themes.", "a"],
  ["report", "GA", "Text box list formatting", "Lists keep their formatting and indentation, and bulleted lists paste cleanly from Word.", "a"],
  ["report", "GA", "Set any page as the landing page", "Choose which page viewers see first.", "a"],
  ["report", "GA", "Report-level locale for format strings", "Dates and numbers format by a locale you choose instead of each viewer's browser language.", "a"],
  ["report", "GA", "Input slicer for numbers", "Numeric fields and an input mask with comparison, range and wildcard syntax.", "a"],
  ["report", "GA", "Translytical task flows with defaults", "Input fields can be pre-filled by user data functions, and flows can run without every parameter.", "a"],
  ["report", "Update", "Fixed-size layout for cards and list slicers", "Exact pixel sizes per item with scroll bars when space runs out; Autogrid is renamed Fit to space.", "a"],
  ["report", "Update", "Interactive card categories", "Selecting a category highlights its card and several category columns concatenate.", "a"],
  ["report", "Update", "Preview visuals are labelled", "Visuals still in preview now show a label in the Visualizations pane.", "a"],
  ["report", "Update", "Tidier visual title spacing", "Titles use one consistent space-above model; existing reports adjust automatically.", "a"],

  // ---------- Semantic models & DAX ----------
  ["model", "Update", "Three refresh choices in the service", "Refresh now offers schema and data, schema only, or data only, and can be run per table.", "p"],
  ["model", "Preview", "Calculated columns on Direct Lake", "Define DAX calculated columns on Direct Lake on OneLake models without changing storage mode; they are evaluated at query time.", "p"],
  ["model", "GA", "DAX user-defined functions", "Write reusable, typed functions in DAX across Desktop and web modeling.", "a"],
  ["model", "Update", "Optional parameters in UDFs", "Give a function parameter a default so callers can leave it out.", "a"],
  ["model", "Preview", "NAMEOF enhancements for UDFs", "Choose which name component to return and control escaping for display.", "a"],
  ["model", "GA", "Visual calculations and custom totals", "Running sums, moving averages and percent-of-parent live on the visual, with None and Average added as total options.", "a"],
  ["model", "Update", "LOOKUP inferred mode", "Visual-calculation LOOKUP can infer functionally determined axis columns through a new parameter.", "a"],
  ["model", "Preview", "User-aware calculated columns", "Columns can respond to the viewer's culture, principal name or custom data without being materialised.", "a"],
  ["model", "Update", "Measure descriptions from /// comments", "Triple-slash comments above a measure in DAX query view become its description when the model is updated.", "a"],
  ["model", "GA", "Sort and filter in the DAX query result grid", "Inspect query output without rewriting the query.", "a"],
  ["model", "Update", "TMDL view on the web", "Script and apply model changes in a browser editor using TMDL.", "a"],
  ["model", "Update", "Model options in web modeling", "The model options dialog is available in the service.", "a"],
  ["model", "Update", "Straight to web modeling", "People with edit permission open web modeling directly instead of a details page.", "a"],
  ["model", "Preview", "Settings pane for semantic models", "Model settings open in a side pane instead of a full page.", "a"],
  ["model", "Update", "Downloaded .pbix from a model is data-only", "Downloading a .pbix from a semantic model now gives an empty report with just the model; download the report from the report itself.", "a"],

  // ---------- Governance, apps & sharing ----------
  ["gov", "GA", "Org apps with audiences", "One org app can show different content to different groups of users.", "a"],
  ["gov", "Update", "Bookmarks in org apps", "Viewers can use author bookmarks and their own personal bookmarks inside an org app.", "a"],
  ["gov", "Update", "Org app content in PowerPoint", "Reports in org apps can be placed as live pages and visuals in PowerPoint.", "a"],
  ["gov", "Preview", "Subscriptions in org apps", "Email subscriptions with scheduled snapshots and links can be created inside an app.", "a"],
  ["gov", "Update", "Org-app audiences on mobile", "iOS and Android users see app content that matches their audience.", "a"],
  ["gov", "Update", "APIs for org apps and paginated reports", "Create, read, update, delete and list are available through the Fabric REST APIs.", "a"],
  ["gov", "Preview", "Fabric policies", "Admins define and enforce condition-based governance rules at tenant or capacity scope.", "f"],
  ["gov", "Preview", "Data security posture for AI in Fabric", "Monitor Copilot and agent interactions to spot sensitive information in prompts and answers.", "f"],
  ["gov", "Preview", "Governance insights in the OneLake catalog", "Data owners see aggregated insights on their items and act on recommended governance steps.", "f"],
  ["gov", "Preview", "Item relations API", "Returns upstream and downstream dependencies of items for impact analysis, catalogues and CI/CD checks.", "f"],
  ["gov", "Preview", "Gateway soft delete", "Standard-mode on-premises gateways are kept for 30 days by default so an accidental delete can be undone.", "f"],
  ["gov", "Preview", "Table discovery in the OneLake catalog", "Find tables by name, description or exact column name from global search or the Search API.", "f"],
  ["gov", "Preview", "Delegated OneLake shortcuts", "A shortcut carries a delegated identity so downstream users reach the target through it.", "f"],
  ["gov", "Preview", "Zero-copy OneLake data in Azure Databricks", "Unity Catalog can query Fabric data in OneLake without copying it.", "f"],
  ["gov", "Preview", "Mirrored Dremio catalog", "Mirror Dremio Iceberg catalog metadata for zero-copy access to Dremio-managed tables.", "f"],

  // ---------- Developer workflow ----------
  ["dev", "Update", "Instant reloads for PBIP projects", "Desktop detects outside changes to project files and offers one-click apply, plus a built-in way to open the project in VS Code.", "p"],
  ["dev", "Preview", "PBIR rollout continues", "The default-on rollout of the PBIR report format resumes in the service, with Desktop to follow once stable.", "a"],
  ["dev", "Update", "Faster modern-evaluation path for VNet gateways", "An opt-in execution path to test semantic model refresh, Dataflow Gen2 refresh and DirectQuery performance.", "f"],
  ["dev", "Preview", "OneLake table read API", "Read rows straight from Delta Lake or Iceberg tables in OneLake.", "f"],
  ["dev", "Preview", "OneLake catalog search from the command line", "A search API, MCP and CLI tools, including a find command, search items across workspaces.", "f"],
  ["dev", "Preview", "Embed Real-Time Dashboards in your app", "Embed dashboards in JavaScript or TypeScript apps with delegated Microsoft Entra access.", "f"],

  // ---------- Data, mobile & embedding ----------
  ["conn", "Preview", "New Get Data experience", "A redesigned Power Query Get Data flow with better source discovery, a streamlined connection path and accessibility improvements.", "a"],
  ["conn", "Update", "Clearer Power Query and connector icons", "Better contrast across light and dark themes, and connector icons get a light background in dark mode.", "p"],
  ["conn", "Update", "Rotate view on mobile", "A footer button switches report layouts in one tap even when the phone is locked in portrait.", "p"],
  ["conn", "Update", "Export to Excel from the mobile app", "Visual data exports to Excel on iOS and Android, respecting filters, drill state and row-level security.", "p"],
  ["conn", "Update", "Better Power BI embedding in SharePoint Online", "Pick a workspace from a browser instead of pasting a URL, and embed a single visual.", "p"],
  ["conn", "Update", "Power BI tabs in Teams channels", "Reports can be embedded in private and shared Teams channels.", "a"],
  ["conn", "Retiring", "Old file picker goes away", "Older Desktop versions lose save and share to OneDrive and SharePoint, so update Desktop to keep using them.", "p"],
  ["conn", "Retiring", "Built-in Netezza ODBC driver deprecated", "Install the generally available IBM Netezza ODBC driver instead.", "a"],
];

export const biInsights = [
  { title: "Authoring is moving from clicks to conversations", body: "Copilot in web modeling, agent skills for reports and the Desktop Bridge all point one way: describe the outcome, let an assistant do the repetitive steps, and keep a human reviewing the result. The skill that matters is writing a clear contract for what the model or report must do." },
  { title: "Semantic models are becoming the product", body: "Apps, agents, Copilot and Microsoft 365 all read the same governed model. Investment in naming, descriptions, measures and security pays off everywhere it is consumed, not only in one report." },
  { title: "DAX is becoming reusable code", body: "User-defined functions, visual calculations, query-view comments as descriptions and a TMDL editor in the browser bring DAX closer to normal software practice: shared, documented and reviewable." },
  { title: "Design defaults finally ship with the tool", body: "A modern base theme, a Theme pane and many small formatting controls remove a lot of manual polish. Teams can standardise on a theme file instead of re-styling each visual." },
  { title: "Preview is not production", body: "A large share of the AI and Fabric items are still in preview or limited access. Pilot them, write down the limits, and keep a fallback before putting them in front of executives." },
  { title: "Governance now includes AI interactions", body: "Fabric adds policy rules, monitoring of prompts and agent answers, dependency APIs and delegated identity for shortcuts. Plan for who can ask what of which data, not only who can open which report." },
];

/* area, title, body, from = publisher the topic was seen in (credited, paraphrased, not reproduced) */
export const biTopics = [
  { area: "Design", title: "Fonts and brand consistency", body: "Reports look different on another screen when the brand font is not available. Choose safe fallbacks and test on a clean machine before a rebrand.", from: "my-datatraining" },
  { area: "Design", title: "Progress bars for KPIs that matter", body: "A bare percentage is easy to miss; a simple progress visual gives an important metric weight and context.", from: "my-datatraining" },
  { area: "Design", title: "Bar visuals that show done, in progress and queued", body: "Stacked bars that split a target into stages answer 'how far are we?' faster than three separate numbers.", from: "my-datatraining" },
  { area: "Design", title: "Error bars as a charting trick", body: "Used creatively, error bars unlock several chart types that are not in the visual gallery.", from: "my-datatraining" },
  { area: "Design", title: "Slicers as first impressions", body: "Slicers are often the first thing people click, so a well-designed button slicer sets the tone for the report.", from: "my-datatraining" },
  { area: "Design", title: "Compare any two periods", body: "Letting users pick two years and see the difference live turns a static chart into a conversation.", from: "my-datatraining" },
  { area: "Analytics craft", title: "Metric design before charts", body: "Agree what a metric means, how it is calculated and who owns it before anyone opens the report builder.", from: "Data Viz Clarity" },
  { area: "Analytics craft", title: "Audit metrics for hidden ambiguity", body: "Metrics that look obvious often hide different definitions. A short audit can surface the confusion early.", from: "Data Viz Clarity" },
  { area: "Analytics craft", title: "Not everything has to be a dashboard", body: "Sometimes a note, a table or a meeting is the right answer. Match the format to the decision.", from: "Data Viz Clarity" },
  { area: "Analytics craft", title: "Track how often reports get redone", body: "A high redesign rate signals unclear requirements, not slow developers.", from: "Data Viz Clarity" },
  { area: "Modelling & DAX", title: "Define the contract when using AI for DAX", body: "When an assistant writes DAX, a precise description of inputs, outputs and edge cases decides whether the result is trustworthy.", from: "SQLBI" },
  { area: "Modelling & DAX", title: "Measure the cost of visual calculations", body: "Visual calculations are convenient; check their performance impact on large models before standardising on them.", from: "SQLBI" },
  { area: "Modelling & DAX", title: "Refactor duplicated DAX into functions", body: "Reusable functions replace copy-pasted logic and make changes one-place edits.", from: "SQLBI" },
  { area: "Modelling & DAX", title: "Projects go wrong without data modelling", body: "The most skipped step in analytics work is the one that decides whether everything after it holds together.", from: "Data With Baraa" },
  { area: "Career & practice", title: "Skills a Power BI developer needs next", body: "Moving from clicking in Desktop to scripting models and reports, and to working with AI assistants, is becoming part of the job.", from: "my-datatraining" },
  { area: "Career & practice", title: "Compare the main AI tools for Excel and Power BI work", body: "Training providers are publishing side-by-side tests of the leading assistants; treat results as a snapshot and re-test on your own data.", from: "Wise Owl" },
];

export const biNewsSources = [
  { name: "SQLBI", url: "https://www.sqlbi.com/" },
  { name: "Data Viz Clarity", url: "https://datavizclarity.com/" },
  { name: "my-datatraining", url: "https://my-datatraining.io/" },
  { name: "Wise Owl", url: "https://www.wiseowl.co.uk/" },
  { name: "Data With Baraa", url: "https://datawithbaraa.substack.com/" },
  { name: "Power Platform Weekly", url: "https://ppweekly.substack.com/" },
];

export const biInfographics = [
  { id: "bi1", title: "What shipped in Power BI and Fabric", caption: "Curated updates by theme, with how many are generally available versus preview.", file: "assets/img/bi/01-what-shipped" },
  { id: "bi2", title: "From prompt to report: the AI authoring stack", caption: "How Copilot, agent skills, the Desktop Bridge and data agents fit around the semantic model.", file: "assets/img/bi/02-ai-authoring" },
  { id: "bi3", title: "A semantic model checklist", caption: "Six layers to get right, from model shape to DAX reuse to refresh and review.", file: "assets/img/bi/03-model-checklist" },
  { id: "bi4", title: "From request to report: a design flow", caption: "Five steps that keep dashboards useful: question, metric, model, design, review.", file: "assets/img/bi/04-design-flow" },
];
