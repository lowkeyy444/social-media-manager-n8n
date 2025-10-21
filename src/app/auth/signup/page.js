
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      // ✅ Check if response is JSON
      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (err) {
        console.error("Non-JSON response:", text);
        setError("Unexpected response from server");
        setLoading(false);
        return;
      }

      if (!res.ok) {
        setError(data.error || "Signup failed");
        setLoading(false);
        return;
      }

      // ✅ Save token + user info
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      router.push("/dashboard");
    } catch (err) {
      console.error("Signup request error:", err);
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f111a] px-4 font-orbitron">
      <motion.div
        className="bg-[rgba(15,17,26,0.85)] backdrop-blur-md rounded-3xl shadow-xl w-full max-w-md p-10 border border-green-600"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-4xl font-bold text-green-400 mb-6 text-center tracking-wide">
          Create an Account
        </h2>

        {error && (
          <p className="text-red-500 text-center mb-4 font-medium">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-green-400 mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              required
              className="w-full p-3 rounded-lg bg-[#1a1c2b] text-white placeholder-green-200 focus:ring-2 focus:ring-green-400 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-green-400 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com"
              required
              className="w-full p-3 rounded-lg bg-[#1a1c2b] text-white placeholder-green-200 focus:ring-2 focus:ring-green-400 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-green-400 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              required
              className="w-full p-3 rounded-lg bg-[#1a1c2b] text-white placeholder-green-200 focus:ring-2 focus:ring-green-400 outline-none transition-all"
            />
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold text-black shadow-lg transition-all ${
              loading
                ? "bg-green-300 cursor-not-allowed"
                : "bg-gradient-to-r from-green-500 to-green-400 hover:from-green-600 hover:to-green-500"
            }`}
            whileHover={{ scale: loading ? 1 : 1.03 }}
            whileTap={{ scale: loading ? 1 : 0.97 }}
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </motion.button>
        </form>

        <p className="text-green-200 mt-6 text-center">
          Already have an account?{" "}
          <a
            href="/auth/signin"
            className="text-green-400 font-medium hover:underline"
          >
            Sign In
          </a>
        </p>
      </motion.div>
    </div>
  );
}

// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { motion } from "framer-motion";

// export default function SignupPage() {
//   const router = useRouter();
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       // 1️⃣ Create user via signup API
//       const res = await fetch("/api/auth/signup", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ name, email, password }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         setError(data.error || "Signup failed");
//         setLoading(false);
//         return;
//       }

//       // 2️⃣ Automatically login via JWT login endpoint
//       const loginRes = await fetch("/api/auth/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, password }),
//       });

//       const loginData = await loginRes.json();

//       if (!loginRes.ok) {
//         setError(loginData.error || "Login failed after signup");
//         setLoading(false);
//         return;
//       }

//       // 3️⃣ Store token in localStorage for future API requests
//       localStorage.setItem("token", loginData.token);
//       // optional: store user info too
//       localStorage.setItem("user", JSON.stringify(loginData.user));

//       // 4️⃣ Redirect to dashboard
//       router.push("/dashboard");
//     } catch (err) {
//       console.error(err);
//       setError("Something went wrong. Try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-[#0f111a] px-4 font-orbitron">
//       <motion.div
//         className="bg-[rgba(15,17,26,0.85)] backdrop-blur-md rounded-3xl shadow-xl w-full max-w-md p-10 border border-green-600"
//         initial={{ opacity: 0, y: 50 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.8 }}
//       >
//         <h2 className="text-4xl font-bold text-green-400 mb-6 text-center tracking-wide">
//           Create an Account
//         </h2>

//         {error && (
//           <p className="text-red-500 text-center mb-4 font-medium">{error}</p>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-5">
//           <div>
//             <label className="block text-green-400 mb-2">Name</label>
//             <input
//               type="text"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               placeholder="John Doe"
//               className="w-full p-3 rounded-lg bg-[#1a1c2b] text-white placeholder-green-200 focus:ring-2 focus:ring-green-400 outline-none transition-all"
//               required
//             />
//           </div>

//           <div>
//             <label className="block text-green-400 mb-2">Email</label>
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               placeholder="john@example.com"
//               className="w-full p-3 rounded-lg bg-[#1a1c2b] text-white placeholder-green-200 focus:ring-2 focus:ring-green-400 outline-none transition-all"
//               required
//             />
//           </div>

//           <div>
//             <label className="block text-green-400 mb-2">Password</label>
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               placeholder="********"
//               className="w-full p-3 rounded-lg bg-[#1a1c2b] text-white placeholder-green-200 focus:ring-2 focus:ring-green-400 outline-none transition-all"
//               required
//             />
//           </div>

//           <motion.button
//             type="submit"
//             disabled={loading}
//             className={`w-full py-3 rounded-lg font-semibold text-black shadow-lg transition-all ${
//               loading
//                 ? "bg-green-300 cursor-not-allowed"
//                 : "bg-gradient-to-r from-green-500 to-green-400 hover:from-green-600 hover:to-green-500"
//             }`}
//             whileHover={{ scale: loading ? 1 : 1.03 }}
//             whileTap={{ scale: loading ? 1 : 0.97 }}
//           >
//             {loading ? "Creating Account..." : "Sign Up"}
//           </motion.button>
//         </form>

//         <p className="text-green-200 mt-6 text-center">
//           Already have an account?{" "}
//           <a
//             href="/auth/signin"
//             className="text-green-400 font-medium hover:underline"
//           >
//             Sign In
//           </a>
//         </p>
//       </motion.div>
//     </div>
//   );
// }