"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "../../services/api";
import { ArrowLeft, FileCheck } from "lucide-react";

/* ======================
   Types
====================== */
type Certificate = {
    _id: string;
    certId: string;
    studentName: string;
    course: string;
    rollNumber: string;
    year: string;
    status: "verified" | "pending";
    createdAt: string;
};

/* ======================
   Page
====================== */
export default function CertificatesPage() {
    const [data, setData] = useState<Certificate[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadCertificates = async () => {
            try {
                const res = await api.get("/certificates");
                setData(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadCertificates();
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
                            <FileCheck /> Certificates
                        </h1>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto rounded-xl border bg-white dark:bg-zinc-950">
                    <table className="w-full text-sm">
                        <thead className="border-b bg-zinc-100 dark:bg-zinc-900">
                            <tr>
                                <th className="p-3 text-left">Cert ID</th>
                                <th className="p-3 text-left">Student</th>
                                <th className="p-3 text-left">Course</th>
                                <th className="p-3 text-left">Roll No</th>
                                <th className="p-3 text-left">Year</th>
                                <th className="p-3 text-left">Status</th>
                                <th className="p-3 text-left">Date</th>
                                <th className="p-3 text-left">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((cert) => (
                                <tr
                                    key={cert._id}
                                    className="border-b hover:bg-zinc-50 dark:hover:bg-zinc-900"
                                >
                                    <td className="p-3 font-medium">{cert.certId}</td>
                                    <td className="p-3">{cert.studentName}</td>
                                    <td className="p-3">{cert.course}</td>
                                    <td className="p-3">{cert.rollNumber}</td>
                                    <td className="p-3">{cert.year}</td>

                                    <td className="p-3">
                                        <span
                                            className={`px-2 py-1 rounded text-xs ${cert.status === "verified"
                                                    ? "bg-green-100 text-green-600"
                                                    : "bg-yellow-100 text-yellow-600"
                                                }`}
                                        >
                                            {cert.status}
                                        </span>
                                    </td>

                                    <td className="p-3 text-zinc-500">
                                        {new Date(cert.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="p-3">
                                        <button
                                            onClick={async () => {
                                                try {
                                                    const res = await api.get(`/certificates/clgdownload/${cert.certId}`);
                                                    window.open(res.data.downloadUrl, "_blank");
                                                } catch (err) {
                                                    alert("Failed to open PDF");
                                                }
                                            }}
                                            className="px-3 py-1 text-xs bg-black text-white rounded-md hover:opacity-80"
                                        >
                                            View PDF
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {data.length === 0 && (
                        <div className="text-center py-10 text-zinc-500">
                            No certificates found
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