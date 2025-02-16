"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function EditorialHub() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/editorial/login"); // Redirect if no token
    } else {
      setIsAuthenticated(true);
    }
  }, []);

  if (!isAuthenticated) return null; // Prevent rendering until authentication check

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
      <button
        onClick={() => {
          localStorage.removeItem("token");
          router.push("/editorial/login");
        }}
        className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
      >
        Logout
      </button>
    </div>
  );
}
