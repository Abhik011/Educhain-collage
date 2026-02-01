import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center px-6">
      <main className="w-full max-w-5xl bg-white dark:bg-zinc-950 rounded-2xl shadow-lg p-10">
        {/* Header */}
        <header className="flex flex-col gap-4 text-center">
          <h1 className="text-4xl font-bold text-black dark:text-white">
            🎓 Edu-Chain College Portal
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-lg">
            Issue, manage, and verify academic certificates securely using
            blockchain technology.
          </p>
        </header>

        {/* Features */}
        <section className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard
            title="📜 Issue Certificates"
            description="Universities can issue tamper-proof digital certificates to students."
          />
          <FeatureCard
            title="🔐 Blockchain Secured"
            description="Each certificate is hashed and anchored on blockchain for authenticity."
          />
          <FeatureCard
            title="✅ Instant Verification"
            description="Anyone can verify certificates without contacting the institution."
          />
        </section>

        {/* Actions */}
        <section className="mt-14 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/login"
            className="px-6 py-3 rounded-xl bg-black text-white dark:bg-white dark:text-black font-medium text-center hover:opacity-90"
          >
            College Login
          </Link>

          <Link
            href="/verify"
            className="px-6 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 text-black dark:text-white font-medium text-center hover:bg-zinc-100 dark:hover:bg-zinc-900"
          >
            Verify Certificate
          </Link>
        </section>

        {/* Footer */}
        <footer className="mt-16 text-center text-sm text-zinc-500">
          © {new Date().getFullYear()} Edu-Chain · Academic Credential Platform
        </footer>
      </main>
    </div>
  );
}

/* -------------------------
   Feature Card Component
-------------------------- */
function FeatureCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 text-center hover:shadow-md transition">
      <h3 className="text-lg font-semibold text-black dark:text-white">
        {title}
      </h3>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        {description}
      </p>
    </div>
  );
}
