import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import courses from "../../../models/Courses";


export async function POST(req) {
    const { searchQuery } = await req.json()


    try {
        await connectDB();
        
    
        let errors = null;
    
        const queryRegex = new RegExp(searchQuery);
    
        const foundCourses = await courses.find({
          $or: [
            { name: { $regex: queryRegex, $options: "i" } },
            { code: { $regex: queryRegex, $options: "i" } },
          ],
        });
    
        if (!foundCourses || foundCourses.length === 0) {
          errors = "No courses found!";
        }
    
        const branch = "Following Results found :  ";
    
        return NextResponse.json({
            props: {
              subjects: JSON.parse(JSON.stringify(foundCourses)),
              errors: JSON.parse(JSON.stringify(errors)),
              branch: JSON.parse(JSON.stringify(branch)),
            },
          },{status:200}) ;
      } catch (e) {
        console.log("Error in connecting to DB!", e.message);
        const errors = "Internal Server Error! Please visit after sometime";
        return NextResponse.json({
          props: {
            subjects: {},
            errors: JSON.parse(JSON.stringify(errors)),
          },
        },{status:400}) ;
      }

  }