import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/Sidebar";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import LiveAttendance from "@/pages/LiveAttendance";
import Students from "@/pages/Students";
import PendingApprovals from "@/pages/PendingApprovals";
import History from "@/pages/History";
import "@/App.css";

const Shell = ({ children }) => (
  <div className="flex min-h-screen bg-[#F4F4F0]">
    <Sidebar />
    <main className="flex-1">{children}</main>
  </div>
);

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><Shell><Dashboard /></Shell></ProtectedRoute>} />
          <Route path="/live" element={<ProtectedRoute><Shell><LiveAttendance /></Shell></ProtectedRoute>} />
          <Route path="/students" element={<ProtectedRoute><Shell><Students /></Shell></ProtectedRoute>} />
          <Route path="/pending" element={<ProtectedRoute><Shell><PendingApprovals /></Shell></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute><Shell><History /></Shell></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
