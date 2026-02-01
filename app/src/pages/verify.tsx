import { useState } from "react";
import API from "../services/api";

export default function Verify() {
  const [id, setId] = useState("");
  const [result, setResult] = useState<any>(null);

  const verify = async () => {
    const res = await API.get(`/certificates/verify/${id}`);
    setResult(res.data);
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>Verify Certificate</h2>

      <input
        placeholder="Certificate ID"
        onChange={e => setId(e.target.value)}
      />
      <button onClick={verify}>Verify</button>

      {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
    </div>
  );
}
