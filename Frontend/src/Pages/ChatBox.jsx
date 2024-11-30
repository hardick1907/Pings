import { useEffect, useState ,useRef} from "react";
import { useParams } from "react-router-dom";
import { useRoomStore } from "../store/useRoomStore";
import ChatHeader from "../components/ChatHeader";
import MessageInput from "../components/MessageInput";
import { useAuthStore } from "../store/useAuthStore";
import MessageSkeleton from "../components/skeletons/MessageSkeleton";
import { formatMessageTime } from "../lib/utils";

export default function ChatBox() {
  const { id } = useParams();
  const { 
    rooms, 
    fetchRooms, 
    fetchMessages, 
    messages, 
    isMessagesLoading, 
    subscribeToMessages,
    unsubscribeToMessages} = useRoomStore();
  const { authUser } = useAuthStore();
  const [room, setRoom] = useState(null);
  const isSubscribedRef = useRef(false);
  const messageeEndRef = useRef(null);

  useEffect(() => {
    const fetchRoomsOnce = async () => {
    await fetchRooms();
    };
    fetchRoomsOnce();
  }, [fetchRooms]);

  useEffect(() => {
    const currentRoom = rooms.find((room) => room._id === id);
    setRoom(currentRoom || null);

    if (currentRoom) {
      fetchMessages(currentRoom._id).then(() => {
      const socket = useAuthStore.getState().socket;
      if (!socket) {
        console.error("Socket not connected");
        return;
      }

      if (!isSubscribedRef.current) {
        subscribeToMessages(currentRoom._id);
        isSubscribedRef.current = true;
      }
      });
    }

    return () => {
      unsubscribeToMessages();
      isSubscribedRef.current = false;
    };
  }, [id, rooms, fetchMessages, subscribeToMessages, unsubscribeToMessages]);

  useEffect(()=>{
    if(messageeEndRef.current && messages)
    messageeEndRef.current.scrollIntoView({behavior:"smooth"})
  },[messages])

  if (isMessagesLoading) {
    return (
      <div className="h-screen bg-base-200">
        <div className="flex items-center justify-center pt-20 px-4">
          <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
            <div className="flex h-full rounded-lg overflow-hidden">
              <div className="flex-1 flex flex-col overflow-auto">
                <ChatHeader room={room} />
                <MessageSkeleton />
                <MessageInput roomId={room?._id} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            <div className="flex-1 flex flex-col overflow-auto">
              <ChatHeader room={room} />
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                <div key={message._id} className={`chat ${message.sender._id===authUser ._id ? "chat-end" : "chat-start" }`}
                  ref={messageeEndRef}>

                  <div className="chat-image avatar flex gap-0 flex-col">
                    <strong>{message.sender.username}</strong>
                    <div className="w-10 h-10 rounded-full border">

                      <img src={message.sender._id===authUser ._id ? authUser .profilePic || "/avatar.png" :
                        message.sender.profilePic || "/avatar.png" } alt="Profile Picture"
                        className="w-full h-full object-cover" />
                    </div>

                  </div>
                  <div className="chat-content">
                    <div className={`chat-bubble flex flex-col 
                      ${message.sender._id===authUser ._id ? "bg-secondary text-secondary-content" : "bg-accent text-accent-content" }`}>
                      {message.image && <img src={message.image} alt="attachment"
                        className="sm:max-w-[200px] rounded-md mb-2" />}
                      {message.content &&
                      <div dangerouslySetInnerHTML={{ __html: message.content  }} />}
                    </div>
                    <div className="chat-footer mt-1 text-sm">
                      <time>{ formatMessageTime(message.createdAt)}</time>
                    </div>
                  </div>
                </div>
                ))}
              </div>
              <MessageInput roomId={room?._id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
