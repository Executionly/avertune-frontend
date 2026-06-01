import { RevealWrapper } from "@/components/ui/RevealWrapper";
import { cn } from "@/lib/utils";

const STEPS = [
  {
    num: "Step 1", title: "Paste the message",
    desc: "Drop in any message you need to respond to. Avertune automatically detects the scenario, language, and communication mode.",
    bg: "from-navy-800 to-navy-700",
    mock: (
      <div className="bg-white/95 rounded-xl p-3.5 w-[88%] shadow-[0_8px_24px_rgba(0,0,0,0.2)]">
        <p className="text-[10px] font-semibold uppercase tracking-[0.06em] text-navy-400 mb-1.5">Message received</p>
        <p className="text-[13px] text-navy-800 leading-[1.5] mb-2.5">&ldquo;We love the proposal but the price is 30% above our budget. Can you do anything on that?&rdquo;</p>
        <div className="flex gap-1.5 flex-wrap">
          <span className="px-2 py-1 rounded-full text-[11px] font-medium bg-violet-50 text-violet-600 border border-violet-200">Sales Mode</span>
          <span className="px-2 py-1 rounded-full text-[11px] font-medium bg-navy-50 text-navy-600 border border-navy-200">Pricing Pressure</span>
        </div>
      </div>
    ),
  },
  {
    num: "Step 2", title: "Avertune analyses & strategises",
    desc: "The intelligence pipeline reads tone, intent, and risk. It builds a recommended strategy — automatically. No prompting required.",
    bg: "from-violet-800 to-violet-600",
    mock: (
      <div className="bg-white/95 rounded-xl p-3.5 w-[88%] shadow-[0_8px_24px_rgba(0,0,0,0.2)]">
        <p className="text-[10px] font-semibold uppercase tracking-[0.06em] text-navy-400 mb-2">Intelligence analysis</p>
        <div className="flex gap-1.5 flex-wrap mb-2">
          <span className="px-2 py-1 rounded-full text-[11px] font-medium bg-violet-50 text-violet-600 border border-violet-200">Intent: Price Test</span>
          <span className="px-2 py-1 rounded-full text-[11px] font-medium bg-teal-50 text-teal-600 border border-teal-200">Risk: Low-Med</span>
        </div>
        <p className="text-[12px] text-navy-700 mb-2">Strategy: Hold value. Acknowledge budget. Redirect to ROI. Never discount first.</p>
        {[{l:"Confidence",v:91},{l:"Leverage",v:78}].map(({l,v})=>(
          <div key={l} className="flex items-center gap-1.5 mb-1">
            <span className="text-[10px] text-navy-400 w-16">{l}</span>
            <div className="flex-1 h-1 bg-cream-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-violet-400 to-teal-400 rounded-full" style={{width:`${v}%`}} />
            </div>
            <span className="text-[10px] font-semibold text-navy-700">{v}%</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    num: "Step 3", title: "Get the response + likely outcome",
    desc: "Multiple ranked response options, each with a predicted outcome. Know how the conversation will likely unfold before you hit send.",
    bg: "from-teal-600 to-navy-800",
    mock: (
      <div className="bg-white/95 rounded-xl p-3.5 w-[88%] shadow-[0_8px_24px_rgba(0,0,0,0.2)]">
        <p className="text-[10px] font-semibold uppercase tracking-[0.06em] text-navy-400 mb-1.5">Recommended response</p>
        <p className="text-[12px] text-navy-800 leading-[1.5] mb-2">&ldquo;I appreciate you sharing that — let&apos;s make sure we&apos;re aligned on the value before we look at numbers...&rdquo;</p>
        <span className="px-2 py-1 rounded-full text-[11px] font-medium bg-teal-50 text-teal-600 border border-teal-200">Outcome: Holds leverage</span>
        <div className="flex items-center gap-1.5 mt-2">
          <span className="text-[10px] text-navy-400 w-16">Confidence</span>
          <div className="flex-1 h-1 bg-cream-200 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-violet-400 to-teal-400 rounded-full" style={{width:"94%"}} />
          </div>
          <span className="text-[10px] font-semibold text-navy-700">94%</span>
        </div>
      </div>
    ),
  },
];

export function HowItWorksSection() {
  return (
    <RevealWrapper>
      <section className="bg-white py-20 px-8" id="how">
        <div className="max-w-[1120px] mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-violet-500 mb-3 reveal">How It Works</p>
            <h2 className="font-display font-medium text-navy-900 mb-4 reveal reveal-d1" style={{fontSize:"clamp(28px,3.8vw,50px)",lineHeight:1.1}}>
              Paste. Analyse. Respond.<br />Know the outcome before you send.
            </h2>
            <p className="text-base text-navy-500 max-w-[520px] mx-auto leading-[1.7] reveal reveal-d2">
              Three steps. Zero prompt engineering. Avertune thinks through the communication situation for you.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {STEPS.map((step, i) => (
              <div key={step.num} className={cn("border border-navy-100/80 rounded-[28px] overflow-hidden bg-white reveal", i===1&&"reveal-d1", i===2&&"reveal-d2")}>
                <div className={cn("h-[200px] flex items-center justify-center p-6 bg-gradient-to-br", step.bg)}>
                  {step.mock}
                </div>
                <div className="p-6 pb-7">
                  <p className="text-[11px] font-semibold text-navy-400 uppercase tracking-[0.06em] mb-1.5">{step.num}</p>
                  <h3 className="text-[18px] font-semibold text-navy-800 mb-2">{step.title}</h3>
                  <p className="text-sm text-navy-500 leading-[1.65]">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </RevealWrapper>
  );
}
