import { NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
export const runtime = "nodejs";
import Course from "@/models/Courses";
import { verifyToken } from "@/lib/auth";

async function handler(req) {
  try {
    await connectDB();

    const {
      code,
      name,
      credits,
      description,
      preview,
      modules,
      links,
      videos,
      DAs,
    } = await req.json();

    if (!code) {
      return NextResponse.json(
        { error: "Course code is required" },
        { status: 400 }
      );
    }

    // Check if course exists...
    const existingCourse = await Course.findOne({ code });
    if (!existingCourse) {
      return NextResponse.json(
        { error: `Course with code ${code} not found` },
        { status: 404 }
      );
    }

    const validateUrls = (urls) => {
      return urls
        ? urls.every(
            (item) =>
              item.text &&
              item.url &&
              typeof item.text === "string" &&
              typeof item.url === "string"
          )
        : true;
    };

    // Validate course-level resources
    if (!validateUrls(links) || !validateUrls(videos) || !validateUrls(DAs)) {
      return NextResponse.json(
        { error: "All course resources must have valid text and url fields" },
        { status: 400 }
      );
    }

    // Validate modules (if provided)
    if (modules) {
      for (const m of modules) {
        if (!m.title || !m.description) {
          return NextResponse.json(
            { error: "Each module must have a title and description" },
            { status: 400 }
          );
        }

        if (
          !validateUrls(m.pdfs) ||
          !validateUrls(m.links) ||
          !validateUrls(m.videos)
        ) {
          return NextResponse.json(
            { error: "Invalid resource format in module" },
            { status: 400 }
          );
        }

        if (m.topics) {
          for (const topic of m.topics) {
            if (!topic.name) {
              return NextResponse.json(
                { error: "Each topic must have a name" },
                { status: 400 }
              );
            }

            if (
              !validateUrls(topic.pdfs) ||
              !validateUrls(topic.links) ||
              !validateUrls(topic.videos)
            ) {
              return NextResponse.json(
                { error: "Invalid resource format in topic" },
                { status: 400 }
              );
            }
          }
        }
      }
    }

    // Process modules (if in req)
    const processedModules = modules?.map((m, index) => ({
      num: index + 1,
      title: m.title,
      description: m.description,
      topics:
        m.topics?.map((topic) => ({
          name: topic.name,
          description: topic.description || "",
          pdfs: topic.pdfs || [],
          links: topic.links || [],
          videos: topic.videos || [],
        })) || [],
      pdfs: m.pdfs || [],
      links: m.links || [],
      videos: m.videos || [],
    }));

    // Create update object
    const updateData = {
      ...(name && { name }),
      ...(credits && { credits }),
      ...(description && { description }),
      ...(preview && { preview }),
      ...(modules && { modules: processedModules }),
      ...(links && { links }),
      ...(videos && { videos }),
      ...(DAs && { DAs }),
    };

    const updatedCourse = await Course.findOneAndUpdate({ code }, updateData, {
      new: true,
    });

    return NextResponse.json(
      { message: "Course updated successfully", course: updatedCourse },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating course:", error);
    return NextResponse.json(
      { error: "Internal Server Error! Please try again later." },
      { status: 500 }
    );
  }
}

export const PATCH = verifyToken(handler);
