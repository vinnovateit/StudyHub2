import Link from 'next/link';

export default function AddBranch() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-4">Add Branch Form</h1>
      <Link href="edit-hub">
        <p className="text-blue-400 hover:text-blue-600 text-xl">Back to Editorial Hub</p>
      </Link>
    </div>
  );
}


