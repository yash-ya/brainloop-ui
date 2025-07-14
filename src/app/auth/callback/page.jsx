"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      const setSessionCookie = async () => {
        try {
          const response = await fetch("/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token }),
          });

          if (!response.ok) {
            throw new Error("Failed to create session.");
          }

          window.location.assign("/dashboard");
        } catch (error) {
          console.error("Auth callback error:", error);
          router.push("/login?error=auth_failed");
        }
      };

      setSessionCookie();
    } else {
      router.push("/login?error=no_token");
    }
  }, [router, searchParams]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100">
      <p className="text-lg font-semibold text-slate-700">Authenticating...</p>
      <p className="mt-2 text-slate-500">
        Please wait while we securely log you in.
      </p>
    </div>
  );
}
