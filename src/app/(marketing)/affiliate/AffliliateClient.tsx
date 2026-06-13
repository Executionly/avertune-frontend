// FILE: src/app/(marketing)/affiliate/AffiliateClient.tsx
"use client";

import { useState, useEffect } from "react";
import { joinAffiliate, type JoinRequest } from "@/lib/api/affiliate";
import { getPlans } from "@/lib/api/auth";
import { useAuth } from "@/lib/contexts/AuthContext";

const PROMOTION_METHODS = [
  "LinkedIn",
  "YouTube",
  "TikTok",
  "Instagram",
  "Facebook",
  "X (Twitter)",
  "Newsletter",
  "Blog",
  "Community",
  "Coaching/Consulting",
  "Other",
];

const AUDIENCE_OPTIONS = [
  "Professionals",
  "Business Owners",
  "Sales Teams",
  "Recruiters",
  "Students",
  "Coaches & Consultants",
  "Leadership Teams",
  "Relationships & Personal Development",
  "Other",
];

const AUDIENCE_SIZE_OPTIONS = [
  "Under 1,000",
  "1,000–5,000",
  "5,000–25,000",
  "25,000–100,000",
  "100,000+",
];

interface Plan {
  tier: string;
  display_name: string;
  price_monthly?: number;
  prices?: { monthly?: number };
}

function ApplicationForm({ onSuccess }: { onSuccess: () => void }) {
  const [formData, setFormData] = useState<Partial<JoinRequest>>({
    first_name: "",
    last_name: "",
    email: "",
    country: "",
    linkedin_url: "",
    promotion_methods: [],
    primary_audience: "",
    audience_size: "",
    promotion_plan: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleMethodToggle = (method: string) => {
    setFormData((prev) => ({
      ...prev,
      promotion_methods: prev.promotion_methods?.includes(method)
        ? prev.promotion_methods.filter((m) => m !== method)
        : [...(prev.promotion_methods || []), method],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!formData.promotion_methods?.length) {
      setError("Please select at least one promotion method");
      setLoading(false);
      return;
    }

    try {
      await joinAffiliate(formData as JoinRequest);
      onSuccess();
    } catch (err: any) {
      setError(err.message || "Failed to submit application");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-[13px]">
          {error}
        </div>
      )}

      {/* Basic Information */}
      <div className="bg-white rounded-[24px] border border-navy-900/[0.08] p-6 space-y-4">
        <h3 className="text-[16px] font-semibold text-navy-900">
          Basic Information
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[13px] font-medium text-navy-700 mb-1.5">
              First Name *
            </label>
            <input
              type="text"
              required
              value={formData.first_name}
              onChange={(e) =>
                setFormData({ ...formData, first_name: e.target.value })
              }
              className="w-full px-4 py-3 rounded-xl border border-navy-200 text-[14px] focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all"
            />
          </div>
          <div>
            <label className="block text-[13px] font-medium text-navy-700 mb-1.5">
              Last Name *
            </label>
            <input
              type="text"
              required
              value={formData.last_name}
              onChange={(e) =>
                setFormData({ ...formData, last_name: e.target.value })
              }
              className="w-full px-4 py-3 rounded-xl border border-navy-200 text-[14px] focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all"
            />
          </div>
        </div>
        <div>
          <label className="block text-[13px] font-medium text-navy-700 mb-1.5">
            Email Address *
          </label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="w-full px-4 py-3 rounded-xl border border-navy-200 text-[14px] focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[13px] font-medium text-navy-700 mb-1.5">
              Country
            </label>
            <input
              type="text"
              value={formData.country}
              onChange={(e) =>
                setFormData({ ...formData, country: e.target.value })
              }
              placeholder="e.g., United States"
              className="w-full px-4 py-3 rounded-xl border border-navy-200 text-[14px] focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all"
            />
          </div>
          <div>
            <label className="block text-[13px] font-medium text-navy-700 mb-1.5">
              LinkedIn Profile URL
            </label>
            <input
              type="url"
              value={formData.linkedin_url}
              onChange={(e) =>
                setFormData({ ...formData, linkedin_url: e.target.value })
              }
              placeholder="https://linkedin.com/in/..."
              className="w-full px-4 py-3 rounded-xl border border-navy-200 text-[14px] focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Promotion Information */}
      <div className="bg-white rounded-[24px] border border-navy-900/[0.08] p-6 space-y-4">
        <h3 className="text-[16px] font-semibold text-navy-900">
          Promotion Information
        </h3>

        <div>
          <label className="block text-[13px] font-medium text-navy-700 mb-3">
            How do you plan to promote Avertune? *
          </label>
          <div className="flex flex-wrap gap-2">
            {PROMOTION_METHODS.map((method) => (
              <button
                key={method}
                type="button"
                onClick={() => handleMethodToggle(method)}
                className={`px-3 py-1.5 rounded-full text-[13px] border transition-all ${
                  formData.promotion_methods?.includes(method)
                    ? "border-violet-500 bg-violet-50 text-violet-600"
                    : "border-navy-200 text-navy-500 hover:border-violet-300"
                }`}
              >
                {method}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-[13px] font-medium text-navy-700 mb-3">
            Primary Audience *
          </label>
          <div className="flex flex-wrap gap-2">
            {AUDIENCE_OPTIONS.map((audience) => (
              <button
                key={audience}
                type="button"
                onClick={() =>
                  setFormData({ ...formData, primary_audience: audience })
                }
                className={`px-3 py-1.5 rounded-full text-[13px] border transition-all ${
                  formData.primary_audience === audience
                    ? "border-violet-500 bg-violet-50 text-violet-600"
                    : "border-navy-200 text-navy-500 hover:border-violet-300"
                }`}
              >
                {audience}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-[13px] font-medium text-navy-700 mb-3">
            Estimated Audience Size *
          </label>
          <div className="flex flex-wrap gap-2">
            {AUDIENCE_SIZE_OPTIONS.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() =>
                  setFormData({ ...formData, audience_size: size })
                }
                className={`px-3 py-1.5 rounded-full text-[13px] border transition-all ${
                  formData.audience_size === size
                    ? "border-violet-500 bg-violet-50 text-violet-600"
                    : "border-navy-200 text-navy-500 hover:border-violet-300"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-[13px] font-medium text-navy-700 mb-1.5">
            Tell us briefly how you plan to introduce Avertune to your audience.
            *
          </label>
          <textarea
            required
            rows={4}
            value={formData.promotion_plan}
            onChange={(e) =>
              setFormData({ ...formData, promotion_plan: e.target.value })
            }
            placeholder="I plan to..."
            className="w-full px-4 py-3 rounded-xl border border-navy-200 text-[14px] focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all resize-none"
          />
        </div>
      </div>

      {/* Agreement */}
      <div className="bg-white rounded-[24px] border border-navy-900/[0.08] p-6">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            required
            className="mt-0.5 w-4 h-4 rounded border-navy-300 text-violet-600 focus:ring-violet-500"
          />
          <span className="text-[13px] text-navy-600 leading-relaxed">
            I agree to the{" "}
            <a href="/terms" className="text-violet-600 hover:underline">
              Terms and Conditions
            </a>
            .
          </span>
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full sm:w-auto px-8 py-3 rounded-xl bg-violet-600 text-white text-[14px] font-medium hover:bg-violet-500 transition-all disabled:opacity-60"
      >
        {loading ? "Submitting..." : "Apply to Become an Affiliate Partner"}
      </button>
    </form>
  );
}

function formatPrice(price: number): string {
  return price === 0 ? "Free" : `$${price}`;
}

function calculateCommission(price: number, rate: number): string {
  const amount = (price * rate) / 100;
  return `$${amount.toFixed(2)}`;
}

export default function AffiliateClient() {
  const [submitted, setSubmitted] = useState(false);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    getPlans()
      .then((data) => {
        const planList = data?.plans || [];
        const paidPlans = planList.filter(
          (p: Plan) =>
            p.tier !== "trial" &&
            p.tier !== "free" &&
            (p.price_monthly ?? p.prices?.monthly ?? 0) > 0,
        );
        setPlans(paidPlans);
      })
      .catch((err) => {
        console.error("Failed to fetch plans:", err);
        setPlans([
          { tier: "starter", display_name: "Starter", price_monthly: 9 },
          { tier: "daily", display_name: "Daily", price_monthly: 19 },
          { tier: "pro", display_name: "Pro", price_monthly: 49 },
        ]);
      })
      .finally(() => setLoadingPlans(false));
  }, []);

  const getPlanPrice = (plan: Plan): number => {
    return plan.price_monthly ?? plan.prices?.monthly ?? 0;
  };

  if (submitted) {
    return (
      <main className="bg-cream-100 min-h-screen">
        <section className="bg-navy-900 text-white py-20 px-8">
          <div className="max-w-[800px] mx-auto">
            <p className="text-xs font-semibold uppercase tracking-widest text-violet-400 mb-4">
              Company
            </p>
            <h1
              className="font-display font-medium text-white mb-4"
              style={{ fontSize: "clamp(28px,4vw,48px)" }}
            >
              Application Submitted
            </h1>
          </div>
        </section>
        <section className="py-20 px-8">
          <div className="max-w-[800px] mx-auto text-center">
            <div className="bg-green-50 border border-green-200 rounded-[24px] p-12">
              <div className="w-14 h-14 rounded-full bg-green-100 border border-green-200 flex items-center justify-center mx-auto mb-4">
                <svg
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="w-7 h-7 text-green-600"
                >
                  <path
                    d="M2 8l4 4 8-8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h2 className="text-[24px] font-semibold text-navy-900 mb-3">
                Thank you for applying!
              </h2>
              <p className="text-[15px] text-navy-500 leading-relaxed max-w-[400px] mx-auto">
                Our team will review your application within 2-3 business days.
                You'll receive an email once your application is approved.
              </p>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="bg-cream-100 min-h-screen">
      {/* Hero */}
      <section className="bg-navy-900 text-white py-20 px-8">
        <div className="max-w-[1120px] mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-violet-400 mb-4">
            Company
          </p>
          <h1
            className="font-display font-medium text-white mb-5"
            style={{ fontSize: "clamp(32px,5vw,58px)" }}
          >
            Help People Communicate Better.
            <br />
            <em className="text-violet-300 not-italic">
              Earn Recurring Income.
            </em>
          </h1>
          <p className="text-[16px] text-white/60 leading-[1.7] max-w-[560px]">
            Join the Avertune Affiliate Program and earn commissions by
            introducing professionals, teams, and organizations to a smarter way
            of communicating.
          </p>
        </div>
      </section>

      {/* Commission Structure */}
      <section className="py-20 px-8">
        <div className="max-w-[1120px] mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display font-medium text-navy-900 text-[clamp(28px,3.5vw,42px)] mb-4">
              Commission Structure
            </h2>
            <p className="text-[15px] text-navy-500 max-w-[540px] mx-auto">
              Earn 50% on the first month and 10% recurring on every
              subscription payment from your referrals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            <div className="bg-gradient-to-br from-violet-50 to-violet-100 border border-violet-200 rounded-[28px] p-8 text-center">
              <p className="text-[48px] font-bold text-violet-600 mb-2">50%</p>
              <p className="text-[15px] font-semibold text-navy-800 mb-1">
                First paid month
              </p>
              <p className="text-[13px] text-navy-500">
                Earn 50% of the customer's first subscription payment
              </p>
            </div>
            <div className="bg-gradient-to-br from-teal-50 to-teal-100 border border-teal-200 rounded-[28px] p-8 text-center">
              <p className="text-[48px] font-bold text-teal-600 mb-2">10%</p>
              <p className="text-[15px] font-semibold text-navy-800 mb-1">
                Recurring commission
              </p>
              <p className="text-[13px] text-navy-500">
                Continue earning 10% every month while referred customers stay
                subscribed
              </p>
            </div>
          </div>

          {/* Dynamic Commission Examples */}
          <div className="bg-white rounded-[24px] border border-navy-900/[0.08] p-8 mb-16">
            <h3 className="text-[18px] font-semibold text-navy-900 mb-4 text-center">
              Commission Examples (Monthly Plans)
            </h3>
            {loadingPlans ? (
              <div className="flex justify-center py-8">
                <div className="w-6 h-6 rounded-full border-2 border-violet-500/30 border-t-violet-500 animate-spin" />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {plans.map((plan) => {
                  const price = getPlanPrice(plan);
                  const firstMonthCommission = calculateCommission(price, 50);
                  const recurringCommission = calculateCommission(price, 10);
                  return (
                    <div
                      key={plan.tier}
                      className="bg-navy-50 rounded-xl p-4 text-center"
                    >
                      <p className="text-[13px] font-semibold text-navy-600">
                        {plan.display_name}
                      </p>
                      <p className="text-[20px] font-bold text-navy-800">
                        {formatPrice(price)}
                        <span className="text-[12px] font-normal text-navy-400">
                          /month
                        </span>
                      </p>
                      <div className="mt-2 pt-2 border-t border-navy-100">
                        <p className="text-[12px] text-navy-500">
                          First month:{" "}
                          <span className="font-semibold text-green-600">
                            {firstMonthCommission}
                          </span>
                        </p>
                        <p className="text-[12px] text-navy-500">
                          Recurring:{" "}
                          <span className="font-semibold text-teal-600">
                            {recurringCommission}
                          </span>
                          /month
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            <p className="text-center text-[12px] text-navy-400 mt-4">
              *Annual plans also earn 50% first payment + 10% recurring on the
              annual amount
            </p>
          </div>

          {/* Who Should Join */}
          <div className="bg-navy-900 rounded-[28px] p-10 text-white mb-16">
            <h3 className="text-[22px] font-display font-medium mb-6">
              Who Should Join?
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                "Content creators",
                "LinkedIn creators",
                "YouTubers",
                "TikTok creators",
                "Leadership coaches",
                "Business consultants",
                "Sales trainers",
                "Recruiters",
                "HR professionals",
                "Career coaches",
                "Community builders",
                "Newsletter publishers",
              ].map((role) => (
                <div
                  key={role}
                  className="flex items-center gap-2 text-[13px] text-white/70"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400 flex-shrink-0" />
                  {role}
                </div>
              ))}
            </div>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            <div className="bg-white rounded-[24px] border border-navy-900/[0.08] p-8">
              <h3 className="text-[18px] font-semibold text-navy-900 mb-4">
                Affiliate Benefits
              </h3>
              <ul className="space-y-3">
                {[
                  "50% first-month commission",
                  "10% recurring monthly commission",
                  "Dedicated affiliate dashboard",
                  "Real-time click and conversion tracking",
                  "Performance reporting",
                  "Marketing resources and promotional assets",
                  "Early access to campaigns and launches",
                  "Founder partner opportunities",
                  "Future performance bonuses and incentives",
                ].map((benefit) => (
                  <li
                    key={benefit}
                    className="flex items-center gap-2.5 text-[14px] text-navy-600"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400 flex-shrink-0" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-[24px] border border-navy-900/[0.08] p-8">
              <h3 className="text-[18px] font-semibold text-navy-900 mb-4">
                Why Promote Avertune?
              </h3>
              <p className="text-[14px] text-navy-500 leading-relaxed mb-4">
                Most communication tools help people write. Avertune helps
                people understand.
              </p>
              <p className="text-[14px] text-navy-500 leading-relaxed">
                Users can analyze difficult emails, negotiate more effectively,
                improve workplace communication, strengthen sales conversations,
                and navigate important relationship discussions with greater
                confidence.
              </p>
              <div className="mt-4 pt-4 border-t border-navy-100">
                <p className="text-[13px] font-semibold text-navy-700">
                  Universal audience
                </p>
                <p className="text-[13px] text-navy-500 mt-1">
                  Every professional, business owner, team, recruiter,
                  salesperson, manager, leader, and student communicates every
                  day.
                </p>
              </div>
            </div>
          </div>

          {/* Application Form - HIDDEN FROM PUBLIC, preserved for later use */}
          {false && (
            <div className="bg-white rounded-[28px] border border-navy-900/[0.08] p-8 md:p-12">
              <div className="text-center mb-8">
                <h2 className="text-[24px] font-display font-medium text-navy-900 mb-3">
                  Ready to Become a Partner?
                </h2>
                <p className="text-[14px] text-navy-500">
                  Complete the application below and our team will review your
                  submission. Approved partners will receive onboarding
                  instructions and access to their tracking dashboard.
                </p>
              </div>
              <ApplicationForm onSuccess={() => setSubmitted(true)} />
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
