import express from "express";

import { checkAuth, login, logout, signup, updateProfile } from "../controllers/auth.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.js";

const router = express.Router();

router.post("/login", login);
router.post("/signup", signup);
router.post("/logout", logout);

router.put("/update-profile", protectRoute,upload.single("profilePic"), updateProfile);

router.get("/check", protectRoute, checkAuth);

export default router;
