"use client";

import Link from "next/link";

export default function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-neutral-50 dark:bg-neutral-950">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/orbit-icon-dark.png" alt="Orbit" width={28} height={28} className="dark:hidden" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/orbit-icon-white.png" alt="Orbit" width={28} height={28} className="hidden dark:block" />
          <span className="text-2xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
            Braze Namer
          </span>
        </Link>
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-8 shadow-sm">
          <h1 className="text-xl font-bold text-neutral-900 dark:text-white mb-1">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6">
              {subtitle}
            </p>
          )}
          {children}
        </div>
        {footer && (
          <div className="text-center text-sm text-neutral-500 dark:text-neutral-400 mt-6">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
