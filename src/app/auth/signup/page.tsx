"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Zap, Mail, Lock, ArrowRight, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;
      setSuccessMsg("Account created! Check your email or sign in immediately.");
      setTimeout(() => {
        router.push("/auth/login");
      }, 1500);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to create account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md p-8 rounded-2xl bg-card/80 backdrop-blur-xl border border-border/80 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 mx-auto">
            <Zap className="w-5 h-5 text-black fill-black" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Create an Account</h1>
          <p className="text-xs text-muted-foreground">
            Get personalized market alerts and AI intelligence sessions.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase text-muted-foreground mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="trader@marketstalker.ai"
                className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-border/80 rounded-xl text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-emerald-500/60"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-muted-foreground mb-1.5">
              Password (min 6 characters)
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-border/80 rounded-xl text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-emerald-500/60"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <span>{loading ? "Creating..." : "Sign Up"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-border/50 text-center text-xs text-muted-foreground">
          <p>
            Already have an account?{" "}
            <Link href="/auth/login" className="text-emerald-400 hover:underline font-semibold">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
