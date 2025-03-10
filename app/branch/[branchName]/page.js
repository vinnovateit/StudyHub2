import Head from "next/head";
import { IBM_Plex_Mono} from "next/font/google";
import BranchContent from "../../../components/BranchContent";

export async function generateMetadata({ params }) {
  if (params.branchName) {
    return {
      title: `BRANCH | ${params.branchName.toUpperCase()}`,
    };
  }
}

async function getData(s) {
  const prop = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/branch/`, {
    method: "POST",
    body: JSON.stringify({ searchQuery: s }),
  });
  return prop.json();
}

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default async function page({ params }) {
  const { props } = await getData(params.branchName);
  const { subjects, errors } = props;

  return (
    <>
      <Head>
        <title>{`BRANCH | ${params.branchName.toUpperCase()}`}</title>
      </Head>
      {/* <BranchContent
        subjects={subjects}
        branchName={params.branchName}
        errors={errors}
      /> */}
        <div className={`${ibmPlexMono.className} min-h-screen flex flex-col items-center justify-center bg-[#1E1E1E]`}>
        <div className="p-6 w-full flex flex-col items-center">
          <h1 className="text-center mb-3 text-red-500 font-bold text-xl">
            {/* No courses found for {branchName} */}
            Coming Soon...
          </h1>
        </div>
      </div>
    </>
  );
}