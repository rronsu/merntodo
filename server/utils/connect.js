import mongoose from "mongoose";

const connection = {isConnected:null}
export const connectToDB = async () => {
    try {
        if(connection.isConnected){
            console.log("Using existing connection")
            return;
        }
        const db = await mongoose.connect(process.env.MONGO_URI);
        connection.isConnected = db.connections[0].readyState;
    } catch (error) {
        console.log("Error connecting to DB", error);
    }
}