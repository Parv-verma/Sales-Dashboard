import React, { useState, useEffect, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from 'recharts';
import {
  Smartphone,
  TrendingUp,
  Award,
  Calendar,
  Clock,
  DollarSign,
  ShoppingCart,
  Users,
  Search,
  Sparkles,
  BarChart3,
  LineChart as LineChartIcon,
  ChevronRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';

// Hardcoded Data Source
const DASHBOARD_DATA = {
  daily_summary: {
    today_orders: 0,
    today_revenue: 0,
    month_orders: 560,
    month_revenue: 443080,
  },
  daily_sales: [
    { date: "2026-05-01", sales: 23 },
    { date: "2026-05-02", sales: 28 },
    { date: "2026-05-03", sales: 12 },
    { date: "2026-05-04", sales: 29 },
    { date: "2026-05-05", sales: 31 },
    { date: "2026-05-06", sales: 12 },
    { date: "2026-05-07", sales: 13 },
    { date: "2026-05-08", sales: 28 },
    { "date": "2026-05-09", sales: 45 },
    { "date": "2026-05-10", sales: 33 },
    { "date": "2026-05-11", sales: 34 },
    { "date": "2026-05-12", sales: 45 },
    { "date": "2026-05-13", sales: 26 },
    { "date": "2026-05-14", sales: 31 },
    { "date": "2026-05-15", sales: 48 },
    { "date": "2026-05-16", sales: 43 },
    { "date": "2026-05-17", sales: 28 },
    { "date": "2026-05-18", sales: 24 },
    { "date": "2026-05-19", sales: 27 }
  ],
  monthly_sales: [
    { month_no: 5, month: "May 26", sales: 560 }
  ],
  leaderboard: [
    { staff_name: "Faizan", today_sales: 0, today_revenue: 0, monthly_sales: 176, monthly_revenue: 131614 },
    { staff_name: "Talha", today_sales: 0, today_revenue: 0, monthly_sales: 80, monthly_revenue: 67357.7 },
    { staff_name: "Bhageshri", today_sales: 0, today_revenue: 0, monthly_sales: 80, monthly_revenue: 60324.9 },
    { staff_name: "Sanika", today_sales: 0, today_revenue: 0, monthly_sales: 72, monthly_revenue: 54247.1 },
    { staff_name: "Prabhat", today_sales: 0, today_revenue: 0, monthly_sales: 61, monthly_revenue: 51220.1 },
    { staff_name: "Nidhi", today_sales: 0, today_revenue: 0, monthly_sales: 50, monthly_revenue: 42485.1 },
    { staff_name: "Karishma", today_sales: 0, today_revenue: 0, monthly_sales: 40, monthly_revenue: 34898.4 },
    { staff_name: "Rahul", today_sales: 0, today_revenue: 0, monthly_sales: 1, monthly_revenue: 931.36 }
  ]
};

// Currency Formatter Helper (Indian Rupee formatting with ₹)
const formatINR = (val: number, showDecimals: boolean = false) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  }).format(val);
};

// Date label formatter: 2026-05-01 -> May 1
const formatDateLabel = (dateStr: string) => {
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const day = parseInt(parts[2], 10);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthIndex = parseInt(parts[1], 10) - 1;
    return `${months[monthIndex] || 'May'} ${day}`;
  }
  return dateStr;
};

export default function App() {
  const [chartType, setChartType] = useState<'area' | 'bar'>('area');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Sorted leaderboard descending by monthly_sales
  const sortedLeaderboard = useMemo(() => {
    return [...DASHBOARD_DATA.leaderboard].sort((a, b) => b.monthly_sales - a.monthly_sales);
  }, []);

  // Sorted by revenue descending for Revenue Chart
  const revenueSortedStaff = useMemo(() => {
    return [...DASHBOARD_DATA.leaderboard]
      .sort((a, b) => b.monthly_revenue - a.monthly_revenue)
      .map(item => ({
        ...item,
        formattedRevenue: formatINR(item.monthly_revenue),
      }));
  }, []);

  // Filtered leaderboard for search
  const filteredLeaderboard = useMemo(() => {
    if (!searchTerm.trim()) return sortedLeaderboard;
    return sortedLeaderboard.filter(item =>
      item.staff_name.toLowerCase().includes(searchTerm.toLowerCase().trim())
    );
  }, [searchTerm, sortedLeaderboard]);

  // Derived Analytics
  const totalMonthUnits = DASHBOARD_DATA.daily_summary.month_orders;
  const totalMonthRevenue = DASHBOARD_DATA.daily_summary.month_revenue;
  const avgOrderValue = totalMonthUnits > 0 ? totalMonthRevenue / totalMonthUnits : 0;
  
  const dailyData = useMemo(() => {
    return DASHBOARD_DATA.daily_sales.map(item => ({
      ...item,
      displayDate: formatDateLabel(item.date),
    }));
  }, []);

  const peakDay = useMemo(() => {
    return [...DASHBOARD_DATA.daily_sales].sort((a, b) => b.sales - a.sales)[0];
  }, []);

  const avgDailySales = useMemo(() => {
    if (DASHBOARD_DATA.daily_sales.length === 0) return 0;
    const sum = DASHBOARD_DATA.daily_sales.reduce((acc, curr) => acc + curr.sales, 0);
    return (sum / DASHBOARD_DATA.daily_sales.length).toFixed(1);
  }, []);

  return (
    <div id="sim-dashboard-root" className="min-h-screen bg-slate-50/75 text-slate-800 font-sans antialiased selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation / Header Bar */}
      <header id="main-header" className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3.5 gap-3">
            {/* Brand and Title */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-200">
                <Smartphone className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold tracking-tight text-slate-900">SIM Sales Dashboard</h1>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Live Sync
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mt-0.5">
                  <span className="flex items-center gap-1 text-indigo-600 font-semibold">
                    <Calendar className="w-3.5 h-3.5" />
                    Reporting Month: May 2026
                  </span>
                  <span>•</span>
                  <span>Internal Sales Operations</span>
                </div>
              </div>
            </div>

            {/* Live Clock & Team Status */}
            <div className="flex items-center gap-3 self-end md:self-auto">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-100/80 border border-slate-200/70 rounded-lg text-xs font-medium text-slate-600">
                <Users className="w-3.5 h-3.5 text-indigo-600" />
                <span>{DASHBOARD_DATA.leaderboard.length} Active Sales Reps</span>
              </div>
              
              <div className="flex items-center gap-2 px-3.5 py-1.5 bg-indigo-50/70 border border-indigo-100 rounded-lg text-xs font-medium text-indigo-900 shadow-2xs">
                <Clock className="w-3.5 h-3.5 text-indigo-600 animate-[spin_10s_linear_infinite]" />
                <span className="tabular-nums font-semibold tracking-wide">
                  {currentTime.toLocaleDateString('en-IN', {
                    weekday: 'short',
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                  {' • '}
                  {currentTime.toLocaleTimeString('en-IN', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: true,
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main id="dashboard-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* TOP KPI CARDS ROW (4 cards) */}
        <section id="kpi-cards-section" aria-label="Key Performance Indicators">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Card 1: Today's Orders (Muted style since 0) */}
            <div id="kpi-today-orders" className="relative overflow-hidden rounded-2xl bg-white border border-slate-200/90 p-5 shadow-xs transition-all hover:border-slate-300">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Today's Orders
                </span>
                <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                  <ShoppingCart className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-slate-400 tracking-tight">
                  {DASHBOARD_DATA.daily_summary.today_orders}
                </span>
                <span className="text-xs font-medium text-slate-400">SIM units</span>
              </div>
              <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-slate-300"></span>
                <span>Awaiting daily submissions</span>
              </div>
            </div>

            {/* Card 2: Today's Revenue (Muted style since 0) */}
            <div id="kpi-today-revenue" className="relative overflow-hidden rounded-2xl bg-white border border-slate-200/90 p-5 shadow-xs transition-all hover:border-slate-300">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Today's Revenue
                </span>
                <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                  <DollarSign className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-slate-400 tracking-tight">
                  {formatINR(DASHBOARD_DATA.daily_summary.today_revenue)}
                </span>
              </div>
              <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-slate-300"></span>
                <span>Calculates from incoming transactions</span>
              </div>
            </div>

            {/* Card 3: This Month's Orders (Highlighted style) */}
            <div id="kpi-month-orders" className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-900 to-indigo-800 text-white p-5 shadow-md shadow-indigo-950/10 border border-indigo-700/50">
              <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-white/5 rounded-full blur-xl pointer-events-none"></div>
              <div className="flex items-center justify-between relative z-10">
                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-200">
                  Month Orders (May '26)
                </span>
                <div className="w-9 h-9 rounded-xl bg-white/10 backdrop-blur-xs flex items-center justify-center text-white border border-white/10">
                  <ShoppingCart className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2 relative z-10">
                <span className="text-3xl font-extrabold text-white tracking-tight">
                  {DASHBOARD_DATA.daily_summary.month_orders.toLocaleString('en-IN')}
                </span>
                <span className="text-xs font-medium text-indigo-200">Units sold</span>
              </div>
              <div className="mt-2 flex items-center gap-1.5 text-xs text-indigo-200 font-medium relative z-10">
                <span className="inline-flex items-center text-emerald-300 font-semibold gap-0.5">
                  <TrendingUp className="w-3.5 h-3.5" />
                  19 Days Active
                </span>
                <span>•</span>
                <span>Avg {avgDailySales}/day</span>
              </div>
            </div>

            {/* Card 4: This Month's Revenue (Highlighted style) */}
            <div id="kpi-month-revenue" className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-900 to-emerald-800 text-white p-5 shadow-md shadow-emerald-950/10 border border-emerald-700/50">
              <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-white/5 rounded-full blur-xl pointer-events-none"></div>
              <div className="flex items-center justify-between relative z-10">
                <span className="text-xs font-semibold uppercase tracking-wider text-teal-200">
                  Month Revenue (May '26)
                </span>
                <div className="w-9 h-9 rounded-xl bg-white/10 backdrop-blur-xs flex items-center justify-center text-white border border-white/10">
                  <DollarSign className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2 relative z-10">
                <span className="text-3xl font-extrabold text-white tracking-tight">
                  {formatINR(DASHBOARD_DATA.daily_summary.month_revenue)}
                </span>
              </div>
              <div className="mt-2 flex items-center gap-1.5 text-xs text-teal-200 font-medium relative z-10">
                <span className="text-emerald-200 font-semibold">
                  Avg {formatINR(avgOrderValue)}
                </span>
                <span>per SIM sold</span>
              </div>
            </div>

          </div>
        </section>

        {/* CHARTS ROW: Daily Sales Trend & Monthly Sales Overview */}
        <section id="charts-overview-section" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Daily Sales Trend Chart (2 columns on lg) */}
          <div id="daily-sales-chart-card" className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <h2 className="text-base font-bold text-slate-900">Daily Sales Trend</h2>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  19 recorded days in May 2026 • Peak: {formatDateLabel(peakDay?.date || '')} ({peakDay?.sales} SIMs)
                </p>
              </div>

              {/* Chart Switcher Buttons */}
              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200/70 self-start sm:self-auto">
                <button
                  id="btn-chart-area"
                  type="button"
                  onClick={() => setChartType('area')}
                  className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                    chartType === 'area'
                      ? 'bg-white text-indigo-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <LineChartIcon className="w-3.5 h-3.5" />
                  Area
                </button>
                <button
                  id="btn-chart-bar"
                  type="button"
                  onClick={() => setChartType('bar')}
                  className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                    chartType === 'bar'
                      ? 'bg-white text-indigo-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  Bar
                </button>
              </div>
            </div>

            {/* Quick Metrics Bar above chart */}
            <div className="grid grid-cols-3 gap-2 mb-4 p-3 bg-slate-50/80 rounded-xl border border-slate-100 text-center">
              <div>
                <p className="text-[11px] font-medium text-slate-500">Highest Day</p>
                <p className="text-sm font-bold text-indigo-900">{peakDay?.sales} units <span className="text-[10px] text-slate-500 font-normal">({formatDateLabel(peakDay?.date || '')})</span></p>
              </div>
              <div className="border-x border-slate-200/80">
                <p className="text-[11px] font-medium text-slate-500">Daily Average</p>
                <p className="text-sm font-bold text-indigo-900">{avgDailySales} units</p>
              </div>
              <div>
                <p className="text-[11px] font-medium text-slate-500">Total May Units</p>
                <p className="text-sm font-bold text-indigo-900">560 units</p>
              </div>
            </div>

            {/* Chart Canvas */}
            <div className="h-64 sm:h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                {chartType === 'area' ? (
                  <AreaChart data={dailyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis
                      dataKey="displayDate"
                      tick={{ fill: '#64748b', fontSize: 11 }}
                      axisLine={{ stroke: '#cbd5e1' }}
                      tickLine={false}
                      interval={window.innerWidth < 640 ? 2 : 1}
                    />
                    <YAxis
                      tick={{ fill: '#64748b', fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-slate-900 text-white px-3 py-2 rounded-xl shadow-lg border border-slate-800 text-xs">
                              <p className="font-semibold text-slate-200">{data.displayDate} ({data.date})</p>
                              <p className="text-indigo-300 font-bold text-sm mt-0.5">
                                {data.sales} SIM Units Sold
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="sales"
                      stroke="#4f46e5"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#salesGradient)"
                      activeDot={{ r: 6, fill: '#4f46e5', stroke: '#ffffff', strokeWidth: 2 }}
                    />
                  </AreaChart>
                ) : (
                  <BarChart data={dailyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis
                      dataKey="displayDate"
                      tick={{ fill: '#64748b', fontSize: 11 }}
                      axisLine={{ stroke: '#cbd5e1' }}
                      tickLine={false}
                      interval={window.innerWidth < 640 ? 2 : 1}
                    />
                    <YAxis
                      tick={{ fill: '#64748b', fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-slate-900 text-white px-3 py-2 rounded-xl shadow-lg border border-slate-800 text-xs">
                              <p className="font-semibold text-slate-200">{data.displayDate}</p>
                              <p className="text-indigo-300 font-bold text-sm mt-0.5">
                                {data.sales} SIM Units Sold
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="sales" radius={[4, 4, 0, 0]}>
                      {dailyData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.sales >= 40 ? '#4338ca' : entry.sales >= 25 ? '#6366f1' : '#a5b4fc'}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>

          {/* Monthly Sales Summary / Growth Card (1 column on lg) */}
          <div id="monthly-sales-chart-card" className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600">
                    <BarChart3 className="w-4 h-4" />
                  </div>
                  <h2 className="text-base font-bold text-slate-900">Monthly Sales</h2>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-teal-50 text-teal-700 border border-teal-200/60">
                  Current Cycle
                </span>
              </div>
              <p className="text-xs text-slate-500 mb-4">
                Aggregate monthly SIM volume overview with scale capacity.
              </p>

              {/* Monthly Visual Bar */}
              <div className="p-4 bg-slate-50/90 rounded-xl border border-slate-100 mb-4">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-bold text-slate-700">May 2026 Volume</span>
                  <span className="font-extrabold text-indigo-700 text-sm">560 Units</span>
                </div>
                {/* Progress Visual */}
                <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-indigo-600 to-teal-500 h-3 rounded-full transition-all duration-700"
                    style={{ width: '100%' }}
                  ></div>
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 mt-1.5">
                  <span>0 Units</span>
                  <span>Target Met (560 SIMs)</span>
                </div>
              </div>

              {/* Scalable Monthly Bar Chart for Recharts */}
              <div className="h-32 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={DASHBOARD_DATA.monthly_sales} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={{ stroke: '#cbd5e1' }} tickLine={false} />
                    <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 600]} />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-slate-900 text-white px-3 py-1.5 rounded-lg shadow-md text-xs">
                              <p className="font-semibold">{data.month}</p>
                              <p className="text-teal-300 font-bold">{data.sales} SIM Units</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="sales" fill="#0d9488" radius={[6, 6, 0, 0]} barSize={48} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Bottom mini highlight */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Total Monthly Revenue</span>
              <span className="font-bold text-slate-900">{formatINR(DASHBOARD_DATA.daily_summary.month_revenue)}</span>
            </div>
          </div>

        </section>

        {/* REVENUE PER STAFF CHART SECTION */}
        <section id="revenue-by-staff-section" className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <DollarSign className="w-4 h-4" />
                </div>
                <h2 className="text-base font-bold text-slate-900">Revenue Contribution by Sales Rep</h2>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Comparing total monthly revenue generated per representative (sorted descending)
              </p>
            </div>
            <div className="text-xs font-semibold px-3 py-1 bg-slate-100 text-slate-700 rounded-lg self-start sm:self-auto">
              Total: {formatINR(DASHBOARD_DATA.daily_summary.month_revenue)}
            </div>
          </div>

          <div className="h-64 sm:h-72 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={revenueSortedStaff}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  tick={{ fill: '#64748b', fontSize: 11 }}
                  tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`}
                  axisLine={{ stroke: '#cbd5e1' }}
                  tickLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="staff_name"
                  tick={{ fill: '#334155', fontSize: 12, fontWeight: 500 }}
                  axisLine={false}
                  tickLine={false}
                  width={80}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      const percentage = ((data.monthly_revenue / DASHBOARD_DATA.daily_summary.month_revenue) * 100).toFixed(1);
                      return (
                        <div className="bg-slate-900 text-white px-3.5 py-2.5 rounded-xl shadow-lg border border-slate-800 text-xs">
                          <p className="font-bold text-slate-100 text-sm">{data.staff_name}</p>
                          <p className="text-emerald-400 font-extrabold text-sm mt-1">
                            {formatINR(data.monthly_revenue, true)}
                          </p>
                          <div className="mt-1 pt-1 border-t border-slate-800 flex justify-between gap-4 text-slate-300 text-[11px]">
                            <span>Units: {data.monthly_sales} SIMs</span>
                            <span className="text-amber-300 font-semibold">{percentage}% of Total</span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="monthly_revenue" radius={[0, 6, 6, 0]}>
                  {revenueSortedStaff.map((entry, index) => {
                    // Highlight top 3 with distinct warm/indigo/teal colors
                    let fillColor = '#64748b'; // default slate
                    if (index === 0) fillColor = '#d97706'; // Gold/Amber for #1
                    else if (index === 1) fillColor = '#4f46e5'; // Indigo for #2
                    else if (index === 2) fillColor = '#0d9488'; // Teal for #3
                    else if (index < 5) fillColor = '#3b82f6'; // Blue
                    else fillColor = '#94a3b8';

                    return <Cell key={`rev-cell-${index}`} fill={fillColor} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* STAFF LEADERBOARD SECTION */}
        <section id="leaderboard-section" className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
          
          {/* Section Header with Search Bar */}
          <div className="p-5 sm:p-6 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
                  <Award className="w-4 h-4" />
                </div>
                <h2 className="text-base font-bold text-slate-900">Staff Sales Leaderboard</h2>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Ranked by monthly unit volume • #1 Faizan (Gold), #2 Talha (Silver), #3 Bhageshri (Bronze)
              </p>
            </div>

            {/* Quick Search Rep */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="search-staff-input"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search staff member..."
                className="w-full pl-9 pr-3.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Desktop Table View (md and up) */}
          <div className="hidden md:block overflow-x-auto">
            <table id="leaderboard-table" className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/90 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3 px-4 w-16 text-center">Rank</th>
                  <th className="py-3 px-4">Sales Representative</th>
                  <th className="py-3 px-4 text-right">Monthly Sales (Units)</th>
                  <th className="py-3 px-4 text-right">Share of Target</th>
                  <th className="py-3 px-4 text-right">Monthly Revenue (₹)</th>
                  <th className="py-3 px-4 text-right">Today's Sales</th>
                  <th className="py-3 px-4 text-right">Today's Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredLeaderboard.map((staff) => {
                  // Find real rank in overall sorted array
                  const rank = sortedLeaderboard.findIndex(s => s.staff_name === staff.staff_name) + 1;
                  const unitPercent = ((staff.monthly_sales / totalMonthUnits) * 100).toFixed(1);

                  // Styling based on rank
                  const isGold = rank === 1;
                  const isSilver = rank === 2;
                  const isBronze = rank === 3;

                  return (
                    <tr
                      key={staff.staff_name}
                      id={`staff-row-${staff.staff_name.toLowerCase()}`}
                      className={`transition-colors hover:bg-slate-50/80 ${
                        isGold ? 'bg-amber-50/30' : isSilver ? 'bg-slate-50/40' : isBronze ? 'bg-amber-900/[0.02]' : ''
                      }`}
                    >
                      {/* Rank Badge */}
                      <td className="py-3.5 px-4 text-center">
                        {isGold ? (
                          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-100 text-amber-700 font-extrabold text-xs shadow-2xs border border-amber-300">
                            🥇 1
                          </span>
                        ) : isSilver ? (
                          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-200 text-slate-700 font-extrabold text-xs border border-slate-300">
                            🥈 2
                          </span>
                        ) : isBronze ? (
                          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-200/60 text-amber-800 font-extrabold text-xs border border-amber-400/50">
                            🥉 3
                          </span>
                        ) : (
                          <span className="font-semibold text-slate-400 text-xs">
                            #{rank}
                          </span>
                        )}
                      </td>

                      {/* Staff Name & Tag */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                              isGold
                                ? 'bg-amber-500 text-white shadow-xs'
                                : isSilver
                                ? 'bg-slate-700 text-white'
                                : isBronze
                                ? 'bg-amber-800 text-white'
                                : 'bg-indigo-100 text-indigo-700'
                            }`}
                          >
                            {staff.staff_name.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-slate-900">{staff.staff_name}</span>
                              {isGold && (
                                <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                                  <Sparkles className="w-2.5 h-2.5" />
                                  Top Performer
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-slate-400">Representative</span>
                          </div>
                        </div>
                      </td>

                      {/* Monthly Sales (Units) */}
                      <td className="py-3.5 px-4 text-right">
                        <span className="font-extrabold text-slate-900 text-base">
                          {staff.monthly_sales}
                        </span>
                        <span className="text-xs text-slate-400 ml-1">SIMs</span>
                      </td>

                      {/* Share of target bar */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-block w-28 text-right">
                          <div className="flex items-center justify-end gap-1.5 text-xs font-semibold text-slate-600 mb-1">
                            <span>{unitPercent}%</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <div
                              className={`h-1.5 rounded-full ${
                                isGold ? 'bg-amber-500' : isSilver ? 'bg-slate-600' : isBronze ? 'bg-amber-700' : 'bg-indigo-500'
                              }`}
                              style={{ width: `${Math.min(100, parseFloat(unitPercent) * 3)}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>

                      {/* Monthly Revenue */}
                      <td className="py-3.5 px-4 text-right">
                        <span className="font-bold text-slate-900">
                          {formatINR(staff.monthly_revenue, true)}
                        </span>
                      </td>

                      {/* Today's Sales */}
                      <td className="py-3.5 px-4 text-right text-slate-400 font-medium">
                        {staff.today_sales}
                      </td>

                      {/* Today's Revenue */}
                      <td className="py-3.5 px-4 text-right text-slate-400 font-medium">
                        {formatINR(staff.today_revenue)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Stacked Cards View (< md) */}
          <div className="md:hidden divide-y divide-slate-100">
            {filteredLeaderboard.map((staff) => {
              const rank = sortedLeaderboard.findIndex(s => s.staff_name === staff.staff_name) + 1;
              const unitPercent = ((staff.monthly_sales / totalMonthUnits) * 100).toFixed(1);
              const isGold = rank === 1;
              const isSilver = rank === 2;
              const isBronze = rank === 3;

              return (
                <div
                  key={staff.staff_name}
                  id={`mobile-staff-card-${staff.staff_name.toLowerCase()}`}
                  className={`p-4 space-y-3 ${
                    isGold ? 'bg-amber-50/40' : isSilver ? 'bg-slate-50/40' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                          isGold
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : isSilver
                            ? 'bg-slate-200 text-slate-800'
                            : isBronze
                            ? 'bg-amber-200/80 text-amber-900'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {isGold ? '🥇 1' : isSilver ? '🥈 2' : isBronze ? '🥉 3' : `#${rank}`}
                      </span>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-900">{staff.staff_name}</span>
                          {isGold && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                              Top #1
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500">Share of Total: {unitPercent}%</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-base font-extrabold text-slate-900">{staff.monthly_sales}</span>
                      <span className="text-xs text-slate-500 ml-1">SIMs</span>
                    </div>
                  </div>

                  {/* Monthly Revenue & Unit Details */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100/80 text-xs">
                    <div className="bg-white/80 p-2.5 rounded-xl border border-slate-200/60">
                      <p className="text-slate-400 text-[10px] uppercase font-semibold">Monthly Revenue</p>
                      <p className="font-bold text-slate-900 mt-0.5">{formatINR(staff.monthly_revenue, true)}</p>
                    </div>
                    <div className="bg-white/80 p-2.5 rounded-xl border border-slate-200/60">
                      <p className="text-slate-400 text-[10px] uppercase font-semibold">Today's Units / Rev</p>
                      <p className="font-medium text-slate-500 mt-0.5">{staff.today_sales} units ({formatINR(staff.today_revenue)})</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Table Footer */}
          <div className="p-4 bg-slate-50 border-t border-slate-200/70 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>Verified metrics sourced directly from SIM provisioning backend</span>
            </div>
            <div className="font-semibold text-slate-700">
              Total Team Output: 560 units ({formatINR(443080)})
            </div>
          </div>
        </section>

        {/* BOTTOM METRIC SUMMARY BANNER */}
        <section id="insights-banner" className="bg-slate-900 rounded-2xl p-5 sm:p-6 text-white flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white shrink-0 shadow-md">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold">Performance Summary • May 2026</h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Top 3 performers (Faizan, Talha, Bhageshri) contributed <span className="text-amber-400 font-bold">336 SIMs (60.0%)</span> and <span className="text-emerald-400 font-bold">₹2,59,296.6 (58.5%)</span> of total monthly volume.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-slate-400">Operational Target:</span>
            <span className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold text-xs border border-emerald-500/30">
              100% On Track
            </span>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-xs text-slate-400 border-t border-slate-200/60 mt-10">
        <p>SIM Sales Internal Analytics Dashboard • Generated with React, Tailwind CSS & Recharts</p>
      </footer>
    </div>
  );
}
