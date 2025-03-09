"use client";

import { Search } from "lucide-react";

export default function SearchBar({ searchText, setSearchText }) {
  return (
   <div className="mb-4 w-full relative">
          <div className="absolute top-0 bottom-0 left-4 flex items-center">
            <Search size={20} className="text-black" />
          </div>
          <input
            type="text"
            placeholder="Search subjects..."
            className="w-full p-3 pl-12 rounded-full bg-[#ABCFED] text-black focus:outline-none focus:ring-2 focus:ring-[#ABCFED]"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
  );
}
