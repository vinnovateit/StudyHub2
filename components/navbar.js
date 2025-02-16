"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const Navbar = () => {
  const [searchText, setSearchText] = useState("");
  const [showInput, setShowInput] = useState(false);

  return (
    <>
      <nav className="navbar h-[9vh] flex items-center justify-between px-4 sm:px-6 border-b border-gray-300 shadow-sm font-ibm bg-gradient-to-r from-white to-blue-50">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <Image
              src="/img/sglogo.png"
              height={60}
              width={70}
              alt="StudyHub Logo"
              className="w-12 sm:w-14 mt-2"
            />
          </Link>
        </div>

        {/* Right-Side Elements */}
        <div className="flex items-center space-x-2 sm:space-x-0">
          {/* Search Input (Always visible on large screens, toggles on small screens) */}
          <input
            type="text"
            className={`form-control search-input border border-gray-300 rounded-full-md px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:outline-none 
                        text-sm sm:rounded-l-md w-36 sm:w-48 sm:py-2 
                        ${showInput ? "block" : "hidden"} sm:block`}
            placeholder="Search Course"
            aria-label="Search"
            name="query"
            id="autoCourse"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />

          {/* Search Button (Always on the right) */}
          <button
            type="button"
            className="flex items-center justify-center transition-colors  
                       text-blue-500
                       sm:bg-blue-500 sm:text-white
                       sm:border sm:border-blue-500
                       sm:rounded-r-md sm:px-4 sm:py-2.5 sm:text-md
                       w-8 h-8 sm:w-auto sm:h-auto"
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
