"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "../src/services/api";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/college-login", {
        email,
        password,
      });
         
console.log("LOGIN RESPONSE:", res.data);


      // 🔐 Save token
      const token = res.data?.token;

if (!token) {
  throw new Error("Token missing in response");
}

localStorage.setItem("token", token);
console.log("TOKEN SAVED:", localStorage.getItem("token"));


      // ✅ Redirect to dashboard
     setTimeout(() => {
  router.push("/dashboard");
}, 50);
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black px-6">
      <div className="w-full max-w-md bg-white dark:bg-zinc-950 rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center text-black dark:text-white">
          🎓 College Login
        </h1>

        <p className="text-center text-sm text-zinc-500 mt-2">
          Authorized university access only
        </p>

        <form onSubmit={handleLogin} className="mt-8 space-y-4">
          <input
            type="email"
            placeholder="College Email"
            className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent px-4 py-3 text-black dark:text-white outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent px-4 py-3 text-black dark:text-white outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-black dark:bg-white text-white dark:text-black py-3 font-semibold hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Login"}
          </button>

          <div className="mt-6 text-center">
          <p className="text-sm text-zinc-500">
            New College?{" "}
            <Link
              href="/register"
              className="font-medium text-black dark:text-white underline hover:opacity-80"
            >
              Register here
            </Link>
          </p>
        </div>
        </form>
      </div>
    </div>
  );
}
