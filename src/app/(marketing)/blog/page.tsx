import type { Metadata } from "next";
import Link from "next/link";
import {
  getBlogPosts,
  stripHtml,
  estimateReadTime,
  formatPostDate,
} from "@/lib/api/blog";

export const metadata: Metadata = {
  title: "Blog | Avertune",
  description:
    "Communication Intelligence insights, guides, and strategies from Avertune.",
};

const CATEGORIES = [
  "All",
  "Communication Intelligence",
  "Sales Communication",
  "Workplace Communication",
  "Negotiation Strategies",
];

export default async function BlogPage() {
  const { posts } = await getBlogPosts({ status: "published", pageSize: 100 });

  return (
    <main className="bg-cream-100 min-h-screen">
      {/* Hero */}
      <section className="bg-navy-900 text-white py-20 px-8">
        <div className="max-w-[1120px] mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-violet-400 mb-4">
            Resources
          </p>
          <h1
            className="font-display font-medium text-white mb-4"
            style={{ fontSize: "clamp(28px,4vw,48px)" }}
          >
            Communication Intelligence Blog
          </h1>
          <p className="text-white/60 text-[15px] leading-[1.7] max-w-[480px]">
            Insights, guides, and strategies to help you communicate more
            clearly, confidently, and effectively.
          </p>
        </div>
      </section>

      {/* Category filters */}
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

      {/* Articles grid */}
      <section className="py-16 px-8">
        <div className="max-w-[1120px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.map((post) => {
              const date = formatPostDate(post.published_at ?? post.created_at);
              return (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group bg-white border border-navy-100/80 rounded-[24px] p-8 hover:border-violet-200 hover:shadow-sm transition-all flex flex-col"
                >
                  {post.category && (
                    <span className="inline-block text-[11px] font-semibold uppercase tracking-widest text-violet-500 mb-4">
                      {post.category}
                    </span>
                  )}
                  <h3 className="text-[18px] font-semibold text-navy-800 leading-[1.4] mb-3 group-hover:text-violet-700 transition-colors line-clamp-3">
                    {post.title}
                  </h3>
                  <p className="text-[14px] text-navy-500 leading-[1.65] mb-5 flex-1 line-clamp-3">
                    {post.excerpt || stripHtml(post.content, 220)}
                  </p>
                  <div className="flex items-center gap-3 text-[12px] text-navy-400 pt-4 border-t border-navy-100">
                    {date && (
                      <>
                        <span>{date}</span>
                        <span>·</span>
                      </>
                    )}
                    <span>{estimateReadTime(post.content)}</span>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* CTA */}
          <div className="mt-16 text-center bg-violet-50 border border-violet-100 rounded-[24px] p-10">
            <h3 className="text-[22px] font-semibold text-navy-900 mb-3">
              Want more communication intelligence?
            </h3>
            <p className="text-[14px] text-navy-500 mb-6 max-w-[400px] mx-auto">
              Try Avertune free and see what strategic communication analysis
              looks like in practice.
            </p>
            <Link
              href="/auth/signup"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-violet-600 text-white text-[14px] font-medium hover:bg-violet-500 transition-all"
            >
              Start free trial
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
