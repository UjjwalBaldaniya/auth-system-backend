import { Router } from "express";
import { refreshToken, signin, signup } from "../controllers/auth.controller";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.post("/signup", asyncHandler(signup));
router.post("/signin", asyncHandler(signin));
router.post("/refresh", asyncHandler(refreshToken));

export default router;
