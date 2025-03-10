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

async function getData(courseCode) {
  const prop = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/courses/`, {
    method: "POST",
    body: JSON.stringify({ courseCode }),
  });
  return prop.json();
}

export default async function Page({ params }) {
  const { props } = await getData(params.courseName);
  const { Course, errors } = props;

  return (
    <div className="break-words bg-[#1E1E1E] text-[#ABCFED]">
      <Head>
        <title>StudyHub | {Course.code}</title>
      </Head>

      <div className={`${ibmPlexMono.className} min-h-screen flex flex-col items-center justify-center bg-[#1E1E1E]`}>
        <div className="p-6 w-full flex flex-col items-center">
          <h1 className="text-center mb-3 text-red-500 font-bold text-xl">
            {/* No courses found for {branchName} */}
            Coming Soon...
          </h1>
        </div>
      </div>
     
      {/* <div className="relative">
        <div className="max-w-7xl mx-auto p-6 rounded-lg mt-6">
          {errors ? (
            <div className="text-center py-10">
              <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-[#ABCFED]">
                {errors}
              </h1>
            </div>
          ) : (
            <>
              <div className={`${poppins.className} border-b border-[#ABCFED] pb-4`}>
                <div className="flex justify-between items-center">
                  <h1 className="text-4xl font-extrabold text-[#ABCFED]">
                    {Course.name} ({Course.code})
                  </h1>
                </div>
                <h3 className="text-lg font-semibold text-[#ABCFED] text-right mt-2">
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
                <div className={`${ibmPlexMono.className} p-6 mt-6 border-l-4 rounded-md`}>
                  <h2 className="text-xl font-bold text-[#ABCFED]">Note:</h2>
                  <div className="text-[#ABCFED]" dangerouslySetInnerHTML={{ __html: Course.description.sanitizedHtml }} />
                </div>
              )}

              <div className="flex flex-col items-center mt-6">
                <div className="w-full max-w-6xl">
                  <Modules modules={Course.modules} />
                </div>
              </div>

              <div className="flex flex-col items-center mt-6">
                <div className="w-full max-w-6xl">
                  <div className={`${ibmPlexMono.className} p-4 mx-auto rounded-lg bg-[#ABCFED] shadow-md max-w-5xl`}>
                    <h3 className="text-lg font-bold uppercase text-black mb-4">Course Resources</h3>
                    
                    {Course.links.length > 0 && (
                      <div className="mb-6">
                        <h4 className="font-bold text-[#16171C] mb-2">Important Links</h4>
                        <div className="grid grid-cols-1 gap-2">
                          {Course.links.map((link, idx) => (
                            <a
                              key={idx}
                              href={link.url}
                              className="text-blue-600 hover:underline"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {link.text}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {Course.DAs.length > 0 && (
                      <div className="mb-6">
                        <h4 className="font-bold text-[#16171C] mb-2">Digital Assignments</h4>
                        <div className="grid grid-cols-1 gap-2">
                          {Course.DAs.map((da, idx) => (
                            <a
                              key={idx}
                              href={da.url}
                              className="text-blue-600 hover:underline"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {da.text}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {Course.videos.length > 0 && (
                      <div>
                        <h4 className="font-bold text-[#16171C] mb-2">Course Videos</h4>
                        <div className="grid grid-cols-1 gap-2">
                          {Course.videos.map((video, idx) => (
                            <a
                              key={idx}
                              href={video.url}
                              className="text-blue-600 hover:underline"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {video.text}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div> */}
    </div>
  );
}
