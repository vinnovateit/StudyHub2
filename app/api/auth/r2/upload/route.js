import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { uploadFileToR2 } from "@/lib/cloudflareR2";
import { getDocumentUploadError } from "@/lib/documentUpload";

export const runtime = "nodejs";

async function handler(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const folderPrefix = formData.get("folder")?.toString() || "module-pdfs";
    const desiredFileName = formData.get("desiredFileName")?.toString()?.trim();

    if (!file || typeof file.arrayBuffer !== "function") {
      return NextResponse.json(
        { error: "A supported document file is required" },
        { status: 400 }
      );
    }

    const validationError = getDocumentUploadError(file);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const uploaded = await uploadFileToR2(file, { folderPrefix, desiredFileName });

    return NextResponse.json(
      {
        message: "File uploaded successfully",
        file: uploaded,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error uploading file to R2:", error);
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
