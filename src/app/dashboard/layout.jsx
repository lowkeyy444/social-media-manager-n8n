"use client";

import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";
import { useRouter } from "next/navigation";

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      router.replace("/auth/signin");
    }
    setLoading(false);
  }, [router]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-cyan-400">Loading...</div>;
  if (!user) return <div className="min-h-screen flex items-center justify-center text-red-500">Redirecting to Sign In...</div>;

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[#0B0B1F] via-[#1A1446] to-[#2A0C6C] font-sans text-white">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header user={user} />
        <main className="flex-1 p-6 backdrop-blur-sm">{children}</main>
        <Footer />
      </div>
    </div>
  );
}