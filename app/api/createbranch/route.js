import { NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import branch from "../../../models/Branch";


export async function POST(req) {
    console.log("POST REQ")
    let error = null
    try{
        await connectDB();
        const { name, school } = await req.json()
        const newBranch = new branch({
            name,
            school,
            subjects: []
          });

        await newBranch.save()
        
        return NextResponse.json({branch_Id:JSON.parse(JSON.stringify(newBranch._id)),errors: JSON.parse(JSON.stringify(error))},{status:200})
    }
    catch(e){
        console.log(e.message)
        return NextResponse.json({errors: JSON.parse(JSON.stringify(`Internal Server Error! Please visit after sometime`))},{status:400})

    }
    



}