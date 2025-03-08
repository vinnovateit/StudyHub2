import { NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import Paper from "@/models/Paper";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

// Update paper
export async function PATCH(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 }
      );
    }

    await connectDB();
    const updates = await req.json();
    
    const paper = await Paper.findByIdAndUpdate(
      params.paperId,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!paper) {
      return NextResponse.json(
        { error: "Paper not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Paper updated successfully",
      paper
    }, { status: 200 });
  } catch (error) {
    console.error("Error updating paper:", error);
    return NextResponse.json(
      { error: "Internal Server Error! Please try again later." },
      { status: 500 }
    );
  }
}

// Delete paper
export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 }
      );
    }

    await connectDB();
    const paper = await Paper.findByIdAndDelete(params.paperId);
    
    if (!paper) {
      return NextResponse.json(
        { error: "Paper not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Paper deleted successfully"
    }, { status: 200 });
  } catch (error) {
    console.error("Error deleting paper:", error);
    return NextResponse.json(
      { error: "Internal Server Error! Please try again later." },
      { status: 500 }
    );
  }
}