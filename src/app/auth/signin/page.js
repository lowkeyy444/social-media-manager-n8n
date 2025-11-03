// src/app/auth/signin/page.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function SigninPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Invalid credentials");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setTimeout(() => router.push("/dashboard"), 50);
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#0B0B1F] via-[#1A1446] to-[#2A0C6C] text-white font-sans">

      {/* Navbar */}
      <header className="fixed top-0 w-full z-50 border-b border-white/10 backdrop-blur-xl bg-white/5">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400"
          >
            SocialManager
          </motion.h1>

          <div className="flex items-center gap-3">
            <a
              href="/auth/signin"
              className="px-4 py-2 text-sm rounded-xl border border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black font-semibold transition"
            >
              Sign In
            </a>
            <a
              href="/auth/signup"
              className="px-4 py-2 text-sm rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-semibold hover:shadow-[0_0_25px_#00ffff90] transition"
            >
              Sign Up
            </a>
          </div>
        </div>
      </header>

      {/* Sign-in Card */}
      <div className="flex items-center justify-center min-h-screen px-4 pt-28">
        <motion.div
          className="w-full max-w-[420px] p-10 rounded-2xl bg-[rgba(255,255,255,0.03)] backdrop-blur-md border border-white/10 shadow-inner shadow-cyan-900/20 drop-shadow-lg"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl font-bold text-cyan-400 mb-6 text-center tracking-wide">
            Sign In
          </h2>

          {error && (
            <p className="text-red-500 text-center mb-4 font-medium">{error}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-cyan-400 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                className="w-full p-3 rounded-lg bg-[#1a1c2b] text-white placeholder-cyan-200 focus:ring-2 focus:ring-cyan-400 outline-none transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-cyan-400 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
                className="w-full p-3 rounded-lg bg-[#1a1c2b] text-white placeholder-cyan-200 focus:ring-2 focus:ring-cyan-400 outline-none transition-all"
                required
              />
            </div>

            <motion.button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg text-black font-semibold hover:shadow-[0_0_25px_#00ffff60] hover:scale-105 transition-all shadow-lg"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </motion.button>
          </form>

          <p className="text-cyan-200 mt-6 text-center">
            Don't have an account?{" "}
            <a
              href="/auth/signup"
              className="text-cyan-400 font-medium hover:underline"
            >
              Sign Up
            </a>
          </p>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="py-10 bg-white/5 border-t border-white/10 text-center relative">
        <div className="h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent mb-6 animate-pulse" />
        <p className="text-cyan-400 font-medium">© 2025 SocialManager. All rights reserved.</p>
        <p className="text-sm text-gray-400 mt-2">
          Built for the next generation of creators.
        </p>
      </footer>
    </div>
  );
}