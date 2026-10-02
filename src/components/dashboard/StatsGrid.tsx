import React from "react";
import { Newspaper, Sparkles, Building, Layers, Radio, Clock } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";

interface StatsGridProps {
  articlesCount: number;
  criticalEventsCount: number;
  companiesCount: number;
  sectorsCount: number;
  activeSourcesCount: number;
  lastIngestionTime?: string;
}

export function StatsGrid({
  articlesCount = 0,
  criticalEventsCount = 0,
  companiesCount = 0,
  sectorsCount = 0,
  activeSourcesCount = 10,
  lastIngestionTime,
}: StatsGridProps) {
  const stats = [
    {
      title: "Articles Analyzed",
      value: articlesCount.toLocaleString(),
      subtitle: "Across 10 Indian publishers",
      icon: Newspaper,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
    },
    {
      title: "Market-Moving Events",
      value: criticalEventsCount.toLocaleString(),
      subtitle: "High impact scores (≥75)",
      icon: Sparkles,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
    },
    {
      title: "Companies Monitored",
      value: companiesCount > 0 ? companiesCount.toString() : "20+",
      subtitle: "NSE / BSE tickers tagged",
      icon: Building,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
    },
    {
      title: "Active Publishers",
      value: `${activeSourcesCount} / 10`,
      subtitle: "Verified RSS feeds online",
      icon: Radio,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div
            key={idx}
            className={`p-5 rounded-xl bg-card/60 backdrop-blur-md border ${stat.border} shadow-sm flex items-center justify-between`}
          >
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase font-mono tracking-wider">
                {stat.title}
              </p>
              <h4 className="text-2xl font-bold text-white mt-1 tracking-tight">
                {stat.value}
              </h4>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.subtitle}
              </p>
            </div>
            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
              <Icon className="w-5 h-5" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
