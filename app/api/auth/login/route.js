import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET;

export async function POST(req) {
  const { username, password } = await req.json();

  // Load credentials from .env
  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPassword = process.env.ADMIN_PASSWORD;

  try {
    if (username === adminUsername && password === adminPassword) {
      // Generate JWT token
      const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });

      return NextResponse.json(
        { message: "Login successful", token },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "Invalid username or password" },
        { status: 401 }
      );
    }
  } catch (e) {
    console.error("Error:", e);
    return NextResponse.json(
      { message: "Internal Server Error! Please try again later." },
      { status: 500 }
    );
  }
}
