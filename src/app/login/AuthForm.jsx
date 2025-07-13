"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { loginUser, registerUser } from "@/lib/auth";

export default function AuthForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoginView, setIsLoginView] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const view = searchParams.get("view");
    if (view === "register") {
      setIsLoginView(false);
    } else {
      setIsLoginView(true);
    }

    if (searchParams.get("registered") === "true") {
      setSuccessMessage("Registration successful! Please log in.");
      router.replace("/login", undefined, { shallow: true });
    }
  }, [searchParams, router]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage("");

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
        router.push("/login?registered=true");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleView = () => {
    setIsLoginView(!isLoginView);
    setUsername("");
    setEmail("");
    setPassword("");
    setError(null);
    setSuccessMessage("");
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
            className="p-3 text-sm text-green-800 bg-green-100 rounded-lg"
            role="alert"
          >
            <span className="font-medium">Success!</span> {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
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

          {error && (
            <div
              className="p-3 text-sm text-red-700 bg-red-100 rounded-lg"
              role="alert"
            >
              <span className="font-medium">Error:</span> {error}
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
