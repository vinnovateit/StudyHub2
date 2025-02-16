"use client";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";

export default function SearchBar() {
  const [searchText, setSearchText] = useState("");

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
        className="border rounded-lg px-4 py-2 w-full"
      />
      <button
        className="bg-[#007BFF] text-white px-4 py-2 rounded-lg ml-2 hover:bg-[#0056b3] transition"
        onClick={() => {
          if (searchText && searchText.trim() !== "") {
            window.location.href = `/search/${searchText}`;
          }
        }}
      >
        <FaSearch />
      </button>
    </div>
  );
}
