import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { renameFileInR2 } from "@/lib/cloudflareR2";

export const runtime = "nodejs";

async function handler(req) {
  try {
    const body = await req.json();
    const { key, newName } = body || {};

    if (!key || !newName) {
      return NextResponse.json(
        { error: "Both key and newName are required" },
        { status: 400 }
      );
    }

    const file = await renameFileInR2({ oldKey: key, newFileName: newName });

    return NextResponse.json(
      {
        message: "File renamed successfully",
        file,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error renaming file in R2:", error);
    return NextResponse.json(
      {
        error:
          error.message || "Internal Server Error! Please try again later.",
      },
      { status: 500 }
    );
  }
}

export const POST = verifyToken(handler);
