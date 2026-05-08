import { useEffect, useRef, useState } from "react";
import api from "@/lib/api";
import EnrollmentModal from "@/components/EnrollmentModal";

export default function LiveAttendance() {
  const videoRef = useRef();
  const canvasRef = useRef();
  const [running, setRunning] = useState(false);
  const [faces, setFaces] = useState([]);
  const [log, setLog] = useState([]);
  const [pendingSnapshot, setPendingSnapshot] = useState(null);

  const pushLog = (msg, type = "info") =>
    setLog((l) => [{ t: new Date().toLocaleTimeString(), msg, type }, ...l].slice(0, 50));

  // Start webcam
  const startCam = async () => {
  const devices = await navigator.mediaDevices.enumerateDevices();
  const videoDevices = devices.filter(d => d.kind === "videoinput");
  
  // Try to find DroidCam
  const droidCam = videoDevices.find(d => 
    d.label.toLowerCase().includes("droidcam")
  );

  const stream = await navigator.mediaDevices.getUserMedia({ 
    video: { deviceId: droidCam ? { exact: droidCam.deviceId } : undefined }
  });
  
  videoRef.current.srcObject = stream;
  setRunning(true);
};


  // Capture frame and send to backend
  useEffect(() => {
    if (!running) return;
    const interval = setInterval(async () => {
      const v = videoRef.current;
      const c = canvasRef.current;
      if (!v || v.videoWidth === 0) return;
      c.width = v.videoWidth;
      c.height = v.videoHeight;
      c.getContext("2d").drawImage(v, 0, 0);
      const dataUri = c.toDataURL("image/jpeg", 0.7);

      try {
        const { data } = await api.post("/attendance/recognize", { image: dataUri });
        setFaces(data.faces);
        data.marked?.forEach((n) => pushLog(`✓ ${n} marked present`, "success"));

        // Enrollment mode + unknown face → open modal
        if (data.enrollment_mode && data.snapshot_b64 && !pendingSnapshot) {
          setPendingSnapshot(data.snapshot_b64);
          pushLog("Unknown face detected — enrollment prompted", "warning");
        }
      } catch (e) {
        console.error(e);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [running, pendingSnapshot]);

  return (
    <div className="p-8 grid lg:grid-cols-3 gap-6" data-testid="live-attendance-page">
      <div className="lg:col-span-2">
        <h1 className="text-4xl font-black uppercase mb-4">Live Attendance</h1>
        <div className="relative w-full aspect-video bg-black border-4 border-black shadow-[8px_8px_0_0_#000]">
          <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
          <canvas ref={canvasRef} className="hidden" />
          {faces.map((f, i) => {
            const color =
              f.status === "recognized" ? "#22C55E" :
              f.status === "unknown" ? "#EAB308" : "#3B82F6";
            return (
              <div
                key={i}
                className="absolute border-2"
                style={{
                  left: `${(f.box.x / (videoRef.current?.videoWidth || 1)) * 100}%`,
                  top: `${(f.box.y / (videoRef.current?.videoHeight || 1)) * 100}%`,
                  width: `${(f.box.w / (videoRef.current?.videoWidth || 1)) * 100}%`,
                  height: `${(f.box.h / (videoRef.current?.videoHeight || 1)) * 100}%`,
                  borderColor: color,
                  boxShadow: `0 0 15px ${color}`,
                }}
              >
                <span className="absolute -top-6 left-0 bg-black text-white text-xs font-mono px-1">
                  {f.name} {f.status === "recognized" ? `(${(100 - f.confidence).toFixed(0)}%)` : ""}
                </span>
              </div>
            );
          })}
        </div>
        {!running && (
          <button
            data-testid="start-camera-btn"
            onClick={startCam}
            className="mt-6 bg-black text-white border-2 border-black font-bold uppercase py-3 px-6 shadow-[4px_4px_0_0_#000]"
          >
            Start Camera
          </button>
        )}
      </div>

      {/* Log stream */}
      <div className="bg-[#09090B] border-2 border-black p-4 shadow-[6px_6px_0_0_#000] font-mono text-sm h-full overflow-y-auto">
        <div className="text-zinc-500 uppercase text-xs mb-3">▼ Recognition Log</div>
        {log.map((l, i) => (
          <div key={i} className={
            l.type === "success" ? "text-green-400" :
            l.type === "warning" ? "text-yellow-400" : "text-zinc-300"
          }>
            [{l.t}] {l.msg}
          </div>
        ))}
      </div>

      {pendingSnapshot && (
        <EnrollmentModal
          snapshot={pendingSnapshot}
          onClose={() => setPendingSnapshot(null)}
        />
      )}
    </div>
  );
}
