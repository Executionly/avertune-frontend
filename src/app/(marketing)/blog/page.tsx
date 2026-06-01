import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog | Avertune",
  description: "Communication Intelligence insights, guides, and strategies from Avertune.",
};

const CATEGORIES = [
  "All",
  "Communication Intelligence",
  "Workplace Communication",
  "Sales Communication",
  "Relationship Communication",
  "Negotiation Strategies",
  "Difficult Conversations",
];

const ARTICLES = [
  {
    slug: "how-to-handle-passive-aggressive-emails",
    category: "Difficult Conversations",
    title: "How to Handle Passive-Aggressive Emails Without Making Things Worse",
    excerpt: "Passive-aggressive communication at work is one of the hardest patterns to navigate. Learn how to decode the signals and respond without escalating the situation.",
    author: "Avertune Team",
    date: "May 2025",
    readTime: "6 min read",
  },
  {
    slug: "salary-negotiation-mistakes-professionals-make",
    category: "Negotiation Strategies",
    title: "5 Salary Negotiation Mistakes Most Professionals Make (And How to Avoid Them)",
    excerpt: "Most people leave money on the table not because they lack confidence — but because they don't understand the communication dynamics of negotiation.",
    author: "Avertune Team",
    date: "April 2025",
    readTime: "8 min read",
  },
  {
    slug: "follow-up-emails-that-dont-sound-desperate",
    category: "Sales Communication",
    title: "Writing Follow-Up Emails That Don't Sound Desperate",
    excerpt: "The follow-up is one of the most mishandled parts of the sales process. This guide shows you how to follow up with authority and without losing leverage.",
    author: "Avertune Team",
    date: "April 2025",
    readTime: "5 min read",
  },
  {
    slug: "tone-vs-intent-in-communication",
    category: "Communication Intelligence",
    title: "Tone vs Intent: Why What You Hear Isn't Always What Was Meant",
    excerpt: "Miscommunication rarely happens because someone said the wrong thing. It happens because tone and intent were misread. Here's how to close that gap.",
    author: "Avertune Team",
    date: "March 2025",
    readTime: "7 min read",
  },
  {
    slug: "setting-professional-boundaries-without-damaging-relationships",
    category: "Workplace Communication",
    title: "Setting Professional Boundaries Without Damaging Your Relationships",
    excerpt: "Boundaries at work aren't about being difficult — they're about being clear. Learn how to communicate limits that protect your time and preserve your working relationships.",
    author: "Avertune Team",
    date: "March 2025",
    readTime: "6 min read",
  },
  {
    slug: "communication-intelligence-what-it-means",
    category: "Communication Intelligence",
    title: "What Is Communication Intelligence? A Practical Guide",
    excerpt: "Communication Intelligence is the ability to read a conversation strategically — understanding tone, intent, emotional pressure, and risk — before responding. Here's what that looks like in practice.",
    author: "Avertune Team",
    date: "February 2025",
    readTime: "9 min read",
  },
];

export default function BlogPage() {
  return (
    <main className="bg-cream-100 min-h-screen">
      <section className="bg-navy-900 text-white py-20 px-8">
        <div className="max-w-[1120px] mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-violet-400 mb-4">Resources</p>
          <h1 className="font-display font-medium text-white mb-4" style={{ fontSize: "clamp(28px,4vw,48px)" }}>
            Communication Intelligence Blog
          </h1>
          <p className="text-white/60 text-[15px] leading-[1.7] max-w-[480px]">
            Insights, guides, and strategies to help you communicate more clearly, confidently, and effectively.
          </p>
        </div>
      </section>

      <section className="py-8 px-8 border-b border-navy-900/[0.06] bg-white">
        <div className="max-w-[1120px] mx-auto">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className="px-4 py-2 rounded-full bg-cream-100 border border-navy-200/60 text-[13px] text-navy-600 hover:border-violet-300 hover:text-violet-600 transition-colors"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-8">
        <div className="max-w-[1120px] mx-auto">
          {/* Featured article */}
          <div className="mb-10">
            <div className="bg-navy-900 rounded-[28px] p-10 md:p-14 text-white">
              <span className="inline-block px-3 py-1 rounded-full bg-violet-600/20 text-violet-300 text-[11px] font-semibold uppercase tracking-widest mb-5">
                Featured
              </span>
              <h2 className="text-[28px] md:text-[36px] font-display font-medium text-white mb-4 leading-[1.2] max-w-[700px]">
                {ARTICLES[0].title}
              </h2>
              <p className="text-white/60 text-[15px] leading-[1.7] mb-6 max-w-[580px]">{ARTICLES[0].excerpt}</p>
              <div className="flex items-center gap-4 text-[13px] text-white/40 mb-8">
                <span>{ARTICLES[0].date}</span>
                <span>·</span>
                <span>{ARTICLES[0].readTime}</span>
                <span>·</span>
                <span className="text-violet-400">{ARTICLES[0].category}</span>
              </div>
              <a
                href={`/blog/${ARTICLES[0].slug}`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-violet-600 text-white text-[14px] font-medium hover:bg-violet-500 transition-all"
              >
                Read article
              </a>
            </div>
          </div>

          {/* Article grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ARTICLES.slice(1).map((article) => (
              <a
                key={article.slug}
                href={`/blog/${article.slug}`}
                className="group bg-white border border-navy-100/80 rounded-[24px] p-7 hover:border-violet-200 hover:shadow-sm transition-all flex flex-col"
              >
                <span className="inline-block text-[11px] font-semibold uppercase tracking-widest text-violet-500 mb-4">
                  {article.category}
                </span>
                <h3 className="text-[17px] font-semibold text-navy-800 leading-[1.4] mb-3 group-hover:text-violet-700 transition-colors">
                  {article.title}
                </h3>
                <p className="text-[13px] text-navy-500 leading-[1.65] mb-5 flex-1">{article.excerpt}</p>
                <div className="flex items-center gap-3 text-[12px] text-navy-400 pt-4 border-t border-navy-100">
                  <span>{article.date}</span>
                  <span>·</span>
                  <span>{article.readTime}</span>
                </div>
              </a>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-16 text-center bg-violet-50 border border-violet-100 rounded-[24px] p-10">
            <h3 className="text-[22px] font-semibold text-navy-900 mb-3">Want more communication intelligence?</h3>
            <p className="text-[14px] text-navy-500 mb-6 max-w-[400px] mx-auto">Try Avertune free and see what strategic communication analysis looks like in practice.</p>
            <a href="/auth/signup" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-violet-600 text-white text-[14px] font-medium hover:bg-violet-500 transition-all">
              Start free trial
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
