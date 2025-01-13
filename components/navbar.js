"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const Navbar = () => {
  const [searchText, setSearchText] = useState("");

  return (
    <>
      <nav className="navbar navbar-expand navbar-light bg-white h-[8vh] flex items-center px-4">
        <Link href="/" className="mr-12 text-lg">
          <Image
            src="/img/sglogo.png"
            height={42}
            width={70}
            alt="StudyHub"
            className="m-0 mt-0 align-top"
            style={{
              width: "57px",
            }}
          />
        </Link>
        <div className="navbar-collapse flex-grow flex items-center">
          <ul className="navbar-nav flex items-center ml-auto">
            <div className="search-box flex items-center">
              <form
                className="flex"
                onSubmit={(e) => {
                  e.preventDefault();
                  window.location.href = `/search/${searchText}`;
                }}
              >
                <input
                  type="text"
                  className="form-control search-input border border-gray-300 rounded-l-md px-3 py-2 focus:ring focus:ring-blue-300"
                  placeholder="Search Course"
                  aria-label="Search"
                  name="query"
                  id="autoCourse"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
                <button
                  type="submit"
                  className="bg-blue-500 text-white rounded-r-md px-4 py-2 flex items-center justify-center hover:bg-blue-600 transition-colors"
                >
                  <i className="fas fa-search"></i>
                </button>
              </form>
            </div>
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
