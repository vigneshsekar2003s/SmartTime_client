import { useState } from "react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    alert("Reset link will be sent to your email.");
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">

      <div className="bg-white shadow-xl rounded-xl p-10 w-[400px]">

        <h2 className="text-3xl font-bold mb-8 text-center">
          Forgot Password
        </h2>

        <form onSubmit={handleSubmit}>

          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            required
            className="w-full border rounded-lg p-3 mb-6"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg"
          >
            Send Reset Link
          </button>

        </form>

      </div>

    </div>
  );
};

export default ForgotPassword;