import { Request, Response } from "express";
import {
  handleGoogleLogin,
  handleRefreshToken,
  signinUser,
  signupUser,
} from "../services/auth.service";
import { ApiResponse } from "../utils/ApiResponse";

export const signup = async (req: Request, res: Response) => {
  const result = await signupUser(req.body);

  return res
    .status(201)
    .json(new ApiResponse("User registered successfully", result));
};

export const signin = async (req: Request, res: Response) => {
  const result = await signinUser(req.body);

  return res
    .status(200)
    .json(new ApiResponse("User logged in successfully", result));
};

export const refreshToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  const result = await handleRefreshToken(refreshToken);

  return res
    .status(200)
    .json(new ApiResponse("Access token refreshed", result));
};

export const googleLogin = async (req: Request, res: Response) => {
  const result = await handleGoogleLogin(req.body.token);

  return res
    .status(200)
    .json(new ApiResponse("Google login successful", result));
};
