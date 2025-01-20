"use client";

import Image from "next/image";
import connectDB from "@/lib/connectDB";
import Link from "next/link";

connectDB();

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-100 flex flex-col items-center justify-center font-ibm">
      {/* Heading Section and Image Section */}
      <div className="flex items-center justify-center w-full max-w-6xl mx-auto mb-10">
        {/* Heading Section */}
        <div className="text-section flex-1 mr-6 text-center md:text-left">
          <h1
            className="text-blue-600 font-bold text-7xl text-center"
            style={{
              fontFamily: "'Poppins', sans-serif",
              textShadow: "3px 3px 0px rgba(0, 0, 0, 0.25)",
            }}
          >
            StudyHub by VinnovateIT
          </h1>
          <p className="text-center text-gray-700 max-w-xl mx-auto my-5 text-xl">
            No need to worry about your exams anymore, we present to you the
            StudyHub. All in one resource collection for VIT.
          </p>
        </div>

        {/* Image Section */}
        <div className="image-section flex-1">
          <Image
            src="/img/studyguide.png" // Add your illustration image to /public/img/
            alt="Illustration"
            width={600}
            height={500}
            className="mx-auto"
          />
        </div>
      </div>

      {/* Choose Branch Section */}
      <h1
        className="text-blue-600 font-bold text-5xl text-center"
        style={{
          fontFamily: "'Poppins', sans-serif",
          textShadow: "2px 2px 0px rgba(0, 0, 0, 0.25)",
        }}
      >
        Choose your Branch
      </h1>
      <div className="flex flex-wrap justify-center gap-4 mt-8">
        {["IT", "CSE", "MECH", "ECE", "EEE", "CIVIL", "1st SEM", "CHEM"].map(
          (branch) => (
            <a
              key={branch}
              href={`branch/${branch}`}
              className="bg-blue-500 text-white font-semibold px-6 py-2 rounded-md hover:bg-blue-600 transition"
            >
              {branch}
            </a>
          )
        )}
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
