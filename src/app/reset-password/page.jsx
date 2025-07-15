import { Suspense } from "react";
import ResetPasswordClient from "./ResetPasswordClient";

function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100">
      <p className="text-lg font-semibold text-slate-700">Loading Page...</p>
    </div>
  );
}

export const metadata = {
  title: "Reset Your Password | BrainLoop",
};

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<Loading />}>
      <ResetPasswordClient />
    </Suspense>
  );
}
