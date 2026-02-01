"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "../src/services/api";

import {
  LogOut,
  FileCheck,
  FileText,
  ShieldCheck,
  Upload,
  GraduationCap,
  X,
  PlusCircle,
} from "lucide-react";

/* ======================
   Types
====================== */
type Stats = {
  totalCertificates: number;
  verifiedCertificates: number;
  pendingCertificates: number;
  totalMarksheets: number;
};

/* ======================
   Page
====================== */
export default function DashboardPage() {
  const router = useRouter();

  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const [showCertModal, setShowCertModal] = useState(false);
  const [showMarksheetModal, setShowMarksheetModal] = useState(false);

  /* ======================
     Load Dashboard
  ====================== */
  useEffect(() => {
    const loadDashboard = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.replace("/login");
        return;
      }

      try {
        const res = await api.get("/college/dashboard");
        setStats(res.data.stats);
      } catch {
        localStorage.removeItem("token");
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [router]);

  /* ======================
     Upload Handler
  ====================== */
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    endpoint: string,
    closeModal: () => void
  ) => {
    e.preventDefault();
    setMessage("");
    setUploading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      await api.post(endpoint, formData);
      setMessage("Successfully issued and secured on blockchain");
      closeModal();
      form.reset();
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Operation failed");
    } finally {
      setUploading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-zinc-500">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black px-6 py-10">
      <div className="max-w-7xl mx-auto space-y-12">

        {/* Header */}
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-black dark:text-white flex items-center gap-2">
              <GraduationCap className="w-7 h-7" />
              College Dashboard
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm">
              Blockchain-secured academic records
            </p>
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-400 text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
          >
            <LogOut size={16} />
            Logout
          </button>
        </header>

        {/* Stats */}
        <section className="grid grid-cols-1 sm:grid-cols-4 gap-6">
          <StatCard icon={FileCheck} title="Certificates" value={stats?.totalCertificates ?? 0} />
          <StatCard icon={ShieldCheck} title="Verified" value={stats?.verifiedCertificates ?? 0} />
          <StatCard icon={FileText} title="Pending" value={stats?.pendingCertificates ?? 0} />
          <StatCard icon={Upload} title="Marksheets" value={stats?.totalMarksheets ?? 0} />
        </section>

        {/* Primary Actions */}
        <section className="flex flex-col sm:flex-row gap-4">
          <PrimaryButton onClick={() => setShowCertModal(true)}>
            <PlusCircle size={18} />
            Issue Certificate
          </PrimaryButton>

          <PrimaryButton onClick={() => setShowMarksheetModal(true)}>
            <PlusCircle size={18} />
            Issue Marksheet
          </PrimaryButton>
        </section>

        {message && (
          <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
            {message}
          </p>
        )}

        {/* Quick Links */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ActionCard title="Certificates" description="View issued certificates" href="/certificates" />
          <ActionCard title="Marksheets" description="View issued marksheets" href="/marksheets" />
          <ActionCard title="Verify" description="Verify documents" href="/verify" />
        </section>

        <footer className="text-center text-xs text-zinc-500">
          © {new Date().getFullYear()} EduChain · College Portal
        </footer>
      </div>

      {/* Certificate Modal */}
      {showCertModal && (
        <Modal title="Issue Certificate" onClose={() => setShowCertModal(false)}>
          <form
            onSubmit={(e) =>
              handleSubmit(e, "/certificates/issue", () =>
                setShowCertModal(false)
              )
            }
            className="grid gap-4"
          >
            <Field label="Certificate ID">
              <input name="certId" required className="input border fill-zinc-300 dark:fill-zinc-700" />
            </Field>

            <Field label="Student Name">
              <input name="studentName" required className="input border fill-zinc-300 dark:fill-zinc-700" />
            </Field>

            <Field label="Course / Degree">
              <input name="course" required className="input border fill-zinc-300 dark:fill-zinc-700 " />
            </Field>

            <Field label="Roll Number">
              <input name="rollNumber" required className="input border fill-zinc-300 dark:fill-zinc-700" />
            </Field>

            <Field label="Passing Year">
              <input name="year" required className="input border fill-zinc-300 dark:fill-zinc-700" />
            </Field>

            <Field
              label="Aadhaar Number "
              hint="12-digit Aadhaar number (stored securely as hash) "
            >
              <input
                name="aadhaarNumber"
                pattern="[0-9]{12}"
                required
                className="input border fill-zinc-300 dark:fill-zinc-700"
              />
            </Field>

            <Field label="Certificate PDF">
              <input
                type="file"
                name="file"
                accept="application/pdf"
                required
                className="file-input border fill-zinc-300 dark:fill-zinc-700"
              />
            </Field>

            <button disabled={uploading} className="btn-primary mt-2 border bg-black text-white pt-2 pb-2 rounded-lg">
              {uploading ? "Issuing..." : "Issue Certificate"}
            </button>
          </form>
        </Modal>
      )}

      {/* Marksheet Modal */}
      {showMarksheetModal && (
        <Modal title="Issue Marksheet" onClose={() => setShowMarksheetModal(false)}>
          <form
            onSubmit={(e) =>
              handleSubmit(e, "/marksheets/issue", () =>
                setShowMarksheetModal(false)
              )
            }
            className="grid gap-4"
          >
            <Field label="Roll Number">
              <input name="rollNumber" required className="input border" />
            </Field>

            <Field label="Course">
              <input name="course" required className="input border" />
            </Field>

            <Field label="Semester">
              <input name="semester" required className="input border" />
            </Field>

            <Field label="Academic Year">
              <input name="year" required className="input border" />
            </Field>

            <Field
              label="Aadhaar Number"
              hint="Used only for identity verification (last 4 digits shown)"
            >
              <input
                name="aadhaarNumber"
                pattern="[0-9]{12}"
                required
                className="input border"
              />
            </Field>

            <Field label="Marksheet PDF">
              <input
                type="file"
                name="file"
                accept="application/pdf"
                required
                className="file-input border"
              />
            </Field>

            <button disabled={uploading} className="btn-primary mt-2 border bg-black text-white pt-2 pb-2 rounded-lg">
              {uploading ? "Issuing..." : "Issue Marksheet"}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}

/* ======================
   UI Components
====================== */

function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
        {label}
      </label>
      {children}
      {hint && (
        <span className="text-xs text-zinc-500 dark:text-zinc-400">
          {hint}
        </span>
      )}
    </div>
  );
}

function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
      <div className="bg-white dark:bg-zinc-950 w-full max-w-md rounded-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600"
        >
          <X size={18} />
        </button>
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        {children}
      </div>
    </div>
  );
}

function PrimaryButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-6 py-3 rounded-xl bg-black text-white dark:bg-white dark:text-black hover:opacity-90"
    >
      {children}
    </button>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: number;
  icon: any;
}) {
  return (
    <div className="rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-6">
      <div className="flex items-center gap-3 text-zinc-500">
        <Icon size={18} />
        <p className="text-sm">{title}</p>
      </div>
      <h2 className="mt-3 text-3xl font-bold">{value}</h2>
    </div>
  );
}

function ActionCard({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 bg-white dark:bg-zinc-950 hover:shadow-md transition"
    >
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        {description}
      </p>
    </Link>
  );
}
