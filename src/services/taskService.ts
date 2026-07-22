import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/tasks",
});

const getToken = () => {
  return localStorage.getItem("token");
};

// Add token automatically to every request
API.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Get all tasks
export const getTasks = async () => {
  const res = await API.get("/");
  return res.data;
};

// Create task
export const createTask = async (task: any) => {
  const res = await API.post("/", task);
  return res.data;
};

// Delete task
export const deleteTask = async (id: string) => {
  const res = await API.delete(`/${id}`);
  return res.data;
};

// Update task
export const updateTask = async (id: string, task: any) => {
  const res = await API.put(`/${id}`, task);
  return res.data;
};

export const uploadAttachment = async (file: File) => {
  const token = localStorage.getItem("token");

  const formData = new FormData();
  formData.append("attachment", file);

  const response = await API.post(
    "/upload",
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};