"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AuthShell from "@/components/auth-shell";

export default function ForgotPage() {
  const router = useRouter();
  const [step, setStep] = useState<"email" | "answer" | "done">("email");
  const [email, setEmail] = useState("");
  const [question, setQuestion] = useState<string | null>(null);
  const [answer, setAnswer] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const lookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await fetch("/api/auth/forgot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ step: "question", email }),
    });
    const data = await res.json();
    setLoading(false);
    if (!data.question) {
      setError(
        "If an account exists for that email, the secret question will appear. Please check your email and try again."
      );
      return;
    }
    setQuestion(data.question);
    setStep("answer");
  };

  const reset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await fetch("/api/auth/forgot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ step: "reset", email, answer, newPassword }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Reset failed");
      return;
    }
    setStep("done");
    setTimeout(() => router.push("/login"), 2000);
  };

  return (
    <AuthShell
      title="Reset password"
      subtitle={
        step === "email"
          ? "Enter your email to start."
          : step === "answer"
          ? "Answer your secret question to set a new password."
          : "Password updated."
      }
      footer={
        <Link href="/login" className="text-neutral-900 dark:text-white hover:underline">
          Back to sign in
        </Link>
      }
    >
      {step === "email" && (
        <form onSubmit={lookup} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wide mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-neutral-200/60 dark:border-white/[0.06] bg-white dark:bg-[#0A0A0B] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white"
            />
          </div>
          {error && (
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-medium py-2 text-sm hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {loading ? "Looking up…" : "Continue"}
          </button>
        </form>
      )}

      {step === "answer" && question && (
        <form onSubmit={reset} className="space-y-4">
          <div>
            <p className="text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wide mb-1">
              Secret question
            </p>
            <p className="text-sm text-neutral-900 dark:text-white font-medium">
              {question}
            </p>
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wide mb-1">
              Your answer
            </label>
            <input
              type="text"
              required
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="w-full rounded-lg border border-neutral-200/60 dark:border-white/[0.06] bg-white dark:bg-[#0A0A0B] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wide mb-1">
              New password
            </label>
            <input
              type="password"
              required
              minLength={8}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full rounded-lg border border-neutral-200/60 dark:border-white/[0.06] bg-white dark:bg-[#0A0A0B] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white"
            />
          </div>
          {error && (
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-medium py-2 text-sm hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {loading ? "Resetting…" : "Reset password"}
          </button>
        </form>
      )}

      {step === "done" && (
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Your password has been updated. Redirecting to sign in…
        </p>
      )}
    </AuthShell>
  );
}
