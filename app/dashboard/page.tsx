"use client";

import { useEffect, useMemo, useState } from "react";
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
   Utils
====================== */
function formatNumber(num: number) {
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
  return num.toString();
}

/* ======================
   Animated Counter Hook
====================== */
function useAnimatedCounter(
  value: number,
  delay = 0,
  duration = 900
) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let raf: number;
    let startTime: number | null = null;

    const animate = (time: number) => {
      if (!startTime) startTime = time;
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // spring / bounce ease
      const eased =
        1 - Math.pow(1 - progress, 3) * Math.cos(progress * Math.PI * 1.2);

      setDisplay(Math.floor(eased * value));

      if (progress < 1) raf = requestAnimationFrame(animate);
    };

    const timeout = setTimeout(() => {
      raf = requestAnimationFrame(animate);
    }, delay);

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(raf);
    };
  }, [value, delay, duration]);

  return display;
}

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

  const statCards = useMemo(
    () => [
      {
        icon: FileCheck,
        title: "Certificates",
        value: stats?.totalCertificates ?? 0,
      },
      {
        icon: ShieldCheck,
        title: "Verified",
        value: stats?.verifiedCertificates ?? 0,
      },
      {
        icon: FileText,
        title: "Pending",
        value: stats?.pendingCertificates ?? 0,
      },
      {
        icon: Upload,
        title: "Marksheets",
        value: stats?.totalMarksheets ?? 0,
      },
    ],
    [stats]
  );

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    endpoint: string,
    closeModal: () => void
  ) => {
    e.preventDefault();
    setUploading(true);
    setMessage("");

    try {
      await api.post(endpoint, new FormData(e.currentTarget));
      e.currentTarget.reset();
      closeModal();
      setMessage("Successfully issued and secured on blockchain");
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Operation failed");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="min-h-screen w-full bg-zinc-50 dark:bg-black px-6 py-10">
      {uploading && <FullScreenLoader />}

      <div className="space-y-12">
        {/* Header */}
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold flex gap-2 items-center">
              <GraduationCap /> College Dashboard
            </h1>
            <p className="text-sm text-zinc-500">
              Blockchain-secured academic records
            </p>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              router.push("/login");
            }}
            className="flex gap-2 items-center px-4 py-2 border border-red-400 text-red-500 rounded-lg"
          >
            <LogOut size={16} /> Logout
          </button>
        </header>

        {/* Stats */}
        <section className="grid grid-cols-1 sm:grid-cols-4 gap-6">
          {statCards.map((s, i) => (
            <StatCard key={s.title} {...s} delay={i * 120} />
          ))}
        </section>

        {/* Actions */}
        <section className="flex gap-4">
          <PrimaryButton onClick={() => setShowCertModal(true)}>
            <PlusCircle size={18} /> Issue Certificate
          </PrimaryButton>
          <PrimaryButton onClick={() => setShowMarksheetModal(true)}>
            <PlusCircle size={18} /> Issue Marksheet
          </PrimaryButton>
        </section>

        {message && (
          <p className="text-center text-sm text-zinc-500">{message}</p>
        )}

        {/* Links */}
        <section className="grid md:grid-cols-3 gap-6">
          <ActionCard title="Certificates" description="View issued certificates" href="/certificates" />
          <ActionCard title="Marksheets" description="View issued marksheets" href="/marksheets" />
          <ActionCard title="Verify" description="Verify documents" href="/verify" />
        </section>
      </div>

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
            <input name="certId" placeholder="Certificate ID" required className="input border" />
            <input name="studentName" placeholder="Student Name" required className="input border" />
            <input name="course" placeholder="Course" required className="input border" />
            <input name="rollNumber" placeholder="Roll Number" required className="input border" />
            <input name="year" placeholder="Passing Year" required className="input border" />
            <input name="aadhaarNumber" placeholder="Aadhaar Number" required pattern="[0-9]{12}" className="input border" />
            <input type="file" name="file" accept="application/pdf" required className="file-input border" />
            <button className="bg-black text-white py-2 rounded-lg">
              Issue Certificate
            </button>
          </form>
        </Modal>
      )}

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
            <input name="rollNumber" placeholder="Roll Number" required className="input border" />
            <input name="course" placeholder="Course" required className="input border" />
            <input name="semester" placeholder="Semester" required className="input border" />
            <input name="year" placeholder="Academic Year" required className="input border" />
            <input name="aadhaarNumber" placeholder="Aadhaar Number" required pattern="[0-9]{12}" className="input border" />
            <input type="file" name="file" accept="application/pdf" required className="file-input border" />
            <button className="bg-black text-white py-2 rounded-lg">
              Issue Marksheet
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}

/* ======================
   Components
====================== */

function StatCard({
  title,
  value,
  icon: Icon,
  delay,
}: any) {
  const animated = useAnimatedCounter(value, delay);
  return (
    <div className="rounded-xl bg-white dark:bg-zinc-950 border p-6">
      <div className="flex items-center gap-2 text-zinc-500">
        <Icon size={18} />
        <span className="text-sm">{title}</span>
      </div>
      <h2 className="mt-3 text-3xl font-bold tabular-nums">
        {formatNumber(animated)}
      </h2>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="min-h-screen px-6 py-10 animate-pulse">
      <div className="grid sm:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 rounded-xl bg-zinc-200 dark:bg-zinc-800" />
        ))}
      </div>
    </div>
  );
}

function FullScreenLoader() {
  return (
    <div className="fixed inset-0 z-[9999] bg-black/60 flex items-center justify-center">
      <div className="h-12 w-12 rounded-full border-4 border-white/30 border-t-white animate-spin" />
    </div>
  );
}

function Modal({ title, onClose, children }: any) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
      <div className="bg-white dark:bg-zinc-950 w-full max-w-md p-6 rounded-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4">
          <X size={18} />
        </button>
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        {children}
      </div>
    </div>
  );
}

function PrimaryButton({ children, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-xl"
    >
      {children}
    </button>
  );
}

function ActionCard({ title, description, href }: any) {
  return (
    <Link
      href={href}
      className="rounded-xl border p-6 bg-white dark:bg-zinc-950 hover:shadow-md transition"
    >
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm text-zinc-500 mt-2">{description}</p>
    </Link>
  );
}
