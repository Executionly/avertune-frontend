import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Responsible Use | Avertune",
  description: "Avertune's Responsible Use guidelines.",
};

export default function ResponsibleUsePage() {
  return (
    <main className="bg-cream-100 min-h-screen">
      <section className="bg-navy-900 text-white py-20 px-8">
        <div className="max-w-[800px] mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-violet-400 mb-4">Legal</p>
          <h1 className="font-display font-medium text-white mb-4" style={{ fontSize: "clamp(28px,4vw,48px)" }}>
            Responsible Use
          </h1>
        </div>
      </section>

      <section className="py-20 px-8">
        <div className="max-w-[800px] mx-auto space-y-6">
          <div className="bg-white rounded-[20px] border border-navy-900/[0.08] p-8">
            <h2 className="text-[20px] font-semibold text-navy-900 mb-5">Avertune is designed to support</h2>
            <ul className="space-y-2.5">
              {[
                "Clear communication",
                "Emotional awareness",
                "Strategic communication",
                "Respectful engagement",
                "Professional communication",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-[14px] text-navy-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-[20px] border border-navy-900/[0.08] p-8">
            <h2 className="text-[20px] font-semibold text-navy-900 mb-5">Avertune should not be used to</h2>
            <ul className="space-y-2.5">
              {[
                "Manipulate vulnerable individuals",
                "Generate abusive communication",
                "Facilitate unlawful conduct",
                "Deceive or impersonate others",
                "Violate workplace or legal obligations",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-[14px] text-navy-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-navy-50 rounded-[20px] border border-navy-200/60 p-8">
            <p className="text-[14px] text-navy-700 leading-[1.75]">
              Users remain responsible for all communication decisions and final responses. Avertune provides guidance — the decision to send any message always belongs to the user.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
