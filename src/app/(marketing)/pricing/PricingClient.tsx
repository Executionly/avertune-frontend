"use client";

import Link from "next/link";
import { useState } from "react";
import { SectionHeading, Badge } from "@/components/ui";
import { CtaSection } from "@/components/marketing/CtaSection";
import { cn } from "@/lib/utils";
import { createCheckout } from "@/lib/api/auth";

interface ApiPlan {
  tier: string;
  display_name: string;
  tagline?: string;
  description?: string;
  best_for?: string;
  monthly_limit?: number;
  daily_typical?: number;
  char_limits?: number;
  most_popular?: boolean;
  prices?: {
    weekly?: number;
    yearly?: number;
    monthly?: number;
  };
  features?: string[];
  credits_per_month?: number;
  input_word_limit?: number;
  coach_note_enabled?: boolean;
  addon_eligible?: boolean;
  trial_days?: number | null;
  price_monthly?: number;
  price_yearly?: number;
  is_popular?: boolean;
  weekly_available?: boolean;
}

interface ComparisonData {
  headers: string[];
  rows: string[][];
}

interface PlansData {
  plans: ApiPlan[];
  comparison?: ComparisonData;
}

const TIER_ORDER = ["trial", "starter", "daily", "pro"];
const POPULAR_TIER = "daily";

function formatPrice(val: number): string {
  return val === 0 ? "$0" : `$${val}`;
}

function getTierCta(tier: string): string {
  if (tier === "trial") return "Start Free Trial";
  if (tier === "pro") return "Go Pro";
  return "Get Started";
}

function getTierVariant(tier: string, plan: ApiPlan): "free" | "popular" | "default" {
  if (tier === "trial") return "free";
  if (plan.most_popular || plan.is_popular || tier === POPULAR_TIER) return "popular";
  return "default";
}

interface Props {
  data: PlansData | null;
}

export function PricingClient({ data }: Props) {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const plans: ApiPlan[] = data?.plans
    ? [...data.plans].sort(
        (a, b) => TIER_ORDER.indexOf(a.tier) - TIER_ORDER.indexOf(b.tier),
      )
    : [];

  const comparison: ComparisonData | null = data?.comparison ?? null;

  const handleCheckout = async (tier: string) => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      window.location.href = `/auth/signin?redirect=/pricing`;
      return;
    }
    setLoadingPlan(tier);
    try {
      const { url } = await createCheckout(token, tier, billing);
      window.location.href = url;
    } catch (error) {
      console.error(error);
      alert("Unable to start checkout session.");
    } finally {
      setLoadingPlan(null);
    }
  };

  const getPrice = (plan: ApiPlan) => {
    // Support both new format (prices.monthly) and old format (price_monthly)
    const monthlyVal = plan.prices?.monthly ?? plan.price_monthly;
    const yearlyVal = plan.prices?.yearly ?? plan.price_yearly;

    const val = billing === "yearly" ? yearlyVal : monthlyVal;

    if (val === undefined || val === null) {
      return { display: "Custom", period: "" };
    }

    return {
      display: formatPrice(Number(val)),
      period: plan.tier === "trial" ? "free" : "month",
    };
  };

  const getWordLimit = (plan: ApiPlan) => {
    // Support both char_limits (from JSON) and input_word_limit (from old API)
    if (plan.char_limits) return plan.char_limits;
    if (plan.input_word_limit) return plan.input_word_limit;
    return null;
  };

  const getCredits = (plan: ApiPlan) => {
    if (plan.monthly_limit) return plan.monthly_limit;
    if (plan.credits_per_month) return plan.credits_per_month;
    return null;
  };

  return (
    <>
      <section className="py-20 px-6 sm:px-10 bg-cream-100">
        <div className="max-w-[1140px] mx-auto">
          <SectionHeading
            eyebrow="Pricing"
            title="Simple, transparent pricing"
            subtitle="Start free. Upgrade when you need more. Cancel any time."
            align="center"
            className="mb-10"
          />

          {/* Billing toggle */}
          <div className="flex items-center justify-center gap-3 mb-12">
            <button
              onClick={() => setBilling("monthly")}
              className={cn(
                "px-4 py-1.5 rounded-full text-[14px] font-medium transition-all",
                billing === "monthly"
                  ? "bg-navy-800 text-white"
                  : "text-navy-500 hover:text-navy-700",
              )}
            >
              Monthly
            </button>
            <button
              onClick={() => setBilling("yearly")}
              className={cn(
                "px-4 py-1.5 rounded-full text-[14px] font-medium transition-all flex items-center gap-1.5",
                billing === "yearly"
                  ? "bg-navy-800 text-white"
                  : "text-navy-500 hover:text-navy-700",
              )}
            >
              Yearly
              <span className="px-1.5 py-0.5 bg-green-100 text-green-700 text-[11px] font-semibold rounded-full">
                Save 20%
              </span>
            </button>
          </div>

          {/* Plan cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {plans.map((plan) => {
              const variant = getTierVariant(plan.tier, plan);
              const { display, period } = getPrice(plan);
              const isPopular = variant === "popular";
              const isFree = variant === "free";
              const wordLimit = getWordLimit(plan);
              const credits = getCredits(plan);

              return (
                <div
                  key={plan.tier}
                  className={cn(
                    "bg-white border rounded-[24px] p-7 flex flex-col relative transition-all",
                    isPopular
                      ? "border-violet-400 shadow-[0_8px_32px_rgba(97,48,221,0.15)]"
                      : "border-navy-100 hover:border-navy-200",
                  )}
                >
                  {isPopular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                      <Badge variant="violet" className="shadow-sm whitespace-nowrap">
                        Most Popular
                      </Badge>
                    </div>
                  )}

                  <div className="mb-5">
                    <h3 className="text-[16px] font-semibold text-navy-800 mb-1">
                      {plan.display_name}
                    </h3>
                    {plan.tagline && (
                      <p className="text-[12px] text-navy-400 mb-3">{plan.tagline}</p>
                    )}
                    <div className="flex items-baseline gap-1">
                      <span
                        className="text-[38px] font-bold text-navy-900 leading-none"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {display}
                      </span>
                      {period && (
                        <span className="text-[13px] text-navy-400">/ {period}</span>
                      )}
                    </div>
                    {billing === "yearly" && plan.tier !== "trial" && (
                      <p className="text-[12px] text-green-600 mt-1 font-medium">
                        Billed yearly · Save 20%
                      </p>
                    )}
                    {plan.trial_days && (
                      <p className="text-[12px] text-violet-500 mt-1 font-medium">
                        {plan.trial_days}-day free trial
                      </p>
                    )}
                  </div>

                  {/* Key limits */}
                  <div className="space-y-2.5 flex-1 mb-6">
                    {credits !== null && (
                      <div className="flex items-start gap-2.5 text-[13px] text-navy-600">
                        <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-4 h-4 text-teal-500 flex-shrink-0 mt-0.5">
                          <path d="M2 7l3.5 3.5L12 3" />
                        </svg>
                        <span>
                          <strong className="text-navy-800">{credits.toLocaleString()}</strong> replies/month
                        </span>
                      </div>
                    )}
                    {wordLimit !== null && (
                      <div className="flex items-start gap-2.5 text-[13px] text-navy-600">
                        <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-4 h-4 text-teal-500 flex-shrink-0 mt-0.5">
                          <path d="M2 7l3.5 3.5L12 3" />
                        </svg>
                        <span>
                          Up to <strong className="text-navy-800">{wordLimit.toLocaleString()}</strong> character input
                        </span>
                      </div>
                    )}
                    {plan.features
                      ? plan.features.map((f) => (
                          <div key={f} className="flex items-start gap-2.5 text-[13px] text-navy-600">
                            <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-4 h-4 text-teal-500 flex-shrink-0 mt-0.5">
                              <path d="M2 7l3.5 3.5L12 3" />
                            </svg>
                            <span>{f}</span>
                          </div>
                        ))
                      : (
                          <>
                            {plan.coach_note_enabled && (
                              <div className="flex items-start gap-2.5 text-[13px] text-navy-600">
                                <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-4 h-4 text-teal-500 flex-shrink-0 mt-0.5">
                                  <path d="M2 7l3.5 3.5L12 3" />
                                </svg>
                                <span>Coach Notes & Blind Spots</span>
                              </div>
                            )}
                            {plan.addon_eligible && (
                              <div className="flex items-start gap-2.5 text-[13px] text-navy-600">
                                <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-4 h-4 text-teal-500 flex-shrink-0 mt-0.5">
                                  <path d="M2 7l3.5 3.5L12 3" />
                                </svg>
                                <span>Credit add-ons available</span>
                              </div>
                            )}
                            <div className="flex items-start gap-2.5 text-[13px] text-navy-600">
                              <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-4 h-4 text-teal-500 flex-shrink-0 mt-0.5">
                                <path d="M2 7l3.5 3.5L12 3" />
                              </svg>
                              <span>All 3 communication modes</span>
                            </div>
                          </>
                        )}
                  </div>

                  {isFree ? (
                    <Link
                      href="/auth/signup"
                      className="w-full h-11 rounded-xl text-[14px] font-medium flex items-center justify-center transition-all border border-navy-200 text-navy-800 hover:border-violet-400 hover:text-violet-600"
                    >
                      {getTierCta(plan.tier)}
                    </Link>
                  ) : (
                    <button
                      onClick={() => handleCheckout(plan.tier)}
                      disabled={loadingPlan === plan.tier}
                      className={cn(
                        "w-full h-11 rounded-xl text-[14px] font-medium flex items-center justify-center transition-all gap-2 disabled:opacity-60",
                        isPopular
                          ? "bg-violet-600 text-white hover:bg-violet-500"
                          : "bg-navy-800 text-white hover:bg-navy-900",
                      )}
                    >
                      {loadingPlan === plan.tier && (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      )}
                      {getTierCta(plan.tier)}
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Comparison table from API */}
          {comparison && (
            <div className="mt-20">
              <h3 className="text-[22px] font-semibold text-navy-900 text-center mb-8">
                Full feature comparison
              </h3>
              <div className="overflow-x-auto rounded-[24px] border border-navy-900/[0.08] shadow-sm">
                <div className="min-w-[800px]">
                  {/* Header row */}
                  <div
                    className="grid"
                    style={{
                      gridTemplateColumns: `2fr repeat(${comparison.headers.length - 1}, 1fr)`,
                    }}
                  >
                    {comparison.headers.map((h, i) => (
                      <div
                        key={h}
                        className={cn(
                          "p-4 px-5 text-[12px] font-semibold uppercase tracking-[0.07em]",
                          i === 0
                            ? "text-navy-400"
                            : i === comparison.headers.length - 1
                              ? "text-violet-500 border-l border-navy-900/[0.08]"
                              : "text-navy-500 border-l border-navy-900/[0.08]",
                          "bg-cream-50",
                        )}
                      >
                        {h}
                      </div>
                    ))}
                  </div>
                  {/* Data rows */}
                  {comparison.rows.map((row, ri) => (
                    <div
                      key={ri}
                      className="grid border-t border-navy-900/[0.08]"
                      style={{
                        gridTemplateColumns: `2fr repeat(${row.length - 1}, 1fr)`,
                      }}
                    >
                      {row.map((cell, ci) => (
                        <div
                          key={ci}
                          className={cn(
                            "p-4 px-5 text-[13px]",
                            ci === 0
                              ? cn(
                                  "font-semibold text-navy-700",
                                  ri % 2 === 0 ? "bg-white" : "bg-cream-50/50",
                                )
                              : cn(
                                  "border-l border-navy-900/[0.08]",
                                  ri % 2 === 0 ? "bg-white" : "bg-cream-50/50",
                                  cell === "✓"
                                    ? "text-teal-600 font-semibold text-center"
                                    : cell === "—"
                                      ? "text-navy-300 text-center"
                                      : ci === row.length - 1
                                        ? "text-violet-600 font-medium"
                                        : "text-navy-500",
                                ),
                          )}
                        >
                          {cell}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* FAQ strip */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                q: "Can I cancel any time?",
                a: "Yes. Cancel at any time — you'll keep access until the end of your billing period.",
              },
              {
                q: "What payment methods?",
                a: "Secure online billing with automatic subscription management.",
              },
              {
                q: "Is my data private?",
                a: "Your conversations are never used to train our models and are fully encrypted at rest.",
              },
            ].map((item) => (
              <div
                key={item.q}
                className="p-5 rounded-2xl bg-white border border-navy-100"
              >
                <p className="text-[14px] font-semibold text-navy-800 mb-1.5">{item.q}</p>
                <p className="text-[13px] text-navy-500 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <CtaSection />
    </>
  );
}
