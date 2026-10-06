"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Activity, AlertTriangle, ArrowDownRight, ArrowUpRight, BarChart3,
  Bell, Boxes, ChevronDown, CircleDollarSign, ClipboardList, Cloud,
  Gauge, LayoutDashboard, LineChart, ListChecks, Menu, Package,
  PanelLeftClose, PanelLeftOpen, Search, Settings, ShoppingCart,
  SlidersHorizontal, Sparkles, Tags, Target, Users, X
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

type ModuleKey =
  | "Dashboard" | "Ads Manager" | "Keywords" | "Search Terms" | "Inventory"
  | "Orders" | "Listings" | "Pricing" | "Fees & Profit" | "Sales Analytics"
  | "Reports" | "Automation" | "Alerts" | "Client Accounts" | "Settings";

const nav: { label: ModuleKey; icon: any; group?: string }[] = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Ads Manager", icon: Target },
  { label: "Keywords", icon: Tags },
  { label: "Search Terms", icon: Search },
  { label: "Inventory", icon: Boxes, group: "Commerce" },
  { label: "Orders", icon: ShoppingCart },
  { label: "Listings", icon: ClipboardList },
  { label: "Pricing", icon: SlidersHorizontal },
  { label: "Fees & Profit", icon: CircleDollarSign },
  { label: "Sales Analytics", icon: LineChart, group: "Insights" },
  { label: "Reports", icon: BarChart3 },
  { label: "Automation", icon: Sparkles },
  { label: "Alerts", icon: Bell },
  { label: "Client Accounts", icon: Users, group: "Workspace" },
  { label: "Settings", icon: Settings }
];

const fallbackDashboard = {
  metrics: [
    { label: "Sales", value: "₹8.42L", change: "+12.8%", trend: "up" },
    { label: "Ad Spend", value: "₹1.24L", change: "+5.4%", trend: "up" },
    { label: "ACOS", value: "14.73%", change: "-2.1%", trend: "down" },
    { label: "ROAS", value: "6.79x", change: "+8.7%", trend: "up" }
  ],
  chart: [
    { day: "Mon", sales: 82, spend: 12 }, { day: "Tue", sales: 96, spend: 14 },
    { day: "Wed", sales: 91, spend: 13 }, { day: "Thu", sales: 118, spend: 16 },
    { day: "Fri", sales: 131, spend: 18 }, { day: "Sat", sales: 146, spend: 20 },
    { day: "Sun", sales: 132, spend: 18 }
  ],
  campaigns: [
    { name: "Peanut Oil | Exact", status: "ENABLED", spend: 18420, sales: 119500, orders: 186 },
    { name: "Peanut Oil | Broad", status: "ENABLED", spend: 12480, sales: 61800, orders: 91 },
    { name: "Brand Defense", status: "PAUSED", spend: 4380, sales: 26700, orders: 44 }
  ]
};

function money(v: number) {
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(v);
}

export default function Home() {
  const [active, setActive] = useState<ModuleKey>("Dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [data, setData] = useState<any>(fallbackDashboard);
  const [inventory, setInventory] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      fetch(`${API}/dashboard`).then(r => r.ok ? r.json() : fallbackDashboard),
      fetch(`${API}/inventory`).then(r => r.ok ? r.json() : []),
      fetch(`${API}/orders`).then(r => r.ok ? r.json() : []),
      fetch(`${API}/alerts`).then(r => r.ok ? r.json() : []),
      fetch(`${API}/clients`).then(r => r.ok ? r.json() : [])
    ]).then(([d, i, o, a, c]) => {
      setData(d); setInventory(i); setOrders(o); setAlerts(a); setClients(c);
    }).catch(() => {});
  }, []);

  const content = useMemo(() => {
    if (active === "Dashboard") return <Dashboard data={data} />;
    if (active === "Ads Manager") return <AdsManager campaigns={data.campaigns || []} />;
    if (active === "Keywords") return <TablePage title="Keywords" subtitle="Search term and keyword control center" headers={["Keyword","Match","Bid","Clicks","CVR","ACOS","Status"]} rows={[
      ["premium peanut oil","Exact","₹18.40","1,284","9.2%","11.4%","Active"],
      ["cold pressed peanut oil","Phrase","₹15.20","842","7.8%","14.1%","Active"],
      ["groundnut oil 1 litre","Broad","₹11.80","621","5.4%","21.6%","Review"],
      ["virgin peanut oil","Exact","₹21.00","514","10.1%","9.8%","Active"]
    ]} />;
    if (active === "Search Terms") return <TablePage title="Search Terms" subtitle="Discover converting queries and waste" headers={["Search term","Orders","Sales","Spend","ACOS","Action"]} rows={[
      ["cold pressed peanut oil","38","₹26,562","₹2,240","8.4%","Harvest"],
      ["best peanut oil","21","₹14,679","₹2,890","19.7%","Monitor"],
      ["virgin groundnut oil","18","₹12,582","₹1,440","11.4%","Harvest"],
      ["peanut cooking oil","5","₹3,495","₹1,980","56.7%","Negate"]
    ]} />;
    if (active === "Inventory") return <Inventory data={inventory} />;
    if (active === "Orders") return <Orders data={orders} />;
    if (active === "Listings") return <TablePage title="Listings" subtitle="Catalog health and offer visibility" headers={["ASIN","SKU","Product","Price","Stock","Status"]} rows={[
      ["B0PEANUT1","PO-1L","Premium Virgin Peanut Oil 1L","₹699","1,840","Active"],
      ["B0PEANUT5","PO-5L","Premium Virgin Peanut Oil 5L","₹2,999","720","Active"],
      ["B0PEANUT5","PO-500","Premium Virgin Peanut Oil 500ML","₹399","4,260","Active"]
    ]} />;
    if (active === "Pricing") return <TablePage title="Pricing" subtitle="Monitor price position and margin" headers={["SKU","Current","Cost","Margin","Buy Box","Action"]} rows={[
      ["PO-1L","₹699","₹310","55.6%","Won","Keep"],
      ["PO-5L","₹2,999","₹1,480","50.6%","Won","Keep"],
      ["PO-500","₹399","₹168","57.9%","Won","Test"]
    ]} />;
    if (active === "Fees & Profit") return <Profit />;
    if (active === "Sales Analytics") return <Analytics />;
    if (active === "Reports") return <Reports />;
    if (active === "Automation") return <Automation />;
    if (active === "Alerts") return <Alerts data={alerts} />;
    if (active === "Client Accounts") return <Clients data={clients} />;
    return <SettingsPage />;
  }, [active, data, inventory, orders, alerts, clients]);

  return (
    <div className="min-h-screen bg-slate-50">
      <aside className={`fixed inset-y-0 left-0 z-40 border-r border-slate-200 bg-white transition-all ${collapsed ? "w-[76px]" : "w-[252px]"} ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="flex h-full flex-col">
          <div className="flex h-[76px] items-center justify-between px-5">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/20"><Gauge size={21}/></div>
              {!collapsed && <div><div className="text-lg font-extrabold tracking-tight text-slate-900">ADPILOT</div><div className="text-[10px] font-semibold uppercase tracking-[.2em] text-blue-600">Amazon Growth OS</div></div>}
            </div>
            <button onClick={() => setCollapsed(!collapsed)} className="hidden rounded-lg p-2 text-slate-400 hover:bg-slate-100 lg:block">{collapsed ? <PanelLeftOpen size={18}/> : <PanelLeftClose size={18}/>}</button>
          </div>
          <div className="px-3 py-3">
            <div className="rounded-2xl bg-blue-600 p-3 text-white shadow-lg shadow-blue-600/20">
              <div className="flex items-center gap-2"><Cloud size={16}/><span className="text-xs font-bold">Amazon connected</span></div>
              {!collapsed && <div className="mt-1 text-[11px] text-blue-100">India • Demo account</div>}
            </div>
          </div>
          <nav className="scrollbar-none flex-1 overflow-y-auto px-3 py-2">
            {nav.map((item, idx) => {
              const Icon = item.icon;
              const prev = nav[idx-1];
              const showGroup = item.group && item.group !== prev?.group;
              return <div key={item.label}>
                {showGroup && !collapsed && <div className="px-3 pb-2 pt-5 text-[10px] font-bold uppercase tracking-[.18em] text-slate-400">{item.group}</div>}
                <button onClick={() => { setActive(item.label); setMobileOpen(false); }} className={`mb-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${active === item.label ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}>
                  <Icon size={18} className={active === item.label ? "text-blue-600" : "text-slate-400"}/>
                  {!collapsed && <span>{item.label}</span>}
                  {!collapsed && item.label === "Alerts" && <span className="ml-auto rounded-full bg-red-50 px-2 py-0.5 text-[10px] text-red-600">3</span>}
                </button>
              </div>
            })}
          </nav>
          {!collapsed && <div className="border-t border-slate-100 p-3"><div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3"><div className="grid h-9 w-9 place-items-center rounded-full bg-slate-900 text-xs font-bold text-white">AK</div><div className="min-w-0"><div className="truncate text-xs font-bold">Admin</div><div className="truncate text-[11px] text-slate-400">admin@adpilot.local</div></div><ChevronDown size={15} className="ml-auto text-slate-400"/></div></div>}
        </div>
      </aside>

      {mobileOpen && <div onClick={() => setMobileOpen(false)} className="fixed inset-0 z-30 bg-slate-900/30 lg:hidden"/>}

      <main className={`${collapsed ? "lg:pl-[76px]" : "lg:pl-[252px]"} min-h-screen transition-all`}>
        <header className="sticky top-0 z-20 flex h-[76px] items-center justify-between border-b border-slate-200/80 bg-white/90 px-5 backdrop-blur-xl lg:px-8">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileOpen(true)} className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 lg:hidden"><Menu size={20}/></button>
            <div><div className="text-xs font-medium text-slate-400">Workspace / {active}</div><h1 className="text-lg font-extrabold tracking-tight text-slate-900">{active}</h1></div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 md:flex"><Search size={16} className="text-slate-400"/><input className="w-40 bg-transparent text-xs outline-none" placeholder="Search anything..."/></div>
            <button className="relative rounded-xl border border-slate-200 p-2.5 text-slate-500 hover:bg-slate-50"><Bell size={18}/><span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-red-500"/></button>
            <button className="hidden rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 sm:flex">IN ▼</button>
          </div>
        </header>
        <div className="mx-auto max-w-[1600px] p-5 lg:p-8">{content}</div>
      </main>
    </div>
  );
}

function PageHeading({title, subtitle, action}:{title:string;subtitle:string;action?:React.ReactNode}) {
  return <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><h2 className="text-2xl font-extrabold tracking-tight text-slate-900">{title}</h2><p className="mt-1 text-sm text-slate-500">{subtitle}</p></div>{action}</div>
}

function Dashboard({data}:{data:any}) {
  const chart = data.chart || fallbackDashboard.chart;
  const max = Math.max(...chart.map((x:any)=>x.sales));
  return <div>
    <PageHeading title="Good morning, Admin" subtitle="Here’s what’s happening across your Amazon business today." action={<button className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700">+ Connect Amazon</button>}/>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{data.metrics.map((m:any)=><div className="card p-5" key={m.label}><div className="flex items-start justify-between"><span className="text-xs font-bold uppercase tracking-wider text-slate-400">{m.label}</span><div className="rounded-lg bg-blue-50 p-2 text-blue-600"><Activity size={16}/></div></div><div className="mt-4 flex items-end justify-between"><div className="text-2xl font-extrabold">{m.value}</div><div className={`flex items-center gap-1 text-xs font-bold ${m.trend === "down" ? "text-emerald-600" : "text-emerald-600"}`}>{m.trend==="down"?<ArrowDownRight size={14}/>:<ArrowUpRight size={14}/>} {m.change}</div></div><div className="mt-2 text-[11px] text-slate-400">vs previous 7 days</div></div>)}</div>
    <div className="mt-6 grid gap-6 xl:grid-cols-[1.7fr_1fr]">
      <div className="card p-6"><div className="flex items-center justify-between"><div><h3 className="font-extrabold">Sales & Advertising</h3><p className="mt-1 text-xs text-slate-400">Last 7 days • ₹ in thousands</p></div><select className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold outline-none"><option>Last 7 days</option><option>Last 30 days</option></select></div><div className="mt-8 flex h-64 items-end gap-3 sm:gap-5">{chart.map((x:any)=><div key={x.day} className="flex flex-1 flex-col items-center gap-2"><div className="flex h-full w-full items-end justify-center gap-1"><div title={`Sales ₹${x.sales}k`} className="w-3 rounded-t-md bg-blue-600 sm:w-5" style={{height:`${Math.max(8,(x.sales/max)*100)}%`}}/><div title={`Spend ₹${x.spend}k`} className="w-3 rounded-t-md bg-blue-100 sm:w-5" style={{height:`${Math.max(5,(x.spend/25)*100)}%`}}/></div><span className="text-[10px] font-semibold text-slate-400">{x.day}</span></div>)}</div></div>
      <div className="card p-6"><div className="flex items-center justify-between"><div><h3 className="font-extrabold">AI Opportunities</h3><p className="mt-1 text-xs text-slate-400">Actions worth reviewing</p></div><Sparkles size={18} className="text-blue-600"/></div><div className="mt-5 space-y-3"><Opportunity color="blue" title="Scale winning keyword" text="“cold pressed peanut oil” has 8.4% ACOS."/><Opportunity color="amber" title="Review low-stock ASIN" text="PO-1L has ~6 days of cover."/><Opportunity color="emerald" title="Budget headroom" text="Brand Defense can absorb more spend." /></div></div>
    </div>
    <div className="card mt-6 overflow-hidden"><div className="flex items-center justify-between p-6"><div><h3 className="font-extrabold">Campaign Performance</h3><p className="mt-1 text-xs text-slate-400">Top campaigns by sales</p></div><button className="text-xs font-bold text-blue-600">View all →</button></div><CampaignTable rows={data.campaigns || []}/></div>
  </div>
}

function Opportunity({color,title,text}:{color:string;title:string;text:string}) {
  return <div className={`rounded-xl border p-4 ${color==="amber"?"border-amber-100 bg-amber-50/60":color==="emerald"?"border-emerald-100 bg-emerald-50/60":"border-blue-100 bg-blue-50/60"}`}><div className="flex gap-3"><div className={`mt-0.5 h-2 w-2 rounded-full ${color==="amber"?"bg-amber-500":color==="emerald"?"bg-emerald-500":"bg-blue-500"}`}/><div><div className="text-xs font-extrabold">{title}</div><div className="mt-1 text-[11px] text-slate-500">{text}</div></div></div></div>
}

function CampaignTable({rows}:{rows:any[]}) {
  return <div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left"><thead className="border-y border-slate-100 bg-slate-50/70 text-[10px] font-bold uppercase tracking-wider text-slate-400"><tr><th className="px-6 py-3">Campaign</th><th>Spend</th><th>Sales</th><th>ACOS</th><th>ROAS</th><th>Orders</th><th>Status</th></tr></thead><tbody className="divide-y divide-slate-100 text-xs">{rows.map((r:any,i:number)=>{const acos=r.sales?r.spend/r.sales*100:0; const roas=r.spend?r.sales/r.spend:0; return <tr key={i} className="hover:bg-slate-50/70"><td className="px-6 py-4 font-bold">{r.name}</td><td>₹{money(r.spend)}</td><td>₹{money(r.sales)}</td><td>{acos.toFixed(1)}%</td><td>{roas.toFixed(1)}x</td><td>{r.orders}</td><td><span className={`rounded-full px-2 py-1 text-[10px] font-bold ${r.status==="PAUSED"?"bg-slate-100 text-slate-500":"bg-emerald-50 text-emerald-700"}`}>{r.status}</span></td></tr>})}</tbody></table></div>
}

function AdsManager({campaigns}:{campaigns:any[]}) { return <div><PageHeading title="Ads Manager" subtitle="Campaigns, budgets and performance control" action={<button className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white">+ New Campaign</button>}/><div className="grid gap-4 sm:grid-cols-3"><MiniStat title="Active campaigns" value="24"/><MiniStat title="Total spend" value="₹1.24L"/><MiniStat title="Blended ROAS" value="6.79x"/></div><div className="card mt-6 overflow-hidden"><CampaignTable rows={campaigns}/></div></div> }
function MiniStat({title,value}:{title:string;value:string}) { return <div className="card p-5"><div className="text-xs font-bold text-slate-400">{title}</div><div className="mt-2 text-xl font-extrabold">{value}</div></div> }

function TablePage({title,subtitle,headers,rows}:{title:string;subtitle:string;headers:string[];rows:string[][]}) { return <div><PageHeading title={title} subtitle={subtitle} action={<button className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700">Export</button>}/><div className="card overflow-hidden"><div className="flex items-center gap-3 border-b border-slate-100 p-4"><div className="flex flex-1 items-center gap-2 rounded-xl bg-slate-50 px-3 py-2"><Search size={16} className="text-slate-400"/><input placeholder={`Search ${title.toLowerCase()}...`} className="w-full bg-transparent text-xs outline-none"/></div><button className="rounded-xl border border-slate-200 p-2.5"><SlidersHorizontal size={16}/></button></div><div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-xs"><thead className="border-b border-slate-100 bg-slate-50/70 text-[10px] uppercase tracking-wider text-slate-400"><tr>{headers.map(h=><th className="px-5 py-3 font-bold" key={h}>{h}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{rows.map((r,i)=><tr className="hover:bg-slate-50/60" key={i}>{r.map((c,j)=><td className={`px-5 py-4 ${j===0?"font-bold text-slate-800":"text-slate-600"}`} key={j}>{c}</td>)}</tr>)}</tbody></table></div></div></div> }

function Inventory({data}:{data:any[]}) { const rows=data.length?data:[{asin:"B0PEANUT1",sku:"PO-1L",fulfillable:1840,inbound:620,reserved:88},{asin:"B0PEANUT5",sku:"PO-5L",fulfillable:720,inbound:300,reserved:40},{asin:"B0PEANUT5",sku:"PO-500",fulfillable:4260,inbound:900,reserved:130}]; return <div><PageHeading title="Inventory" subtitle="FBA stock health, inbound and reserved units"/><div className="grid gap-4 sm:grid-cols-4"><MiniStat title="Fulfillable" value="6,820"/><MiniStat title="Inbound" value="1,820"/><MiniStat title="Reserved" value="258"/><MiniStat title="Low stock" value="3"/></div><div className="card mt-6 overflow-hidden"><table className="w-full text-left text-xs"><thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-400"><tr><th className="px-6 py-3">ASIN</th><th>SKU</th><th>Fulfillable</th><th>Inbound</th><th>Reserved</th><th>Health</th></tr></thead><tbody className="divide-y divide-slate-100">{rows.map((r:any,i)=><tr key={i}><td className="px-6 py-4 font-bold">{r.asin}</td><td>{r.sku}</td><td>{r.fulfillable}</td><td>{r.inbound}</td><td>{r.reserved}</td><td><span className={`rounded-full px-2 py-1 text-[10px] font-bold ${r.fulfillable<1000?"bg-amber-50 text-amber-700":"bg-emerald-50 text-emerald-700"}`}>{r.fulfillable<1000?"Watch":"Healthy"}</span></td></tr>)}</tbody></table></div></div> }

function Orders({data}:{data:any[]}) { const rows=data.length?data:[{order_id:"114-1234567-1234567",status:"Shipped",amount:699},{order_id:"114-9876543-9876543",status:"Unshipped",amount:1499},{order_id:"114-1111111-1111111",status:"Shipped",amount:2999}]; return <div><PageHeading title="Orders" subtitle="Track order flow and fulfillment status"/><div className="grid gap-4 sm:grid-cols-4"><MiniStat title="Today" value="284"/><MiniStat title="Pending" value="18"/><MiniStat title="Unshipped" value="23"/><MiniStat title="Returns" value="11"/></div><div className="card mt-6 overflow-hidden"><table className="w-full text-left text-xs"><thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-400"><tr><th className="px-6 py-3">Order ID</th><th>Status</th><th>Amount</th><th>Fulfillment</th></tr></thead><tbody className="divide-y divide-slate-100">{rows.map((r:any,i)=><tr key={i}><td className="px-6 py-4 font-bold">{r.order_id}</td><td><span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-700">{r.status}</span></td><td>₹{money(r.amount)}</td><td>FBA</td></tr>)}</tbody></table></div></div> }

function Profit(){return <div><PageHeading title="Fees & Profit" subtitle="Contribution margin after Amazon and advertising costs"/><div className="grid gap-4 sm:grid-cols-4"><MiniStat title="Revenue" value="₹8.42L"/><MiniStat title="Amazon fees" value="₹1.42L"/><MiniStat title="Ad spend" value="₹1.24L"/><MiniStat title="Contribution" value="₹2.61L"/></div><div className="mt-6 grid gap-6 lg:grid-cols-2"><div className="card p-6"><h3 className="font-extrabold">Unit Economics</h3><div className="mt-5 space-y-4">{[["Selling price","₹699"],["Product cost","₹310"],["Amazon fees","₹120"],["FBA","₹72"],["Advertising","₹61"],["Contribution","₹136"]].map(([a,b],i)=><div className="flex justify-between border-b border-slate-100 pb-3 text-sm" key={i}><span className="text-slate-500">{a}</span><span className={`font-bold ${a==="Contribution"?"text-emerald-600":""}`}>{b}</span></div>)}</div></div><div className="card p-6"><h3 className="font-extrabold">Profitability by SKU</h3><div className="mt-5 space-y-4">{[["PO-1L","₹136","19.4%"],["PO-5L","₹612","20.4%"],["PO-500","₹83","20.8%"]].map((r,i)=><div key={i}><div className="flex justify-between text-xs"><span className="font-bold">{r[0]}</span><span className="font-bold text-emerald-600">{r[2]}</span></div><div className="mt-2 h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-blue-600" style={{width:`${50+i*15}%`}}/></div><div className="mt-1 text-[10px] text-slate-400">Contribution {r[1]}</div></div>)}</div></div></div></div>}

function Analytics(){return <div><PageHeading title="Sales Analytics" subtitle="Unified business and advertising metrics"/><div className="grid gap-4 sm:grid-cols-4"><MiniStat title="Sales" value="₹8.42L"/><MiniStat title="TACOS" value="8.9%"/><MiniStat title="CTR" value="1.42%"/><MiniStat title="CVR" value="8.7%"/></div><div className="card mt-6 p-6"><h3 className="font-extrabold">Performance Trend</h3><div className="mt-8 grid h-56 grid-cols-12 items-end gap-2">{[35,45,38,54,48,62,58,73,68,82,76,91].map((v,i)=><div key={i} className="rounded-t-md bg-blue-600/90" style={{height:`${v}%`}}/>)}</div></div></div>}

function Reports(){return <div><PageHeading title="Reports" subtitle="Scheduled and on-demand Amazon business reports" action={<button className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white">+ Create report</button>}/><div className="grid gap-4 md:grid-cols-3">{["Advertising performance","Inventory health","Profitability"].map((x,i)=><div className="card p-5" key={x}><div className="rounded-xl bg-blue-50 p-3 w-fit text-blue-600"><BarChart3 size={19}/></div><h3 className="mt-4 font-extrabold">{x}</h3><p className="mt-1 text-xs text-slate-500">Updated daily • CSV / dashboard</p><button className="mt-5 text-xs font-bold text-blue-600">Generate →</button></div>)}</div></div>}

function Automation(){return <div><PageHeading title="Automation" subtitle="Rules for controlled campaign optimization" action={<button className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white">+ Create rule</button>}/><div className="grid gap-4 md:grid-cols-2">{[["Reduce waste","If ACOS > target + 20% AND clicks > 15","Reduce bid by 10%","Review"],["Scale winners","If ACOS < target AND ROAS > 5","Increase bid by 8%","Active"],["Protect stock","If inventory days < 7","Pause aggressive scaling","Active"],["Budget guard","If daily spend > 120% budget","Reduce budget 10%","Review"]].map((r,i)=><div className="card p-5" key={i}><div className="flex items-center justify-between"><h3 className="font-extrabold">{r[0]}</h3><span className={`rounded-full px-2 py-1 text-[10px] font-bold ${r[3]==="Active"?"bg-emerald-50 text-emerald-700":"bg-amber-50 text-amber-700"}`}>{r[3]}</span></div><div className="mt-4 rounded-xl bg-slate-50 p-4 text-xs text-slate-600"><b>IF</b> {r[1]}<br/><b>THEN</b> {r[2]}</div><div className="mt-4 flex gap-2"><button className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold">Edit</button><button className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-bold text-blue-700">View logs</button></div></div>)}</div></div>}

function Alerts({data}:{data:any[]}){const rows=data.length?data:[{severity:"critical",title:"Low stock",message:"PO-1L has approximately 6 days of cover."},{severity:"warning",title:"ACOS increased",message:"Broad campaign is above target."},{severity:"success",title:"Opportunity",message:"Brand Defense has budget headroom."}];return <div><PageHeading title="Alerts" subtitle="Issues and opportunities that need attention"/><div className="space-y-3">{rows.map((a:any,i)=><div className="card flex items-start gap-4 p-5" key={i}><div className={`mt-1 rounded-xl p-2 ${a.severity==="critical"?"bg-red-50 text-red-600":a.severity==="warning"?"bg-amber-50 text-amber-600":"bg-emerald-50 text-emerald-600"}`}><AlertTriangle size={18}/></div><div className="flex-1"><h3 className="text-sm font-extrabold">{a.title}</h3><p className="mt-1 text-xs text-slate-500">{a.message}</p></div><button className="text-xs font-bold text-blue-600">Review →</button></div>)}</div></div>}

function Clients({data}:{data:any[]}){const rows=data.length?data:[{name:"Demo Brand",marketplace:"India",status:"Connected",sales:"₹8.42L"},{name:"Example Foods",marketplace:"USA",status:"Pending",sales:"$12.4K"}];return <div><PageHeading title="Client Accounts" subtitle="Manage connected seller and advertising accounts" action={<button className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white">+ Connect client</button>}/><div className="grid gap-4 md:grid-cols-2">{rows.map((r:any,i)=><div className="card p-5" key={i}><div className="flex items-center gap-3"><div className="grid h-11 w-11 place-items-center rounded-xl bg-blue-50 font-extrabold text-blue-600">{r.name[0]}</div><div className="flex-1"><h3 className="font-extrabold">{r.name}</h3><p className="text-xs text-slate-400">{r.marketplace} marketplace</p></div><span className={`rounded-full px-2 py-1 text-[10px] font-bold ${r.status==="Connected"?"bg-emerald-50 text-emerald-700":"bg-amber-50 text-amber-700"}`}>{r.status}</span></div><div className="mt-5 grid grid-cols-2 gap-3"><div className="rounded-xl bg-slate-50 p-3"><div className="text-[10px] text-slate-400">30d sales</div><div className="mt-1 text-sm font-extrabold">{r.sales}</div></div><div className="rounded-xl bg-slate-50 p-3"><div className="text-[10px] text-slate-400">Connection</div><div className="mt-1 text-sm font-extrabold">{r.status}</div></div></div></div>)}</div></div>}

function SettingsPage(){return <div><PageHeading title="Settings" subtitle="Workspace, Amazon connections and system preferences"/><div className="grid gap-6 lg:grid-cols-3"><div className="card p-6 lg:col-span-2"><h3 className="font-extrabold">Amazon Connection</h3><p className="mt-1 text-xs text-slate-500">Connect approved Amazon Ads and SP-API applications through OAuth.</p><div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-5"><div className="flex items-center gap-3"><Cloud className="text-blue-600"/><div><div className="text-sm font-extrabold">Demo account connected</div><div className="text-xs text-blue-700/70">Real API connection requires your approved application credentials.</div></div></div><button className="mt-4 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white">Start Amazon OAuth</button></div></div><div className="card p-6"><h3 className="font-extrabold">Workspace</h3><div className="mt-5 space-y-4 text-xs"><label className="block"><span className="font-bold">Workspace name</span><input defaultValue="ADPILOT" className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-blue-500"/></label><label className="block"><span className="font-bold">Default marketplace</span><select className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5"><option>India</option><option>USA</option><option>UK</option></select></label></div></div></div></div>}
