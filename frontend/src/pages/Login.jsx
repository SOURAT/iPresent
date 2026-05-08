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
      <div
        className="hidden md:block bg-cover bg-center border-r-2 border-black"
        style={{ backgroundImage: `url(${/* design_guidelines.login_hero_bg */ ""})` }}
      />
      <div className="flex items-center justify-center p-10">
        <form
          onSubmit={onSubmit}
          className="w-full max-w-md bg-white border-2 border-black p-8 shadow-[8px_8px_0_0_#000]"
          data-testid="login-form"
        >
          <h1 className="text-4xl font-black uppercase tracking-tight mb-2">Smart</h1>
          <h2 className="text-4xl font-black uppercase tracking-tight mb-8 bg-yellow-400 inline-block px-2">Attendance</h2>

          <label className="block mb-2 font-bold uppercase text-sm">Email</label>
          <input
            data-testid="login-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-white border-2 border-black p-3 mb-4 shadow-[2px_2px_0_0_#000] focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <label className="block mb-2 font-bold uppercase text-sm">Password</label>
          <input
            data-testid="login-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-white border-2 border-black p-3 mb-6 shadow-[2px_2px_0_0_#000] focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {err && <div className="mb-4 p-2 bg-red-100 border-2 border-red-500 text-sm">{err}</div>}

          <button
            data-testid="login-submit"
            className="w-full bg-black text-white border-2 border-black font-bold uppercase py-3 shadow-[4px_4px_0_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#000] transition-all"
          >
            Enter Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}
