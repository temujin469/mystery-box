
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/providers/Providers";
import { Toaster } from "@/components/ui/sonner";
import { ModalManager } from "@/components/modal";

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
  title: "Mystery Box",
  description: "Modern gaming mystery box experience",
};

export const viewport = {
  width: "device-width",
  initialScale: 1.0,
  maximumScale: 1.0,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}
      >
        {/* <div className="bg-[url(/img/skulls.png)] bg-background"> */}
        <Providers>
          {children}
          <Toaster position="bottom-right" richColors />
          <ModalManager />
        </Providers>
        {/* </div> */}
      </body>
    </html>
  );
}
