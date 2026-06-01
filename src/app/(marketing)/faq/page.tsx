import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQs | Avertune",
  description: "Frequently asked questions about Avertune's Communication Intelligence Platform.",
};

const FAQS = [
  {
    q: "What is Avertune?",
    a: "Avertune is a Communication Intelligence Platform that helps users understand tone, intent, and communication risk before responding. It analyses the message, recommends strategy, generates calibrated responses, and simulates the likely outcome.",
  },
  {
    q: "How does Avertune work?",
    a: "Users paste a message, select a communication mode (Professional, Sales, or Relationship), and receive communication analysis and strategic response guidance — without needing to write complex prompts.",
  },
  {
    q: "What are Communication Credits?",
    a: "Communication Credits power Avertune's communication intelligence features and advanced analysis capabilities. Credits are consumed each time you run a full analysis.",
  },
  {
    q: "What modes are available?",
    a: "Avertune offers three communication modes: Professional Mode (for workplace and career communication), Sales Mode (for deals, objections, and negotiations), and Relationship Mode (for personal and emotional conversations).",
  },
  {
    q: "Does Avertune guarantee outcomes?",
    a: "No. Avertune provides communication guidance only. Users remain responsible for communication decisions and outcomes. The platform is designed to help you make better decisions — not to make them for you.",
  },
  {
    q: "Is my communication private?",
    a: "Avertune is designed with privacy-focused infrastructure. We do not sell user communication data to third parties. Your data is processed securely to provide platform functionality.",
  },
  {
    q: "Can teams use Avertune?",
    a: "Yes. Future versions of Avertune will support more team communication workflows and organizational communication guidance. For enterprise communication, contact us at info@avertune.com.",
  },
];

export default function FaqPage() {
  return (
    <main className="bg-cream-100 min-h-screen">
      <section className="bg-navy-900 text-white py-20 px-8">
        <div className="max-w-[800px] mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-violet-400 mb-4">Support</p>
          <h1 className="font-display font-medium text-white mb-4" style={{ fontSize: "clamp(28px,4vw,48px)" }}>
            Frequently Asked Questions
          </h1>
        </div>
      </section>

      <section className="py-20 px-8">
        <div className="max-w-[800px] mx-auto space-y-4">
          {FAQS.map((faq) => (
            <div key={faq.q} className="bg-white rounded-[20px] border border-navy-900/[0.08] p-8">
              <h2 className="text-[17px] font-semibold text-navy-900 mb-3">{faq.q}</h2>
              <p className="text-[14px] text-navy-600 leading-[1.75]">{faq.a}</p>
            </div>
          ))}

          <div className="bg-violet-50 border border-violet-200 rounded-[20px] p-8 text-center">
            <p className="text-[15px] font-medium text-navy-800 mb-2">Still have questions?</p>
            <p className="text-[14px] text-navy-600 mb-4">Reach out and we'll get back to you.</p>
            <a
              href="mailto:info@avertune.com"
              className="inline-flex h-9 px-5 text-[13px] font-medium bg-violet-500 text-white rounded-lg items-center hover:bg-violet-600 transition-colors"
            >
              Contact Support
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
