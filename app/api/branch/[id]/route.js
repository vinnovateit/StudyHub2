import Course from '../../../../models/Course';
import Branch from '../../../../models/Branch'; 
import connectDB from '../../../../lib/connectDB';

connectDB();

// GET - Fetch courses by branch ID
export async function GET(req, { params }) {
  const { id } = params;  // Now using the same dynamic name 'id'
  try {
    const courses = await Course.find({ branch: id }).populate('branch');
    if (!courses.length) {
      return new Response(JSON.stringify({ message: 'No courses found for this branch' }), { status: 404 });
    }
    return new Response(JSON.stringify(courses), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}


// PUT - Update an existing branch by ID
export async function PUT(req, { params }) {
    const { id } = params;  // Access the dynamic ID from params
    const { name, schoolName, courses } = await req.json(); // Get data from the request body
  
    try {
      const branch = await Branch.findByIdAndUpdate(
        id,
        { name, schoolName, courses },
        { new: true } // Return the updated branch
      );
      if (!branch) {
        return new Response(JSON.stringify({ error: 'Branch not found' }), { status: 404 });
      }
      return new Response(JSON.stringify(branch), { status: 200 });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), { status: 400 });
    }
  }
  
  // DELETE - Delete a branch by ID
  export async function DELETE(req, { params }) {
    const { id } = params;  // Access the dynamic ID from params
    try {
      const branch = await Branch.findByIdAndDelete(id);
      if (!branch) {
        return new Response(JSON.stringify({ error: 'Branch not found' }), { status: 404 });
      }
      return new Response(JSON.stringify({ message: 'Branch deleted successfully' }), { status: 200 });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), { status: 400 });
    }
  }
  
