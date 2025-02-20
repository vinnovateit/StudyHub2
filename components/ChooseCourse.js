"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { IBM_Plex_Mono, Poppins } from "next/font/google";
import SearchBar from '@/components/SearchBar';

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function ChooseCourse() {
  const [courses, setCourses] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch all courses from the database
    const fetchCourses = async () => {
      try {
        const response = await fetch('/api/get-courses');
        if (!response.ok) {
          throw new Error('Failed to fetch courses');
        }
        const data = await response.json();
        setCourses(data);
        setLoading(false);
      } catch (err) {
        setError('Error loading courses. Please try again later.');
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const filteredCourses = courses.filter(course => {
    const searchQuery = searchText.toLowerCase();
    return (
      course.name?.toLowerCase().includes(searchQuery) ||
      course.code?.toLowerCase().includes(searchQuery)
    );
  });

  return (
    <div className={`${ibmPlexMono.className} min-h-screen flex flex-col items-center`}>
      <div className="p-6 w-full flex flex-col items-center">
        <h1 className={`${poppins.className} text-4xl font-bold mb-6 text-center`}>All Courses</h1>
        
        <div className="flex justify-center mb-6 w-full max-w-md">
          <SearchBar 
            searchText={searchText}
            setSearchText={setSearchText}
          />
        </div>

        {loading ? (
          <div className="text-xl">Loading courses...</div>
        ) : error ? (
          <div className="text-red-400 text-xl">{error}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 place-items-center w-full max-w-7xl">
            {filteredCourses.length > 0 ? (
              filteredCourses.map((course) => (
                <div
                  key={course._id}
                  className="relative bg-gray-800 rounded-xl border border-gray-700 w-[310px] h-[200px] text-sm p-6 flex flex-col"
                >
                  <h4 className="font-extrabold text-lg text-white">
                    {course.name}
                  </h4>
                  <p className="text-gray-300">
                    <span className="font-semibold">Course Code:</span>{" "}
                    {course.code}
                  </p>
                  
                  <div className="mt-auto">
                    <a
                      href={`edit-course/edit-form/${course._id}`}
                      className="block text-center bg-blue-600 text-white font-medium rounded-md py-2 hover:bg-blue-700 transition"
                    >
                      Edit
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center text-xl mt-8">
                No courses match your search
              </div>
            )}
          </div>
        )}

        <Link href="/edit-hub" className="mt-8 text-blue-400 hover:text-blue-300 text-xl">
          Back to Editorial Hub
        </Link>
      </div>
    </div>
  );
}