"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cx } from "@/lib/utils";

const LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/sectors", label: "Sectors" },
  { href: "/news", label: "News" },
  { href: "/watchlists", label: "Watchlists" },
  { href: "/history", label: "History" },
  { href: "/assistant", label: "Assistant" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-ink-600 bg-ink-900/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-2 shrink-0 focus-ring rounded">
          <span className="h-2.5 w-2.5 rounded-full bg-signal shadow-[0_0_12px_rgba(245,166,35,0.8)]" />
          <span className="font-display font-semibold text-lg tracking-tight text-paper-100">
            Market Catalyst <span className="text-signal">AI</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 text-sm">
          {LINKS.map((link) => {
            const active = pathname === link.href || (link.href !== "/" && pathname?.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cx(
                  "px-3 py-2 rounded-md font-medium transition-colors focus-ring",
                  active ? "text-signal bg-signal-dim/30" : "text-paper-500 hover:text-paper-100 hover:bg-ink-800"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-2 text-xs text-paper-500 font-mono">
            <span className="h-1.5 w-1.5 rounded-full bg-rise animate-pulse-slow" />
            LIVE FEED
          </div>
        </div>
      </div>

      <nav className="md:hidden flex items-center gap-1 overflow-x-auto px-4 pb-2 text-sm">
        {LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="px-3 py-1.5 rounded-md text-paper-300 whitespace-nowrap hover:bg-ink-800 focus-ring"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
