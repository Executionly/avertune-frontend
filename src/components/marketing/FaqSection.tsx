"use client";

import { useState } from "react";
import { RevealWrapper } from "@/components/ui/RevealWrapper";
import { cn } from "@/lib/utils";

const FAQS = [
  { q: "What exactly is Avertune?", a: "Avertune is a Communication Intelligence Platform — not a messaging tool or AI writer. It reads the situation, detects tone and intent, assesses risk, builds a strategy, generates a calibrated response, and simulates the likely outcome. It's the difference between \"write this better\" and \"here's what's actually going on and here's the smartest way to respond.\"" },
  { q: "Do I need to write prompts or explain the context?", a: "No. Paste the message. That's it. Avertune's 14-step intelligence pipeline runs automatically — detecting language, classifying the scenario, reading tone and intent, scoring risk, and building a recommended strategy. If it needs one input from you, it will ask one smart question. Otherwise it generates immediately." },
  { q: "What are the three communication modes?", a: "Professional Mode handles workplace communication — emails, negotiations, difficult conversations, recruiter outreach, performance discussions. Sales Mode handles deal-making — objections, pricing pressure, follow-ups, closing. Relationship Mode handles personal communication — dating, family, friendships, boundary setting, conflict resolution. Each mode has a dedicated intelligence engine tuned to the specific dynamics of that context." },
  { q: "What is the Communication Intelligence Score?", a: "Every interaction generates a score across clarity, tone match, escalation risk, and confidence. Over time, these scores build your Communication Intelligence Profile — exposing patterns like over-apologising or over-explaining under pressure, and tracking measurable improvement across clarity, negotiation strength, emotional control, and boundary effectiveness." },
  { q: "Is Avertune suitable for enterprise teams?", a: "Yes. Avertune is built with enterprise readiness in mind. The Playbook Engine lets companies define communication standards — sales playbooks, HR playbooks, customer support playbooks. Team analytics surface communication patterns across departments. The architecture supports org-level insights, team coaching, and eventually integration with Gmail, Outlook, Slack, LinkedIn, HubSpot, and Salesforce." },
];

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(null);
  const toggle = (i: number) => setOpen(open === i ? null : i);

  return (
    <RevealWrapper>
      <section className="bg-white py-20 px-8" id="faq">
        <div className="max-w-[1120px] mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-violet-500 mb-3 reveal">FAQ</p>
            <h2 className="font-display font-medium text-navy-900 mb-4 reveal reveal-d1" style={{fontSize:"clamp(28px,3.8vw,50px)",lineHeight:1.1}}>
              Frequently asked questions
            </h2>
            <p className="text-base text-navy-500 max-w-[480px] mx-auto leading-[1.7] reveal reveal-d2">
              What makes Avertune different from every other AI communication tool.
            </p>
          </div>
          <div className="max-w-[780px] mx-auto reveal">
            {FAQS.map((faq, i) => (
              <div key={faq.q} className="border-b border-navy-900/[0.08]">
                <button onClick={() => toggle(i)}
                  className="w-full flex justify-between items-center py-5 text-left text-[15px] font-medium text-navy-800 gap-4 cursor-pointer hover:text-navy-900 transition-colors">
                  {faq.q}
                  <span className={cn("w-6 h-6 rounded-md flex items-center justify-center text-xl flex-shrink-0 transition-all duration-200",
                    open === i ? "rotate-45 bg-violet-500 text-white" : "bg-violet-50 text-violet-500")}>+</span>
                </button>
                <div className={cn("overflow-hidden transition-all duration-[380ms] ease-in-out", open === i ? "max-h-[300px] pb-5" : "max-h-0")}>
                  <p className="text-[15px] text-navy-500 leading-[1.7]">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </RevealWrapper>
  );
}
