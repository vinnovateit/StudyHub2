import mongoose from "mongoose";

const connection = { isConnected: 0 };

async function connectDB() {
  if (connection.isConnected) {
    return;
  }

  // Cloudflare workers can fail on mongodb+srv DNS TXT lookups.
  // Allow a direct mongodb:// URI override for production.
  const mongoUri = process.env.MONGO_URI_DIRECT || process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error("MONGO_URI is not set (or MONGO_URI_DIRECT for Cloudflare)");
  }

  const db = await mongoose.connect(mongoUri, {
    dbName: process.env.MONGO_DB_NAME || "studyhub",
    serverSelectionTimeoutMS: 10000,
  });

  connection.isConnected = db.connections[0].readyState;
  console.log("--------CONNECTED--------");
}

export default connectDB;
