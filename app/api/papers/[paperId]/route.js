import { NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import Paper from "@/models/Paper";

export async function GET(req, { params }) {
  try {
    await connectDB();
    
    const paper = await Paper.findById(params.paperId);
    
    if (!paper) {
      return NextResponse.json(
        { error: "Paper not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ paper }, { status: 200 });
  } catch (error) {
    console.error("Error fetching paper:", error);
    return NextResponse.json(
      { error: "Internal Server Error! Please try again later." },
      { status: 500 }
    );
  }
}