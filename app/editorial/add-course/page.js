import CourseForm from '@/components/CourseForm';
import Link from 'next/link';

export default function AddCourse() {
  return (
    <div className="flex flex-col min-h-screen p-6">
      <h1 className="text-4xl font-bold mb-4">Add Course Form</h1>
      <div className="flex-grow">
        <CourseForm/>
      </div>
      <div className="mt-8 mb-4">
        <Link href="edit-hub">
          <p className="text-blue-400 hover:text-blue-600 text-xl">Back to Editorial Hub</p>
        </Link>
      </div>
    </div>
  );
}
