import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-white shadow-sm py-4 px-6 flex items-center justify-between">
      <Link href="/" className="text-xl font-bold text-blue-700">
        CleanSlate
      </Link>
      <nav className="flex gap-6 text-sm font-medium text-gray-600">
        <Link href="/" className="hover:text-blue-600">Home</Link>
        <Link href="/form" className="hover:text-blue-600">Check Eligibility</Link>
        <Link href="/checkout" className="hover:text-blue-600">Get Started</Link>
      </nav>
    </header>
  );
}
