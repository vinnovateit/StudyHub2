// File: /app/api/courses/route.js
import connectDB from "@/lib/connectDB";
import Branch from '@/models/Branch'; // Adjust this import based on your actual model structure

export async function GET(request) {
  try {
    // Connect to the database
    await connectDB();
    
    // Fetch all courses from the database
    const courses = await Branch.find({})
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
    
    // Return error response
    return new Response(JSON.stringify({ error: 'Failed to fetch courses' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}