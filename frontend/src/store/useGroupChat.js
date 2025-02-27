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

  getGroup: async (groupId) => {
    set({ isGroupsLoading: true });
    try {
      const res = await axiosInstance.get(`/group/${groupId}`);
      set({ groups: res.data.group });
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch group");
    } finally {
      set({ isGroupsLoading: false });
    }
  },

  getGroupMessages: async (groupId) => {
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
    const { groupMessages } = get();
    try {
      const res = await axiosInstance.post("/group/sendMessage", messageData);
      set({
        groupMessages: [...groupMessages, res.data.group.messages.at(-1)],
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send message");
    }
  },

  subscribeToGroupMessages: () => {
    const { selectedGroup } = get();
    if (!selectedGroup) return;

    const socket = useAuthStore.getState().socket;
    socket.emit("joinGroup", selectedGroup._id);

    socket.on("receiveGroupMessage", (newMessage) => {
      if (newMessage.groupId !== selectedGroup._id) return;
      set({ groupMessages: [...get().groupMessages, newMessage] });
    });
  },

  unsubscribeFromGroupMessages: () => {
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

  setSelectedGroup: (selectedGroup) => set({ selectedGroup }),
}));
