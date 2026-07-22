import axios from "axios";

const API = axios.create({
  baseURL: "https://smarttime-backend-5.onrender.com/api/auth",
});

// Register User
export const registerUser = async (userData: {
  name: string;
  email: string;
  password: string;
}) => {
  const response = await API.post("/register", userData);
  return response.data;
};

// Login User
export const loginUser = async (userData: {
  email: string;
  password: string;
}) => {
  const response = await API.post("/login", userData);
  return response.data;
};

// Get Profile
export const getProfile = async () => {
  const token = localStorage.getItem("token");

  const response = await API.get("/profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// Update Profile
export const updateProfile = async (userData: {
  name: string;
  email: string;
}) => {
  const token = localStorage.getItem("token");

  const response = await API.put(
    "/profile",
    userData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};