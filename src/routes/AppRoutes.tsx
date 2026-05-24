import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Upload from "../pages/upload";
import Admin from "../pages/Admin";
import ProtectedRoute from "../components/ProtectedRoute";

export default function AppRoutes() {
  return (
    <Routes>

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      }/>

      <Route path="/upload" element={
        <ProtectedRoute>
          <Upload />
        </ProtectedRoute>
      }/>

      {/* Admin Route — ADMIN మాత్రమే */}
      <Route path="/admin" element={
        <ProtectedRoute adminOnly={true}>
          <Admin />
        </ProtectedRoute>
      }/>

    </Routes>
  );
}