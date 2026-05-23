import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/api";
import { removeToken } from "../utils/token";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get("/users/me").then((res) => {
      setUser(res.data);
      setName(res.data.name);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await api.put("/users/me", { name });
      setUser(res.data);
      setEditing(false);
    } catch (err) {
      console.log(err);
    }
    setSaving(false);
  };

  const handleLogout = () => {
    removeToken();
    navigate("/login");
  };

  return (
    <div className="w-full px-4 md:px-10 py-6 md:py-8 max-w-2xl mx-auto">
      <button
        onClick={() => navigate("/dashboard")}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-8 transition-colors group"
      >
        <span className="group-hover:-translate-x-1 transition-transform">←</span>
        Back to Dashboard
      </button>

      <h1 className="text-xl md:text-2xl font-bold text-white mb-8">My Profile</h1>

      {loading && (
        <div className="flex justify-center py-24">
          <div className="w-8 h-8 border-2 border-white/10 border-t-white/40 rounded-full animate-spin" />
        </div>
      )}

      {!loading && user && (
        <div className="flex flex-col gap-6">

          {/* Avatar */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center text-2xl font-bold text-white">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-white font-semibold">{user.name}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
              <span className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${
                user.role === "ADMIN"
                  ? "bg-red-500/10 text-red-400 border border-red-500/20"
                  : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
              }`}>
                {user.role}
              </span>
            </div>
          </div>

          {/* Info */}
          <div className="bg-[#111] border border-white/10 rounded-xl p-6 flex flex-col gap-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">Full Name</p>
              {editing ? (
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 bg-[#1a1a1a] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-white/20"
                />
              ) : (
                <p className="text-sm text-white">{user.name}</p>
              )}
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Email</p>
              <p className="text-sm text-white">{user.email}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Member Since</p>
              <p className="text-sm text-white">{new Date(user.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            {editing ? (
              <>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 py-2.5 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors border-none cursor-pointer disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
                <button
                  onClick={() => { setEditing(false); setName(user.name); }}
                  className="flex-1 py-2.5 bg-white/5 text-gray-300 text-sm font-medium rounded-lg hover:bg-white/10 transition-colors border border-white/10 cursor-pointer"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditing(true)}
                className="flex-1 py-2.5 bg-white/5 text-gray-300 text-sm font-medium rounded-lg hover:bg-white/10 transition-colors border border-white/10 cursor-pointer"
              >
                Edit Profile
              </button>
            )}
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => navigate("/cart")}
              className="p-4 bg-[#111] border border-white/10 rounded-xl text-left hover:border-white/20 transition-colors cursor-pointer"
            >
              <div className="text-2xl mb-2">🛒</div>
              <p className="text-sm text-white font-medium">My Cart</p>
              <p className="text-xs text-gray-500">View cart items</p>
            </button>
            <button
              onClick={() => navigate("/wishlist")}
              className="p-4 bg-[#111] border border-white/10 rounded-xl text-left hover:border-white/20 transition-colors cursor-pointer"
            >
              <div className="text-2xl mb-2">♡</div>
              <p className="text-sm text-white font-medium">My Wishlist</p>
              <p className="text-xs text-gray-500">View saved items</p>
            </button>
            <button
              onClick={() => navigate("/history")}
              className="p-4 bg-[#111] border border-white/10 rounded-xl text-left hover:border-white/20 transition-colors cursor-pointer"
            >
              <div className="text-2xl mb-2">🕐</div>
              <p className="text-sm text-white font-medium">History</p>
              <p className="text-xs text-gray-500">Recently viewed</p>
            </button>
            <button
              onClick={handleLogout}
              className="p-4 bg-[#111] border border-red-500/20 rounded-xl text-left hover:border-red-500/40 transition-colors cursor-pointer"
            >
              <div className="text-2xl mb-2">🚪</div>
              <p className="text-sm text-red-400 font-medium">Logout</p>
              <p className="text-xs text-gray-500">Sign out</p>
            </button>
          </div>

        </div>
      )}
    </div>
  );
}