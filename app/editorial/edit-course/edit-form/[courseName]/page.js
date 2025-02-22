import CourseForm from "@/components/CourseForm";
import Link from "next/link";

export default function EditCoursePage({ params }) {
  return (
    <div className="flex flex-col min-h-screen p-6">
      <h1 className="text-4xl font-bold mb-4">Edit Course</h1>
      <div className="flex-grow">
        <CourseForm courseCode={params.courseName} />
      </div>
      <div className="mt-8 mb-4">
        <Link href="/editorial/edit-course">
          <p className="text-blue-400 hover:text-blue-600 text-xl">
            Back to Course Selection
          </p>
        </Link>
      </div>
    </div>
  );
}
