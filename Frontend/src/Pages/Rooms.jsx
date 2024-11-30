import { useEffect } from 'react';
import { Fan, Loader2 } from 'lucide-react';
import { useNavigate, Link} from 'react-router-dom';
import { useRoomStore } from '../store/useRoomStore';

export default function Rooms() {
    
    const navigate = useNavigate();
    const { rooms, fetchRooms, isLoading, joinRoom} = useRoomStore();

    useEffect(() => {
        fetchRooms();
    }, [fetchRooms]);

    const handleClick = (e) => {
        e.preventDefault();
        navigate('/createRoom');
    };

    const handleJoinRoom = async (roomId) => {
        try {
            const roomData = await joinRoom(roomId);
            if (roomData && roomData.room) {
                navigate(`/room/${roomData.room._id}`);
            }
        } catch (error) {
            console.error('Error joining room:', error);
        }
    };

    return (
        <div className="min-h-screen bg-base-200">
            <div className="flex items-center justify-center pt-20 px-4">
                <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-full">
                    <div className="flex flex-col h-full rounded-lg overflow-hidden p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold">Rooms</h2>
                            <Fan className="animate-spin" />
                            <button onClick={handleClick} className="btn btn-primary btn-sm">
                                Create Room
                            </button>
                        </div>

                        {isLoading ? (
                        <div className="flex justify-center items-center py-10">
                            <Loader2 className="animate-spin text-primary" />
                            <p className="ml-2">Loading rooms...</p>
                        </div>
                        ) : (
                        <div>
                            {rooms.length === 0 ? (
                            <p>No rooms available.</p>
                            ) : (
                            <div className="space-y-4">
                                {rooms.map((room) => (
                                <div key={room._id} className="grid grid-cols-3 p-4 border-b 
                                                border-base-300 rounded-lg hover:bg-base-200 cursor-pointer">
                                    <span
                                        className="font-medium text-ellipsis overflow-hidden whitespace-nowrap md:whitespace-normal">{room.name}</span>
                                    <span className="text-sm text-base-content/60">Max Members: {room?.maxMembers}</span>
                                    <button onClick={()=> handleJoinRoom(room._id)} className="btn btn-primary btn-sm">
                                        Join
                                    </button>
                                </div>
                                ))}
                            </div>
                            )}
                        </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
        );
};