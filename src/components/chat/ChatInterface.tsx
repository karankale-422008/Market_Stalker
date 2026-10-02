"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles, ExternalLink, ShieldCheck, RefreshCw, MessageSquare } from "lucide-react";
import { SourceCitation } from "@/types";
import { formatRelativeTime } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
  citations?: SourceCitation[];
}

const SAMPLE_PROMPTS = [
  "What are the major market-moving events today?",
  "What is the latest news affecting Reliance and TCS?",
  "Show me important Banking & RBI monetary policy developments.",
  "Which sectors have the highest bullish sentiment today?",
  "What companies were mentioned most in the news?",
  "What did Economic Times and Moneycontrol report on IT earnings?",
];

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Welcome to **Market Stalker AI Chat** — your institutional intelligence terminal for Indian financial news. Ask any question about today's market-moving events, sector developments, or corporate updates. Every answer is grounded in our indexed database across 10 leading Indian publishers.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: Message = { role: "user", content: textToSend };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate answer");

      setMessages([
        ...updatedMessages,
        {
          role: "assistant",
          content: data.answer,
          citations: data.citations || [],
        },
      ]);
    } catch (err: any) {
      setMessages([
        ...updatedMessages,
        {
          role: "assistant",
          content: `⚠️ Failed to retrieve AI market intelligence: ${err.message}. Please check that your Supabase connection is active.`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8.5rem)] bg-card/60 backdrop-blur-md border border-border/70 rounded-2xl overflow-hidden shadow-xl">
      {/* Chat Header */}
      <div className="px-6 py-4 border-b border-border/60 bg-black/40 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              Market Stalker Financial RAG
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                10 Sources Connected
              </span>
            </h2>
            <p className="text-xs text-muted-foreground">
              Synthesized exclusively from verified Indian news publishers. No hallucinated prices.
            </p>
          </div>
        </div>

        <button
          onClick={() =>
            setMessages([
              {
                role: "assistant",
                content:
                  "Session cleared. What Indian market news or sector would you like to analyze next?",
              },
            ])
          }
          className="text-xs text-muted-foreground hover:text-white px-2.5 py-1 rounded-lg bg-secondary/60 hover:bg-secondary border border-border/50 transition-colors"
        >
          Clear Chat
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex gap-3.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.role === "assistant" && (
              <div className="w-8 h-8 rounded-lg bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                <Bot className="w-4 h-4 text-emerald-400" />
              </div>
            )}

            <div
              className={`max-w-2xl rounded-xl p-4 text-sm leading-relaxed space-y-3 ${
                msg.role === "user"
                  ? "bg-emerald-600 text-black font-medium shadow-md"
                  : "bg-black/50 border border-border/70 text-slate-200 shadow-sm"
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.content}</div>

              {/* Source Citations for Assistant Responses */}
              {msg.citations && msg.citations.length > 0 && (
                <div className="mt-4 pt-3 border-t border-border/60 space-y-2">
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400 font-mono uppercase tracking-wider">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Verified Source Citations ({msg.citations.length})</span>
                  </div>

                  <div className="grid grid-cols-1 gap-2 mt-2">
                    {msg.citations.slice(0, 4).map((cite, cIdx) => (
                      <div
                        key={cIdx}
                        className="p-2.5 rounded-lg bg-card/90 border border-border/60 hover:border-emerald-500/40 transition-colors flex items-start justify-between gap-3 text-xs"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-[10px] font-mono text-emerald-400">
                            <span className="font-bold">{cite.publisher}</span>
                            <span>•</span>
                            <span className="text-muted-foreground">
                              {formatRelativeTime(cite.published_at)}
                            </span>
                          </div>
                          <p className="font-medium text-slate-100 line-clamp-1">{cite.headline}</p>
                          {cite.snippet && (
                            <p className="text-[11px] text-muted-foreground line-clamp-1">
                              {cite.snippet}
                            </p>
                          )}
                        </div>

                        <a
                          href={cite.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Open original article"
                          className="shrink-0 p-1.5 rounded-md bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-white border border-border/50 transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {msg.role === "user" && (
              <div className="w-8 h-8 rounded-lg bg-secondary border border-border/80 flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3.5 justify-start">
            <div className="w-8 h-8 rounded-lg bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center shrink-0 animate-pulse">
              <Sparkles className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="p-4 rounded-xl bg-black/40 border border-border/60 text-xs text-muted-foreground flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
              <span>Querying Supabase news database and synthesizing AI intelligence...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Query Chips */}
      {messages.length <= 2 && (
        <div className="px-6 py-2 border-t border-border/40 bg-black/20 flex items-center gap-2 overflow-x-auto">
          <span className="text-[11px] font-mono text-muted-foreground shrink-0 uppercase">Suggested:</span>
          {SAMPLE_PROMPTS.slice(0, 3).map((prompt, pIdx) => (
            <button
              key={pIdx}
              onClick={() => handleSend(prompt)}
              className="text-xs px-2.5 py-1 rounded-full bg-secondary/80 hover:bg-secondary text-slate-300 hover:text-white border border-border/50 shrink-0 transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Chat Input Bar */}
      <div className="p-4 border-t border-border/60 bg-black/40">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2 relative"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything about Indian markets, company earnings, sector impacts..."
            disabled={isLoading}
            className="flex-1 px-4 py-3 bg-black/60 border border-border/80 rounded-xl text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/60 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="px-4 py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold rounded-xl disabled:opacity-40 transition-all flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline text-xs">Send</span>
          </button>
        </form>
      </div>
    </div>
  );
}
