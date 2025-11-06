"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { HiOutlineTrash } from "react-icons/hi";

export default function ManageAccounts() {
  const [accounts, setAccounts] = useState([]);
  const [form, setForm] = useState({
    platform: "",
    accountName: "",
    apiKey: "",
    nodeId: "",
    logoUrl: "",
  });
  const [message, setMessage] = useState("");

  const fetchAccounts = async () => {
    try {
      const res = await axios.get("/api/dashboard/accounts", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setAccounts(res.data);
    } catch (err) {
      console.error("Error fetching accounts", err);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/dashboard/accounts", form, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setForm({
        platform: "",
        accountName: "",
        apiKey: "",
        nodeId: "",
        logoUrl: "",
      });
      fetchAccounts();
      setMessage("Account added successfully!");
      setTimeout(() => setMessage(""), 2000);
    } catch (err) {
      console.error("Error adding account", err);
      setMessage("Failed to add account.");
      setTimeout(() => setMessage(""), 2000);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete("/api/dashboard/accounts", {
        data: { id },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchAccounts();
      setMessage("Account deleted.");
      setTimeout(() => setMessage(""), 2000);
    } catch (err) {
      console.error("Error deleting account", err);
      setMessage("Error deleting account.");
      setTimeout(() => setMessage(""), 2000);
    }
  };

  // Extract existing logo URLs for selection
  const uniqueLogos = Array.from(
    new Set(accounts.map((a) => a.logoUrl).filter(Boolean))
  );

  return (
    <div className="p-6 min-h-screen text-white overflow-y-auto">
      {/* Header */}
      <header className="max-w-6xl mx-auto mb-6">
        <h1 className="text-3xl md:text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
          Manage Social Accounts
        </h1>
        <p className="text-center text-sm text-gray-300 mt-2">
          Add, view, and remove API credentials for each platform.
        </p>
      </header>

      {/* Main */}
      <main className="max-w-5xl mx-auto">
        {/* Add Form */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-[rgba(15,17,26,0.85)] backdrop-blur-md border border-cyan-400/10 rounded-2xl p-6 mb-10 shadow-md"
        >
          <h2 className="text-xl font-semibold mb-4 text-cyan-300">
            Add New Account
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Platform */}
            <select
              className="p-3 bg-[#0b0b12] border border-cyan-400/10 rounded-lg text-gray-200 focus:outline-none focus:border-cyan-400/40"
              value={form.platform}
              onChange={(e) => setForm({ ...form, platform: e.target.value })}
              required
            >
              <option value="">Select Platform</option>
              <option value="linkedin">LinkedIn</option>
              <option value="instagram">Instagram</option>
              <option value="facebook">Facebook</option>
            </select>

            {/* Account Name */}
            <input
              type="text"
              placeholder="Account Name"
              className="p-3 bg-[#0b0b12] border border-cyan-400/10 rounded-lg text-gray-200 focus:outline-none focus:border-cyan-400/40"
              value={form.accountName}
              onChange={(e) => setForm({ ...form, accountName: e.target.value })}
              required
            />

            {/* API Key */}
            <input
              type="text"
              placeholder="API Key"
              className="p-3 bg-[#0b0b12] border border-cyan-400/10 rounded-lg text-gray-200 focus:outline-none focus:border-cyan-400/40"
              value={form.apiKey}
              onChange={(e) => setForm({ ...form, apiKey: e.target.value })}
              required
            />

            {/* Node ID */}
            <input
              type="text"
              placeholder="Node ID"
              className="p-3 bg-[#0b0b12] border border-cyan-400/10 rounded-lg text-gray-200 focus:outline-none focus:border-cyan-400/40"
              value={form.nodeId}
              onChange={(e) => setForm({ ...form, nodeId: e.target.value })}
              required
            />

            {/* ✅ Logo URL Input */}
            <div className="col-span-1 md:col-span-2 flex flex-col space-y-2">
              <div className="flex space-x-3">
                <input
                  type="text"
                  placeholder="Logo URL (optional)"
                  className="flex-1 p-3 bg-[#0b0b12] border border-cyan-400/10 rounded-lg text-gray-200 focus:outline-none focus:border-cyan-400/40"
                  value={form.logoUrl}
                  onChange={(e) => setForm({ ...form, logoUrl: e.target.value })}
                />
                {form.logoUrl && (
                  <img
                    src={form.logoUrl}
                    alt="Preview"
                    className="w-10 h-10 rounded-lg border border-cyan-400/10"
                  />
                )}
              </div>

              {/* Dropdown for existing logos */}
              {uniqueLogos.length > 0 && (
                <select
                  className="p-2 bg-[#0b0b12] border border-cyan-400/10 rounded-lg text-gray-300 text-sm focus:outline-none focus:border-cyan-400/40"
                  onChange={(e) =>
                    setForm({ ...form, logoUrl: e.target.value })
                  }
                >
                  <option value="">Select existing logo</option>
                  {uniqueLogos.map((url) => (
                    <option key={url} value={url}>
                      {url}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-semibold shadow hover:shadow-[0_0_25px_#00cfff50]"
            >
              Add Account
            </button>
          </div>
        </motion.form>

        {/* Account Cards */}
        {accounts.length === 0 ? (
          <p className="text-center text-gray-400">No accounts added yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {accounts.map((a) => (
              <motion.div
                key={a._id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 8px 40px rgba(0,204,255,0.08)",
                }}
                className="relative rounded-xl overflow-hidden bg-[rgba(15,17,26,0.85)] backdrop-blur-md border border-cyan-400/14 shadow-md"
              >
                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {/* ✅ Show logo if available */}
                      {a.logoUrl ? (
                        <img
                          src={a.logoUrl}
                          alt={a.platform}
                          className="w-8 h-8 rounded-md"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-gray-700 rounded-md" />
                      )}
                      <span className="text-xs px-2 py-1 rounded-full bg-[rgba(255,255,255,0.03)] text-gray-200 font-semibold uppercase">
                        {a.platform}
                      </span>
                    </div>

                    <button
                      onClick={() => handleDelete(a._id)}
                      className="p-2 rounded-md bg-[rgba(255,50,50,0.05)] hover:bg-[rgba(255,50,50,0.08)] transition text-red-400"
                    >
                      <HiOutlineTrash />
                    </button>
                  </div>

                  <div>
                    <p className="font-semibold text-gray-100 text-lg">
                      {a.accountName}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Node ID: {a.nodeId}
                    </p>
                  </div>
                  <p className="text-xs text-gray-500">
                    Added: {new Date(a.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* Floating Message */}
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
    </div>
  );
}