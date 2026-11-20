import { BrandMark } from "@/components/BrandMark";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-bg-card p-8">
        <BrandMark className="h-12 w-12" />
        <h1 className="mt-5 font-display text-2xl font-bold">
          Oasis Orchard Stack
        </h1>
        <p className="mt-1 mb-6 text-sm text-muted">
          Sign in to manage bookings, enquiries and site content.
        </p>
        <LoginForm />
      </div>
    </div>
  );
}
