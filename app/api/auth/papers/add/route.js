import { NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import Paper from "@/models/Paper";
import Course from "@/models/Courses";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 }
      );
    }

    await connectDB();
    const paperData = await req.json();
    
    // Validate course exists
    // const course = await Course.findOne({ code: paperData.courseCode });
    // if (!course) {
    //   return NextResponse.json(
    //     { error: `Course with code ${paperData.courseCode} not found` },
    //     { status: 404 }
    //   );
    // }

    const newPaper = new Paper(paperData);
    await newPaper.save();

    return NextResponse.json(
      { message: "Paper added successfully", paper: newPaper },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding paper:", error);
    return NextResponse.json(
      { error: "Internal Server Error! Please try again later." },
      { status: 500 }
    );
  }
}