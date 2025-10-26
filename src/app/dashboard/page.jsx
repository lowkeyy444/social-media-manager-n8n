"use client";

import { FaLinkedin, FaInstagram, FaLightbulb, FaRobot, FaCheck, FaPaperPlane } from "react-icons/fa";
import { motion } from "framer-motion";

export default function DashboardPage() {
  const steps = [
    {
      icon: <FaLightbulb className="text-4xl text-cyan-400" />,
      title: "Choose Topic & Platform",
      desc: "Select your desired social media platform and content topic to start creating posts.",
    },
    {
      icon: <FaRobot className="text-4xl text-pink-400" />,
      title: "AI Content Generation",
      desc: "Our advanced n8n automation generates engaging AI-powered content tailored for each platform.",
    },
    {
      icon: <FaCheck className="text-4xl text-yellow-400" />,
      title: "Review & Approve",
      desc: "Review generated posts, make edits if needed, and approve them for publishing.",
    },
    {
      icon: <FaPaperPlane className="text-4xl text-green-400" />,
      title: "Auto Publish",
      desc: "Approved posts are automatically published at the optimal time to maximize engagement.",
    },
  ];

  const tutorials = [
    {
      icon: <FaLinkedin className="text-4xl text-blue-400" />,
      title: "LinkedIn API Setup",
      desc: (
        <>
          Create an app in LinkedIn Developer Portal and get your API credentials.{" "}
          <a
            href="https://developer.linkedin.com/product-catalog"
            target="_blank"
            className="text-cyan-400 hover:underline"
          >
            Learn More
          </a>
        </>
      ),
    },
    {
      icon: <FaInstagram className="text-4xl text-pink-400" />,
      title: "Instagram API Setup",
      desc: (
        <>
          Set up a Facebook App to access Instagram Graph API for posting and analytics.{" "}
          <a
            href="https://developers.facebook.com/docs/instagram-api"
            target="_blank"
            className="text-pink-400 hover:underline"
          >
            Learn More
          </a>
        </>
      ),
    },
  ];

  return (
    <div className="space-y-12">
      {/* Dashboard Header */}
      <div>
        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
          Welcome to SocialManager
        </h2>
        <p className="text-gray-300 mt-2">
          Your all-in-one AI-powered social media manager. Generate posts, review, and auto-publish efficiently.
        </p>
      </div>

      {/* How SocialManager Works */}
      <div>
        <h3 className="text-2xl font-bold text-white mb-8">How SocialManager Works</h3>
        <div className="grid md:grid-cols-4 gap-6">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              className="flex flex-col items-center text-center p-6 rounded-2xl bg-[rgba(15,17,26,0.7)] backdrop-blur-md border border-white/10 shadow-md hover:shadow-lg transition transform hover:scale-105"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
            >
              {step.icon}
              <h4 className="text-xl font-semibold text-white mt-3 mb-1">{step.title}</h4>
              <p className="text-gray-300 text-sm">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* API Setup Tutorials */}
      <div>
        <h3 className="text-2xl font-bold text-white mb-6">Quick API Setup Guide</h3>
        <div className="grid md:grid-cols-2 gap-6">
          {tutorials.map((tut, idx) => (
            <motion.div
              key={idx}
              className="flex flex-col items-center text-center p-6 rounded-2xl bg-[rgba(15,17,26,0.7)] backdrop-blur-md border border-white/10 shadow-md hover:shadow-lg transition transform hover:scale-105"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
            >
              {tut.icon}
              <h4 className="text-xl font-semibold text-white mt-3 mb-1">{tut.title}</h4>
              <p className="text-gray-300 text-sm">{tut.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}