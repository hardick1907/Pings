import { Server } from "socket.io"; 
import http from "http";
import express from "express";
import Room from "../models/room.model.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server,{
    cors: {
        origin:["http://localhost:5173"],
    }
})

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  // Optional: Add a listener for member count requests
  socket.on("getMemberCount", async (roomId) => {
    try {
      const room = await Room.findById(roomId);
      if (room) {
        socket.emit('memberCountUpdate', room.currentMemberCount);
      }
    } catch (error) {
      console.error('Error getting member count:', error);
    }
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

export {io, server, app}