"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast"; // Assuming react-hot-toast is installed
import { loginUser, registerUser } from "@/lib/auth";

async function resendVerificationEmail(email) {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const response = await fetch(`${API_BASE_URL}/users/resend-verification`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || "Failed to resend verification email."
    );
  }
  return response.json();
}

const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 48 48">
    <path
      fill="#FFC107"
      d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
    ></path>
    <path
      fill="#FF3D00"
      d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
    ></path>
    <path
      fill="#4CAF50"
      d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
    ></path>
    <path
      fill="#1976D2"
      d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C39.99,36.666,44,31.1,44,24C44,22.659,43.862,21.35,43.611,20.083z"
    ></path>
  </svg>
);

export default function AuthForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoginView, setIsLoginView] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [showResendVerification, setShowResendVerification] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const view = searchParams.get("view");
    if (view === "register") {
      setIsLoginView(false);
    } else {
      setIsLoginView(true);
    }

    if (searchParams.get("status") === "registered") {
      setSuccessMessage(
        "Registration successful! Please check your email to verify your account before logging in."
      );
      router.replace("/login", { shallow: true });
    }
  }, [searchParams, router]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage("");
    setShowResendVerification(false);

    try {
      if (isLoginView) {
        const data = await loginUser(email, password);
        const response = await fetch("/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: data.token }),
        });

        if (!response.ok) {
          throw new Error("Failed to create login session. Please try again.");
        }
        window.location.assign("/dashboard");
      } else {
        await registerUser(username, email, password);
        router.push("/login?status=registered");
      }
    } catch (error) {
      setError(error.message);
      if (error.message.includes("Please verify your email")) {
        setShowResendVerification(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setError(null);
    setSuccessMessage("");
    try {
      await resendVerificationEmail(email);
      toast.success("Verification email has been sent to your email.");
      setShowResendVerification(false);
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    }
  };

  const toggleView = () => {
    setIsLoginView(!isLoginView);
    setUsername("");
    setEmail("");
    setPassword("");
    setError(null);
    setSuccessMessage("");
    setShowResendVerification(false);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-white font-sans">
      <div className="absolute top-8">
        <Link
          href="/"
          className="text-2xl font-bold tracking-tight text-slate-900"
        >
          BrainLoop
        </Link>
      </div>
      <div className="w-full max-w-md p-8 mt-16 space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-800">
            {isLoginView ? "Welcome Back" : "Create Your Account"}
          </h1>
          <p className="mt-2 text-slate-600">
            {isLoginView
              ? "Log in to access your dashboard."
              : "Get started with BrainLoop."}
          </p>
        </div>

        {successMessage && (
          <div
            className="p-4 text-sm text-green-800 bg-green-100 rounded-lg"
            role="alert"
          >
            <span className="font-medium">Success!</span> {successMessage}
          </div>
        )}

        <a
          href={`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/google/login`}
          className="w-full flex items-center justify-center gap-3 py-3 border border-slate-300 rounded-lg text-slate-700 font-semibold hover:bg-slate-50 transition-colors"
        >
          <GoogleIcon />
          Sign in with Google
        </a>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-slate-500">
              Or continue with
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {!isLoginView && (
              <div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="w-full px-4 py-3 text-lg border border-slate-300 rounded-lg focus:ring-sky-500 focus:border-sky-500 transition-colors"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            )}
            <div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full px-4 py-3 text-lg border border-slate-300 rounded-lg focus:ring-sky-500 focus:border-sky-500 transition-colors"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete={isLoginView ? "current-password" : "new-password"}
                required
                className="w-full px-4 py-3 text-lg border border-slate-300 rounded-lg focus:ring-sky-500 focus:border-sky-500 transition-colors"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {isLoginView && (
            <div className="flex justify-end text-sm">
              <Link
                href="/forgot-password"
                className="font-medium text-sky-600 hover:text-sky-500"
              >
                Forgot password?
              </Link>
            </div>
          )}

          {error && (
            <div
              className="p-3 text-sm text-red-700 bg-red-100 rounded-lg"
              role="alert"
            >
              <span className="font-medium">Error:</span> {error}
              {showResendVerification && (
                <button
                  onClick={handleResend}
                  className="ml-2 font-semibold underline cursor-pointer"
                >
                  Resend email?
                </button>
              )}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 text-lg font-semibold text-white bg-sky-500 rounded-lg hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:bg-sky-300 transition-colors"
            >
              {isLoading
                ? "Processing..."
                : isLoginView
                ? "Log In"
                : "Create Account"}
            </button>
          </div>
        </form>

        <div className="text-sm text-center">
          <button
            type="button"
            onClick={toggleView}
            className="font-medium text-sky-600 hover:text-sky-500"
          >
            {isLoginView
              ? "Don't have an account? Sign Up"
              : "Already have an account? Log In"}
          </button>
        </div>
      </div>
    </main>
  );
}
