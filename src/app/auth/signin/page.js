"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function SigninPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/auth/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (res.ok) router.push("/dashboard"); // redirect after login
    else setError(data.error);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f111a] px-4 font-orbitron">
      <motion.div
        className="bg-[rgba(15,17,26,0.85)] backdrop-blur-md rounded-3xl shadow-xl w-full max-w-md p-10 border border-green-600"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-4xl font-bold text-green-400 mb-6 text-center tracking-wide">
          Sign In
        </h2>

        {error && (
          <p className="text-red-500 text-center mb-4 font-medium">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-green-400 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com"
              className="w-full p-3 rounded-lg bg-[#1a1c2b] text-white placeholder-green-200 focus:ring-2 focus:ring-green-400 outline-none transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-green-400 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              className="w-full p-3 rounded-lg bg-[#1a1c2b] text-white placeholder-green-200 focus:ring-2 focus:ring-green-400 outline-none transition-all"
              required
            />
          </div>

          <motion.button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-green-500 to-green-400 rounded-lg text-black font-semibold hover:from-green-600 hover:to-green-500 transition-all shadow-lg"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Sign In
          </motion.button>
        </form>

        <p className="text-green-200 mt-6 text-center">
          Don't have an account?{" "}
          <a
            href="/auth/signup"
            className="text-green-400 font-medium hover:underline"
          >
            Sign Up
          </a>
        </p>
      </motion.div>
    </div>
  );
}