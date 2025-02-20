"use client";

import React, { useState, useEffect } from 'react';

const CourseForm = () => {
  const [course, setCourse] = useState({
    name: '',
    code: '',
    description: '',
    modules: []
  });

  // Load from localStorage when component mounts
  useEffect(() => {
    const savedData = localStorage.getItem('courseFormData');
    if (savedData) {
      try {
        setCourse(JSON.parse(savedData));
      } catch (error) {
        console.error('Error parsing saved course data:', error);
      }
    }
  }, []);

  // Save to localStorage whenever course data changes
  useEffect(() => {
    localStorage.setItem('courseFormData', JSON.stringify(course));
  }, [course]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCourse({
      ...course,
      [name]: value
    });
  };

  const addModule = () => {
    setCourse({
      ...course,
      modules: [...course.modules, { title: '', topics: [] }]
    });
  };

  const updateModule = (index, value) => {
    const updatedModules = [...course.modules];
    updatedModules[index].title = value;
    setCourse({
      ...course,
      modules: updatedModules
    });
  };

  const addTopic = (moduleIndex) => {
    const updatedModules = [...course.modules];
    updatedModules[moduleIndex].topics.push({
      description: '',
      pdfs: [],
      links: [],
      images: []
    });
    setCourse({
      ...course,
      modules: updatedModules
    });
  };

  const updateTopic = (moduleIndex, topicIndex, field, value) => {
    const updatedModules = [...course.modules];
    updatedModules[moduleIndex].topics[topicIndex][field] = value;
    setCourse({
      ...course,
      modules: updatedModules
    });
  };

  const addPdf = (moduleIndex, topicIndex) => {
    const updatedModules = [...course.modules];
    updatedModules[moduleIndex].topics[topicIndex].pdfs.push('');
    setCourse({
      ...course,
      modules: updatedModules
    });
  };

  const updatePdf = (moduleIndex, topicIndex, pdfIndex, value) => {
    const updatedModules = [...course.modules];
    updatedModules[moduleIndex].topics[topicIndex].pdfs[pdfIndex] = value;
    setCourse({
      ...course,
      modules: updatedModules
    });
  };

  const addLink = (moduleIndex, topicIndex) => {
    const updatedModules = [...course.modules];
    updatedModules[moduleIndex].topics[topicIndex].links.push({
      url: '',
      text: ''
    });
    setCourse({
      ...course,
      modules: updatedModules
    });
  };

  const updateLink = (moduleIndex, topicIndex, linkIndex, field, value) => {
    const updatedModules = [...course.modules];
    updatedModules[moduleIndex].topics[topicIndex].links[linkIndex][field] = value;
    setCourse({
      ...course,
      modules: updatedModules
    });
  };

  const addImage = (moduleIndex, topicIndex) => {
    const updatedModules = [...course.modules];
    updatedModules[moduleIndex].topics[topicIndex].images.push({
      url: '',
      caption: ''
    });
    setCourse({
      ...course,
      modules: updatedModules
    });
  };

  const updateImage = (moduleIndex, topicIndex, imageIndex, field, value) => {
    const updatedModules = [...course.modules];
    updatedModules[moduleIndex].topics[topicIndex].images[imageIndex][field] = value;
    setCourse({
      ...course,
      modules: updatedModules
    });
  };

  const clearForm = () => {
    if (window.confirm('Are you sure you want to clear all form data?')) {
      localStorage.removeItem('courseFormData');
      setCourse({
        name: '',
        code: '',
        description: '',
        modules: []
      });
    }
  };

  const saveCourse = async () => {
    try {
      // Here you would typically make an API call to save the data
      // For example: await api.saveCourse(course);
      console.log('Course saved:', course);
      // Show success message to user
      alert('Course saved successfully!');
    } catch (error) {
      console.error('Error saving course:', error);
      alert('Failed to save course');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Create New Course</h1>
      
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name of Course:
          </label>
          <input
            type="text"
            name="name"
            value={course.name}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Course Code:
          </label>
          <input
            type="text"
            name="code"
            value={course.code}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description:
          </label>
          <textarea
            name="description"
            value={course.description}
            onChange={handleInputChange}
            rows="3"
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>
      
      <div className="mb-6">
        <button
          onClick={addModule}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 mr-3"
        >
          Add Module
        </button>
      </div>
      
      {course.modules.map((module, moduleIndex) => (
        <div key={moduleIndex} className="border border-gray-200 rounded-md p-4 mb-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Module Title:
            </label>
            <input
              type="text"
              value={module.title}
              onChange={(e) => updateModule(moduleIndex, e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div className="mb-4">
            <button
              onClick={() => addTopic(moduleIndex)}
              className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
            >
              Add Topic
            </button>
          </div>
          
          {module.topics.map((topic, topicIndex) => (
            <div key={topicIndex} className="ml-4 border-l-2 border-gray-200 pl-4 mb-4">
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Topic Description:
                </label>
                <textarea
                  value={topic.description}
                  onChange={(e) => updateTopic(moduleIndex, topicIndex, 'description', e.target.value)}
                  rows="2"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div className="mb-3">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    PDFs:
                  </label>
                  <button
                    onClick={() => addPdf(moduleIndex, topicIndex)}
                    className="px-2 py-1 bg-gray-200 text-gray-700 rounded-md text-xs hover:bg-gray-300"
                  >
                    + Add PDF
                  </button>
                </div>
                
                {topic.pdfs.map((pdf, pdfIndex) => (
                  <div key={pdfIndex} className="mb-2">
                    <input
                      type="text"
                      value={pdf}
                      onChange={(e) => updatePdf(moduleIndex, topicIndex, pdfIndex, e.target.value)}
                      placeholder="PDF file or URL"
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                ))}
              </div>
              
              <div className="mb-3">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Links:
                  </label>
                  <button
                    onClick={() => addLink(moduleIndex, topicIndex)}
                    className="px-2 py-1 bg-gray-200 text-gray-700 rounded-md text-xs hover:bg-gray-300"
                  >
                    + Add Link
                  </button>
                </div>
                
                {topic.links.map((link, linkIndex) => (
                  <div key={linkIndex} className="mb-3 grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div>
                      <input
                        type="text"
                        value={link.url}
                        onChange={(e) => updateLink(moduleIndex, topicIndex, linkIndex, 'url', e.target.value)}
                        placeholder="URL"
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        value={link.text}
                        onChange={(e) => updateLink(moduleIndex, topicIndex, linkIndex, 'text', e.target.value)}
                        placeholder="Link Text"
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mb-3">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Images:
                  </label>
                  <button
                    onClick={() => addImage(moduleIndex, topicIndex)}
                    className="px-2 py-1 bg-gray-200 text-gray-700 rounded-md text-xs hover:bg-gray-300"
                  >
                    + Add Image
                  </button>
                </div>
                
                {topic.images && topic.images.map((image, imageIndex) => (
                  <div key={imageIndex} className="mb-3 grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div>
                      <input
                        type="text"
                        value={image.url}
                        onChange={(e) => updateImage(moduleIndex, topicIndex, imageIndex, 'url', e.target.value)}
                        placeholder="Image URL"
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        value={image.caption}
                        onChange={(e) => updateImage(moduleIndex, topicIndex, imageIndex, 'caption', e.target.value)}
                        placeholder="Image Caption"
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
      
      <div className="mt-6 flex space-x-3">
        <button
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          onClick={saveCourse}
        >
          Save Course
        </button>
        <button
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          onClick={clearForm}
        >
          Clear Form
        </button>
      </div>
    </div>
  );
};

export default CourseForm;