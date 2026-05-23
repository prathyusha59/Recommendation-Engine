import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/api";

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  brand: string;
  imageUrl?: string;
}

const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

export default function History() {
  const navigate = useNavigate();
  const [history, setHistory] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/recommendations/homepage").then((res) => {
      setHistory(res.data.recentlyViewed ?? []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <div className="w-full px-4 sm:px-6 md:px-10 py-8">
      <button
        onClick={() => navigate("/dashboard")}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-8 transition-colors group"
      >
        <span className="group-hover:-translate-x-1 transition-transform">←</span>
        Back to Dashboard
      </button>

      <h1 className="text-2xl font-bold text-white mb-2">Recently Viewed</h1>
      <p className="text-sm text-gray-500 mb-8">Your browsing history</p>

      {loading && (
        <div className="flex justify-center py-24">
          <div className="w-8 h-8 border-2 border-white/10 border-t-white/40 rounded-full animate-spin" />
        </div>
      )}

      {!loading && history.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
          <span className="text-5xl opacity-20">🕐</span>
          <p className="text-gray-400 font-medium">No history yet</p>
          <p className="text-sm text-gray-600">Browse some products to see them here</p>
          <button
            onClick={() => navigate("/products")}
            className="mt-2 py-2.5 px-6 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors cursor-pointer"
          >
            Browse Products
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {history.map((p, index) => (
          <div
            key={`history-${p.id}-${index}`}
            onClick={() => navigate(`/products/${p.id}`)}
            className="group bg-[#111] border border-white/10 rounded-xl overflow-hidden cursor-pointer hover:border-white/25 hover:-translate-y-1 transition-all duration-200"
          >
            <div className="aspect-square overflow-hidden bg-[#1a1a1a]">
              <img
                src={p.imageUrl}
                alt={p.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
            <div className="p-3">
              <p className="font-medium text-xs text-white truncate">{p.name}</p>
              <p className="text-xs text-gray-500 mt-0.5">{p.brand}</p>
              <p className="text-xs text-gray-600">{p.category}</p>
              <p className="font-semibold text-xs text-red-500 mt-1">{fmt(p.price)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}