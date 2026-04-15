"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Generator" },
  { href: "/settings", label: "Settings" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-neutral-200">
      <div className="max-w-2xl mx-auto px-6 flex items-center h-12 gap-6">
        <span className="text-sm font-bold tracking-tight text-neutral-900 mr-auto">
          Braze Namer
        </span>
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={`text-sm transition-colors ${
              pathname === l.href
                ? "text-neutral-900 font-medium"
                : "text-neutral-500 hover:text-neutral-800"
            }`}
          >
            {l.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
