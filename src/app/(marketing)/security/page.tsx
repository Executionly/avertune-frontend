import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Security & Trust | Avertune",
  description: "How Avertune protects your data and communication.",
};

const PROTECTIONS = [
  { icon: "", label: "Secure authentication" },
  { icon: "", label: "Encrypted communication" },
  { icon: "", label: "Protected API infrastructure" },
  { icon: "", label: "Secure billing providers" },
  { icon: "", label: "Role-based access controls" },
  { icon: "", label: "Abuse protection systems" },
];

export default function SecurityPage() {
  return (
    <main className="bg-cream-100 min-h-screen">
      <section className="bg-navy-900 text-white py-20 px-8">
        <div className="max-w-[800px] mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-violet-400 mb-4">
            Legal
          </p>
          <h1
            className="font-display font-medium text-white mb-4"
            style={{ fontSize: "clamp(28px,4vw,48px)" }}
          >
            Security & Trust
          </h1>
          <p className="text-white/60 text-[15px] leading-[1.7] max-w-[540px]">
            Avertune is designed with privacy, security, and trust in mind. Your
            communication data is processed securely to provide platform
            functionality and improve communication guidance quality.
          </p>
        </div>
      </section>

      <section className="py-20 px-8">
        <div className="max-w-[800px] mx-auto space-y-6">
          <div className="bg-teal-50 border border-teal-200 rounded-[20px] p-8">
            <p className="text-[16px] font-semibold text-teal-800">
              We never sell user messages or personal communication data.
            </p>
          </div>

          <div className="bg-white rounded-[20px] border border-navy-900/[0.08] p-8">
            <h2 className="text-[20px] font-semibold text-navy-900 mb-6">
              Platform Protections
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {PROTECTIONS.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-3 p-4 rounded-xl bg-cream-50 border border-navy-900/[0.06]"
                >
                  <span className="text-[14px] font-medium text-navy-700">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-[20px] border border-navy-900/[0.08] p-8">
            <h2 className="text-[20px] font-semibold text-navy-900 mb-4">
              Questions?
            </h2>
            <p className="text-[14px] text-navy-600 leading-[1.7]">
              For security-related inquiries, contact us at{" "}
              <a
                href="mailto:info@avertune.com"
                className="text-violet-600 hover:underline"
              >
                info@avertune.com
              </a>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
