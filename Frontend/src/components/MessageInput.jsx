import { Image, Send, X } from "lucide-react";
import TipTap from "./TipTap";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { useRoomStore } from "../store/useRoomStore.js";

export default function MessageInput({ roomId }) {
  const { sendMessageToRoom } = useRoomStore();
  const [editor, setEditor] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSendMessage = async () => {
    if (!roomId) {
      toast.error("Room ID is missing.");
      return;
    }

    const content = editor.getHTML();
    const image = imagePreview ? imagePreview : null;

    const messageData = { content, image };
    console.log("Sending message data:", messageData);

    try {
      await sendMessageToRoom(roomId, messageData);

      if (editor) {
        editor.commands.clearContent();
      }
      setImagePreview(null);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error("Failed to send message.");
    }
  };

  return (
    <div className="flex flex-col">
      {imagePreview && (
        <div className="mb-2 flex items-center gap-2">
          <div className="relative">
            <img 
              src={imagePreview} 
              alt="Preview" 
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700" 
            />
            <button 
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300 flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center space-x-2">
        <div className="flex-grow">
          <TipTap 
            onEditorReady={(editorInstance) => setEditor(editorInstance)} 
            onSendMessage={handleSendMessage} 
          />
        </div>

        <button 
          type="button" 
          className="btn btn-circle" 
          onClick={handleSendMessage}
        >
          <Send size={24} />
        </button>
      </div>

      <div className="flex justify-center items-center mt-2 space-x-2">
        <input 
          type="file" 
          accept="image/*" 
          className="hidden" 
          ref={fileInputRef} 
          onChange={handleImageChange} 
        />
        <button 
          type="button" 
          className="btn btn-outline w-half"
          onClick={() => fileInputRef.current.click()}
        >
          <Image size={16} className="mr-2" />
          Add Image
        </button>
      </div>
    </div>
  );
}