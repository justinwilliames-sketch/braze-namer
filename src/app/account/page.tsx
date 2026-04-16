"use client";

import { useEffect, useState } from "react";
import { SECRET_QUESTIONS } from "@/lib/secret-questions";

interface Me {
  email: string;
  secret_question: string;
  theme: string;
}

export default function AccountPage() {
  const [me, setMe] = useState<Me | null>(null);
  const [passwordState, setPasswordState] = useState({
    current: "",
    next: "",
    msg: null as { type: "ok" | "err"; text: string } | null,
  });
  const [secretState, setSecretState] = useState({
    current: "",
    question: "",
    answer: "",
    msg: null as { type: "ok" | "err"; text: string } | null,
  });

  useEffect(() => {
    fetch("/api/me")
      .then((r) => r.json())
      .then((data) => {
        setMe(data);
        setSecretState((s) => ({ ...s, question: data.secret_question }));
      });
  }, []);

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordState((s) => ({ ...s, msg: null }));
    const res = await fetch("/api/account", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "password",
        currentPassword: passwordState.current,
        newPassword: passwordState.next,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setPasswordState((s) => ({
        ...s,
        msg: { type: "err", text: data.error },
      }));
    } else {
      setPasswordState({
        current: "",
        next: "",
        msg: { type: "ok", text: "Password updated." },
      });
    }
  };

  const changeSecret = async (e: React.FormEvent) => {
    e.preventDefault();
    setSecretState((s) => ({ ...s, msg: null }));
    const res = await fetch("/api/account", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "secret",
        currentPassword: secretState.current,
        secretQuestion: secretState.question,
        secretAnswer: secretState.answer,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setSecretState((s) => ({
        ...s,
        msg: { type: "err", text: data.error },
      }));
    } else {
      setSecretState((s) => ({
        ...s,
        current: "",
        answer: "",
        msg: { type: "ok", text: "Secret question updated." },
      }));
    }
  };

  if (!me) return null;

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold mb-1 text-neutral-900 dark:text-white">
        Account
      </h1>
      <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-8">
        Signed in as <span className="font-medium">{me.email}</span>
      </p>

      <section className="mb-12">
        <h2 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 mb-4">
          Change password
        </h2>
        <form onSubmit={changePassword} className="space-y-3 max-w-md">
          <input
            type="password"
            placeholder="Current password"
            required
            value={passwordState.current}
            onChange={(e) =>
              setPasswordState((s) => ({ ...s, current: e.target.value }))
            }
            className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white"
          />
          <input
            type="password"
            placeholder="New password (min 8 chars)"
            required
            minLength={8}
            value={passwordState.next}
            onChange={(e) =>
              setPasswordState((s) => ({ ...s, next: e.target.value }))
            }
            className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white"
          />
          {passwordState.msg && (
            <p
              className={`text-sm ${
                passwordState.msg.type === "ok"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {passwordState.msg.text}
            </p>
          )}
          <button
            type="submit"
            className="rounded-md bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-medium px-4 py-2 text-sm hover:opacity-90 transition-opacity"
          >
            Update password
          </button>
        </form>
      </section>

      <section>
        <h2 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 mb-4">
          Secret question
        </h2>
        <form onSubmit={changeSecret} className="space-y-3 max-w-md">
          <input
            type="password"
            placeholder="Current password"
            required
            value={secretState.current}
            onChange={(e) =>
              setSecretState((s) => ({ ...s, current: e.target.value }))
            }
            className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white"
          />
          <select
            value={secretState.question}
            onChange={(e) =>
              setSecretState((s) => ({ ...s, question: e.target.value }))
            }
            className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white"
          >
            {SECRET_QUESTIONS.map((q) => (
              <option key={q} value={q}>
                {q}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="New answer"
            required
            value={secretState.answer}
            onChange={(e) =>
              setSecretState((s) => ({ ...s, answer: e.target.value }))
            }
            className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white"
          />
          {secretState.msg && (
            <p
              className={`text-sm ${
                secretState.msg.type === "ok"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {secretState.msg.text}
            </p>
          )}
          <button
            type="submit"
            className="rounded-md bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-medium px-4 py-2 text-sm hover:opacity-90 transition-opacity"
          >
            Update secret question
          </button>
        </form>
      </section>
    </div>
  );
}
