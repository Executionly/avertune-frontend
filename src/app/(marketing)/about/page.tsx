import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Avertune | Communication Intelligence Platform",
  description: "Avertune is a Communication Intelligence Platform designed to help people and teams understand tone, intent, emotional pressure, and communication risk before responding.",
};

export default function AboutPage() {
  return (
    <main className="bg-cream-100 min-h-screen">
      {/* Hero */}
      <section className="bg-navy-900 text-white py-24 px-8">
        <div className="max-w-[800px] mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-violet-400 mb-5">About Avertune</p>
          <h1
            className="font-display font-medium text-white mb-6 leading-[1.1]"
            style={{ fontSize: "clamp(32px,5vw,58px)" }}
          >
            Communication Intelligence<br />for every conversation that matters.
          </h1>
          <p className="text-[17px] text-white/65 leading-[1.75] max-w-[600px]">
            Avertune is a Communication Intelligence Platform designed to help people and teams understand tone, intent, emotional pressure, and communication risk before responding.
          </p>
        </div>
      </section>

      {/* What is Avertune */}
      <section className="py-20 px-8">
        <div className="max-w-[800px] mx-auto">
          <div className="bg-white rounded-[28px] border border-navy-900/[0.08] p-10 mb-8">
            <h2 className="text-[26px] font-display font-medium text-navy-900 mb-5">What is Avertune?</h2>
            <p className="text-[15px] text-navy-600 leading-[1.8] mb-5">
              The platform combines communication analysis, strategic response guidance, and conversational intelligence to help users communicate more clearly, confidently, and effectively across professional, sales, and relationship situations.
            </p>
            <p className="text-[15px] text-navy-600 leading-[1.8]">
              Most communication tools help people write. Avertune helps people understand communication dynamics, reduce communication risk, respond strategically, improve conversations, and communicate more effectively — across every situation.
            </p>
          </div>

          {/* Built for */}
          <div className="bg-white rounded-[28px] border border-navy-900/[0.08] p-10 mb-8">
            <h2 className="text-[26px] font-display font-medium text-navy-900 mb-6">Built for</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                "Professionals",
                "Founders",
                "Sales teams",
                "Recruiters",
                "Customer-facing teams",
                "Students",
                "Everyday communication",
              ].map((role) => (
                <div
                  key={role}
                  className="px-4 py-3 rounded-xl bg-violet-50 border border-violet-100 text-[13px] font-medium text-violet-700"
                >
                  {role}
                </div>
              ))}
            </div>
          </div>

          {/* Vision */}
          <div className="bg-navy-900 rounded-[28px] p-10">
            <h2 className="text-[26px] font-display font-medium text-white mb-5">The Vision</h2>
            <p className="text-[15px] text-white/65 leading-[1.8] mb-6">
              Avertune is designed to support better communication outcomes through structured communication intelligence and guided response recommendations — for professionals, teams, and everyday communication.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {[
                "Understand the message",
                "Send the right response",
                "Better decisions",
                "Clearer conversations",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2.5 text-[14px] text-white/70">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400 flex-shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
