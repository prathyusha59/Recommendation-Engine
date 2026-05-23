import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api/api";
import ReviewSection from "../components/ReviewSection";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  brand: string;
  imageUrl: string;
}

interface Recommendations {
  similarProducts: Product[];
  marketBasketProducts: Product[];
  recentlyViewed: Product[];
  featuredProducts: Product[];
}

const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendations | null>(null);
  const [addedToCart, setAddedToCart] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);

  useEffect(() => {
    api.get(`/products/public/${id}`).then((res) => setProduct(res.data));
    api.post("/events", {
      productId: Number(id),
      eventType: "VIEW",
      sessionId: "session_" + Date.now(),
    }).catch((err) => console.log(err));
    api.get(`/recommendations/product/${id}`).then((res) => {
      setRecommendations(res.data);
    }).catch((err) => console.log("Recommendations error:", err));

    api.get("/wishlist").then((res) => {
      const isWishlisted = res.data.some((item: any) => item.product.id === Number(id));
      setWishlisted(isWishlisted);
    }).catch((err) => console.log(err));
  }, [id]);

  if (!product)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3 text-gray-400">
          <div className="w-10 h-10 border-2 border-gray-200 border-t-gray-500 rounded-full animate-spin" />
          <span className="text-sm">Loading product...</span>
        </div>
      </div>
    );

  const handleAddToCart = async () => {
    try {
      await api.post("/cart", { productId: product.id, quantity: 1 });
      api.post("/events", {
        productId: product.id,
        eventType: "ADD_TO_CART",
        sessionId: "session_" + Date.now(),
      });
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    } catch (err) {
      console.log("Cart error:", err);
    }
  };

  const handleWishlist = async () => {
    try {
      if (!wishlisted) {
        await api.post("/wishlist", { productId: product.id });
      } else {
        await api.delete(`/wishlist/${product.id}`);
      }
      setWishlisted(!wishlisted);
    } catch (err) {
      console.log("Wishlist error:", err);
    }
  };

  const handleAddAllToCart = async () => {
    try {
      await api.post("/cart", { productId: product.id, quantity: 1 });
      for (const p of basketProducts) {
        await api.post("/cart", { productId: p.id, quantity: 1 });
      }
    } catch (err) {
      console.log("Add all error:", err);
    }
  };

  const similarProducts = recommendations?.similarProducts ?? [];
  const basketProducts = recommendations?.marketBasketProducts ?? [];

  return (
    <div className="w-full px-4 sm:px-6 md:px-10 py-8">

      <button
        onClick={() => navigate("/products")}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-8 transition-colors group"
      >
        <span className="group-hover:-translate-x-1 transition-transform">←</span>
        Back to products
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-14">

        <div className="bg-[#111] rounded-2xl border border-white/10 flex items-center justify-center aspect-square overflow-hidden">
          <img
            src={product.imageUrl}
            alt={product.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.style.display = "none";
            }}
          />
        </div>

        <div className="flex flex-col justify-center gap-5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium tracking-widest text-gray-400 uppercase">{product.brand}</span>
            <span className="text-gray-600">·</span>
            <span className="text-xs font-medium px-2.5 py-1 bg-blue-500/10 text-blue-400 rounded-full border border-blue-500/20">{product.category}</span>
          </div>

          <h1 className="text-3xl font-semibold text-white leading-tight">{product.name}</h1>
          <div className="text-3xl font-bold text-red-500">{fmt(product.price)}</div>

          <p className="text-gray-400 text-sm leading-relaxed border-t border-white/10 pt-4">
            {product.description}
          </p>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handleAddToCart}
              className={`flex-1 py-3 px-6 rounded-xl font-medium text-sm transition-all duration-200 ${
                addedToCart
                  ? "bg-green-500 text-white scale-95"
                  : "bg-white text-black hover:bg-gray-200 active:scale-95"
              }`}
            >
              {addedToCart ? "✓ Added to Cart!" : "Add to Cart"}
            </button>
            <button
              onClick={handleWishlist}
              className={`w-12 h-12 rounded-xl border flex items-center justify-center text-xl transition-all duration-200 active:scale-90 ${
                wishlisted
                  ? "bg-red-500/10 border-red-500/30 text-red-400"
                  : "bg-[#111] border-white/10 text-gray-500 hover:border-white/25"
              }`}
            >
              {wishlisted ? "♥" : "♡"}
            </button>
          </div>

          <div className="flex items-center gap-4 text-xs text-gray-500 pt-1">
            <span>🚚 Free delivery</span>
            <span>🔄 7-day return</span>
            <span>🛡️ 2yr warranty</span>
          </div>
        </div>
      </div>

      {similarProducts.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-lg font-semibold text-white">Similar Products</h2>
            <span className="text-xs font-medium px-2.5 py-1 bg-blue-500/10 text-blue-400 rounded-full border border-blue-500/20">Item similarity</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {similarProducts.map((p, index) => (
              <div
                key={`similar-${p.id}-${index}`}
                onClick={() => navigate(`/products/${p.id}`)}
                className="group bg-[#111] border border-white/10 rounded-2xl overflow-hidden cursor-pointer hover:border-white/25 hover:-translate-y-1 transition-all duration-200"
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
                <div className="p-4">
                  <p className="font-medium text-sm text-white truncate">{p.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{p.brand}</p>
                  <p className="text-xs text-gray-600">{p.category}</p>
                  <p className="font-bold text-sm text-red-500 mt-2">{fmt(p.price)}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {basketProducts.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-lg font-semibold text-white">Frequently Bought Together</h2>
            <span className="text-xs font-medium px-2.5 py-1 bg-green-500/10 text-green-400 rounded-full border border-green-500/20">Market basket</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>
          <div className="flex flex-col gap-3">
            {basketProducts.map((p, i) => (
              <div key={`basket-${p.id}-${i}`}>
                <div
                  onClick={() => navigate(`/products/${p.id}`)}
                  className="flex items-center gap-4 p-4 border border-white/10 rounded-2xl bg-[#111] hover:border-white/25 hover:bg-[#161616] transition-all duration-200 cursor-pointer"
                >
                  <div className="w-14 h-14 rounded-xl bg-[#1a1a1a] border border-white/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-white truncate">{p.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{p.brand} · {p.category}</p>
                  </div>
                  <div className="font-semibold text-sm text-white flex-shrink-0">{fmt(p.price)}</div>
                </div>
                {i < basketProducts.length - 1 && (
                  <div className="flex justify-center my-1">
                    <span className="text-gray-600 text-lg">+</span>
                  </div>
                )}
              </div>
            ))}
            <div className="flex items-center justify-between p-4 bg-[#111] rounded-2xl border border-white/10 mt-2">
              <div>
                <p className="text-xs text-gray-500">Total for all {basketProducts.length} items</p>
                <p className="text-lg font-bold text-white mt-0.5">
                  {fmt(basketProducts.reduce((sum, p) => sum + p.price, 0) + product.price)}
                </p>
              </div>
              <button
                onClick={handleAddAllToCart}
                className="py-2.5 px-5 bg-white text-black text-sm font-medium rounded-xl hover:bg-gray-200 transition-colors active:scale-95">
                Add All to Cart
              </button>
            </div>
          </div>
        </section>
      )}

      <ReviewSection productId={Number(id)} />

    </div>
  );
}