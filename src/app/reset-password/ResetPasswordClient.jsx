"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

async function resetPassword(token, newPassword) {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const response = await fetch(`${API_BASE_URL}/users/reset-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token, newPassword }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to reset password.");
  }

  return response.json();
}

export default function ResetPasswordClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const tokenFromUrl = searchParams.get("token");
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      setError("No reset token found. The link may be invalid.");
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!token) {
      setError("Missing token. Cannot proceed.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await resetPassword(token, password);
      toast.success("Your password has been reset successfully!");
      router.push("/login");
    } catch (err) {
      setError(err.message);
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
          Set a New Password
        </h1>

        {error ? (
          <div className="mt-4 text-red-600 bg-red-50 p-4 rounded-lg">
            <p>{error}</p>
            <Link
              href="/forgot-password"
              className="mt-4 inline-block text-sky-600 hover:text-sky-800 font-semibold"
            >
              Request a new link
            </Link>
          </div>
        ) : (
          <>
            <p className="mt-2 text-slate-500">
              Please enter and confirm your new password below.
            </p>
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label htmlFor="password-new" className="sr-only">
                  New Password
                </label>
                <input
                  id="password-new"
                  name="password"
                  type="password"
                  required
                  className="w-full px-4 py-3 text-lg border border-slate-300 rounded-lg"
                  placeholder="New Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password-confirm" className="sr-only">
                  Confirm New Password
                </label>
                <input
                  id="password-confirm"
                  name="confirmPassword"
                  type="password"
                  required
                  className="w-full px-4 py-3 text-lg border border-slate-300 rounded-lg"
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 text-lg font-semibold text-white bg-sky-500 rounded-lg hover:bg-sky-600 disabled:bg-sky-300"
                >
                  {isLoading ? "Saving..." : "Reset Password"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </main>
  );
}
