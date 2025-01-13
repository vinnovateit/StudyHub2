import React from "react";
import Doodle from "@/components/doodle";

async function getData(s) {
  const prop = await fetch(`http://localhost:3000/api/search/`, {
    method: "POST",
    body: JSON.stringify({ searchQuery: s }),
  });
  return prop.json();
}

export default async function page({ params }) {
  const { props } = await getData(params.searchName);
  const { subjects, errors, branch } = props;

  return (
    <div className="min-h-screen flex flex-col">
      <div
        data-theme="default"
        data-layout="fluid"
        data-sidebar-position="left"
        data-sidebar-behavior="sticky"
        className="min-h-[83vh] relative"
      >
        <div className="fixed -z-10">
          <Doodle
            rule={`:doodle { @grid: 30x30; @size: 100vmax; grid-gap: 1px; } background-color:
              hsla(@r(360), 85%, @r(70%, 90%), @r(.2)); transform: scale(@rand(.1,.9));`}
          />
        </div>
        <div className="p-4">
          {errors ? (
            <h1 className="text-center mb-3 bg-clip-text text-transparent bg-gradient-to-r from-gray-600 to-teal-400 font-extrabold text-3xl">
              {errors}
            </h1>
          ) : (
            <>
              <h1 className="text-center mb-3 bg-clip-text text-transparent bg-gradient-to-r from-gray-600 to-teal-400 font-extrabold text-3xl">
                {branch}
              </h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {subjects.map((subject) => (
                  subject && (
                    <div
                      key={subject.code}
                      className="shadow-md hover:shadow-lg transition-shadow duration-75 rounded-md overflow-hidden max-h-[400px] min-h-[200px] flex flex-col"
                    >
                      <div className="px-4 pt-4">
                        <h4 className="font-bold text-lg">{subject.name}</h4>
                      </div>
                      <div className="px-4 pt-2 flex-grow">
                        <p className="text-sm">Course Code - {subject.code}</p>
                        <p className="text-sm">Credits - {subject.credits}</p>
                        <p className="text-sm">Modules - {subject.modules.length}</p>
                      </div>
                      <a
                        href={`/courses/${subject._id}`}
                        className="mt-auto bg-blue-500 text-white text-center py-2 hover:bg-blue-600 transition-colors"
                      >
                        See Detailed Description
                      </a>
                    </div>
                  )
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
