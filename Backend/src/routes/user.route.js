import express from "express";
import { checkAuth, login, logout, signup, updateProfile } from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup",signup);
router.post("/login",login);
router.get("/logout",logout);
router.put('/update',protectRoute,updateProfile)
router.get("/checkAuth",protectRoute,checkAuth);

export default router;