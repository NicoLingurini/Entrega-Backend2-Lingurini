import mongoose from "mongoose";
import { MONGO_URI } from "./config/env.js";

export const connectDB = async () => {
  await mongoose.connect(MONGO_URI, { dbName: "ecommerce" });
  console.log("MongoDB conectado");
};
