"use client";

import { useState } from "react";
import { FaFileAlt, FaRegTrashAlt } from "react-icons/fa";
import {
  DOCUMENT_UPLOAD_ACCEPT,
  getDocumentUploadError,
  isAllowedDocumentUpload,
} from "@/lib/documentUpload";

export default function PaperForm({ onSubmit, initialData = {} }) {
  const [formData, setFormData] = useState({
    subject: initialData.subject || "",
    courseCode: initialData.courseCode || "",
    examType: initialData.examType || "",
    slot: initialData.slot || "",
    semester: initialData.semester || "",
    year: initialData.year || new Date().getFullYear(),
    pdfLink: initialData.pdfLink || "",
    pdfKey: initialData.pdfKey || "",
    fileName: initialData.fileName || "",
    storageType: initialData.storageType || (initialData.pdfKey ? "r2" : "link"),
  });

  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState(false);
  const [pendingFile, setPendingFile] = useState(null);
  const [pendingFileName, setPendingFileName] = useState("");
  const [filePreview, setFilePreview] = useState(initialData.pdfLink || "");

  const uploadPaperFile = async (file, desiredFileName) => {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Missing login token");
    }

    const payload = new FormData();
    payload.append("file", file);
    payload.append("folder", `papers/${formData.courseCode || "draft"}`);
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

    setFormData((prev) => ({
      ...prev,
      pdfLink: data.file.url,
      pdfKey: data.file.key,
      fileName: data.file.name,
      storageType: "r2",
    }));
    setFilePreview(data.file.url);
    setPendingFile(null);
    setPendingFileName("");
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "file") {
      const file = files[0];

      if (file && isAllowedDocumentUpload(file)) {
        setPendingFile(file);
        setPendingFileName(file.name);
        setFormData((prev) => ({
          ...prev,
          fileName: file.name,
        }));
        setFilePreview(URL.createObjectURL(file));
      } else if (file) {
        setErrors((prev) => ({
          ...prev,
          pdfFile: getDocumentUploadError(file),
        }));
      }
      e.target.value = "";
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const handleUploadClick = async () => {
    if (!pendingFile) {
      return;
    }

    try {
      setUploading(true);
      await uploadPaperFile(pendingFile, pendingFileName || pendingFile.name);
    } catch (error) {
      console.error("Error uploading file:", error);
      setErrors((prev) => ({
        ...prev,
        pdfFile: error.message || "Failed to upload file",
      }));
    } finally {
      setUploading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.subject.trim()) newErrors.subject = "Subject is required";
    if (!formData.courseCode.trim()) newErrors.courseCode = "Course code is required";
    if (!formData.examType) newErrors.examType = "Exam type is required";
    if (!formData.semester) newErrors.semester = "Semester is required";
    if (!formData.year) newErrors.year = "Year is required";
    if (!formData.pdfLink) newErrors.pdfFile = "File is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm() && onSubmit) {
      onSubmit({
        ...formData,
        year: Number(formData.year),
      });
      return;
    }

    if (validateForm()) {
      submitPaper();
    }
  };

  const submitPaper = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setErrors((prev) => ({
        ...prev,
        submit: "Missing login token",
      }));
      return;
    }

    try {
      setUploading(true);
      const response = await fetch("/api/auth/papers/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          year: Number(formData.year),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save paper");
      }

      setErrors({});
      alert("Paper saved successfully");
      setFormData((prev) => ({
        ...prev,
        subject: "",
        courseCode: "",
        examType: "",
        slot: "",
        semester: "",
        year: new Date().getFullYear(),
        pdfLink: "",
        pdfKey: "",
        fileName: "",
        storageType: "link",
      }));
      setFilePreview("");
      setPendingFile(null);
      setPendingFileName("");
    } catch (error) {
      console.error("Error saving paper:", error);
      setErrors((prev) => ({
        ...prev,
        submit: error.message || "Failed to save paper",
      }));
    } finally {
      setUploading(false);
    }
  };

  const removeFile = () => {
    if (filePreview && filePreview.startsWith("blob:")) {
      URL.revokeObjectURL(filePreview);
    }
    setFormData((prev) => ({
      ...prev,
      pdfLink: "",
      pdfKey: "",
      fileName: "",
      storageType: "link",
    }));
    setFilePreview("");
    setPendingFile(null);
    setPendingFileName("");
  };

  return (
    <div className="mx-auto max-w-4xl rounded-2xl bg-white p-6 shadow-md">
      <h2 className="mb-6 text-2xl font-bold">Paper Submission Form</h2>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="subject" className="mb-1 block text-sm font-medium text-gray-700">
              Subject *
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className={`w-full rounded-md border p-2 ${errors.subject ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.subject && <p className="mt-1 text-sm text-red-600">{errors.subject}</p>}
          </div>

          <div>
            <label htmlFor="courseCode" className="mb-1 block text-sm font-medium text-gray-700">
              Course Code *
            </label>
            <input
              type="text"
              id="courseCode"
              name="courseCode"
              value={formData.courseCode}
              onChange={handleChange}
              className={`w-full rounded-md border p-2 ${errors.courseCode ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.courseCode && <p className="mt-1 text-sm text-red-600">{errors.courseCode}</p>}
          </div>

          <div>
            <label htmlFor="examType" className="mb-1 block text-sm font-medium text-gray-700">
              Exam Type *
            </label>
            <select
              id="examType"
              name="examType"
              value={formData.examType}
              onChange={handleChange}
              className={`w-full rounded-md border p-2 ${errors.examType ? "border-red-500" : "border-gray-300"}`}
            >
              <option value="">Select Exam Type</option>
              <option value="CAT1">CAT1</option>
              <option value="CAT2">CAT2</option>
              <option value="FAT">FAT</option>
              <option value="Quiz">Quiz</option>
            </select>
            {errors.examType && <p className="mt-1 text-sm text-red-600">{errors.examType}</p>}
          </div>

          <div>
            <label htmlFor="slot" className="mb-1 block text-sm font-medium text-gray-700">
              Slot
            </label>
            <input
              type="text"
              id="slot"
              name="slot"
              value={formData.slot}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 p-2"
            />
          </div>

          <div>
            <label htmlFor="semester" className="mb-1 block text-sm font-medium text-gray-700">
              Semester *
            </label>
            <select
              id="semester"
              name="semester"
              value={formData.semester}
              onChange={handleChange}
              className={`w-full rounded-md border p-2 ${errors.semester ? "border-red-500" : "border-gray-300"}`}
            >
              <option value="">Select Semester</option>
              <option value="Fall">Fall</option>
              <option value="Winter">Winter</option>
            </select>
            {errors.semester && <p className="mt-1 text-sm text-red-600">{errors.semester}</p>}
          </div>

          <div>
            <label htmlFor="year" className="mb-1 block text-sm font-medium text-gray-700">
              Year *
            </label>
            <input
              type="number"
              id="year"
              name="year"
              value={formData.year}
              onChange={handleChange}
              className={`w-full rounded-md border p-2 ${errors.year ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.year && <p className="mt-1 text-sm text-red-600">{errors.year}</p>}
          </div>

          <div className="md:col-span-2">
            <label htmlFor="pdfFile" className="mb-1 block text-sm font-medium text-gray-700">
              File *
            </label>
            <div className={`rounded-xl border border-dashed p-4 ${errors.pdfFile ? "border-red-500" : "border-gray-300"}`}>
              {!filePreview || pendingFile ? (
                <div className="flex flex-col items-center justify-center gap-3 text-center">
                  <FaFileAlt className="text-4xl text-gray-400" />
                  <p className="text-sm text-gray-500">
                    Attach a file first, then upload it.
                  </p>
                  {pendingFile && (
                    <input
                      type="text"
                      value={pendingFileName}
                      onChange={(e) => setPendingFileName(e.target.value)}
                      className="w-full max-w-xl rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-900 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                      placeholder="Enter file name before upload"
                    />
                  )}
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <label className="cursor-pointer rounded-full border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50">
                      <span>Browse Files</span>
                      <input
                        type="file"
                        id="pdfFile"
                        name="pdfFile"
                        accept={DOCUMENT_UPLOAD_ACCEPT}
                        onChange={handleChange}
                        className="hidden"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={handleUploadClick}
                      disabled={!pendingFile || uploading}
                      className="rounded-full bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                    >
                      {uploading ? "Uploading..." : "Upload"}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-red-500">
                        <FaFileAlt />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                          Paper File
                        </p>
                        <p className="mt-1 text-sm font-medium text-gray-900">
                          {formData.fileName}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 md:shrink-0">
                      <a
                        href={filePreview}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-md border border-blue-200 px-3 py-2 text-xs font-medium text-blue-700 hover:bg-blue-50"
                      >
                        Open
                      </a>
                      <button
                        type="button"
                        onClick={removeFile}
                        className="rounded-md border border-red-200 px-2.5 py-2 text-red-600 hover:bg-red-50"
                        title="Remove item"
                      >
                        <FaRegTrashAlt />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {errors.pdfFile && <p className="mt-1 text-sm text-red-600">{errors.pdfFile}</p>}
          </div>
        </div>

        <div className="mt-8">
          <button
            type="submit"
            className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {uploading ? "Saving..." : "Submit Paper"}
          </button>
        </div>
        {errors.submit && <p className="mt-3 text-sm text-red-600">{errors.submit}</p>}
      </form>
    </div>
  );
}
