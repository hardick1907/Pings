import { create } from "zustand";
import { persist } from "zustand/middleware";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore.js";

export const useRoomStore = create(
  persist(
    (set, get) => ({
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
          const res = await axiosInstance.post("/room/createRoom", data);
          toast.success("Room created successfully");
        } catch (error) {
          toast.error(error.response?.data?.message || "Failed to create room");
        } finally {
          set({ isRoomAdding: false });
        }
      },

      fetchRooms: async () => {
        set({ isLoading: true });
        try {
          const res = await axiosInstance.get("/room/getAllRooms");
          set({ rooms: res.data });
        } catch (error) {
          console.error("Error fetching rooms:", error.message);
          toast.error("Failed to fetch rooms");
        } finally {
          set({ isLoading: false });
        }
      },

      joinRoom: async (roomId) => {
        const { selectedRoom } = get();
      
        if (selectedRoom) {
          toast.error("You are already in a room!");
          return;
        }
      
        try {
          const res = await axiosInstance.post(`/room/rooms/${roomId}/join`);
          toast.success("Room joined successfully");
      
          set({ selectedRoom: res.data.room });
          console.log("Joined room:", res.data.room);
          return res.data;
        } catch (error) {
          if (error.response && error.response.status === 400) {
            toast.error(error.response?.data?.message || "Cannot join room");
          } else {
            toast.error("Failed to join room");
          }
          console.error("Join Room Error:", error.response?.data);
          throw error;
        }
      },
      

      leaveRoom: async (roomId) => {
        try {
          await axiosInstance.post(`/room/rooms/${roomId}/leave`);
          toast.success("Room left successfully");
          set({ selectedRoom: null });
        } catch (error) {
          toast.error(error.response?.data?.message || "Failed to leave room");
        }
      },

      sendMessageToRoom: async (roomId, messageData) => {
        set({ isMessageSending: true });
        try {
          const res = await axiosInstance.post(
            `/room/rooms/${roomId}/messages`,
            messageData
          );
          return res.data;
        } catch (error) {
          toast.error(error.response?.data?.message || "Failed to send message");
          console.error("Error sending message:", error.response?.data);
          throw error;
        } finally {
          set({ isMessageSending: false });
        }
      },

      subscribeToMessages: (roomId) => {
        const socket = useAuthStore.getState().socket;

        if (!socket) return;

        socket.emit("joinRoom", roomId);

        socket.on("newMessage", (newMessage) => {
          set((state) => ({
            messages: [...state.messages, newMessage],
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

        if (!socket) return;

        socket.emit("joinRoom", roomId);
        socket.emit("getMemberCount", roomId);

        socket.on("memberCountUpdate", (count) => {
          set({ currentMemberCount: count });
        });
      },

      unsubscribeFromMemberCount: () => {
        const socket = useAuthStore.getState().socket;
        if (socket) {
          socket.off("memberCountUpdate");
        }
      },

      setSelectedRoom: (selectedRoom) => set({ selectedRoom }),
      }),

      {
        name: "room-storage",
        partialize: (state) => ({
          selectedRoom: state.selectedRoom,
          rooms: state.rooms,
          messages: state.messages,
          currentMemberCount: state.currentMemberCount,
        }),
      }
  )
);
