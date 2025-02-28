import { X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { useGroupChatStore } from "../store/useGroupChat";
import { useState } from "react";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const { setSelectedGroup, selectedGroup } = useGroupChatStore();
  const [showGroupMembers, setShowGroupMembers] = useState(false);

  const handleHeaderClick = () => {
    if (selectedGroup) {
      setShowGroupMembers(!showGroupMembers);
    }
  };

  return (
    <div className="p-2.5 border-b border-base-300">
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={handleHeaderClick}
      >
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              {selectedUser?.profilePic ? (
                <img
                  src={selectedUser.profilePic}
                  alt={selectedUser.fullname}
                  className="size-12 object-cover rounded-full"
                />
              ) : selectedGroup ? (
                <div className="size-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-lg">
                  {selectedGroup.groupName.charAt(0).toUpperCase()}
                </div>
              ) : (
                <div className="size-12 rounded-full bg-pink-500 flex items-center justify-center text-white font-bold text-lg">
                  {selectedUser?.fullname.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          </div>

          {/* User info */}
          <div>
            <h3 className="font-medium">
              {selectedGroup ? selectedGroup.groupName : selectedUser?.fullname}
            </h3>
            <p className="text-sm text-base-content/70">
              {selectedUser && onlineUsers.includes(selectedUser._id)
                ? "Online"
                : selectedGroup
                ? "Group Chat"
                : "Offline"}
            </p>
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={() => {
            setSelectedUser(null);
            setSelectedGroup(null);
          }}
        >
          <X />
        </button>
      </div>

      {showGroupMembers && selectedGroup && (
        <div className="mt-3 p-2 bg-base-200 rounded-lg shadow">
          <h4 className="font-medium mb-2">Group Members</h4>
          {selectedGroup.members.map((member) => (
            <div key={member._id} className="text-sm text-base-content/80">
              {member.fullname}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default ChatHeader;
