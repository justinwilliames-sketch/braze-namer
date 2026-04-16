"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "@/lib/use-user";
import ThemeProvider from "./theme-provider";

const MAIN_SITE = "https://get.yourorbit.team";

export default function Nav() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useUser();

  const isAuthPage = ["/login", "/signup", "/forgot"].includes(pathname);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  const linkCls =
    "text-[0.85rem] font-medium text-neutral-400 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors";
  const activeCls =
    "text-[0.85rem] font-semibold text-neutral-900 dark:text-white";

  return (
    <>
      <ThemeProvider pref={user?.theme} />
      {!isAuthPage && (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-neutral-200/60 dark:border-white/[0.06] bg-white/70 dark:bg-[#0A0A0B]/65 backdrop-blur-xl">
          <div className="max-w-[1080px] mx-auto px-6 flex items-center h-12 gap-6">
            {/* Brand — links to main Orbit site */}
            <a
              href={MAIN_SITE}
              className="flex items-center gap-2 text-neutral-900 dark:text-white font-bold text-[0.95rem] tracking-tight mr-auto"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/orbit-icon-dark.png" alt="Orbit" width={22} height={22} className="dark:hidden" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/orbit-icon-white.png" alt="Orbit" width={22} height={22} className="hidden dark:block" />
              Orbit
            </a>

            {/* Unified site links */}
            <a href={MAIN_SITE} className={linkCls}>Home</a>
            <a href={`${MAIN_SITE}/apps`} className={linkCls}>Apps</a>
            <Link href="/" className={pathname === "/" ? activeCls : linkCls}>
              Namer
            </Link>

            {/* Authenticated links */}
            {user && (
              <>
                <Link href="/settings" className={pathname === "/settings" ? activeCls : linkCls}>
                  Settings
                </Link>
                <Link href="/account" className={pathname === "/account" ? activeCls : linkCls}>
                  Account
                </Link>
                {user.is_admin && (
                  <Link href="/admin" className={pathname === "/admin" ? activeCls : linkCls}>
                    Admin
                  </Link>
                )}
                <button onClick={logout} className={linkCls}>
                  Log out
                </button>
              </>
            )}

            <a href={`${MAIN_SITE}/donate`} className={linkCls}>Donate</a>
            <a href={`${MAIN_SITE}/contact`} className={linkCls}>Contact</a>

            <a
              href={`${MAIN_SITE}/download`}
              className="text-[0.82rem] font-semibold bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-3.5 py-1.5 rounded-full hover:opacity-85 transition-opacity"
            >
              Get Orbit
            </a>
          </div>
        </nav>
      )}
    </>
  );
}
