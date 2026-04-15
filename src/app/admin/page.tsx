"use client";

import { useEffect, useState } from "react";
import BarChart from "@/components/bar-chart";

interface AdminUser {
  id: string;
  email: string;
  created_at: string;
  last_login_at: string | null;
  login_count: number;
  logins_30d: number;
}

interface AdminData {
  summary: {
    totalUsers: number;
    activeToday: number;
    active30d: number;
  };
  users: AdminUser[];
  dau: { bucket: string; users: number }[];
  mau: { bucket: string; users: number }[];
}

function formatRelative(iso: string | null): string {
  if (!iso) return "Never";
  const now = Date.now();
  const t = new Date(iso).getTime();
  const diff = now - t;
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toISOString().slice(0, 10);
}

export default function AdminPage() {
  const [data, setData] = useState<AdminData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin")
      .then(async (r) => {
        if (!r.ok) {
          const err = await r.json();
          throw new Error(err.error || "Request failed");
        }
        return r.json();
      })
      .then(setData)
      .catch((e) => setError(e.message));
  }, []);

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-bold text-red-600">Access denied</h1>
        <p className="text-neutral-500 mt-2">{error}</p>
      </div>
    );
  }

  if (!data) return null;

  const { summary, users, dau, mau } = data;

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white mb-1">
          Admin
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400">
          Users, activity, and engagement.
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        <SummaryCard label="Total users" value={summary.totalUsers} />
        <SummaryCard label="Active today" value={summary.activeToday} />
        <SummaryCard label="Active last 30 days" value={summary.active30d} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-10">
        <ChartCard title="Daily active users" subtitle="Last 30 days">
          <BarChart
            data={dau}
            formatLabel={(b) => b.slice(5)} // MM-DD
          />
        </ChartCard>
        <ChartCard title="Monthly active users" subtitle="Last 12 months">
          <BarChart data={mau} formatLabel={(b) => b} />
        </ChartCard>
      </div>

      {/* Users table */}
      <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden">
        <div className="p-6 border-b border-neutral-200 dark:border-neutral-800">
          <h2 className="text-sm font-bold text-neutral-900 dark:text-white">
            Users ({users.length})
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400 border-b border-neutral-200 dark:border-neutral-800">
              <tr>
                <th className="text-left px-6 py-3 font-semibold">Email</th>
                <th className="text-left px-6 py-3 font-semibold">Joined</th>
                <th className="text-left px-6 py-3 font-semibold">Last login</th>
                <th className="text-right px-6 py-3 font-semibold">
                  Logins (30d)
                </th>
                <th className="text-right px-6 py-3 font-semibold">
                  Total logins
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {users.map((u) => (
                <tr
                  key={u.id}
                  className="hover:bg-neutral-50 dark:hover:bg-neutral-950"
                >
                  <td className="px-6 py-3 font-medium text-neutral-900 dark:text-white">
                    {u.email}
                  </td>
                  <td className="px-6 py-3 text-neutral-500 dark:text-neutral-400 font-mono text-xs">
                    {u.created_at.slice(0, 10)}
                  </td>
                  <td className="px-6 py-3 text-neutral-500 dark:text-neutral-400">
                    {formatRelative(u.last_login_at)}
                  </td>
                  <td className="px-6 py-3 text-right font-mono text-xs text-neutral-700 dark:text-neutral-300">
                    {u.logins_30d}
                  </td>
                  <td className="px-6 py-3 text-right font-mono text-xs text-neutral-700 dark:text-neutral-300">
                    {u.login_count}
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-10 text-center text-neutral-400 italic"
                  >
                    No users yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5">
      <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1">
        {label}
      </p>
      <p className="text-3xl font-extrabold tabular-nums text-neutral-900 dark:text-white">
        {value.toLocaleString()}
      </p>
    </div>
  );
}

function ChartCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5">
      <div className="mb-3">
        <p className="text-sm font-bold text-neutral-900 dark:text-white">
          {title}
        </p>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          {subtitle}
        </p>
      </div>
      {children}
    </div>
  );
}
