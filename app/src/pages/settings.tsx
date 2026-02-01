import { logout } from "../auth/auth";

export default function Settings() {
  return (
    <div style={{ padding: 40 }}>
      <h2>Settings</h2>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
