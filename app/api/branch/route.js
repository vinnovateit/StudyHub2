import { NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import branch from "../../../models/Branch";


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