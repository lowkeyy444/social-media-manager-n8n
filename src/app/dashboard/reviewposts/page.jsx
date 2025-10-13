"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

export default function ReviewPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/api/dashboard/reviewpost", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPosts(res.data);
      } catch (err) {
        console.error("Error fetching posts:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const handleAction = async (id, status) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.patch(
        "/api/dashboard/reviewpost",
        { postId: id, status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPosts((prev) => prev.map((p) => (p._id === id ? res.data : p)));
    } catch (err) {
      console.error(`Error ${status} post:`, err);
    }
  };

  if (loading) return <p className="text-center text-gray-400 mt-10">Loading posts...</p>;

  return (
    <div className="p-6 flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-green-400">Review Generated Posts</h1>

      {posts.length === 0 ? (
        <p className="text-gray-400">No posts found.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <motion.div
              key={post._id}
              className="bg-[rgba(15,17,26,0.85)] backdrop-blur-md rounded-3xl p-5 shadow-lg border border-green-600 flex flex-col justify-between"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {post.image_url && (
                <img
                  src={post.image_url}
                  alt="Post"
                  className="rounded-xl mb-3 w-full h-40 object-cover"
                />
              )}
              <p className="text-gray-300 text-sm mb-4 whitespace-pre-line">{post.postText}</p>

              <div className="flex justify-between items-center">
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    post.status === "approved"
                      ? "bg-green-500 text-black"
                      : post.status === "rejected"
                      ? "bg-red-500 text-black"
                      : "bg-yellow-500 text-black"
                  }`}
                >
                  {post.status}
                </span>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleAction(post._id, "approved")}
                    className="bg-green-500 hover:bg-green-600 text-black px-3 py-1 rounded-lg text-sm"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleAction(post._id, "rejected")}
                    className="bg-red-500 hover:bg-red-600 text-black px-3 py-1 rounded-lg text-sm"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}