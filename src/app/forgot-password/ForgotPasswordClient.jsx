"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";

async function requestPasswordReset(email) {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const response = await fetch(`${API_BASE_URL}/users/forgot-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok && response.status !== 404) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to request password reset.");
  }
  return response.json();
}

export default function ForgotPasswordClient() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await requestPasswordReset(email);
      setIsSubmitted(true);
    } catch (err) {
      toast.error(err.message);
      setIsSubmitted(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-slate-100 font-sans">
      <div className="absolute top-8">
        <Link
          href="/"
          className="text-2xl font-bold tracking-tight text-slate-900"
        >
          BrainLoop
        </Link>
      </div>
      <div className="w-full max-w-md p-8 text-center bg-white rounded-2xl shadow-lg">
        <h1 className="text-2xl font-bold text-slate-800">
          Forgot Your Password?
        </h1>

        {isSubmitted ? (
          <div className="mt-4">
            <p className="text-slate-600">
              If an account with that email address exists, we have sent a
              password reset link to it. Please check your inbox.
            </p>
            <Link
              href="/login"
              className="mt-6 inline-block text-sky-600 hover:text-sky-800 font-semibold"
            >
              &larr; Back to Login
            </Link>
          </div>
        ) : (
          <>
            <p className="mt-2 text-slate-500">
              No problem. Enter your email address below and we'll send you a
              link to reset it.
            </p>
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label htmlFor="email" className="sr-only">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="w-full px-4 py-3 text-lg border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 text-lg font-semibold text-white bg-sky-500 rounded-lg hover:bg-sky-600 disabled:bg-sky-300"
                >
                  {isLoading ? "Sending..." : "Send Reset Link"}
                </button>
              </div>
            </form>
            <div className="mt-4">
              <Link
                href="/login"
                className="text-sm text-slate-500 hover:text-slate-700"
              >
                Remembered your password?
              </Link>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
