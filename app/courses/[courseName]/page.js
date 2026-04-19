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
  const prop = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/courses/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ courseCode }),
    cache: "no-store",
  });
  return prop.json();
}

export default async function Page({ params }) {
  const courseCode = params.courseName?.toUpperCase();
  const { props } = await getData(courseCode);
  const { Course, errors } = props;
  const course = Course || null;

  const courseModules = Array.isArray(course?.modules) ? course.modules : [];
  const courseLinks = Array.isArray(course?.links) ? course.links : [];
  const courseDAs = Array.isArray(course?.DAs) ? course.DAs : [];
  const courseVideos = Array.isArray(course?.videos) ? course.videos : [];

  return (
    <div className="break-words bg-[#1E1E1E] text-[#ABCFED]">
      <Head>
        <title>StudyHub | {course?.code || courseCode}</title>
      </Head>

      <div className="relative">
        <div className="max-w-7xl mx-auto p-6 rounded-lg mt-6">
          {errors || !course ? (
            <div className="text-center py-10">
              <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-[#ABCFED]">
                {errors || "Course not found!"}
              </h1>
            </div>
          ) : (
            <>
              <div className={`${poppins.className} border-b border-[#ABCFED] pb-4`}>
                <div className="flex justify-between items-center">
                  <h1 className="text-4xl font-extrabold text-[#ABCFED]">
                    {course.name} ({course.code})
                  </h1>
                </div>
                <h3 className="text-lg font-semibold text-[#ABCFED] text-right mt-2">
                  Credits: {course.credits}
                </h3>
              </div>

              {["MAT2001", "MAT2002", "BMAT102L"].includes(course.code) && (
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

              {course.description && (
                <div className={`${ibmPlexMono.className} p-6 mt-6 border-l-4 rounded-md`}>
                  <h2 className="text-xl font-bold text-[#ABCFED]">Note:</h2>
                  <p className="text-[#ABCFED] whitespace-pre-line">{course.description}</p>
                </div>
              )}

              <div className="flex flex-col items-center mt-6">
                <div className="w-full max-w-6xl">
                  <Modules modules={courseModules} />
                </div>
              </div>

              <div className="flex flex-col items-center mt-6">
                <div className="w-full max-w-6xl">
                  <div className={`${ibmPlexMono.className} p-4 mx-auto rounded-lg bg-[#ABCFED] shadow-md max-w-5xl`}>
                    <h3 className="text-lg font-bold uppercase text-black mb-4">Course Resources</h3>
                    
                    {courseLinks.length > 0 && (
                      <div className="mb-6">
                        <h4 className="font-bold text-[#16171C] mb-2">Important Links</h4>
                        <div className="grid grid-cols-1 gap-2">
                          {courseLinks.map((link, idx) => (
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

                    {courseDAs.length > 0 && (
                      <div className="mb-6">
                        <h4 className="font-bold text-[#16171C] mb-2">Digital Assignments</h4>
                        <div className="grid grid-cols-1 gap-2">
                          {courseDAs.map((da, idx) => (
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

                    {courseVideos.length > 0 && (
                      <div>
                        <h4 className="font-bold text-[#16171C] mb-2">Course Videos</h4>
                        <div className="grid grid-cols-1 gap-2">
                          {courseVideos.map((video, idx) => (
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
      </div>
    </div>
  );
}
