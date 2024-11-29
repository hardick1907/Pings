import { useState } from "react";
import { Eye, EyeOff, Loader2, Lock, Mail, MessageCircleHeart, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/useAuthStore.js";

export default function SignUp() {
  const navigate = useNavigate();
  const { signup, isSigningUp } = useAuthStore(); // Access signup function from the store
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
  });

  const validateForm = () => {
    if (!formData.name.trim()) return toast.error("Name is required");
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid email format");
    if (!formData.username.trim()) return toast.error("Username is required");
    if (!formData.password.trim()) return toast.error("Password is required");
    if (formData.password.length < 7) return toast.error("Password must be at least 7 characters"); return true; }; const
      handleInputChange=(e)=> {
      setFormData({ ...formData, [e.target.name]: e.target.value });
  };

    const handleSubmit = (e) => {
      e.preventDefault();

      const success = validateForm();
      if (success === true) {
        signup(formData);
        navigate("/login");
      }
    };

    return (
    <div className="min-h-screen pt-16">
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">

          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center 
                  group-hover:bg-primary/20 transition-colors">
                <MessageCircleHeart className="size-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mt-2">Create Account</h1>
              <p className="text-base-content/60">Get started with your free account</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="form-control">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="size-5 text-base-content/40" />
                </div>
                <input type="text" className="input input-bordered w-full pl-10" placeholder="John Doe" name="name"
                  value={formData.name} onChange={handleInputChange} />
              </div>
            </div>

            <div className="form-control">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="size-5 text-base-content/40" />
                </div>
                <input type="email" className="input input-bordered w-full pl-10" placeholder="Email" name="email"
                  value={formData.email} onChange={handleInputChange} />
              </div>
            </div>

            <div className="form-control">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="size-5 text-base-content/40" />
                </div>
                <input type="text" className="input input-bordered w-full pl-10" placeholder="Username" name="username"
                  value={formData.username} onChange={handleInputChange} />
              </div>
            </div>

            <div className="form-control">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="size-5 text-base-content/40" />
                </div>
                <input type={showPassword ? "text" : "password" } className="input input-bordered w-full pl-10"
                  placeholder="Password" name="password" value={formData.password} onChange={handleInputChange} />
                <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={(e)=> {
                  e.preventDefault();
                  setShowPassword(!showPassword);
                  }}
                  >
                  {showPassword ? (
                  <EyeOff className="size-5 text-base-content/40" />
                  ) : (
                  <Eye className="size-5 text-base-content/40" />
                  )}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-full" disabled={isSigningUp}>
              {isSigningUp ? (
              <>
                <Loader2 className="size-5 animate-spin" />
                Loading...
              </>
              ) : (
              "Create Account"
              )}
            </button>
          </form>

          <div className="text-center">
            <p className="text-base-content/60">
              Already have an account?{" "}
              <Link to="/login" className="link link-primary">
              Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
    );
};