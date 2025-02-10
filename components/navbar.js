"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const Navbar = () => {
  const [searchText, setSearchText] = useState("");
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
          {/*search*/}
          <div className="search-box flex items-center space-x-4">
            <form
              className="flex items-center"
              onSubmit={(e) => {
                e.preventDefault();
                window.location.href = `/search/${searchText}`;
              }}
            >
              <input
                type="text"
                className="form-control search-input border border-gray-300 rounded-l-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Search Course"
                aria-label="Search"
                name="query"
                id="autoCourse"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
              <button
                type="submit"
                className="bg-blue-500 text-white text-lg rounded-r-md px-4 py-3 flex items-center justify-center hover:bg-blue-600 transition-colors"
              >
                <i className="fas fa-search"></i>
              </button>
            </form>
          </div>
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
