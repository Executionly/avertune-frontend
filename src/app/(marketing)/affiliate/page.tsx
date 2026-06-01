import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Affiliate Program | Avertune",
  description: "Earn recurring commissions by sharing Avertune with your audience.",
};

export default function AffiliatePage() {
  return (
    <main className="bg-cream-100 min-h-screen">
      <section className="bg-navy-900 text-white py-20 px-8">
        <div className="max-w-[800px] mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-violet-400 mb-4">Company</p>
          <h1 className="font-display font-medium text-white mb-4" style={{ fontSize: "clamp(28px,4vw,48px)" }}>
            Affiliate Program
          </h1>
          <p className="text-white/60 text-[16px] leading-[1.7] max-w-[520px]">
            Help people communicate more clearly and confidently while earning recurring commissions.
          </p>
        </div>
      </section>

      <section className="py-20 px-8">
        <div className="max-w-[800px] mx-auto space-y-6">
          {/* Commission structure */}
          <div className="bg-white rounded-[20px] border border-navy-900/[0.08] p-8">
            <h2 className="text-[20px] font-semibold text-navy-900 mb-6">Commission Structure</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-violet-50 border border-violet-200 rounded-xl p-6 text-center">
                <p className="text-[36px] font-bold text-violet-600 mb-1">50%</p>
                <p className="text-[13px] font-semibold text-navy-800">First paid month</p>
                <p className="text-[12px] text-navy-500 mt-1">Per referred user</p>
              </div>
              <div className="bg-teal-50 border border-teal-200 rounded-xl p-6 text-center">
                <p className="text-[36px] font-bold text-teal-600 mb-1">10%</p>
                <p className="text-[13px] font-semibold text-navy-800">Ongoing recurring</p>
                <p className="text-[12px] text-navy-500 mt-1">Every month after</p>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="bg-white rounded-[20px] border border-navy-900/[0.08] p-8">
            <h2 className="text-[20px] font-semibold text-navy-900 mb-5">Affiliate Benefits</h2>
            <ul className="space-y-2.5">
              {[
                "Recurring commissions on every referred subscriber",
                "Creator resources and promotional materials",
                "Referral dashboard to track clicks and conversions",
                "Performance tracking and payout reporting",
                "Founder campaign opportunities",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-[14px] text-navy-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <div className="bg-navy-900 rounded-[20px] p-8 text-center">
            <h2 className="text-[22px] font-semibold text-white mb-3">Ready to get started?</h2>
            <p className="text-[14px] text-white/60 mb-6">
              Apply for the affiliate program or get in touch with questions.
            </p>
            <a
              href="mailto:info@avertune.com?subject=Affiliate Program Application"
              className="inline-flex h-10 px-6 text-[13px] font-medium bg-violet-500 text-white rounded-lg items-center hover:bg-violet-600 transition-colors"
            >
              Apply Now →
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
