"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "@/lib/use-user";
import ThemeProvider from "./theme-provider";

const links = [
  { href: "/", label: "Generator" },
  { href: "/settings", label: "Settings" },
  { href: "/account", label: "Account" },
];

export default function Nav() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useUser();

  // Hide nav on auth pages
  const isAuthPage = ["/login", "/signup", "/forgot"].includes(pathname);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  return (
    <>
      <ThemeProvider pref={user?.theme} />
      {!isAuthPage && (
        <nav className="border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
          <div className="max-w-3xl mx-auto px-6 flex items-center h-14 gap-6">
            <Link
              href="/"
              className="text-base font-extrabold tracking-tight text-neutral-900 dark:text-white mr-auto"
            >
              Brazenamer
              <span className="text-fuchsia-500">.</span>
            </Link>
            {user && (
              <>
                {links.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className={`text-sm transition-colors ${
                      pathname === l.href
                        ? "text-neutral-900 dark:text-white font-semibold"
                        : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                    }`}
                  >
                    {l.label}
                  </Link>
                ))}
                <button
                  onClick={logout}
                  className="text-sm text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors"
                >
                  Log out
                </button>
              </>
            )}
          </div>
        </nav>
      )}
    </>
  );
}
