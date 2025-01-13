import Head from "next/head";
import Doodle from "@/components/doodle";
import Image from "next/image";
import { Modules } from "@/components/modules";
import pdflist from "@/components/pdfs";

async function getData(s) {
  const prop = await fetch(`http://localhost:3000/api/courses/`, {
    method: "POST",
    body: JSON.stringify({ searchQuery: s }),
  });
  return prop.json();
}

export default async function Page({ params }) {
  let courseName = params.courseName;
  const { props } = await getData(params.courseName);
  const { Course, errors } = props;

  return (
    <div className="min-h-[83vh] break-words">
      <Head>
        <title> StudyHub | {Course.code}</title>
      </Head>
      <div className="relative">
        <div className="fixed z-[-1]">
          <Doodle
            rule={`
            :doodle { @grid: 30x30; @size: 100vmax; grid-gap: 1px; }
            background-color: hsla(@r(360), 85%, @r(70%, 90%), @r(.2));
            transform: scale(@rand(.1,.9));
          `}
          />
        </div>

        <div className="flex flex-col">
          <div className="main">
            <div className="content">
              <div className="container mx-auto p-4">
                {errors ? (
                  <div className="flex justify-center">
                    <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-gray-500 to-teal-500 text-center">
                      {errors}
                    </h1>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-center">
                      <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-gray-500 to-teal-500">
                        {Course.name} ({Course.code})
                      </h1>
                      <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-500 to-teal-500">
                        Credits: {Course.credits}
                      </h3>
                    </div>
                    {["MAT2001", "MAT2002", "BMAT102L"].includes(Course.code) && (
                      <div className="flex items-center justify-center mt-4">
                        <a href="https://vinnovateit.com/">
                          <Image
                            height={80}
                            width={107}
                            src="/img/VinnovateIT_small.png"
                            alt="VinnovateIT"
                          />
                        </a>
                        <div className="mx-4">
                          <Image
                            height={25}
                            width={25}
                            src="/img/Vector.png"
                            alt="Vector"
                          />
                        </div>
                        <a href="https://www.siamvit.in/">
                          <Image
                            height={50}
                            width={160}
                            src="/img/siam.png"
                            alt="SiamVit"
                          />
                        </a>
                      </div>
                    )}
                    {Course.description?.sanitizedHtml && (
                      <div className="p-4 border rounded-md bg-gray-100 mt-6">
                        <h2 className="text-xl font-bold">Note:</h2>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: Course.description.sanitizedHtml,
                          }}
                        />
                      </div>
                    )}
                    <Modules modules={Course.modules} />
                    {Course.pdfs.length > 0 && <pdflist pdfs={Course.pdfs} />}
                    {Course.pdfs.length > 0 && (
                      <div className="mt-6">
                        <div className="bg-gray-200 p-4 rounded-md">
                          <h3 className="text-lg font-bold uppercase">Materials</h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                            {Course.pdfs.map((pdf) => (
                              <div
                                className="bg-white p-4 shadow-md rounded-lg"
                                key={pdf.name}
                              >
                                <h4 className="text-center font-bold">{pdf.name}</h4>
                                <iframe
                                  src={pdf.link}
                                  className="w-full h-48 mt-4"
                                ></iframe>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
