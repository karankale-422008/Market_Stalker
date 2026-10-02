"use client";

import React from "react";
import { Layers, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface SectorStat {
  name: string;
  count: number;
  sentiment: "Bullish" | "Bearish" | "Neutral";
}

interface SectorHeatmapProps {
  sectors?: SectorStat[];
}

const DEFAULT_SECTORS: SectorStat[] = [
  { name: "Banking & Financials", count: 18, sentiment: "Bullish" },
  { name: "Information Technology", count: 14, sentiment: "Neutral" },
  { name: "Oil, Gas & Energy", count: 11, sentiment: "Bearish" },
  { name: "Automobiles", count: 9, sentiment: "Bullish" },
  { name: "Pharmaceuticals", count: 7, sentiment: "Neutral" },
  { name: "FMCG & Consumer", count: 6, sentiment: "Bullish" },
  { name: "Metals & Mining", count: 5, sentiment: "Bearish" },
  { name: "Telecommunications", count: 4, sentiment: "Neutral" },
];

export function SectorHeatmap({ sectors = DEFAULT_SECTORS }: SectorHeatmapProps) {
  return (
    <div className="bg-card/60 backdrop-blur-md border border-border/70 rounded-xl p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-semibold text-white">Sector Activity & AI Sentiment</h3>
        </div>
        <span className="text-[11px] font-mono text-muted-foreground uppercase">Real-Time News Flows</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {sectors.map((s, idx) => {
          let badgeColor = "text-slate-400 bg-slate-500/10 border-slate-500/20";
          let Icon = Minus;

          if (s.sentiment === "Bullish") {
            badgeColor = "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
            Icon = TrendingUp;
          } else if (s.sentiment === "Bearish") {
            badgeColor = "text-rose-400 bg-rose-500/10 border-rose-500/20";
            Icon = TrendingDown;
          }

          return (
            <div
              key={idx}
              className="p-3 rounded-lg bg-black/30 border border-border/50 hover:border-border transition-all flex flex-col justify-between space-y-2"
            >
              <div className="flex items-center justify-between gap-1">
                <span className="text-xs font-medium text-slate-200 truncate">{s.name}</span>
                <Icon className="w-3.5 h-3.5 shrink-0" />
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-muted-foreground">{s.count} mentions</span>
                <span className={`px-1.5 py-0.5 rounded border text-[10px] ${badgeColor}`}>
                  {s.sentiment}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
