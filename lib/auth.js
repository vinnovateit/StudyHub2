import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET;

export function verifyToken(handler) {
  return async (req) => {
    try {
      const authHeader = req.headers.get("Authorization");
      if (!authHeader?.startsWith("Bearer ")) {
        return NextResponse.json(
          { error: "Unauthorized - No token provided" },
          { status: 401 }
        );
      }

      const token = authHeader.split(" ")[1];
      try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;
        
        return handler(req);
      } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
          return NextResponse.json(
            { error: "Unauthorized - Token expired" },
            { status: 401 }
          );
        }
        return NextResponse.json(
          { error: "Unauthorized - Invalid token" },
          { status: 401 }
        );
      }
    } catch (error) {
      console.error("Auth error:", error);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }
  };
}