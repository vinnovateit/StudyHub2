"use client"

import { useState } from 'react';

export default function PaperForm({ onSubmit, initialData = {} }) {
  const [formData, setFormData] = useState({
    subject: initialData.subject || '',
    courseCode: initialData.courseCode || '',
    examType: initialData.examType || '',
    slot: initialData.slot || '',
    semester: initialData.semester || '',
    year: initialData.year || new Date().getFullYear(),
    pdfFile: null,
    fileName: initialData.fileName || '',
  });

  const [errors, setErrors] = useState({});
  const [filePreview, setFilePreview] = useState(initialData.pdfLink || null);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (type === 'file') {
      const file = files[0];
      if (file && file.type === 'application/pdf') {
        setFormData({
          ...formData,
          pdfFile: file,
          fileName: file.name
        });
        
        // Create a URL for preview
        const fileUrl = URL.createObjectURL(file);
        setFilePreview(fileUrl);
        
        // Clear error if it exists
        if (errors.pdfFile) {
          setErrors({
            ...errors,
            pdfFile: null,
          });
        }
      } else if (file) {
        setErrors({
          ...errors,
          pdfFile: 'Only PDF files are allowed'
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value,
      });
      
      // Clear error for this field when user edits it
      if (errors[name]) {
        setErrors({
          ...errors,
          [name]: null,
        });
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.courseCode.trim()) newErrors.courseCode = 'Course code is required';
    if (!formData.examType) newErrors.examType = 'Exam type is required';
    if (!formData.semester) newErrors.semester = 'Semester is required';
    if (!formData.year) newErrors.year = 'Year is required';
    if (!formData.pdfFile && !initialData.pdfLink) newErrors.pdfFile = 'PDF file is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Create a FormData object to handle file upload
      const submitData = new FormData();
      
      // Add all form fields to FormData
      Object.keys(formData).forEach(key => {
        if (key === 'pdfFile' && formData[key]) {
          submitData.append('pdfFile', formData[key]);
        } else if (key !== 'pdfFile') {
          submitData.append(key, formData[key]);
        }
      });
      
      onSubmit(submitData);
    }
  };
  
  const removeFile = () => {
    setFormData({
      ...formData,
      pdfFile: null,
      fileName: ''
    });
    
    if (filePreview) {
      URL.revokeObjectURL(filePreview);
      setFilePreview(null);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Paper Submission Form</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Subject */}
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
              Subject *
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className={`w-full p-2 border rounded-md ${errors.subject ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.subject && <p className="mt-1 text-sm text-red-600">{errors.subject}</p>}
          </div>

          {/* Course Code */}
          <div>
            <label htmlFor="courseCode" className="block text-sm font-medium text-gray-700 mb-1">
              Course Code *
            </label>
            <input
              type="text"
              id="courseCode"
              name="courseCode"
              value={formData.courseCode}
              onChange={handleChange}
              className={`w-full p-2 border rounded-md ${errors.courseCode ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.courseCode && <p className="mt-1 text-sm text-red-600">{errors.courseCode}</p>}
          </div>

          {/* Exam Type */}
          <div>
            <label htmlFor="examType" className="block text-sm font-medium text-gray-700 mb-1">
              Exam Type *
            </label>
            <select
              id="examType"
              name="examType"
              value={formData.examType}
              onChange={handleChange}
              className={`w-full p-2 border rounded-md ${errors.examType ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="">Select Exam Type</option>
              <option value="CAT1">CAT1</option>
              <option value="CAT2">CAT2</option>
              <option value="FAT">FAT</option>
              <option value="Quiz">Quiz</option>
            </select>
            {errors.examType && <p className="mt-1 text-sm text-red-600">{errors.examType}</p>}
          </div>

          {/* Slot */}
          <div>
            <label htmlFor="slot" className="block text-sm font-medium text-gray-700 mb-1">
              Slot
            </label>
            <input
              type="text"
              id="slot"
              name="slot"
              value={formData.slot}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          {/* Semester */}
          <div>
            <label htmlFor="semester" className="block text-sm font-medium text-gray-700 mb-1">
              Semester *
            </label>
            <select
              id="semester"
              name="semester"
              value={formData.semester}
              onChange={handleChange}
              className={`w-full p-2 border rounded-md ${errors.semester ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="">Select Semester</option>
              <option value="Fall">Fall</option>
              <option value="Winter">Winter</option>
            </select>
            {errors.semester && <p className="mt-1 text-sm text-red-600">{errors.semester}</p>}
          </div>

          {/* Year */}
          <div>
            <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
              Year *
            </label>
            <input
              type="number"
              id="year"
              name="year"
              value={formData.year}
              onChange={handleChange}
              className={`w-full p-2 border rounded-md ${errors.year ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.year && <p className="mt-1 text-sm text-red-600">{errors.year}</p>}
          </div>

          {/* PDF File Upload */}
          <div className="md:col-span-2">
            <label htmlFor="pdfFile" className="block text-sm font-medium text-gray-700 mb-1">
              PDF File *
            </label>
            <div className={`border-2 border-dashed p-4 rounded-md ${errors.pdfFile ? 'border-red-500' : 'border-gray-300'}`}>
              <div className="flex flex-col items-center justify-center space-y-2">
                {!filePreview ? (
                  <>
                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                    </svg>
                    <p className="text-sm text-gray-500">Drag and drop your PDF file here, or</p>
                    <label className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer">
                      <span>Browse Files</span>
                      <input
                        type="file"
                        id="pdfFile"
                        name="pdfFile"
                        accept="application/pdf"
                        onChange={handleChange}
                        className="hidden"
                      />
                    </label>
                  </>
                ) : (
                  <div className="w-full">
                    <div className="flex items-center justify-between p-2 bg-gray-100 rounded">
                      <div className="flex items-center space-x-2">
                        <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                        </svg>
                        <span className="text-sm truncate max-w-xs">{formData.fileName}</span>
                      </div>
                      <button
                        type="button"
                        onClick={removeFile}
                        className="text-red-500 hover:text-red-700"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                      </button>
                    </div>
                    <div className="mt-2">
                      <a 
                        href={filePreview} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        Preview PDF
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
            {errors.pdfFile && <p className="mt-1 text-sm text-red-600">{errors.pdfFile}</p>}
          </div>
        </div>

        <div className="mt-8">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Submit Paper
          </button>
        </div>
      </form>
    </div>
  );
}