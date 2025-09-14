"use client";

import { motion } from "framer-motion";
import { FaInstagram, FaFacebook, FaLinkedin } from "react-icons/fa";

export default function LandingPage() {
  return (
    <div className="bg-[#0f111a] text-white min-h-screen font-sans">
      
      {/* Header */}
      <header className="fixed top-0 w-full flex justify-between items-center p-6 bg-black/50 backdrop-blur-md z-50">
        <div className="text-2xl font-bold text-green-400">SocialManager</div>
        <nav className="space-x-6">
          <a href="#features" className="hover:text-green-400 transition">Features</a>
          <a href="#how" className="hover:text-green-400 transition">How It Works</a>
          <a href="/auth/signin" className="bg-green-400 text-black px-4 py-2 rounded-lg hover:scale-105 transition">Sign In</a>
          <a href="/auth/signup" className="border border-green-400 px-4 py-2 rounded-lg hover:bg-green-400 hover:text-black transition">Sign Up</a>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center h-screen px-4 relative">
        <motion.h1
          className="text-5xl md:text-6xl font-orbitron mb-6 text-green-400"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Automate Your Social Media Like a Pro
        </motion.h1>
        <motion.p
          className="text-lg md:text-xl max-w-2xl mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          Connect your accounts, choose a topic, and let automation handle the rest. Fast, easy, and futuristic.
        </motion.p>
        <motion.div className="space-x-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
          <a href="/auth/signup" className="bg-green-400 text-black px-6 py-3 rounded-lg font-semibold hover:scale-105 transition">Sign Up</a>
          <a href="#features" className="border border-green-400 px-6 py-3 rounded-lg hover:bg-green-400 hover:text-black transition">Learn More</a>
        </motion.div>
        {/* Optional animated tech lines or particles */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          {/* Add custom animated divs or SVG lines for futuristic vibe */}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 md:px-20 bg-[#0b0c12]">
        <h2 className="text-4xl font-orbitron text-green-400 mb-12 text-center">Features</h2>
        <div className="grid md:grid-cols-4 gap-8 text-center">
          <div className="p-6 bg-black/40 rounded-xl backdrop-blur-md hover:scale-105 transition">
            <FaInstagram className="text-3xl mx-auto mb-4 text-green-400" />
            <h3 className="text-xl font-semibold mb-2">Instagram Automation</h3>
            <p>Schedule and post automatically to Instagram with ease.</p>
          </div>
          <div className="p-6 bg-black/40 rounded-xl backdrop-blur-md hover:scale-105 transition">
            <FaFacebook className="text-3xl mx-auto mb-4 text-green-400" />
            <h3 className="text-xl font-semibold mb-2">Facebook Integration</h3>
            <p>Seamlessly manage and post to your Facebook accounts.</p>
          </div>
          <div className="p-6 bg-black/40 rounded-xl backdrop-blur-md hover:scale-105 transition">
            <FaLinkedin className="text-3xl mx-auto mb-4 text-green-400" />
            <h3 className="text-xl font-semibold mb-2">LinkedIn Posting</h3>
            <p>Professional posts scheduled automatically to LinkedIn.</p>
          </div>
          <div className="p-6 bg-black/40 rounded-xl backdrop-blur-md hover:scale-105 transition">
            <h3 className="text-xl font-semibold mb-2">Credit System</h3>
            <p>Use credits to create posts and manage costs efficiently.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/50 backdrop-blur-md py-6 mt-12 text-center">
        <p className="text-green-400">© 2025 SocialManager. All rights reserved.</p>
        <p className="text-sm text-gray-400 mt-2">
          <a href="https://github.com/your-username/social-media-manager-n8n" className="hover:text-green-400 transition">GitHub Repo</a>
        </p>
      </footer>
    </div>
  );
}