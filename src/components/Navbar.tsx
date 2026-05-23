import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { removeToken, getToken } from "../utils/token";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = !!getToken();
  const isAdmin = (() => {
    try {
      const token = getToken();
      if (!token) return false;
      const base64Url = token.split('.')[1];
      if (!base64Url) return false;
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join('')
      );
      const payload = JSON.parse(jsonPayload);
      return payload?.role === 'ADMIN';
    } catch (e) {
      return false;
    }
  })();
  const [menuOpen, setMenuOpen] = useState(false);

  const logout = () => {
    removeToken();
    navigate("/login");
    setMenuOpen(false);
  };

  const goTo = (path: string) => {
    navigate(path);
    setMenuOpen(false);
  };

  const isActive = (path: string) =>
    location.pathname === path
      ? "text-white font-semibold"
      : "text-gray-400 hover:text-white";

  return (
    <nav className="bg-black border-b border-white/10 sticky top-0 z-50">
      <div className="w-full px-4 sm:px-6 md:px-10 py-4 flex items-center justify-between">

        {/* Logo */}
        <div onClick={() => goTo("/")} className="flex items-center gap-2 cursor-pointer">
          <span className="text-2xl">🛍️</span>
          <span className="font-bold text-white text-lg tracking-tight">RecoEngine</span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <button onClick={() => goTo("/")} className={`text-sm transition-colors bg-transparent border-none p-0 cursor-pointer ${isActive("/")}`}>Home</button>
          <button onClick={() => goTo("/products")} className={`text-sm transition-colors bg-transparent border-none p-0 cursor-pointer ${isActive("/products")}`}>Products</button>
          {isLoggedIn && !isAdmin && (
            <>
              <button onClick={() => goTo("/dashboard")} className={`text-sm transition-colors bg-transparent border-none p-0 cursor-pointer ${isActive("/dashboard")}`}>Dashboard</button>
              {/* Orders link add చేశాం */}
              <button onClick={() => goTo("/orders")} className={`text-sm transition-colors bg-transparent border-none p-0 cursor-pointer ${isActive("/orders")}`}>Orders</button>
            </>
          )}
          {isLoggedIn && isAdmin && (
            <button onClick={() => goTo("/admin")} className={`text-sm transition-colors bg-transparent border-none p-0 cursor-pointer text-red-400 hover:text-red-300 ${isActive("/admin")}`}>Admin</button>
          )}
        </div>

        {/* Desktop Right Side */}
        <div className="hidden md:flex items-center gap-3">
          {isLoggedIn && !isAdmin && (
            <>
              <button
                onClick={() => goTo("/wishlist")}
                className={`text-xl cursor-pointer bg-transparent border-none transition-colors ${isActive("/wishlist") ? "text-red-400" : "text-gray-400 hover:text-white"}`}
                title="Wishlist"
              >
                ♡
              </button>
              <button
                onClick={() => goTo("/cart")}
                className={`text-xl cursor-pointer bg-transparent border-none transition-colors ${isActive("/cart") ? "text-white" : "text-gray-400 hover:text-white"}`}
                title="Cart"
              >
                🛒
              </button>
              <button
                onClick={() => goTo("/profile")}
                className={`w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white text-sm font-bold cursor-pointer border-2 transition-colors ${isActive("/profile") ? "border-white" : "border-transparent hover:border-white/40"}`}
                title="Profile"
              >
                👤
              </button>
            </>
          )}
          {isLoggedIn && isAdmin && (
            <button
              onClick={() => goTo("/profile")}
              className={`w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white text-sm font-bold cursor-pointer border-2 transition-colors ${isActive("/profile") ? "border-white" : "border-transparent hover:border-white/40"}`}
              title="Profile"
            >
              👤
            </button>
          )}
          {isLoggedIn ? (
            <button onClick={logout} className="py-2 px-4 text-sm font-medium text-gray-300 hover:text-white border border-white/20 rounded-lg hover:border-white/40 transition-colors bg-transparent cursor-pointer">
              Logout
            </button>
          ) : (
            <>
              <button onClick={() => goTo("/login")} className="py-2 px-4 text-sm font-medium text-gray-300 hover:text-white transition-colors bg-transparent border-none cursor-pointer">Login</button>
              <button onClick={() => goTo("/register")} className="py-2 px-4 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors border-none cursor-pointer">Register</button>
            </>
          )}
        </div>

        {/* Hamburger Button - Mobile */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden flex flex-col gap-1.5 cursor-pointer bg-transparent border-none p-1"
        >
          <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>

      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-black border-t border-white/10 px-4 sm:px-6 py-4 flex flex-col gap-4">
          <button onClick={() => goTo("/")} className={`text-sm text-left transition-colors bg-transparent border-none p-0 cursor-pointer ${isActive("/")}`}>Home</button>
          <button onClick={() => goTo("/products")} className={`text-sm text-left transition-colors bg-transparent border-none p-0 cursor-pointer ${isActive("/products")}`}>Products</button>
          {isLoggedIn && !isAdmin && (
            <>
              <button onClick={() => goTo("/dashboard")} className={`text-sm text-left transition-colors bg-transparent border-none p-0 cursor-pointer ${isActive("/dashboard")}`}>Dashboard</button>
              {/* Mobile లో కూడా Orders link */}
              <button onClick={() => goTo("/orders")} className={`text-sm text-left transition-colors bg-transparent border-none p-0 cursor-pointer ${isActive("/orders")}`}>📦 Orders</button>
              <button onClick={() => goTo("/wishlist")} className={`text-sm text-left transition-colors bg-transparent border-none p-0 cursor-pointer ${isActive("/wishlist")}`}>♡ Wishlist</button>
              <button onClick={() => goTo("/cart")} className={`text-sm text-left transition-colors bg-transparent border-none p-0 cursor-pointer ${isActive("/cart")}`}>🛒 Cart</button>
            </>
          )}
          {isLoggedIn && (
            <button onClick={() => goTo("/profile")} className={`text-sm text-left transition-colors bg-transparent border-none p-0 cursor-pointer ${isActive("/profile")}`}>👤 Profile</button>
          )}
          {isLoggedIn && isAdmin && (
            <button onClick={() => goTo("/admin")} className="text-sm text-left text-red-400 bg-transparent border-none p-0 cursor-pointer">Admin</button>
          )}
          <div className="border-t border-white/10 pt-4">
            {isLoggedIn ? (
              <button onClick={logout} className="text-sm text-gray-300 hover:text-white bg-transparent border-none p-0 cursor-pointer">Logout</button>
            ) : (
              <div className="flex gap-4">
                <button onClick={() => goTo("/login")} className="text-sm text-gray-300 hover:text-white bg-transparent border-none p-0 cursor-pointer">Login</button>
                <button onClick={() => goTo("/register")} className="py-2 px-4 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors border-none cursor-pointer">Register</button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}