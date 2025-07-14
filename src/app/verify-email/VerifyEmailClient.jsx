"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

const LoadingSpinner = () => (
  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500 mx-auto"></div>
);

const SuccessIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-16 w-16 mx-auto text-green-500"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const ErrorIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-16 w-16 mx-auto text-red-500"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

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
      setMessage("No verification token found. The link may be incomplete.");
      return;
    }

    const verifyToken = async () => {
      try {
        await verifyEmailToken(token);
        setStatus("success");
        setMessage(
          "Your email has been successfully verified! You can now log in to your account."
        );
      } catch (err) {
        setStatus("error");
        setMessage(
          err.message ||
            "This link is invalid or has expired. Please try registering again."
        );
      }
    };

    const timer = setTimeout(verifyToken, 1000);
    return () => clearTimeout(timer);
  }, [searchParams]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100 p-4">
      <div className="w-full max-w-md p-8 text-center bg-white rounded-2xl shadow-lg">
        {status === "verifying" && (
          <>
            <LoadingSpinner />
            <p className="text-lg font-semibold text-slate-700 mt-4">
              {message}
            </p>
            <p className="text-sm text-slate-500">Please wait a moment.</p>
          </>
        )}
        {status === "success" && (
          <>
            <SuccessIcon />
            <h1 className="text-2xl font-bold text-slate-800 mt-4">
              Verification Successful!
            </h1>
            <p className="mt-2 text-slate-600">{message}</p>
            <Link
              href="/login"
              className="mt-6 inline-block px-8 py-3 bg-sky-500 text-white rounded-lg font-semibold hover:bg-sky-600 transition-colors"
            >
              Go to Login
            </Link>
          </>
        )}
        {status === "error" && (
          <>
            <ErrorIcon />
            <h1 className="text-2xl font-bold text-slate-800 mt-4">
              Verification Failed
            </h1>
            <p className="mt-2 text-slate-600">{message}</p>
            <Link
              href="/login?view=register"
              className="mt-6 inline-block px-6 py-2 bg-slate-200 text-slate-700 rounded-lg font-semibold hover:bg-slate-300 transition-colors"
            >
              Return to Sign Up
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
