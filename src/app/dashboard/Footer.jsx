"use client";

export default function Footer() {
  return (
    <footer className="bg-[#11121f] p-4 text-center text-green-400 border-t border-green-600">
      &copy; {new Date().getFullYear()} Social Manager. All rights reserved.
    </footer>
  );
}