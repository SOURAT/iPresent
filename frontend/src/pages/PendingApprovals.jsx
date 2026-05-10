import { useEffect, useState } from "react";
import api from "../lib/api";

export default function PendingApprovals() {
  const [list, setList] = useState([]);

  const load = async () => {
    const { data } = await api.get("/enrollment/pending");
    setList(data);
  };
  useEffect(() => { load(); }, []);

  const act = async (id, action) => {
    await api.post(`/enrollment/${action}/${id}`);
    load();
  };

  return (
    <div className="p-8" data-testid="pending-page">
      <h1 className="text-4xl font-black uppercase mb-6">Pending Approvals</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {list.length === 0 && <p>No pending requests.</p>}
        {list.map((s) => (
          <div key={s.id} className="bg-white border-2 border-black p-4 shadow-[6px_6px_0_0_#000]">
            <img src={`data:image/jpeg;base64,${s.snapshot_b64}`} alt="" className="w-full h-40 object-cover border-2 border-black mb-3" />
            <p className="font-bold uppercase">{s.name}</p>
            <p className="text-sm">{s.department} · {s.student_id}</p>
            <p className="text-xs text-zinc-600">{s.email} · Year {s.year}</p>
            <div className="flex gap-2 mt-3">
              <button onClick={() => act(s.id, "approve")} className="flex-1 bg-green-400 border-2 border-black py-2 font-bold uppercase text-sm shadow-[2px_2px_0_0_#000]">Approve</button>
              <button onClick={() => act(s.id, "reject")} className="flex-1 bg-red-400 border-2 border-black py-2 font-bold uppercase text-sm shadow-[2px_2px_0_0_#000]">Reject</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
