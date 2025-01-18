import { NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import Branch from "@/models/Branch";
import Course from "@/models/Courses";  

export async function POST(req) {
  try {
    // Connect to the database
    console.log("Attempting to connect to the database...");
    await connectDB();

    // Parse the request body
    const { name, school, subjects } = await req.json();
    console.log("Received data:", { name, school, subjects });

    // Validate required fields
    if (!name || !school) {
      console.error("Missing required fields:", { name, school });
      return NextResponse.json(
        { error: "Branch name and school are required." },
        { status: 400 }
      );
    }

    // Lookup subject ObjectIds from the courses collection
    const subjectIds = await Course.find({ name: { $in: subjects } }).select('_id');
    const subjectIdsArray = subjectIds.map(subject => subject._id);

    // Check if any subjects were found
    if (subjectIdsArray.length !== subjects.length) {
      console.error("Some subjects were not found:", subjects);
      return NextResponse.json(
        { error: "One or more subjects not found." },
        { status: 400 }
      );
    }

    // Create a new branch with subject ObjectIds
    const newBranch = new Branch({
      name,
      school,
      subjects: subjectIdsArray,
    });

    // Save the new branch to the database
    await newBranch.save();
    console.log("New branch added:", newBranch);

    // Return a success response
    return NextResponse.json(
      { message: "Branch added successfully", branch: newBranch },
      { status: 201 }
    );
  } catch (error) {
    // Log the error for debugging
    console.error("Error in backend:", error);

    // Return the error message
    return NextResponse.json(
      { error: "Internal Server Error! Please try again later." },
      { status: 500 }
    );
  }
}
