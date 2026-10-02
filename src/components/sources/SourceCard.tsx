import React from "react";
import Link from "next/link";
import { ExternalLink, Radio, CheckCircle2, AlertTriangle, ShieldAlert, ArrowUpRight } from "lucide-react";
import { Source } from "@/types";
import { formatRelativeTime } from "@/lib/utils";

interface SourceCardProps {
  source: Source;
}

export function SourceCard({ source }: SourceCardProps) {
  const isLicenseRequired = source.source_type === "license_required" || source.status === "license_required";
  const isError = source.status === "error";

  return (
    <div className="p-5 rounded-xl bg-card/60 backdrop-blur-md border border-border/70 hover:border-emerald-500/40 transition-all flex flex-col justify-between group shadow-sm">
      <div>
        {/* Header: Name, Status & Favicon */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-black/40 border border-border/70 flex items-center justify-center overflow-hidden shrink-0">
              {source.logo_url ? (
                <img
                  src={source.logo_url}
                  alt={source.name}
                  className="w-6 h-6 object-contain"
                  onError={(e) => {
                    // Fallback to initial icon if image fails
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
              ) : (
                <Radio className="w-5 h-5 text-emerald-400" />
              )}
            </div>
            <div>
              <h4 className="font-semibold text-white group-hover:text-emerald-400 transition-colors text-base">
                {source.name}
              </h4>
              <a
                href={source.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-muted-foreground hover:text-slate-300 flex items-center gap-1 mt-0.5"
              >
                <span>{source.website_url.replace("https://", "").replace("www.", "")}</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
          </div>

          {/* Status Badge */}
          {isLicenseRequired ? (
            <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 font-mono">
              <ShieldAlert className="w-3 h-3" />
              License Req.
            </span>
          ) : isError ? (
            <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30 font-mono">
              <AlertTriangle className="w-3 h-3" />
              Error
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono">
              <CheckCircle2 className="w-3 h-3" />
              Active Feed
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-xs text-slate-300 leading-relaxed line-clamp-2 mt-2">
          {source.description || "Official Indian financial news and market analysis provider."}
        </p>

        {/* Meta Stats */}
        <div className="mt-4 pt-3 border-t border-border/50 grid grid-cols-2 gap-2 text-xs font-mono">
          <div>
            <span className="text-muted-foreground block text-[10px] uppercase">Articles Indexed</span>
            <span className="text-white font-semibold">
              {source.article_count !== undefined ? source.article_count.toLocaleString() : "Syncing..."}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground block text-[10px] uppercase">Last Feed Fetch</span>
            <span className="text-slate-300">
              {source.last_successful_fetch ? formatRelativeTime(source.last_successful_fetch) : "Scheduled"}
            </span>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="mt-4 pt-3 border-t border-border/50">
        <Link
          href={`/news-sources/${source.slug}`}
          className="w-full py-2 px-3 rounded-lg bg-secondary hover:bg-secondary/80 border border-border/60 text-xs font-medium text-slate-200 hover:text-white flex items-center justify-center gap-1.5 transition-colors group-hover:border-emerald-500/30"
        >
          <span>Explore Publisher News</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
        </Link>
      </div>
    </div>
  );
}
