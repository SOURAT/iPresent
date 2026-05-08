import { NavLink } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { LayoutDashboard, Camera, Users, Clock, FileText, LogOut } from "lucide-react";

const items = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/live", label: "Live Camera", icon: Camera },
  { to: "/students", label: "Students", icon: Users },
  { to: "/pending", label: "Pending", icon: Clock },
  { to: "/history", label: "History", icon: FileText },
];

export default function Sidebar() {
  const { logout, user } = useAuth();
  return (
    <aside className="w-72 bg-white border-r-2 border-black p-6 flex flex-col">
      <div className="mb-10">
        <div className="text-2xl font-black uppercase tracking-tight">SMART</div>
        <div className="text-2xl font-black uppercase bg-yellow-400 inline-block px-1">ATTEND</div>
      </div>
      <nav className="flex-1 space-y-2">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-3 border-2 border-black font-bold uppercase text-sm transition-all ${
                isActive ? "bg-black text-white shadow-[4px_4px_0_0_#000]" : "bg-white hover:translate-x-[2px] hover:translate-y-[2px]"
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
      <button
        onClick={logout}
        className="flex items-center gap-2 mt-6 px-3 py-2 border-2 border-black font-bold uppercase text-sm bg-red-400 shadow-[2px_2px_0_0_#000]"
      >
        <LogOut size={16} /> Logout
      </button>
    </aside>
  );
}
