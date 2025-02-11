import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef } from "react";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    getMessages(selectedUser._id);
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [
    selectedUser._id,
    getMessages,
    subscribeToMessages,
    unsubscribeFromMessages,
  ]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto bg-gray-100">
      <ChatHeader />

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => {
          const isSent = message.senderId === authUser._id;
          return (
            <div
              key={message._id}
              className={`flex items-end space-x-2 ${
                isSent ? "justify-end" : "justify-start"
              }`}
              ref={messageEndRef}
            >
              {/* Avatar */}
              {!isSent && (
                <div className="size-10 rounded-full border border-gray-300 overflow-hidden">
                  <img
                    src={selectedUser.profilePic || "/avatar.png"}
                    alt="profile pic"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Chat Bubble */}
              <div
                className={`max-w-[75%] p-3 rounded-xl shadow-md ${
                  isSent
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-white text-gray-800 rounded-bl-none"
                }`}
              >
                {/* Image Attachment */}
                {message.image && (
                  <img
                    src={message.image}
                    alt="Attachment"
                    className="w-full rounded-md mb-2"
                  />
                )}

                {/* Text Message */}
                {message.text && <p className="text-sm">{message.text}</p>}

                {/* Timestamp */}
                <time
                  className={`block text-xs mt-1 ${
                    isSent ? "text-gray-200" : "text-gray-500"
                  }`}
                >
                  {formatMessageTime(message.createdAt)}
                </time>
              </div>

              {/* Sender Avatar (if sent by the user) */}
              {isSent && (
                <div className="size-10 rounded-full border border-gray-300 overflow-hidden">
                  <img
                    src={authUser.profilePic || "/avatar.png"}
                    alt="profile pic"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;
