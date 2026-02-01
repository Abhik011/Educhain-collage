"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import api from "../src/services/api";

export default function RegisterPage() {
  const router = useRouter();

  const [collegeName, setCollegeName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await api.post("/auth/college-register", {
        name: collegeName,
        email,
        password,
        role: "college",
      });

      router.push("/login");
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black px-6">
      <div className="w-full max-w-md bg-white dark:bg-zinc-950 rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center text-black dark:text-white">
          🏫 College Registration
        </h1>

        <p className="text-center text-sm text-zinc-500 mt-2">
          Register your institution on Edu-Chain
        </p>

        <form onSubmit={handleRegister} className="mt-8 space-y-4">
          <input
            type="text"
            placeholder="College / University Name"
            className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent px-4 py-3"
            value={collegeName}
            onChange={(e) => setCollegeName(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Official College Email"
            className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent px-4 py-3"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent px-4 py-3 pr-12"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-zinc-500 hover:text-black dark:hover:text-white"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm Password"
              className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent px-4 py-3 pr-12"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-zinc-500 hover:text-black dark:hover:text-white"
            >
              {showConfirm ? "Hide" : "Show"}
            </button>
          </div>

          {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-black dark:bg-white text-white dark:text-black py-3 font-semibold hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Registering..." : "Register College"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-zinc-500">
            Already registered?{" "}
            <Link
              href="/login"
              className="font-medium text-black dark:text-white underline"
            >
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
