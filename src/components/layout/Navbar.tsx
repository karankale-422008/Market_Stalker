"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Search, RefreshCw, User, Bell, ExternalLink, Sparkles } from "lucide-react";
import { format } from "date-fns";

export function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{ articles: any[]; sources: any[] }>({
    articles: [],
    sources: [],
  });
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isIngesting, setIsIngesting] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>("");
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrentTime(format(new Date(), "hh:mm:ss a (IST)"));
    const interval = setInterval(() => {
      setCurrentTime(format(new Date(), "hh:mm:ss a (IST)"));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Handle Search Input
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSearchResults({ articles: [], sources: [] });
      setShowDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
        const data = await res.json();
        setSearchResults({
          articles: data.articles || [],
          sources: data.sources || [],
        });
        setShowDropdown(true);
      } catch (err) {
        console.error("Search failed:", err);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleManualIngest = async () => {
    setIsIngesting(true);
    try {
      const res = await fetch("/api/ingest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      alert(`Ingestion Completed!\nAdded: ${data.totalAdded || 0} articles across ${data.totalSources || 10} sources.`);
      window.location.reload();
    } catch (err: any) {
      alert(`Ingestion failed: ${err.message}`);
    } finally {
      setIsIngesting(false);
    }
  };

  return (
    <header className="h-16 border-b border-border/60 bg-card/60 backdrop-blur-xl px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Global Search Bar */}
      <div className="relative w-full max-w-lg" ref={searchRef}>
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search Reliance, Banking, RBI, IPO, Sectors, Sources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => searchQuery.length >= 2 && setShowDropdown(true)}
            className="w-full pl-10 pr-4 py-2 bg-black/40 border border-border/80 rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
          />
          {isSearching && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <RefreshCw className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
            </div>
          )}
        </div>

        {/* Live Search Dropdown */}
        {showDropdown && (searchResults.articles.length > 0 || searchResults.sources.length > 0) && (
          <div className="absolute left-0 right-0 top-full mt-2 bg-card/95 backdrop-blur-xl border border-border/80 rounded-xl shadow-2xl overflow-hidden z-50 max-h-96 overflow-y-auto">
            {searchResults.sources.length > 0 && (
              <div className="p-3 border-b border-border/50">
                <span className="text-[11px] font-mono text-muted-foreground uppercase font-semibold">Publishers</span>
                <div className="mt-1 space-y-1">
                  {searchResults.sources.map((s) => (
                    <Link
                      key={s.id}
                      href={`/news-sources/${s.slug}`}
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 text-sm"
                    >
                      <span className="font-medium text-white">{s.name}</span>
                      <span className="text-xs text-muted-foreground">View Publisher</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {searchResults.articles.length > 0 && (
              <div className="p-3">
                <span className="text-[11px] font-mono text-muted-foreground uppercase font-semibold">Matched Articles</span>
                <div className="mt-1 space-y-2">
                  {searchResults.articles.map((a) => (
                    <Link
                      key={a.id}
                      href={`/articles/${a.id}`}
                      onClick={() => setShowDropdown(false)}
                      className="block p-2.5 rounded-lg hover:bg-white/5 transition-colors border border-transparent hover:border-border/50"
                    >
                      <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-mono">
                        <span>{a.source?.name}</span>
                        <span>•</span>
                        <span>{a.analysis?.sentiment || "Neutral"}</span>
                      </div>
                      <div className="text-sm font-medium text-white line-clamp-1 mt-0.5">{a.title}</div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Controls: Market Status, Trigger, Auth */}
      <div className="flex items-center gap-4">
        {/* Market Status Ticker */}
        <div className="hidden lg:flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>NSE/BSE LIVE INTEL</span>
          <span className="text-muted-foreground">|</span>
          <span className="text-slate-300">{currentTime || "IST"}</span>
        </div>

        {/* Sync / Refresh News Feeds */}
        <button
          onClick={handleManualIngest}
          disabled={isIngesting}
          title="Run pipeline to fetch and analyze latest RSS feeds from 10 Indian publishers"
          className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary hover:bg-secondary/80 border border-border/60 text-slate-200 text-xs font-medium rounded-lg transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${isIngesting ? "animate-spin" : ""}`} />
          <span>{isIngesting ? "Ingesting..." : "Sync Feeds"}</span>
        </button>

        {/* AI Quick Chat Shortcut */}
        <Link
          href="/chat"
          className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-500 text-black font-semibold text-xs rounded-lg shadow-sm shadow-emerald-500/20 hover:brightness-110 transition-all"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Ask AI</span>
        </Link>

        {/* Account */}
        <Link
          href="/auth/login"
          className="w-8 h-8 rounded-lg bg-secondary/80 border border-border/80 flex items-center justify-center text-muted-foreground hover:text-white transition-colors"
        >
          <User className="w-4 h-4" />
        </Link>
      </div>
    </header>
  );
}
