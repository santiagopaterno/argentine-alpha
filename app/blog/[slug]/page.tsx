import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllPostSlugs, getPostBySlug } from "@/lib/posts";
import type { Metadata } from "next";

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const post = await getPostBySlug(params.slug);
    return {
      title: `${post.title} — Argentine Alpha`,
      description: post.summary,
    };
  } catch {
    return { title: "Post Not Found — Argentine Alpha" };
  }
}

export default async function BlogPost({ params }: Props) {
  let post;
  try {
    post = await getPostBySlug(params.slug);
  } catch {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href="/blog"
        className="text-sm text-accent-blue hover:underline mb-6 inline-block"
      >
        &larr; Back to Blog
      </Link>

      <article>
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-heading">{post.title}</h1>
          <time className="text-sm text-subtle mt-2 block">{post.date}</time>
        </header>

        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />
      </article>
    </div>
  );
}
