"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineX, HiOutlineDuplicate } from "react-icons/hi";
import { FiTrash2 } from "react-icons/fi";
import { useRouter } from "next/navigation";

export default function ReviewPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  // 🔹 Fetch posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/api/dashboard/reviewpost", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPosts(res.data || []);
      } catch (err) {
        console.error("Error fetching posts:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const getDriveImageUrl = (url) => {
    if (!url) return "";
    if (url.includes("drive.google.com")) {
      const match = url.match(/\/d\/(.*?)\//);
      if (match && match[1])
        return `https://drive.google.com/uc?export=view&id=${match[1]}`;
      const idMatch = url.match(/id=([a-zA-Z0-9_-]+)/);
      if (idMatch && idMatch[1])
        return `https://drive.google.com/uc?export=view&id=${idMatch[1]}`;
    }
    return url;
  };

  // 🟡 Approve/Reject
  const handleAction = async (id, status, closeAfter = false) => {
    setIsProcessing(true);
    setMessage("");
    try {
      const token = localStorage.getItem("token");
      const res = await axios.patch(
        "/api/dashboard/reviewpost",
        { postId: id, status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updated = res.data || {};
      setPosts((prev) =>
        prev.map((p) => (p._id === id ? { ...p, ...updated, status } : p))
      );
      setMessage(`Post ${status}`);
      if (closeAfter) setActive(null);
    } catch (err) {
      console.error(`Error ${status} post:`, err);
      setMessage("Something went wrong.");
    } finally {
      setIsProcessing(false);
      setTimeout(() => setMessage(""), 2500);
    }
  };

  // 🟢 Post Now
  const handlePostNow = async (id) => {
    setIsProcessing(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "/api/dashboard/reviewpost",
        { postId: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(res.data?.message || "Posted successfully!");
      setActive(null);
    } catch (err) {
      console.error("Error posting now:", err);
      setMessage(err.response?.data?.error || "Failed to post now.");
    } finally {
      setIsProcessing(false);
      setTimeout(() => setMessage(""), 2500);
    }
  };

  const copyText = async (text, e) => {
    e?.stopPropagation();
    try {
      await navigator.clipboard.writeText(text || "");
      setMessage("Copied post text to clipboard");
      setTimeout(() => setMessage(""), 1800);
    } catch {
      setMessage("Copy failed");
      setTimeout(() => setMessage(""), 1800);
    }
  };

  const handleDelete = async (id, e) => {
    e?.stopPropagation();
    if (!confirm("Delete this post permanently?")) return;
    try {
      setPosts((prev) => prev.filter((p) => p._id !== id));
      setActive(null);
      setMessage("Post deleted");
      setTimeout(() => setMessage(""), 1800);
    } catch (err) {
      console.error("Delete error", err);
      setMessage("Delete failed");
      setTimeout(() => setMessage(""), 1800);
    }
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setActive(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (loading)
    return <p className="text-center text-gray-400 mt-10">Loading posts...</p>;

  return (
    <div className="p-6 min-h-screen text-white overflow-y-auto">
      <header className="max-w-6xl mx-auto mb-6">
        <h1 className="text-3xl md:text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
          Review Generated Posts
        </h1>
        <p className="text-center text-sm text-gray-300 mt-2">
          Click any post to open full view — post now, approve, or schedule it.
        </p>
      </header>

      <main className="max-w-6xl mx-auto">
        {posts.length === 0 ? (
          <p className="text-center text-gray-400">No posts found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => {
              const preview = post.postText ? post.postText.slice(0, 120) : "";
              return (
                <motion.article
                  key={post._id}
                  layoutId={`card-${post._id}`}
                  className="relative rounded-xl overflow-hidden bg-[rgba(15,17,26,0.85)] backdrop-blur-md border border-cyan-400/14 shadow-md cursor-pointer"
                  whileHover={{
                    scale: 1.02,
                    boxShadow: "0 8px 40px rgba(0,204,255,0.08)",
                  }}
                  onClick={() => setActive(post)}
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
                      <div className="text-xs px-2 py-1 rounded-full bg-[rgba(255,255,255,0.03)] text-gray-200 font-semibold">
                        {post.platform ? post.platform.toUpperCase() : "GENERAL"}
                      </div>
                      <div
                        className={`text-xs px-2 py-1 rounded-full font-semibold ${
                          post.status === "approved"
                            ? "bg-gradient-to-r from-cyan-400 to-blue-500 text-black"
                            : post.status === "rejected"
                            ? "bg-gradient-to-r from-red-400 to-pink-500 text-black"
                            : "bg-gradient-to-r from-purple-400 to-pink-500 text-black"
                        }`}
                      >
                        {post.status || "pending"}
                      </div>
                    </div>

                    <div className="h-16 overflow-y-auto pr-1 text-sm leading-snug text-gray-100">
                      {preview}
                      {post.postText && post.postText.length > 120 ? "..." : ""}
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}
      </main>

      {/* 🔔 Snackbar */}
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

      {/* 🧾 Modal */}
      <AnimatePresence>
        {active && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm overflow-y-auto p-6"
              onClick={() => setActive(null)}
            />

            <motion.div
              key="modal"
              layoutId={`card-${active._id}`}
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-4xl w-full rounded-2xl overflow-hidden bg-[rgba(12,13,20,0.9)] backdrop-blur-md border border-cyan-400/10 shadow-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-full grid grid-cols-1 md:grid-cols-2">
                <div className="md:col-span-1 bg-[#0b0b12] min-h-[260px]">
                  {active.imageUrl ? (
                    <motion.img
                      layoutId={`image-${active._id}`}
                      src={getDriveImageUrl(active.imageUrl)}
                      alt="Post full"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                      No Image
                    </div>
                  )}
                </div>

                <div className="md:col-span-1 p-6 flex flex-col">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-xs px-2 py-1 rounded-full bg-[rgba(255,255,255,0.03)] text-gray-200 font-semibold">
                        {active.platform?.toUpperCase() || "GENERAL"}
                      </div>
                      <h2 className="mt-3 text-lg font-bold text-gray-100">
                        {active.title || "Post Preview"}
                      </h2>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          copyText(active.postText, e);
                        }}
                        className="p-2 rounded-md bg-[rgba(255,255,255,0.02)] hover:bg-[rgba(255,255,255,0.03)] transition"
                      >
                        <HiOutlineDuplicate />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(active._id, e);
                        }}
                        className="p-2 rounded-md bg-[rgba(255,50,50,0.05)] hover:bg-[rgba(255,50,50,0.08)] transition"
                      >
                        <FiTrash2 />
                      </button>
                      <button
                        onClick={() => setActive(null)}
                        className="p-2 rounded-md bg-[rgba(255,255,255,0.02)] hover:bg-[rgba(255,255,255,0.03)] transition"
                      >
                        <HiOutlineX />
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 overflow-y-auto pr-2 text-gray-200 text-sm space-y-4 max-h-[50vh]">
                    <p className="whitespace-pre-line">{active.postText}</p>
                    <div className="text-xs text-gray-400">
                      {active.createdAt && (
                        <span>
                          Created:{" "}
                          {new Date(active.createdAt).toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 🟢 3 Action Buttons */}
                  <div className="mt-auto pt-4 flex flex-wrap items-center gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePostNow(active._id);
                      }}
                      disabled={isProcessing}
                      className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-400 to-emerald-500 text-black font-semibold shadow hover:shadow-[0_0_25px_#00cfff50]"
                    >
                      Post Now
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAction(active._id, "approved", true);
                      }}
                      disabled={isProcessing}
                      className="px-4 py-2 rounded-lg bg-gradient-to-r from-yellow-300 to-amber-500 text-black font-semibold shadow hover:shadow-[0_0_25px_#ffce0050]"
                    >
                      Approve
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAction(active._id, "approved", false);
                        router.push("/dashboard/schedulepost");
                      }}
                      disabled={isProcessing}
                      className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-400 to-cyan-500 text-black font-semibold shadow hover:shadow-[0_0_25px_#00cfff50]"
                    >
                      Schedule Post
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAction(active._id, "rejected", true);
                      }}
                      disabled={isProcessing}
                      className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-400 to-pink-500 text-black font-semibold shadow hover:shadow-[0_0_25px_#ff6b8a50]"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}