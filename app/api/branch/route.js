import { NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
export const runtime = "nodejs";
import branch from "../../../models/Branch";
// NOTE: Do NOT remove unless you are sure what you are doing
// Yes, your IDE is right & the import is technically unused,
// but it is required for the schema to be registered
// Also yes, it should be done in a better way later (TODO:fixme)
import courses from "../../../models/Courses";

export async function POST(req) {
    const { searchQuery } = await req.json()

    try {
        await connectDB();


        let branchName = searchQuery;
        branchName = branchName.toUpperCase();
        

        const branchData = await branch.find({ name: branchName }).populate("subjects").exec();
        const subjects = branchData[0].subjects;
        let errors = null;
        
        if (!subjects || subjects.length === 0) {
            console.log("Subject Error: No Subjects Found");
            errors = "Internal Server Error! Please visit after sometime";
            
        }
        return NextResponse.json( {
            props: {
                subjects: JSON.parse(JSON.stringify(subjects)),
                errors: JSON.parse(JSON.stringify(errors)),
            },
        },{status:200});
    } catch (e) {
        console.log("Error in connecting to DB!", e.message);
        
        const errors = "Internal Server Error! Please visit after sometime";
        return NextResponse.json({
            props: {
                subjects: {},
                errors: JSON.parse(JSON.stringify(errors)),
            },
        },{status:400});
    }



}