"use client";

import { FaSearch } from "react-icons/fa";

export default function SearchBar({ searchText, setSearchText }) {
  return (
    <div className="flex justify-center mb-6 w-full max-w-md">
      <input
        type="text"
        placeholder="Search Course"
        aria-label="Search"
        name="query"
        id="autoCourse"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        className="border rounded-lg px-4 py-2 w-full bg-[#9FE5FF] text-[#16171C] placeholder-[#16171C] focus:outline-none focus:ring-2 focus:ring-[#007BFF]"
      />
      <button
        className="bg-[#007BFF] text-white px-4 py-2 rounded-lg ml-2 hover:bg-[#0056b3] transition"
      >
        <FaSearch />
      </button>
    </div>
  );
}
