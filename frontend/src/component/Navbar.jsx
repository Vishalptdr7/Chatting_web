import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut, MessageSquare, Settings, User } from "lucide-react";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();

  return (
    <header className="bg-white border-b border-gray-200 fixed w-full top-0 z-50 shadow-md backdrop-blur-lg">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Left Side - Brand Logo */}
        <Link
          to="/"
          className="flex items-center gap-2.5 hover:opacity-80 transition"
        >
          <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-blue-600" />
          </div>
          <h1 className="text-lg font-bold text-gray-900">Chatty</h1>
        </Link>

        {/* Right Side - Navigation */}
        <div className="flex items-center gap-3">
          <Link
            to="/settings"
            className="btn btn-sm gap-2 hover:bg-gray-100 transition"
          >
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">Settings</span>
          </Link>

          {authUser && (
            <>
              <Link
                to="/profile"
                className="btn btn-sm gap-2 hover:bg-gray-100 transition"
              >
                <User className="size-5" />
                <span className="hidden sm:inline">Profile</span>
              </Link>

              <button
                className="btn btn-sm gap-2 text-red-500 hover:bg-red-100 transition"
                onClick={logout}
              >
                <LogOut className="size-5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
