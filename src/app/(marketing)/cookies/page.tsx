import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy | Avertune",
  description: "How Avertune uses cookies.",
};

export default function CookiesPage() {
  return (
    <main className="bg-cream-100 min-h-screen">
      <section className="bg-navy-900 text-white py-20 px-8">
        <div className="max-w-[800px] mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-violet-400 mb-4">Legal</p>
          <h1 className="font-display font-medium text-white mb-4" style={{ fontSize: "clamp(28px,4vw,48px)" }}>
            Cookie Policy
          </h1>
          <p className="text-white/55 text-sm">Effective: 2026</p>
        </div>
      </section>

      <section className="py-20 px-8">
        <div className="max-w-[800px] mx-auto space-y-6">
          <div className="bg-white rounded-[20px] border border-navy-900/[0.08] p-8">
            <h2 className="text-[20px] font-semibold text-navy-900 mb-4">What are cookies?</h2>
            <p className="text-[14px] text-navy-600 leading-[1.75]">
              Cookies are small text files placed on your device when you visit a website. They help the platform remember your preferences and improve your experience.
            </p>
          </div>

          <div className="bg-white rounded-[20px] border border-navy-900/[0.08] p-8">
            <h2 className="text-[20px] font-semibold text-navy-900 mb-5">How Avertune uses cookies</h2>
            <ul className="space-y-3">
              {[
                { type: "Essential cookies", desc: "Required for authentication, security, and core platform functionality." },
                { type: "Preference cookies", desc: "Remember your settings such as theme and communication mode preferences." },
                { type: "Analytics cookies", desc: "Help us understand how the platform is used so we can improve it. No personal communication data is shared." },
              ].map((item) => (
                <li key={item.type} className="p-4 rounded-xl bg-cream-50 border border-navy-900/[0.06]">
                  <p className="text-[13px] font-semibold text-navy-800 mb-1">{item.type}</p>
                  <p className="text-[13px] text-navy-600 leading-[1.65]">{item.desc}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-[20px] border border-navy-900/[0.08] p-8">
            <h2 className="text-[20px] font-semibold text-navy-900 mb-4">Your choices</h2>
            <p className="text-[14px] text-navy-600 leading-[1.75]">
              You can manage or disable cookies through your browser settings. Please note that disabling certain cookies may affect the functionality of the platform.
            </p>
          </div>

          <div className="bg-white rounded-[20px] border border-navy-900/[0.08] p-8">
            <h2 className="text-[20px] font-semibold text-navy-900 mb-4">Questions?</h2>
            <p className="text-[14px] text-navy-600 leading-[1.7]">
              Contact us at{" "}
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
