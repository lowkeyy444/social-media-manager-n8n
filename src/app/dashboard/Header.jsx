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
    <header className="bg-[#11121f] p-4 flex justify-between items-center border-b border-green-600">
      <h1 className="text-xl font-bold text-green-400">
        Welcome, {user.name || "User"}
      </h1>
      <button
        onClick={handleLogout}
        className="bg-green-500 hover:bg-green-600 text-black font-semibold px-4 py-2 rounded transition-all"
      >
        Sign Out
      </button>
    </header>
  );
}