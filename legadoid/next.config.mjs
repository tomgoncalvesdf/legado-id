/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // ─── Imagens externas permitidas ────────────────────────────────────────────
  images: {
    remotePatterns: [
      {
        // Supabase Storage (imagens dos memoriais)
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        // Supabase Storage (URL alternativa)
        protocol: "https",
        hostname: "*.supabase.in",
        pathname: "/storage/v1/object/public/**",
      },
      {
        // Avatares OAuth (Google, GitHub, etc.)
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
    ],
    // Formatos modernos
    formats: ["image/avif", "image/webp"],
    // Tamanhos de dispositivo
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Cache de 30 dias
    minimumCacheTTL: 2592000,
  },

  // ─── Headers de segurança (complementa o vercel.json) ───────────────────────
  async headers() {
    const ContentSecurityPolicy = [
      "default-src 'self'",
      // Scripts: Next.js inline + Mercado Pago SDK
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://sdk.mercadopago.com https://http2.mlstatic.com",
      // Estilos: Google Fonts
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      // Fontes: Google Fonts
      "font-src 'self' https://fonts.gstatic.com",
      // Imagens: Supabase Storage + dados inline
      "img-src 'self' blob: data: https://*.supabase.co https://*.supabase.in https://lh3.googleusercontent.com https://avatars.githubusercontent.com",
      // Conexões: Supabase API + Realtime + Mercado Pago
      "connect-src 'self' https://*.supabase.co https://*.supabase.in wss://*.supabase.co https://api.mercadopago.com",
      // Frames: Mercado Pago checkout
      "frame-src 'self' https://www.mercadopago.com.br https://www.mercadopago.com",
      // Media
      "media-src 'self' blob: https://*.supabase.co",
      // Worker (Next.js service worker)
      "worker-src 'self' blob:",
    ].join("; ");

    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: ContentSecurityPolicy.replace(/\n/g, ""),
          },
        ],
      },
    ];
  },

  // ─── Redirects de rotas legadas ──────────────────────────────────────────────
  // (Os principais estão no vercel.json; aqui ficam os do Next.js runtime)
  async redirects() {
    return [];
  },

  // ─── Configurações experimentais ─────────────────────────────────────────────
  experimental: {
    // Otimiza importações de ícones Lucide (tree-shaking)
    optimizePackageImports: ["lucide-react"],
  },

  // ─── Webpack customizations ──────────────────────────────────────────────────
  // (adicionar regras customizadas aqui quando necessário)
  // webpack(config) { return config; },

  // ─── Variáveis de ambiente públicas injetadas no bundle ─────────────────────
  // (Use NEXT_PUBLIC_ prefix nas .env — isso é só documentação)
  // env: {},

  // ─── Compressão ──────────────────────────────────────────────────────────────
  compress: true,

  // ─── Poweredby header ────────────────────────────────────────────────────────
  poweredByHeader: false,

  // ─── Trailing slash ──────────────────────────────────────────────────────────
  trailingSlash: false,
};

export default nextConfig;
