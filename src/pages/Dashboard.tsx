import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/api";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  LineChart, Line,
  BarChart, Bar,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";

interface Product {
  id: number; name: string; price: number;
  category: string; brand: string; imageUrl?: string;
}
interface Recommendations {
  similarProducts: Product[]; marketBasketProducts: Product[];
  recentlyViewed: Product[]; featuredProducts: Product[];
}
interface Stats {
  totalUsers: number; totalProducts: number;
  totalOrders: number; totalRevenue: number;
  totalCartItems: number; totalWishlistItems: number;
}
interface ChartPoint {
  day?: string; name?: string;
  orders?: number; revenue?: number;
  value?: number; count?: number;
}

const PIE_COLORS = ["#ef4444","#f97316","#eab308","#22c55e","#3b82f6","#8b5cf6","#ec4899"];

const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[#111] border border-white/10 rounded-xl p-5 flex flex-col gap-1">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  );
}

function SectionHeader({ title, tag, emoji }: { title: string; tag: string; emoji: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <span className="text-lg">{emoji}</span>
      <h3 className="text-base font-semibold text-white">{title}</h3>
      <span className="text-xs px-2.5 py-1 rounded-full bg-white/5 text-gray-400 border border-white/10">{tag}</span>
      <div className="flex-1 h-px bg-white/10" />
    </div>
  );
}

function ProductCard({ p, onClick }: { p: Product; onClick: () => void }) {
  return (
    <div onClick={onClick}
      className="group bg-[#111] border border-white/10 rounded-xl overflow-hidden cursor-pointer hover:border-white/20 hover:-translate-y-1 transition-all duration-200 flex-shrink-0"
      style={{ width: 160, minWidth: 160 }}>
      <div className="overflow-hidden bg-[#1a1a1a] flex items-center justify-center" style={{ height: 140 }}>
        <img src={p.imageUrl} alt={p.name} referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.style.display = "none"; }} />
      </div>
      <div className="p-3">
        <p className="font-medium text-xs text-white truncate">{p.name}</p>
        <p className="text-xs text-gray-500 mt-0.5 truncate">{p.brand}</p>
        <p className="font-semibold text-xs text-red-500 mt-1">{fmt(p.price)}</p>
      </div>
    </div>
  );
}

const DarkTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2 text-xs">
      {label && <p className="text-gray-400 mb-1">{label}</p>}
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color || "#fff" }}>
          {p.name}: <span className="font-semibold">
            {p.name === "revenue" ? fmt(p.value) : p.value}
          </span>
        </p>
      ))}
    </div>
  );
};

export default function Dashboard() {
  const navigate = useNavigate();
  const isAdmin = localStorage.getItem("role") === "ADMIN";

  const [recommendations, setRecommendations] = useState<Recommendations | null>(null);
  const [stats, setStats]                     = useState<Stats | null>(null);
  const [ordersPerDay, setOrdersPerDay]       = useState<ChartPoint[]>([]);
  const [revenuePerDay, setRevenuePerDay]     = useState<ChartPoint[]>([]);
  const [byCategory, setByCategory]           = useState<ChartPoint[]>([]);
  const [byEventType, setByEventType]         = useState<ChartPoint[]>([]);
  const [orderStatus, setOrderStatus]         = useState<ChartPoint[]>([]);
  const [loading, setLoading]                 = useState(true);
  const [activeTab, setActiveTab]             = useState<"recommendations" | "analytics">("recommendations");

  useEffect(() => {
    api.get("/recommendations/homepage")
      .then(res => setRecommendations(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));

    if (isAdmin) {
      api.get("/admin/stats").then(r => setStats(r.data)).catch(() => {});
      api.get("/admin/charts/orders-per-day").then(r => setOrdersPerDay(r.data)).catch(() => {});
      api.get("/admin/charts/revenue-per-day").then(r => setRevenuePerDay(r.data)).catch(() => {});
      api.get("/admin/charts/products-by-category").then(r => setByCategory(r.data)).catch(() => {});
      api.get("/admin/charts/events-by-type").then(r => setByEventType(r.data)).catch(() => {});
      api.get("/admin/charts/order-status").then(r => setOrderStatus(r.data)).catch(() => {});
    }
  }, []);

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.setTextColor(40, 40, 40);
    doc.text("RecoEngine — Analytics Report", 14, 20);
    doc.setFontSize(10);
    doc.setTextColor(120, 120, 120);
    doc.text(`Generated: ${new Date().toLocaleString("en-IN")}`, 14, 28);

    if (stats) {
      doc.setFontSize(14); doc.setTextColor(40, 40, 40);
      doc.text("Overview", 14, 42);
      autoTable(doc, {
        startY: 46,
        head: [["Metric", "Value"]],
        body: [
          ["Total Users",    String(stats.totalUsers)],
          ["Total Products", String(stats.totalProducts)],
          ["Total Orders",   String(stats.totalOrders)],
          ["Total Revenue",  fmt(stats.totalRevenue)],
          ["Cart Items",     String(stats.totalCartItems)],
          ["Wishlist Items", String(stats.totalWishlistItems)],
        ],
        headStyles: { fillColor: [220, 38, 38] },
        alternateRowStyles: { fillColor: [245, 245, 245] },
      });
    }

    if (ordersPerDay.length > 0) {
      const y1 = (doc as any).lastAutoTable.finalY + 12;
      doc.setFontSize(14); doc.setTextColor(40, 40, 40);
      doc.text("Orders — Last 7 Days", 14, y1);
      autoTable(doc, {
        startY: y1 + 4,
        head: [["Day", "Orders"]],
        body: ordersPerDay.map(d => [d.day ?? "", String(d.orders ?? 0)]),
        headStyles: { fillColor: [220, 38, 38] },
        alternateRowStyles: { fillColor: [245, 245, 245] },
      });
    }

    if (revenuePerDay.length > 0) {
      const y2 = (doc as any).lastAutoTable.finalY + 12;
      doc.setFontSize(14); doc.setTextColor(40, 40, 40);
      doc.text("Revenue — Last 7 Days", 14, y2);
      autoTable(doc, {
        startY: y2 + 4,
        head: [["Day", "Revenue"]],
        body: revenuePerDay.map(d => [d.day ?? "", fmt(d.revenue ?? 0)]),
        headStyles: { fillColor: [220, 38, 38] },
        alternateRowStyles: { fillColor: [245, 245, 245] },
      });
    }

    if (orderStatus.length > 0) {
      const y3 = (doc as any).lastAutoTable.finalY + 12;
      doc.setFontSize(14); doc.setTextColor(40, 40, 40);
      doc.text("Order Status Breakdown", 14, y3);
      autoTable(doc, {
        startY: y3 + 4,
        head: [["Status", "Count"]],
        body: orderStatus.map(d => [d.name ?? "", String(d.value ?? 0)]),
        headStyles: { fillColor: [220, 38, 38] },
        alternateRowStyles: { fillColor: [245, 245, 245] },
      });
    }

    if (byCategory.length > 0) {
      const y4 = (doc as any).lastAutoTable.finalY + 12;
      doc.setFontSize(14); doc.setTextColor(40, 40, 40);
      doc.text("Products by Category", 14, y4);
      autoTable(doc, {
        startY: y4 + 4,
        head: [["Category", "Count"]],
        body: byCategory.map(d => [d.name ?? "", String(d.value ?? 0)]),
        headStyles: { fillColor: [220, 38, 38] },
        alternateRowStyles: { fillColor: [245, 245, 245] },
      });
    }

    doc.save(`RecoEngine-Report-${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">

      {/* Header */}
      <div className="border-b border-white/10 bg-[#0a0a0a]">
        <div className="w-full px-4 md:px-10 py-4 flex flex-col sm:flex-row sm:items-center gap-3">

          {/* Title */}
          <div className="flex-shrink-0">
            <h1 className="text-xl md:text-2xl font-bold text-white">Dashboard</h1>
            <p className="text-xs text-gray-500 mt-0.5">
              {isAdmin ? "Admin overview & analytics" : "Personalised recommendations"}
            </p>
          </div>

          {/* Tabs — Admin only */}
          {isAdmin && (
            <div className="flex items-center gap-2 sm:ml-auto flex-wrap">
              <button onClick={() => setActiveTab("recommendations")}
                className={`py-2 px-4 text-sm rounded-lg border transition-colors cursor-pointer whitespace-nowrap
                  ${activeTab === "recommendations"
                    ? "bg-white text-black border-white"
                    : "bg-transparent text-gray-400 border-white/10 hover:border-white/20"}`}>
                Recommendations
              </button>
              <button onClick={() => setActiveTab("analytics")}
                className={`py-2 px-4 text-sm rounded-lg border transition-colors cursor-pointer whitespace-nowrap
                  ${activeTab === "analytics"
                    ? "bg-white text-black border-white"
                    : "bg-transparent text-gray-400 border-white/10 hover:border-white/20"}`}>
                Analytics
              </button>
              {activeTab === "analytics" && (
                <button onClick={exportPDF}
                  className="py-2 px-4 text-sm font-medium bg-white text-black rounded-lg hover:bg-gray-200 transition-colors border-none cursor-pointer whitespace-nowrap">
                  ⬇ Export PDF
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <main className="w-full px-4 md:px-10 py-6 md:py-8">

        {/* ── ANALYTICS TAB ── */}
        {isAdmin && activeTab === "analytics" && (
          <div className="flex flex-col gap-10">

            {stats && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <StatCard label="Total Users"    value={String(stats.totalUsers)} />
                <StatCard label="Total Products" value={String(stats.totalProducts)} />
                <StatCard label="Total Orders"   value={String(stats.totalOrders)} />
                <StatCard label="Total Revenue"  value={fmt(stats.totalRevenue)} />
                <StatCard label="Cart Items"     value={String(stats.totalCartItems)} />
                <StatCard label="Wishlist Items" value={String(stats.totalWishlistItems)} />
              </div>
            )}

            <div className="bg-[#111] border border-white/10 rounded-xl p-6">
              <SectionHeader title="Orders — Last 7 Days" tag="Line chart" emoji="📈" />
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={ordersPerDay}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="day" tick={{ fill: "#6b7280", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip content={<DarkTooltip />} />
                  <Line type="monotone" dataKey="orders" stroke="#ef4444" strokeWidth={2.5}
                    dot={{ fill: "#ef4444", r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-[#111] border border-white/10 rounded-xl p-6">
              <SectionHeader title="Revenue — Last 7 Days" tag="Bar chart" emoji="💰" />
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={revenuePerDay}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="day" tick={{ fill: "#6b7280", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} axisLine={false} tickLine={false}
                    tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                  <Tooltip content={<DarkTooltip />} />
                  <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-[#111] border border-white/10 rounded-xl p-6">
                <SectionHeader title="Products by Category" tag="Pie chart" emoji="🥧" />
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={byCategory} dataKey="value" nameKey="name"
                      cx="50%" cy="50%" outerRadius={80}
                      label={({ name, percent }) => `${name} ${percent !== undefined ? (percent * 100).toFixed(0) : 0}%`}>
                      {byCategory.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                    </Pie>
                    <Tooltip content={<DarkTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-[#111] border border-white/10 rounded-xl p-6">
                <SectionHeader title="Order Status" tag="Pie chart" emoji="📦" />
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={orderStatus} dataKey="value" nameKey="name"
                      cx="50%" cy="50%" outerRadius={80}
                      label={({ name, percent }) => `${name} ${percent !== undefined ? (percent * 100).toFixed(0) : 0}%`}>
                      {orderStatus.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                    </Pie>
                    <Tooltip content={<DarkTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-[#111] border border-white/10 rounded-xl p-6">
                <SectionHeader title="Events by Type" tag="CTR tracking" emoji="🖱️" />
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={byEventType} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                    <XAxis type="number" tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis type="category" dataKey="name" tick={{ fill: "#6b7280", fontSize: 11 }}
                      axisLine={false} tickLine={false} width={80} />
                    <Tooltip content={<DarkTooltip />} />
                    <Bar dataKey="count" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* ── RECOMMENDATIONS TAB ── */}
        {activeTab === "recommendations" && (
          <>
            {loading && (
              <div className="flex flex-col items-center justify-center py-24 gap-3 text-gray-500">
                <div className="w-8 h-8 border-2 border-white/10 border-t-white/40 rounded-full animate-spin" />
                <span className="text-sm">Loading recommendations...</span>
              </div>
            )}

            {recommendations && (
              <div className="flex flex-col gap-12">

                {recommendations.recentlyViewed.length > 0 && (
                  <section>
                    <SectionHeader title="Recently Viewed" tag="Your history" emoji="🕐" />
                    <div className="flex gap-4 overflow-x-auto pb-2">
                      {recommendations.recentlyViewed.map((p, i) => (
                        <ProductCard key={`rv-${p.id}-${i}`} p={p}
                          onClick={() => navigate(`/products/${p.id}`)} />
                      ))}
                    </div>
                  </section>
                )}

                {recommendations.similarProducts.length > 0 && (
                  <section>
                    <SectionHeader title="Similar Products" tag="Item similarity" emoji="✨" />
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {recommendations.similarProducts.map((p, i) => (
                        <div key={`sp-${p.id}-${i}`} onClick={() => navigate(`/products/${p.id}`)}
                          className="group bg-[#111] border border-white/10 rounded-xl overflow-hidden cursor-pointer hover:border-white/20 hover:-translate-y-1 transition-all duration-200">
                          <div className="overflow-hidden bg-[#1a1a1a]" style={{ height: 140 }}>
                            <img src={p.imageUrl} alt={p.name} referrerPolicy="no-referrer"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.style.display = "none"; }} />
                          </div>
                          <div className="p-3">
                            <p className="font-medium text-xs text-white truncate">{p.name}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{p.brand}</p>
                            <p className="font-semibold text-xs text-red-500 mt-1">{fmt(p.price)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {recommendations.marketBasketProducts.length > 0 && (
                  <section>
                    <SectionHeader title="Recommended Products" tag="Market basket" emoji="🛒" />
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {recommendations.marketBasketProducts.map((p, i) => (
                        <div key={`mb-${p.id}-${i}`} onClick={() => navigate(`/products/${p.id}`)}
                          className="group bg-[#111] border border-white/10 rounded-xl overflow-hidden cursor-pointer hover:border-white/20 hover:-translate-y-1 transition-all duration-200">
                          <div className="overflow-hidden bg-[#1a1a1a]" style={{ height: 140 }}>
                            <img src={p.imageUrl} alt={p.name} referrerPolicy="no-referrer"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.style.display = "none"; }} />
                          </div>
                          <div className="p-3">
                            <p className="font-medium text-xs text-white truncate">{p.name}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{p.brand}</p>
                            <p className="font-semibold text-xs text-red-500 mt-1">{fmt(p.price)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {recommendations.featuredProducts.length > 0 && (
                  <section>
                    <SectionHeader title="Featured Products" tag="Trending now" emoji="🔥" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {recommendations.featuredProducts.map((p, i) => (
                        <div key={`fp-${p.id}-${i}`} onClick={() => navigate(`/products/${p.id}`)}
                          className="group flex items-center gap-4 p-4 bg-[#111] border border-white/10 rounded-xl cursor-pointer hover:border-white/20 transition-all duration-200">
                          <div className="w-14 h-14 rounded-lg border border-white/10 flex-shrink-0 overflow-hidden bg-[#1a1a1a]">
                            <img src={p.imageUrl} alt={p.name} referrerPolicy="no-referrer"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.style.display = "none"; }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm text-white truncate">{p.name}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{p.brand} · {p.category}</p>
                            <p className="font-semibold text-sm text-red-500 mt-1">{fmt(p.price)}</p>
                          </div>
                          <span className="text-gray-600 group-hover:text-gray-400 transition-colors">→</span>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {!loading && recommendations &&
                  recommendations.recentlyViewed.length === 0 &&
                  recommendations.similarProducts.length === 0 &&
                  recommendations.featuredProducts.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
                      <span className="text-5xl opacity-20">🛍️</span>
                      <p className="text-gray-400 font-medium">No recommendations yet</p>
                      <p className="text-sm text-gray-600">Browse some products to get started</p>
                      <button onClick={() => navigate("/products")}
                        className="mt-2 py-2.5 px-6 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors border-none cursor-pointer">
                        Browse Products
                      </button>
                    </div>
                  )}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}