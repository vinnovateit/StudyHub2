import {NextResponse} from "next/server";
import connectDB from "@/lib/connectDB";
import Course from "@/models/Courses";
import {marked} from "marked";
import sanitizeHtml from "sanitize-html";

export async function POST(req) {
    try {
        await connectDB();

        const {name, code, credits, description, modules, pdfs, das} = await req.json();

        if (!name || !code || !credits) {
            return NextResponse.json(
                {error: "Name, code and credits are required fields"},
                {status: 400}
            );
        }

        if (pdfs && !pdfs.every(pdf => pdf.name && pdf.link)) {
            return NextResponse.json(
                {error: "PDFs must have a name and link"},
                {status: 400}
            );
        }

        if (das && !das.every(da => da.name && da.link)) {
            return NextResponse.json(
                {error: "DAs must have a name and link"},
                {status: 400}
            );
        }

        // Process description markdown
        let processedDescription = {};
        if (description) {
            const sanitizedHtml = sanitizeHtml(marked(description));
            processedDescription = {
                markdown: description,
                sanitizedHtml: sanitizedHtml
            };
        }

        // Process modules markdown
        const processedModules = modules?.map((module, index) => ({
            num: index + 1,
            markdown: module.content,
            sanitizedHtml: sanitizeHtml(marked(module.content))
        })) || [];

        const newCourse = new Course({
            name,
            code,
            credits,
            description: processedDescription,
            modules: processedModules,
            pdfs: pdfs || [],
            das: das || []
        });

        await newCourse.save();

        return NextResponse.json(
            {message: "Course added successfully", course: newCourse},
            {status: 201}
        );

    } catch (error) {
        console.error("Error adding course:", error);
        return NextResponse.json(
            {error: "Internal Server Error! Please try again later."},
            {status: 500}
        );
    }
}
