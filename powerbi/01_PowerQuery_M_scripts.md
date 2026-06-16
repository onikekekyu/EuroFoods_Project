# EuroFoods — Power Query (M) Scripts

Paste each block into a **Blank Query** (Home → New Source → Blank Query → Advanced Editor).
Import `Transactions`, `Budget`, `Products`, `Customers`, `FX_Rates` first via **Get Data → Excel** (this
auto-generates the correct file path). Only the two derived tables below need the Advanced Editor.

---

## 1 · Calendar (date dimension)

```m
let
    StartDate = #date(2023, 1, 1),
    EndDate   = #date(2025, 3, 31),
    DayCount  = Duration.Days(EndDate - StartDate) + 1,
    DateList  = List.Dates(StartDate, DayCount, #duration(1,0,0,0)),
    ToTable   = Table.FromList(DateList, Splitter.SplitByNothing(), {"Date"}, null, ExtraValues.Error),
    TypedDate = Table.TransformColumnTypes(ToTable, {{"Date", type date}}),
    Year      = Table.AddColumn(TypedDate, "Year", each Date.Year([Date]), Int64.Type),
    Month     = Table.AddColumn(Year, "Month", each Date.Month([Date]), Int64.Type),
    MonthName = Table.AddColumn(Month, "MonthName", each Date.ToText([Date], "MMM"), type text),
    Quarter   = Table.AddColumn(MonthName, "Quarter", each "Q" & Text.From(Date.QuarterOfYear([Date])), type text),
    YearMonth = Table.AddColumn(Quarter, "YearMonth", each Text.From([Year]) & "-" & Text.PadStart(Text.From([Month]),2,"0"), type text),
    // sort key so the YearMonth axis orders chronologically (Sort by column in Data view)
    YMSort    = Table.AddColumn(YearMonth, "YearMonthSort", each [Year]*100 + [Month], Int64.Type)
in
    YMSort
```

After loading: **Data view → Calendar → Sort `YearMonth` by `YearMonthSort`**, then
**Table tools → Mark as date table → Date**.

---

## 2 · Budget — add the YearMonth join key

In the `Budget` query, add a custom column:

```m
Text.From([Year]) & "-" & Text.PadStart(Text.From([Month]), 2, "0")
```

---

## 3 · Actuals_Monthly (aggregate fact to budget grain)

```m
let
    Source  = Transactions,
    Grouped = Table.Group(Source, {"Year","Month","Country","Category"}, {
        {"Actual_Revenue", each List.Sum([Revenue]),      type number},
        {"Actual_COGS",    each List.Sum([COGS]),         type number},
        {"Actual_Volume",  each List.Sum([Volume]),       Int64.Type},
        {"Actual_Margin",  each List.Sum([Gross_Margin]), type number}
    }),
    YearMonth = Table.AddColumn(Grouped, "YearMonth",
        each Text.From([Year]) & "-" & Text.PadStart(Text.From([Month]),2,"0"), type text)
in
    YearMonth
```

---

## 4 · Actuals_vs_Budget (merge — recommended, Approach A)

```m
let
    Source = Actuals_Monthly,
    Merged = Table.NestedJoin(Source, {"YearMonth","Country","Category"},
                              Budget, {"YearMonth","Country","Category"},
                              "B", JoinKind.LeftOuter),
    Expand = Table.ExpandTableColumn(Merged, "B",
                {"Budget_Revenue","Budget_COGS","Budget_Volume","Budget_Gross_Margin"})
in
    Expand
```

This single flat table powers every Page-3 visual. Grain = (Year, Month, Country, Category) = 288 rows —
exactly matching the Budget grain, so actual-vs-budget comparison is apples-to-apples.

> **Pre-built copies** of `Actuals_Monthly.csv` and `Actuals_vs_Budget.csv` are in `../data/` if you
> prefer to import the result directly rather than rebuild the query.
