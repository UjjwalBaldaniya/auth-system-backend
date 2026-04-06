import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  username?: string;
  email: string;
  password?: string;
  provider: "local" | "google";
  avatar?: string;
}

const UserSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: false,
    },
    provider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
    avatar: {
      type: String,
    },
  },
  { timestamps: true },
);

export default mongoose.model<IUser>("User", UserSchema);
