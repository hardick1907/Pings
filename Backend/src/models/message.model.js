import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  content: { type: String, required: true },
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  image: { type: String },
  createdAt: { type: Date, default: Date.now },
});

messageSchema.pre('save', async function(next) {
  if (!this.populated('sender')) {
    await this.populate('sender', 'username profilePic');
  }
  next();
});

const Message = mongoose.model('Message', messageSchema);
export default Message;