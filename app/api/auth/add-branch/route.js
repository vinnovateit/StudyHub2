import { NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import Branch from "@/models/Branch";
import Course from "@/models/Courses";
import { verifyToken } from "@/lib/auth";

async function handler(req) {
  try {
    await connectDB();

    const { name, school, courseCodes } = await req.json();

    if (!name || !school || !courseCodes || !Array.isArray(courseCodes)) {
      return NextResponse.json(
        { error: "Branch name, school, and course codes array are required." },
        { status: 400 }
      );
    }

    // Validate branch name is uppercase
    if (name !== name.toUpperCase()) {
      return NextResponse.json(
        { error: "Branch name must be in uppercase letters." },
        { status: 400 }
      );
    }

    // Find existing courses by their codes
    const courses = await Course.find({ code: { $in: courseCodes } }).select(
      "_id"
    );
    const courseIds = courses.map((course) => course._id);

    if (courseIds.length !== courseCodes.length) {
      const foundCodes = courses.map((course) => course.code);
      const notFoundCodes = courseCodes.filter(
        (code) => !foundCodes.includes(code)
      );
      return NextResponse.json(
        {
          error: "One or more course codes not found.",
          notFound: notFoundCodes,
        },
        { status: 400 }
      );
    }

    // Create new branch with the course IDs
    const newBranch = new Branch({
      name,
      school,
      subjects: courseIds,
    });

    await newBranch.save();
    console.log("New branch added:", newBranch);

    return NextResponse.json(
      { message: "Branch added successfully", branch: newBranch },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding branch:", error);
    return NextResponse.json(
      { error: "Internal Server Error! Please try again later." },
      { status: 500 }
    );
  }
}

export const POST = verifyToken(handler);
