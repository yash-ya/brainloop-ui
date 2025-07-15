import { Suspense } from "react";
import VerifyEmailClient from "./VerifyEmailClient";

function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100">
      <p className="text-lg font-semibold text-slate-700">
        Loading Verification Page...
      </p>
    </div>
  );
}

export const metadata = {
  title: "Verify Your Email",
};

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<Loading />}>
      <VerifyEmailClient />
    </Suspense>
  );
}
