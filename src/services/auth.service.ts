import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";
import admin from "../config/firebase-admin";
import User from "../models/user.model";
import { JwtData, LoginPayload, RegisterPayload } from "../types/auth.types";
import { ApiError } from "../utils/ApiError";

const SALT_ROUNDS = 10;

export const signupUser = async ({
  username,
  email,
  password,
}: RegisterPayload) => {
  const existing = await User.findOne({ email });

  if (existing) {
    throw new ApiError(400, "Email already exists");
  }

  const hashed = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await User.create({
    username,
    email,
    password: hashed,
  });

  return {
    id: user._id.toString(),
    username: user.username,
    email: user.email,
  };
};

export const signinUser = async ({ email, password }: LoginPayload) => {
  const user = await User.findOne({
    $or: [{ email }, { username: email }],
  });

  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }

  if (user.provider === "google") {
    throw new ApiError(400, "Please login with Google");
  }

  if (!user.password) {
    throw new ApiError(401, "Invalid credentials");
  }

  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  const payload: JwtData = {
    userId: user._id.toString(),
  };

  const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY as SignOptions["expiresIn"],
  });

  const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET!, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY as SignOptions["expiresIn"],
  });

  return {
    accessToken,
    refreshToken,
    userId: user._id.toString(),
    username: user.username,
    email: user.email,
  };
};

export const handleRefreshToken = async (token: string) => {
  if (!token) {
    throw new ApiError(401, "Refresh token required");
  }

  let decoded: JwtData;

  try {
    decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!) as JwtData;
  } catch (error) {
    throw new ApiError(401, "Invalid refresh token");
  }

  const newAccessToken = jwt.sign(
    {
      userId: decoded.userId,
    },
    process.env.ACCESS_TOKEN_SECRET!,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY as SignOptions["expiresIn"],
    },
  );

  return { accessToken: newAccessToken };
};

export const handleGoogleLogin = async (token: string) => {
  if (!token) {
    throw new ApiError(400, "Token required");
  }

  const decoded = await admin.auth().verifyIdToken(token);
  const { email, name, picture } = decoded;
  let user = await User.findOne({ email });

  if (!user) {
    user = await User.create({
      email,
      username: name,
      avatar: picture,
      provider: "google",
    });
  }

  const payload = { userId: user._id.toString() };

  const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY as SignOptions["expiresIn"],
  });

  const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET!, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY as SignOptions["expiresIn"],
  });

  return {
    accessToken,
    refreshToken,
    userId: user._id.toString(),
    email: user.email,
    username: user.username,
  };
};
