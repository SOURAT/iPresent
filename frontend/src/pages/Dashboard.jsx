import { useEffect, useState } from "react";
import api from "../lib/api";

export default function Dashboard() {
  const [stats, setStats] = useState({});
  const load = async () => { const { data } = await api.get("/attendance/stats"); setStats(data); };
  useEffect(() => { load(); }, []);

  const toggleEnroll = async () => {
    await api.post("/enrollment/mode", { enabled: !stats.enrollment_mode });
    load();
  };

  const Card = ({ label, value, color = "white" }) => (
    <div className={`bg-${color} border-2 border-black p-6 shadow-[4px_4px_0_0_#000]`}>
      <div className="text-xs uppercase font-bold tracking-wider">{label}</div>
      <div className="text-5xl font-black mt-2">{value ?? "—"}</div>
    </div>
  );

  return (
    <div className="p-8" data-testid="dashboard">
      <h1 className="text-5xl font-black uppercase mb-8">Dashboard</h1>
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card label="Total Students" value={stats.total_students} />
        <Card label="Present Today" value={stats.present_today} />
        <Card label="Pending Approvals" value={stats.pending_approvals} color="yellow-200" />
        <div className="bg-white border-2 border-black p-6 shadow-[4px_4px_0_0_#000]">
          <div className="text-xs uppercase font-bold">Enrollment Mode</div>
          <button
            onClick={toggleEnroll}
            data-testid="enrollment-mode-toggle"
            className={`mt-3 w-full py-3 border-2 border-black font-bold uppercase shadow-[2px_2px_0_0_#000] ${stats.enrollment_mode ? "bg-green-400" : "bg-zinc-200"}`}
          >
            {stats.enrollment_mode ? "ON" : "OFF"}
          </button>
        </div>
      </div>
    </div>
  );
}
