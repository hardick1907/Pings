import {create} from 'zustand'
import {axiosInstance} from '../lib/axios.js'
import toast from 'react-hot-toast';
import {io} from 'socket.io-client'

const BASE_URL = import.meta.env.MODE === "development"?'http://localhost:3000':"/"

export const useAuthStore = create((set,get)=>({

  authUser: null, 
  isSigningUP: false,
  isLoggingIn: false,
  isCheckingAuth: true,
  isUpdatingProfile: false,
  socket: null,

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/user/signup", data);
      toast.success("Account created successfully");
    } catch (error) {
      if (error.response.data.message.includes("Email already exists")) {
        toast.error("Email already exists");
      } else if (error.response.data.message.includes("Username already exists")) {
        toast.error("Username already exists");
      } else {
        toast.error(error.response.data.message);
      }
    } finally {
        set({ isSigningUp: false });
      }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/user/login", data);

      if(res && res.data){
        set({authUser: res.data});
        toast.success("Login successful");
      }else{
        toast.error("Login failed");
      }

      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    }finally{
      set({isLoggingIn: false});
    }
  },

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/user/checkAuth");

      set({authUser:res.data})
      get().connectSocket();

    } catch (error) {
      console.log("Error in checkAuth:",error.message);
      set({authUser: null});
    }finally{
      set({isCheckingAuth:false})
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/user/update", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("error in update profile:", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.get("/user/logout");
      set({authUser:null});
      toast.success("Logout successful");
      get().disconnectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    }
},
connectSocket: () => {
  const { authUser , socket } = get();

  if (!authUser  || (socket && socket.connected)) return;
  const newSocket = io(BASE_URL);

  newSocket.connect();
  newSocket.on('connect', () => {});

  set({ socket: newSocket });
},

disconnectSocket: () => {
  if(get().socket?.connected) get().socket.disconnect();
},

}))