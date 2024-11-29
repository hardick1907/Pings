import Message from "../models/message.model.js";
import Room from "../models/room.model.js";
import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";
import { io } from "../lib/socket.js";

export const createRoom = async (req, res) => {
    const { name, maxMembers } = req.body;
    const createdBy = req.user._id;
  
    try {
      const existingRoom = await Room.findOne({ name });
      if (existingRoom) {
        return res.status(400).json({ message: 'Room name already exists' });
      }
  
      const room = new Room({ name, createdBy, maxMembers,messages:[] });
      await room.save();
  
      res.status(201).json({ message: 'Room created successfully', room });
    } catch (error) {
      console.error('Error creating room:', error.message);
      res.status(500).json({ message: 'Server error' });
    }
};

export const getAllRooms = async (req, res) => {
  try {

    const rooms = await Room.find()
      .populate('createdBy', 'username profilePic') 
      .populate({
        path: 'members',
        select: 'username profilePic'
    }).exec();
    
    res.status(200).json(rooms);
  } catch (error) {
    console.error('Error fetching rooms:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

export const joinRoom = async (req, res) => {
  const { roomId } = req.params;
  const userId = req.user._id; 

  try {

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    if (room.members.length >= room.maxMembers) {
      return res.status(400).json({ message: 'Room has reached its maximum capacity' });
    }

    if (room.members.includes(userId)) {
      return res.status(400).json({ message: 'You are already in this room' });
    }

    room.members.push(userId);
    await room.save(); 

    res.status(200).json({ message: 'You have joined the room', room });
  } catch (error) {
    console.error('Error joining room:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

export const leaveRoom = async (req, res) => {
  const { roomId } = req.params;
  const userId = req.user._id; 

  try {
    const room = await Room.findById(roomId);

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    if (!room.members.includes(userId)) {
      return res.status(400).json({ message: 'You are not a member of this room' });
    }

    room.members = room.members.filter(member => member.toString() !== userId.toString());
    await room.save();

    res.status(200).json({ message: 'You have left the room', room });
  } catch (error) {
    console.error('Error leaving room:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

export const sendMessageToRoom = async (req, res) => {
  const { content, image } = req.body;
  const sender = req.user._id;
  const roomId = req.params.roomId;

  try {
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    let imageUrl = null;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const message = new Message({
      content,
      room: roomId,
      sender,
      image: imageUrl,
    });

    await message.populate('sender', 'username profilePic');
    await message.save();
    room.messages.push(message._id);
    await room.save();

    const messageWithId = {
      ...message.toObject(),
      UserId: Date.now()
    };

    io.to(roomId).emit('newMessage', messageWithId);

    res.status(201).json(message);
  } catch (error) {
    console.error('Error sending message:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getMessages = async (req, res) => {
  const { roomId } = req.params;

  try {

    const room = await Room.findById(roomId)
    .populate({
        path: 'messages',
        populate: { path: 'sender', select: 'username profilePic' }
    });

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    res.status(200).json(room.messages);
  } catch (error) {
    console.error('Error fetching messages:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

