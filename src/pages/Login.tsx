import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { loginUser } from "../services/authService";

const Login = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    try {
      const data = await loginUser({
        email,
        password,
      });

      localStorage.setItem("token", data.token);

      localStorage.setItem(
      "user",
      JSON.stringify({
        name: data.name,
        email: data.email,
      })
    );

      alert("Login Successful!");

      navigate("/dashboard");
    } catch (error: any) {
      alert(
        error.response?.data?.message || "Invalid Email or Password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">

      {/* Left Section */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-blue-600 to-purple-700 text-white items-center justify-center">

        <div className="max-w-md px-8">

          <h1 className="text-5xl font-bold mb-6">
            Smart Time Scheduler
          </h1>

          <p className="text-lg leading-8">
            Plan your day, complete your goals,
            track productivity and build better habits.
          </p>

        </div>

      </div>

      {/* Right Section */}

      <div className="flex-1 flex justify-center items-center bg-gray-100">

        <div className="bg-white shadow-xl rounded-2xl p-10 w-[420px]">

          <h2 className="text-3xl font-bold mb-2 text-gray-800">
            Welcome Back 👋
          </h2>

          <p className="text-gray-500 mb-8">
            Sign in to continue
          </p>

          <form onSubmit={handleLogin}>

            {/* Email */}

            <div className="mb-5">

              <label className="block mb-2 font-medium text-gray-700">
                Email
              </label>

              <div className="relative">

                <MdEmail
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />

                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full border rounded-lg py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-blue-500"
                />

              </div>

            </div>

            {/* Password */}

            <div className="mb-5">

              <label className="block mb-2 font-medium text-gray-700">
                Password
              </label>

              <div className="relative">

                <RiLockPasswordFill
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full border rounded-lg py-3 pl-10 pr-10 outline-none focus:ring-2 focus:ring-blue-500"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>

              </div>

            </div>

            {/* Remember Me */}

            <div className="flex justify-between items-center mb-6">

              <label className="flex items-center gap-2">

                <input type="checkbox" />

                <span className="text-sm text-gray-700">
                  Remember Me
                </span>

              </label>

              <Link
                to="/forgot-password"
                className="text-blue-600 text-sm hover:underline"
              >
                Forgot Password?
              </Link>

            </div>

            {/* Login Button */}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

          </form>

          <p className="text-center mt-6 text-gray-700">

            Don't have an account?

            <Link
              to="/register"
              className="text-blue-600 font-semibold ml-2 hover:underline"
            >
              Register
            </Link>

          </p>

        </div>

      </div>

    </div>
  );
};

export default Login;