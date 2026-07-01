const API_URL = "https://avertuneserver.xyz/api";

// ── Types ──────────────────────────────────────────────────────────────────────

export interface BlogPost {
  id: string;
  title: string;
  excerpt?: string;
  content: string;
  featured_image?: string;
  slug: string;
  status?: "draft" | "published";
  category?: string;
  author?: string;
  created_at?: string;
  updated_at?: string;
  published_at?: string;
}

export interface BlogPostsPagination {
  total: number;
  page: number;
  pageSize: number;
  total_pages?: number;
}

export interface BlogPostsResponse {
  posts: BlogPost[];
  pagination?: BlogPostsPagination;
}

export interface GetBlogPostsParams {
  status?: "draft" | "published";
  search?: string;
  page?: number;
  pageSize?: number;
}

// ── Helpers ────────────────────────────────────────────────────────────────────

async function publicFetch(url: string) {
  const res = await fetch(url, { next: { revalidate: 300 } });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as any).message || `API error ${res.status}`);
  }
  return res.json();
}

/** Backend may return a raw array or a { posts, pagination } / { data, pagination } wrapper. */
function normaliseListResponse(data: any): BlogPostsResponse {
  if (Array.isArray(data)) return { posts: data };
  if (Array.isArray(data?.posts))
    return { posts: data.posts, pagination: data.pagination };
  if (Array.isArray(data?.data))
    return { posts: data.data, pagination: data.pagination };
  return { posts: [] };
}

// ── Public read-only endpoints ────────────────────────────────────────────────

export async function getBlogPosts(
  params: GetBlogPostsParams = {},
): Promise<BlogPostsResponse> {
  const query = new URLSearchParams();
  if (params.status) query.set("status", params.status);
  if (params.search) query.set("search", params.search);
  if (params.page) query.set("page", String(params.page));
  if (params.pageSize) query.set("pageSize", String(params.pageSize));
  const qs = query.toString() ? `?${query}` : "";

  const data = await publicFetch(`${API_URL}/admin/blog-posts${qs}`);
  return normaliseListResponse(data);
}

export async function getBlogPostById(id: string): Promise<BlogPost> {
  const data = await publicFetch(`${API_URL}/admin/blog-posts/${id}`);
  return data?.post ?? data;
}

// ── Display helpers (shared by blog list + detail pages) ─────────────────────

export function stripHtml(html: string, maxLen?: number): string {
  const text = html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!maxLen || text.length <= maxLen) return text;
  return `${text.slice(0, maxLen)}…`;
}

export function estimateReadTime(html: string): string {
  const words = stripHtml(html).split(" ").filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}

export function formatPostDate(dateString?: string): string {
  if (!dateString) return "";
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}
