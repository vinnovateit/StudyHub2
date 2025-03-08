import { NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import Paper from "@/models/Paper";
import Fuse from "fuse.js";

export async function POST(req) {
  try {
    await connectDB();
    
    const {
      courseCode,
      examType,
      semester,
      year,
      slot,
      subject
    } = await req.json();

    const query = {};
    if (courseCode) query.courseCode = courseCode;
    if (examType) query.examType = examType;
    if (semester) query.semester = semester;
    if (year) query.year = year;
    if (slot) query.slot = slot;

    // First get papers matching the exact criteria
    let papers = await Paper.find(query)
                          .sort({ year: -1, semester: 1 });
    
    if (subject) {
      const fuseOptions = {
        keys: ['subject'],
        includeScore: true,
        threshold: 0.3,
        ignoreLocation: true,
        ignoreCase: true,
        minMatchCharLength: 2
      };

      const fuse = new Fuse(papers, fuseOptions);
      const searchResults = fuse.search(subject);
      papers = searchResults.map(result => result.item);
    }

    return NextResponse.json({
      papers,
      count: papers.length
    }, { status: 200 });
  } catch (error) {
    console.error("Error searching papers:", error);
    return NextResponse.json(
      { error: "Internal Server Error! Please try again later." },
      { status: 500 }
    );
  }
}