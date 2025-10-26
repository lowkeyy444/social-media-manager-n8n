"use client";

export default function Footer() {
  return (
    <footer className="bg-[rgba(15,17,26,0.85)] backdrop-blur-md p-4 text-center rounded-t-2xl border-t border-cyan-400 shadow-md mt-4">
      <p className="text-cyan-400 font-medium">&copy; {new Date().getFullYear()} SocialManager. All rights reserved.</p>
      <p className="text-sm text-gray-400 mt-1">Built for next-gen creators.</p>
    </footer>
  );
}