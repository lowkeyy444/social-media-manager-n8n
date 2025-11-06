"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";

export default function PostHistoryPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Unauthorized");
          setLoading(false);
          return;
        }

        const res = await axios.get("/api/dashboard/posthistory", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setPosts(res.data);
        setLoading(false);
      } catch (err) {
        console.error("❌ Error fetching post history:", err);
        setError("Failed to load history");
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const getPlatformIcon = (platform) => {
    switch (platform?.toLowerCase()) {
      case "instagram":
        return <FaInstagram className="text-pink-500 text-2xl" />;
      case "facebook":
        return <FaFacebook className="text-blue-500 text-2xl" />;
      case "linkedin":
        return <FaLinkedin className="text-sky-500 text-2xl" />;
      default:
        return null;
    }
  };

  const getDriveImageUrl = (url) => {
    if (!url) return "";
    if (url.includes("drive.google.com")) {
      const match = url.match(/\/d\/(.*?)\//);
      if (match && match[1]) return `https://drive.google.com/uc?export=view&id=${match[1]}`;
      const idMatch = url.match(/id=([a-zA-Z0-9_-]+)/);
      if (idMatch && idMatch[1]) return `https://drive.google.com/uc?export=view&id=${idMatch[1]}`;
    }
    return url;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh] text-cyan-400 text-xl">
        Loading your post history...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-[70vh] text-red-500 text-xl">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-6 md:px-12 text-white">
      <motion.h1
        className="text-4xl font-extrabold text-center mb-10 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Posted History
      </motion.h1>

      <AnimatePresence>
        {posts.length === 0 ? (
          <motion.p
            className="text-center text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            No posts have been published yet.
          </motion.p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <motion.div
                key={post._id}
                className="p-6 bg-[rgba(15,17,26,0.85)] border border-green-400/10 rounded-3xl shadow-lg hover:shadow-[0_0_30px_#00ff9a30] backdrop-blur-md transition-all"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    {getPlatformIcon(post.platform)}
                    <span className="capitalize font-semibold text-gray-200">
                      {post.platform}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <p className="text-gray-300 mb-3 line-clamp-4 whitespace-pre-line">
                  {post.postText}
                </p>

                {post.imageUrl && (
                  <img
                    src={getDriveImageUrl(post.imageUrl)}
                    alt="Post image"
                    className="rounded-xl border border-white/10 mt-2 w-full h-40 object-cover"
                  />
                )}

                <div className="mt-4 flex justify-between items-center">
                  <span className="text-sm text-green-400 font-semibold">
                    ✅ Posted Successfully
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(post.updatedAt).toLocaleTimeString()}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}