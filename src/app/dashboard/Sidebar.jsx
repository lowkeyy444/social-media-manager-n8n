"use client";

import { FaRegEdit, FaRegListAlt, FaHistory, FaTrashAlt, FaHome } from "react-icons/fa";
import { MdSupervisorAccount } from "react-icons/md";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const menu = [
    { name: "Dashboard Home", icon: <FaHome />, href: "/dashboard" },
    { name: "Generate Post", icon: <FaRegEdit />, href: "/dashboard/generatepost" },
    { name: "Review Posts", icon: <FaRegListAlt />, href: "/dashboard/reviewposts" },
    { name: "Schedule Posts", icon: <FaRegListAlt />, href: "/dashboard/schedulepost" },
    { name: "Post History", icon: <FaHistory />, href: "/dashboard/posthistory" },
    { name: "Rejected Posts", icon: <FaTrashAlt />, href: "/dashboard/rejectedposts" },
    { name: "Manage Accounts", icon: <MdSupervisorAccount />, href: "/dashboard/manageaccounts" },
  ];

  return (
    <aside className="w-60 bg-[rgba(15,17,26,0.9)] backdrop-blur-md border-r border-cyan-400 flex flex-col py-6 rounded-tr-2xl rounded-br-2xl shadow-lg">
      <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 px-6 mb-8">
        SocialManager
      </h2>
      <nav className="flex-1">
        {menu.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center gap-3 px-6 py-3 mb-2 rounded-lg font-medium transition-all ${
              pathname === item.href
                ? "bg-gradient-to-r from-cyan-400 to-blue-500 text-black shadow-md"
                : "hover:bg-gradient-to-r hover:from-cyan-400 hover:to-blue-500 hover:text-black"
            }`}
          >
            {item.icon} {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}