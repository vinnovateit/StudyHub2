import Head from "next/head";
import Doodle from "@/components/doodle";
import Image from "next/image";
import { FaSearch } from "react-icons/fa";
import { IBM_Plex_Mono, Poppins } from "next/font/google";

// Import fonts
const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export async function generateMetadata({ params }) {
  if (params.branchName) {
    return {
      title: `BRANCH | ${params.branchName.toUpperCase()}`,
    };
  }
}

async function getData(s) {
  const prop = await fetch(`http://localhost:3000/api/branch/`, {
    method: "POST",
    body: JSON.stringify({ searchQuery: s }),
  });
  return prop.json();
}

export default async function page({ params }) {
  let branchName = params.branchName;
  const { props } = await getData(params.branchName);
  const { subjects, errors } = props;

  return (
    <div
      className={`${ibmPlexMono.className} min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white via-[#C3ECFF] to-[#9FE5FF]`}
    >
      <div
        data-theme="default"
        data-layout="fluid"
        data-sidebar-position="left"
        data-sidebar-behavior="sticky"
        className="min-h-[83vh] w-full flex flex-col items-center"
      >
        <div className="fixed -z-10">
          <Doodle
            rule={`:doodle { @grid: 30x30; @size: 100vmax; grid-gap: 1px; } background-color:
              hsla(@r(360), 85%, @r(70%, 90%), @r(.2)); transform: scale(@rand(.1,.9));`}
          />
        </div>

        <div className="p-6 w-full flex flex-col items-center">
          {errors ? (
            <h1 className="text-center mb-3 bg-clip-text text-transparent bg-gradient-to-r from-gray-600 to-teal-400 font-extrabold text-3xl">
              {errors}
            </h1>
          ) : (
            <>
              {/* Branch Name with Poppins */}
              <h1
                className={`${poppins.className} text-center mb-6 font-extrabold text-4xl text-blue-600`}
              >
                {branchName.toUpperCase()}
              </h1>

              {/* Search Bar */}
              <div className="flex justify-center mb-6 w-full max-w-md">
                <input
                  type="text"
                  placeholder="Search Course"
                  className="border rounded-lg px-4 py-2 w-full"
                />
                <button className="bg-[#007BFF] text-white px-4 py-2 rounded-lg ml-2 hover:bg-[#0056b3] transition">
                  <FaSearch />
                </button>
              </div>

              {/* Cards Section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 place-items-center">
                {subjects.map(
                  (subject) =>
                    subject && (
                      <div
                        key={subject.code}
                        className="relative bg-white rounded-xl border border-gray-300 w-[310px] h-[360px] text-sm p-6 flex flex-col"
                      >
                        <h4 className="font-extrabold text-lg text-gray-900">
                          {subject.name}
                        </h4>
                        <p className="text-gray-500">
                          <span className="font-semibold">Course Code:</span>{" "}
                          {subject.code}
                        </p>
                        <p className="text-gray-500">
                          <span className="font-semibold">Credits:</span>{" "}
                          {subject.credits}
                        </p>
                        <p className="text-gray-500">
                          <span className="font-semibold">Modules:</span>{" "}
                          {subject.modules.length}
                        </p>

                        <p className="text-gray-600 mt-3 text-sm leading-relaxed flex-grow">
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit, sed do eiusmod tempor incididunt ut labore et
                          dolore magna aliqua.
                        </p>

                        <div className="mt-auto">
                          <a
                            href={`/courses/${subject._id}`}
                            className="block text-center bg-[#007BFF] text-white font-medium rounded-md py-2 hover:bg-[#0056b3] transition"
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
    </div>
  );
}


