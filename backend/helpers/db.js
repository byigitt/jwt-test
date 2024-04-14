import mongoose from "mongoose";

export default async function db() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("[%] connected to database: " + mongoose.connection.name);
  } catch (error) {
    console.error(error);
  }
}
