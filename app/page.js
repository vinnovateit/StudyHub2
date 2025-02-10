"use client";

import Image from "next/image";
import connectDB from "@/lib/connectDB";
import Link from "next/link";

// connectDB();

export default function Home() {
  return (

    <div className="min-h-screen py-20 bg-gradient-to-br from-white to-blue-100 flex flex-col items-center justify-center font-ibm px-4 md:px-8 lg:px-12">
      {/* Heading Section and Image Section */}
      <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-6xl mx-auto mb-10">
        {/* Heading Section */}
        <div className="text-section flex-1 mb-8 md:mb-0 md:mr-6 text-center md:text-left">
          <h1
            className="text-blue-600 font-bold text-3xl sm:text-4xl md:text-6xl lg:text-7xl text-center md:text-left"
            style={{
              fontFamily: "'Poppins', sans-serif",
              textShadow: "3px 3px 0px rgba(0, 0, 0, 0.25)",
            }}
          >
            StudyHub by VinnovateIT
          </h1>
          <p className="text-gray-700 max-w-xl mx-auto md:mx-0 mt-5 text-base sm:text-lg md:text-xl lg:text-2xl">
            No need to worry about your exams anymore, we present to you the
            StudyHub. All-in-one resource collection for VIT.
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
      {/*Branch Section*/}
      <div className="relative flex flex-col items-center w-full mt-12 mb-12">
        {/* Left Illustration */}
        <div className="absolute top-[-10px] left-0 -translate-y-1/2 -ml-12 z-0">
          <Image
            src="/img/side_illustration.svg" // Add your left illustration image to /public/img/
            alt="Left Illustration"
            width={30}
            height={30}
            className="w-auto max-w-xs"
          />
        </div>

        {/* Main Section */}
        <div className="flex-1 flex flex-col items-center z-10 mt-10">
          <h1
            className="text-blue-600 font-bold text-2xl sm:text-3xl md:text-5xl text-center"
            style={{
              fontFamily: "'Poppins', sans-serif",
              textShadow: "2px 2px 0px rgba(0, 0, 0, 0.25)",
            }}
          >
            Choose your Branch
          </h1>
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
                className="bg-blue-500 text-white font-semibold text-xs sm:text-sm md:text-base lg:text-lg px-3 sm:px-4 md:px-6 py-2 rounded-md hover:bg-blue-600 transition"
              >
                {branch.name}
              </a>
            ))}
          </div>
        </div>

        {/* Right Illustration */}
        <div className="absolute bottom-[-50px] right-0 translate-y-1/2 rotate-180 -mr-12 z-0">
          <Image
            src="/img/side_illustration.svg" // Add your right illustration image to /public/img/
            alt="Right Illustration"
            width={10}
            height={10}
            className="w-auto max-w-xs"
          />
        </div>
      </div>

      {/* Font Import */}
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap");
        @import url("https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&display=swap");

        .font-ibm {
          font-family: "IBM Plex Mono", monospace;
        }
      `}</style>
    </div>
  );
}