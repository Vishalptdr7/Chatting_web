import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Eye, EyeOff, Loader2, Lock, Mail, User } from "lucide-react";
import { Link } from "react-router-dom";
import AuthImagePattern from "../component/AuthImagePattern";
import toast from "react-hot-toast";

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
  });
  const { signup, isSigningUp } = useAuthStore();

  const validateForm = () => {
    if (!formData.fullname.trim()) return toast.error("Full name is required");
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(formData.email))
      return toast.error("Invalid email format");
    if (!formData.password) return toast.error("Password is required");
    if (formData.password.length < 6)
      return toast.error("Password must be at least 6 characters");
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) signup(formData);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-gray-100">
      {/* Left Section */}
      <div className="flex flex-col justify-center items-center p-8">
        <div className="w-full max-w-lg bg-white shadow-lg rounded-2xl p-8">
          {/* Logo and Title */}
          <div className="text-center mb-6">
            <div className="text-primary text-4xl font-bold">Join Us</div>
            <p className="text-gray-500">
              Sign up to explore new opportunities
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                className="input w-full pl-10 py-3 rounded-xl border-gray-300 focus:ring focus:ring-primary"
                placeholder="Full Name"
                value={formData.fullname}
                onChange={(e) =>
                  setFormData({ ...formData, fullname: e.target.value })
                }
              />
            </div>

            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" />
              <input
                type="email"
                className="input w-full pl-10 py-3 rounded-xl border-gray-300 focus:ring focus:ring-primary"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                className="input w-full pl-10 pr-10 py-3 rounded-xl border-gray-300 focus:ring focus:ring-primary"
                placeholder="Password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-gray-400"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-primary w-full py-3 rounded-xl text-white font-semibold hover:bg-primary-dark"
              disabled={isSigningUp}
            >
              {isSigningUp ? (
                <Loader2 className="animate-spin size-5 mx-auto" />
              ) : (
                "Sign Up"
              )}
            </button>
          </form>

          {/* Login Redirect */}
          <div className="text-center mt-4 text-gray-500">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-medium">
              Sign In
            </Link>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <AuthImagePattern
        title="Welcome to Our Platform"
        subtitle="Discover new opportunities and stay connected with your community."
      />
    </div>
  );
};

export default SignUpPage;
