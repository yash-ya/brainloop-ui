"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

async function verifyEmailToken(token) {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const response = await fetch(`${API_BASE_URL}/users/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token }),
  });

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ message: "An unknown error occurred." }));
    throw new Error(errorData.message || "Failed to verify email.");
  }
  return response.json();
}

export default function VerifyEmailClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState("Verifying your email address...");

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      setMessage(
        "No verification token found. Please check the link and try again."
      );
      return;
    }

    const verifyToken = async () => {
      try {
        await verifyEmailToken(token);
        setStatus("success");
        setMessage(
          "Your email has been successfully verified! You can now log in."
        );
      } catch (err) {
        setStatus("error");
        setMessage(
          err.message ||
            "This link is invalid or has expired. Please try registering again."
        );
      }
    };

    verifyToken();
  }, [searchParams]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100">
      <div className="w-full max-w-md p-8 text-center bg-white rounded-2xl shadow-lg">
        {status === "verifying" && (
          <p className="text-lg font-semibold text-slate-700">{message}</p>
        )}
        {status === "success" && (
          <>
            <h1 className="text-2xl font-bold text-green-600">
              Verification Successful!
            </h1>
            <p className="mt-2 text-slate-600">{message}</p>
            <Link
              href="/login"
              className="mt-6 inline-block px-6 py-2 bg-sky-500 text-white rounded-lg font-semibold hover:bg-sky-600"
            >
              Go to Login
            </Link>
          </>
        )}
        {status === "error" && (
          <>
            <h1 className="text-2xl font-bold text-red-600">
              Verification Failed
            </h1>
            <p className="mt-2 text-slate-600">{message}</p>
            <Link
              href="/login?view=register"
              className="mt-6 inline-block px-6 py-2 bg-slate-600 text-white rounded-lg font-semibold hover:bg-slate-700"
            >
              Return to Sign Up
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
