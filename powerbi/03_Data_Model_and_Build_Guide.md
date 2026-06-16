# EuroFoods — Data Model & Page-by-Page Build Guide

## 1 · Star schema

```
                       ┌────────────────┐
                       │    Calendar    │  (Date dim — Marked as Date Table)
                       │  Date · Year · │
                       │ Month · Quarter│
                       └────────┬───────┘
                                │ 1
                                │  Date → Date
                                │ *
┌──────────────┐ 1   *  ┌───────┴────────┐  *   1 ┌──────────────┐
│  Dim_Products │───────│  TRANSACTIONS  │────────│ Dim_Customers│
│  SKU (key)    │ SKU→  │  (fact, 25,200)│ Cust→  │ Customer_Name│
│  Price·Cost   │  SKU  │  Revenue·COGS  │  Name  │ Segment·Terms│
│  Target_Mgn   │       │  Volume·Margin │        │              │
└──────────────┘       └────────────────┘        └──────────────┘

   ┌───────────────────┐ *      1 ┌──────────────┐
   │ Actuals_vs_Budget │ (already merged in Power Query — flat 288-row table;
   │  Year·Month·Ctry· │  no relationship required for Page 3 visuals)
   │  Category + Act + │
   │  Budget columns   │
   └───────────────────┘
```

### Relationships to create (Model view)

| From (many)        | To (one)      | Key                       | Cardinality | Cross-filter |
|--------------------|---------------|---------------------------|-------------|--------------|
| Transactions[Date] | Calendar[Date]| Date                      | Many→One    | Single       |
| Transactions[SKU]  | Products[SKU] | SKU                       | Many→One    | Single       |
| Transactions[Customer] | Customers[Customer_Name] | name           | Many→One    | Single       |

> The budget comparison is handled by **merging in Power Query** (`Actuals_vs_Budget`), which sidesteps
> the composite-key problem entirely. The grain is already `(Year, Month, Country, Category)`, identical
> to Budget — so the join is clean and the variance measures are exact.

### Why this is the correct grain match
Transactions are weekly × product × customer. Budget is monthly × country × category. You **cannot**
relate them directly without losing rows or fanning out. The fix: roll the fact up to the budget grain
(`Actuals_Monthly`), then left-join Budget onto it. Every euro is preserved and comparable.

---

## 2 · Page-by-page build (mirrors the live HTML dashboard in `../index.html`)

### Page 1 — Executive Summary
| Visual | Field / Measure |
|---|---|
| 4 KPI cards | `[Total Revenue]`, `[Gross Margin]`, `[Margin %]`, `[YoY Growth]` |
| Clustered bar | Axis `Country`; values `[Total Revenue]` (teal) + `[Budget Revenue]` (amber) |
| Line (overlay) | Axis `Calendar[MonthName]`; Legend `Calendar[Year]`; value `[Total Revenue]` |
| Donut | Legend `Segment`; value `[Total Revenue]` |
| Slicers | `Country`, `Calendar[Year]`, `Calendar[Quarter]` |

### Page 2 — Category Deep-Dive
| Visual | Field / Measure |
|---|---|
| Stacked bar | Axis `Category`; Legend `Country`; value `[Total Revenue]` |
| Line | Axis `Calendar[YearMonth]` (sorted by `YearMonthSort`); Legend `Category`; value `[Margin %]` |
| Matrix | Rows `Category`,`Country`; values `[Total Revenue]`,`[Total COGS]`,`[Margin %]` — **conditional format `[Margin %]`: green ≥ 40%** |
| Bar (Top 10) | Axis `Product`; value `[Total Revenue]`; Top-N filter = 10, descending |
| Slicers | `Category`, `Segment` |

### Page 3 — Budget Variance
| Visual | Field / Measure |
|---|---|
| 2 cards | `[Revenue Variance]`, `[Variance %]` (red < 0) |
| Waterfall | Category on axis; `[Revenue Variance]` as Y; breakdown by `Category` |
| Matrix | Rows `Country`,`Category`; values `[Actual Revenue (Monthly)]`,`[Budget Revenue]`,`[Revenue Variance]`,`[Variance %]` — conditional format on `[Variance %]` |
| Clustered bar | Axis `Quarter`; Legend `Country`; value `[Variance %]` |

### Page 4 — Forecast & What-If
| Visual | Field / Measure |
|---|---|
| Line + projection | `[Total Revenue]` by month, plus `[Forecast Revenue]` for Jan–Mar 2025 |
| What-If slicer | `'Growth Rate'[Growth Rate]` slider (−10 … +20) |
| Cards | `[Forecast FY2025 Revenue]`, `[Forecast Margin]`, `[Forecast Scenario Label]` |
| Scenario | `Scenario_Rates` table + `[Scenario Net Impact]` |

---

## 3 · Formatting standard (apply on every page)
- **Actual = teal `#0891B2`**, **Budget = amber `#F59E0B`**, **unfavorable = red `#EF4444`**, **favorable = green `#10B981`**.
- Revenue `€#,##0`; Margin `0.0%`; Variance `+#,##0;−#,##0`.
- Sync `Country` + `Year` slicers across all pages (View → Sync slicers).
- Text box on each page: *“Data as of: December 2024.”*
- Data labels on cards and ≤10-point charts only.

The included **`index.html`** is a pixel-faithful, fully-interactive reference of this exact design with
the real numbers already computed — use it to check your Power BI build looks and behaves correctly.
