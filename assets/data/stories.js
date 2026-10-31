/* Editorial briefs for the "Top stories" tab. Written for this site in my own words.
 * Each story is matched to an update by its exact title; facts come from that update (official release notes / docs),
 * "why" and "who" are my own analysis. Not affiliated with or endorsed by Databricks or Microsoft.
 * Fields: title (must match an update) · hook · bullets[] · watch (optional caution) · why · who[] */

export const dbxStories = [
  {
    title: "Data Classification API",
    hook: "Data classification just became something you deploy, not something you click.",
    bullets: [
      "API and Terraform support for configuring classification as code",
      "Settings can be repeated across many catalogs instead of set by hand",
      "Companion update: 50 more kinds of sensitive data detected, covering 16 more countries and regions",
    ],
    watch: "Auto-tagging configuration is still in preview, so plan production use accordingly.",
    why: "Governance that lives in code can be reviewed, repeated and audited. For anyone handling personal data at scale, that is the difference between a policy and a practice.",
    who: ["Governance leads", "Platform engineers", "Security teams"],
  },
  {
    title: "Genie Code as a job task",
    hook: "AI-assisted work can now run on a schedule.",
    bullets: [
      "Run a Genie Code prompt unattended as a Lakeflow Jobs task",
      "Each run links back to the resulting chat so the work can be reviewed",
    ],
    watch: "Unattended AI still needs a human check before its output feeds anything downstream.",
    why: "It moves AI help from an interactive tool to an operational building block that sits inside the same jobs, schedules and monitoring as the rest of your pipelines.",
    who: ["Data engineers", "Analytics leads", "AI platform teams"],
  },
  {
    title: "Transactions across Delta and Iceberg",
    hook: "One atomic transaction, whichever open table format you use.",
    bullets: [
      "Group several SQL statements into a single atomic transaction",
      "Works on managed Delta and Iceberg tables",
    ],
    why: "Multi-step updates now succeed or fail together. That means fewer half-written tables and a much simpler story when something goes wrong.",
    who: ["Data engineers", "Platform architects"],
  },
  {
    title: "ADBC driver for Power BI",
    hook: "Power BI connects to Databricks through a new default driver.",
    bullets: ["The ADBC driver becomes the default for new Power BI connections to Databricks"],
    why: "The way new reports connect is changing underneath your BI team. It is worth testing against your gateways and models before it surprises someone in production.",
    who: ["BI developers", "Power BI admins"],
  },
  {
    title: "Metric view window measures",
    hook: "Define a moving average once, reuse it everywhere.",
    bullets: [
      "Rolling, cumulative and semi-additive measures in metric views",
      "Moving averages and running totals without per-dashboard logic",
    ],
    why: "Business definitions belong in the governed layer. When the calculation lives there, every dashboard and tool gives the same number.",
    who: ["Analytics engineers", "BI leads"],
  },
  {
    title: "Jailbreak screening for MCP calls",
    hook: "Guardrails for what your agents ask tools to do.",
    bullets: [
      "Unity Gateway can inspect MCP tool calls and their results",
      "Looks for jailbreak and prompt-injection attempts",
    ],
    watch: "In Beta: pilot it on non-critical agents first.",
    why: "The moment an agent can call tools, every tool result becomes a possible attack path. Screening at the gateway gives one place to enforce it.",
    who: ["AI platform teams", "Security teams"],
  },
  {
    title: "Model churn on Unity Gateway",
    hook: "New models arrive, old ones retire. Check before you pin.",
    bullets: [
      "New: Gemini 4 Argon, Claude Haiku 5.5 and a refreshed DeepSeek V4.1 Flash",
      "Several older models are scheduled to retire",
    ],
    watch: "Check the retirement list before pinning a model in a production agent.",
    why: "Agent apps break quietly when a model disappears. Treat model choice like any other dependency with an end-of-life date.",
    who: ["AI engineers", "Platform owners"],
  },
  {
    title: "External writes to managed Delta tables",
    hook: "Outside engines can now write to your governed tables.",
    bullets: ["Outside Spark clients can create and write managed Delta tables", "Applies to tables with catalog commits turned on"],
    why: "Open access without losing governance: other engines can take part while the catalog stays the source of truth.",
    who: ["Data architects", "Platform engineers"],
  },
  {
    title: "Per-user row filters with OAuth identity claims",
    hook: "Apps can show each person only their own rows.",
    bullets: ["A custom identity claim on service-principal tokens drives row filters", "Each end user sees only the data they should"],
    why: "It lets one app serve many users safely, with security enforced in the data layer instead of re-implemented in every app.",
    who: ["App builders", "Governance leads"],
  },
];

export const biStories = [
  {
    title: "DAX user-defined functions",
    hook: "DAX finally gets reusable functions.",
    bullets: [
      "Write typed, reusable functions in DAX",
      "Available across Desktop and web modeling",
      "Companion update: optional parameters with defaults",
    ],
    why: "Copy-pasted measure logic is a maintenance trap. One function, one place to fix, and models start to look like real, reviewable code.",
    who: ["Semantic model developers", "BI leads"],
  },
  {
    title: "Modern visual defaults and the Theme pane",
    hook: "New reports start modern, and brand themes are one file.",
    bullets: [
      "New reports start on the Fluent 2 base theme",
      "A Theme pane sets palettes, text styles and page properties",
      "Themes can be imported and exported",
    ],
    why: "Teams can standardise how reports look without restyling visual by visual, which is a quiet win for consistency and speed.",
    who: ["Report designers", "BI leads"],
  },
  {
    title: "Fabric Apps on semantic models",
    hook: "Turn a semantic model into an operational app.",
    bullets: [
      "Build data apps on top of a semantic model",
      "Reuse the governance and business logic already defined there",
      "Consumers need only Read permission on the model; authors still need Build",
    ],
    watch: "Preview: confirm availability and limits in the official docs before committing a roadmap to it.",
    why: "The semantic model stops being just a reporting layer. It becomes the shared definition that apps, reports and AI all read.",
    who: ["Data product owners", "BI architects"],
  },
  {
    title: "Copilot in web modeling",
    hook: "Edit your model by describing the change.",
    bullets: [
      "Copilot inspects the model structure",
      "Applies renames, relationships and new DAX measures from a plain-language request",
    ],
    watch: "Preview: review every change as you would a colleague's pull request.",
    why: "Routine modelling chores get faster, but the skill that matters shifts to writing a clear brief and checking the result.",
    who: ["Model developers", "Analytics engineers"],
  },
  {
    title: "Fabric IQ in Microsoft 365 Copilot",
    hook: "Governed BI answers where people already work.",
    bullets: [
      "Governed Power BI content powers answers in Microsoft 365 Copilot Chat",
      "Also available in Copilot Cowork",
    ],
    why: "Answer quality now depends on model quality: names, descriptions, measures and security. Investment in the semantic layer pays off in every place it is asked.",
    who: ["BI leaders", "Data governance teams"],
  },
  {
    title: "Three refresh choices in the service",
    hook: "Refresh only what changed.",
    bullets: ["Choose schema and data, schema only, or data only", "Run refreshes per table"],
    why: "Faster fixes after small changes and less pressure on capacity, which matters most at month end.",
    who: ["Model owners", "Power BI admins"],
  },
  {
    title: "Visual calculations and custom totals",
    hook: "Running totals without touching the model.",
    bullets: [
      "Running sums, moving averages and percent-of-parent live on the visual",
      "Totals can now be None or Average as well",
    ],
    why: "Analysts can answer a question without waiting for a model change. Agree when a calculation belongs on the visual and when it belongs in the model.",
    who: ["Report authors", "Analysts"],
  },
  {
    title: "Old file picker goes away",
    hook: "Update Desktop before saving to OneDrive stops working.",
    bullets: ["Older Power BI Desktop versions lose save and share to OneDrive and SharePoint", "The fix is to update Desktop"],
    watch: "A retirement, not a new feature. Check which versions your team still runs.",
    why: "Small version drift becomes a support ticket. A quick check of installed Desktop versions avoids it.",
    who: ["BI developers", "IT support"],
  },
];
