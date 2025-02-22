'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function AddBranchForm() {
  const [branchName, setBranchName] = useState('');
  const [courses, setCourses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [school, setSchool] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/get-courses');
        if (!response.ok) {
          throw new Error('Failed to fetch courses');
        }
        const data = await response.json();
        setCourses(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleCourseSelection = (courseId) => {
    setSelectedCourses((prev) => {
      // Check if the course is already selected
      const isSelected = prev.includes(courseId);
      
      if (isSelected) {
        // If selected, remove it from the array
        return prev.filter((id) => id !== courseId);
      } else {
        // If not selected, add it to the array
        return [...prev, courseId];
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    
    if (!branchName.trim() || !school.trim()) {
      alert('Please enter both branch name and school');
      return;
    }

    setIsSubmitting(true);
    try {
      const courseCodes = selectedCourses.map(courseId => 
        courses.find(c => c._id === courseId)?.code
      ).filter(Boolean);

      const response = await fetch('/api/auth/add-branch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: branchName,
          school,
          courseCodes,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add branch');
      }

      alert('Branch added successfully!');
      setBranchName('');
      setSchool('');
      setSelectedCourses([]);
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-8 mb-8">
      <div className="max-w-lg mx-auto mb-4">
        <Link href="/editorial/edit-hub" 
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Editorial Hub
        </Link>
      </div>
      <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Add New Branch</h1>
        
        {submitError && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {submitError}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="branchName" className="block text-sm font-medium text-gray-700 mb-2">
              Branch Name
            </label>
            <input
              type="text"
              id="branchName"
              value={branchName}
              onChange={(e) => setBranchName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter branch name"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="school" className="block text-sm font-medium text-gray-700 mb-2">
              School
            </label>
            <input
              type="text"
              id="school"
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter school name"
              required
            />
          </div>

          <div className="mb-6">
            <h2 className="text-sm font-medium text-gray-700 mb-2">Select Courses for this Branch:</h2>
            
            {isLoading && <div className="text-center py-4 text-gray-500">Loading courses...</div>}
            {error && <div className="text-center py-4 text-red-500">Error: {error}</div>}
            {!isLoading && !error && courses.length === 0 && <div className="text-center py-4 text-gray-500">No courses available.</div>}
            

           
            {!isLoading && !error && courses.length > 0 && (
              <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-md">
                {courses.map((course) => (
                  <div key={course.id} className="flex items-center px-4 py-2 border-b border-gray-100 last:border-b-0">
                   <input
                      type="checkbox"
                      id={`course-${course._id}`}
                      checked={selectedCourses.includes(course._id)}
                      onChange={() => handleCourseSelection(course._id)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`course-${course.id}`} className="ml-3 text-sm text-gray-700">
                      {course.name}
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
          >
            {isSubmitting ? 'Adding Branch...' : 'Add Branch'}
          </button>
        </form>
      </div>
    </div>
  );
}