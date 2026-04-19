"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const getBranchRoute = (branchName) =>
  `/branch/${encodeURIComponent(branchName.toLowerCase())}`;

export default function Home() {
  const [branches, setBranches] = useState([]);
  const [isLoadingBranches, setIsLoadingBranches] = useState(true);
  const [branchError, setBranchError] = useState("");

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await fetch("/api/get-branch");

        if (!response.ok) {
          throw new Error("Failed to fetch branches");
        }

        const data = await response.json();
        const normalizedBranches = Array.isArray(data)
          ? data
              .filter((branch) => branch?.name)
              .sort((a, b) => a.name.localeCompare(b.name))
          : [];

        setBranches(normalizedBranches);
      } catch (error) {
        console.error("Error fetching branches:", error);
        setBranchError("Unable to load branches right now.");
      } finally {
        setIsLoadingBranches(false);
      }
    };

    fetchBranches();
  }, []);

  return (
    <div className="min-h-screen py-8 pb-24 bg-[#1E1E1E] flex flex-col items-center justify-center font-ibm px-4 md:px-8 lg:px-12 relative">
      {/* Heading Section */}
      <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-6xl mx-auto mb-10">
        {/* Text Section */}
        <div className="text-section flex-1 mb-8 md:mb-0 md:mr-6 text-center md:text-left">
          <h1
            className="text-[#93c5fd] font-bold text-3xl sm:text-4xl md:text-6xl lg:text-7xl
             drop-shadow-lg shadow-[#60a5fa]/50"
          >
            StudyHub by <span className="text-[#93c5fd]">VinnovateIT</span>
          </h1>

          <p className="text-gray-400 max-w-xl mx-auto md:mx-0 mt-5 text-base sm:text-lg md:text-xl">
            No need to worry about your exams anymore. We present to you the
            StudyHub— an all-in-one resource collection for VIT.
          </p>
        </div>

        {/* Image Section */}
        <div className="image-section flex-1 flex items-center justify-center">
          <Image
            src="/img/allnighter_img.svg"
            alt="Illustration"
            width={500}
            height={400}
            className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg"
          />
        </div>
      </div>

      {/* Branch Section */}
      <div className="relative flex flex-col items-center w-full mt-8 mb-12">
        <h2 className="text-[#93c5fd] font-bold text-2xl sm:text-3xl md:text-5xl text-center">
          Choose your Branch
        </h2>
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          {isLoadingBranches && (
            <p className="text-gray-400 text-sm sm:text-base">Loading branches...</p>
          )}

          {!isLoadingBranches && branchError && (
            <p className="text-red-400 text-sm sm:text-base">{branchError}</p>
          )}

          {!isLoadingBranches && !branchError && branches.length === 0 && (
            <p className="text-gray-400 text-sm sm:text-base">No branches found.</p>
          )}

          {!isLoadingBranches &&
            !branchError &&
            branches.map((branch) => (
              <Link
                key={branch._id || branch.name}
                href={getBranchRoute(branch.name)}
                className="bg-[#93c5fd] text-[#0d1321] font-semibold text-sm sm:text-base px-5 py-3 rounded-md hover:bg-[#60a5fa] transition shadow-md"
              >
                {branch.name}
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}
