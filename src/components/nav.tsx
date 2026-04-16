"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useUser } from "@/lib/use-user";
import ThemeProvider from "./theme-provider";

const MAIN = "https://get.yourorbit.team";

export default function Nav() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);

  const isAuthPage = ["/login", "/signup", "/forgot"].includes(pathname);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  const linkCls = "text-[0.85rem] font-medium text-neutral-400 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-neutral-900 dark:focus-visible:ring-white focus-visible:outline-none rounded";
  const activeCls = "text-[0.85rem] font-semibold text-neutral-900 dark:text-white";
  const mobileCls = "block text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors py-1";
  const mobileActiveCls = "block text-sm font-semibold text-neutral-900 dark:text-white py-1";

  return (
    <>
      <ThemeProvider pref={user?.theme} />
      {!isAuthPage && (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-neutral-200/60 dark:border-white/[0.06] bg-white/70 dark:bg-[#0A0A0B]/65 backdrop-blur-xl">
          <div className="max-w-[1080px] mx-auto px-6 flex items-center h-12">
            <a href={MAIN} className="flex items-center gap-2 text-neutral-900 dark:text-white font-bold text-[0.95rem] tracking-tight mr-auto">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/orbit-icon-dark.png" alt="Orbit" width={22} height={22} className="dark:hidden" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/orbit-icon-white.png" alt="Orbit" width={22} height={22} className="hidden dark:block" />
              Orbit
            </a>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-6">
              <a href={MAIN} className={linkCls}>Home</a>
              <a href={`${MAIN}/apps`} className={linkCls}>Apps</a>
              <Link href="/" className={pathname === "/" ? activeCls : linkCls}>Namer</Link>
              {user && (
                <>
                  <Link href="/settings" className={pathname === "/settings" ? activeCls : linkCls}>Settings</Link>
                  <Link href="/account" className={pathname === "/account" ? activeCls : linkCls}>Account</Link>
                  {user.is_admin && <Link href="/admin" className={pathname === "/admin" ? activeCls : linkCls}>Admin</Link>}
                  <button onClick={logout} className={linkCls}>Log out</button>
                </>
              )}
              <a href={`${MAIN}/donate`} className={linkCls}>Donate</a>
              <a href={`${MAIN}/contact`} className={linkCls}>Contact</a>
              <a href={`${MAIN}/download`} className="text-[0.82rem] font-semibold bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-3.5 py-1.5 rounded-full hover:opacity-85 transition-opacity focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-neutral-900 dark:focus-visible:ring-white focus-visible:outline-none">
                Get Orbit
              </a>
            </div>

            {/* Mobile toggle */}
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-1.5 -mr-1.5" aria-label="Toggle menu" aria-expanded={menuOpen}>
              <div className="w-5 flex flex-col gap-[5px]">
                <span className={`block h-[1.5px] bg-neutral-900 dark:bg-white rounded transition-transform ${menuOpen ? "rotate-45 translate-y-[3.25px]" : ""}`} />
                <span className={`block h-[1.5px] bg-neutral-900 dark:bg-white rounded transition-opacity ${menuOpen ? "opacity-0" : ""}`} />
                <span className={`block h-[1.5px] bg-neutral-900 dark:bg-white rounded transition-transform ${menuOpen ? "-rotate-45 -translate-y-[3.25px]" : ""}`} />
              </div>
            </button>
          </div>

          {/* Mobile menu */}
          {menuOpen && (
            <div className="md:hidden border-t border-neutral-200/60 dark:border-white/[0.06] bg-white/95 dark:bg-[#0A0A0B]/95 backdrop-blur-xl px-6 py-4 space-y-3">
              <a href={MAIN} className={mobileCls} onClick={() => setMenuOpen(false)}>Home</a>
              <a href={`${MAIN}/apps`} className={mobileCls} onClick={() => setMenuOpen(false)}>Apps</a>
              <Link href="/" className={pathname === "/" ? mobileActiveCls : mobileCls} onClick={() => setMenuOpen(false)}>Namer</Link>
              {user && (
                <>
                  <Link href="/settings" className={pathname === "/settings" ? mobileActiveCls : mobileCls} onClick={() => setMenuOpen(false)}>Settings</Link>
                  <Link href="/account" className={pathname === "/account" ? mobileActiveCls : mobileCls} onClick={() => setMenuOpen(false)}>Account</Link>
                  <button onClick={() => { logout(); setMenuOpen(false); }} className={mobileCls}>Log out</button>
                </>
              )}
              <a href={`${MAIN}/donate`} className={mobileCls} onClick={() => setMenuOpen(false)}>Donate</a>
              <a href={`${MAIN}/contact`} className={mobileCls} onClick={() => setMenuOpen(false)}>Contact</a>
              <a href={`${MAIN}/download`} onClick={() => setMenuOpen(false)} className="block text-center text-sm font-semibold bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-4 py-2.5 rounded-full hover:opacity-85 transition-opacity">
                Get Orbit
              </a>
            </div>
          )}
        </nav>
      )}
    </>
  );
}
