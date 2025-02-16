"use client";

import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen py-8 bg-gradient-to-br from-white to-blue-100 flex flex-col items-center justify-center font-ibm px-4 md:px-8 lg:px-12 relative">
      {/* Heading Section */}
      <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-6xl mx-auto mb-10">
        {/* Text Section */}
        <div className="text-section flex-1 mb-8 md:mb-0 md:mr-6 text-center md:text-left">
          <h1 className="text-blue-600 font-bold text-3xl sm:text-4xl md:text-6xl lg:text-7xl">
            StudyHub by <span className="text-blue-700">VinnovateIT</span>
          </h1>
          <p className="text-gray-700 max-w-xl mx-auto md:mx-0 mt-5 text-base sm:text-lg md:text-xl">
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
        {/* Left Illustration */}
        <div className="absolute top-[-10px] left-0 -translate-y-1/2 -ml-12 z-0 hidden md:block">
          <Image
            src="/img/side_illustration.svg"
            alt="Left Illustration"
            width={60}
            height={60}
            className="w-auto max-w-xs"
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center z-10 sm:mt-10 -mt-6">
          <h2 className="text-blue-600 font-bold text-2xl sm:text-3xl md:text-5xl text-center">
            Choose your Branch
          </h2>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            {[
              { name: "IT", route: "/branch/it" },
              { name: "CSE", route: "/branch/cse" },
              { name: "MECH", route: "/branch/mech" },
              { name: "ECE", route: "/branch/ece" },
              { name: "EEE", route: "/branch/eee" },
              { name: "1st SEM", route: "/branch/firstsem" },
              { name: "U.C.", route: "/branch/uc" },
            ].map((branch) => (
              <a
                key={branch.name}
                href={branch.route}
                className="bg-blue-500 text-white font-semibold text-sm sm:text-base px-5 py-3 rounded-md hover:bg-blue-600 transition shadow-md"
              >
                {branch.name}
              </a>
            ))}
          </div>
        </div>

        {/* Right Illustration */}
        <div className="absolute bottom-[-50px] right-0 translate-y-1/2 rotate-180 -mr-12 z-0 hidden md:block">
          <Image
            src="/img/side_illustration.svg"
            alt="Right Illustration"
            width={60}
            height={60}
            className="w-auto max-w-xs"
          />
        </div>
      </div>
    </div>
  );
}
