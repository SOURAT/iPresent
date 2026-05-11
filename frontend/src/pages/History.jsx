import { useEffect, useState } from "react";
import api from "../lib/api";

export default function History() {
  const today = new Date().toISOString().split("T")[0];
  const [records, setRecords] = useState([]);
  const [date, setDate] = useState(today);

  useEffect(() => {
    const load = async () => {
      const { data } = await api.get("/attendance/history", {
        params: date ? { date } : {},
      });
      setRecords(data);
    };
    load();
  }, [date]);

  const exportCSV = () => {
    const headers = ["Name", "Student ID", "Date", "Time"];
    const rows = records.map((r) => [
      r.student_name,
      r.student_id,
      r.date,
      r.time,
    ]);

    const csv = [headers, ...rows]
      .map((r) => r.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `attendance_${date || "all"}.csv`;
    a.click();
  };

  return (
    <div className="p-8" data-testid="history-page">
      <h1 className="text-4xl font-black uppercase mb-6 font-heading">
        History
      </h1>

      <div className="flex gap-4 mb-6 flex-wrap items-center">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border-2 border-black p-3 shadow-[2px_2px_0_0_#000] font-mono focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />

        <button
          onClick={() => setDate(today)}
          className="border-2 border-black px-4 py-3 font-bold uppercase shadow-[2px_2px_0_0_#000] bg-yellow-400 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
        >
          Today
        </button>

        <button
          onClick={() => setDate("")}
          className="border-2 border-black px-4 py-3 font-bold uppercase shadow-[2px_2px_0_0_#000] bg-white hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
        >
          All Records
        </button>

        <button
          onClick={exportCSV}
          className="border-2 border-black px-4 py-3 font-bold uppercase shadow-[2px_2px_0_0_#000] bg-black text-white hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
        >
          Export CSV
        </button>

        <span className="text-zinc-500 text-sm uppercase tracking-widest">
          {records.length} record{records.length !== 1 ? "s" : ""} 
          {date ? ` on ${date}` : " total"}
        </span>
      </div>

      <div className="border-2 border-black bg-white shadow-[6px_6px_0_0_#000] overflow-hidden">
        <table className="w-full">
          <thead className="bg-black text-white">
            <tr>
              <th className="text-left p-3 uppercase text-xs tracking-widest">#</th>
              <th className="text-left p-3 uppercase text-xs tracking-widest">Student</th>
              <th className="text-left p-3 uppercase text-xs tracking-widest">Student ID</th>
              <th className="text-left p-3 uppercase text-xs tracking-widest">Date</th>
              <th className="text-left p-3 uppercase text-xs tracking-widest">Time</th>
            </tr>
          </thead>

          <tbody>
            {records.map((r, index) => (
              <tr
                key={r.id}
                className="border-b-2 border-black last:border-b-0 hover:bg-yellow-50 transition-colors"
              >
                <td className="p-3 text-zinc-400 font-mono text-sm">{index + 1}</td>
                <td className="p-3 font-bold">{r.student_name.replace(/_/g, " ")}</td>
                <td className="p-3 font-mono text-sm">{r.student_id}</td>
                <td className="p-3 font-mono text-sm">{r.date}</td>
                <td className="p-3 font-mono text-sm">{r.time}</td>
              </tr>
            ))}

            {records.length === 0 && (
              <tr>
                <td colSpan="5" className="p-12 text-center">
                  <p className="text-zinc-500 font-bold uppercase text-sm">
                    No attendance records
                  </p>
                  <p className="text-zinc-400 text-xs mt-1">
                    {date ? `No records found for ${date}` : "No records found"}
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}