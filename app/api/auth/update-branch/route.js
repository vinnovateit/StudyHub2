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

    // Find da ObjectIds
    const newSubjectIds = await Course.find({ code: { $in: courseCodes } }).select('_id');
    const newSubjectIdsArray = newSubjectIds.map(subject => subject._id);

    if (newSubjectIdsArray.length !== courseCodes.length) {
      const foundCodes = await Course.find({ code: { $in: courseCodes } }).select('code');
      const notFoundCodes = courseCodes.filter(code => 
        !foundCodes.some(course => course.code === code)
      );
      return NextResponse.json(
        { 
          error: "One or more course codes not found.", 
          notFound: notFoundCodes 
        },
        { status: 400 }
      );
    }

    // Combine existing and new subjects 
    const updatedSubjects = [...new Set([
      ...existingBranch.subjects.map(id => id.toString()),
      ...newSubjectIdsArray.map(id => id.toString())
    ])].map(id => id);

    // Andd update the branch
    const updatedBranch = await Branch.findByIdAndUpdate(
      existingBranch._id,
      { subjects: updatedSubjects },
      { new: true }
    ).populate('subjects');

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
