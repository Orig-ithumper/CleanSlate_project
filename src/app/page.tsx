// ✅ Home page – Clean Slate App
"use client";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6 py-16 text-center">
      <h1 className="text-5xl font-extrabold text-indigo-700 tracking-tight mb-4">
        Clean Slate App
      </h1>

      <p className="max-w-xl text-gray-700 mb-10 leading-relaxed">
        Helping individuals clear their criminal records and start fresh. Our app guides you through state‑specific expungement requirements, auto‑fills your paperwork, and provides a secure checkout for your processing fee.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/state-status"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg shadow"
        >
          Check Your State Status
        </Link>

        <Link
          href="/checkout"
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg shadow"
        >
          Start Your Expungement
        </Link>
      </div>

      <footer className="mt-16 text-xs text-gray-400">
        © 2026 Clean Slate App • Secure Paperwork Processing • No Refund Policy applies after form generation.
      </footer>
    </main>
  );
}
