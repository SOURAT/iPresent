import { useEffect, useState } from "react";
import api from "../lib/api";

export default function Students() {
  const [list, setList] = useState([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    (async () => {
      const { data } = await api.get("/students");
      setList(data);
    })();
  }, []);

  const filtered = list.filter(
    (s) =>
      s.name.toLowerCase().includes(q.toLowerCase()) ||
      s.department?.toLowerCase().includes(q.toLowerCase()) ||
      s.student_id?.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="p-8" data-testid="students-page">
      <h1 className="text-4xl font-black uppercase mb-6 font-heading">Students</h1>

      <input
        placeholder="SEARCH NAME / DEPT / ID"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        className="mb-6 w-full max-w-md border-2 border-black p-3 shadow-[2px_2px_0_0_#000] font-bold uppercase"
      />

      <div className="border-2 border-black bg-white shadow-[6px_6px_0_0_#000] overflow-hidden">
        <table className="w-full">
          <thead className="bg-black text-white">
            <tr>
              <th className="text-left p-3 uppercase text-xs">Name</th>
              <th className="text-left p-3 uppercase text-xs">Student ID</th>
              <th className="text-left p-3 uppercase text-xs">Email</th>
              <th className="text-left p-3 uppercase text-xs">Year</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((s) => (
              <tr key={s.id} className="border-b-2 border-black last:border-b-0 hover:bg-gray-50">
                <td className="p-3 font-bold">{s.name.replace(/_/g, " ")}</td>
                <td className="p-3 font-mono">{s.student_id}</td>
                <td className="p-3 text-sm">{s.email || "—"}</td>
                <td className="p-3">{s.year || "—"}</td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan="5" className="p-8 text-center text-zinc-500">
                  No students found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
