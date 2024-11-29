import { Server } from "socket.io"; 
import http from "http";
import express from "express";

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
  
    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });

export {io, server, app}