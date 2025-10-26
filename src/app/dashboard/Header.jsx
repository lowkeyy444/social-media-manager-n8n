"use client";

import { useRouter } from "next/navigation";

export default function Header({ user }) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/auth/signin");
  };

  return (
    <header className="bg-[rgba(15,17,26,0.85)] backdrop-blur-md p-4 flex justify-between items-center rounded-b-2xl shadow-md border-b border-cyan-400">
      <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
        Welcome, {user.name || "User"}
      </h1>
      <button
        onClick={handleLogout}
        className="bg-gradient-to-r from-cyan-400 to-blue-500 text-black px-4 py-2 rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all"
      >
        Sign Out
      </button>
    </header>
  );
}