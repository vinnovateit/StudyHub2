// File: /app/api/courses/route.js
import connectDB from "@/lib/connectDB";
export const runtime = "nodejs";
import Courses from '@/models/Courses'; // Adjust this import based on your actual model structure

export async function GET(request) {
  try {
    // Connect to the database
    await connectDB();
    
    // Fetch all courses from the database
    const courses = await Courses.find({})
      .sort({ code: 1 }) // Optional: Sort by course code
      .lean(); // Use lean() for better performance when you don't need Mongoose document methods
    
    // Return the courses as JSON
    return new Response(JSON.stringify(courses), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching courses:', error);

    const reason = error instanceof Error ? error.message : 'Unknown error';
    const hint = reason.includes('MONGO_URI is not set')
      ? 'Set MONGO_URI (and optional MONGO_DB_NAME) in Cloudflare Worker secrets/vars.'
      : reason.toLowerCase().includes('server selection') || reason.toLowerCase().includes('timed out')
        ? 'Check MongoDB Atlas Network Access. Cloudflare Worker egress must be allowed.'
        : undefined;
    
    // Return error response
    return new Response(JSON.stringify({ error: 'Failed to fetch courses', reason, hint }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}