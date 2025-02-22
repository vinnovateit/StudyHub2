"use client";

import React, { useState, useEffect } from 'react';
import { FaRegTrashAlt } from "react-icons/fa";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import DraggableResourceItem from './DraggableResourceItem';

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

  const removeResourceItem = (resourceType, index) => {
    const updatedResources = [...course[resourceType]];
    updatedResources.splice(index, 1);
    setCourse({
      ...course,
      [resourceType]: updatedResources
    });
  };

  const removeModuleResource = (moduleIndex, resourceType, resourceIndex) => {
    const updatedModules = [...course.modules];
    updatedModules[moduleIndex][resourceType].splice(resourceIndex, 1);
    setCourse({
      ...course,
      modules: updatedModules
    });
  };

  const removeTopicResource = (moduleIndex, topicIndex, resourceType, resourceIndex) => {
    const updatedModules = [...course.modules];
    updatedModules[moduleIndex].topics[topicIndex][resourceType].splice(resourceIndex, 1);
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

  const removeModule = (moduleIndex) => {
    if (window.confirm('Are you sure you want to remove this module?')) {
      const updatedModules = [...course.modules];
      updatedModules.splice(moduleIndex, 1);
      setCourse({
        ...course,
        modules: updatedModules
      });
    }
  };

  const removeTopic = (moduleIndex, topicIndex) => {
    if (window.confirm('Are you sure you want to remove this topic?')) {
      const updatedModules = [...course.modules];
      updatedModules[moduleIndex].topics.splice(topicIndex, 1);
      setCourse({
        ...course,
        modules: updatedModules
      });
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event, resourceType) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      setCourse((prevCourse) => {
        const oldIndex = parseInt(active.id);
        const newIndex = parseInt(over.id);
        
        return {
          ...prevCourse,
          [resourceType]: arrayMove(prevCourse[resourceType], oldIndex, newIndex),
        };
      });
    }
  };

  const renderResources = (resourceType) => (
    <div key={resourceType} className="mt-3 p-3 bg-gray-50 rounded-md mb-4">
      <div className="flex justify-between items-center mb-2">
        <label className="block text-sm font-medium text-gray-700">
          Course {resourceType.charAt(0).toUpperCase() + resourceType.slice(1)}:
        </label>
        <button
          onClick={() => addResourceItem(resourceType)}
          className="px-2 py-1 bg-white border border-gray-300 text-gray-700 rounded-md text-xs hover:bg-gray-50"
        >
          + Add {resourceType.slice(0, -1)}
        </button>
      </div>
      
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={(event) => handleDragEnd(event, resourceType)}
      >
        <SortableContext
          items={course[resourceType].map((_, index) => index.toString())}
          strategy={verticalListSortingStrategy}
        >
          {course[resourceType].map((item, index) => (
            <DraggableResourceItem
              key={index}
              id={index.toString()}
              item={item}
              onUpdate={(field, value) => updateResourceItem(resourceType, index, field, value)}
              onRemove={() => removeResourceItem(resourceType, index)}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white rounded-lg shadow-md">
      <h1 className="text-xl font-bold mb-4">{isEditMode ? 'Edit Course' : 'Create New Course'}</h1>
      
      <div className="space-y-3 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-0.5">
            Name of Course:
          </label>
          <input
            type="text"
            name="name"
            value={course.name}
            onChange={handleInputChange}
            className="w-full p-1.5 border border-gray-300 rounded-md"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-0.5">
            Course Code:
          </label>
          <input
            type="text"
            name="code"
            value={course.code}
            onChange={handleInputChange}
            className="w-full p-1.5 border border-gray-300 rounded-md"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-0.5">
            Description:
          </label>
          <textarea
            name="description"
            value={course.description}
            onChange={handleInputChange}
            rows="3"
            className="w-full p-1.5 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-0.5">
            Credits:
          </label>
          <input
            type="number"
            name="credits"
            value={course.credits}
            onChange={handleInputChange}
            className="w-full p-1.5 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-0.5">
            Preview:
          </label>
          <textarea
            name="preview"
            value={course.preview}
            onChange={handleInputChange}
            rows="2"
            className="w-full p-1.5 border border-gray-300 rounded-md"
          />
        </div>
      </div>

      {/* Course-level resources */}
      {['links', 'videos', 'DAs'].map((resourceType) => renderResources(resourceType))}

      <div className="mb-4">
        <button
          onClick={addModule}
          className="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 mr-2 text-sm"
        >
          Add Module
        </button>
      </div>
      
      {course.modules.map((module, moduleIndex) => (
        <div key={moduleIndex} className="bg-white border border-blue-100 rounded-lg p-4 mb-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-blue-100 px-2 py-1 rounded-md text-sm font-medium text-blue-700">
              Module {moduleIndex + 1}
            </span>
            <button
              onClick={() => removeModule(moduleIndex)}
              className="px-1.5 py-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
              title="Remove module"
            >
              <FaRegTrashAlt />
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-0.5">
                Module Title:
              </label>
              <input
                type="text"
                value={module.title}
                onChange={(e) => updateModule(moduleIndex, 'title', e.target.value)}
                className="w-full p-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-0.5">
                Module Description:
              </label>
              <textarea
                value={module.description || ''}
                onChange={(e) => updateModule(moduleIndex, 'description', e.target.value)}
                className="w-full p-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows="2"
              />
            </div>
          </div>
          
          {/* Module-level resources */}
          {['pdfs', 'links', 'videos'].map((resourceType) => (
            <div key={resourceType} className="mt-3 p-3 bg-gray-50 rounded-md">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Module {resourceType.charAt(0).toUpperCase() + resourceType.slice(1)}:
                </label>
                <button
                  onClick={() => addModuleResource(moduleIndex, resourceType)}
                  className="px-2 py-1 bg-white border border-gray-300 text-gray-700 rounded-md text-xs hover:bg-gray-50"
                >
                  + Add {resourceType.slice(0, -1)}
                </button>
              </div>
              
              {(module[resourceType] || []).map((item, resourceIndex) => (
                <div key={resourceIndex} className="mb-2 grid grid-cols-1 md:grid-cols-2 gap-1">
                  <input
                    type="text"
                    value={item.url}
                    onChange={(e) => updateModuleResource(moduleIndex, resourceType, resourceIndex, 'url', e.target.value)}
                    placeholder="URL"
                    className="w-full p-1.5 border border-gray-300 rounded-md bg-white"
                  />
                  <div className="flex gap-1">
                    <input
                      type="text"
                      value={item.text}
                      onChange={(e) => updateModuleResource(moduleIndex, resourceType, resourceIndex, 'text', e.target.value)}
                      placeholder="Text"
                      className="w-full p-1.5 border border-gray-300 rounded-md bg-white"
                    />
                    <button
                      onClick={() => removeModuleResource(moduleIndex, resourceType, resourceIndex)}
                      className="px-1.5 py-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                      title="Remove resource"
                    >
                      <FaRegTrashAlt />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ))}

          <div className="mt-4 mb-6 border-t border-gray-200 pt-4">
            <button
              onClick={() => addTopic(moduleIndex)}
              className="px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm flex items-center gap-2 shadow-sm"
            >
              <span>Add Topic</span>
            </button>
          </div>

          {/* Topics section */}
          <div className="space-y-4">
            {module.topics.map((topic, topicIndex) => (
              <div key={topicIndex} className="ml-3 mb-4 bg-gray-50 rounded-lg border border-gray-200 p-3">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex-grow">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-gray-200 px-2 py-1 rounded-md text-sm font-medium text-gray-700">
                        Topic {topicIndex + 1}
                      </span>
                      <button
                        onClick={() => removeTopic(moduleIndex, topicIndex)}
                        className="px-1.5 py-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                        title="Remove topic"
                      >
                        <FaRegTrashAlt />
                      </button>
                    </div>
                    <label className="block text-sm font-medium text-gray-700 mb-0.5">
                      Topic Name:
                    </label>
                    <input
                      type="text"
                      value={topic.name}
                      onChange={(e) => updateTopic(moduleIndex, topicIndex, 'name', e.target.value)}
                      className="w-full p-1.5 border border-gray-300 rounded-md bg-white"
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-0.5">
                    Topic Description:
                  </label>
                  <textarea
                    value={topic.description}
                    onChange={(e) => updateTopic(moduleIndex, topicIndex, 'description', e.target.value)}
                    rows="2"
                    className="w-full p-1.5 border border-gray-300 rounded-md bg-white"
                  />
                </div>
                
                {/* Topic-level resources */}
                {['pdfs', 'links', 'videos'].map((resourceType) => (
                  <div key={resourceType} className="mb-2">
                    <div className="flex justify-between items-center mb-1">
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
                      <div key={resourceIndex} className="mb-2 grid grid-cols-1 md:grid-cols-2 gap-1">
                        <input
                          type="text"
                          value={item.url}
                          onChange={(e) => updateTopicResource(moduleIndex, topicIndex, resourceType, resourceIndex, 'url', e.target.value)}
                          placeholder="URL"
                          className="w-full p-1.5 border border-gray-300 rounded-md"
                        />
                        <div className="flex gap-1">
                          <input
                            type="text"
                            value={item.text}
                            onChange={(e) => updateTopicResource(moduleIndex, topicIndex, resourceType, resourceIndex, 'text', e.target.value)}
                            placeholder="Text"
                            className="w-full p-1.5 border border-gray-300 rounded-md"
                          />
                          <button
                            onClick={() => removeTopicResource(moduleIndex, topicIndex, resourceType, resourceIndex)}
                            className="px-1.5 py-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                            title="Remove resource"
                          >
                            <FaRegTrashAlt />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      ))}
      
      <div className="mt-4 flex space-x-2">
        <button
          className="px-3 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm"
          onClick={saveCourse}
        >
          {isEditMode ? 'Update Course' : 'Save Course'}
        </button>
        <button
          className="px-3 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
          onClick={clearForm}
        >
          Clear Form
        </button>
      </div>
    </div>
  );
};

export default CourseForm;