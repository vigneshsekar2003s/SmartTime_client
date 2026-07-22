import { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../services/authService";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await getProfile();
      setName(data.name);
      setEmail(data.email);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdate = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      await updateProfile({
        name,
        email,
      });

      alert("Profile Updated Successfully");
    } catch (error) {
      alert("Failed to Update Profile");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">

      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">

        <h1 className="text-3xl font-bold mb-6 text-center">
          My Profile
        </h1>

        <form onSubmit={handleUpdate}>

          <div className="mb-4">
            <label className="block font-semibold mb-2">
              Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              className="w-full border rounded-lg p-3"
            />
          </div>

          <div className="mb-6">
            <label className="block font-semibold mb-2">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              className="w-full border rounded-lg p-3"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg"
          >
            Update Profile
          </button>

          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="w-full mt-3 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg"
          >
            Back to Dashboard
          </button>

        </form>

      </div>

    </div>
  );
};

export default Profile;