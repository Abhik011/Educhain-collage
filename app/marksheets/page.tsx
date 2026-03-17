"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "../../services/api";
import { ArrowLeft, FileText, ExternalLink } from "lucide-react";

/* ======================
Types
====================== */
type Marksheet = {
  _id: string;
  rollNumber: string;
  studentName: string;
  course: string;
  semester: string;
  year: string;
  status: "verified" | "pending";
  createdAt: string;
  accessToken?: string;
};

/* ======================
Page
====================== */
export default function MarksheetsPage() {
  const [data, setData] = useState<Marksheet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMarksheets = async () => {
      try {
        const res = await api.get("/marksheets"); // 👈 backend route
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadMarksheets();
  }, []);

  if (loading) return <Skeleton />;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black px-6 py-10">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-sm text-zinc-500 mb-2"
            >
              <ArrowLeft size={16} /> Back
            </Link>

            <h1 className="text-3xl font-bold flex gap-2 items-center">
              <FileText /> Marksheets
            </h1>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border bg-white dark:bg-zinc-950">
          <table className="w-full text-sm">

            <thead className="border-b bg-zinc-100 dark:bg-zinc-900">
              <tr>
                <th className="p-3 text-left">Roll No</th>
                <th className="p-3 text-left">Student</th>
                <th className="p-3 text-left">Course</th>
                <th className="p-3 text-left">Semester</th>
                <th className="p-3 text-left">Year</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Action</th>
              </tr>
            </thead>

            <tbody>
              {data.map((m) => {
                const verifyUrl = `/verify/marksheet/${m.rollNumber}?token=${m.accessToken}`;

                return (
                  <tr
                    key={m._id}
                    className="border-b hover:bg-zinc-50 dark:hover:bg-zinc-900"
                  >
                    <td className="p-3 font-medium">{m.rollNumber}</td>
                    <td className="p-3">{m.studentName}</td>
                    <td className="p-3">{m.course}</td>
                    <td className="p-3">{m.semester}</td>
                    <td className="p-3">{m.year}</td>

                    {/* Status */}
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          m.status === "verified"
                            ? "bg-green-100 text-green-600"
                            : "bg-yellow-100 text-yellow-600"
                        }`}
                      >
                        {m.status}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="p-3 text-zinc-500">
                      {new Date(m.createdAt).toLocaleDateString()}
                    </td>

                    {/* Actions */}
                    <td className="p-3 flex gap-2">

                      {/* View PDF */}
                      <button
                        onClick={async () => {
                          try {
                            const res = await api.get(
                              `/marksheets/clgdownload/${m.rollNumber}?token=${m.accessToken}`
                            );

                            window.open(res.data.downloadUrl, "_blank");
                          } catch {
                            alert("Failed to open PDF");
                          }
                        }}
                        className="px-3 py-1 text-xs bg-black text-white rounded-md hover:opacity-80"
                      >
                        View PDF
                      </button>

                      {/* Verify */}
                      <Link
                        href={verifyUrl}
                        target="_blank"
                        className="px-3 py-1 text-xs border rounded-md flex items-center gap-1 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                      >
                        Verify <ExternalLink size={12} />
                      </Link>

                    </td>
                  </tr>
                );
              })}
            </tbody>

          </table>

          {data.length === 0 && (
            <div className="text-center py-10 text-zinc-500">
              No marksheets found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ======================
Skeleton Loader
====================== */
function Skeleton() {
  return (
    <div className="min-h-screen px-6 py-10 animate-pulse">
      <div className="h-10 w-40 bg-zinc-200 dark:bg-zinc-800 mb-6 rounded" />
      <div className="h-64 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
    </div>
  );
}