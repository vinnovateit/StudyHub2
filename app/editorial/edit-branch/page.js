'use client';

import { useState, useEffect } from 'react';

export default function EditBranchForm() {
  const [branchName, setBranchName] = useState('');
  const [branches, setBranches] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState('');

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

  const handleBranchSelection = (e) => {
    const selectedBranchName = e.target.value;
    setSelectedBranch(selectedBranchName);
    
    // Find the selected branch and update the form
    const branch = branches.find(b => b.name === selectedBranchName);
    if (branch) {
      setBranchName(branch.name);
      setSelectedCourses(branch.courses || []); // Assuming courses are stored in the branch object
    } else {
      setBranchName('');
      setSelectedCourses([]);
    }
  };

  const handleCourseSelection = (courseId) => {
    setSelectedCourses((prev) => {
      const isSelected = prev.includes(courseId);
      if (isSelected) {
        return prev.filter((id) => id !== courseId);
      } else {
        return [...prev, courseId];
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!branchName.trim()) {
      alert('Please enter a branch name');
      return;
    }

    console.log('Branch Name:', branchName);
    console.log('Selected Courses:', selectedCourses);

    // Reset the form after submission
    setBranchName('');
    setSelectedCourses([]);
    setSelectedBranch('');
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Edit Branch</h1>
      
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
                    id={`course-${course.id}`}
                    checked={selectedCourses.includes(course.id)}
                    onChange={() => handleCourseSelection(course.id)}
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
  );
}