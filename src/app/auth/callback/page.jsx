import { Suspense } from "react";
import CallbackClient from "./CallbackClient";

function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100">
      <p className="text-lg font-semibold text-slate-700">Loading Session...</p>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<Loading />}>
      <CallbackClient />
    </Suspense>
  );
}
