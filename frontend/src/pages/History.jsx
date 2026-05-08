import { useEffect, useState } from "react";
import api from "../lib/api";

export default function History() {
  const [records, setRecords] = useState([]);
  const [date, setDate] = useState("");

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

      <div className="flex gap-4 mb-6 flex-wrap">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border-2 border-black p-3 shadow-[2px_2px_0_0_#000] font-mono"
        />

        <button
          onClick={() => {
            setDate("");
            setRecords([]);
          }}
          className="border-2 border-black px-4 py-3 font-bold uppercase shadow-[2px_2px_0_0_#000] bg-white"
        >
          Clear
        </button>

        <button
          onClick={exportCSV}
          className="border-2 border-black px-4 py-3 font-bold uppercase shadow-[2px_2px_0_0_#000] bg-yellow-400"
        >
          Export CSV
        </button>
      </div>

      <div className="border-2 border-black bg-white shadow-[6px_6px_0_0_#000] overflow-hidden">
        <table className="w-full">
          <thead className="bg-black text-white">
            <tr>
              <th className="text-left p-3 uppercase text-xs">Student</th>
              <th className="text-left p-3 uppercase text-xs">Date</th>
              <th className="text-left p-3 uppercase text-xs">Time</th>
            </tr>
          </thead>

          <tbody>
            {records.map((r) => (
              <tr
                key={r.id}
                className="border-b-2 border-black last:border-b-0 hover:bg-gray-50"
              >
                <td className="p-3 font-bold">
                  {r.student_name.replace(/_/g, " ")}
                </td>
                <td className="p-3 font-mono">{r.date}</td>
                <td className="p-3 font-mono">{r.time}</td>
              </tr>
            ))}

            {records.length === 0 && (
              <tr>
                <td
                  colSpan="3"
                  className="p-8 text-center text-zinc-500"
                >
                  No attendance records.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}