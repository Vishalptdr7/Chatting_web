import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore.js";
import { Camera, Mail, User } from "lucide-react";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file.");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      try {
        await updateProfile({ profilePic: base64Image });
      } catch (error) {
        console.error("Profile update failed", error);
      }
    };
  };

  return (
    <div className="h-screen pt-20 bg-gray-900 text-white flex items-center justify-center">
      <div className="max-w-2xl w-full bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-700">
        {/* Profile Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="mt-2 text-gray-400">Your profile information</p>
        </div>

        {/* Avatar Upload */}
        <div className="flex flex-col items-center gap-4 mt-6">
          <div className="relative group">
            <img
              src={selectedImg || authUser?.profilePic || "/avatar.png"}
              alt="Profile"
              className="size-32 rounded-full object-cover border-4 border-gray-600 transition-transform group-hover:scale-105"
            />
            <label
              htmlFor="avatar-upload"
              className={`absolute bottom-2 right-2 bg-gray-700 hover:bg-gray-600 p-2 rounded-full cursor-pointer transition-all duration-200 shadow-md ${
                isUpdatingProfile ? "animate-pulse pointer-events-none" : ""
              }`}
            >
              <Camera className="w-5 h-5 text-white" />
              <input
                type="file"
                id="avatar-upload"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isUpdatingProfile}
              />
            </label>
          </div>
          <p className="text-sm text-gray-400">
            {isUpdatingProfile
              ? "Uploading..."
              : "Click the camera icon to update your photo"}
          </p>
        </div>

        {/* Profile Details */}
        <div className="space-y-6 mt-6">
          <ProfileField
            icon={User}
            label="Full Name"
            value={authUser?.fullname || "N/A"}
          />
          <ProfileField
            icon={Mail}
            label="Email Address"
            value={authUser?.email || "N/A"}
          />
        </div>

        {/* Account Information */}
        <div className="mt-6 bg-gray-700 rounded-xl p-6">
          <h2 className="text-lg font-medium text-gray-300 mb-4">
            Account Information
          </h2>
          <div className="space-y-3 text-sm text-gray-200">
            <AccountInfo
              label="Account Created On  :"
              value={
                authUser?.createdAt
                  ? new Date(authUser.createdAt).toLocaleDateString()
                  : "N/A"
              }
            />
            <AccountInfo
              label="Account Status :"
              value={<span className="text-green-400">Active</span>}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable Components for Profile Fields
const ProfileField = ({ icon: Icon, label, value }) => (
  <div className="space-y-1.5">
    <div className="text-sm text-gray-400 flex items-center gap-2">
      <Icon className="w-4 h-4 text-gray-300" />
      {label}
    </div>
    <p className="px-4 py-2.5 bg-gray-700 rounded-lg border border-gray-600 text-gray-300">
      {value}
    </p>
  </div>
);

const AccountInfo = ({ label, value }) => (
  <div className="flex items-center justify-between py-2 border-b last:border-none border-gray-600 text-gray-300">
    <span>{label}</span>
    <span>{value}</span>
  </div>
);

export default ProfilePage;
