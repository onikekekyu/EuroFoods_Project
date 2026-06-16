# EuroFoods S.A. — FP&A Case Study · Complete Submission

> Built for **Data for FP&A · Albert School 2026**. Every number in this package is computed
> live from the 25,200-row transaction table in `case_study_eurofoods.xlsx` — nothing is hand-typed.

## 🚀 Start here

| What | File | How to open |
|------|------|-------------|
| **Interactive dashboard** (the showpiece) | [`index.html`](index.html) | Double-click → opens in any browser. 4 pages + cover, live slicers, working what-if slider. |
| **Management summary** (1 page) | [`deliverables/management_summary.pdf`](deliverables/management_summary.pdf) | Print-ready PDF |
| **Presentation** (10 slides) | [`deliverables/EuroFoods_Presentation.pptx`](deliverables/EuroFoods_Presentation.pptx) | PowerPoint — speaker notes included on every slide |
| **Power BI build kit** | [`powerbi/`](powerbi/) | DAX + M scripts + data-model guide |

The dashboard is the fastest way to grasp the story; the Power BI kit lets you rebuild the exact same
thing inside Power BI Desktop for the data-model & DAX portion of the grade.

---

## 📊 The three deliverables

### 1 · Dashboard
`index.html` is a fully self-contained, **genuinely interactive** dashboard (no Power BI required to view it):
- **Cover** — headline verdict + 4 KPIs + the 3 key findings
- **Page 1 · Executive Summary** — KPIs, revenue by country (actual vs budget), monthly trend overlay, segment donut
- **Page 2 · Category Deep-Dive** — stacked revenue, margin-% trend, conditional-format matrix, top-10 products
- **Page 3 · Budget Variance** — waterfall bridge, variance matrix, quarterly variance, price-volume cards
- **Page 4 · Forecast & What-If** — 3-month projection + a working growth-rate slider + the Online/Convenience scenario

Every **Country / Year / Segment / Category / Quarter** slicer recomputes *all* visuals client-side from an
embedded aggregated cube — drag them and watch the whole dashboard react.

> Power BI rebuild instructions for this exact layout are in
> [`powerbi/03_Data_Model_and_Build_Guide.md`](powerbi/03_Data_Model_and_Build_Guide.md).

### 2 · Management summary
[`deliverables/management_summary.pdf`](deliverables/management_summary.pdf) — one page: executive summary,
top-3 data-backed findings, 3 recommendations with quantified impact, and risks/assumptions.
Source: [`deliverables/management_summary.html`](deliverables/management_summary.html).

### 3 · Presentation
[`deliverables/EuroFoods_Presentation.pptx`](deliverables/EuroFoods_Presentation.pptx) — 10 slides, native
editable charts, presenter notes (talking points + likely Q&A answers) attached to each slide.

---

## 🔑 The headline story (all figures verifiable)

| Finding | Evidence |
|---|---|
| **+5.4% revenue growth in 2024** (€2.24M → €2.36M); margin flat at **38.7%** | `Transactions` grouped by year |
| **Missed budget by −4.6% (−€114.6k)** in 2024 — and by ~5% in *every* country & category | `Actuals_vs_Budget` |
| The miss is **100% volume** (−€226k), **~0% price** (−€321) → over-optimistic plan | price-volume bridge |
| **Online is the *slowest* channel** (+4.9% vs +6.0% for stores) | segment YoY |
| **All 5 Frozen Food SKUs below their 35% target** → category cost issue, not delisting | product margin vs target |
| **Beverages most seasonal** (Jul index 136 vs Feb 74) | monthly seasonal index |
| Scenario *Online +20% / Convenience −10%* → **net +€68.4k (+2.9%)** | 2024 segment base |
| **€2.5M in 2025 needs only +5.8%** — just above 2024's +5.4% | 2024 base |

---

## 🛠️ How it was built / reproduce
```
analysis/   – (working notes)
data/       – analysis_core.json, dashboard_data.json, Actuals_*.csv (PBI-ready)
assets/     – data.js (embedded cube), app.js (dashboard engine), build_deck.js
powerbi/    – 01 Power Query M · 02 DAX measures · 03 data model & build guide
deliverables/ – management_summary.(html|pdf) · EuroFoods_Presentation.pptx
```
Re-run the analysis or rebuild the deck:
```bash
python3 -c "import pandas"          # analysis uses pandas/openpyxl
node assets/build_deck.js          # regenerates the .pptx
```

*EuroFoods S.A. · Confidential — Internal FP&A · Data as of December 2024.*
