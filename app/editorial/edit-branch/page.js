'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function EditBranchForm() {
  const [branchName, setBranchName] = useState('');
  const [branches, setBranches] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [submitMessage, setSubmitMessage] = useState('');
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('/api/get-courses');
        if (!response.ok) {
          throw new Error('Failed to fetch courses');
        }
        const data = await response.json();
        setCourses(data);
        setIsLoading(false);
      } catch (err) {
        setError('Error loading courses. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await fetch('/api/get-branch');
        if (!response.ok) {
          throw new Error('Failed to fetch branch');
        }
        const data = await response.json();
        setBranches(data);
        setIsLoading(false);
      } catch (err) {
        setError('Error loading branches. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchBranches();
  }, []);

  const handleBranchSelection = async (e) => {
    const selectedBranchName = e.target.value;
    setSelectedBranch(selectedBranchName);
    
    try {
      // Fetch branch data including subjects
      const response = await fetch('/api/branch/', {
        method: 'POST',
        body: JSON.stringify({ searchQuery: selectedBranchName }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch branch details');
      }

      const { props } = await response.json();
      const { subjects } = props;

      // Update form with branch data
      setBranchName(selectedBranchName);
      setSelectedCourses(subjects.map(subject => subject._id));
    } catch (err) {
      setError('Error loading branch details. Please try again later.');
      setBranchName('');
      setSelectedCourses([]);
    }
  };

  const handleCourseSelection = (courseId) => {
    setSelectedCourses((prev) => {
      const isSelected = prev.includes(courseId);
      if (isSelected) {
        console.log(courseId);
        return prev.filter((id) => id !== courseId);
        
      } else {
        return [...prev, courseId];
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitMessage('');
    setSubmitError('');
    
    if (!branchName.trim()) {
      setSubmitError('Please select a branch');
      return;
    }

    try {
      // Get course codes from selected course IDs
      const selectedCourseCodes = courses
        .filter(course => selectedCourses.includes(course._id))
        .map(course => course.code);

      const token = localStorage.getItem("token");
      const response = await fetch('/api/auth/update-branch', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          branchName: branchName,
          courseCodes: selectedCourseCodes,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update branch');
      }

      setSubmitMessage('Branch updated successfully!');
      
      // Reset form
      setBranchName('');
      setSelectedCourses([]);
      setSelectedBranch('');
      
    } catch (err) {
      setSubmitError(err.message || 'Error updating branch. Please try again.');
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
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Edit Branch</h1>
        
        {submitMessage && (
          <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">
            {submitMessage}
          </div>
        )}
        
        {submitError && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
            {submitError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="selectBranch" className="block text-sm font-medium text-gray-700 mb-2">
              Select Branch
            </label>
            <select
              id="selectBranch"
              value={selectedBranch}
              onChange={handleBranchSelection}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a branch</option>
              {branches.map((branch) => (
                <option key={branch.id} value={branch.name}>
                  {branch.name}
                </option>
              ))}
            </select>
          </div>

          {/* <div className="mb-6">
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
          </div> */}

          <div className="mb-6">
            <h2 className="text-sm font-medium text-gray-700 mb-2">Select Courses for this Branch:</h2>
            
            {isLoading && <div className="text-center py-4 text-gray-500">Loading...</div>}
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
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Edit Branch
          </button>
        </form>
      </div>
    </div>
  );
}