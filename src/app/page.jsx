// "use client";

// import { motion } from "framer-motion";
// import { FaInstagram, FaFacebook, FaLinkedin } from "react-icons/fa";
// import Lottie from "react-lottie-player";
// import aiAnimation from "/public/ai-animation.json";

// export default function LandingPage() {
//   const navItems = ["Product", "About", "Blog", "Contact"];
//   const features = [
//     {
//       icon: <FaInstagram className="text-4xl mb-4 text-cyan-400 mx-auto" />,
//       title: "Instagram Automation",
//       desc: "Auto-schedule posts and manage reels with AI-powered precision.",
//     },
//     {
//       icon: <FaFacebook className="text-4xl mb-4 text-cyan-400 mx-auto" />,
//       title: "Facebook Integration",
//       desc: "Post across pages, track performance, and grow community effortlessly.",
//     },
//     {
//       icon: <FaLinkedin className="text-4xl mb-4 text-cyan-400 mx-auto" />,
//       title: "LinkedIn Posting",
//       desc: "Create professional posts automatically tailored for your audience.",
//     },
//   ];

//   return (
//     <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#0B0B1F] via-[#1A1446] to-[#2A0C6C] text-white font-sans">

//       {/* Navbar */}
//       <header className="fixed top-0 w-full z-50 border-b border-white/10 backdrop-blur-xl bg-white/5">
//         <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
//           <motion.h1
//             initial={{ opacity: 0, y: -10 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6 }}
//             className="text-3xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400"
//           >
//             SocialManager
//           </motion.h1>

//           <nav className="hidden md:flex items-center gap-8 text-sm text-gray-300">
//             {navItems.map((item) => (
//               <motion.a
//                 key={item}
//                 href={`#${item.toLowerCase()}`}
//                 whileHover={{ scale: 1.05 }}
//                 className="hover:text-cyan-400 transition"
//                 aria-label={item}
//               >
//                 {item}
//               </motion.a>
//             ))}
//           </nav>

//           <div className="flex items-center gap-3">
//             <a
//               href="/auth/signin"
//               className="px-4 py-2 text-sm rounded-xl border border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black font-semibold transition"
//             >
//               Sign In
//             </a>
//             <a
//               href="/auth/signup"
//               className="px-4 py-2 text-sm rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-semibold hover:shadow-[0_0_25px_#00ffff90] transition"
//             >
//               Get Started
//             </a>
//           </div>
//         </div>
//       </header>

//       {/* Hero Section */}
//       <section className="relative flex flex-col md:flex-row items-center justify-center h-screen px-6 md:px-20 text-center md:text-left overflow-hidden">

//         {/* Left Text Column */}
//         <div className="flex-1 z-10">
//           <motion.h1
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 1 }}
//             className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-snug text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-blue-400 tracking-wide uppercase"
//           >
//             Automate Your Social Media Like a Pro
//           </motion.h1>

//           <motion.p
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 0.3, duration: 1 }}
//             className="mt-6 text-base md:text-lg max-w-xl text-gray-300"
//           >
//             Simplify content creation with AI. Schedule, post, and grow your presence seamlessly — all from one place.
//           </motion.p>

//           <motion.div
//             className="mt-8 flex flex-col md:flex-row gap-4 justify-center md:justify-start"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 0.6 }}
//           >
//             <a
//               href="/auth/signup"
//               className="px-8 py-3 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-semibold hover:shadow-[0_0_30px_#00ffff90] hover:scale-105 transition"
//             >
//               Get Started
//             </a>
//             <a
//               href="#features"
//               className="px-8 py-3 rounded-full border border-cyan-400 text-cyan-400 font-semibold hover:bg-cyan-400 hover:text-black hover:shadow-[0_0_30px_#00ffff80] transition"
//             >
//               Learn More
//             </a>
//           </motion.div>
//         </div>

//         {/* Right Lottie Column */}
//         <div className="flex-1 mt-10 md:mt-0 z-0 relative">
//           <Lottie
//             loop
//             animationData={aiAnimation}
//             play
//             style={{ width: "100%", maxWidth: 450, margin: "0 auto" }}
//           />

//           {/* Enhanced central depth circle */}
//           <motion.div
//             className="absolute inset-1/4 w-80 h-80 md:w-[28rem] md:h-[28rem] rounded-full bg-cyan-500/20 blur-3xl"
//             animate={{
//               scale: [1, 1.1, 1],
//               opacity: [0.5, 0.8, 0.5],
//               y: [0, -15, 0],
//             }}
//             transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
//           />
//         </div>

//       </section>

//       {/* Features Section */}
//       <section
//         id="features"
//         className="py-28 px-6 md:px-20 relative bg-white/5 backdrop-blur-md border-t border-white/10"
//       >
//         <motion.h2
//           initial={{ opacity: 0, y: 30 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.7 }}
//           viewport={{ once: true }}
//           className="text-4xl md:text-5xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-400 mb-16"
//         >
//           Key Features
//         </motion.h2>

//         <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
//           {features.map((f, i) => (
//             <motion.div
//               key={i}
//               whileHover={{ scale: 1.05, y: -8 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               initial={{ opacity: 0, y: 40 }}
//               transition={{ duration: 0.5, delay: i * 0.15 }}
//               viewport={{ once: true }}
//               className="p-8 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 hover:shadow-[0_0_25px_#00ffff60] backdrop-blur-lg transition"
//             >
//               {f.icon}
//               <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
//               <p className="text-gray-300 text-sm">{f.desc}</p>
//             </motion.div>
//           ))}
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="py-10 bg-white/5 border-t border-white/10 text-center relative">
//         <div className="h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent mb-6 animate-pulse" />
//         <p className="text-cyan-400 font-medium">© 2025 SocialManager. All rights reserved.</p>
//         <p className="text-sm text-gray-400 mt-2">
//           Built for the next generation of creators.
//         </p>
//       </footer>
//     </div>
//   );
// }

"use client";

import { motion } from "framer-motion";
import { FaInstagram, FaFacebook, FaLinkedin } from "react-icons/fa";
import Lottie from "react-lottie-player";
import aiAnimation from "/public/ai-animation.json";

export default function LandingPage() {
  const features = [
    {
      icon: <FaInstagram className="text-4xl mb-4 text-cyan-400 mx-auto" />,
      title: "Instagram Automation",
      desc: "Auto-schedule posts and manage reels with AI-powered precision.",
    },
    {
      icon: <FaFacebook className="text-4xl mb-4 text-cyan-400 mx-auto" />,
      title: "Facebook Integration",
      desc: "Post across pages, track performance, and grow community effortlessly.",
    },
    {
      icon: <FaLinkedin className="text-4xl mb-4 text-cyan-400 mx-auto" />,
      title: "LinkedIn Posting",
      desc: "Create professional posts automatically tailored for your audience.",
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#0B0B1F] via-[#1A1446] to-[#2A0C6C] text-white font-sans">

      {/* Navbar */}
      <header className="fixed top-0 w-full z-50 border-b border-white/10 backdrop-blur-xl bg-white/5">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400"
          >
            SocialManager
          </motion.h1>

          <div className="flex items-center gap-3">
            <a
              href="/auth/signin"
              className="px-4 py-2 text-sm rounded-xl border border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black font-semibold transition"
            >
              Sign In
            </a>
            <a
              href="/auth/signup"
              className="px-4 py-2 text-sm rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-semibold hover:shadow-[0_0_25px_#00ffff90] transition"
            >
              Get Started
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative flex flex-col md:flex-row items-center justify-center h-screen px-6 md:px-20 overflow-hidden">

        {/* Left Text */}
        <div className="flex-1 z-10 text-center md:text-left">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-snug text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-blue-400 tracking-wide uppercase"
          >
            Automate Your Social Media Like a Pro
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="mt-6 text-base md:text-lg max-w-xl text-gray-300 mx-auto md:mx-0"
          >
            Simplify content creation with AI. Schedule, post, and grow your presence seamlessly — all from one place.
          </motion.p>

          <motion.div
            className="mt-8 flex flex-col md:flex-row gap-4 justify-center md:justify-start"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <a
              href="/auth/signup"
              className="px-8 py-3 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-semibold hover:shadow-[0_0_30px_#00ffff90] hover:scale-105 transition"
            >
              Get Started
            </a>
            <a
              href="#features"
              className="px-8 py-3 rounded-full border border-cyan-400 text-cyan-400 font-semibold hover:bg-cyan-400 hover:text-black hover:shadow-[0_0_30px_#00ffff80] transition"
            >
              Learn More
            </a>
          </motion.div>
        </div>

        {/* Right Lottie with Depth */}
        <div className="flex-1 mt-10 md:mt-0 z-0 relative">
          {/* Depth Background Circles */}
          <motion.div
            className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-cyan-500/15 blur-3xl"
            animate={{ scale: [1, 1.05, 1], rotate: [0, 10, 0], opacity: [0.4, 0.7, 0.4], y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-1/3 right-1/4 w-60 h-60 rounded-full bg-fuchsia-500/15 blur-2xl"
            animate={{ scale: [1, 1.08, 1], rotate: [0, -8, 0], opacity: [0.3, 0.6, 0.3], y: [0, 12, 0] }}
            transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-1/4 left-1/3 w-80 h-80 rounded-full bg-blue-500/15 blur-3xl"
            animate={{ scale: [1, 1.06, 1], rotate: [0, 12, 0], opacity: [0.35, 0.65, 0.35], y: [0, -15, 0] }}
            transition={{ repeat: Infinity, duration: 9, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-1/2 right-1/2 w-64 h-64 rounded-full bg-purple-500/10 blur-2xl"
            animate={{ scale: [1, 1.04, 1], rotate: [0, -6, 0], opacity: [0.25, 0.55, 0.25], y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
          />

          <Lottie
            loop
            animationData={aiAnimation}
            play
            style={{ width: "100%", maxWidth: 450, margin: "0 auto", zIndex: 10 }}
          />
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="py-28 px-6 md:px-20 relative bg-white/5 backdrop-blur-md border-t border-white/10"
      >
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-400 mb-16"
        >
          Key Features
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {features.map((f, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05, y: -8 }}
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 40 }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              viewport={{ once: true }}
              className="p-8 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 hover:shadow-[0_0_25px_#00ffff60] backdrop-blur-lg transition"
            >
              {f.icon}
              <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
              <p className="text-gray-300 text-sm">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 bg-white/5 border-t border-white/10 text-center relative">
        <div className="h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent mb-6 animate-pulse" />
        <p className="text-cyan-400 font-medium">© 2025 SocialManager. All rights reserved.</p>
        <p className="text-sm text-gray-400 mt-2">
          Built for the next generation of creators.
        </p>
      </footer>
    </div>
  );
}