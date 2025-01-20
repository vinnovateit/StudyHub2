import mongoose from 'mongoose';
import Course from '../../../models/Course';
import Branch from '../../../models/Branch';
import connectDB from '../../../lib/connectDB';

connectDB();

// GET - Fetch all courses
export async function GET() {
  try {
    const courses = await Course.find().populate('branch');
    return new Response(JSON.stringify(courses), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}


// POST - Create a new course
export async function POST(req) {
  const { courseId, courseName, credits, description, resources, playlists, modules, DA, branch } = await req.json();

  // Validate branch ID format
  if (!mongoose.Types.ObjectId.isValid(branch)) {
    return new Response(JSON.stringify({ error: "Invalid Branch ID format" }), { status: 400 });
  }

  // Check if the branch exists
  const existingBranch = await Branch.findById(branch);
  if (!existingBranch) {
    return new Response(JSON.stringify({ error: "Branch not found" }), { status: 404 });
  }

  try {
    // Create and save the course
    const course = new Course({
      courseId,
      courseName,
      credits,
      description,
      resources,
      playlists,
      modules,
      DA,
      branch,
    });
    await course.save();

    // Add the course ID to the courses array in the Branch
    existingBranch.courses.push(course._id);
    await existingBranch.save();

    return new Response(JSON.stringify(course), { status: 201 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 400 });
  }
}
