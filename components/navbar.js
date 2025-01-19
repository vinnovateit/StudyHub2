"use client";

import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
  return (
    <>
      <nav className="navbar h-[9vh] flex items-center justify-between px-6 border-b border-gray-300 shadow-sm font-ibm bg-gradient-to-r from-white to-blue-50">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <Image
              src="/img/sglogo.png"
              height={60}
              width={70}
              alt="StudyHub Logo"
              className="mr-2 mt-2"
            />
          </Link>
        </div>

        {/* Links */}
        <div className="flex items-center space-x-4">
          <Link href="/" className="text-blue-600 text-xl hover:underline">
            Home
          </Link>
          <span className="text-gray-400">|</span>
          <Link
            href="/all-nighter"
            className="text-blue-600 text-xl hover:underline"
          >
            All-Nighter
          </Link>
          <span className="text-gray-400">|</span>
          <button className="bg-blue-500 text-white text-xl px-4 py-1 rounded-md hover:bg-blue-600 transition">
            Login
          </button>
        </div>
      </nav>

      {/* Font CSS */}
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&display=swap");

        .font-ibm {
          font-family: "IBM Plex Mono", monospace;
        }
      `}</style>
    </>
  );
};

export default Navbar;
