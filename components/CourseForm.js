"use client";

import React, { useState, useEffect } from 'react';

const CourseForm = ({ courseCode }) => {
  const [course, setCourse] = useState({
    name: '',
    code: '',
    credits: '',
    description: '',
    preview: '',
    modules: [],
    links: [],
    videos: [],
    DAs: []
  });

  const isEditMode = Boolean(courseCode);

  // Load existing course data when editing
  useEffect(() => {
    const loadCourse = async () => {
      if (courseCode) {
        try {
          const response = await fetch(`/api/courses/`, {
            method: 'POST',
            body: JSON.stringify({ courseCode }),
          });
          if (!response.ok) throw new Error('Failed to fetch course');
          const data = await response.json();
          setCourse(data.props.Course);
        } catch (error) {
          console.error('Error loading course:', error);
          alert('Failed to load course data');
        }
      }
    };

    loadCourse();
  }, [courseCode]);

  // Load from localStorage only when adding new course
  useEffect(() => {
    if (!isEditMode) {
      const savedData = localStorage.getItem('courseFormData');
      if (savedData) {
        try {
          setCourse(JSON.parse(savedData));
        } catch (error) {
          console.error('Error parsing saved course data:', error);
        }
      }
    }
  }, [isEditMode]);

  // Save to localStorage only when adding new course
  useEffect(() => {
    if (!isEditMode) {
      localStorage.setItem('courseFormData', JSON.stringify(course));
    }
  }, [course, isEditMode]);

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
      modules: [...course.modules, { title: '', description: '', topics: [] }]
    });
  };

  const updateModule = (index, field, value) => {
    const updatedModules = [...course.modules];
    updatedModules[index][field] = value;
    setCourse({
      ...course,
      modules: updatedModules
    });
  };

  const addTopic = (moduleIndex) => {
    const updatedModules = [...course.modules];
    updatedModules[moduleIndex].topics.push({
      name: '',
      description: '',
      pdfs: [],
      links: [],
      videos: []
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

  const addResourceItem = (resourceType) => {
    setCourse({
      ...course,
      [resourceType]: [...course[resourceType], { text: '', url: '' }]
    });
  };

  const updateResourceItem = (resourceType, index, field, value) => {
    const updatedResources = [...course[resourceType]];
    updatedResources[index][field] = value;
    setCourse({
      ...course,
      [resourceType]: updatedResources
    });
  };

  const clearForm = () => {
    if (window.confirm('Are you sure you want to clear all form data?')) {
      localStorage.removeItem('courseFormData');
      setCourse({
        name: '',
        code: '',
        credits: '',
        description: '',
        preview: '',
        modules: [],
        links: [],
        videos: [],
        DAs: []
      });
    }
  };

  const saveCourse = async () => {
    try {
      const endpoint = isEditMode ? '/api/auth/update-course' : '/api/auth/add-course';
      const method = isEditMode ? 'PATCH' : 'POST';

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(course),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to save course');
      }

      alert(isEditMode ? 'Course updated successfully!' : 'Course added successfully!');
      
      // Clear form only when adding new course
      if (!isEditMode) {
        clearForm();
      }
    } catch (error) {
      console.error('Error saving course:', error);
      alert(error.message || 'Failed to save course');
    }
  };

  const addModuleResource = (moduleIndex, resourceType) => {
    const updatedModules = [...course.modules];
    if (!updatedModules[moduleIndex][resourceType]) {
      updatedModules[moduleIndex][resourceType] = [];
    }
    updatedModules[moduleIndex][resourceType].push({ text: '', url: '' });
    setCourse({
      ...course,
      modules: updatedModules
    });
  };

  const updateModuleResource = (moduleIndex, resourceType, resourceIndex, field, value) => {
    const updatedModules = [...course.modules];
    updatedModules[moduleIndex][resourceType][resourceIndex][field] = value;
    setCourse({
      ...course,
      modules: updatedModules
    });
  };

  const addTopicResource = (moduleIndex, topicIndex, resourceType) => {
    const updatedModules = [...course.modules];
    if (!updatedModules[moduleIndex].topics[topicIndex][resourceType]) {
      updatedModules[moduleIndex].topics[topicIndex][resourceType] = [];
    }
    updatedModules[moduleIndex].topics[topicIndex][resourceType].push({ text: '', url: '' });
    setCourse({
      ...course,
      modules: updatedModules
    });
  };

  const updateTopicResource = (moduleIndex, topicIndex, resourceType, resourceIndex, field, value) => {
    const updatedModules = [...course.modules];
    updatedModules[moduleIndex].topics[topicIndex][resourceType][resourceIndex][field] = value;
    setCourse({
      ...course,
      modules: updatedModules
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">{isEditMode ? 'Edit Course' : 'Create New Course'}</h1>
      
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Credits:
          </label>
          <input
            type="number"
            name="credits"
            value={course.credits}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Preview:
          </label>
          <textarea
            name="preview"
            value={course.preview}
            onChange={handleInputChange}
            rows="2"
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>

      {/* Course-level resources */}
      {['links', 'videos', 'DAs'].map((resourceType) => (
        <div key={resourceType} className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">
              {resourceType.charAt(0).toUpperCase() + resourceType.slice(1)}:
            </label>
            <button
              onClick={() => addResourceItem(resourceType)}
              className="px-2 py-1 bg-gray-200 text-gray-700 rounded-md text-xs hover:bg-gray-300"
            >
              + Add {resourceType.slice(0, -1)}
            </button>
          </div>
          
          {course[resourceType].map((item, index) => (
            <div key={index} className="mb-3 grid grid-cols-1 md:grid-cols-2 gap-2">
              <input
                type="text"
                value={item.url}
                onChange={(e) => updateResourceItem(resourceType, index, 'url', e.target.value)}
                placeholder="URL"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              <input
                type="text"
                value={item.text}
                onChange={(e) => updateResourceItem(resourceType, index, 'text', e.target.value)}
                placeholder="Text"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          ))}
        </div>
      ))}

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
              onChange={(e) => updateModule(moduleIndex, 'title', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Module Description:
            </label>
            <textarea
              value={module.description || ''}
              onChange={(e) => updateModule(moduleIndex, 'description', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              rows="2"
            />
          </div>
          
          {/* Module-level resources */}
          {['pdfs', 'links', 'videos'].map((resourceType) => (
            <div key={resourceType} className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Module {resourceType.charAt(0).toUpperCase() + resourceType.slice(1)}:
                </label>
                <button
                  onClick={() => addModuleResource(moduleIndex, resourceType)}
                  className="px-2 py-1 bg-gray-200 text-gray-700 rounded-md text-xs hover:bg-gray-300"
                >
                  + Add {resourceType.slice(0, -1)}
                </button>
              </div>
              
              {(module[resourceType] || []).map((item, resourceIndex) => (
                <div key={resourceIndex} className="mb-3 grid grid-cols-1 md:grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={item.url}
                    onChange={(e) => updateModuleResource(moduleIndex, resourceType, resourceIndex, 'url', e.target.value)}
                    placeholder="URL"
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                  <input
                    type="text"
                    value={item.text}
                    onChange={(e) => updateModuleResource(moduleIndex, resourceType, resourceIndex, 'text', e.target.value)}
                    placeholder="Text"
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
              ))}
            </div>
          ))}

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
                  Topic Name:
                </label>
                <input
                  type="text"
                  value={topic.name}
                  onChange={(e) => updateTopic(moduleIndex, topicIndex, 'name', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

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
              
              {/* Topic-level resources */}
              {['pdfs', 'links', 'videos'].map((resourceType) => (
                <div key={resourceType} className="mb-3">
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Topic {resourceType.charAt(0).toUpperCase() + resourceType.slice(1)}:
                    </label>
                    <button
                      onClick={() => addTopicResource(moduleIndex, topicIndex, resourceType)}
                      className="px-2 py-1 bg-gray-200 text-gray-700 rounded-md text-xs hover:bg-gray-300"
                    >
                      + Add {resourceType.slice(0, -1)}
                    </button>
                  </div>
                  
                  {(topic[resourceType] || []).map((item, resourceIndex) => (
                    <div key={resourceIndex} className="mb-3 grid grid-cols-1 md:grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={item.url}
                        onChange={(e) => updateTopicResource(moduleIndex, topicIndex, resourceType, resourceIndex, 'url', e.target.value)}
                        placeholder="URL"
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                      <input
                        type="text"
                        value={item.text}
                        onChange={(e) => updateTopicResource(moduleIndex, topicIndex, resourceType, resourceIndex, 'text', e.target.value)}
                        placeholder="Text"
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
      
      <div className="mt-6 flex space-x-3">
        <button
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          onClick={saveCourse}
        >
          {isEditMode ? 'Update Course' : 'Save Course'}
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