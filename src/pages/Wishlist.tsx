import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/api";

interface WishlistItem {
  id: number;
  product: {
    id: number;
    name: string;
    price: number;
    category: string;
    brand: string;
    imageUrl?: string;
  };
}

const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

export default function Wishlist() {
  const navigate = useNavigate();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/wishlist").then((res) => {
      setWishlistItems(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleRemove = async (productId: number) => {
    try {
      await api.delete(`/wishlist/${productId}`);
      setWishlistItems(wishlistItems.filter(item => item.product.id !== productId));
    } catch (err) {
      console.log(err);
    }
  };

  const handleAddToCart = async (productId: number) => {
    try {
      await api.post("/cart", { productId, quantity: 1 });
      alert("Added to cart!");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="w-full px-4 md:px-10 py-6 md:py-8">
      <button
        onClick={() => navigate("/products")}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-8 transition-colors group"
      >
        <span className="group-hover:-translate-x-1 transition-transform">←</span>
        Continue Shopping
      </button>

      <h1 className="text-xl md:text-2xl font-bold text-white mb-6">My Wishlist</h1>

      {loading && (
        <div className="flex justify-center py-24">
          <div className="w-8 h-8 border-2 border-white/10 border-t-white/40 rounded-full animate-spin" />
        </div>
      )}

      {!loading && wishlistItems.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
          <span className="text-5xl opacity-20">♡</span>
          <p className="text-gray-400 font-medium">Your wishlist is empty</p>
          <button
            onClick={() => navigate("/products")}
            className="mt-2 py-2.5 px-6 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors border-none cursor-pointer"
          >
            Browse Products
          </button>
        </div>
      )}

      {!loading && wishlistItems.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {wishlistItems.map((item) => (
            <div key={item.id} className="bg-[#111] border border-white/10 rounded-xl overflow-hidden">
              <div
                onClick={() => navigate(`/products/${item.product.id}`)}
                className="aspect-square overflow-hidden bg-[#1a1a1a] cursor-pointer"
              >
                <img
                  src={item.product.imageUrl}
                  alt={item.product.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  onError={(e) => { e.currentTarget.style.display = "none"; }}
                />
              </div>
              <div className="p-3">
                <p className="font-medium text-xs text-white truncate">{item.product.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">{item.product.brand}</p>
                <p className="font-bold text-xs text-red-500 mt-1">{fmt(item.product.price)}</p>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleAddToCart(item.product.id)}
                    className="flex-1 py-1.5 text-xs bg-white text-black font-medium rounded-lg hover:bg-gray-200 transition-colors border-none cursor-pointer"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => handleRemove(item.product.id)}
                    className="w-7 h-7 flex items-center justify-center text-gray-600 hover:text-red-400 transition-colors cursor-pointer bg-transparent border-none"
                  >
                    🗑
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}