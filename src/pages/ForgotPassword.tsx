import { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"email" | "reset" | "done">("email");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/auth/forgot-password", { email });
      setToken(res.data.token);
      setStep("reset");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Email not found");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      await api.post("/auth/reset-password", { token, newPassword });
      setStep("done");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Reset failed. Try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white">Reset Password</h1>
          <p className="text-sm text-gray-500 mt-2">
            {step === "email" && "Enter your email to get a reset token"}
            {step === "reset" && "Enter your new password"}
            {step === "done" && "Password changed successfully!"}
          </p>
        </div>

        <div className="bg-[#111] border border-white/10 rounded-2xl p-8">

          {/* Step 1 — Email */}
          {step === "email" && (
            <form onSubmit={handleForgot} className="flex flex-col gap-4">
              <div>
                <label className="text-xs text-gray-400 block mb-2">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-white/30"
                />
              </div>

              {error && <p className="text-xs text-red-400">{error}</p>}

              <button type="submit" disabled={loading}
                className="w-full py-3 bg-red-600 text-white text-sm font-medium rounded-xl hover:bg-red-700 transition border-none cursor-pointer disabled:opacity-50">
                {loading ? "Sending..." : "Get Reset Token"}
              </button>

              <div className="text-center">
                <Link to="/login" className="text-xs text-gray-500 hover:text-gray-300 transition">
                  ← Back to Login
                </Link>
              </div>
            </form>
          )}

          {/* Step 2 — Reset */}
          {step === "reset" && (
            <form onSubmit={handleReset} className="flex flex-col gap-4">

              <div className="bg-[#1a1a1a] border border-yellow-500/20 rounded-xl px-4 py-3">
                <p className="text-xs text-yellow-500 mb-1">Your Reset Token (Demo)</p>
                <p className="text-xs text-gray-400 break-all font-mono">{token}</p>
              </div>

              <div>
                <label className="text-xs text-gray-400 block mb-2">Reset Token</label>
                <input
                  type="text"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="Paste your token here"
                  required
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-white/30 font-mono"
                />
              </div>

              <div>
                <label className="text-xs text-gray-400 block mb-2">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  required
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-white/30"
                />
              </div>

              <div>
                <label className="text-xs text-gray-400 block mb-2">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  required
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-white/30"
                />
              </div>

              {error && <p className="text-xs text-red-400">{error}</p>}

              <button type="submit" disabled={loading}
                className="w-full py-3 bg-red-600 text-white text-sm font-medium rounded-xl hover:bg-red-700 transition border-none cursor-pointer disabled:opacity-50">
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          )}

          {/* Step 3 — Done */}
          {step === "done" && (
            <div className="flex flex-col items-center gap-6 text-center py-4">
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center text-3xl">
                ✅
              </div>
              <div>
                <p className="text-white font-medium mb-1">Password Changed!</p>
                <p className="text-sm text-gray-500">You can now login with your new password</p>
              </div>
              <Link to="/login"
                className="w-full py-3 bg-red-600 text-white text-sm font-medium rounded-xl hover:bg-red-700 transition text-center block">
                Go to Login
              </Link>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}