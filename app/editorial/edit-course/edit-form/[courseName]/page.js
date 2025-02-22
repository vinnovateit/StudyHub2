import CourseForm from "@/components/CourseForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function EditCoursePage({ params }) {
  return (
    <div className="flex flex-col min-h-screen p-6">
      <div className="max-w-lg mb-4">
        <Link
          href="/editorial/edit-hub"
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Editorial Hub
        </Link>
      </div>
      <div className="flex-grow">
        <CourseForm courseCode={params.courseName} />
      </div>
    </div>
  );
}
