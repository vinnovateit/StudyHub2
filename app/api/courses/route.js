import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import courses from "../../../models/Courses";

export async function POST(req) {
    const { searchQuery } = await req.json()

    try{
        await connectDB();

         let errors = null;
    let courseName= searchQuery;

    if (
      courseName.length > "603f82d34b48f40004358e53".length ||
      courseName.length < "603f82d34b48f40004358e53".length
    ) {
      errors = "Course not found!";

      return NextResponse.json({
        props: {
          errors,
        },
      },{status: 200});
    } else {
      const courseData = await courses.findById(courseName);

      if (!courseData || courseData.length === 0) {
        errors = "Course not found!";
      }

      return NextResponse.json({
        props: {
          Course: JSON.parse(JSON.stringify(courseData)),
          errors: JSON.parse(JSON.stringify(errors)),
        },
      },{status:400});
    }
  } catch (e) {
    console.log("Error in connecting to DB!", e.message);
    const errors = "Internal Server Error! Please visit after sometime";
    return NextResponse.json( {
      props: {
        subjects: {},
        errors: JSON.parse(JSON.stringify(errors)),
      },
    },{status:400})
}

}