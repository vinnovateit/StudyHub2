import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
export const runtime = "nodejs";
import courses from "../../../models/Courses";
import Fuse from "fuse.js";

export async function POST(req) {
  const { searchQuery } = await req.json();

  try {
    await connectDB();

    // Extract first word before any space
    const firstWord = searchQuery.trim().split(/\s+/)[0];
    
    // If empty input after trimming
    if (!firstWord) {
      return NextResponse.json({
        props: {
          subjects: [],
          errors: "Please enter a valid search term",
        },
      }, { status: 200 });
    }

    // Get all courses from database
    const allCourses = await courses.find({});
    
    // Configure Fuse.js options
    const fuseOptions = {
      keys: ['name', 'code'],
      includeScore: true,
      threshold: 0.3,
      ignoreLocation: true,
      ignoreCase: true,
      minMatchCharLength: 2
    };

    // Create Fuse instance
    const fuse = new Fuse(allCourses, fuseOptions);

    // Perform fuzzy search
    const searchResults = fuse.search(firstWord, { limit: 50 });
    
    // Extract matched items
    const foundCourses = searchResults.map(result => result.item);

    return NextResponse.json({
      props: {
        subjects: JSON.parse(JSON.stringify(foundCourses)),
        errors: foundCourses.length === 0 ? "No courses found!" : null,
      },
    }, { status: 200 });

  } catch (e) {
    console.error("Database error:", e);
    return NextResponse.json({
      props: {
        subjects: [],
        errors: "Internal Server Error! Please try again later",
      },
    }, { status: 500 });
  }
}