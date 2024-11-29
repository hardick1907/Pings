import express from "express";
import { createRoom, getAllRooms, getMessages, joinRoom, leaveRoom, sendMessageToRoom } from "../controllers/room.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/createRoom", protectRoute, createRoom);
router.get("/getAllRooms", protectRoute, getAllRooms);
router.post("/rooms/:roomId/join", protectRoute, joinRoom); 
router.post("/rooms/:roomId/leave", protectRoute, leaveRoom); 
router.post("/rooms/:roomId/messages", protectRoute, sendMessageToRoom);
router.get("/rooms/:roomId/messages", protectRoute, getMessages);

export default router;
