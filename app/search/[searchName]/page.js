"use client";
import React from "react";
import { IBM_Plex_Mono, Poppins } from "next/font/google";

// Import Fonts
const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

async function getData(s) {
  const prop = await fetch(`http://localhost:3000/api/search/`, {
    method: "POST",
    body: JSON.stringify({ searchQuery: s }),
  });
  return prop.json();
}

export default async function page({ params }) {
  const searchName = decodeURIComponent(params.searchName);
  const { props } = await getData(searchName);
  const { subjects = [], errors = null } = props || {};

  const displayQuery = searchName.replace(/%20/g, " ");

  if (!subjects || !Array.isArray(subjects) || subjects.length === 0) {
    return (
      <div className={`${ibmPlexMono.className} min-h-screen flex flex-col items-center justify-center bg-[#1E1E1E]`}>
        <div className="p-6 w-full flex flex-col items-center">
          <h1 className="text-center mb-3 text-red-500 font-bold text-xl">
            No courses found for "{displayQuery}"
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className={`${ibmPlexMono.className} min-h-screen flex flex-col items-center justify-center bg-[#1E1E1E] text-[#FBFCFF]`}>
      <div className="fixed -z-10"></div>

      <div className="p-6 w-full flex flex-col items-center">
        {errors ? (
          <h1 className="text-center mb-3 bg-clip-text text-transparent bg-gradient-to-r from-[#16171C] to-[#9FE5FF] font-extrabold text-3xl">
            {errors}
          </h1>
        ) : (
          <>
            <h1
              className={`${poppins.className} text-center mb-6 font-extrabold text-4xl text-[#ABCFED] px-6 py-2 rounded-lg`}
            >
              Results for "{displayQuery}"
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 place-items-center">
              {subjects.map(
                (subject) =>
                  subject && (
                    <div
                      key={subject.code}
                      className="relative bg-[#ABCFED] rounded-xl border border-[#16171C] w-[310px] h-[360px] text-sm p-6 flex flex-col"
                    >
                      <h4 className="font-extrabold text-lg text-[#16171C]">
                        {subject.name}
                      </h4>
                      <p className="text-[#16171C]">
                        <span className="font-semibold">Course Code:</span>{" "}
                        {subject.code}
                      </p>
                      <p className="text-[#16171C]">
                        <span className="font-semibold">Credits:</span>{" "}
                        {subject.credits}
                      </p>
                      <p className="text-[#16171C]">
                        <span className="font-semibold">Modules:</span>{" "}
                        {subject.modules.length}
                      </p>

                      <p className="text-[#16171C] mt-3 text-sm leading-relaxed flex-grow">
                        {subject.preview}
                      </p>

                      <div className="mt-auto">
                        <a
                          href={`/courses/${subject.code}`}
                          className="block text-center bg-[#007BFF] text-[#FBFCFF] font-medium rounded-md py-2 hover:bg-[#0056b3] transition"
                        >
                          View more info
                        </a>
                      </div>
                    </div>
                  )
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}