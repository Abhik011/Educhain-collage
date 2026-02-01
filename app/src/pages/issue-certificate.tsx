import { useState } from "react";
import API from "../services/api";

export default function IssueCertificate() {
  const [studentEmail, setStudentEmail] = useState("");
  const [course, setCourse] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    try {
      await API.post("/certificates/issue", {
        studentEmail,
        course,
      });

      alert("Certificate issued successfully");
    } catch (e: any) {
      alert(e.response?.data?.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>📜 Issue Certificate</h2>

      <input
        placeholder="Student Email"
        onChange={e => setStudentEmail(e.target.value)}
      />
      <br /><br />

      <input
        placeholder="Course Name"
        onChange={e => setCourse(e.target.value)}
      />
      <br /><br />

      <button onClick={submit} disabled={loading}>
        {loading ? "Issuing..." : "Issue Certificate"}
      </button>
    </div>
  );
}
