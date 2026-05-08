import { useState } from "react";
import api from "@/lib/api";

export default function EnrollmentModal({ snapshot, onClose }) {
  const [form, setForm] = useState({
    name: "", department: "", student_id: "", email: "", year: "", phone: "",
  });
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await api.post("/enrollment/submit", { ...form, snapshot_b64: snapshot });
      setDone(true);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white border-2 border-black shadow-[8px_8px_0_0_#000] max-w-lg w-full">
        <div className="bg-yellow-400 border-b-2 border-black px-6 py-3 flex items-center justify-between">
          <h3 className="font-black uppercase tracking-tight">Unknown Face · Self-Enroll</h3>
          <button onClick={onClose} className="font-bold">✕</button>
        </div>

        {done ? (
          <div className="p-8 text-center">
            <p className="font-bold uppercase mb-4">Submitted!</p>
            <p className="text-sm">Your request is awaiting admin approval.</p>
            <button onClick={onClose} className="mt-6 bg-black text-white border-2 border-black px-4 py-2 font-bold uppercase shadow-[4px_4px_0_0_#000]">Close</button>
          </div>
        ) : (
          <form onSubmit={submit} className="p-6 grid grid-cols-2 gap-4">
            <img src={`data:image/jpeg;base64,${snapshot}`} alt="" className="col-span-2 w-32 h-32 object-cover border-2 border-black mx-auto" />
            {["name", "department", "student_id", "email", "year", "phone"].map((f) => (
              <input
                key={f}
                required={["name","department","student_id"].includes(f)}
                placeholder={f.replace("_", " ").toUpperCase()}
                value={form[f]}
                onChange={(e) => setForm({ ...form, [f]: e.target.value })}
                className="border-2 border-black p-2 shadow-[2px_2px_0_0_#000] text-sm"
                data-testid={`enroll-${f}`}
              />
            ))}
            <button
              disabled={sending}
              data-testid="enroll-submit"
              className="col-span-2 bg-black text-white border-2 border-black py-3 font-bold uppercase shadow-[4px_4px_0_0_#000]"
            >
              {sending ? "Sending…" : "Submit for Approval"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
