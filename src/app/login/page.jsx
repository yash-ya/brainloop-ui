import { Suspense } from "react";
import AuthForm from "@/components/AuthForm";

function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-lg">Loading...</p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<Loading />}>
      <AuthForm />
    </Suspense>
  );
}
