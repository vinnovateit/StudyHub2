import { NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import Branch from "@/models/Branch";
import Course from "@/models/Courses";

export async function PATCH(req) {
  try {
    await connectDB();

    const { branchName, courseCodes } = await req.json();

    if (!branchName || !courseCodes || !Array.isArray(courseCodes)) {
      return NextResponse.json(
        { error: "Branch name and course codes array are required." },
        { status: 400 }
      );
    }

    // Find existing branch by name...
    const existingBranch = await Branch.findOne({ name: branchName });
    if (!existingBranch) {
      return NextResponse.json(
        { error: `Branch "${branchName}" not found.` },
        { status: 404 }
      );
    }

    // Find course ObjectIds
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

    // Update branch with new course IDs
    const updatedBranch = await Branch.findByIdAndUpdate(
      existingBranch._id,
      { subjects: courseIds },
      { new: true }
    ).populate("subjects");

    return NextResponse.json(
      { message: "Branch updated successfully", branch: updatedBranch },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating branch:", error);
    return NextResponse.json(
      { error: "Internal Server Error! Please try again later." },
      { status: 500 }
    );
  }
}
