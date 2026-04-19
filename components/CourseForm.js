"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FaRegTrashAlt } from "react-icons/fa";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import DraggableResourceItem from "./DraggableResourceItem";
import ModuleTopicResources from "./ModuleTopicResources";

const CourseForm = ({ courseCode }) => {
  const [course, setCourse] = useState({
    name: "",
    code: "",
    credits: "",
    description: "",
    preview: "",
    modules: [],
    links: [],
    videos: [],
    DAs: [],
  });
  const [courseLookup, setCourseLookup] = useState({
    loading: false,
    exists: false,
    course: null,
  });

  const isEditMode = Boolean(courseCode);

  // Load existing course data when editing
  useEffect(() => {
    const loadCourse = async () => {
      if (courseCode) {
        try {
          const response = await fetch(`/api/courses/`, {
            method: "POST",
            body: JSON.stringify({ courseCode }),
          });
          if (!response.ok) throw new Error("Failed to fetch course");
          const data = await response.json();
          setCourse(data.props.Course);
        } catch (error) {
          console.error("Error loading course:", error);
          alert("Failed to load course data");
        }
      }
    };

    loadCourse();
  }, [courseCode]);

  // Load from localStorage only when adding new course
  useEffect(() => {
    if (!isEditMode) {
      const savedData = localStorage.getItem("courseFormData");
      if (savedData) {
        try {
          setCourse(JSON.parse(savedData));
        } catch (error) {
          console.error("Error parsing saved course data:", error);
        }
      }
    }
  }, [isEditMode]);

  // Save to localStorage only when adding new course
  useEffect(() => {
    if (!isEditMode) {
      localStorage.setItem("courseFormData", JSON.stringify(course));
    }
  }, [course, isEditMode]);

  useEffect(() => {
    if (isEditMode) {
      return;
    }

    const code = course.code.trim();

    if (!code) {
      setCourseLookup({
        loading: false,
        exists: false,
        course: null,
      });
      return;
    }

    let cancelled = false;

    setCourseLookup((prev) => ({
      ...prev,
      loading: true,
    }));

    const timer = setTimeout(async () => {
      try {
        const response = await fetch("/api/courses/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ courseCode: code }),
        });

        const data = await response.json();
        const existingCourse = data?.props?.Course || null;

        if (cancelled) {
          return;
        }

        setCourseLookup({
          loading: false,
          exists: Boolean(existingCourse),
          course: existingCourse,
        });
      } catch (error) {
        if (cancelled) {
          return;
        }

        console.error("Error checking course code:", error);
        setCourseLookup({
          loading: false,
          exists: false,
          course: null,
        });
      }
    }, 450);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [course.code, isEditMode]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCourse({
      ...course,
      [name]: name === "code" ? value.toUpperCase() : value,
    });
  };

  const addModule = () => {
    setCourse({
      ...course,
      modules: [...course.modules, { title: "", description: "", topics: [] }],
    });
  };

  const updateModule = (index, field, value) => {
    const updatedModules = [...course.modules];
    updatedModules[index][field] = value;
    setCourse({
      ...course,
      modules: updatedModules,
    });
  };

  const addTopic = (moduleIndex) => {
    const updatedModules = [...course.modules];
    updatedModules[moduleIndex].topics.push({
      name: "",
      description: "",
      pdfs: [],
      links: [],
      videos: [],
    });
    setCourse({
      ...course,
      modules: updatedModules,
    });
  };

  const updateTopic = (moduleIndex, topicIndex, field, value) => {
    const updatedModules = [...course.modules];
    updatedModules[moduleIndex].topics[topicIndex][field] = value;
    setCourse({
      ...course,
      modules: updatedModules,
    });
  };

  const addPdf = (moduleIndex, topicIndex) => {
    const updatedModules = [...course.modules];
    updatedModules[moduleIndex].topics[topicIndex].pdfs.push("");
    setCourse({
      ...course,
      modules: updatedModules,
    });
  };

  const updatePdf = (moduleIndex, topicIndex, pdfIndex, value) => {
    const updatedModules = [...course.modules];
    updatedModules[moduleIndex].topics[topicIndex].pdfs[pdfIndex] = value;
    setCourse({
      ...course,
      modules: updatedModules,
    });
  };

  const addUploadedModulePdf = (moduleIndex, uploadedPdf) => {
    const updatedModules = [...course.modules];

    if (!updatedModules[moduleIndex].pdfs) {
      updatedModules[moduleIndex].pdfs = [];
    }

    updatedModules[moduleIndex].pdfs.push({
      text: uploadedPdf.name || "Uploaded PDF",
      fileName: uploadedPdf.name || "Uploaded PDF",
      url: uploadedPdf.url,
      key: uploadedPdf.key,
      mimetype: uploadedPdf.mimetype,
      storageType: "r2",
    });

    setCourse({
      ...course,
      modules: updatedModules,
    });
  };

  const addUploadedTopicPdf = (moduleIndex, topicIndex, uploadedPdf) => {
    const updatedModules = [...course.modules];

    if (!updatedModules[moduleIndex].topics[topicIndex].pdfs) {
      updatedModules[moduleIndex].topics[topicIndex].pdfs = [];
    }

    updatedModules[moduleIndex].topics[topicIndex].pdfs.push({
      text: uploadedPdf.name || "Uploaded PDF",
      fileName: uploadedPdf.name || "Uploaded PDF",
      url: uploadedPdf.url,
      key: uploadedPdf.key,
      mimetype: uploadedPdf.mimetype,
      storageType: "r2",
    });

    setCourse({
      ...course,
      modules: updatedModules,
    });
  };

  const addUploadedCourseDa = (uploadedPdf) => {
    const updatedResources = [...course.DAs];

    updatedResources.push({
      text: uploadedPdf.name || "Uploaded PDF",
      fileName: uploadedPdf.name || "Uploaded PDF",
      url: uploadedPdf.url,
      key: uploadedPdf.key,
      mimetype: uploadedPdf.mimetype,
      storageType: "r2",
    });

    setCourse({
      ...course,
      DAs: updatedResources,
    });
  };

  const renameUploadedModulePdf = async (moduleIndex, resourceIndex, newName) => {
    const token = localStorage.getItem("token");
    const currentPdf = course.modules?.[moduleIndex]?.pdfs?.[resourceIndex];

    if (!token) {
      throw new Error("Missing login token");
    }

    if (!currentPdf?.key) {
      setCourse((prevCourse) => {
        const updatedModules = [...prevCourse.modules];
        updatedModules[moduleIndex].pdfs[resourceIndex] = {
          ...updatedModules[moduleIndex].pdfs[resourceIndex],
          text: newName,
        };

        return {
          ...prevCourse,
          modules: updatedModules,
        };
      });
      return;
    }

    const response = await fetch("/api/auth/r2/rename", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        key: currentPdf.key,
        newName,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to rename PDF");
    }

    setCourse((prevCourse) => {
      const updatedModules = [...prevCourse.modules];
        updatedModules[moduleIndex].pdfs[resourceIndex] = {
          ...updatedModules[moduleIndex].pdfs[resourceIndex],
          text: data.file.name,
          fileName: data.file.name,
          url: data.file.url,
          key: data.file.key,
          mimetype: updatedModules[moduleIndex].pdfs[resourceIndex].mimetype,
          storageType: "r2",
        };

      return {
        ...prevCourse,
        modules: updatedModules,
      };
    });
  };

  const renameUploadedTopicPdf = async (
    moduleIndex,
    topicIndex,
    resourceIndex,
    newName
  ) => {
    const token = localStorage.getItem("token");
    const currentPdf =
      course.modules?.[moduleIndex]?.topics?.[topicIndex]?.pdfs?.[resourceIndex];

    if (!token) {
      throw new Error("Missing login token");
    }

    if (!currentPdf?.key) {
      setCourse((prevCourse) => {
        const updatedModules = [...prevCourse.modules];
        updatedModules[moduleIndex].topics[topicIndex].pdfs[resourceIndex] = {
          ...updatedModules[moduleIndex].topics[topicIndex].pdfs[resourceIndex],
          text: newName,
        };

        return {
          ...prevCourse,
          modules: updatedModules,
        };
      });
      return;
    }

    const response = await fetch("/api/auth/r2/rename", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        key: currentPdf.key,
        newName,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to rename PDF");
    }

    setCourse((prevCourse) => {
      const updatedModules = [...prevCourse.modules];
      updatedModules[moduleIndex].topics[topicIndex].pdfs[resourceIndex] = {
        ...updatedModules[moduleIndex].topics[topicIndex].pdfs[resourceIndex],
        text: data.file.name,
        fileName: data.file.name,
        url: data.file.url,
        key: data.file.key,
        mimetype:
          updatedModules[moduleIndex].topics[topicIndex].pdfs[resourceIndex]
            .mimetype,
        storageType: "r2",
      };

      return {
        ...prevCourse,
        modules: updatedModules,
      };
    });
  };

  const renameUploadedCourseDa = async (resourceIndex, newName) => {
    const token = localStorage.getItem("token");
    const currentDa = course.DAs?.[resourceIndex];

    if (!token) {
      throw new Error("Missing login token");
    }

    if (!currentDa?.key) {
      setCourse((prevCourse) => {
        const updatedResources = [...prevCourse.DAs];
        updatedResources[resourceIndex] = {
          ...updatedResources[resourceIndex],
          text: newName,
        };

        return {
          ...prevCourse,
          DAs: updatedResources,
        };
      });
      return;
    }

    const response = await fetch("/api/auth/r2/rename", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        key: currentDa.key,
        newName,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to rename PDF");
    }

    setCourse((prevCourse) => {
      const updatedResources = [...prevCourse.DAs];
      updatedResources[resourceIndex] = {
        ...updatedResources[resourceIndex],
        text: data.file.name,
        fileName: data.file.name,
        url: data.file.url,
        key: data.file.key,
        mimetype: updatedResources[resourceIndex].mimetype,
        storageType: "r2",
      };

      return {
        ...prevCourse,
        DAs: updatedResources,
      };
    });
  };

  const uploadCourseFile = async (file, folderPrefix, desiredFileName) => {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Missing login token");
    }

    const payload = new FormData();
    payload.append("file", file);
    payload.append("folder", folderPrefix);
    if (desiredFileName) {
      payload.append("desiredFileName", desiredFileName);
    }

    const response = await fetch("/api/auth/r2/upload", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: payload,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to upload file");
    }

    return data.file;
  };

  const uploadModulePdfs = async (moduleIndex, files) => {
    const uploadedFiles = [];

    for (const item of files) {
      const uploaded = await uploadCourseFile(
        item.file,
        `courses/${course.code || "draft"}/module-${moduleIndex + 1}`,
        item.name
      );
      uploadedFiles.push(uploaded);
    }

    uploadedFiles.forEach((uploaded) => addUploadedModulePdf(moduleIndex, uploaded));
  };

  const uploadTopicPdfs = async (moduleIndex, topicIndex, files) => {
    const uploadedFiles = [];

    for (const item of files) {
      const uploaded = await uploadCourseFile(
        item.file,
        `courses/${course.code || "draft"}/module-${moduleIndex + 1}/topic-${
          topicIndex + 1
        }`,
        item.name
      );
      uploadedFiles.push(uploaded);
    }

    uploadedFiles.forEach((uploaded) =>
      addUploadedTopicPdf(moduleIndex, topicIndex, uploaded)
    );
  };

  const uploadCourseDas = async (files) => {
    const uploadedFiles = [];

    for (const item of files) {
      const uploaded = await uploadCourseFile(
        item.file,
        `courses/${course.code || "draft"}/course-das`,
        item.name
      );
      uploadedFiles.push(uploaded);
    }

    uploadedFiles.forEach((uploaded) => addUploadedCourseDa(uploaded));
  };

  const addLink = (moduleIndex, topicIndex) => {
    const updatedModules = [...course.modules];
    updatedModules[moduleIndex].topics[topicIndex].links.push({
      url: "",
      text: "",
    });
    setCourse({
      ...course,
      modules: updatedModules,
    });
  };

  const updateLink = (moduleIndex, topicIndex, linkIndex, field, value) => {
    const updatedModules = [...course.modules];
    updatedModules[moduleIndex].topics[topicIndex].links[linkIndex][field] =
      value;
    setCourse({
      ...course,
      modules: updatedModules,
    });
  };

  const addImage = (moduleIndex, topicIndex) => {
    const updatedModules = [...course.modules];
    updatedModules[moduleIndex].topics[topicIndex].images.push({
      url: "",
      caption: "",
    });
    setCourse({
      ...course,
      modules: updatedModules,
    });
  };

  const updateImage = (moduleIndex, topicIndex, imageIndex, field, value) => {
    const updatedModules = [...course.modules];
    updatedModules[moduleIndex].topics[topicIndex].images[imageIndex][field] =
      value;
    setCourse({
      ...course,
      modules: updatedModules,
    });
  };

  const addResourceItem = (resourceType) => {
    setCourse({
      ...course,
      [resourceType]: [...course[resourceType], { text: "", url: "" }],
    });
  };

  const updateResourceItem = (resourceType, index, field, value) => {
    const updatedResources = [...course[resourceType]];
    updatedResources[index][field] = value;
    setCourse({
      ...course,
      [resourceType]: updatedResources,
    });
  };

  const removeResourceItem = (resourceType, index) => {
    const updatedResources = [...course[resourceType]];
    updatedResources.splice(index, 1);
    setCourse({
      ...course,
      [resourceType]: updatedResources,
    });
  };

  const removeModuleResource = (moduleIndex, resourceType, resourceIndex) => {
    const updatedModules = [...course.modules];
    updatedModules[moduleIndex][resourceType].splice(resourceIndex, 1);
    setCourse({
      ...course,
      modules: updatedModules,
    });
  };

  const removeTopicResource = (
    moduleIndex,
    topicIndex,
    resourceType,
    resourceIndex
  ) => {
    const updatedModules = [...course.modules];
    updatedModules[moduleIndex].topics[topicIndex][resourceType].splice(
      resourceIndex,
      1
    );
    setCourse({
      ...course,
      modules: updatedModules,
    });
  };

  const clearForm = () => {
    if (window.confirm("Are you sure you want to clear all form data?")) {
      localStorage.removeItem("courseFormData");
      setCourse({
        name: "",
        code: "",
        credits: "",
        description: "",
        preview: "",
        modules: [],
        links: [],
        videos: [],
        DAs: [],
      });
    }
  };

  const saveCourse = async () => {
    try {
      if (!isEditMode && courseLookup.exists) {
        alert("This course already exists. Please add content in Edit Course.");
        return;
      }

      const endpoint = isEditMode
        ? "/api/auth/update-course"
        : "/api/auth/add-course";
      const method = isEditMode ? "PATCH" : "POST";
      const token = localStorage.getItem("token");
      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(course),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save course");
      }

      alert(
        isEditMode
          ? "Course updated successfully!"
          : "Course added successfully!"
      );

      // Clear form only when adding new course
      if (!isEditMode) {
        clearForm();
      }
    } catch (error) {
      console.error("Error saving course:", error);
      alert(error.message || "Failed to save course");
    }
  };

  const addModuleResource = (moduleIndex, resourceType) => {
    const updatedModules = [...course.modules];
    if (!updatedModules[moduleIndex][resourceType]) {
      updatedModules[moduleIndex][resourceType] = [];
    }
    updatedModules[moduleIndex][resourceType].push({ text: "", url: "" });
    setCourse({
      ...course,
      modules: updatedModules,
    });
  };

  const updateModuleResource = (
    moduleIndex,
    resourceType,
    resourceIndex,
    field,
    value
  ) => {
    const updatedModules = [...course.modules];
    updatedModules[moduleIndex][resourceType][resourceIndex][field] = value;
    setCourse({
      ...course,
      modules: updatedModules,
    });
  };

  const addTopicResource = (moduleIndex, topicIndex, resourceType) => {
    const updatedModules = [...course.modules];
    if (!updatedModules[moduleIndex].topics[topicIndex][resourceType]) {
      updatedModules[moduleIndex].topics[topicIndex][resourceType] = [];
    }
    updatedModules[moduleIndex].topics[topicIndex][resourceType].push({
      text: "",
      url: "",
    });
    setCourse({
      ...course,
      modules: updatedModules,
    });
  };

  const updateTopicResource = (
    moduleIndex,
    topicIndex,
    resourceType,
    resourceIndex,
    field,
    value
  ) => {
    const updatedModules = [...course.modules];
    updatedModules[moduleIndex].topics[topicIndex][resourceType][resourceIndex][
      field
    ] = value;
    setCourse({
      ...course,
      modules: updatedModules,
    });
  };

  const removeModule = (moduleIndex) => {
    if (window.confirm("Are you sure you want to remove this module?")) {
      const updatedModules = [...course.modules];
      updatedModules.splice(moduleIndex, 1);
      setCourse({
        ...course,
        modules: updatedModules,
      });
    }
  };

  const removeTopic = (moduleIndex, topicIndex) => {
    if (window.confirm("Are you sure you want to remove this topic?")) {
      const updatedModules = [...course.modules];
      updatedModules[moduleIndex].topics.splice(topicIndex, 1);
      setCourse({
        ...course,
        modules: updatedModules,
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
          [resourceType]: arrayMove(
            prevCourse[resourceType],
            oldIndex,
            newIndex
          ),
        };
      });
    }
  };

  const handleModuleResourceReorder = (
    moduleIndex,
    resourceType,
    oldIndex,
    newIndex
  ) => {
    const updatedModules = [...course.modules];
    if (!updatedModules[moduleIndex][resourceType]) {
      updatedModules[moduleIndex][resourceType] = [];
    }
    updatedModules[moduleIndex][resourceType] = arrayMove(
      updatedModules[moduleIndex][resourceType],
      oldIndex,
      newIndex
    );
    setCourse({ ...course, modules: updatedModules });
  };

  const handleTopicResourceReorder = (
    moduleIndex,
    topicIndex,
    resourceType,
    oldIndex,
    newIndex
  ) => {
    const updatedModules = [...course.modules];
    if (!updatedModules[moduleIndex].topics[topicIndex][resourceType]) {
      updatedModules[moduleIndex].topics[topicIndex][resourceType] = [];
    }
    updatedModules[moduleIndex].topics[topicIndex][resourceType] = arrayMove(
      updatedModules[moduleIndex].topics[topicIndex][resourceType],
      oldIndex,
      newIndex
    );
    setCourse({ ...course, modules: updatedModules });
  };

  const renderResources = (resourceType) => (
    resourceType === "DAs" ? (
      <div key={resourceType} className="mb-8">
        <ModuleTopicResources
          title="Course DAs"
          resources={course.DAs || []}
          onUpdate={(index, field, value) => updateResourceItem(resourceType, index, field, value)}
          onRemove={(index) => removeResourceItem(resourceType, index)}
          onReorder={(oldIndex, newIndex) => handleDragEnd({ active: { id: oldIndex.toString() }, over: { id: newIndex.toString() } }, resourceType)}
          onRename={(index, newName) => renameUploadedCourseDa(index, newName)}
          resourceType={resourceType}
          uploadable
          onUploadFiles={uploadCourseDas}
        />
      </div>
    ) : (
    <div
      key={resourceType}
      className="mt-3 mb-4 rounded-xl border border-gray-200 bg-gray-50 p-3"
    >
      <div className="flex justify-between items-center mb-2">
        <label className="block text-sm font-medium text-gray-700">
          Course {resourceType.charAt(0).toUpperCase() + resourceType.slice(1)}:
        </label>
        <button
          type="button"
          onClick={() => addResourceItem(resourceType)}
          className="rounded-full border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
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
          <div className="space-y-2">
            {course[resourceType].map((item, index) => (
              <DraggableResourceItem
                key={index}
                id={index.toString()}
                item={item}
                onUpdate={(field, value) =>
                  updateResourceItem(resourceType, index, field, value)
                }
                onRemove={() => removeResourceItem(resourceType, index)}
                mode="link"
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
    )
  );

  return (
    <div className="max-w-4xl mx-auto p-5 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        {isEditMode ? "Edit Course" : "Create New Course"}
      </h1>

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
          {!isEditMode && courseLookup.loading && (
            <p className="mt-1 text-sm text-gray-500">Checking course code...</p>
          )}
          {!isEditMode && courseLookup.exists && (
            <div className="mt-2 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
              <p className="font-medium">
                This course already exists.
              </p>
              <p className="mt-1">
                Use Edit Course to add or update the content instead of creating a new entry.
              </p>
              {courseLookup.course?.name && (
                <p className="mt-1 text-amber-900">
                  Existing course: <span className="font-semibold">{courseLookup.course.name}</span>
                </p>
              )}
              <Link
                href={`/editorial/edit-course/edit-form/${courseLookup.course?.code || course.code}`}
                className="mt-2 inline-flex rounded-md bg-amber-600 px-3 py-1.5 text-white hover:bg-amber-700"
              >
                Open Edit Course
              </Link>
            </div>
          )}
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
      {["links", "videos", "DAs"].map((resourceType) =>
        renderResources(resourceType)
      )}

      <div className="mt-8 mb-4">
        <button
          onClick={addModule}
          className="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 mr-2 text-sm"
        >
          Add Module
        </button>
      </div>

      {course.modules.map((module, moduleIndex) => (
        <div
          key={moduleIndex}
          className="bg-white border border-blue-100 rounded-lg p-4 mb-4 shadow-sm"
        >
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
                onChange={(e) =>
                  updateModule(moduleIndex, "title", e.target.value)
                }
                className="w-full p-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-0.5">
                Module Description:
              </label>
              <textarea
                value={module.description || ""}
                onChange={(e) =>
                  updateModule(moduleIndex, "description", e.target.value)
                }
                className="w-full p-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows="2"
              />
            </div>
          </div>

          {/* Module-level resources */}
          {["pdfs", "links", "videos"].map((resourceType) => (
            <ModuleTopicResources
              key={resourceType}
              title={`Module ${
                resourceType === "pdfs"
                  ? "Files"
                  : resourceType.charAt(0).toUpperCase() + resourceType.slice(1)
              }`}
              resources={module[resourceType] || []}
              onAdd={() => addModuleResource(moduleIndex, resourceType)}
              onUpdate={(index, field, value) =>
                updateModuleResource(
                  moduleIndex,
                  resourceType,
                  index,
                  field,
                  value
                )
              }
              onRemove={(index) =>
                removeModuleResource(moduleIndex, resourceType, index)
              }
              onReorder={(oldIndex, newIndex) =>
                handleModuleResourceReorder(
                  moduleIndex,
                  resourceType,
                  oldIndex,
                  newIndex
                )
              }
              resourceType={resourceType}
              uploadable={resourceType === "pdfs"}
              onUploadFiles={
                resourceType === "pdfs"
                  ? (files) => uploadModulePdfs(moduleIndex, files)
                  : undefined
              }
              onRename={
                resourceType === "pdfs"
                  ? (index, newName) =>
                      renameUploadedModulePdf(moduleIndex, index, newName)
                  : undefined
              }
            />
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
              <div
                key={topicIndex}
                className="ml-3 mb-4 bg-gray-50 rounded-lg border border-gray-200 p-3"
              >
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
                      onChange={(e) =>
                        updateTopic(
                          moduleIndex,
                          topicIndex,
                          "name",
                          e.target.value
                        )
                      }
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
                    onChange={(e) =>
                      updateTopic(
                        moduleIndex,
                        topicIndex,
                        "description",
                        e.target.value
                      )
                    }
                    rows="2"
                    className="w-full p-1.5 border border-gray-300 rounded-md bg-white"
                  />
                </div>

                {/* Topic-level resources */}
                {["pdfs", "links", "videos"].map((resourceType) => (
                  <ModuleTopicResources
                    key={resourceType}
                    title={`Topic ${
                      resourceType === "pdfs"
                        ? "Files"
                        : resourceType.charAt(0).toUpperCase() +
                          resourceType.slice(1)
                    }`}
                    resources={topic[resourceType] || []}
                    onAdd={() =>
                      addTopicResource(moduleIndex, topicIndex, resourceType)
                    }
                    onUpdate={(index, field, value) =>
                      updateTopicResource(
                        moduleIndex,
                        topicIndex,
                        resourceType,
                        index,
                        field,
                        value
                      )
                    }
                    onRemove={(index) =>
                      removeTopicResource(
                        moduleIndex,
                        topicIndex,
                        resourceType,
                        index
                      )
                    }
                    onReorder={(oldIndex, newIndex) =>
                      handleTopicResourceReorder(
                        moduleIndex,
                        topicIndex,
                        resourceType,
                        oldIndex,
                        newIndex
                      )
                    }
                    resourceType={resourceType}
                    variant="topic"
                    uploadable={resourceType === "pdfs"}
                    onUploadFiles={
                      resourceType === "pdfs"
                        ? (files) => uploadTopicPdfs(moduleIndex, topicIndex, files)
                        : undefined
                    }
                    onRename={
                      resourceType === "pdfs"
                        ? (index, newName) =>
                            renameUploadedTopicPdf(
                              moduleIndex,
                              topicIndex,
                              index,
                              newName
                            )
                        : undefined
                    }
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="mt-4 flex space-x-2">
        <button
          className={`px-3 py-1.5 text-sm rounded-md ${
            !isEditMode && courseLookup.exists
              ? "cursor-not-allowed bg-indigo-300 text-white"
              : "bg-indigo-600 text-white hover:bg-indigo-700"
          }`}
          onClick={saveCourse}
          disabled={!isEditMode && courseLookup.exists}
        >
          {isEditMode ? "Update Course" : "Save Course"}
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
