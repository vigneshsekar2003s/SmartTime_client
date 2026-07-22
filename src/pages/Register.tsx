import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaEye, FaEyeSlash, FaUser } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { registerUser } from "../services/authService";

const Register = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      const data = await registerUser({
        name,
        email,
        password,
      });

      localStorage.setItem("token", data.token);

      alert("Registration Successful!");

      navigate("/dashboard");
    } catch (error: any) {
      alert(error.response?.data?.message || "Registration Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">

      {/* Left Section */}

      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-purple-600 to-blue-700 text-white items-center justify-center">

        <div className="max-w-md px-10">

          <h1 className="text-5xl font-bold mb-6">
            Join Smart Time Scheduler
          </h1>

          <p className="text-lg leading-8">
            Create your account and start managing your tasks,
            calendar, and productivity.
          </p>

        </div>

      </div>

      {/* Right Section */}

      <div className="flex-1 flex justify-center items-center bg-gray-100">

        <div className="bg-white shadow-xl rounded-2xl p-10 w-[420px]">

          <h2 className="text-3xl font-bold mb-2">
            Create Account
          </h2>

          <p className="text-gray-500 mb-8">
            Register to continue
          </p>

          <form onSubmit={handleRegister}>

            {/* Name */}

            <div className="mb-5">

              <label className="block mb-2 font-medium">
                Full Name
              </label>

              <div className="relative">

                <FaUser
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />

                <input
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border rounded-lg py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />

              </div>

            </div>

            {/* Email */}

            <div className="mb-5">

              <label className="block mb-2 font-medium">
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
                  className="w-full border rounded-lg py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />

              </div>

            </div>

            {/* Password */}

            <div className="mb-6">

              <label className="block mb-2 font-medium">
                Password
              </label>

              <div className="relative">

                <RiLockPasswordFill
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border rounded-lg py-3 pl-10 pr-12 outline-none focus:ring-2 focus:ring-blue-500"
                  required
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

            {/* Register Button */}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold transition"
            >
              {loading ? "Creating Account..." : "Register"}
            </button>

          </form>

          <p className="text-center mt-6">

            Already have an account?

            <Link
              to="/login"
              className="text-blue-600 font-semibold ml-2 hover:underline"
            >
              Login
            </Link>

          </p>

        </div>

      </div>

    </div>
  );
};

export default Register;