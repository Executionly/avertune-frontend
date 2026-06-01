import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Avertune",
  description: "Avertune Terms of Service — understand your rights and responsibilities when using the platform.",
};

export default function TermsPage() {
  return (
    <main className="bg-cream-100 min-h-screen">
      <section className="bg-navy-900 text-white py-20 px-8">
        <div className="max-w-[800px] mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-violet-400 mb-4">Legal</p>
          <h1 className="font-display font-medium text-white mb-4" style={{ fontSize: "clamp(28px,4vw,48px)" }}>
            Terms of Service
          </h1>
          <p className="text-white/55 text-sm">Effective: 2026</p>
        </div>
      </section>

      <section className="py-20 px-8">
        <div className="max-w-[800px] mx-auto space-y-6">

          <div className="bg-white rounded-[20px] border border-navy-900/[0.08] p-8">
            <h2 className="text-[20px] font-semibold text-navy-900 mb-4">Platform Purpose</h2>
            <p className="text-[14px] text-navy-600 leading-[1.75]">
              Avertune provides communication intelligence and communication guidance tools. The platform is designed to support clearer, more strategic, and more effective communication — across professional, sales, and relationship situations.
            </p>
          </div>

          <div className="bg-white rounded-[20px] border border-navy-900/[0.08] p-8">
            <h2 className="text-[20px] font-semibold text-navy-900 mb-5">User Responsibility</h2>
            <p className="text-[14px] text-navy-600 mb-4 leading-[1.7]">Users remain fully responsible for:</p>
            <ul className="space-y-2.5">
              {["Messages sent", "Communication decisions", "Legal compliance", "Workplace compliance", "Relationship decisions", "Business outcomes"].map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-[14px] text-navy-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-400 flex-shrink-0" />{item}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-[20px] border border-navy-900/[0.08] p-8">
            <h2 className="text-[20px] font-semibold text-navy-900 mb-5">Prohibited Use</h2>
            <p className="text-[14px] text-navy-600 mb-4 leading-[1.7]">Users may not use Avertune for:</p>
            <ul className="space-y-2.5">
              {["Harassment", "Fraud", "Discrimination", "Unlawful activity", "Impersonation", "Malicious communication", "Deceptive conduct"].map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-[14px] text-navy-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />{item}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-[20px] border border-navy-900/[0.08] p-8">
            <h2 className="text-[20px] font-semibold text-navy-900 mb-4">No Guaranteed Outcomes</h2>
            <p className="text-[14px] text-navy-600 leading-[1.75] mb-4">
              Avertune provides communication guidance only. We do not guarantee specific outcomes including:
            </p>
            <ul className="space-y-2.5">
              {["Sales outcomes", "Hiring outcomes", "Relationship outcomes", "Negotiation outcomes", "Legal outcomes"].map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-[14px] text-navy-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-navy-300 flex-shrink-0" />{item}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-[20px] border border-navy-900/[0.08] p-8">
            <h2 className="text-[20px] font-semibold text-navy-900 mb-5">Subscription Terms</h2>
            <ul className="space-y-2.5">
              {["Subscriptions renew automatically unless cancelled", "Billing cycles are monthly or annual depending on your plan", "Cancellations take effect at the end of the current billing period", "Credits are non-transferable and subject to plan rules", "Founder pricing is subject to availability and specific eligibility criteria"].map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-[14px] text-navy-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-400 flex-shrink-0" />{item}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-[20px] border border-navy-900/[0.08] p-8">
            <h2 className="text-[20px] font-semibold text-navy-900 mb-4">Questions?</h2>
            <p className="text-[14px] text-navy-600 leading-[1.7]">
              For any questions about these terms, contact us at{" "}
              <a href="mailto:info@avertune.com" className="text-violet-600 hover:underline">
                info@avertune.com
              </a>
            </p>
          </div>

        </div>
      </section>
    </main>
  );
}
