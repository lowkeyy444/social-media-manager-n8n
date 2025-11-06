"use client";

import { useState } from "react";
import {
  FaRegEdit,
  FaRegListAlt,
  FaHistory,
  FaTrashAlt,
  FaHome,
  FaCog,
} from "react-icons/fa";
import { MdSupervisorAccount } from "react-icons/md";
import { FiChevronDown, FiChevronRight } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import axios from "axios";
import { createPortal } from "react-dom"; // ✅ important import
import { N8N_WEBHOOKS } from "@/config/n8n";

export default function Sidebar() {
  const pathname = usePathname();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showValidateModal, setShowValidateModal] = useState(false);
  const [imageURL, setImageURL] = useState("");
  const [loading, setLoading] = useState(false);
  const [validationResult, setValidationResult] = useState(null);

  const menu = [
    { name: "Dashboard Home", icon: <FaHome />, href: "/dashboard" },
    { name: "Generate Post", icon: <FaRegEdit />, href: "/dashboard/generatepost" },
    { name: "Review Posts", icon: <FaRegListAlt />, href: "/dashboard/reviewposts" },
    { name: "Schedule Posts", icon: <FaRegListAlt />, href: "/dashboard/schedulepost" },
    { name: "Post History", icon: <FaHistory />, href: "/dashboard/posthistory" },
    { name: "Rejected Posts", icon: <FaTrashAlt />, href: "/dashboard/rejectedposts" },
    { name: "Manage Accounts", icon: <MdSupervisorAccount />, href: "/dashboard/manageaccounts" },
  ];

  // 🧠 Validate logo handler
  const handleValidate = async () => {
    if (!imageURL.trim()) return;
    setLoading(true);
    setValidationResult(null);
    try {
      const res = await axios.post(
        `${N8N_WEBHOOKS.NEXT_PUBLIC_N8N_VALIDATE_LOGO_URL}?imageURL=${encodeURIComponent(
          imageURL
        )}`
      );
      setValidationResult(res.data[0]?.output);
    } catch (err) {
      console.error("❌ Logo validation failed:", err);
      setValidationResult({
        is_valid: false,
        reasons: ["Failed to reach validation service. Try again later."],
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <aside className="w-60 bg-[rgba(15,17,26,0.9)] backdrop-blur-md border-r border-cyan-400 flex flex-col py-6 rounded-tr-2xl rounded-br-2xl shadow-lg">
      {/* 🧠 Brand Title */}
      <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 px-6 mb-8">
        SocialManager
      </h2>

      {/* 📋 Main Navigation */}
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

        {/* ⚙️ Settings Dropdown */}
        <div className="px-6 mt-2">
          <button
            onClick={() => setIsSettingsOpen((prev) => !prev)}
            className={`w-full flex items-center justify-between gap-2 px-3 py-3 rounded-lg font-medium transition-all ${
              pathname.includes("/dashboard/contact")
                ? "bg-gradient-to-r from-cyan-400 to-blue-500 text-black shadow-md"
                : "hover:bg-gradient-to-r hover:from-cyan-400 hover:to-blue-500 hover:text-black"
            }`}
          >
            <div className="flex items-center gap-3">
              <FaCog />
              <span>Settings</span>
            </div>
            {isSettingsOpen ? <FiChevronDown /> : <FiChevronRight />}
          </button>

          {/* ▼ Dropdown Items */}
          {isSettingsOpen && (
            <div className="mt-1 ml-3 flex flex-col gap-2">
              <Link
                href="/contact"
                className={`block px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  pathname === "/dashboard/contact"
                    ? "bg-gradient-to-r from-cyan-400 to-blue-500 text-black"
                    : "text-gray-300 hover:bg-[rgba(255,255,255,0.05)]"
                }`}
              >
                📨 Contact Us
              </Link>

              <button
                onClick={() => setShowValidateModal(true)}
                className="block text-left px-3 py-2 rounded-lg text-sm font-medium text-gray-300 hover:bg-[rgba(255,255,255,0.05)] transition"
              >
                🧩 Validate Logo
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* 🧩 Validate Logo Modal rendered via Portal */}
      {typeof window !== "undefined" &&
        showValidateModal &&
        createPortal(
          <AnimatePresence>
            <>
              {/* Backdrop */}
              <motion.div
                className="fixed inset-0 z-[120] bg-black/70 backdrop-blur-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowValidateModal(false)}
              />

              {/* Centered Modal */}
              <motion.div
                className="fixed z-[130] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-xl rounded-2xl bg-[rgba(12,13,20,0.95)] border border-cyan-400/10 shadow-[0_0_40px_#00ffff40] text-white p-8 backdrop-blur-xl pointer-events-auto"
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: "spring", stiffness: 200, damping: 25 }}
              >
                <h2 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  Validate Logo
                </h2>

                {/* Preview */}
                {imageURL && (
                  <div className="flex justify-center mb-5">
                    <img
                      src={imageURL}
                      alt="Logo Preview"
                      className="w-32 h-32 object-contain rounded-xl border border-cyan-400/30 shadow-md bg-[#0b0b12]"
                      onError={(e) => (e.target.style.display = "none")}
                    />
                  </div>
                )}

                <input
                  type="text"
                  placeholder="Paste your logo image URL here..."
                  value={imageURL}
                  onChange={(e) => setImageURL(e.target.value)}
                  className="w-full p-3 mb-4 rounded-lg bg-[#1a1c2b] text-white focus:ring-2 focus:ring-cyan-400 outline-none"
                />

                <div className="flex justify-center gap-3 mb-6">
                  <button
                    onClick={handleValidate}
                    disabled={loading}
                    className="px-5 py-3 rounded-lg bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-semibold shadow hover:shadow-[0_0_25px_#00cfff50] transition"
                  >
                    {loading ? "Validating..." : "Validate Logo"}
                  </button>
                  <button
                    onClick={() => setShowValidateModal(false)}
                    className="px-5 py-3 rounded-lg bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.08)] transition"
                  >
                    Cancel
                  </button>
                </div>

                {/* Validation Results */}
                <AnimatePresence>
                  {validationResult && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="text-center space-y-3"
                    >
                      {validationResult.is_valid ? (
                        <>
                          <p className="text-green-400 font-semibold text-lg">
                            ✅ This logo is valid and meets quality standards.
                          </p>
                          <p className="text-gray-400 text-sm">
                            Great! Your brand logo looks professional and clear.
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="text-red-400 font-semibold text-lg">
                            ❌ This logo does not meet all requirements.
                          </p>
                          <ul className="list-disc list-inside mt-2 text-gray-300 text-sm space-y-1 text-left max-w-md mx-auto">
                            {validationResult.reasons?.slice(0, 4).map((r, i) => (
                              <li key={i}>{r}</li>
                            ))}
                          </ul>
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </>
          </AnimatePresence>,
          document.getElementById("modal-root") // ✅ renders outside sidebar
        )}
    </aside>
  );
}