import ChooseCourse from '@/components/ChooseCourse';
import Link from 'next/link';

export default function EditCourse() {
  return (
    <div className="flex flex-col min-h-screen p-6">
      <h1 className="text-4xl font-bold mb-4">Add Course Form</h1>
      <div className="flex-grow">
        <ChooseCourse/>
      </div>
      <div className="mt-8 mb-4">
        <Link href="/editorial/edit-hub">
          <p className="text-blue-400 hover:text-blue-600 text-xl">Back to Editorial Hub</p>
        </Link>
      </div>
    </div>
  );
}
