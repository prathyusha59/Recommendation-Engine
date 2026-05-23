import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/api";

interface CartItem {
  id: number;
  product: {
    id: number;
    name: string;
    price: number;
    category: string;
    brand: string;
    imageUrl?: string;
  };
  quantity: number;
}

const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

export default function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [shippingAddress, setShippingAddress] = useState("");

  useEffect(() => {
    api.get("/cart").then((res) => {
      setCartItems(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleRemove = async (productId: number) => {
    try {
      await api.delete(`/cart/${productId}`);
      setCartItems(cartItems.filter(item => item.product.id !== productId));
    } catch (err) { console.log(err); }
  };

  const handleQuantity = async (productId: number, quantity: number) => {
    if (quantity < 1) { handleRemove(productId); return; }
    try {
      await api.post("/cart", { productId, quantity });
      setCartItems(cartItems.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      ));
    } catch (err) { console.log(err); }
  };

  const handleCheckout = async () => {
    if (!shippingAddress.trim()) { alert("Please enter a shipping address"); return; }
    setCheckingOut(true);
    try {
      await api.post("/orders/checkout", { shippingAddress });
      setShowCheckoutModal(false);
      navigate("/orders");
    } catch (err: any) {
      alert(err?.response?.data?.message || "Checkout failed");
    } finally {
      setCheckingOut(false);
    }
  };

  const total = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <div className="w-full px-4 md:px-10 py-6 md:py-8">
      <button onClick={() => navigate("/products")}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-8 transition-colors group">
        <span className="group-hover:-translate-x-1 transition-transform">←</span>
        Continue Shopping
      </button>

      <h1 className="text-xl md:text-2xl font-bold text-white mb-6">My Cart</h1>

      {loading && (
        <div className="flex justify-center py-24">
          <div className="w-8 h-8 border-2 border-white/10 border-t-white/40 rounded-full animate-spin" />
        </div>
      )}

      {!loading && cartItems.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
          <span className="text-5xl opacity-20">🛒</span>
          <p className="text-gray-400 font-medium">Your cart is empty</p>
          <button onClick={() => navigate("/products")}
            className="mt-2 py-2.5 px-6 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors border-none cursor-pointer">
            Browse Products
          </button>
        </div>
      )}

      {!loading && cartItems.length > 0 && (
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 flex flex-col gap-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center gap-4 p-4 bg-[#111] border border-white/10 rounded-xl">
                <div onClick={() => navigate(`/products/${item.product.id}`)}
                  className="w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden bg-[#1a1a1a] flex-shrink-0 cursor-pointer">
                  <img src={item.product.imageUrl} alt={item.product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.currentTarget.style.display = "none"; }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-white truncate">{item.product.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{item.product.brand} · {item.product.category}</p>
                  <p className="font-bold text-sm text-red-500 mt-1">{fmt(item.product.price)}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => handleQuantity(item.product.id, item.quantity - 1)}
                    className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 text-white text-sm cursor-pointer hover:bg-white/10 transition-colors">−</button>
                  <span className="text-sm text-white w-6 text-center">{item.quantity}</span>
                  <button onClick={() => handleQuantity(item.product.id, item.quantity + 1)}
                    className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 text-white text-sm cursor-pointer hover:bg-white/10 transition-colors">+</button>
                </div>
                <button onClick={() => handleRemove(item.product.id)}
                  className="text-gray-600 hover:text-red-400 transition-colors cursor-pointer bg-transparent border-none text-lg flex-shrink-0">🗑</button>
              </div>
            ))}
          </div>

          <div className="lg:w-80">
            <div className="bg-[#111] border border-white/10 rounded-xl p-6 sticky top-24">
              <h2 className="text-white font-semibold mb-4">Order Summary</h2>
              <div className="flex flex-col gap-3 mb-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-xs text-gray-400">
                    <span className="truncate flex-1 mr-2">{item.product.name} x{item.quantity}</span>
                    <span className="flex-shrink-0">{fmt(item.product.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-white/10 pt-4 flex justify-between items-center mb-6">
                <span className="text-sm text-gray-400">Total</span>
                <span className="text-lg font-bold text-white">{fmt(total)}</span>
              </div>
              <button onClick={() => setShowCheckoutModal(true)}
                className="w-full py-3 bg-red-600 text-white text-sm font-medium rounded-xl hover:bg-red-700 transition-colors border-none cursor-pointer">
                Proceed to Checkout
              </button>
              <div className="flex items-center justify-center gap-4 text-xs text-gray-600 mt-4">
                <span>🚚 Free delivery</span>
                <span>🔄 7-day return</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {showCheckoutModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-[#111] border border-white/10 rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-white font-semibold text-lg mb-4">Confirm Order</h2>
            <div className="mb-4">
              <p className="text-xs text-gray-500 mb-2">Order Total</p>
              <p className="text-2xl font-bold text-white">{fmt(total)}</p>
              <p className="text-xs text-gray-600 mt-1">{cartItems.length} items</p>
            </div>
            <div className="mb-5">
              <label className="text-xs text-gray-400 block mb-2">Shipping Address *</label>
              <textarea
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                placeholder="Enter your full delivery address..."
                rows={3}
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 resize-none focus:outline-none focus:border-white/20"
              />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowCheckoutModal(false)}
                className="flex-1 py-3 rounded-xl border border-white/10 text-gray-400 text-sm hover:bg-white/5 transition cursor-pointer bg-transparent">
                Cancel
              </button>
              <button onClick={handleCheckout} disabled={checkingOut}
                className="flex-1 py-3 rounded-xl bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition border-none cursor-pointer disabled:opacity-50">
                {checkingOut ? "Placing..." : "Place Order"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}