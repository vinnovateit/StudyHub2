import Head from "next/head";
import BranchContent from "../../../components/BranchContent";

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
  const { props } = await getData(params.branchName);
  const { subjects, errors } = props;

  return (
    <>
      <Head>
        <title>{`BRANCH | ${params.branchName.toUpperCase()}`}</title>
      </Head>
      <BranchContent
        subjects={subjects}
        branchName={params.branchName}
        errors={errors}
      />
    </>
  );
}