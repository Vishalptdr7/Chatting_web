import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useGroupChatStore = create((set, get) => ({
  groupMessages: [],
  groups: [],
  selectedGroup: null,
  isGroupsLoading: false,
  isGroupMessagesLoading: false,

  createGroup: async ({ groupName, members }) => {
    try {
      const res = await axiosInstance.post("/group", { groupName, members });
      toast.success(res.data.message);
      set({ groups: [...get().groups, res.data.group] });
      return { groupId: res.data.group._id };
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create group");
    }
  },

  getGroup: async () => {
    set({ isGroupsLoading: true });
    try {
      const res = await axiosInstance.get(`/group`); // Removed groupIds as the API doesn't require params
      set({ groups: res.data.groups }); // Corrected to 'groups' as per the API response
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch groups");
    } finally {
      set({ isGroupsLoading: false });
    }
  },

  getGroupMessages: async (groupId) => {
    console.log("getGroupMessage");
    set({ isGroupMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/group/${groupId}/messages`);
      set({ groupMessages: res.data.messages });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch messages");
    } finally {
      set({ isGroupMessagesLoading: false });
    }
  },

  sendGroupMessage: async (messageData) => {
    // ✅ Yeh sahi hai bhai
    const { groupMessages, selectedGroup } = get();
     const text=messageData?.text;
     const image=messageData?.image;
    try {
      const res = await axiosInstance.post(
        `/group/sendMessage/${selectedGroup._id}`,
        {text,image}
      );

      set({
        groupMessages: [...groupMessages, res.data.group.messages.at(-1)],
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send message");
    }
  },

  subscribeToGroupMessages: () => {
    const { selectedGroup } = get();
    console.log("subscribedGroup");
    if (!selectedGroup) return;

    const socket = useAuthStore.getState().socket;

    // Always remove previous listener before adding a new one
    socket.off("receiveGroupMessage");

    socket.emit("joinGroup", selectedGroup._id);

    socket.on("receiveGroupMessage", (newMessage) => {
      if (newMessage.groupId !== selectedGroup._id) return;

      set((state) => ({
        groupMessages: [...state.groupMessages, newMessage],
      }));
    });
  },

  unsubscribeFromGroupMessages: () => {
    console.log("subscribedGroup");

    const socket = useAuthStore.getState().socket;
    socket.off("receiveGroupMessage");
  },

  addMembers: async (groupId, newMembers) => {
    try {
      const res = await axiosInstance.post("/group/addMembers", {
        groupId,
        newMembers,
      });
      toast.success(res.data.message);
      set({
        groups: get().groups.map((group) =>
          group._id === groupId ? res.data.group : group
        ),
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add members");
    }
  },

  removeMember: async (groupId, memberId) => {
    try {
      const res = await axiosInstance.post("/group/removeMember", {
        groupId,
        memberId,
      });
      toast.success(res.data.message);
      set({
        groups: get().groups.map((group) =>
          group._id === groupId ? res.data.group : group
        ),
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to remove member");
    }
  },

  deleteGroup: async (groupId) => {
    try {
      const res = await axiosInstance.delete(`/group/${groupId}`);
      toast.success(res.data.message);
      set({ groups: get().groups.filter((group) => group._id !== groupId) });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete group");
    }
  },

  setSelectedGroup: (group) => set({ selectedGroup: group }),
}));
