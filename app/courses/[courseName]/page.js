import Head from "next/head";
import Image from "next/image";
import { Modules } from "@/components/modules";
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
    <div className="break-words bg-gradient-to-br from-white to-blue-100 text-gray-900">
      
        <Head>
        <title>StudyHub | {Course.code}</title>
      </Head>
     
     
      <div className="relative">

        <div className="max-w-7xl mx-auto p-6rounded-lg mt-6">
          {errors ? (
            <div className="text-center py-10">
              <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-blue">
                {errors}
              </h1>
            </div>
          ) : (
            <>
              <div className={`${poppins.className} border-b pb-4`}>
  <div className="flex justify-between items-center">
    <h1 className="text-4xl font-extrabold text-blue-600">
      {Course.name} ({Course.code})
    </h1>
  </div>
  <h3 className="text-lg font-semibold text-blue-500 text-right mt-2">
    Credits: {Course.credits}
  </h3>
</div>


              {["MAT2001", "MAT2002", "BMAT102L"].includes(Course.code) && (
                <div className="flex items-center justify-center mt-6 gap-4">
                  <a href="https://vinnovateit.com/">
                    <Image height={80} width={107} src="/img/VinnovateIT_small.png" alt="VinnovateIT" />
                  </a>
                  <Image height={25} width={25} src="/img/Vector.png" alt="Vector" />
                  <a href="https://www.siamvit.in/">
                    <Image height={50} width={160} src="/img/siam.png" alt="SiamVit" />
                  </a>
                </div>
              )}

              {Course.description?.sanitizedHtml && (
                <div className={`${ibmPlexMono.className} p-6 mt-6 border-l-4 border-blue-500 bg-blue-100 rounded-md`}>
                  <h2 className="text-xl font-bold text-blue-700">Note:</h2>
                  <div className="text-gray-800" dangerouslySetInnerHTML={{ __html: Course.description.sanitizedHtml }} />
                </div>
              )}

              <div className="mt-6 max-w-6xl">
                <Modules modules={Course.modules} />
              </div>

              {Course.pdfs.length > 0 && (
                <div className="mt-6">
                  <div className={`${ibmPlexMono.className} p-6 rounded-lg`}>
                    <h3 className="text-lg font-bold uppercase text-black">Materials</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                      {Course.pdfs.map((pdf) => (
                        <div className="bg-white p-4 shadow-md rounded-lg hover:bg-blue-300" key={pdf.name}>
                          <h4 className="text-center font-bold text-gray-800">{pdf.name}</h4>
                          <iframe
                            src={pdf.link}
                            className="w-full h-56 mt-4 border rounded-lg"
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
  );
}