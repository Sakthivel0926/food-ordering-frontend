import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { Loader2, Sun, Moon, Eye, EyeOff } from "lucide-react"; // ✅ Added Eye icons
import { useDarkMode } from "../context/DarkModeContext";
import foodBg from "../assets/Images/food-frame-with-asian-dish.jpg";

const Signup = () => {
  const { signup } = useAuth();
  const { darkMode, setDarkMode } = useDarkMode();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // ✅ Add state

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!formData.name || !formData.email || !formData.password) {
      setError("All fields are required!");
      setLoading(false);
      return;
    }

    try {
      await signup(formData.name, formData.email, formData.password);
    } catch (error) {
      setError(error.message || "Signup failed! Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className={`${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"} flex items-center justify-center min-h-screen p-4 transition-all relative`}
      style={{ backgroundImage: `url(${foodBg})`, backgroundSize: "cover", backgroundPosition: "center" }}
    >
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }}
        className={`${darkMode ? "bg-gray-800/80" : "bg-white/80"} p-8 rounded-lg shadow-lg w-full max-w-md backdrop-blur-md transition-all`}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl font-semibold text-center w-full">Sign Up</h2>
          <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-full transition-all">
            {darkMode ? <Sun className="text-yellow-400" /> : <Moon className="text-gray-700" />}
          </button>
        </div>

        {error && (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-500 text-center bg-red-100 p-2 rounded mb-3"
          >
            {error}
          </motion.p>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          <label className="block text-m font-medium ">Name</label>
          <input
            type="text"
            name="name"
            placeholder="Name"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-transparent"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <label className="block text-m font-medium mb-0">Email</label>
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-transparent"
            value={formData.email}
            onChange={handleChange}
            required
          />

          {/* ✅ Password with Eye/EyeOff */}
          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-transparent pr-10"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center"
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin" /> : "Sign Up"}
          </button>
        </form>

        <p className="mt-4 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-400 hover:underline">
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;
