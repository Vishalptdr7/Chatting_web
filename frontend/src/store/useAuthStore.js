import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:3000" : "/";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  
  checkAuth: async () => {
  try {
    const res = await axiosInstance.get("/user/check");

    console.log("✅ Authenticated User:", res.data); // Debugging log

    if (res.data.statusCode) {
      // Extract user data correctly
      set({ authUser: res.data.statusCode });
      get().connectSocket();
    } else {
      set({ authUser: null });
    }
  } catch (error) {
    console.log("❌ Error in checkAuth:", error);
    set({ authUser: null });
  } finally {
    set({ isCheckingAuth: false });
  }
}
,

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/user/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfully");
      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/user/login", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully");

      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/user/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
      console.log("user disconnected");
      get().disconnectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/user/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("error in update profile:", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    const { authUser } = get();

    // Debugging log
    console.log("🔗 Connecting socket with authUser:", authUser);

    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id, // Ensure this is being sent
      },
    });

    socket.connect();
    set({ socket });

    socket.on("getOnlineUsers", (userIds) => {
      console.log("📡 Received Online Users:", userIds);
      set({ onlineUsers: userIds });
    });
  },
  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },
  // connectSocket: () => {
  //   const { authUser, socket } = get();
  //   if (!authUser || (socket && socket.connected)) return;

  //   const newSocket = io(BASE_URL, {
  //     query: { userId: authUser._id },
  //   });

  //   newSocket.on("connect", () => {
  //     console.log("Socket connected:", newSocket.id);
  //   });

  //   newSocket.on("getOnlineUsers", (userIds) => {
  //     set({ onlineUsers: userIds });
  //   });

  //   set({ socket: newSocket });
  // },
}));
