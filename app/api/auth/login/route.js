// app/api/auth/login/route.js

import { NextResponse } from "next/server";

export async function POST(req) {
  const { username, password } = await req.json();

  // Fixed credentials for admin login
  const adminCredentials = {
    username: "admin", 
    password: "admin123" // Simple password (adjust as needed)
  };

  try {
    if (username === adminCredentials.username && password === adminCredentials.password) {
      return NextResponse.json(
        { message: "Login successful" }, 
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "Invalid username or password" }, 
        { status: 401 }
      );
    }
  } catch (e) {
    console.log("Error:", e);
    return NextResponse.json(
      { message: "Internal Server Error! Please try again later." },
      { status: 500 }
    );
  }
}
