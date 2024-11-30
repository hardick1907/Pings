import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  currentMemberCount: { type: Number, default: 0 }, // New field to track current members
  maxMembers: { type: Number, required: true, min: 1 },
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }]
});

const Room = mongoose.model('Room', roomSchema);
export default Room;