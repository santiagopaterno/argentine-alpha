import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — Argentine Alpha",
  description: "About Argentine Alpha and its creator.",
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-heading mb-6">About</h1>

      <div className="panel space-y-6">
        <div>
          <h2 className="text-lg text-heading mb-2">
            What is Argentine Alpha?
          </h2>
          <p className="text-muted leading-relaxed">
            Argentine Alpha is a single-page dashboard and research hub built
            for international investors with exposure to — or interest in —
            Argentine assets. It combines live market data, equity valuation
            metrics, and curated political context into one English-language
            resource, filling the gap left by scattered and often
            Spanish-only coverage of Latin America&apos;s most dynamic
            frontier market.
          </p>
        </div>

        <div>
          <h2 className="text-lg text-heading mb-2">
            Who&apos;s behind it?
          </h2>
          <p className="text-muted leading-relaxed">
            Santiago is an economics graduate based in Buenos Aires. He built
            Argentine Alpha to bridge the information gap for international
            investors who follow Argentina but lack access to local-language
            sources and on-the-ground context. This project combines his
            background in economics and finance with a growing interest in
            software development.
          </p>
        </div>

        <div className="flex gap-4 pt-2">
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-accent-blue hover:underline"
          >
            LinkedIn
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-accent-blue hover:underline"
          >
            GitHub
          </a>
          <a
            href="mailto:hello@example.com"
            className="text-sm text-accent-blue hover:underline"
          >
            Email
          </a>
        </div>
      </div>
    </div>
  );
}
