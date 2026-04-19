import { NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import Paper from "@/models/Paper";

export const runtime = "nodejs";

export async function GET(req, { params }) {
  try {
    await connectDB();
    
    const papers = await Paper.find({ courseCode: params.courseCode })
                            .sort({ year: -1, semester: 1 });
    
    if (!papers || papers.length === 0) {
      return NextResponse.json({ 
        message: "No papers found for this course",
        papers: [] 
      }, { status: 200 });
    }

    return NextResponse.json({ papers }, { status: 200 });
  } catch (error) {
    console.error("Error fetching papers:", error);
    return NextResponse.json(
      { error: "Internal Server Error! Please try again later." },
      { status: 500 }
    );
  }
}