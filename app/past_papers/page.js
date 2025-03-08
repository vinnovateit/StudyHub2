"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const PastPapers = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    examType: '',
    slot: ''
  });
  
  // Updated sample data with paperCode and imageUrl
  const papers = [
    {
      id: 1,
      subject: "Computer Science Fundamentals",
      courseCode: "CS101",
      paperCode: "CS101-CAT1-F24-A1",
      examType: "CAT 1",
      slot: "A1",
      semester: "Fall",
      year: "2024",
      imageUrl: "/api/placeholder/400/250",
      previewText: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed facilisis tempor vestibulum."
    },
    {
      id: 2,
      subject: "Data Structures",
      courseCode: "CS201",
      paperCode: "CS201-MID-S24-B2",
      examType: "Midterm",
      slot: "B2",
      semester: "Spring",
      year: "2024",
      imageUrl: "/api/placeholder/400/250",
      previewText: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed facilisis tempor vestibulum."
    },
    {
      id: 3,
      subject: "Algorithms Analysis",
      courseCode: "CS301",
      paperCode: "CS301-FAT-S23-C1",
      examType: "FAT",
      slot: "C1+TC1",
      semester: "Summer",
      year: "2023",
      imageUrl: "/api/placeholder/400/250",
      previewText: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed facilisis tempor vestibulum."
    },
    {
      id: 4,
      subject: "Database Systems",
      courseCode: "IT202",
      paperCode: "IT202-CAT2-F23-D2",
      examType: "CAT 2",
      slot: "D2",
      semester: "Fall",
      year: "2023",
      imageUrl: "/api/placeholder/400/250",
      previewText: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed facilisis tempor vestibulum."
    },
    {
      id: 5,
      subject: "Web Development",
      courseCode: "IT305",
      paperCode: "IT305-MID-S24-E1",
      examType: "Midterm",
      slot: "E1+TE1",
      semester: "Spring",
      year: "2024",
      imageUrl: "/api/placeholder/400/250",
      previewText: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed facilisis tempor vestibulum."
    },
    {
      id: 6,
      subject: "Machine Learning",
      courseCode: "DS401",
      paperCode: "DS401-FAT-S24-G2",
      examType: "FAT",
      slot: "G2+TG2",
      semester: "Summer",
      year: "2024",
      imageUrl: "/api/placeholder/400/250",
      previewText: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed facilisis tempor vestibulum."
    }
  ];

  // Handle view paper click
  const handleViewPaper = (paperCode) => {
    router.push(`/view_paper/${paperCode}`);
  };

  // Unique values for filters
  const examTypes = [...new Set(papers.map(paper => paper.examType))];
  const slots = [...new Set(papers.map(paper => paper.slot))];

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    setFilters({
      ...filters,
      [filterType]: value
    });
  };

  // Filter papers based on search term and filters
  const filteredPapers = papers.filter(paper => {
    // Search term filter
    const matchesSearch = 
      paper.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      paper.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      paper.examType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      paper.slot.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Exam type filter
    const matchesExamType = filters.examType === '' || paper.examType === filters.examType;
    
    // Slot filter
    const matchesSlot = filters.slot === '' || paper.slot === filters.slot;
    
    return matchesSearch && matchesExamType && matchesSlot;
  });

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-900 text-white p-6">
      <div className="w-full max-w-6xl">
        <h1 className="text-4xl font-bold text-center mb-6 text-blue-300">Past Papers</h1>
        
        {/* Search Bar - More rounded corners and blue border */}
        <div className="mb-4 w-full">
          <input
            type="text"
            placeholder="Search papers by subject, course code, exam type or slot..."
            className="w-full p-3 rounded-full bg-gray-800 border border-blue-400 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {/* Filters */}
        <div className="mb-8 flex flex-wrap gap-4">
          {/* Exam Type Filter */}
          <div className="w-full md:w-auto">
            <select 
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white"
              value={filters.examType}
              onChange={(e) => handleFilterChange('examType', e.target.value)}
            >
              <option value="">All Exam Types</option>
              {examTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          
          {/* Slot Filter */}
          <div className="w-full md:w-auto">
            <select 
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white"
              value={filters.slot}
              onChange={(e) => handleFilterChange('slot', e.target.value)}
            >
              <option value="">All Slots</option>
              {slots.map((slot) => (
                <option key={slot} value={slot}>{slot}</option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Module Grid - Blue gradient backgrounds */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPapers.map((paper, index) => {
            // Create different gradients for visual variety
            const gradients = [
              "bg-gradient-to-br from-blue-500 to-blue-900",
              "bg-gradient-to-r from-blue-400 to-blue-800",
              "bg-gradient-to-tr from-blue-600 to-blue-900"
            ];
            
            const gradientClass = gradients[index % gradients.length];
            
            return (
              <div 
                key={paper.id} 
                className={`${gradientClass} rounded-lg overflow-hidden flex flex-col justify-between bg-opacity-20`}
              >
                {/* Paper Preview Image */}
                <div className="relative h-40 w-full overflow-hidden">
                  <img 
                    src={paper.imageUrl} 
                    alt={`Preview of ${paper.subject}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-20"></div>
                </div>
                
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-1">{paper.subject}</h3>
                  
                  <div className="text-sm mb-4">
                    <div><span className="text-blue-200 font-medium">Course Code:</span> {paper.courseCode}</div>
                    <div><span className="text-blue-200 font-medium">Exam Type:</span> {paper.examType}</div>
                    <div><span className="text-blue-200 font-medium">Slot:</span> {paper.slot}</div>
                    <div><span className="text-blue-200 font-medium">Semester:</span> {paper.semester} {paper.year}</div>
                  </div>
                  
                  <button 
                    className="bg-white text-blue-800 hover:bg-blue-100 py-2 px-4 rounded-md text-sm self-start transition-colors duration-200 font-medium"
                    onClick={() => handleViewPaper(paper.paperCode)}
                  >
                    View Paper
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        
        {filteredPapers.length === 0 && (
          <div className="text-center py-10">
            <p>No papers found matching your search criteria.</p>
          </div>
        )}
      </div>
      
      {/* Decorative Dots (Right side like in the image) */}
      <div className="hidden lg:block absolute right-4 top-1/2 transform -translate-y-1/2">
        <div className="flex flex-col gap-1">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="flex gap-1">
              {[...Array(3)].map((_, j) => (
                <div key={j} className="w-1 h-1 bg-gray-600 rounded-full"></div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PastPapers;