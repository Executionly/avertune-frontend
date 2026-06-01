import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Avertune",
  description: "How Avertune collects, uses, and protects your information.",
};

const SECTIONS = [
  {
    title: "Information We Collect",
    items: [
      "Account information",
      "Communication inputs",
      "Usage analytics",
      "Billing information",
      "Device and browser information",
    ],
  },
  {
    title: "How Information Is Used",
    items: [
      "Generate communication analysis",
      "Improve platform experience",
      "Personalize communication guidance",
      "Support billing and security",
      "Improve platform reliability",
    ],
  },
  {
    title: "Data Protection",
    items: [
      "Encrypted communication",
      "Secure infrastructure",
      "Protected authentication",
      "Secure payment processing",
    ],
  },
  {
    title: "User Control",
    items: [
      "Delete conversations",
      "Manage preferences",
      "Request account deletion",
      "Control personalization settings",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <main className="bg-cream-100 min-h-screen">
      <section className="bg-navy-900 text-white py-20 px-8">
        <div className="max-w-[800px] mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-violet-400 mb-4">Legal</p>
          <h1 className="font-display font-medium text-white mb-4" style={{ fontSize: "clamp(28px,4vw,48px)" }}>
            Privacy Policy
          </h1>
          <p className="text-white/55 text-sm">Effective: 2026</p>
        </div>
      </section>

      <section className="py-20 px-8">
        <div className="max-w-[800px] mx-auto space-y-6">
          {/* Critical statement */}
          <div className="bg-teal-50 border border-teal-200 rounded-[20px] p-8">
            <p className="text-[16px] font-semibold text-teal-800">
              Avertune does not sell personal communication data to third parties.
            </p>
          </div>

          {SECTIONS.map((section) => (
            <div key={section.title} className="bg-white rounded-[20px] border border-navy-900/[0.08] p-8">
              <h2 className="text-[20px] font-semibold text-navy-900 mb-5">{section.title}</h2>
              <ul className="space-y-2.5">
                {section.items.map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-[14px] text-navy-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-400 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="bg-white rounded-[20px] border border-navy-900/[0.08] p-8">
            <h2 className="text-[20px] font-semibold text-navy-900 mb-4">Questions?</h2>
            <p className="text-[14px] text-navy-600 leading-[1.7]">
              If you have any questions about this Privacy Policy or how your data is handled, contact us at{" "}
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
