import mongoose from "mongoose";

const connection = {isConnected:0};

async function connectDB(){
    if(connection.isConnected){
        return;

    }
    const db = await mongoose.connect(process.env.MONGO_URI, {
        dbName: process.env.MONGO_DB_NAME || "studyhub",
    })

    connection.isConnected = db.connections[0].readyState;
    console.log("--------CONNECTED--------")
   

}

export default connectDB;
