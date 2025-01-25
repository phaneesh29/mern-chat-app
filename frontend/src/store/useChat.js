import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuth";

export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,
    isMessageSending: false,
    isMessageDeleting: false,
    getUsers: async () => {
        set({ isUsersLoading: true });
        try {
            const res = await axiosInstance.get("/messages/users");
            set({ users: res.data });
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isUsersLoading: false });
        }
    },
    getMessages: async (userId) => {
        set({ isMessagesLoading: true });
        try {
            const res = await axiosInstance.get(`/messages/${userId}`);
            set({ messages: res.data });
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isMessagesLoading: false });
        }
    },
    sendMessage: async (messageData) => {
        set({ isMessageSending: true });
        const { selectedUser, messages } = get();
        try {
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
            set({ messages: [...messages, res.data] });
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isMessageSending: false })
        }
    },
    deleteMessage: async (messageId) => {
        set({ isMessageDeleting: true });
        try {
            const { messages } = get()
            const res = await axiosInstance.delete(`/messages/delete/${messageId}`);
            const deletedMessage = res.data.deletedMessage
            set({ messages: messages.filter(message => message._id !== deletedMessage._id) })

        } catch (error) {
            console.log(error)
            toast.error(error.response.data.message);
        } finally {
            set({ isMessageDeleting: false })
        }
    },
    subscribeToMessages: () => {
        const { selectedUser } = get();
        if (!selectedUser) return;
        const socket = useAuthStore.getState().socket;
        socket.on("newMessage", (newMessage) => {
            const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
            if (!isMessageSentFromSelectedUser) return;
            set({
                messages: [...get().messages, newMessage],
            });
        })
        socket.on("deletedMessage", (deletedMessage) => {
            const isMessageSentFromSelectedUser = deletedMessage.senderId === selectedUser._id;
            if (!isMessageSentFromSelectedUser) return;
            set({ messages: get().messages.filter(message => message._id !== deletedMessage._id) })
        })
    },
    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage");
        socket.off("deletedMessage");
    },
    setSelectedUser: (selectedUser) => set({ selectedUser }),
}))