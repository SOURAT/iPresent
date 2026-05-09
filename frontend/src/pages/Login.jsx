import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("admin@demo.com");
  const [password, setPassword] = useState("Admin@123");
  const [err, setErr] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      await login(email, password);
      nav("/");
    } catch (e) {
      setErr(e.response?.data?.detail || "Login failed");
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-[#F4F4F0]">
      
      {/* Left Panel */}
      <div className="hidden md:flex flex-col justify-between bg-black text-white p-12 border-r-4 border-black">
        <div>
          <h1 className="text-5xl font-black uppercase tracking-tight">
            i<span className="text-yellow-400">Present</span>
          </h1>
          <p className="mt-2 text-zinc-400 text-sm uppercase tracking-widest">
            Smart Attendance System
          </p>
        </div>

        <div className="space-y-6">
          <div className="border-l-4 border-yellow-400 pl-4">
            <p className="text-2xl font-black uppercase">Face Recognition</p>
            <p className="text-zinc-400 text-sm mt-1">Automatic attendance marking using AI</p>
          </div>
          <div className="border-l-4 border-yellow-400 pl-4">
            <p className="text-2xl font-black uppercase">Real Time</p>
            <p className="text-zinc-400 text-sm mt-1">Live camera feed with instant recognition</p>
          </div>
          <div className="border-l-4 border-yellow-400 pl-4">
            <p className="text-2xl font-black uppercase">Analytics</p>
            <p className="text-zinc-400 text-sm mt-1">Track and export attendance history</p>
          </div>
        </div>

        <p className="text-zinc-600 text-xs uppercase tracking-widest">
          © 2026 iPresent. All rights reserved.
        </p>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex items-center justify-center p-10 bg-[#F4F4F0]">
        <form
          onSubmit={onSubmit}
          className="w-full max-w-md bg-white border-2 border-black p-8 shadow-[8px_8px_0_0_#000]"
          data-testid="login-form"
        >
          {/* Mobile Logo */}
          <div className="md:hidden mb-6">
            <h1 className="text-4xl font-black uppercase">
              i<span className="bg-yellow-400 px-1">Present</span>
            </h1>
            <p className="text-xs text-zinc-500 uppercase tracking-widest mt-1">
              Smart Attendance System
            </p>
          </div>

          <h2 className="text-2xl font-black uppercase mb-1">Welcome Back</h2>
          <p className="text-zinc-500 text-sm mb-8">Sign in to access your dashboard</p>

          <label className="block mb-2 font-bold uppercase text-sm">Email</label>
          <input
            data-testid="login-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-white border-2 border-black p-3 mb-4 shadow-[2px_2px_0_0_#000] focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />

          <label className="block mb-2 font-bold uppercase text-sm">Password</label>
          <input
            data-testid="login-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-white border-2 border-black p-3 mb-6 shadow-[2px_2px_0_0_#000] focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />

          {err && (
            <div className="mb-4 p-2 bg-red-100 border-2 border-red-500 text-sm">
              {err}
            </div>
          )}

          <button
            data-testid="login-submit"
            className="w-full bg-black text-white border-2 border-black font-bold uppercase py-3 shadow-[4px_4px_0_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#000] transition-all"
          >
            Enter Dashboard
          </button>

          <p className="text-center text-xs text-zinc-400 mt-6 uppercase tracking-widest">
            Admin Access Only
          </p>
        </form>
      </div>
    </div>
  );
}
