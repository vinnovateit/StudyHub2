import mongoose from "mongoose";

const connection = {isConnected:0};

async function connectDB(){
    if(connection.isConnected){
        return;

    }
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
        throw new Error("MONGO_URI is not set");
    }

    const db = await mongoose.connect(mongoUri, {
        dbName: process.env.MONGO_DB_NAME || "studyhub",
        serverSelectionTimeoutMS: 10000,
    });

    connection.isConnected = db.connections[0].readyState;
    console.log("--------CONNECTED--------")
   

}

export default connectDB;
