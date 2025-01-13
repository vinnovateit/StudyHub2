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
    <div
      data-theme="default"
      data-layout="fluid"
      data-sidebar-position="left"
      data-sidebar-behavior="sticky"
      className="min-h-[83vh]"
    >
      <div className="fixed z-[-999]">
        <Doodle
          rule={`
      :doodle { @grid: 30x30; @size: 100vmax; grid-gap: 1px; } background-color:
      hsla(@r(360), 85%, @r(70%, 90%), @r(.2)); transform: scale(@rand(.1,.9));
        `}
        />
      </div>
      <div className="wrapper">
        <div className="main">
          <main className="content">
            <div className="container-fluid p-0">
              {errors ? (
                <>
                  <h1 className="mb-3 text-center bg-clip-text text-transparent bg-gradient-to-r from-gray-600 to-teal-400 font-extrabold text-3xl">
                    {errors}
                  </h1>
                </>
              ) : (
                <>
                  <h1 className="mb-3 text-center bg-clip-text text-transparent bg-gradient-to-r from-gray-600 to-teal-400 font-extrabold text-3xl">
                    {branch}
                  </h1>
                  <div className="row">
                    {subjects.map((subject) => {
                      return subject ? (
                        <div
                          className="col-12 col-md-6 col-lg-3"
                          key={subject.code}
                        >
                          <div className="shadow-md hover:shadow-lg transition-shadow duration-75 max-h-[200px] min-h-[200px] card">
                            <div className="card-header px-4 pt-4">
                              <div className="card-actions float-right">
                                <div className="dropdown show"></div>
                              </div>
                              <h4 className="card-title mb-0">{subject.name}</h4>
                            </div>
                            <div className="card-body px-4 pt-2">
                              <h6>Course Code - {subject.code}</h6>
                              <h6>Credits - {subject.credits}</h6>
                              <h6>Modules - {subject.modules.length}</h6>
                            </div>
                            <a
                              href={`/courses/${subject._id}`}
                              className="btn border-t-0 rounded-b-none btn-info"
                            >
                              See Detailed Description
                            </a>
                          </div>
                        </div>
                      ) : (
                        <></>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
