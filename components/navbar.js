"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

const Navbar = () => {
  const [searchText, setSearchText] = useState("");
  const [showInput, setShowInput] = useState(false);
  const searchContainerRef = useRef(null);
  const searchButtonRef = useRef(null);

  const handleSearch = () => {
    if (searchText && searchText.trim() !== "") {
      window.location.href = `/search/${searchText}`;
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Close mobile search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showInput && 
        searchContainerRef.current && 
        !searchContainerRef.current.contains(event.target) &&
        searchButtonRef.current &&
        !searchButtonRef.current.contains(event.target)
      ) {
        setShowInput(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showInput]);

  return (
    <>
      <div className="sticky top-0 z-50 bg-[#1E1E1E]">
        {/* Main Navbar */}
        <nav className="navbar h-[9vh] flex items-center justify-between px-4 sm:px-6 border-b border-[#93c5fd] shadow-sm font-ibm bg-[#1E1E1E]">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image
                src="/img/studyhub.svg"
                height={50}
                width={70}
                alt="StudyHub Logo"
                className="w-8 mx-2 py-4"
              />
            </Link>
          </div>

          {/* Right-Side Elements */}
          <div className="flex items-center space-x-3">
            {/* Papers Link - visible on all screens */}
            <Link href='/past_papers' className="text-[#93c5fd] whitespace-nowrap hover:text-white transition-colors">
              {/* Use responsive text without window.innerWidth which causes hydration issues */}
              <span className="hidden sm:inline">View Papers</span>
              <span className="sm:hidden">Papers</span>
            </Link>

            {/* Desktop search bar */}
            <div className="hidden sm:flex items-center ml-4">
              <input
                type="text"
                className="form-control search-input border border-gray-600 rounded-l-md px-3 py-2
                          text-sm w-48 bg-[#1E1E1E] text-[#93c5fd]"
                placeholder="Search Course"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <button
                type="button"
                className="flex items-center justify-center transition-colors text-[#1E1E1E]
                          bg-[#93c5fd] border border-[#93c5fd]
                          rounded-r-md px-4 py-2 text-md
                          hover:bg-[#60a5fa]"
                onClick={handleSearch}
              >
                <i className="fas fa-search"></i>
              </button>
            </div>

            {/* Mobile search button */}
            <button
              ref={searchButtonRef}
              type="button"
              className="sm:hidden flex items-center justify-center transition-colors text-[#1E1E1E]
                        bg-[#93c5fd] rounded-md
                        px-3 py-1 text-md hover:bg-[#60a5fa]"
              onClick={() => setShowInput(!showInput)}
            >
              <i className="fas fa-search"></i>
            </button>
          </div>
        </nav>

        {/* Mobile Search Container - Below Navbar */}
        <div 
          ref={searchContainerRef}
          className={`sm:hidden w-full border-b border-[#93c5fd] bg-[#1E1E1E] px-4 py-2 
                      transition-all duration-300 ease-in-out overflow-hidden
                      ${showInput ? 'max-h-16 opacity-100' : 'max-h-0 opacity-0'}`}
        >
          <div className="flex items-center">
            <input
              type="text"
              className="form-control search-input border border-gray-600 rounded-l-md px-3 py-2
                        text-sm flex-grow bg-[#1E1E1E] text-[#93c5fd]"
              placeholder="Search Course"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyPress={handleKeyPress}
              autoFocus={showInput}
            />
            <button
              type="button"
              className="flex items-center justify-center transition-colors text-[#1E1E1E]
                        bg-[#93c5fd] border border-[#93c5fd]
                        rounded-r-md px-4 py-2 text-md
                        hover:bg-[#60a5fa]"
              onClick={handleSearch}
            >
              <i className="fas fa-search"></i>
            </button>
          </div>
        </div>
      </div>

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