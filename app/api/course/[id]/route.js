import Course from '../../../../models/Course';
import connectDB from '../../../../lib/connectDB';

connectDB();

// GET - Fetch course by ID
export async function GET(req, { params }) {
  const { id } = params;  // 'id' matches the dynamic parameter name used above
  try {
    const course = await Course.findById(id).populate('branch');
    if (!course) {
      return new Response(JSON.stringify({ message: 'Course not found' }), { status: 404 });
    }
    return new Response(JSON.stringify(course), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

// PUT - Update course by ID
export async function PUT(req, { params }) {
  const { id } = params;
  const { courseId, courseName, credits, description, resources, playlists, modules, DA, branch } = await req.json();
  try {
    const course = await Course.findByIdAndUpdate(id, { courseId, courseName, credits, description, resources, playlists, modules, DA, branch }, { new: true });
    if (!course) {
      return new Response(JSON.stringify({ message: 'Course not found' }), { status: 404 });
    }
    return new Response(JSON.stringify(course), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 400 });
  }
}

// DELETE - Delete course by ID
export async function DELETE(req, { params }) {
  const { id } = params;
  try {
    const course = await Course.findByIdAndDelete(id);
    if (!course) {
      return new Response(JSON.stringify({ message: 'Course not found' }), { status: 404 });
    }
    return new Response(JSON.stringify({ message: 'Course deleted successfully' }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
