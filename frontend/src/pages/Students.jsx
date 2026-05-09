import { useEffect, useState } from "react";
import api from "../lib/api";
import { Search, X } from "lucide-react";

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

      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-black uppercase font-heading">Students</h1>
          <p className="text-zinc-500 text-sm mt-1 uppercase tracking-widest">
            {filtered.length} student{filtered.length !== 1 ? "s" : ""} found
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full max-w-sm">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
            size={16}
          />
          <input
            placeholder="Search name / ID..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-full border-2 border-black p-3 pl-11 pr-10 bg-white shadow-[4px_4px_0_0_#000] focus:outline-none focus:shadow-[4px_4px_0_0_#EAB308] transition-all text-sm font-mono"
          />
          {q && (
            <button
              onClick={() => setQ("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="border-2 border-black bg-white shadow-[6px_6px_0_0_#000] overflow-hidden">
        <table className="w-full">
          <thead className="bg-black text-white">
            <tr>
              <th className="text-left p-3 uppercase text-xs tracking-widest">#</th>
              <th className="text-left p-3 uppercase text-xs tracking-widest">Name</th>
              <th className="text-left p-3 uppercase text-xs tracking-widest">Student ID</th>
              <th className="text-left p-3 uppercase text-xs tracking-widest">Email</th>
              <th className="text-left p-3 uppercase text-xs tracking-widest">Year</th>
              <th className="text-left p-3 uppercase text-xs tracking-widest">Status</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((s, index) => (
              <tr
                key={s.id}
                className="border-b-2 border-black last:border-b-0 hover:bg-yellow-50 transition-colors"
              >
                <td className="p-3 text-zinc-400 font-mono text-sm">{index + 1}</td>
                <td className="p-3 font-bold">{s.name.replace(/_/g, " ")}</td>
                <td className="p-3 font-mono text-sm">{s.student_id}</td>
                <td className="p-3 text-sm text-zinc-600">{s.email || "—"}</td>
                <td className="p-3 text-sm">{s.year || "—"}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 text-xs font-bold uppercase border-2 ${
                    s.status === "active"
                      ? "bg-green-100 border-green-500 text-green-700"
                      : "bg-red-100 border-red-500 text-red-700"
                  }`}>
                    {s.status || "active"}
                  </span>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan="6" className="p-12 text-center">
                  <Search className="mx-auto mb-3 text-zinc-300" size={32} />
                  <p className="text-zinc-500 font-bold uppercase text-sm">
                    No students found
                  </p>
                  <p className="text-zinc-400 text-xs mt-1">
                    Try a different search term
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
