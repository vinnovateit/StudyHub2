import Link from 'next/link';

export default function EditoralHub() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-4">Editorial Hub</h1>
      <Link href="add-branch">
        <p className="text-blue-400 hover:text-blue-600 text-xl">Add Branch Form</p>
      </Link>
      <Link href="add-course">
        <p className="text-blue-400 hover:text-blue-600 text-xl">Add Course Form</p>
      </Link>
      <Link href="edit-course">
        <p className="text-blue-400 hover:text-blue-600 text-xl">Edit Course Form</p>
      </Link>
      <Link href="login">
        <p className="text-blue-400 hover:text-blue-600 text-xl">Back to Login</p>
      </Link>
    </div>
  );
}
