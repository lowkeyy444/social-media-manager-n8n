"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { HiOutlineDuplicate } from "react-icons/hi";
import { FaRegCalendarAlt } from "react-icons/fa";

// ✅ Format Google Drive image URLs
const getDriveImageUrl = (url) => {
  if (!url) return "";
  const match = url.match(/[-\w]{25,}/);
  return match ? `https://drive.google.com/uc?export=view&id=${match[0]}` : url;
};

export default function SchedulePostsPage() {
  const [approvedPosts, setApprovedPosts] = useState([]);
  const [selectedPosts, setSelectedPosts] = useState([]);
  const [platform, setPlatform] = useState("");
  const [frequency, setFrequency] = useState("daily");
  const [postsPerSchedule, setPostsPerSchedule] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // 🟩 New: account selection modal state
  const [accounts, setAccounts] = useState([]);
  const [showAccountModal, setShowAccountModal] = useState(false);

  // ✅ Fetch approved posts
  useEffect(() => {
    const fetchApprovedPosts = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/api/dashboard/schedulepost/approved", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setApprovedPosts(res.data || []);
      } catch (err) {
        console.error("❌ Error fetching approved posts:", err);
      }
    };
    fetchApprovedPosts();
  }, []);

  // ✅ Copy text helper
  const copyText = (text, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text || "");
    setMessage("Copied post text!");
    setTimeout(() => setMessage(""), 2000);
  };

  // 🟢 Step 1: open modal to choose account before scheduling
  const handleScheduleClick = async (e) => {
    e.preventDefault();
    if (!platform || selectedPosts.length === 0)
      return setMessage("Please select platform and posts to schedule.");

    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `/api/dashboard/accounts?platform=${platform}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAccounts(res.data || []);
      setShowAccountModal(true);
    } catch (err) {
      console.error("❌ Error fetching accounts:", err);
      setMessage("Failed to load accounts.");
      setTimeout(() => setMessage(""), 2500);
    }
  };

  // 🟢 Step 2: actually schedule using chosen account
  const handleAccountSelect = async (socialAccountId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "/api/dashboard/schedulepost",
        {
          platform,
          postIds: selectedPosts,
          postsPerSchedule,
          frequency,
          startDate: startDate || new Date().toISOString(),
          socialAccountId,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(res.data.message || "✅ Schedule created successfully!");
      setSelectedPosts([]);
      setShowAccountModal(false);
    } catch (err) {
      console.error("❌ Scheduling failed:", err);
      setMessage(err.response?.data?.error || "Failed to create schedule");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 min-h-screen text-white">
      {/* Header */}
      <header className="max-w-6xl mx-auto mb-6 text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
          🗓️ Schedule Approved Posts
        </h1>
        <p className="text-gray-400 text-sm mt-2">
          Select approved posts and schedule them to post automatically.
        </p>
      </header>

      {/* ✅ Approved Post Cards */}
      <main className="max-w-6xl mx-auto">
        {approvedPosts.length === 0 ? (
          <p className="text-center text-gray-400">
            No approved posts available to schedule.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {approvedPosts.map((post) => {
              const preview = post.postText
                ? post.postText.slice(0, 120)
                : "No text available";

              return (
                <motion.article
                  key={post._id}
                  layoutId={`card-${post._id}`}
                  className={`relative rounded-xl overflow-hidden backdrop-blur-md border shadow-md cursor-pointer transition ${
                    selectedPosts.includes(post._id)
                      ? "bg-[rgba(0,255,255,0.08)] border-cyan-400"
                      : "bg-[rgba(15,17,26,0.85)] border-cyan-400/14"
                  }`}
                  whileHover={{
                    scale: 1.02,
                    boxShadow: "0 8px 40px rgba(0,204,255,0.08)",
                  }}
                  onClick={() =>
                    setSelectedPosts((prev) =>
                      prev.includes(post._id)
                        ? prev.filter((id) => id !== post._id)
                        : [...prev, post._id]
                    )
                  }
                >
                  <div className="h-40 w-full overflow-hidden bg-[#0b0b12]">
                    {post.imageUrl ? (
                      <motion.img
                        layoutId={`image-${post._id}`}
                        src={getDriveImageUrl(post.imageUrl)}
                        alt="Post image"
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500">
                        No Image
                      </div>
                    )}
                  </div>

                  <div className="p-4 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div className="text-xs px-2 py-1 rounded-full bg-[rgba(255,255,255,0.03)] text-gray-200 font-semibold uppercase">
                        {post.platform || "General"}
                      </div>
                      <div className="text-xs px-2 py-1 rounded-full font-semibold bg-gradient-to-r from-cyan-400 to-blue-500 text-black">
                        Approved
                      </div>
                    </div>

                    <div className="h-16 overflow-y-auto text-sm text-gray-100">
                      {preview}
                      {post.postText && post.postText.length > 120 ? "..." : ""}
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => copyText(post.postText, e)}
                          className="text-xs px-2 py-1 rounded-md bg-[rgba(255,255,255,0.02)] hover:bg-[rgba(255,255,255,0.05)] transition"
                        >
                          <HiOutlineDuplicate className="inline-block mr-1 -mt-1" />
                          Copy
                        </button>
                      </div>
                      <div className="text-xs text-gray-400">
                        {post.createdAt
                          ? new Date(post.createdAt).toLocaleDateString()
                          : ""}
                      </div>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}

        {/* ✅ Schedule Settings Form */}
        {approvedPosts.length > 0 && (
          <motion.form
            onSubmit={handleScheduleClick}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-[rgba(15,17,26,0.85)] backdrop-blur-md border border-cyan-400/10 rounded-3xl p-6 shadow-lg max-w-4xl mx-auto"
          >
            <h2 className="text-xl font-semibold mb-4 text-cyan-400">
              Schedule Settings
            </h2>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {/* Platform */}
              <div>
                <label className="text-cyan-300 font-medium mb-2 block">
                  Platform
                </label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full p-3 bg-[#1a1c2b] text-white rounded-lg focus:ring-2 focus:ring-cyan-400 outline-none"
                  required
                >
                  <option value="">Select Platform</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="instagram">Instagram</option>
                  <option value="facebook">Facebook</option>
                  <option value="twitter">Twitter</option>
                </select>
              </div>

              {/* Frequency */}
              <div>
                <label className="text-cyan-300 font-medium mb-2 block">
                  Posting Frequency
                </label>
                <select
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                  className="w-full p-3 bg-[#1a1c2b] text-white rounded-lg focus:ring-2 focus:ring-cyan-400 outline-none"
                >
                  <option value="daily">Once a day</option>
                  <option value="every_2_days">Every 2 days</option>
                  <option value="every_3_days">Every 3 days</option>
                  <option value="weekly">Once a week</option>
                </select>
              </div>

              {/* Posts per schedule */}
              <div>
                <label className="text-cyan-300 font-medium mb-2 block">
                  Number of Posts per Schedule
                </label>
                <input
                  type="number"
                  min="1"
                  max={selectedPosts.length || 1}
                  value={postsPerSchedule}
                  onChange={(e) => setPostsPerSchedule(Number(e.target.value))}
                  className="w-full p-3 bg-[#1a1c2b] text-white rounded-lg focus:ring-2 focus:ring-cyan-400 outline-none"
                />
              </div>

              {/* Start Date */}
              <div>
                <label className="text-cyan-300 font-medium mb-2 block">
                  Start Date
                </label>
                <input
                  type="datetime-local"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full p-3 bg-[#1a1c2b] text-white rounded-lg focus:ring-2 focus:ring-cyan-400 outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-semibold rounded-xl hover:shadow-[0_0_25px_#00ffff60]"
              >
                <FaRegCalendarAlt className="inline mr-2 -mt-1" />
                {loading ? "Scheduling..." : "Schedule Posts"}
              </button>
            </div>
          </motion.form>
        )}
      </main>

      {/* 🌐 Account Selection Modal */}
      <AnimatePresence>
        {showAccountModal && (
          <>
            <motion.div
              className="fixed inset-0 z-[70] bg-black/70 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAccountModal(false)}
            />
            <motion.div
              className="fixed z-[80] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[rgba(15,17,26,0.95)] border border-cyan-400/10 rounded-2xl shadow-2xl w-[90%] max-w-md p-6 text-white"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <h2 className="text-lg font-bold text-center mb-4">
                Select an Account to Schedule Posts
              </h2>
              {accounts.length === 0 ? (
                <p className="text-center text-gray-400">
                  No connected accounts found for this platform.
                </p>
              ) : (
                <div className="space-y-3 max-h-[40vh] overflow-y-auto">
                  {accounts.map((acc) => (
                    <button
                      key={acc._id}
                      onClick={() => handleAccountSelect(acc._id)}
                      className="w-full py-2 px-4 rounded-lg bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.08)] transition font-medium flex justify-between items-center"
                      disabled={loading}
                    >
                      <span>{acc.accountName}</span>
                      <span className="text-xs text-gray-400">
                        {acc.platform?.toUpperCase()}
                      </span>
                    </button>
                  ))}
                </div>
              )}
              <div className="text-center mt-5">
                <button
                  onClick={() => setShowAccountModal(false)}
                  className="mt-2 px-4 py-2 rounded-lg bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.08)] transition"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Floating Message */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed right-6 bottom-6 bg-[rgba(0,0,0,0.65)] border border-cyan-400/20 text-sm text-white px-4 py-2 rounded-lg shadow-lg"
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}