import mongoose from "mongoose";
import { DB_NAME } from "../constants";

const connectDB = async (): Promise<void> => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}` as string,
    );
    console.log(
      "mongoDB connected : DB host :",
      connectionInstance.connection.host,
    );
  } catch (error) {
    console.log("mongoDB connection Fail: ", error);
    process.exit(1);
  }
};

export default connectDB;
