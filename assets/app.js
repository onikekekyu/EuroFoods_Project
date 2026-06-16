/* ===== EuroFoods FP&A Command Center — engine ===== */
const C = {teal:'#0891B2',amber:'#F59E0B',red:'#EF4444',green:'#10B981',
  bev:'#22D3EE',fresh:'#34D399',dry:'#FBBF24',frozen:'#818CF8',
  fr:'#60A5FA',de:'#FBBF24',uk:'#2DD4BF',grid:'#243352',mut:'#8FA3C4',txt:'#E8EEF8'};
const CAT_COL={'Beverages':C.bev,'Fresh Produce':C.fresh,'Dry Goods':C.dry,'Frozen Food':C.frozen};
const CTRY_COL={'France':C.fr,'Germany':C.de,'UK':C.uk};
const MONTHS=DATA.months;
const fmtE=(n,d=0)=>'€'+Number(n).toLocaleString('en-US',{maximumFractionDigits:d,minimumFractionDigits:d});
const fmtK=n=>{n=Number(n);if(Math.abs(n)>=1e6)return '€'+(n/1e6).toFixed(2)+'M';if(Math.abs(n)>=1e3)return '€'+(n/1e3).toFixed(0)+'k';return '€'+n.toFixed(0);};
const fmtP=(n,d=1)=>(n>=0?'+':'')+ (n*100).toFixed(d)+'%';
const pct=(n,d=1)=>(n*100).toFixed(d)+'%';

/* ---------- filter state ---------- */
const ALL={year:[2023,2024],country:['France','Germany','UK'],
  segment:['Hypermarket','Supermarket','Convenience','Online'],
  category:['Beverages','Fresh Produce','Dry Goods','Frozen Food'],
  quarter:['Q1','Q2','Q3','Q4']};
let F={year:[],country:[],segment:[],category:[],quarter:[]}; // empty = all

const inF=(v,dim)=>F[dim].length===0||F[dim].includes(v);
function fcube(extra){return DATA.cube.filter(r=>inF(r.Year,'year')&&inF(r.Country,'country')&&inF(r.Segment,'segment')&&inF(r.Category,'category')&&inF(r.Quarter,'quarter')&&(!extra||extra(r)));}
function fbud(extra){return DATA.bcube.filter(r=>inF(r.Year,'year')&&inF(r.Country,'country')&&inF(r.Category,'category')&&inF(r.Quarter,'quarter')&&(!extra||extra(r)));}
function fpc(extra){return DATA.pcube.filter(r=>inF(r.Year,'year')&&inF(r.Country,'country')&&inF(r.Segment,'segment')&&inF(r.Category,'category')&&(!extra||extra(r)));}
const sum=(a,k)=>a.reduce((s,r)=>s+(+r[k]||0),0);

/* ---------- slicer UI ---------- */
function buildSlicers(){
  const map={'slc-year':['year',ALL.year],'slc-country':['country',ALL.country],
    'slc-segment':['segment',ALL.segment],'slc-category':['category',ALL.category],'slc-quarter':['quarter',ALL.quarter]};
  for(const id in map){const[dim,vals]=map[id];const el=document.getElementById(id);el.innerHTML='';
    vals.forEach(v=>{const b=document.createElement('div');b.className='chip';b.textContent=v;
      b.onclick=()=>{const i=F[dim].indexOf(v);i>=0?F[dim].splice(i,1):F[dim].push(v);render();};
      el.appendChild(b);});}
}
function syncChips(){
  const map={'slc-year':'year','slc-country':'country','slc-segment':'segment','slc-category':'category','slc-quarter':'quarter'};
  for(const id in map){const dim=map[id];[...document.getElementById(id).children].forEach(c=>{
    let v=c.textContent; if(dim==='year')v=+v;
    c.classList.toggle('on',F[dim].includes(v));});}
}
function resetFilters(){F={year:[],country:[],segment:[],category:[],quarter:[]};render();}

/* ---------- nav ---------- */
const TITLES={cover:['Overview','Performance Cockpit'],p1:['Page 1','Executive Summary'],
  p2:['Page 2','Category Deep-Dive'],p3:['Page 3','Budget Variance Analysis'],p4:['Page 4','Forecast & What-If']};
let CURPG='cover';
document.querySelectorAll('#nav button').forEach(b=>b.onclick=()=>{
  CURPG=b.dataset.pg;
  document.querySelectorAll('#nav button').forEach(x=>x.classList.remove('active'));b.classList.add('active');
  document.querySelectorAll('.page,.cover').forEach(p=>p.classList.remove('show'));
  document.getElementById(CURPG).classList.add('show');
  document.getElementById('pgkick').textContent=TITLES[CURPG][0];
  document.getElementById('pgtitle').textContent=TITLES[CURPG][1];
  document.getElementById('slicers').style.display=CURPG==='cover'?'none':'flex';
  render();window.scrollTo(0,0);
});

/* ---------- chart helpers ---------- */
const charts={};
function mk(id,cfg){if(charts[id])charts[id].destroy();
  cfg.options=cfg.options||{};cfg.options.responsive=true;cfg.options.maintainAspectRatio=false;
  cfg.options.animation={duration:600,easing:'easeOutQuart'};
  charts[id]=new Chart(document.getElementById(id),cfg);}
Chart.defaults.color=C.mut;Chart.defaults.font.family="'Segoe UI',system-ui,sans-serif";
Chart.defaults.font.size=11.5;
const gridO={grid:{color:'rgba(36,51,82,.55)'},ticks:{color:C.mut}};
const noGrid={grid:{display:false},ticks:{color:C.mut}};
const lgd=(pos='top')=>({display:true,position:pos,labels:{usePointStyle:true,pointStyle:'circle',boxWidth:8,padding:14,color:C.txt}});

/* ===================== RENDER ===================== */
function render(){syncChips();
  if(CURPG==='cover')renderCover();
  if(CURPG==='p1')renderP1();
  if(CURPG==='p2')renderP2();
  if(CURPG==='p3')renderP3();
  if(CURPG==='p4')renderP4();
}

/* ---------- aggregations reused ---------- */
function totals(){const c=fcube();return{R:sum(c,'R'),Cg:sum(c,'C'),G:sum(c,'G'),V:sum(c,'V')};}
function yoy(){ // ignores year filter, applies others
  const f=r=>inF(r.Country,'country')&&inF(r.Segment,'segment')&&inF(r.Category,'category')&&inF(r.Quarter,'quarter');
  const c=DATA.cube.filter(f);
  const r23=sum(c.filter(r=>r.Year===2023),'R'),r24=sum(c.filter(r=>r.Year===2024),'R');
  const g23=sum(c.filter(r=>r.Year===2023),'G'),g24=sum(c.filter(r=>r.Year===2024),'G');
  return{r23,r24,g23,g24,rev:r23?(r24-r23)/r23:0,gm:g23?(g24-g23)/g23:0};
}
function byMonth(year){const c=fcube(r=>r.Year===year);const out=Array(12).fill(0);
  c.forEach(r=>out[r.Month-1]+=r.R);return out;}
function marginByMonth(year){const R=Array(12).fill(0),G=Array(12).fill(0);
  fcube(r=>r.Year===year).forEach(r=>{R[r.Month-1]+=r.R;G[r.Month-1]+=r.G;});
  return R.map((r,i)=>r?G[i]/r*100:null);}

/* ===================== COVER ===================== */
function renderCover(){
  const t=totals(),y=yoy();
  const cells=[
    ['Total Revenue (2yr)',fmtK(DATA.kpi.revenue),'b-teal','24-month base'],
    ['Gross Margin',fmtK(DATA.kpi.gm),'b-green',pct(DATA.kpi.margin)+' margin — held flat'],
    ['YoY Growth 2024',fmtP(DATA.kpi.yoy),'b-amber',fmtK(DATA.kpi.rev24-DATA.kpi.rev23)+' added'],
    ['Budget Variance 2024',fmtP(DATA.budget.var24/DATA.budget.bud24),'b-red',fmtK(DATA.budget.var24)+' below plan']];
  document.getElementById('coverkpis').innerHTML=cells.map(c=>
    `<div class="card kpi"><div class="bar ${c[2]}"></div><div class="lab">${c[0]}</div>
     <div class="val">${c[1]}</div><div class="meta">${c[3]}</div></div>`).join('');
  const f=[
    ['FINDING 01','The budget gap is volume, not price',`Actuals are <b>~5% below plan in every country and category</b>. The price-volume bridge shows the entire €${Math.abs(Math.round(DATA.bridge.total)).toLocaleString()} miss is volume (<b>${fmtK(DATA.bridge.vol_eff)}</b>) — price/mix was essentially nil. The plan over-assumed units, not euros per unit.`],
    ['FINDING 02','Online is the slowest grower, not the fastest',`Conventional wisdom says e-commerce leads. Here <b>Online grew only +4.9%</b> while brick-and-mortar grew <b>+6.0%</b>. Supermarket (+5.9%) is the real engine. The digital channel is underperforming the base.`],
    ['FINDING 03','Margins are healthy but Frozen Food lags',`Group margin is a steady <b>${pct(DATA.kpi.margin)}</b>. But <b>all 5 Frozen Food SKUs sit below their 35% target</b> — a category-wide cost issue, not weak individual products. No SKU warrants discontinuation; the lever is sourcing/pricing.`]];
  document.getElementById('coverfindings').innerHTML=f.map(x=>
    `<div class="fcard"><div class="n">${x[0]}</div><h4>${x[1]}</h4><p>${x[2]}</p></div>`).join('');
}

/* ===================== PAGE 1 ===================== */
function renderP1(){
  const t=totals(),y=yoy();
  const m=t.R?t.G/t.R:0;
  const kp=[
    ['Total Revenue',fmtK(t.R),'b-teal',(t.V/1e6).toFixed(2)+'M units sold','Filtered'],
    ['Gross Margin',fmtK(t.G),'b-green',pct(m)+' margin','Profit'],
    ['Margin %',pct(m),m>=0.4?'b-green':'b-amber','vs 40% benchmark','Profitability'],
    ['YoY Revenue Growth',fmtP(y.rev),y.rev>=0?'b-green':'b-red',fmtK(y.r24-y.r23)+' Δ','2024 vs 2023']];
  document.getElementById('p1-kpis').innerHTML=kp.map(c=>{
    const cls=c[0]==='YoY Revenue Growth'?(y.rev>=0?'up':'down'):'';
    return `<div class="card kpi"><div class="bar ${c[2]}"></div><div class="lab">${c[0]}</div>
      <div class="val">${c[1]}</div><div class="meta"><span class="${cls?'pill '+cls:''}">${c[3]}</span></div></div>`;}).join('');

  // country actual vs budget
  const ctry=['France','Germany','UK'].filter(c=>inF(c,'country'));
  const act=ctry.map(c=>sum(fcube(r=>r.Country===c),'R'));
  const bud=ctry.map(c=>sum(fbud(r=>r.Country===c),'BR'));
  mk('c-country',{type:'bar',data:{labels:ctry,datasets:[
    {label:'Actual',data:act,backgroundColor:C.teal,borderRadius:6,barPercentage:.62,categoryPercentage:.7},
    {label:'Budget',data:bud,backgroundColor:C.amber,borderRadius:6,barPercentage:.62,categoryPercentage:.7}]},
    options:{plugins:{legend:lgd(),tooltip:{callbacks:{label:c=>c.dataset.label+': '+fmtK(c.raw)}}},
      scales:{x:noGrid,y:{...gridO,ticks:{color:C.mut,callback:v=>fmtK(v)}}}}});

  // segment donut
  const segs=ALL.segment.filter(s=>inF(s,'segment'));
  const segv=segs.map(s=>sum(fcube(r=>r.Segment===s),'R'));
  mk('c-seg',{type:'doughnut',data:{labels:segs,datasets:[{data:segv,
    backgroundColor:[C.teal,'#22D3EE',C.amber,C.frozen],borderColor:'#111A2E',borderWidth:3}]},
    options:{cutout:'62%',plugins:{legend:lgd('bottom'),tooltip:{callbacks:{label:c=>{
      const tot=segv.reduce((a,b)=>a+b,0);return c.label+': '+fmtK(c.raw)+' ('+pct(c.raw/tot)+')';}}}}}});

  // monthly trend 23 vs 24
  mk('c-trend',{type:'line',data:{labels:MONTHS,datasets:[
    {label:'2023',data:byMonth(2023),borderColor:C.mut,backgroundColor:'transparent',tension:.35,borderWidth:2,pointRadius:0,borderDash:[5,4]},
    {label:'2024',data:byMonth(2024),borderColor:C.teal,backgroundColor:'rgba(8,145,178,.12)',fill:true,tension:.35,borderWidth:3,pointRadius:3,pointBackgroundColor:C.teal}]},
    options:{plugins:{legend:lgd(),tooltip:{callbacks:{label:c=>c.dataset.label+': '+fmtK(c.raw)}}},
      scales:{x:noGrid,y:{...gridO,ticks:{color:C.mut,callback:v=>fmtK(v)}}}}});

  document.getElementById('p1-insight').innerHTML=
    `<b>France leads on both revenue and margin</b> (${pct(0.395)} of revenue) yet all three countries earn an almost identical ${pct(m)} margin — geography drives <b>scale, not profitability</b>. The 2024 line sits above 2023 in 11 of 12 months, with the gap widening sharply in <b>Q3</b> (the +11.9% summer surge).`;
}

/* ===================== PAGE 2 ===================== */
function renderP2(){
  const cats=ALL.category.filter(c=>inF(c,'category'));
  const ctry=['France','Germany','UK'].filter(c=>inF(c,'country'));
  // stacked revenue by category split by country
  mk('c-catcountry',{type:'bar',data:{labels:cats,datasets:ctry.map(co=>({
    label:co,data:cats.map(ca=>sum(fcube(r=>r.Category===ca&&r.Country===co),'R')),
    backgroundColor:CTRY_COL[co],borderRadius:4,barPercentage:.7}))},
    options:{plugins:{legend:lgd(),tooltip:{callbacks:{label:c=>c.dataset.label+': '+fmtK(c.raw)}}},
      scales:{x:{stacked:true,...noGrid},y:{stacked:true,...gridO,ticks:{callback:v=>fmtK(v)}}}}});

  // margin % by category by month (avg both years that pass filter)
  const yrs=ALL.year.filter(y=>inF(y,'year'));
  const cmm=cats.map(ca=>{const R=Array(12).fill(0),G=Array(12).fill(0);
    fcube(r=>r.Category===ca).forEach(r=>{R[r.Month-1]+=r.R;G[r.Month-1]+=r.G;});
    return{ca,data:R.map((r,i)=>r?+(G[i]/r*100).toFixed(1):null)};});
  mk('c-catmargin',{type:'line',data:{labels:MONTHS,datasets:cmm.map(d=>({
    label:d.ca,data:d.data,borderColor:CAT_COL[d.ca],backgroundColor:'transparent',tension:.35,borderWidth:2.5,pointRadius:0}))},
    options:{plugins:{legend:lgd(),tooltip:{callbacks:{label:c=>c.dataset.label+': '+c.raw+'%'}}},
      scales:{x:noGrid,y:{...gridO,ticks:{callback:v=>v+'%'}}}}});

  // top 10 products
  const prodAgg={};
  fpc().forEach(r=>{prodAgg[r.Product]=prodAgg[r.Product]||{R:0,G:0,cat:r.Category};
    prodAgg[r.Product].R+=r.R;prodAgg[r.Product].G+=r.G;});
  const top=Object.entries(prodAgg).map(([p,v])=>({p,...v})).sort((a,b)=>b.R-a.R).slice(0,10);
  mk('c-top',{type:'bar',data:{labels:top.map(t=>t.p.length>22?t.p.slice(0,21)+'…':t.p),datasets:[{
    data:top.map(t=>t.R),backgroundColor:top.map(t=>CAT_COL[t.cat]),borderRadius:5}]},
    options:{indexAxis:'y',plugins:{legend:{display:false},tooltip:{callbacks:{label:c=>fmtK(c.raw)}}},
      scales:{x:{...gridO,ticks:{callback:v=>fmtK(v)}},y:noGrid}}});

  // matrix cat x country
  let html='<table><thead><tr><th>Category</th>'+ctry.map(c=>`<th>${c} Rev</th><th>${c} Mgn%</th>`).join('')+'<th>Total Mgn%</th></tr></thead><tbody>';
  cats.forEach(ca=>{html+=`<tr><td><b>${ca}</b></td>`;let tR=0,tG=0;
    ctry.forEach(co=>{const c=fcube(r=>r.Category===ca&&r.Country===co);const R=sum(c,'R'),G=sum(c,'G');tR+=R;tG+=G;
      const mp=R?G/R*100:0;html+=`<td>${fmtK(R)}</td><td>${mpTag(mp)}</td>`;});
    const tm=tR?tG/tR*100:0;html+=`<td>${mpTag(tm)}</td></tr>`;});
  html+='</tbody></table>';document.getElementById('matrix-cc').innerHTML=html;

  document.getElementById('p2-insight').innerHTML=
    `<b>Beverages is the most seasonal category</b> (summer peak index 136 in July vs 74 trough in February) — a planning and inventory signal. Margins are flat-to-stable all year, but <b>Frozen Food rides the lowest band (~35%)</b>, confirming the structural margin gap rather than a seasonal dip.`;
}
function mpTag(mp){let bg,col;
  if(mp>=40){bg='rgba(16,185,129,.16)';col='#34D399';}
  else if(mp>=35){bg='rgba(245,158,11,.16)';col='#FBBF24';}
  else{bg='rgba(239,68,68,.16)';col='#F87171';}
  return `<span class="mtag" style="background:${bg};color:${col}">${mp.toFixed(1)}%</span>`;}

/* ===================== PAGE 3 ===================== */
function renderP3(){
  const act=sum(fcube(),'R'),bud=sum(fbud(),'BR');
  const v=act-bud,vp=bud?v/bud:0;
  const aV=sum(fcube(),'V'),bV=sum(fbud(),'BV');
  const kp=[
    ['Actual Revenue',fmtK(act),'b-teal','Filtered scope'],
    ['Budget Revenue',fmtK(bud),'b-amber','Plan target'],
    ['Revenue Variance',fmtK(v),v>=0?'b-green':'b-red',fmtP(vp)+' vs plan'],
    ['Volume Variance',fmtP(bV?(aV-bV)/bV:0),'b-purp',(aV-bV).toLocaleString()+' units']];
  document.getElementById('p3-kpis').innerHTML=kp.map(c=>
    `<div class="card kpi"><div class="bar ${c[2]}"></div><div class="lab">${c[0]}</div>
     <div class="val" style="font-size:25px">${c[1]}</div><div class="meta">${c[3]}</div></div>`).join('');

  // waterfall: budget -> +/- per category -> actual
  const cats=ALL.category.filter(c=>inF(c,'category'));
  const labels=['Budget',...cats,'Actual'];
  const base=[],bar=[],col=[];
  base.push(0);bar.push(bud);col.push(C.amber);
  let run=bud;
  cats.forEach(ca=>{const a=sum(fcube(r=>r.Category===ca),'R'),b=sum(fbud(r=>r.Category===ca),'BR');const d=a-b;
    const lo=Math.min(run,run+d);base.push(lo);bar.push(Math.abs(d));col.push(d>=0?C.green:C.red);run+=d;});
  base.push(0);bar.push(run);col.push(C.teal);
  const wfDelta=cats.map(ca=>sum(fcube(r=>r.Category===ca),'R')-sum(fbud(r=>r.Category===ca),'BR'));
  const wfTip=(idx)=>{const lab=labels[idx];if(lab==='Budget')return fmtK(bud);if(lab==='Actual')return fmtK(run);
    const d=wfDelta[idx-1];return (d>=0?'+':'')+fmtK(d);};
  mk('c-wf',{type:'bar',data:{labels,datasets:[
    {data:base,backgroundColor:'transparent',stack:'s'},
    {data:bar,backgroundColor:col,borderRadius:4,stack:'s'}]},
    options:{plugins:{legend:{display:false},tooltip:{filter:i=>i.datasetIndex===1,callbacks:{label:c=>wfTip(c.dataIndex)}}},
      scales:{x:noGrid,y:{...gridO,ticks:{callback:v=>fmtK(v)}}}}});

  // quarterly variance by country
  const ctry=['France','Germany','UK'].filter(c=>inF(c,'country'));
  const qs=['Q1','Q2','Q3','Q4'].filter(q=>inF(q,'quarter'));
  mk('c-qvar',{type:'bar',data:{labels:qs,datasets:ctry.map(co=>({
    label:co,data:qs.map(q=>{const a=sum(fcube(r=>r.Country===co&&r.Quarter===q),'R'),
      b=sum(fbud(r=>r.Country===co&&r.Quarter===q),'BR');return b?+((a-b)/b*100).toFixed(1):0;}),
    backgroundColor:CTRY_COL[co],borderRadius:4,barPercentage:.8}))},
    options:{plugins:{legend:lgd(),tooltip:{callbacks:{label:c=>c.dataset.label+': '+c.raw+'%'}}},
      scales:{x:noGrid,y:{...gridO,ticks:{callback:v=>v+'%'}}}}});

  // matrix country x category variance
  let html='<table><thead><tr><th>Country</th><th>Category</th><th>Actual</th><th>Budget</th><th>Variance</th><th>Var %</th></tr></thead><tbody>';
  ctry.forEach(co=>{cats.forEach(ca=>{const a=sum(fcube(r=>r.Country===co&&r.Category===ca),'R'),
    b=sum(fbud(r=>r.Country===co&&r.Category===ca),'BR');const dv=a-b,dp=b?dv/b*100:0;
    let col=dp>=0?'#34D399':dp>=-5?'#FBBF24':'#F87171';
    html+=`<tr><td>${co}</td><td>${ca}</td><td>${fmtK(a)}</td><td>${fmtK(b)}</td>
      <td style="color:${col}">${fmtK(dv)}</td><td><span class="mtag" style="background:rgba(0,0,0,.2);color:${col}">${dp.toFixed(1)}%</span></td></tr>`;});});
  html+='</tbody></table>';document.getElementById('matrix-var').innerHTML=html;

  // worst country
  const worst=ctry.map(co=>{const a=sum(fcube(r=>r.Country===co),'R'),b=sum(fbud(r=>r.Country===co),'BR');return{co,vp:b?(a-b)/b:0};}).sort((x,y)=>x.vp-y.vp)[0];
  document.getElementById('p3-insight').innerHTML=
    `The shortfall is <b>remarkably uniform — every country and category lands ~5% under plan</b>. That pattern points to an <b>over-optimistic top-down budget</b>, not a localized execution failure. With price on target, the fix is realistic <b>volume</b> planning. ${worst?`Most exposed in scope: <b>${worst.co}</b> (${fmtP(worst.vp)}).`:''}`;
}

/* ===================== PAGE 4 ===================== */
let GROWTH=5;
function renderP4(){
  const slider=document.getElementById('growth');
  slider.oninput=()=>{GROWTH=+slider.value;renderP4();};
  document.getElementById('gval').textContent=(GROWTH>=0?'+':'')+GROWTH+'%';
  const g=GROWTH/100;
  // badge
  const badge=document.getElementById('scenbadge');
  let lab,bcol;
  if(GROWTH>=10){lab='OPTIMISTIC';bcol=C.green;}else if(GROWTH>=0){lab='CENTRAL';bcol=C.teal;}else{lab='PESSIMISTIC';bcol=C.red;}
  badge.textContent=lab;badge.style.background='rgba(255,255,255,.06)';badge.style.color=bcol;badge.style.border='1px solid '+bcol;

  // base = 2024 filtered
  const r24=sum(fcube(r=>r.Year===2024),'R');
  const g24=sum(fcube(r=>r.Year===2024),'G');
  // projection: 2024 monthly * (1+g) for Jan-Mar
  const m24=byMonth(2024);
  const proj=[m24[0],m24[1],m24[2]].map(x=>x*(1+g));
  // build trend = 24 months actual then 3 projected
  const actual23=byMonth(2023),actual24=m24;
  const labels=[...MONTHS.map(m=>m+' 23'),...MONTHS.map(m=>m+' 24'),'Jan 25','Feb 25','Mar 25'];
  const actualSeries=[...actual23,...actual24,null,null,null];
  const projSeries=[...Array(23).fill(null),actual24[11],...proj];
  mk('c-fc',{type:'line',data:{labels,datasets:[
    {label:'Actual',data:actualSeries,borderColor:C.teal,backgroundColor:'rgba(8,145,178,.10)',fill:true,tension:.3,borderWidth:2.5,pointRadius:0},
    {label:'Projection',data:projSeries,borderColor:C.amber,borderDash:[6,4],tension:.3,borderWidth:2.5,pointRadius:3,pointBackgroundColor:C.amber}]},
    options:{plugins:{legend:lgd(),tooltip:{callbacks:{label:c=>c.raw==null?'':c.dataset.label+': '+fmtK(c.raw)}}},
      scales:{x:{...noGrid,ticks:{maxTicksLimit:9,color:C.mut}},y:{...gridO,ticks:{callback:v=>fmtK(v)}}}}});

  // forecast cards (FY2025 = 2024 base * (1+scenario))
  const scen=[['Pessimistic',-0.03,C.red],['Central',g,C.teal],['Optimistic',0.12,C.green]];
  const cardsHtml=[['Forecast FY2025 Revenue',fmtK(r24*(1+g)),C.teal,`at ${(GROWTH>=0?'+':'')+GROWTH}% (your slider)`],
    ['Forecast FY2025 Margin',fmtK(g24*(1+g)),C.green,`${pct(r24?g24/r24:0)} margin held`]];
  document.getElementById('fc-cards').innerHTML=cardsHtml.map(c=>
    `<div class="card kpi" style="padding:14px"><div class="bar" style="background:${c[2]}"></div>
     <div class="lab" style="font-size:10px">${c[0]}</div><div class="val" style="font-size:22px">${c[1]}</div>
     <div class="meta">${c[3]}</div></div>`).join('');

  // target callout
  const need=r24?(2500000/r24-1):0;
  document.getElementById('target-callout').innerHTML=
    `To reach <b>€2.5M in 2025</b> from this scope's ${fmtK(r24)} base, you need <b>${fmtP(need)}</b> growth — ${need<=0.054?'below':'above'} the +5.4% delivered in 2024.`;

  // scenario table Online +20 / Conv -10
  const segs=['Hypermarket','Supermarket','Convenience','Online'].filter(s=>inF(s,'segment'));
  const shock={'Online':0.20,'Convenience':-0.10};
  let net=0,base=0;
  let html='<table><thead><tr><th>Segment</th><th>2024 Base</th><th>Shock</th><th>Δ Revenue</th><th>New Revenue</th></tr></thead><tbody>';
  segs.forEach(s=>{const b=sum(fcube(r=>r.Year===2024&&r.Segment===s),'R');const sh=shock[s]||0;const d=b*sh;net+=d;base+=b;
    const col=sh>0?'#34D399':sh<0?'#F87171':C.mut;
    html+=`<tr><td><b>${s}</b></td><td>${fmtK(b)}</td><td style="color:${col}">${sh?(sh>0?'+':'')+(sh*100)+'%':'—'}</td>
      <td style="color:${col}">${d?fmtK(d):'—'}</td><td>${fmtK(b+d)}</td></tr>`;});
  html+=`<tr style="border-top:2px solid var(--teal)"><td><b>NET</b></td><td><b>${fmtK(base)}</b></td><td></td>
    <td style="color:${net>=0?'#34D399':'#F87171'}"><b>${fmtK(net)}</b></td><td><b>${fmtK(base+net)}</b></td></tr>`;
  html+='</tbody></table>';
  html+=`<div class="insight" style="margin-top:12px"><div class="ico">⚖️</div><p>Net impact <b>${fmtK(net)}</b> (${fmtP(base?net/base:0)} of 2024 revenue). The Online uplift <b>more than offsets</b> the Convenience decline — but only because Online is the larger base. Worth doing, modest in size.</p></div>`;
  document.getElementById('scen-table').innerHTML=html;

  // segment growth bars
  const allSeg=['Hypermarket','Supermarket','Convenience','Online'].filter(s=>inF(s,'segment'));
  const grow=allSeg.map(s=>{const r3=sum(DATA.cube.filter(r=>r.Segment===s&&r.Year===2023&&inF(r.Country,'country')&&inF(r.Category,'category')),'R');
    const r4=sum(DATA.cube.filter(r=>r.Segment===s&&r.Year===2024&&inF(r.Country,'country')&&inF(r.Category,'category')),'R');
    return r3?(r4-r3)/r3*100:0;});
  mk('c-seggrow',{type:'bar',data:{labels:allSeg,datasets:[{data:grow.map(g=>+g.toFixed(1)),
    backgroundColor:grow.map(g=>g>=5.4?C.green:C.amber),borderRadius:6,barPercentage:.6}]},
    options:{plugins:{legend:{display:false},tooltip:{callbacks:{label:c=>'YoY '+c.raw+'%'}}},
      scales:{x:noGrid,y:{...gridO,ticks:{callback:v=>v+'%'}}}}});
}

/* ---------- boot ---------- */
buildSlicers();
document.getElementById('slicers').style.display='none'; // hidden on cover
render();
