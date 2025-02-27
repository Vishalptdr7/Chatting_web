import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users, UserPlus } from "lucide-react";
import toast from "react-hot-toast";
import { socket } from "../lib/socket.js";
import { useGroupChatStore } from "../store/useGroupChat.js";

const Sidebar = () => {
  const {
    getGroup,
    createGroup, // ✅ Correct store
  } = useGroupChatStore();
  const { groupIds,setGroupId}=useState(null);
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } =
    useChatStore();

  const { onlineUsers, authUser } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [selectedGroupUsers, setSelectedGroupUsers] = useState([]);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [groupName, setGroupName] = useState("");

  useEffect(() => {
    getUsers();
    
  }, [getUsers]);

  const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users;

  const handleGroupSelection = (userId) => {
    if (selectedGroupUsers.includes(userId)) {
      setSelectedGroupUsers(selectedGroupUsers.filter((id) => id !== userId));
    } else {
      setSelectedGroupUsers([...selectedGroupUsers, userId]);
    }
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      toast.error("Please enter a group name");
      return;
    }
    if (selectedGroupUsers.length < 2) {
      toast.error("Select at least 2 users to create a group");
      return;
    }
    try {
      const { groupId } = await createGroup({
        members: selectedGroupUsers,
        groupName,
      });
      setGroupId(groupId);
      if (!groupId) {
        throw new Error("Group ID not returned");
      }

      toast.success("Group Created Successfully");

      socket.emit("createGroup", {
        groupId,
        members: [...selectedGroupUsers, authUser._id],
        groupName,
        admin: authUser._id,
      });

      setSelectedGroupUsers([]);
      setGroupName("");
      setShowCreateGroup(false);
    } catch (error) {
      console.error("Failed to create group:", error);
      toast.error("Failed to create group");
    }
  };


  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Users className="size-6" />
            <span className="font-medium hidden lg:block">Contacts</span>
          </div>

          <button
            onClick={() => setShowCreateGroup(!showCreateGroup)}
            className="btn btn-sm btn-circle"
            title="Create Group"
          >
            <UserPlus size={20} />
          </button>
        </div>

        <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Show online only</span>
          </label>
          <span className="text-xs text-zinc-500">
            ({onlineUsers.length - 1} online)
          </span>
        </div>
      </div>

      {showCreateGroup && (
        <div className="p-3 bg-base-200">
          <input
            type="text"
            placeholder="Group Name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="input input-sm w-full mb-3"
          />
          <div className="mb-3 text-center font-medium">Select Users</div>
          {filteredUsers.map((user) => (
            <label
              key={user._id}
              className="flex items-center gap-2 cursor-pointer mb-2"
            >
              <input
                type="checkbox"
                onChange={() => handleGroupSelection(user._id)}
                checked={selectedGroupUsers.includes(user._id)}
                className="checkbox checkbox-sm"
              />
              <span>{user.fullname}</span>
            </label>
          ))}
          <button
            onClick={handleCreateGroup}
            className="btn btn-sm btn-primary w-full mt-3"
          >
            Create Group
          </button>
        </div>
      )}

      <div className="overflow-y-auto w-full py-3">
        {filteredUsers.map((user) => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors ${
              selectedUser?._id === user._id
                ? "bg-base-300 ring-1 ring-base-300"
                : ""
            }`}
          >
            <div className="relative mx-auto lg:mx-0">
              {user.profilePic ? (
                <img
                  src={user.profilePic}
                  alt={user.name}
                  className="size-12 object-cover rounded-full"
                />
              ) : (
                <div className="size-12 rounded-full bg-gray-400 flex items-center justify-center text-white font-bold text-lg">
                  {user.fullname.charAt(0).toUpperCase()}
                </div>
              )}

              {onlineUsers.includes(user._id) && (
                <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900" />
              )}
            </div>

            <div className="hidden lg:block text-left min-w-0">
              <div className="font-medium truncate">{user.fullname}</div>
              <div className="text-sm text-zinc-400">
                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
              </div>
            </div>
          </button>
        ))}

        {filteredUsers.length === 0 && (
          <div className="text-center text-zinc-500 py-4">No online users</div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
