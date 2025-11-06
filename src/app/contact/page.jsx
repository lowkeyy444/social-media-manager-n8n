"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [responseMsg, setResponseMsg] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponseMsg("");

    try {
        await axios.post(N8N_WEBHOOKS.NEXT_PUBLIC_N8N_CONTACT_URL, {
          Name: form.name,
          email: form.email,
          subject: form.subject,
          message: form.message,
        }
      );

      setResponseMsg("✅ Message sent successfully — please wait for our reply.");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      console.error("❌ Error submitting contact form:", err);
      setResponseMsg("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
      setTimeout(() => setResponseMsg(""), 4000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0b0b12] to-[#12141f] text-white p-6">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg p-8 bg-[rgba(20,22,35,0.9)] backdrop-blur-lg rounded-2xl border border-cyan-400/10 shadow-lg"
      >
        <h1 className="text-3xl font-extrabold text-center bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-6">
          Contact Us
        </h1>

        <div className="space-y-4">
          <div>
            <label className="text-cyan-300 text-sm block mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg bg-[#1a1c2b] text-white focus:ring-2 focus:ring-cyan-400 outline-none"
            />
          </div>

          <div>
            <label className="text-cyan-300 text-sm block mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg bg-[#1a1c2b] text-white focus:ring-2 focus:ring-cyan-400 outline-none"
            />
          </div>

          <div>
            <label className="text-cyan-300 text-sm block mb-2">Subject</label>
            <input
              type="text"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg bg-[#1a1c2b] text-white focus:ring-2 focus:ring-cyan-400 outline-none"
            />
          </div>

          <div>
            <label className="text-cyan-300 text-sm block mb-2">Message</label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              required
              rows="4"
              className="w-full p-3 rounded-lg bg-[#1a1c2b] text-white focus:ring-2 focus:ring-cyan-400 outline-none resize-none"
              placeholder="Write your message here..."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-3 rounded-lg bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-semibold shadow hover:shadow-[0_0_25px_#00cfff50] transition"
          >
            {loading ? "Sending..." : "Send Message"}
          </button>
        </div>

        <AnimatePresence>
          {responseMsg && (
            <motion.p
              key="response"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
              className="text-center mt-5 text-sm text-gray-300"
            >
              {responseMsg}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.form>
    </div>
  );
}