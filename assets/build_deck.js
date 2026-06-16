const pptx = require("/opt/homebrew/lib/node_modules/pptxgenjs");
const P = new pptx();
P.layout = "LAYOUT_WIDE";          // 13.3 x 7.5
P.author = "EuroFoods FP&A";
P.title  = "EuroFoods S.A. — FY2024 Performance Review";

// palette
const INK="0B1220", PANEL="16213B", PANEL2="1C2A47", TEAL="0891B2", TEAL2="22D3EE",
      ICE="CADCFC", AMBER="F59E0B", GREEN="10B981", RED="EF4444", MUT="8FA3C4", WHITE="F4F8FF";
const SERIF="Cambria", SANS="Calibri";
const W=13.33, H=7.5;
const shadow=()=>({type:"outer",color:"000000",blur:9,offset:3,angle:90,opacity:0.28});

function darkBase(s){s.background={color:INK};}
function lightBase(s){s.background={color:"F4F7FC"};}

// kicker + title header for content slides
function header(s,kick,title,sub){
  s.addText(kick,{x:0.6,y:0.42,w:11,h:0.3,fontFace:SANS,fontSize:12,bold:true,color:TEAL,charSpacing:3});
  s.addText(title,{x:0.58,y:0.7,w:12,h:0.7,fontFace:SERIF,fontSize:30,bold:true,color:"112038"});
  if(sub) s.addText(sub,{x:0.6,y:1.42,w:12.1,h:0.4,fontFace:SANS,fontSize:13,italic:true,color:"5A6B86"});
}
// stat card on dark
function statCard(s,x,y,w,val,lab,sub,accent){
  s.addShape(P.shapes.ROUNDED_RECTANGLE,{x,y,w,h:1.7,fill:{color:PANEL},rectRadius:0.09,shadow:shadow()});
  s.addShape(P.shapes.OVAL,{x:x+0.22,y:y+0.26,w:0.16,h:0.16,fill:{color:accent}});
  s.addText(lab.toUpperCase(),{x:x+0.46,y:y+0.18,w:w-0.6,h:0.3,fontFace:SANS,fontSize:10.5,bold:true,color:MUT,charSpacing:1});
  s.addText(val,{x:x+0.2,y:y+0.46,w:w-0.4,h:0.7,fontFace:SERIF,fontSize:32,bold:true,color:WHITE});
  s.addText(sub,{x:x+0.22,y:y+1.18,w:w-0.4,h:0.4,fontFace:SANS,fontSize:11,color:accent});
}

/* ===== Slide 1 — Title ===== */
let s=P.addSlide(); darkBase(s);
s.addShape(P.shapes.OVAL,{x:9.3,y:-2.6,w:7,h:7,fill:{color:TEAL,transparency:78}});
s.addShape(P.shapes.OVAL,{x:11.0,y:3.6,w:5,h:5,fill:{color:TEAL2,transparency:86}});
s.addShape(P.shapes.ROUNDED_RECTANGLE,{x:0.85,y:1.05,w:0.95,h:0.95,fill:{color:TEAL},rectRadius:0.16});
s.addText("€F",{x:0.85,y:1.05,w:0.95,h:0.95,align:"center",valign:"middle",fontFace:SERIF,fontSize:30,bold:true,color:"04222B"});
s.addText("EUROFOODS S.A.",{x:1.95,y:1.12,w:8,h:0.4,fontFace:SANS,fontSize:15,bold:true,color:ICE,charSpacing:4});
s.addText("FP&A COMMAND CENTER",{x:1.97,y:1.5,w:8,h:0.3,fontFace:SANS,fontSize:11,color:MUT,charSpacing:3});
s.addText("FY2024 Performance Review",{x:0.85,y:2.7,w:11.5,h:1.0,fontFace:SERIF,fontSize:50,bold:true,color:WHITE});
s.addText([
  {text:"Grew ",options:{color:ICE}},{text:"+5.4%",options:{color:TEAL2,bold:true}},
  {text:" — yet finished ",options:{color:ICE}},{text:"4.6% short of plan.",options:{color:AMBER,bold:true}},
],{x:0.87,y:3.85,w:11.5,h:0.6,fontFace:SERIF,fontSize:24,italic:true});
s.addText("A data-driven diagnosis of 2 years and 25,200 transactions — performance, profitability, budget variance, and the 2025 outlook.",
  {x:0.87,y:4.6,w:10.8,h:0.7,fontFace:SANS,fontSize:14,color:MUT});
s.addShape(P.shapes.LINE,{x:0.9,y:5.7,w:11.5,h:0,line:{color:"2A3B5C",width:1}});
s.addText([
  {text:"Data for FP&A · Albert School 2026",options:{color:ICE,bold:true}},
  {text:"    |    Live 4-page Power BI dashboard + management summary",options:{color:MUT}},
],{x:0.9,y:5.85,w:11.5,h:0.4,fontFace:SANS,fontSize:12});
s.addNotes("Open confident. One-line hook: EuroFoods had a good year on the surface — +5.4% revenue, margins steady — but we missed budget in every single country and category. Today I'll show why, and what to do. Everything here is computed live from the 25,200-row transaction table.");

/* ===== Slide 2 — Context & approach ===== */
s=P.addSlide(); lightBase(s);
header(s,"CONTEXT","The business and the data model",null);
const ctx=[["3","Countries — France (lead), Germany, UK"],
  ["20","SKUs across 4 categories"],["4","Channels — Hyper, Super, Convenience, Online"],
  ["36","Named retail customers"]];
ctx.forEach((c,i)=>{const x=0.6+i*3.07;
  s.addShape(P.shapes.ROUNDED_RECTANGLE,{x,y:2.0,w:2.85,h:1.5,fill:{color:"FFFFFF"},rectRadius:0.08,shadow:shadow()});
  s.addText(c[0],{x:x+0.15,y:2.18,w:2.55,h:0.7,fontFace:SERIF,fontSize:34,bold:true,color:TEAL});
  s.addText(c[1],{x:x+0.18,y:2.9,w:2.5,h:0.5,fontFace:SANS,fontSize:11.5,color:"33425C"});});
s.addText("Star schema — how the model fits together",{x:0.6,y:3.85,w:11,h:0.4,fontFace:SANS,fontSize:14,bold:true,color:"112038"});
const flow=[["Transactions","Fact · 25,200 rows · weekly"],["Calendar","Date dim · marked as date table"],
  ["Products / Customers","Dimensions · SKU & name keys"],["Actuals_vs_Budget","Fact rolled to monthly grain"]];
flow.forEach((f,i)=>{const x=0.6+i*3.07;
  s.addShape(P.shapes.ROUNDED_RECTANGLE,{x,y:4.35,w:2.85,h:1.25,fill:{color:i==0?"0E2A39":"EAF4F8"},rectRadius:0.08,line:{color:TEAL,width:1}});
  s.addText(f[0],{x:x+0.15,y:4.5,w:2.55,h:0.4,fontFace:SANS,fontSize:13,bold:true,color:i==0?TEAL2:"0E5A6E"});
  s.addText(f[1],{x:x+0.15,y:4.92,w:2.55,h:0.6,fontFace:SANS,fontSize:10.5,color:i==0?ICE:"3E5060"});
  if(i<3)s.addText("→",{x:x+2.82,y:4.62,w:0.3,h:0.6,fontSize:18,bold:true,color:TEAL,align:"center"});});
s.addText("The core challenge: Budget is monthly × country × category, but Transactions are weekly × SKU × customer. We aggregate the fact up to the budget grain (Power Query group-by + merge) so actual-vs-budget is an exact, like-for-like comparison.",
  {x:0.6,y:5.85,w:12.1,h:0.9,fontFace:SANS,fontSize:12.5,italic:true,color:"4A5A74"});
s.addNotes("Keep this short — 45 seconds. Emphasise the grain-matching challenge because it's worth 20% of the grade: weekly SKU-level fact vs monthly category-level budget. We solved it by rolling actuals up to the budget grain in Power Query, then left-joining budget on Year+Month+Country+Category.");

/* ===== Slide 3 — Scorecard ===== */
s=P.addSlide(); darkBase(s);
s.addText("THE SCORECARD",{x:0.6,y:0.45,w:11,h:0.3,fontFace:SANS,fontSize:12,bold:true,color:TEAL,charSpacing:3});
s.addText("2024 in one screen",{x:0.58,y:0.74,w:12,h:0.7,fontFace:SERIF,fontSize:30,bold:true,color:WHITE});
statCard(s,0.6,1.85,3.0,"€2.36M","Revenue 2024","+5.4% vs 2023",TEAL2);
statCard(s,3.75,1.85,3.0,"38.7%","Gross Margin","held flat YoY",GREEN);
statCard(s,6.9,1.85,3.0,"−4.6%","vs Budget","−€114.6k miss",RED);
statCard(s,10.05,1.85,3.0,"+11.9%","Q3 2024","strongest quarter",AMBER);
s.addShape(P.shapes.ROUNDED_RECTANGLE,{x:0.6,y:3.85,w:12.13,h:3.05,fill:{color:PANEL},rectRadius:0.09,shadow:shadow()});
s.addText("Quarterly revenue — 2023 vs 2024",{x:0.95,y:4.05,w:8,h:0.4,fontFace:SANS,fontSize:14,bold:true,color:ICE});
s.addChart(P.charts.BAR,[
  {name:"2023",labels:["Q1","Q2","Q3","Q4"],values:[526397,569987,582129,562864]},
  {name:"2024",labels:["Q1","Q2","Q3","Q4"],values:[534915,583222,651406,593499]},
],{x:0.8,y:4.45,w:7.4,h:2.3,barDir:"col",chartColors:[MUT,TEAL2],
  showLegend:true,legendPos:"b",legendColor:ICE,
  catAxisLabelColor:ICE,valAxisLabelColor:MUT,valAxisHidden:false,
  valGridLine:{color:"2A3B5C",size:0.5},catGridLine:{style:"none"},
  valAxisLabelFormatCode:'€#,##0,"k"',chartArea:{fill:{color:PANEL}},plotArea:{fill:{color:PANEL}}});
s.addText([
  {text:"The verdict\n",options:{bold:true,color:TEAL2,fontSize:15,breakLine:true}},
  {text:"A solid, profitable year — but the entire growth story is muted by a budget that was set ~5% too high across the board. ",options:{color:ICE,fontSize:12.5,breakLine:true}},
  {text:"\nThe Q3 surge (+11.9%) is the bright spot worth protecting.",options:{color:AMBER,fontSize:12.5}},
],{x:8.5,y:4.35,w:4.0,h:2.3,fontFace:SANS,valign:"top",lineSpacingMultiple:1.05});
s.addNotes("This is the anchor slide. Walk the four cards left to right. Then the chart: note every quarter grew, and Q3 is the standout. Land the verdict line: good performance, over-optimistic plan.");

/* ===== Slide 4 — Country & Segment ===== */
s=P.addSlide(); lightBase(s);
header(s,"PERFORMANCE","Where the money is — and who's really growing",null);
s.addShape(P.shapes.ROUNDED_RECTANGLE,{x:0.6,y:1.95,w:6.0,h:4.9,fill:{color:"FFFFFF"},rectRadius:0.08,shadow:shadow()});
s.addText("Revenue & margin by country",{x:0.9,y:2.12,w:5.5,h:0.4,fontFace:SANS,fontSize:14,bold:true,color:"112038"});
s.addChart(P.charts.BAR,[{name:"Revenue",labels:["France","Germany","UK"],values:[1817440,1542888,1244091]}],
  {x:0.75,y:2.55,w:5.6,h:4.0,barDir:"col",chartColors:[TEAL],showValue:true,dataLabelColor:"112038",
   dataLabelPosition:"outEnd",dataLabelFormatCode:'€#,##0.0,,"M"',
   catAxisLabelColor:"33425C",valAxisHidden:true,valGridLine:{style:"none"},showLegend:false,
   chartArea:{fill:{color:"FFFFFF"}}});
s.addText("All three countries earn an identical ~38.7% margin — geography drives scale, not profitability.",
  {x:0.9,y:6.35,w:5.5,h:0.45,fontFace:SANS,fontSize:11,italic:true,color:"5A6B86"});
s.addShape(P.shapes.ROUNDED_RECTANGLE,{x:6.9,y:1.95,w:5.83,h:4.9,fill:{color:"FFFFFF"},rectRadius:0.08,shadow:shadow()});
s.addText("Segment growth 2023 → 2024  (YoY %)",{x:7.2,y:2.12,w:5.4,h:0.4,fontFace:SANS,fontSize:14,bold:true,color:"112038"});
s.addChart(P.charts.BAR,[{name:"YoY",labels:["Supermarket","Convenience","Hypermarket","Online"],values:[5.9,5.4,5.3,4.9]}],
  {x:7.05,y:2.55,w:5.5,h:3.6,barDir:"bar",chartColors:[GREEN,GREEN,GREEN,RED],showValue:true,
   dataLabelColor:"112038",dataLabelPosition:"outEnd",dataLabelFormatCode:'0.0"%"',
   catAxisLabelColor:"33425C",valAxisHidden:true,valGridLine:{style:"none"},showLegend:false,
   chartArea:{fill:{color:"FFFFFF"}}});
s.addText([{text:"Contrarian finding:  ",options:{bold:true,color:RED}},
  {text:"Online (+4.9%) is the SLOWEST channel — brick-and-mortar grew +6.0%. The digital channel is diluting growth, not driving it.",options:{color:"33425C"}}],
  {x:7.2,y:6.25,w:5.4,h:0.55,fontFace:SANS,fontSize:11.5});
s.addNotes("Two findings here. (1) France leads revenue but margins are flat across countries — so country mix is a scale lever, not a margin lever. (2) The headline surprise: Online is the slowest grower. Everyone assumes e-commerce leads; here it lags the stores. Expect a question on this — answer: it's a real signal to audit Online pricing and fulfilment cost.");

/* ===== Slide 5 — Margin & products ===== */
s=P.addSlide(); lightBase(s);
header(s,"PROFITABILITY","Margins are healthy — but Frozen Food lags target",null);
s.addShape(P.shapes.ROUNDED_RECTANGLE,{x:0.6,y:1.95,w:7.4,h:4.9,fill:{color:"FFFFFF"},rectRadius:0.08,shadow:shadow()});
s.addText("Actual category margin vs target",{x:0.9,y:2.12,w:6.8,h:0.4,fontFace:SANS,fontSize:14,bold:true,color:"112038"});
s.addChart(P.charts.BAR,[
  {name:"Actual margin %",labels:["Dry Goods","Beverages","Frozen Food","Fresh Produce"],values:[47.9,41.8,34.9,29.9]},
  {name:"Category target %",labels:["Dry Goods","Beverages","Frozen Food","Fresh Produce"],values:[48,42,35,30]},
],{x:0.75,y:2.55,w:7.1,h:4.05,barDir:"col",chartColors:[TEAL,AMBER],showLegend:true,legendPos:"b",
   legendColor:"33425C",catAxisLabelColor:"33425C",valAxisLabelColor:MUT,
   valGridLine:{color:"E2E8F0",size:0.5},catGridLine:{style:"none"},valAxisMaxVal:60,valAxisMinVal:0,
   chartArea:{fill:{color:"FFFFFF"}}});
s.addShape(P.shapes.ROUNDED_RECTANGLE,{x:8.3,y:1.95,w:4.43,h:4.9,fill:{color:"0E2A39"},rectRadius:0.08,shadow:shadow()});
s.addText("Read this carefully",{x:8.6,y:2.2,w:3.8,h:0.4,fontFace:SANS,fontSize:13,bold:true,color:TEAL2});
s.addText([
  {text:"All 5 Frozen Food SKUs",options:{bold:true,color:WHITE,breakLine:true}},
  {text:"sit below their 35% target (≈34.9%).",options:{color:ICE,breakLine:true}},
  {text:"\n11 of 20 SKUs are marginally under target — but only Frozen is systematic.",options:{color:ICE,breakLine:true}},
  {text:"\n→ A category-wide cost / pricing issue,",options:{bold:true,color:AMBER,breakLine:true}},
  {text:"not weak products. The lever is sourcing & price — ",options:{color:ICE}},
  {text:"not discontinuation.",options:{bold:true,color:AMBER}},
],{x:8.6,y:2.7,w:3.85,h:4.0,fontFace:SANS,fontSize:13,valign:"top",lineSpacingMultiple:1.05});
s.addNotes("Pre-empt the obvious question 'which products to cut?'. Answer: none. The below-target SKUs miss by tenths of a point — that's noise around a tightly managed target. The one real pattern is Frozen Food as a category. So the recommendation is cost/price action on frozen, not delisting.");

/* ===== Slide 6 — Budget variance ===== */
s=P.addSlide(); darkBase(s);
s.addText("BUDGET VARIANCE",{x:0.6,y:0.45,w:11,h:0.3,fontFace:SANS,fontSize:12,bold:true,color:TEAL,charSpacing:3});
s.addText("The miss is volume, not price — and it's everywhere",{x:0.58,y:0.74,w:12.5,h:0.7,fontFace:SERIF,fontSize:28,bold:true,color:WHITE});
s.addShape(P.shapes.ROUNDED_RECTANGLE,{x:0.6,y:1.85,w:7.5,h:5.0,fill:{color:PANEL},rectRadius:0.09,shadow:shadow()});
s.addText("Two-year variance bridge (€)",{x:0.9,y:2.05,w:6.8,h:0.4,fontFace:SANS,fontSize:14,bold:true,color:ICE});
s.addChart(P.charts.BAR,[{name:"€",labels:["Volume effect","Price / mix effect","Total variance"],values:[-226227,-321,-226547]}],
  {x:0.75,y:2.5,w:7.2,h:4.1,barDir:"bar",chartColors:[RED],showValue:true,dataLabelColor:WHITE,
   dataLabelPosition:"outEnd",dataLabelFormatCode:'€#,##0',catAxisLabelColor:ICE,valAxisHidden:true,
   valGridLine:{style:"none"},showLegend:false,chartArea:{fill:{color:PANEL}},plotArea:{fill:{color:PANEL}}});
statCard(s,8.4,1.85,4.3,"−4.7%","Volume vs plan","56,816 fewer units",RED);
s.addShape(P.shapes.ROUNDED_RECTANGLE,{x:8.4,y:3.75,w:4.33,h:3.1,fill:{color:PANEL},rectRadius:0.09,shadow:shadow()});
s.addText("Why it matters",{x:8.65,y:3.95,w:3.9,h:0.4,fontFace:SANS,fontSize:13,bold:true,color:TEAL2});
s.addText([
  {text:"Actuals are ~5% under plan in ",options:{color:ICE}},
  {text:"every country and every category",options:{bold:true,color:WHITE}},
  {text:" — France, Germany, UK all −5.0%.\n",options:{color:ICE,breakLine:true}},
  {text:"\nUniformity that total isn't an execution failure — it's an ",options:{color:ICE}},
  {text:"over-optimistic top-down budget.",options:{bold:true,color:AMBER}},
  {text:" Price was on target; the plan simply assumed too many units.",options:{color:ICE}},
],{x:8.65,y:4.4,w:3.9,h:2.3,fontFace:SANS,fontSize:12.5,valign:"top",lineSpacingMultiple:1.04});
s.addNotes("This is the most important analytical slide. The price-volume bridge proves the miss is 100% volume (−€226k) and essentially 0% price (−€321). Combined with the perfect uniformity across geographies and categories, the only coherent explanation is the budget itself was set too high. That reframes the whole conversation from 'who underperformed' to 'fix the planning process.'");

/* ===== Slide 7 — Forecast & scenario ===== */
s=P.addSlide(); lightBase(s);
header(s,"FORECAST & WHAT-IF","2025 outlook and scenario modelling",null);
s.addShape(P.shapes.ROUNDED_RECTANGLE,{x:0.6,y:1.95,w:6.6,h:4.9,fill:{color:"FFFFFF"},rectRadius:0.08,shadow:shadow()});
s.addText("FY2025 revenue scenarios (off €2.36M base)",{x:0.9,y:2.12,w:6.1,h:0.4,fontFace:SANS,fontSize:14,bold:true,color:"112038"});
s.addChart(P.charts.BAR,[{name:"FY2025 €",labels:["Pessimistic −3%","Central +5%","Optimistic +12%"],values:[2292251,2481194,2646607]}],
  {x:0.75,y:2.55,w:6.3,h:3.7,barDir:"col",chartColors:[RED,TEAL,GREEN],showValue:true,dataLabelColor:"112038",
   dataLabelPosition:"outEnd",dataLabelFormatCode:'€#,##0.0,,"M"',catAxisLabelColor:"33425C",valAxisHidden:true,
   valGridLine:{style:"none"},showLegend:false,chartArea:{fill:{color:"FFFFFF"}}});
s.addText("To reach €2.5M in 2025, EuroFoods needs +5.8% — just above the +5.4% delivered in 2024. Achievable, not a stretch.",
  {x:0.9,y:6.3,w:6.1,h:0.5,fontFace:SANS,fontSize:11.5,italic:true,color:"5A6B86"});
s.addShape(P.shapes.ROUNDED_RECTANGLE,{x:7.5,y:1.95,w:5.23,h:4.9,fill:{color:"FFFFFF"},rectRadius:0.08,shadow:shadow()});
s.addText("Scenario: Online +20% & Convenience −10%",{x:7.75,y:2.12,w:4.8,h:0.4,fontFace:SANS,fontSize:13.5,bold:true,color:"112038"});
s.addTable([
  [{text:"Segment",options:{bold:true,color:"FFFFFF",fill:{color:TEAL},fontSize:11.5}},
   {text:"Δ Revenue",options:{bold:true,color:"FFFFFF",fill:{color:TEAL},align:"right",fontSize:11.5}}],
  ["Online +20%",{text:"+€106,820",options:{align:"right",color:"0A7A52",bold:true}}],
  ["Convenience −10%",{text:"−€38,407",options:{align:"right",color:"B91C1C",bold:true}}],
  [{text:"Net impact",options:{bold:true}},{text:"+€68,413",options:{align:"right",bold:true,color:"0A7A52"}}],
  [{text:"% of 2024 revenue",options:{italic:true,color:"5A6B86"}},{text:"+2.9%",options:{align:"right",italic:true,color:"5A6B86"}}],
],{x:7.75,y:2.62,w:4.75,h:2.3,fontFace:SANS,fontSize:12,border:{pt:0.5,color:"E2E8F0"},rowH:0.45,fill:{color:"FFFFFF"}});
s.addText([{text:"The Online uplift more than offsets the Convenience decline",options:{bold:true,color:"112038"}},
  {text:" — but only because Online is the bigger base. Worth doing; modest in size.",options:{color:"33425C"}}],
  {x:7.75,y:5.2,w:4.75,h:1.4,fontFace:SANS,fontSize:12.5,valign:"top"});
s.addNotes("Show the three scenarios, then the segment shock table. Net +€68k from the Online-up/Convenience-down scenario. Tie back to the €2.5M target: only +5.8% needed, basically a repeat of 2024. The what-if is fully live in the dashboard — offer to drag the slider during the demo.");

/* ===== Slide 8 — Recommendations ===== */
s=P.addSlide(); lightBase(s);
header(s,"RECOMMENDATIONS","Three moves for 2025",null);
const recs=[
  ["01","Rebase the 2025 budget on actuals","Reset targets to a realistic +5–6% volume path off 2024 actuals. Converts a chronic −5% 'miss' into a credible plan and restores forecast trust.","Restores planning credibility",TEAL],
  ["02","Fix or re-cost the Online channel","Online (+4.9%) lags stores (+6.0%). Audit price, fulfilment cost & assortment; a focused +20% push offsets a −10% Convenience dip.","+€50–80k revenue",AMBER],
  ["03","Attack Frozen Food cost-to-serve","Renegotiate frozen supply or lift price 1–2% to pull the category back above its 35% target — no volume risk if paired with seasonal promo.","+€15–20k margin",GREEN]];
recs.forEach((r,i)=>{const y=2.0+i*1.62;
  s.addShape(P.shapes.ROUNDED_RECTANGLE,{x:0.6,y,w:12.13,h:1.45,fill:{color:"FFFFFF"},rectRadius:0.08,shadow:shadow()});
  s.addShape(P.shapes.OVAL,{x:0.9,y:y+0.36,w:0.72,h:0.72,fill:{color:r[4]}});
  s.addText(r[0],{x:0.9,y:y+0.36,w:0.72,h:0.72,align:"center",valign:"middle",fontFace:SERIF,fontSize:22,bold:true,color:"FFFFFF"});
  s.addText(r[1],{x:1.85,y:y+0.2,w:7.7,h:0.5,fontFace:SANS,fontSize:16.5,bold:true,color:"112038"});
  s.addText(r[2],{x:1.87,y:y+0.66,w:7.7,h:0.7,fontFace:SANS,fontSize:11.5,color:"44546B"});
  s.addShape(P.shapes.ROUNDED_RECTANGLE,{x:9.9,y:y+0.34,w:2.5,h:0.78,fill:{color:"F0F9FB"},rectRadius:0.06});
  s.addText(r[3],{x:9.92,y:y+0.34,w:2.46,h:0.78,align:"center",valign:"middle",fontFace:SANS,fontSize:12.5,bold:true,color:r[4]});});
s.addNotes("Three recommendations, each with an owner-ready impact. Rec 1 is the big one — it's free and fixes the credibility problem. Rec 2 and 3 are quantified upside. Total addressable: roughly €65–100k plus a more trustworthy plan.");

/* ===== Slide 9 — Risks ===== */
s=P.addSlide(); darkBase(s);
s.addText("RISKS & ASSUMPTIONS",{x:0.6,y:0.45,w:11,h:0.3,fontFace:SANS,fontSize:12,bold:true,color:TEAL,charSpacing:3});
s.addText("What could break the plan",{x:0.58,y:0.74,w:12,h:0.7,fontFace:SERIF,fontSize:30,bold:true,color:WHITE});
const risks=[
  ["Flat-price assumption","Scenarios hold 2024 prices. Input-cost inflation could erode the Frozen Food margin recovery before it lands.",AMBER],
  ["FX translation risk","UK is 27% of revenue. EUR/GBP swung 0.831–0.883 (~6%) over the period — currency moves aren't captured in these EUR figures.",TEAL2],
  ["Linear, seasonality-repeats forecast","The projection assumes 2024 seasonal patterns recur. A demand shock or the loss of a concentrated key account would invalidate it.",RED]];
risks.forEach((r,i)=>{const y=2.0+i*1.55;
  s.addShape(P.shapes.ROUNDED_RECTANGLE,{x:0.6,y,w:12.13,h:1.35,fill:{color:PANEL},rectRadius:0.08,shadow:shadow()});
  s.addShape(P.shapes.OVAL,{x:0.95,y:y+0.5,w:0.34,h:0.34,fill:{color:r[2]}});
  s.addText(r[0],{x:1.55,y:y+0.2,w:10.8,h:0.45,fontFace:SANS,fontSize:16,bold:true,color:WHITE});
  s.addText(r[1],{x:1.57,y:y+0.66,w:10.8,h:0.6,fontFace:SANS,fontSize:12.5,color:ICE});});
s.addNotes("Show intellectual honesty here — examiners reward it. Three assumptions that, if wrong, change the recommendations: cost inflation vs flat prices, FX on the 27% UK exposure, and the linearity/seasonality assumption in the forecast.");

/* ===== Slide 10 — Close ===== */
s=P.addSlide(); darkBase(s);
s.addShape(P.shapes.OVAL,{x:-2.5,y:4.0,w:7,h:7,fill:{color:TEAL,transparency:80}});
s.addShape(P.shapes.OVAL,{x:10.5,y:-2.6,w:6,h:6,fill:{color:TEAL2,transparency:86}});
s.addText("IN ONE LINE",{x:0.85,y:1.2,w:11,h:0.3,fontFace:SANS,fontSize:12,bold:true,color:TEAL,charSpacing:3});
s.addText("A profitable, growing business held back by an over-optimistic plan.",
  {x:0.85,y:1.7,w:11.6,h:1.6,fontFace:SERIF,fontSize:34,bold:true,color:WHITE,lineSpacingMultiple:1.0});
const take=["Rebase the budget — the −4.6% miss is planning, not performance",
  "Wake up the Online channel — it lags the stores it should be beating",
  "Recover Frozen Food margin through cost & price, not delisting"];
take.forEach((t,i)=>{const y=3.65+i*0.62;
  s.addShape(P.shapes.OVAL,{x:0.9,y:y+0.06,w:0.2,h:0.2,fill:{color:TEAL2}});
  s.addText(t,{x:1.25,y:y-0.05,w:11,h:0.45,fontFace:SANS,fontSize:15,color:ICE});});
s.addShape(P.shapes.LINE,{x:0.9,y:5.95,w:11.5,h:0,line:{color:"2A3B5C",width:1}});
s.addText([{text:"Thank you  ·  Questions?",options:{bold:true,color:WHITE,fontSize:18}},
  {text:"     Ask me about the DAX, the grain-matching, or drag the what-if slider live.",options:{color:MUT,fontSize:13}}],
  {x:0.9,y:6.2,w:11.6,h:0.6,fontFace:SANS,valign:"middle"});
s.addNotes("Close strong with the one-liner. Recap the three takeaways. Then invite questions and explicitly offer to demo the live dashboard and explain the DAX — that signals depth and confidence, which is 20% of the grade.");

P.writeFile({fileName:"deliverables/EuroFoods_Presentation.pptx"}).then(f=>console.log("WROTE",f));
