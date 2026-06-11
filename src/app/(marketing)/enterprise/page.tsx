import type { Metadata } from "next";
import Link from "next/link";
import { SolutionRequestForm } from "@/components/ui/SolutionRequestForm";
import { CtaSection } from "@/components/marketing/CtaSection";

export const metadata: Metadata = {
  title: "Enterprise & Teams | Avertune",
  description: "Communication Intelligence for your entire organization.",
};

const FEATURES = [
  {
    title: "Team Playbooks",
    description:
      "Define communication standards that automatically apply to every team member's responses.",
  },
  {
    title: "Communication Analytics",
    description:
      "Track team performance, escalation trends, and communication quality across departments.",
  },
  {
    title: "Admin Dashboard",
    description:
      "Centralised management for users, roles, and organization-wide settings.",
  },
  {
    title: "SSO & Role Management",
    description: "Secure authentication with enterprise-grade access controls.",
  },
  {
    title: "Organisation CI Profiles",
    description:
      "Maintain consistent communication quality across your entire organization.",
  },
  {
    title: "API Access",
    description:
      "Integrate Avertune intelligence into your existing workflows and tools.",
  },
];

const BENEFITS = [
  "Reduce communication risk across your organization",
  "Maintain brand voice consistency",
  "Coach teams on effective communication patterns",
  "Track improvement with detailed analytics",
  "Scale communication quality without scaling effort",
];

export default function EnterprisePage() {
  return (
    <main className="bg-gray-50 dark:bg-[#141414] min-h-screen">
      {/* Hero */}
      <section className="bg-gray-900 text-white py-20 px-8">
        <div className="max-w-[1120px] mx-auto">
          <p className="text-sm font-semibold uppercase tracking-wider text-violet-400 mb-4">
            Enterprise
          </p>
          <h1 className="font-display font-medium text-white mb-5 leading-[1.1] text-[clamp(32px,5vw,58px)] max-w-[800px]">
            Communication Intelligence for your entire organization
          </h1>
          <p className="text-base text-white/60 max-w-[540px] leading-relaxed">
            Deploy Avertune across teams. Define communication standards. Track
            performance. Scale communication quality without losing consistency.
          </p>
          <div className="flex gap-3 mt-8">
            <a
              href="#request-form"
              className="px-6 py-3 rounded-xl bg-violet-600 text-white text-sm font-medium hover:bg-violet-500 transition-all"
            >
              Request customization →
            </a>
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section className="py-20 px-8">
        <div className="max-w-[1120px] mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display font-medium text-gray-900 dark:text-white text-[clamp(28px,4vw,42px)] mb-4">
              Everything your team needs
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-[560px] mx-auto">
              Purpose-built features for organizations that take communication
              seriously.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-white/[0.08] rounded-2xl p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 px-8 bg-white dark:bg-[#1c1c1c]">
        <div className="max-w-[1120px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-display font-medium text-gray-900 dark:text-white text-[clamp(28px,4vw,42px)] mb-6">
                Why enterprises choose Avertune
              </h2>
              <ul className="space-y-4">
                {BENEFITS.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-teal-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg
                        viewBox="0 0 12 12"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        className="w-2.5 h-2.5 text-teal-500"
                      >
                        <path
                          d="M2 6l3 3 5-5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    <span className="text-gray-700 dark:text-gray-300">
                      {benefit}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-violet-50 dark:bg-violet-500/10 rounded-2xl p-8 border border-violet-200 dark:border-violet-500/20">
              <p className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Ready to transform team communication?
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Book a demo with our enterprise team.
              </p>
              <Link
                href="/contact"
                className="inline-flex px-5 py-2.5 rounded-xl bg-violet-600 text-white text-sm font-medium hover:bg-violet-500 transition-all"
              >
                Contact sales →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Request form */}
      <section id="request-form" className="py-20 px-8 scroll-mt-20">
        <div className="max-w-[800px] mx-auto">
          <div className="text-center mb-8">
            <h2 className="font-display font-medium text-gray-900 dark:text-white text-[clamp(24px,3.5vw,36px)] mb-3">
              Request customization
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              Tell us about your organization's needs and we'll build a tailored
              solution.
            </p>
          </div>
          <SolutionRequestForm
            solutionTitle="Enterprise & Teams"
            solutionId="enterprise"
          />
        </div>
      </section>

      <CtaSection />
    </main>
  );
}
