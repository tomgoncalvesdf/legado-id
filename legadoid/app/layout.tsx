import type { Metadata, Viewport } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

// ─── FONTES ───────────────────────────────────────────────────────────────────
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

// ─── METADATA ─────────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: {
    default: "LEGADO ID — O lugar onde quem você amou nunca some de verdade",
    template: "%s | LEGADO ID",
  },
  description:
    "Crie um memorial digital bonito, completo e eterno. Preserve fotos, histórias e memórias de quem partiu — para toda a família, para sempre.",
  keywords: [
    "memorial digital",
    "homenagem online",
    "site de obituário",
    "memorial virtual",
    "preservação de memórias",
    "legado digital",
    "memorial família",
  ],
  authors: [{ name: "LEGADO ID" }],
  creator: "LEGADO ID",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: "LEGADO ID",
    title: "LEGADO ID — Preserve a memória de quem você amou",
    description:
      "Crie um memorial digital bonito e eterno. Fotos, histórias, velas virtuais e muito mais — para toda a família, para sempre.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "LEGADO ID — Memorial Digital",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LEGADO ID — Memorial Digital Premium",
    description: "Preserve a memória de quem você amou. Bonito. Eterno. Brasileiro.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#8B6914",
  width: "device-width",
  initialScale: 1,
};

// ─── ROOT LAYOUT ──────────────────────────────────────────────────────────────
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} ${cormorant.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-mist antialiased">
        {children}
        <Toaster
          position="bottom-right"
          expand={false}
          richColors
          toastOptions={{
            style: {
              fontFamily: "var(--font-inter)",
              borderRadius: "16px",
              fontSize: "14px",
            },
            classNames: {
              toast:
                "!bg-stone-900 !border-white/10 !text-white/80 !shadow-xl !shadow-black/40",
              title: "!text-white/90 !font-medium",
              description: "!text-white/50",
              success: "!border-emerald-500/25",
              error: "!border-red-500/25",
              warning: "!border-amber-500/25",
              info: "!border-white/10",
              actionButton: "!bg-amber-medium/20 !text-amber-light",
              cancelButton: "!bg-white/8 !text-white/40",
              closeButton: "!text-white/20 hover:!text-white/60",
            },
          }}
        />
      </body>
    </html>
  );
}
