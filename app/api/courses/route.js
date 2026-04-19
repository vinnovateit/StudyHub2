import { NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
export const runtime = "nodejs";
import courses from "../../../models/Courses";

export async function POST(req) {
  const { courseCode } = await req.json();

  try {
    await connectDB();
    const courseData = await courses.findOne({ code: courseCode });

    if (!courseData) {
      return NextResponse.json(
        {
          props: {
            errors: "Course not found!",
          },
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        props: {
          Course: JSON.parse(JSON.stringify(courseData)),
          errors: null,
        },
      },
      { status: 200 }
    );
  } catch (e) {
    console.log("Error in connecting to DB!", e.message);
    const errors = "Internal Server Error! Please try again later";
    return NextResponse.json(
      {
        props: {
          Course: {},
          errors: JSON.parse(JSON.stringify(errors)),
        },
      },
      { status: 500 }
    );
  }
}
