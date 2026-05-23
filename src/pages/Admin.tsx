import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/api";
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  brand: string;
  imageUrl?: string;
  isActive: boolean;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

interface Stats {
  totalUsers: number;
  totalProducts: number;
  totalCartItems: number;
  totalWishlistItems: number;
}

const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

const COLORS = ["#ef4444","#f97316","#eab308","#22c55e","#3b82f6","#a855f7","#ec4899","#14b8a6"];

export default function Admin() {
  const navigate = useNavigate();
  const [stats, setStats]       = useState<Stats | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers]       = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState<"stats" | "products" | "featured" | "users">("stats");
  const [loading, setLoading]   = useState(true);

  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "", description: "", price: "", category: "", brand: "", imageUrl: ""
  });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsRes, productsRes, usersRes] = await Promise.all([
        api.get("/admin/stats"),
        api.get("/products"),
        api.get("/admin/users"),
      ]);
      setStats(statsRes.data);
      setProducts(productsRes.data);
      setUsers(usersRes.data);
    } catch (err) { console.log(err); }
    setLoading(false);
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm("Delete this product?")) return;
    try {
      await api.delete(`/products/${id}`);
      setProducts(products.filter(p => p.id !== id));
    } catch (err) { console.log(err); }
  };

  const handleAddProduct = async () => {
    try {
      const res = await api.post("/products", {
        ...newProduct, price: parseFloat(newProduct.price)
      });
      setProducts([...products, res.data]);
      setShowAddProduct(false);
      setNewProduct({ name: "", description: "", price: "", category: "", brand: "", imageUrl: "" });
    } catch (err) { console.log(err); }
  };

  const handleFeatureProduct = async (productId: number) => {
    try {
      await api.post("/admin-overrides", { productId, overrideType: "FEATURED" });
      alert("Product featured successfully!");
    } catch (err) { console.log(err); }
  };

  const categoryData = products.reduce((acc: any[], p) => {
    const existing = acc.find(a => a.name === p.category);
    if (existing) existing.value++;
    else acc.push({ name: p.category, value: 1 });
    return acc;
  }, []);

  const userRoleData = users.reduce((acc: any[], u) => {
    const existing = acc.find(a => a.name === u.role);
    if (existing) existing.value++;
    else acc.push({ name: u.role, value: 1 });
    return acc;
  }, []);

  const engagementData = stats ? [
    { name: "Cart Items", value: stats.totalCartItems },
    { name: "Wishlist Items", value: stats.totalWishlistItems },
  ] : [];

  const brandData = products.reduce((acc: any[], p) => {
    const existing = acc.find(a => a.name === p.brand);
    if (existing) existing.value++;
    else acc.push({ name: p.brand, value: 1 });
    return acc;
  }, []).sort((a, b) => b.value - a.value).slice(0, 8);

  return (
    <div className="min-h-screen bg-[#0a0a0a]">

      {/* Header */}
      <div className="border-b border-white/10 bg-[#0a0a0a]">
        <div className="w-full px-4 md:px-10 py-4 md:py-6 flex items-center justify-between">
          <div>
            <h1 className="text-lg md:text-2xl font-bold text-white">Admin Panel</h1>
            <p className="text-xs md:text-sm text-gray-500 mt-1">Manage your application</p>
          </div>
          <button onClick={() => navigate("/dashboard")}
            className="py-1.5 md:py-2 px-3 md:px-4 text-xs md:text-sm font-medium text-gray-300 bg-white/5 hover:bg-white/10 rounded-lg transition-colors border border-white/10 cursor-pointer">
            Dashboard
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-white/10 px-4 md:px-10">
        <div className="flex gap-6">
          {[
            { key: "stats",    label: "📊 Stats" },
            { key: "products", label: "📦 Products" },
            { key: "featured", label: "⭐ Featured" },
            { key: "users",    label: "👥 Users" },
          ].map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key as any)}
              className={`py-3 text-sm font-medium border-b-2 transition-colors cursor-pointer bg-transparent ${
                activeTab === tab.key
                  ? "border-red-500 text-white"
                  : "border-transparent text-gray-500 hover:text-gray-300"
              }`}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <main className="w-full px-4 md:px-10 py-6 md:py-8">
        {loading && (
          <div className="flex justify-center py-24">
            <div className="w-8 h-8 border-2 border-white/10 border-t-white/40 rounded-full animate-spin" />
          </div>
        )}

        {!loading && (
          <>
            {/* ── STATS TAB ── */}
            {activeTab === "stats" && stats && (
              <div className="flex flex-col gap-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "Total Users",    value: stats.totalUsers,         emoji: "👥" },
                    { label: "Total Products", value: stats.totalProducts,      emoji: "📦" },
                    { label: "Cart Items",     value: stats.totalCartItems,     emoji: "🛒" },
                    { label: "Wishlist Items", value: stats.totalWishlistItems, emoji: "❤️" },
                  ].map((stat) => (
                    <div key={stat.label} className="bg-[#111] border border-white/10 rounded-xl p-5">
                      <div className="text-2xl mb-2">{stat.emoji}</div>
                      <div className="text-2xl md:text-3xl font-bold text-white">{stat.value}</div>
                      <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-[#111] border border-white/10 rounded-xl p-5">
                    <h3 className="text-white font-semibold mb-4 text-sm">Products by Category</h3>
                    <ResponsiveContainer width="100%" height={220}>
                      <PieChart>
                        <Pie data={categoryData} cx="50%" cy="50%" outerRadius={75} dataKey="value"
                          label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                          labelLine={false} fontSize={10}>
                          {categoryData.map((_: any, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                        </Pie>
                        <Tooltip contentStyle={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#fff", fontSize: 12 }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="bg-[#111] border border-white/10 rounded-xl p-5">
                    <h3 className="text-white font-semibold mb-4 text-sm">Users by Role</h3>
                    <ResponsiveContainer width="100%" height={220}>
                      <PieChart>
                        <Pie data={userRoleData} cx="50%" cy="50%" outerRadius={75} dataKey="value"
                          label={({ name, value }) => `${name}: ${value}`} labelLine={false} fontSize={11}>
                          {userRoleData.map((_: any, i: number) => <Cell key={i} fill={i === 0 ? "#ef4444" : "#3b82f6"} />)}
                        </Pie>
                        <Tooltip contentStyle={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#fff", fontSize: 12 }} />
                        <Legend wrapperStyle={{ color: "#9ca3af", fontSize: 12 }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="bg-[#111] border border-white/10 rounded-xl p-5">
                    <h3 className="text-white font-semibold mb-4 text-sm">Cart vs Wishlist</h3>
                    <ResponsiveContainer width="100%" height={220}>
                      <PieChart>
                        <Pie data={engagementData} cx="50%" cy="50%" innerRadius={45} outerRadius={75}
                          dataKey="value" label={({ value }) => `${value}`} fontSize={12}>
                          <Cell fill="#ef4444" />
                          <Cell fill="#ec4899" />
                        </Pie>
                        <Tooltip contentStyle={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#fff", fontSize: 12 }} />
                        <Legend wrapperStyle={{ color: "#9ca3af", fontSize: 12 }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-[#111] border border-white/10 rounded-xl p-5">
                  <h3 className="text-white font-semibold mb-4 text-sm">Top Brands by Products</h3>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={brandData}>
                      <XAxis dataKey="name" tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#fff", fontSize: 12 }} />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                        {brandData.map((_: any, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* ── PRODUCTS TAB ── */}
            {activeTab === "products" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-white font-semibold">All Products ({products.length})</h2>
                  <button onClick={() => setShowAddProduct(true)}
                    className="py-2 px-4 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors border-none cursor-pointer">
                    + Add Product
                  </button>
                </div>

                {showAddProduct && (
                  <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
                    <div className="bg-[#111] border border-white/10 rounded-2xl p-6 w-full max-w-md">
                      <h3 className="text-white font-semibold mb-4">Add New Product</h3>
                      <div className="flex flex-col gap-3">
                        {[
                          { key: "name",        placeholder: "Product Name" },
                          { key: "description", placeholder: "Description" },
                          { key: "price",       placeholder: "Price" },
                          { key: "category",    placeholder: "Category" },
                          { key: "brand",       placeholder: "Brand" },
                          { key: "imageUrl",    placeholder: "Image URL" },
                        ].map((field) => (
                          <input key={field.key} type={field.key === "price" ? "number" : "text"}
                            placeholder={field.placeholder} value={(newProduct as any)[field.key]}
                            onChange={(e) => setNewProduct({ ...newProduct, [field.key]: e.target.value })}
                            className="px-4 py-2.5 bg-[#1a1a1a] border border-white/10 rounded-lg text-white text-sm placeholder-gray-600 focus:outline-none focus:border-white/20" />
                        ))}
                      </div>
                      <div className="flex gap-3 mt-4">
                        <button onClick={handleAddProduct}
                          className="flex-1 py-2.5 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors border-none cursor-pointer">
                          Add Product
                        </button>
                        <button onClick={() => setShowAddProduct(false)}
                          className="flex-1 py-2.5 bg-white/5 text-gray-300 text-sm font-medium rounded-lg hover:bg-white/10 transition-colors border border-white/10 cursor-pointer">
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left text-xs text-gray-500 pb-3 pr-4">Product</th>
                        <th className="text-left text-xs text-gray-500 pb-3 pr-4">Category</th>
                        <th className="text-left text-xs text-gray-500 pb-3 pr-4">Brand</th>
                        <th className="text-left text-xs text-gray-500 pb-3 pr-4">Price</th>
                        <th className="text-left text-xs text-gray-500 pb-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((p) => (
                        <tr key={p.id} className="border-b border-white/5 hover:bg-white/2">
                          <td className="py-3 pr-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg overflow-hidden bg-[#1a1a1a] flex-shrink-0">
                                <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover"
                                  onError={(e) => { e.currentTarget.style.display = "none"; }} />
                              </div>
                              <span className="text-sm text-white truncate max-w-[150px]">{p.name}</span>
                            </div>
                          </td>
                          <td className="py-3 pr-4 text-xs text-gray-400">{p.category}</td>
                          <td className="py-3 pr-4 text-xs text-gray-400">{p.brand}</td>
                          <td className="py-3 pr-4 text-xs text-red-400 font-medium">{fmt(p.price)}</td>
                          <td className="py-3">
                            <div className="flex gap-2">
                              <button onClick={() => handleFeatureProduct(p.id)}
                                className="text-xs px-2 py-1 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 rounded-lg cursor-pointer hover:bg-yellow-500/20 transition-colors">
                                ⭐ Feature
                              </button>
                              <button onClick={() => handleDeleteProduct(p.id)}
                                className="text-xs px-2 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg cursor-pointer hover:bg-red-500/20 transition-colors">
                                🗑 Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ── FEATURED TAB ── */}
            {activeTab === "featured" && (
              <div>
                <h2 className="text-white font-semibold mb-2">Pin Recommendations</h2>
                <p className="text-sm text-gray-500 mb-6">Feature చేసిన products Dashboard లో అందరికీ కనిపిస్తాయి</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {products.map((p) => (
                    <div key={p.id} className="bg-[#111] border border-white/10 rounded-xl overflow-hidden">
                      <div className="aspect-square overflow-hidden bg-[#1a1a1a]">
                        <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover"
                          onError={(e) => { e.currentTarget.style.display = "none"; }} />
                      </div>
                      <div className="p-3">
                        <p className="text-xs text-white truncate">{p.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{p.category}</p>
                        <p className="text-xs text-red-500 mt-1">{fmt(p.price)}</p>
                        <button onClick={() => handleFeatureProduct(p.id)}
                          className="w-full mt-2 py-1.5 text-xs bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 rounded-lg cursor-pointer hover:bg-yellow-500/20 transition-colors">
                          ⭐ Pin
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── USERS TAB ── */}
            {activeTab === "users" && (
              <div>
                <h2 className="text-white font-semibold mb-6">All Users ({users.length})</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left text-xs text-gray-500 pb-3 pr-4">Name</th>
                        <th className="text-left text-xs text-gray-500 pb-3 pr-4">Email</th>
                        <th className="text-left text-xs text-gray-500 pb-3 pr-4">Role</th>
                        <th className="text-left text-xs text-gray-500 pb-3">Joined</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr key={u.id} className="border-b border-white/5">
                          <td className="py-3 pr-4 text-sm text-white">{u.name}</td>
                          <td className="py-3 pr-4 text-xs text-gray-400">{u.email}</td>
                          <td className="py-3 pr-4">
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              u.role === "ADMIN"
                                ? "bg-red-500/10 text-red-400 border border-red-500/20"
                                : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                            }`}>{u.role}</span>
                          </td>
                          <td className="py-3 text-xs text-gray-500">
                            {new Date(u.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}