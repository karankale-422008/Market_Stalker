"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  TrendingUp,
  MessageSquare,
  BarChart3,
  Newspaper,
  Sliders,
  Activity,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  {
    name: "Dashboard",
    href: "/",
    icon: TrendingUp,
    badge: null,
  },
  {
    name: "AI Chat",
    href: "/chat",
    icon: MessageSquare,
    badge: "AI RAG",
  },
  {
    name: "Trade Analysis",
    href: "/trades",
    icon: BarChart3,
    badge: null,
  },
  {
    name: "News Sources",
    href: "/news-sources",
    icon: Newspaper,
    badge: "10 Feeds",
  },
  {
    name: "Ingestion & Audit",
    href: "/admin",
    icon: Activity,
    badge: null,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Sliders,
    badge: null,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-border/60 bg-card/70 backdrop-blur-xl flex flex-col justify-between h-screen sticky top-0 z-40 hidden md:flex">
      {/* Brand Header */}
      <div>
        <div className="h-16 flex items-center px-6 border-b border-border/50 gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Zap className="w-5 h-5 text-black fill-black" />
          </div>
          <div>
            <span className="font-bold text-lg tracking-tight text-white flex items-center gap-1.5">
              Market<span className="text-emerald-400">Stalker</span>
            </span>
            <span className="text-[10px] text-muted-foreground uppercase font-mono tracking-wider block -mt-1">
              Indian Market AI Intel
            </span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4 space-y-1.5">
          <div className="px-3 py-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider font-mono">
            Intelligence Suite
          </div>
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname?.startsWith(item.href);

            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
                  isActive
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-sm"
                    : "text-muted-foreground hover:text-white hover:bg-white/5"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={cn(
                      "w-4 h-4 transition-colors",
                      isActive
                        ? "text-emerald-400"
                        : "text-muted-foreground group-hover:text-white"
                    )}
                  />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span
                    className={cn(
                      "text-[10px] px-2 py-0.5 rounded-full font-mono font-medium",
                      isActive
                        ? "bg-emerald-500/20 text-emerald-300"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Compliance & Status Footer */}
      <div className="p-4 border-t border-border/50">
        <div className="p-3 rounded-lg bg-black/40 border border-border/50 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Attribution First Policy</span>
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            AI analysis of official public feeds. Zero full article copying. Original publishers credited.
          </p>
        </div>
      </div>
    </aside>
  );
}
