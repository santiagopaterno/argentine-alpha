import Link from "next/link";
import { getAllPosts } from "@/lib/posts";

export const metadata = {
  title: "Blog — Argentine Alpha",
  description: "Analysis and notes on Argentine markets, policy, and economics.",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Blog</h1>
        <p className="text-sm text-gray-400 mt-1">
          Analysis and notes on Argentine markets, policy, and economics.
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="bg-navy-800 rounded-xl border border-navy-600 p-8 text-center">
          <p className="text-gray-400">
            No posts yet. Add markdown files to the{" "}
            <code className="text-accent-cyan bg-navy-700 px-1.5 py-0.5 rounded text-sm">
              /posts
            </code>{" "}
            folder to get started.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="block bg-navy-800 rounded-xl border border-navy-600 p-5 hover:border-accent-blue/50 transition-colors group"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-white group-hover:text-accent-blue transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-sm text-gray-400 mt-1">{post.summary}</p>
                </div>
                <time className="text-xs text-gray-500 whitespace-nowrap mt-1">
                  {post.date}
                </time>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
