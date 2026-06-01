import Link from "next/link";
import { RevealWrapper } from "@/components/ui/RevealWrapper";

export function CtaSection() {
  return (
    <RevealWrapper>
      <section className="py-20 px-8 text-center" style={{background:"linear-gradient(135deg, #0f0f0f 0%, #1a0a2e 50%, #0f0f0f 100%)"}}>
        <div className="max-w-[1120px] mx-auto">
          <h2 className="font-display font-medium text-white leading-[1.1] mb-4 reveal" style={{fontSize:"clamp(30px,4vw,54px)"}}>
            Avertune understands the situation<br />
            <em className="text-violet-300 italic">better than you do.</em>
          </h2>
          <p className="text-white/55 max-w-[500px] mx-auto mb-10 leading-[1.65] reveal reveal-d1" style={{fontSize:"17px"}}>
            It helps you avoid mistakes and gives you the best way to move every conversation forward.
          </p>
          <div className="flex gap-3.5 justify-center flex-wrap reveal reveal-d2">
            <Link href="/app">
              <button className="h-[52px] px-9 text-base rounded-2xl bg-white text-navy-900 font-semibold inline-flex items-center gap-2 hover:-translate-y-0.5 transition-all cursor-pointer" style={{boxShadow:"0 4px 20px rgba(255,255,255,0.15)"}}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M4 15s2-5 6-7 7-6 7-6" /><circle cx="9" cy="9" r="2.5" fill="currentColor" stroke="none" />
                </svg>
                Start Free — No Card Required
              </button>
            </Link>
            <button className="h-[52px] px-9 text-base rounded-2xl bg-transparent text-white border border-white/30 font-medium inline-flex items-center gap-2 hover:border-white/70 hover:bg-white/10 transition-all cursor-pointer">
              Watch 2-min Demo →
            </button>
          </div>
        </div>
      </section>
    </RevealWrapper>
  );
}
