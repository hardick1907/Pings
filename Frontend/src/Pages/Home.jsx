import { MessageCircleHeart } from "lucide-react";
import { useNavigate } from "react-router-dom";


export default function Home () {
  const navigate = useNavigate();

  const handleCreateRoom = () => {
    navigate("/createRoom");
  };

  const handleJoinRoom = () => {
    navigate("/rooms");
  };

  return (
    <div className="min-h-screen bg-base-200">

      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-full">
          <div className="flex h-full rounded-lg overflow-hidden">
            <div className="w-full flex flex-1 flex-col items-center justify-center p-16 bg-base-100/50">
              <div className="max-w-md text-center space-y-6">

                <div className="flex justify-center gap-4 mb-4">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center
                            justify-center animate-bounce">
                      <MessageCircleHeart className="w-8 h-8 text-primary " />
                    </div>
                  </div>
                </div>

                <h2 className="text-2xl font-bold">Welcome to Pings!</h2>
                <p className="text-base-content/60">
                  Join a room or create a new one to start chatting!
                </p>

                <div className="flex gap-2 justify-center items-center">
                  <button onClick={handleCreateRoom} className="btn btn-primary btn-sm">
                    Create Room
                  </button>

                  <button onClick={handleJoinRoom} className="btn btn-primary btn-sm">
                    Join a Room
                  </button>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};