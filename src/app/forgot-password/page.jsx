import { Suspense } from "react";
import ForgotPasswordClient from "./ForgotPasswordClient";

function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-lg">Loading...</p>
    </div>
  );
}

export const metadata = {
  title: "Forgot Password | BrainLoop",
};

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<Loading />}>
      <ForgotPasswordClient />
    </Suspense>
  );
}
