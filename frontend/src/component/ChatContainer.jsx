import { useChatStore } from "../store/useChatStore.js";
import { useEffect, useRef } from "react";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore.js";
import { formatMessageTime } from "../lib/utils";
import { useGroupChatStore } from "../store/useGroupChat.js";

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

  const {
    getGroupMessages,
    groupMessages,
    selectedGroup,
    isGroupMessagesLoading,
    subscribeToGroupMessages,
    unsubscribeFromGroupMessages,
  } = useGroupChatStore();
  // console.log("Sharukh",selectedGroup);
  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id);
      subscribeToMessages();
      
      return () => unsubscribeFromMessages();
    }

    else if (selectedGroup) {
      
      getGroupMessages(selectedGroup._id);
      subscribeToGroupMessages();
      console.log("hello");
      return () => unsubscribeFromGroupMessages();
    }
  }, [
    selectedUser,
    selectedGroup,
    getMessages,
    getGroupMessages,
    subscribeToMessages,
    unsubscribeFromMessages,
    subscribeToGroupMessages,
    unsubscribeFromGroupMessages,
  ]);
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, groupMessages]);

  if (isMessagesLoading || isGroupMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }
 
  




if (selectedUser) {
  const renderedMessages = messages;
  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {renderedMessages.map((message) => (
          <div
            key={message._id}
            className={`chat ${
              message.senderId === authUser._id ? "chat-end" : "chat-start"
            }`}
            ref={messageEndRef}
          >
            <div className=" chat-image avatar">
              <div className="size-10 rounded-full border">
                {(
                  message.senderId === authUser._id
                    ? authUser.profilePic
                    : selectedUser?.profilePic ||
                      selectedGroup?.members?.find(
                        (m) => m._id === message.senderId
                      )?.profilePic ||
                      message.senderProfilePic
                ) ? (
                  <img
                    src={
                      message.senderId === authUser._id
                        ? authUser.profilePic
                        : selectedUser?.profilePic ||
                          selectedGroup?.members?.find(
                            (m) => m._id === message.senderId
                          )?.profilePic ||
                          message.senderProfilePic
                    }
                    alt="profile pic"
                    className="size-10 object-cover rounded-full"
                  />
                ) : (
                  <div className="size-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-lg">
                    {(message.senderId === authUser._id
                      ? authUser.fullname
                      : selectedUser?.fullname ||
                        selectedGroup?.members?.find(
                          (m) => m._id === message.senderId
                        )?.fullname ||
                        message.senderFullname
                    )
                      ?.charAt(0)
                      .toUpperCase()}
                  </div>
                )}
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>
            <div className="chat-bubble flex flex-col">
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
      </div>

      <MessageInput />
    </div>
  );
} else {
  const renderedMessages = groupMessages;
  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {renderedMessages.map((message) => (
          <div
            key={message._id}
            className={`chat ${
              (message.sender?._id || message.sender) === authUser._id
                ? "chat-end"
                : "chat-start"
            }`}
            ref={messageEndRef}
          >
            <div className="chat-image avatar">
              <div className="size-10 rounded-full border">
                {(
                  (message.sender?._id || message.sender) === authUser._id
                    ? authUser.profilePic
                    : message.sender?.profilePic
                ) ? (
                  <img
                    src={
                      (message.sender?._id || message.sender) === authUser._id
                        ? authUser.profilePic
                        : message.sender?.profilePic
                    }
                    alt="profile pic"
                    className="size-10 object-cover rounded-full"
                  />
                ) : (
                  <div className="size-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-lg">
                    {message.sender?.fullname?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            </div>
            <div className="chat-header mb-1">
              {typeof message.sender === "object" ? (
                <span className="text-sm font-bold">
                  {message.sender.fullname}
                </span>
              ) : null}
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>

            <div className="chat-bubble flex flex-col">
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.message && <p>{message.message}</p>}
            </div>
          </div>
        ))}
      </div>

      <MessageInput />
    </div>
  );
}









  
};
export default ChatContainer;
