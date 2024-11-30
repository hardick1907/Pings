import { useState } from 'react';
import { useRoomStore } from '../store/useRoomStore';
import { Pickaxe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AddRoom() {
  const [name, setName] = useState('');
  const [maxMembers, setMaxMembers] = useState('');
  const { createRoom, isRoomAdding } = useRoomStore();
  const navigate =useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isRoomAdding) return;
    await createRoom({ name, maxMembers: parseInt(maxMembers, 10) });
    navigate('/rooms');
  };

  return (
    <div className="min-h-screen pt-14">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div
                className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Pickaxe className="size-12 text-primary animate-pulse" />
              </div>
              <h1 className="text-2xl font-bold mt-2">Create a Room</h1>
              <p className="text-base-content/60">Create a room and invite your friends</p>
            </div>
          </div>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <input type="text" id="name" name="name" placeholder="Enter room name"
                className="input input-bordered w-full mt-1" value={name} onChange={(e)=> setName(e.target.value)}
              required
              />
            </div>
            <div className="flex flex-col items-center mt-6">
              <div className="text-center">
                <input type="number" id="maxMembers" name="maxMembers" placeholder="Enter max members"
                  className="input input-bordered mt-1 w-full text-center" value={maxMembers} onChange={(e)=>
                setMaxMembers(e.target.value)}
                min="1"
                required
                />
              </div>
            </div>
            <div className="text-center">
              <button type="submit" className={`btn btn-primary ${isRoomAdding ? 'loading' : '' }`} disabled={isRoomAdding}>
                {isRoomAdding ? 'Creating Room...' : 'Create Room'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}