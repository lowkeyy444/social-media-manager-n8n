"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function GeneratePostPage() {
  const router = useRouter();
  const [platform, setPlatform] = useState("");
  const [topic, setTopic] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [customLogo, setCustomLogo] = useState("");
  const [postCount, setPostCount] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [accounts, setAccounts] = useState([]);
  const [filteredLogos, setFilteredLogos] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) router.push("/auth/signin");
    else fetchAccounts(token);
  }, [router]);

  // ✅ Fetch all social accounts to populate logo dropdown
  const fetchAccounts = async (token) => {
    try {
      const res = await axios.get("/api/dashboard/accounts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAccounts(res.data);
    } catch (err) {
      console.error("Error fetching accounts:", err);
    }
  };

  // ✅ Filter logos by selected platform
  useEffect(() => {
    if (!platform) return setFilteredLogos([]);
    const uniqueLogos = [
      ...new Set(
        accounts
          .filter((a) => a.platform === platform && a.logoUrl)
          .map((a) => a.logoUrl)
      ),
    ];
    setFilteredLogos(uniqueLogos);
  }, [platform, accounts]);

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

      const finalLogo = customLogo || logoUrl || "";

      const res = await axios.post(
        "/api/dashboard/generatepost",
        { platform, topic, logoUrl: finalLogo, postCount },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage(res.data.message || "✅ Post generation triggered!");
      setCustomLogo("");
      setLogoUrl("");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Error generating posts");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center py-12 px-4 md:px-8">
      <motion.div
        className="w-full max-w-3xl p-10 rounded-3xl bg-[rgba(15,17,26,0.85)] backdrop-blur-md border border-white/10 shadow-2xl hover:shadow-[0_0_50px_#00ffff20] transition-all"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mb-8 text-center">
          Generate Social Media Posts
        </h2>

        <form className="grid gap-6" onSubmit={handleSubmit}>
          {/* Platform */}
          <div className="flex flex-col">
            <label className="text-white font-medium mb-2">Platform</label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="p-4 rounded-xl bg-[#1a1c2b] text-white focus:ring-2 focus:ring-cyan-400 outline-none transition"
              required
            >
              <option value="">Select Platform</option>
              <option value="facebook">Facebook</option>
              <option value="instagram">Instagram</option>
              <option value="linkedin">LinkedIn</option>
              <option value="twitter">Twitter</option>
            </select>
          </div>

          {/* Topic */}
          <div className="flex flex-col">
            <label className="text-white font-medium mb-2">Topic</label>
            <select
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="p-4 rounded-xl bg-[#1a1c2b] text-white focus:ring-2 focus:ring-cyan-400 outline-none transition"
              required
            >
              <option value="">Select Topic</option>
              <option value="technology">Technology</option>
              <option value="fashion">Fashion</option>
              <option value="legal">Legal</option>
              <option value="tax">Tax</option>
              <option value="finance">Finance</option>
            </select>
          </div>

          {/* ✅ Logo selection and manual entry */}
          <div className="flex flex-col">
            <label className="text-white font-medium mb-2">
              Select or Enter Logo URL
            </label>
            <div className="flex items-center space-x-3">
              <select
                value={logoUrl}
                onChange={(e) => {
                  setLogoUrl(e.target.value);
                  setCustomLogo("");
                }}
                className="flex-1 p-4 rounded-xl bg-[#1a1c2b] text-white focus:ring-2 focus:ring-cyan-400 outline-none transition truncate"
              >
                <option value="">Select from added logos</option>
                {filteredLogos.map((url) => {
                  const short =
                    url.length > 45
                      ? `${url.slice(0, 25)}...${url.slice(-10)}`
                      : url;
                  return (
                    <option key={url} value={url}>
                      {short}
                    </option>
                  );
                })}
              </select>

              {(logoUrl || customLogo) && (
                <img
                  src={customLogo || logoUrl}
                  alt="Preview"
                  className="w-10 h-10 rounded-lg border border-cyan-400/10"
                />
              )}
            </div>

            {/* Manual input */}
            <input
              type="text"
              placeholder="Or paste a custom logo URL"
              value={customLogo}
              onChange={(e) => {
                setCustomLogo(e.target.value);
                setLogoUrl("");
              }}
              className="mt-3 p-4 rounded-xl bg-[#1a1c2b] text-white focus:ring-2 focus:ring-cyan-400 outline-none transition"
            />
          </div>

          {/* Number of Posts */}
          <div className="flex flex-col">
            <label className="text-white font-medium mb-2">Number of Posts</label>
            <input
              type="number"
              value={postCount}
              onChange={(e) => setPostCount(e.target.value)}
              min={1}
              max={10}
              className="p-4 rounded-xl bg-[#1a1c2b] text-white focus:ring-2 focus:ring-cyan-400 outline-none transition"
              required
            />
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-semibold shadow-lg hover:shadow-[0_0_25px_#00ffff60] transition-all"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            {loading ? "Generating..." : "Generate Posts"}
          </motion.button>
        </form>

        {/* Messages */}
        {message && (
          <div className="mt-6 p-4 rounded-xl bg-[rgba(0,255,255,0.05)] border border-cyan-400 text-cyan-400">
            {message}
          </div>
        )}
        {error && (
          <div className="mt-6 p-4 rounded-xl bg-[rgba(255,0,0,0.05)] border border-red-500 text-red-500">
            {error}
          </div>
        )}
      </motion.div>
    </div>
  );
}
// "use client";

// import { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import { useRouter } from "next/navigation";
// import axios from "axios";

// export default function GeneratePostPage() {
//   const router = useRouter();
//   const [platform, setPlatform] = useState("");
//   const [topic, setTopic] = useState("");
//   const [apiKey, setApiKey] = useState("");
//   const [logoUrl, setLogoUrl] = useState("");
//   const [postCount, setPostCount] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");

//   // Redirect to signin if no token
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) router.push("/auth/signin");
//   }, [router]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");
//     setMessage("");

//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         setError("Unauthorized. Please login.");
//         setLoading(false);
//         return;
//       }

//       const res = await axios.post(
//         "/api/dashboard/generatepost",
//         { platform, topic, apiKey, logoUrl, postCount },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       setMessage(res.data.message || "✅ Post generation triggered!");
//       setLoading(false);

//     } catch (err) {
//       console.error(err);
//       setError(err.response?.data?.error || "Error generating posts");
//       setLoading(false);
//     }
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

//           {/* Logo URL */}
//           <label className="text-green-400 font-medium">Logo URL</label>
//           <input
//             type="text"
//             value={logoUrl}
//             onChange={(e) => setLogoUrl(e.target.value)}
//             placeholder="Logo URL"
//             className="p-3 rounded-lg bg-[#1a1c2b] text-white focus:ring-2 focus:ring-green-400 outline-none"
//           />

//           {/* Number of Posts */}
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

//       {/* Messages */}
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
