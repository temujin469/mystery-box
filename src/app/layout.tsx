import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/providers/Providers";
import { Toaster } from "@/components/ui/sonner";
import { ModalManager } from "@/components/modal";
import PWAInstaller from "@/components/PWAInstaller";

// Inter font with Cyrillic support - excellent for Mongolian text
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  display: "swap",
});

// JetBrains Mono with Cyrillic support for monospace text
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Нууцлаг хайрцаг",
    template: "%s | Нууцлаг хайрцаг", // Template for dynamic titles
  },
  description: "Онлайнаар нууцлаг хайрцаг нээж, бүтээгдэхүүн хожоорой",
  keywords: [
    "mystery box",
    "гайхамшигт хайрцаг",
    "онлайн тоглоом",
    "коллекц",
    "ховор зүйлс",
    "тоглоомын хайрцаг",
    "Монгол",
    "gaming",
    "collection",
    "rare items",
  ],
  authors: [{ name: "temuujin" }],
  creator: "Temuujin",
  publisher: "Temuujin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    //Open Graph protocol is used to integrate web pages into the social graph.
    title: "Нууцлаг хайрцаг",
    description: "Онлайнаар нууцлаг хайрцаг нээж, бүтээгдэхүүн хожоорой",
    url: "/",
    siteName: "Нууцлаг хайрцаг",
    locale: "mn_MN",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Нууцлаг хайрцаг",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Нууцлаг хайрцаг",
    description: "Онлайнаар нууцлаг хайрцаг нээж, бүтээгдэхүүн хожоорой",
    images: ["/twitter-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1.0,
  maximumScale: 1.0,
  minimumScale: 1.0,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="mn" dir="ltr">
      <head>
        <link rel="icon" href="/favicon/favicon.ico" sizes="any" />
        <link
          rel="icon"
          href="/favicon/favicon-16x16.png"
          type="image/png"
          sizes="16x16"
        />
        <link
          rel="icon"
          href="/favicon/icon-32x32.png"
          type="image/png"
          sizes="32x32"
        />
        <link rel="apple-touch-icon" href="/favicon/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="msapplication-tap-highlight" content="no" />

        {/* PWA Meta Tags */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="Нууцлаг хайрцаг" />
        <meta name="application-name" content="Нууцлаг хайрцаг" />
        <meta name="msapplication-tooltip" content="Нууцлаг хайрцаг" />
        <meta name="msapplication-starturl" content="/" />
      </head>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <PWAInstaller />
        <Providers>
          {children}
          <Toaster position="bottom-right" richColors />
          <ModalManager />
        </Providers>
      </body>
    </html>
  );
}
