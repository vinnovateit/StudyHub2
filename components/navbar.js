"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const Navbar = () => {
  const [searchText, setSearchText] = useState("");
  const [showInput, setShowInput] = useState(false);

  return (
    <>
      <nav className="navbar h-[9vh] flex items-center justify-between px-4 sm:px-6 border-b border-[#93c5fd] shadow-sm font-ibm bg-[#0d1321]">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <Image
              src="/img/studyhub_black.jpg"
              height={60}
              width={70}
              alt="StudyHub Logo"
              className="w-12 sm:w-14 mt-2"
            />
          </Link>
        </div>

        {/* Right-Side Elements */}
        <div className="flex items-center space-x-2 sm:space-x-0">
          {/* Search Input */}
          <input
            type="text"
            className={`form-control search-input border border-gray-600 rounded-l-md px-3 py-1 focus:ring-2 focus:ring-[#93c5fd] focus:outline-none 
                        text-sm w-36 sm:w-48 sm:py-2 bg-[#1a1f2e] text-[#93c5fd]`}
            placeholder="Search Course"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />

          {/* Search Button */}
          <button
            type="button"
            className="flex items-center justify-center transition-colors text-[#93c5fd]
                       sm:bg-[#93c5fd] sm:text-[#0d1321]
                       sm:border sm:border-[#93c5fd]
                       sm:rounded-r-md sm:px-4 sm:py-2.5 sm:text-md
                       w-8 h-8 sm:w-auto sm:h-auto hover:bg-[#60a5fa] hover:text-white"
            onClick={() => {
              setShowInput((prev) => !prev);
              if (searchText && searchText.trim() !== "") {
                window.location.href = `/search/${searchText}`;
              }
            }}
          >
            <i className="fas fa-search"></i>
          </button>
        </div>
      </nav>

      {/* Font Styles */}
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
