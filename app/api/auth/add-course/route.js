import { NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import Course from "@/models/Courses";
import { marked } from "marked";
import sanitizeHtml from "sanitize-html";
import { verifyToken } from "@/lib/auth";

async function handler(req) {
  try {
    await connectDB();

    const {
      name,
      code,
      credits,
      description,
      preview,
      modules,
      links,
      videos,
      DAs,
    } = await req.json();

    // Check if course already exists
    const existingCourse = await Course.findOne({ code });
    if (existingCourse) {
      return NextResponse.json(
        { error: `A course with code ${code} already exists` },
        { status: 409 }
      );
    }

    if (!name || !code || !credits || !description || !preview) {
      return NextResponse.json(
        {
          error:
            "Name, code, credits, description and preview are required fields",
        },
        { status: 400 }
      );
    }

    // Helper function to validate URL arrays
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

    // Validate modules
    if (modules) {
      for (const module of modules) {
        if (!module.title || !module.description) {
          return NextResponse.json(
            { error: "Each module must have a title and description" },
            { status: 400 }
          );
        }

        // Validate module-level resources
        if (
          !validateUrls(module.pdfs) ||
          !validateUrls(module.links) ||
          !validateUrls(module.videos)
        ) {
          return NextResponse.json(
            { error: "Invalid resource format in module" },
            { status: 400 }
          );
        }

        // Validate topics
        if (module.topics) {
          for (const topic of module.topics) {
            if (!topic.name) {
              return NextResponse.json(
                { error: "Each topic must have a name" },
                { status: 400 }
              );
            }

            // Validate topic-level resources
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

    // Process modules
    const processedModules =
      modules?.map((module, index) => ({
        num: index + 1,
        title: module.title,
        description: module.description,
        topics:
          module.topics?.map((topic) => ({
            name: topic.name,
            description: topic.description || "",
            pdfs: topic.pdfs || [],
            links: topic.links || [],
            videos: topic.videos || [],
          })) || [],
        pdfs: module.pdfs || [],
        links: module.links || [],
        videos: module.videos || [],
      })) || [];

    const newCourse = new Course({
      name,
      code,
      credits,
      description,
      preview,
      modules: processedModules,
      links: links || [],
      videos: videos || [],
      DAs: DAs || [],
    });

    await newCourse.save();

    return NextResponse.json(
      { message: "Course added successfully", course: newCourse },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding course:", error);
    return NextResponse.json(
      { error: "Internal Server Error! Please try again later." },
      { status: 500 }
    );
  }
}

export const POST = verifyToken(handler);
