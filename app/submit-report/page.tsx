'use client';
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Client-side only components
const ClientOnlyGradient = dynamic(
  () => import("@/components/ClientOnlyGradient").then(mod => mod.default),
  { ssr: false }
);

const ReportWizard = dynamic(() =>
  import("@/components/report/ReportWizard").then(mod => ({
    default: mod.ReportWizard
  })),
  { 
    ssr: false,
    loading: () => <div className="h-64 bg-zinc-900/50 rounded-2xl animate-pulse" />
  }
);

const SecureBadge = dynamic(
  () => import("@/components/SecureBadge").then(mod => mod.default),
  { ssr: false }
);

export default function SubmitReport() {
  const { data: session, status } = useSession();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Redirect to sign in if not authenticated
  useEffect(() => {
    if (status === "loading") return;
    
    if (status === "unauthenticated") {
      window.location.href = "/auth/signin?callbackUrl=/submit-report";
      return;
    }
  }, [status]);
  if (!isMounted) return null;

  // Show loading while checking authentication
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="rounded-full h-20 w-20 border-t-4 border-b-4 border-[#07D348] animate-spin"></div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (status === "unauthenticated") {
    return null;
  }
  return (
    <div className="relative min-h-screen bg-black selection:bg-sky-500/20 overflow-hidden">
      <ClientOnlyGradient />

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(250)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-[#07D348] rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              transform: `scale(${0.5 + Math.random()})`
            }}
          ></div>
        ))}
      </div>

      <main className="relative px-6 pt-32">
        <div className="mx-auto max-w-3xl">
          <div className="flex flex-col items-center text-center">
            <SecureBadge />
            
            <h1 className="mt-8 bg-white bg-clip-text text-5xl font-bold tracking-tight text-transparent">
              Submit Anonymous Report
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-zinc-400">
              Welcome {session?.user?.name}! Your safety is our priority. All submissions are encrypted and secure.
            </p>
          </div>

          <div className="mt-16 bg-zinc-900/50 rounded-2xl border border-white/5 p-6">
            <ReportWizard />
          </div>
        </div>
      </main>
    </div>
  );
}