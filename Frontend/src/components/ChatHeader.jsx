import { DoorOpen } from "lucide-react";
import { useRoomStore } from "../store/useRoomStore";
import { useNavigate } from "react-router-dom";

export default function ChatHeader({ room }) {
  const { leaveRoom } = useRoomStore();
  const navigate = useNavigate();

  const handleClose = () => {
    if (!room?._id) {
    console.error("Room ID is missing. Cannot leave the room.");
    return;
    }
    leaveRoom(room._id);
    navigate("/rooms");
  };

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div>
            <h3 className="font-medium">{room ? room.name : "Loading room..."}</h3>
          </div>
        </div>
        <div>

          <div>
            {room ? (
            <span>Owner: {room.createdBy?.username || "Unknown"}</span>
            ) : (
            <span>Loading...</span>
            )}
          </div>

        </div>
        {room && ( // Only show the button if the room exists
        <button onClick={handleClose} className="btn btn-primary p-1">
          <div className="flex justify-center items-center gap-2">
            <DoorOpen /> Leave Room
          </div>

        </button>
        )}
      </div>
    </div>
  );
}