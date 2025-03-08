"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

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
    <div className="flex flex-col items-center min-h-screen bg-[#1E1E1E] text-white p-6">
      <div className="w-full max-w-6xl">
        {/* Updated header with Poppins font */}
        <h1 className="text-4xl font-bold text-center mb-6 text-blue-300 font-poppins">Past Papers</h1>
        
        {/* Search Bar - With the specific color and search icon */}
        <div className="mb-4 w-full relative">
          <div className="absolute top-0 bottom-0 left-4 flex items-center">
            <Search size={20} className="text-black" />
          </div>
          <input
            type="text"
            placeholder="Search papers by subject, course code, exam type or slot..."
            className="w-full p-3 pl-12 rounded-full bg-[#9FE5FF] text-black focus:outline-none focus:ring-2 focus:ring-[#9FE5FF]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {/* Filters */}
        <div className="mb-8 flex flex-wrap gap-4">
          {/* Exam Type Filter */}
          <div className="w-full md:w-auto">
            <select 
              className="w-full p-3 rounded-lg bg-[#1E1E1E] border border-[#9FE5FF] text-[#9FE5FF]"
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
              className="w-full p-3 rounded-lg bg-[#1E1E1E] border border-[#9FE5FF] text-[#9FE5FF]"
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
        
        {/* Module Grid - Using the specific color with smaller width boxes and centered content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {filteredPapers.map((paper) => (
            <div 
              key={paper.id} 
              className="bg-[#9FE5FF] rounded-lg overflow-hidden flex flex-col justify-between w-full max-w-xs"
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
                {/* Subject title remains in default font */}
                <h3 className="text-black font-bold text-lg mb-1">{paper.subject}</h3>
                
                {/* Content now using IBM Plex Mono font */}
                <div className="text-sm mb-4 text-black font-ibm-plex-mono">
                  <div><span className="font-medium">Course Code:</span> {paper.courseCode}</div>
                  <div><span className="font-medium">Exam Type:</span> {paper.examType}</div>
                  <div><span className="font-medium">Slot:</span> {paper.slot}</div>
                  <div><span className="font-medium">Semester:</span> {paper.semester} {paper.year}</div>
                </div>
                
                {/* Centered button */}
                <div className="flex justify-center w-full">
                  <button 
                    className="bg-blue-700 text-white font-bold hover:bg-opacity-80 py-2 px-4 rounded-md text-sm transition-colors duration-200"
                    onClick={() => handleViewPaper(paper.paperCode)}
                  >
                    View Paper
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {filteredPapers.length === 0 && (
          <div className="text-center py-10">
            <p>No papers found matching your search criteria.</p>
          </div>
        )}
      </div>
      
      {/* Font imports - add this to your head section or global CSS */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&display=swap');
        
        .font-poppins {
          font-family: 'Poppins', sans-serif;
        }
        
        .font-ibm-plex-mono {
          font-family: 'IBM Plex Mono', monospace;
        }
      `}</style>
    </div>
  );
};

export default PastPapers;