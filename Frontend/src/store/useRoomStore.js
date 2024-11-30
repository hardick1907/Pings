import { create } from 'zustand';
import { axiosInstance } from '../lib/axios.js';
import toast from 'react-hot-toast';
import { useAuthStore } from './useAuthStore.js';

export const useRoomStore = create((set,get) => ({
  rooms: [],
  messages: [],
  isRoomAdding: false,
  isLoading: false,
  isMessageSending: false,
  isMessagesLoading: false,
  selectedRoom: null,
  currentMemberCount: 0,

  createRoom: async (data) => {
    set({ isRoomAdding: true });
    try {
      const res = await axiosInstance.post('/room/createRoom', data);
      toast.success('Room created successfully');
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isRoomAdding: false });
    }
  },

  fetchRooms: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get('/room/getAllRooms');
      set({ rooms: res.data });
    } catch (error) {
      console.error('Error fetching rooms:', error.message);
      toast.error('Failed to fetch rooms');
    } finally {
      set({ isLoading: false });
    }
  },

  joinRoom: async (roomId) => {
    try {
      const res = await axiosInstance.post(`/room/rooms/${roomId}/join`);
      
      // Only show success toast if room is successfully joined
      toast.success("Room joined successfully");
      return res.data; // Return room data for navigation
    } catch (error) {
      // Specific error handling for max members reached
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data.message || "Cannot join room");
      } else {
        toast.error('Failed to join room');
      }
      console.error('Join Room Error:', error.response?.data);
      throw error; // Rethrow to allow caller to handle
    }
  },

  leaveRoom: async (roomId) => {
    try {
      const res = await axiosInstance.post(`/room/rooms/${roomId}/leave`);
      toast.success("Room left successfully");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  sendMessageToRoom: async (roomId, messageData) => {
    set({ isMessageSending: true });
    try {
      const res = await axiosInstance.post(`/room/rooms/${roomId}/messages`, messageData);
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send message");
      console.error('Error sending message:', error.response?.data);
      throw error;
    } finally {
      set({ isMessageSending: false });
    }
  },

  subscribeToMessages: (roomId) => {
    const socket = useAuthStore.getState().socket;
    
    if (!socket) {
      return;
    }
  
    socket.emit('joinRoom', roomId); 
  
    socket.on("newMessage", (newMessage) => {

      set((state) => ({
        messages: [...state.messages, newMessage]
      }));
    });
  },
  
  unsubscribeToMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (socket) {
      socket.off("newMessage");
    }
  },

  fetchMessages: async (roomId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/room/rooms/${roomId}/messages`);
      set({ messages: res.data || [] }); 
    } catch (error) {
      toast.error("Failed to fetch messages");
      set({ messages: [] }); 
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  subscribeToMemberCount: (roomId) => {
    const socket = useAuthStore.getState().socket;
    
    if (!socket) {
      return;
    }
  
    socket.emit('joinRoom', roomId);
    socket.emit('getMemberCount', roomId);
  
    socket.on("memberCountUpdate", (count) => {
      set({ currentMemberCount: count });
    });
  },

  // Method to unsubscribe from member count updates
  unsubscribeFromMemberCount: () => {
    const socket = useAuthStore.getState().socket;
    if (socket) {
      socket.off("memberCountUpdate");
    }
  },

  setSelectedRoom: (selectedRoom) => set({ selectedRoom }),

}));
