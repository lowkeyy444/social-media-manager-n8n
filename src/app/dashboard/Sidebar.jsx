"use client";

import { FaRegEdit, FaRegListAlt, FaHistory, FaTrashAlt } from "react-icons/fa";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const menu = [
    { name: "Dashboard Home", href: "/dashboard" },
    { name: "Generate Post", icon: <FaRegEdit />, href: "/dashboard/generatepost" },
    { name: "Review Posts", icon: <FaRegListAlt />, href: "/dashboard/reviewposts" },
    { name: "Post History", icon: <FaHistory />, href: "/dashboard/posthistory" },
    { name: "Rejected Posts", icon: <FaTrashAlt />, href: "/dashboard/rejected" },
  ];

  return (
    <aside className="w-60 bg-[#11121f] border-r border-green-600 flex flex-col py-6">
      <h2 className="text-2xl font-bold text-green-400 px-6 mb-8">Social Manager</h2>
      <nav className="flex-1">
        {menu.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center gap-4 px-6 py-3 mb-2 rounded-lg transition-all ${
              pathname === item.href ? "bg-green-600 text-black" : "hover:bg-green-700 hover:text-white"
            }`}
          >
            {item.icon} {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}