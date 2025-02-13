import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import AuthImagePattern from "../component/AuthImagePattern";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare } from "lucide-react";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { login, isLoggingIn, authUser } = useAuthStore();
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    login(formData);
    if (authUser) {
      navigate("/");
    }
  };

  return (
    <div className="h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white flex items-center justify-center p-6">
      <div className="bg-gray-950 rounded-2xl shadow-lg w-full max-w-4xl h-[calc(100vh-6rem)] overflow-hidden flex border border-gray-700">
        {/* Left Side - Form */}
        <div className="flex flex-col justify-center items-center p-8 w-1/2">
          <div className="w-full space-y-6">
            {/* Logo */}
            <div className="text-center">
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center transition-all">
                  <MessageSquare className="w-6 h-6 text-primary" />
                </div>
                <h1 className="text-2xl font-bold">Welcome Back</h1>
                <p className="text-gray-400">Sign in to your account</p>
              </div>
            </div>
            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  className="input input-bordered w-full pl-10 bg-gray-800 text-white border-gray-700 focus:border-primary"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  className="input input-bordered w-full pl-10 bg-gray-800 text-white border-gray-700 focus:border-primary"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
                <button
                  type="button"
                  className="absolute right-3 top-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              <button
                type="submit"
                className="btn btn-primary w-full flex justify-center items-center gap-2"
                disabled={isLoggingIn}
              >
                {isLoggingIn ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  "Sign in"
                )}
              </button>
            </form>
            <div className="text-center text-gray-400">
              <p>
                Don&apos;t have an account?{" "}
                <Link to="/signup" className="text-primary">
                  Create account
                </Link>
              </p>
            </div>
          </div>
        </div>
        {/* Right Side - Image/Pattern */}
        <div className="hidden lg:flex w-1/2 bg-gray-800 items-center justify-center p-6">
          <AuthImagePattern
            title={"Welcome back!"}
            subtitle={
              "Sign in to continue your conversations and catch up with your messages."
            }
          />
        </div>
      </div>
    </div>
  );
};
export default LoginPage;
