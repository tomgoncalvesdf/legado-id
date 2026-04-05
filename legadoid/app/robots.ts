import { MetadataRoute } from "next";

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ?? "https://legadoid.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/painel/",
          "/criar/",
          "/admin/",
          "/api/",
          "/auth/",
          "/_next/",
        ],
      },
      {
        // Bloquear crawlers de IA de indexar conteúdo sensível de memoriais
        userAgent: [
          "GPTBot",
          "ChatGPT-User",
          "CCBot",
          "anthropic-ai",
          "Claude-Web",
          "PerplexityBot",
        ],
        disallow: ["/"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
