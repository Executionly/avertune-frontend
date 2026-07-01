import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import {
  getBlogPosts,
  getBlogPostById,
  stripHtml,
  formatPostDate,
  type BlogPost,
} from "@/lib/api/blog";

interface PageProps {
  params: { slug: string };
}

/**
 * Backend only exposes get-by-id, not get-by-slug, so we resolve the slug
 * against the published list first, then fetch the full record by id.
 */
async function findPostBySlug(slug: string): Promise<BlogPost | null> {
  const { posts } = await getBlogPosts({ status: "published", pageSize: 100 });
  const match = posts.find((p) => p.slug === slug);
  if (!match) return null;

  try {
    return await getBlogPostById(match.id);
  } catch {
    // Fall back to the list record if the single-post fetch fails
    return match;
  }
}

export async function generateStaticParams() {
  const { posts } = await getBlogPosts({ status: "published", pageSize: 100 });
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const post = await findPostBySlug(params.slug);
  if (!post) return {};
  return {
    title: `${post.title} | Avertune Blog`,
    description: (post.excerpt ?? stripHtml(post.content)).slice(0, 160),
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const post = await findPostBySlug(params.slug);
  if (!post) notFound();

  const date = formatPostDate(post.published_at ?? post.created_at);

  return (
    <main className="bg-cream-100 min-h-screen">
      <article className="max-w-[800px] mx-auto px-8 py-16">
        {/* Back link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-1 text-[14px] text-navy-500 hover:text-violet-600 mb-8 transition-colors"
        >
          <svg
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="w-3.5 h-3.5"
          >
            <path
              d="M10 12L6 8l4-4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Back to blog
        </Link>

        {/* Category badge */}
        <div className="flex items-center gap-3 mb-4">
          {post.category && (
            <span className="inline-block px-3 py-1 rounded-full bg-violet-100 text-violet-700 text-[12px] font-semibold">
              {post.category}
            </span>
          )}
          {date && <span className="text-[13px] text-navy-400">{date}</span>}
        </div>

        {/* Title */}
        <h1 className="font-display font-medium text-navy-900 text-[clamp(32px,5vw,48px)] leading-[1.2] mb-6">
          {post.title}
        </h1>

        {/* Author */}
        <div className="flex items-center gap-3 pb-8 mb-8 border-b border-navy-100">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-navy-700 flex items-center justify-center text-white font-semibold">
            A
          </div>
          <div>
            <p className="text-[14px] font-medium text-navy-800">
              {post.author || "Avertune Team"}
            </p>
            <p className="text-[12px] text-navy-400">
              Communication Intelligence
            </p>
          </div>
        </div>

        {/* Content - using black/dark text */}
        <div
          className="blog-content"
          style={{ color: "#111111" }}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
        {/* CTA at bottom */}
        <div className="mt-12 p-8 bg-white rounded-2xl border border-navy-100 text-center">
          <h3 className="text-[20px] font-semibold text-navy-900 mb-3">
            Ready to improve your communication?
          </h3>
          <p className="text-[14px] text-navy-500 mb-6">
            Try Avertune free and see the difference Communication Intelligence
            makes.
          </p>
          <Link
            href="/auth/signup"
            className="inline-flex px-6 py-3 rounded-xl bg-violet-600 text-white text-[14px] font-medium hover:bg-violet-500 transition-all"
          >
            Start free trial
          </Link>
        </div>
      </article>
    </main>
  );
}
