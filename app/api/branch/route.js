import Branch from '../../../models/Branch';
import connectDB from '../../../lib/connectDB';

connectDB();

// GET - Fetch all branches
export async function GET() {
  try {
    const branches = await Branch.find().populate('courses');
    return new Response(JSON.stringify(branches), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

// POST - Create a new branch
export async function POST(req) {
  const { name, schoolName, courses } = await req.json();
  try {
    const branch = new Branch({ name, schoolName, courses });
    await branch.save();
    return new Response(JSON.stringify(branch), { status: 201 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 400 });
  }
}

