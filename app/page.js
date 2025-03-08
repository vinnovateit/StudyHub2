"use client";

import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen py-8 pb-24 bg-[#0d1321] flex flex-col items-center justify-center font-ibm px-4 md:px-8 lg:px-12 relative">
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
            src="/img/studyguide.png"
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
          {[
            { name: "IT", route: "/branch/it" },
            { name: "CSE", route: "/branch/cse" },
            { name: "MECH", route: "/branch/mech" },
            { name: "ECE", route: "/branch/ece" },
            { name: "EEE", route: "/branch/eee" },
            { name: "CIVIL", route: "/branch/civil" },
            { name: "1st SEM", route: "/branch/firstsem" },
          ].map((branch) => (
            <a
              key={branch.name}
              href={branch.route}
              className="bg-[#93c5fd] text-[#0d1321] font-semibold text-sm sm:text-base px-5 py-3 rounded-md hover:bg-[#60a5fa] transition shadow-md"
            >
              {branch.name}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
