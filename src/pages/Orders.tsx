import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/api";

interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  productImageUrl?: string;
  quantity: number;
  priceAtPurchase: number;
  subtotal: number;
}

interface Order {
  id: number;
  status: "PLACED" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  totalAmount: number;
  shippingAddress: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

const STATUS_STYLES: Record<Order["status"], string> = {
  PLACED:    "bg-blue-100 text-blue-800",
  CONFIRMED: "bg-yellow-100 text-yellow-800",
  SHIPPED:   "bg-purple-100 text-purple-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  });

export default function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [cancelling, setCancelling] = useState<number | null>(null);

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders");
      setOrders(res.data);
    } catch {
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (orderId: number) => {
    if (!confirm("Are you sure you want to cancel this order?")) return;
    setCancelling(orderId);
    try {
      const res = await api.put(`/orders/${orderId}/cancel`);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? res.data : o)));
    } catch (err: any) {
      alert(err?.response?.data?.message || "Cancel failed");
    } finally {
      setCancelling(null);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-gray-500">Loading orders...</div>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 mb-4">No orders yet.</p>
          <button
            onClick={() => navigate("/products")}
            className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <div key={order.id} className="border border-gray-200 rounded-xl overflow-hidden">

              {/* Header */}
              <div
                className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-gray-50 transition"
                onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
              >
                <div className="flex flex-col gap-1">
                  <span className="font-medium text-sm">Order #{order.id}</span>
                  <span className="text-xs text-gray-500">
                    {fmtDate(order.createdAt)} · {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${STATUS_STYLES[order.status]}`}>
                    {order.status}
                  </span>
                  <span className="font-semibold">{fmt(order.totalAmount)}</span>
                  <span className="text-gray-400 text-sm">{expandedId === order.id ? "▲" : "▼"}</span>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedId === order.id && (
                <div className="border-t border-gray-100 px-5 py-4 bg-gray-50">
                  <div className="flex flex-col gap-3 mb-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 bg-white rounded-lg p-3">
                        {item.productImageUrl ? (
                          <img src={item.productImageUrl} alt={item.productName}
                            className="w-14 h-14 object-cover rounded-lg" />
                        ) : (
                          <div className="w-14 h-14 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-xs">No img</div>
                        )}
                        <div className="flex-1">
                          <p className="text-sm font-medium">{item.productName}</p>
                          <p className="text-xs text-gray-500">{fmt(item.priceAtPurchase)} × {item.quantity}</p>
                        </div>
                        <span className="font-medium text-sm">{fmt(item.subtotal)}</span>
                      </div>
                    ))}
                  </div>

                  <p className="text-xs text-gray-500 mb-4">
                    <span className="font-medium text-gray-700">Shipping to:</span> {order.shippingAddress}
                  </p>

                  <div className="flex justify-between items-center border-t border-gray-200 pt-3">
                    <span className="text-sm text-gray-500">Total</span>
                    <span className="font-semibold">{fmt(order.totalAmount)}</span>
                  </div>

                  {order.status === "PLACED" && (
                    <button
                      onClick={() => cancelOrder(order.id)}
                      disabled={cancelling === order.id}
                      className="mt-4 w-full py-2 rounded-lg border border-red-400 text-red-600 text-sm hover:bg-red-50 transition disabled:opacity-50"
                    >
                      {cancelling === order.id ? "Cancelling..." : "Cancel Order"}
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}