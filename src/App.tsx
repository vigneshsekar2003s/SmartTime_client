import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./pages/Profile";
import ForgotPassword from "./pages/ForgotPassword";
import AdminDashboard from "./pages/AdminDashboard";
import Kanban from "./pages/Kanban";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" 
      element={
      <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } 
      />
      <Route path="/profile" element={<Profile />} />
      <Route path="/forgot-password" element={<ForgotPassword />}/>
      <Route path="/admin" element={<AdminDashboard />}/>
      <Route path="/kanban" element={<Kanban />} />

    </Routes>
  );
}

export default App;