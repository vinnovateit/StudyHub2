import Link from 'next/link';

export default function Login() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-4">Login Page</h1>
      <Link href="edit-hub">
        <p className="text-blue-400 hover:text-blue-600 text-xl">Go to Editorial Hub</p>
      </Link>
      <Link href="/">
        <p className="text-blue-400 hover:text-blue-600 text-xl">Back to Main</p>
      </Link>
    </div>
  );
}


