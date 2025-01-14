"use client";

import Image from "next/image";
import connectDB from "@/lib/connectDB";
import Link from "next/link";

connectDB();

// export const metadata = {
//   title: "StudyHub by VinnovateIT",
// };

export default function Home() {
  return (
    <div className="h-screen bg-white">
      <div className="h-screen bg-white">
        <div
          className="fixed bottom-[75px] right-[10px] z-[9999] animate-bounce"
          style={{
            animation: "textgrowth 1s infinite alternate",
          }}
        >
          <a href="https://play.google.com/store/apps/details?id=com.vinnovateit.studyhub">
            <Image
              id="gplaybadge"
              width={120}
              height={55}
              src="/images/google-play-badge.png"
              alt="App Link"
              className="max-w-full h-auto"
            />
          </a>
        </div>
        <div className="flex flex-col justify-center items-center relative h-full">
          <header className="relative w-full min-h-[80vh] bg-white flex justify-center items-center overflow-hidden">
            <div
              className="absolute top-0 left-0 w-full h-full bg-gray-800"
              style={{
                clipPath: "polygon(71% 0, 100% 0, 100% 100%, 93% 100%)",
              }}
            ></div>
            <div className="relative px-10 py-24 box-border">
               <Link href="editorial/login">
        <p className="text-blue-400 hover:text-blue-600 text-xl">Go to Editorial Section</p>
      </Link>
              <h1 className="text-transparent bg-gradient-to-r from-gray-700 via-blue-500 to-blue-400 bg-clip-text font-black text-2xl">
                StudyHub by
                <span className="font-thin font-mono"> VinnovateIT</span>
              </h1>
              <p className="text-lg font-bold text-black mt-4">
                <span className="font-[Gloria Hallelujah] text-2xl">{'"'}</span>
                A "CAT"ing chai and StudyHub from VinnovateIT is all you need
                for your exams!!
                <span className="font-[Kaushan Script] text-2xl">{'"'}</span>
              </p>
              <h4 className="text-gray-600 font-sans mt-4">
                No need to worry about your exams anymore, we present to you
                the StudyHub. All in one resource collection for VIT
              </h4>
              <div className="flex flex-wrap items-center mt-6">
                {["firstsem", "it", "cse", "eee", "mech", "ece", "uc"].map(
                  (branch) => (
                    <a
                      key={branch}
                      href={`branch/${branch}`}
                      className="inline-block bg-gray-800 text-white px-4 py-2 m-2 rounded-md text-sm font-bold uppercase tracking-wide hover:bg-gray-600"
                    >
                      {branch.toUpperCase()}
                    </a>
                  )
                )}
              </div>
            </div>
            <div className="relative pt-10">
              <Image
                src="/images/studyguide.svg"
                height={400}
                width={550}
                alt=""
                className="max-w-full h-auto"
              />
            </div>
          </header>
        </div>
      </div>
      <style jsx>{`
        @keyframes textgrowth {
          0% {
            width: 120px;
            height: 55px;
          }
          50% {
            width: 116px;
            height: 53px;
          }
          100% {
            width: 120px;
            height: 55px;
          }
        }
      `}</style>
    </div>
  );
}
