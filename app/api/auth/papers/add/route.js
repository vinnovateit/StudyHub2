import { NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
export const runtime = "nodejs";
import Paper from "@/models/Paper";
import Course from "@/models/Courses";
import { verifyToken } from "@/lib/auth";

async function handler(req) {
  try {
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

export const POST = verifyToken(handler);