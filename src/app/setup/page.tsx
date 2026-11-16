import { Logo } from "@/components/Logo";
import Link from "next/link";

export const metadata = { title: "Service unavailable" };

export default function SetupPage() {
  return (
    <div className="grid min-h-screen place-items-center bg-mist p-6">
      <div className="card max-w-lg p-8">
        <Logo />
        <h1 className="mt-6 text-2xl font-medium">We are briefly offline</h1>
        <p className="mt-3 text-muted">The platform is undergoing maintenance. Please try again in a few minutes.</p>
        <Link href="/" className="btn-dark mt-6">Home</Link>
      </div>
    </div>
  );
}
