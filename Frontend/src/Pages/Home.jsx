import NoRoomSelected from "../components/NoRoomSelected";
import { useRoomStore } from "../store/useRoomStore";
import ChatBox from "./ChatBox";

export default function Home () {

  const {selectedRoom, rooms} = useRoomStore();
  
  return (
    <div>
      {selectedRoom ?  <ChatBox selectedRoom={selectedRoom}/> :<NoRoomSelected/>}
    </div>
  );
};