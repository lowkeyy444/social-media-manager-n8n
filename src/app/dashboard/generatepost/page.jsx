// "use client";

// import { useState } from "react";
// import { motion } from "framer-motion";

// export default function GeneratePostPage() {
//   const [platform, setPlatform] = useState("");
//   const [topic, setTopic] = useState("");
//   const [apiKey, setApiKey] = useState("");
//   const [logoUrl, setLogoUrl] = useState("");
//   const [postCount, setPostCount] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");
//     setMessage("");

//     try {
//       const res = await fetch("/api/dashboard/generatepost", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ platform, topic, apiKey, logoUrl, postCount }),
//       });

//       const data = await res.json();

//       if (res.ok) {
//         setMessage("Post(s) generated successfully! Check Review Posts to approve.");
//       } else {
//         setError(data.error || "Something went wrong");
//       }
//     } catch (err) {
//       console.error(err);
//       setError("Error generating posts");
//     }

//     setLoading(false);
//   };

//   return (
//     <div className="flex flex-col gap-6">
//       <h2 className="text-2xl font-bold text-green-400">Generate Posts</h2>

//       <motion.div
//         className="bg-[rgba(15,17,26,0.85)] backdrop-blur-md rounded-3xl p-6 shadow-lg border border-green-600"
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//       >
//         <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
//           {/* Platform */}
//           <label className="text-green-400 font-medium">Platform</label>
//           <select
//             value={platform}
//             onChange={(e) => setPlatform(e.target.value)}
//             className="p-3 rounded-lg bg-[#1a1c2b] text-white focus:ring-2 focus:ring-green-400 outline-none"
//             required
//           >
//             <option value="">Select Platform</option>
//             <option value="facebook">Facebook</option>
//             <option value="instagram">Instagram</option>
//             <option value="linkedin">LinkedIn</option>
//             <option value="twitter">Twitter</option>
//           </select>

//           {/* Topic */}
//           <label className="text-green-400 font-medium">Topic</label>
//           <select
//             value={topic}
//             onChange={(e) => setTopic(e.target.value)}
//             className="p-3 rounded-lg bg-[#1a1c2b] text-white focus:ring-2 focus:ring-green-400 outline-none"
//             required
//           >
//             <option value="">Select Topic</option>
//             <option value="technology">Technology</option>
//             <option value="fashion">Fashion</option>
//             <option value="legal">Legal</option>
//             <option value="tax">Tax</option>
//             <option value="finance">Finance</option>
//             <option value="custom">Custom</option>
//             <option value="rss">RSS Feed</option>
//           </select>

//           {/* API Key */}
//           <label className="text-green-400 font-medium">API Key</label>
//           <input
//             type="text"
//             value={apiKey}
//             onChange={(e) => setApiKey(e.target.value)}
//             placeholder="Enter your API Key"
//             className="p-3 rounded-lg bg-[#1a1c2b] text-white focus:ring-2 focus:ring-green-400 outline-none"
//           />

//           {/* Logo */}
//           <label className="text-green-400 font-medium">Logo URL</label>
//           <input
//             type="text"
//             value={logoUrl}
//             onChange={(e) => setLogoUrl(e.target.value)}
//             placeholder="Logo URL"
//             className="p-3 rounded-lg bg-[#1a1c2b] text-white focus:ring-2 focus:ring-green-400 outline-none"
//           />

//           {/* Post Count */}
//           <label className="text-green-400 font-medium">Number of Posts</label>
//           <input
//             type="number"
//             value={postCount}
//             onChange={(e) => setPostCount(e.target.value)}
//             min={1}
//             max={10}
//             className="p-3 rounded-lg bg-[#1a1c2b] text-white focus:ring-2 focus:ring-green-400 outline-none"
//             required
//           />

//           <motion.button
//             type="submit"
//             className="bg-gradient-to-r from-green-500 to-green-400 text-black font-semibold py-3 rounded-lg hover:from-green-600 hover:to-green-500 transition-all"
//             whileHover={{ scale: 1.03 }}
//             whileTap={{ scale: 0.97 }}
//           >
//             {loading ? "Generating..." : "Generate Posts"}
//           </motion.button>
//         </form>
//       </motion.div>

//       {/* Success/Error Messages */}
//       {message && (
//         <div className="bg-[#1a1c2b] p-4 rounded-xl border border-green-600 text-green-400">
//           {message}
//         </div>
//       )}
//       {error && (
//         <div className="bg-[#1a1c2b] p-4 rounded-xl border border-red-600 text-red-500">
//           {error}
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function GeneratePostPage() {
  const router = useRouter();
  const [platform, setPlatform] = useState("");
  const [topic, setTopic] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [postCount, setPostCount] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Redirect to signin if no token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) router.push("/auth/signin");
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Unauthorized. Please login.");
        setLoading(false);
        return;
      }

      const res = await fetch("/api/dashboard/generatepost", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ platform, topic, apiKey, logoUrl, postCount }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Post(s) generated successfully! Check Review Posts to approve.");
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
      setError("Error generating posts");
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-bold text-green-400">Generate Posts</h2>

      <motion.div
        className="bg-[rgba(15,17,26,0.85)] backdrop-blur-md rounded-3xl p-6 shadow-lg border border-green-600"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <label className="text-green-400 font-medium">Platform</label>
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="p-3 rounded-lg bg-[#1a1c2b] text-white focus:ring-2 focus:ring-green-400 outline-none"
            required
          >
            <option value="">Select Platform</option>
            <option value="facebook">Facebook</option>
            <option value="instagram">Instagram</option>
            <option value="linkedin">LinkedIn</option>
            <option value="twitter">Twitter</option>
          </select>

          <label className="text-green-400 font-medium">Topic</label>
          <select
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="p-3 rounded-lg bg-[#1a1c2b] text-white focus:ring-2 focus:ring-green-400 outline-none"
            required
          >
            <option value="">Select Topic</option>
            <option value="technology">Technology</option>
            <option value="fashion">Fashion</option>
            <option value="legal">Legal</option>
            <option value="tax">Tax</option>
            <option value="finance">Finance</option>
            <option value="custom">Custom</option>
            <option value="rss">RSS Feed</option>
          </select>

          <label className="text-green-400 font-medium">API Key</label>
          <input
            type="text"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your API Key"
            className="p-3 rounded-lg bg-[#1a1c2b] text-white focus:ring-2 focus:ring-green-400 outline-none"
          />

          <label className="text-green-400 font-medium">Logo URL</label>
          <input
            type="text"
            value={logoUrl}
            onChange={(e) => setLogoUrl(e.target.value)}
            placeholder="Logo URL"
            className="p-3 rounded-lg bg-[#1a1c2b] text-white focus:ring-2 focus:ring-green-400 outline-none"
          />

          <label className="text-green-400 font-medium">Number of Posts</label>
          <input
            type="number"
            value={postCount}
            onChange={(e) => setPostCount(e.target.value)}
            min={1}
            max={10}
            className="p-3 rounded-lg bg-[#1a1c2b] text-white focus:ring-2 focus:ring-green-400 outline-none"
            required
          />

          <motion.button
            type="submit"
            className="bg-gradient-to-r from-green-500 to-green-400 text-black font-semibold py-3 rounded-lg hover:from-green-600 hover:to-green-500 transition-all"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            {loading ? "Generating..." : "Generate Posts"}
          </motion.button>
        </form>
      </motion.div>

      {message && (
        <div className="bg-[#1a1c2b] p-4 rounded-xl border border-green-600 text-green-400">
          {message}
        </div>
      )}
      {error && (
        <div className="bg-[#1a1c2b] p-4 rounded-xl border border-red-600 text-red-500">
          {error}
        </div>
      )}
    </div>
  );
}