import { useEffect, useState } from "react";
import API from "../services/api";

export default function Certificates() {
  const [certs, setCerts] = useState<any[]>([]);

  useEffect(() => {
    API.get("/certificates/issued").then(res => setCerts(res.data));
  }, []);

  return (
    <div style={{ padding: 40 }}>
      <h2>Issued Certificates</h2>

      {certs.map(c => (
        <div key={c._id}>
          <b>{c.studentName}</b> — {c.course}
        </div>
      ))}
    </div>
  );
}
