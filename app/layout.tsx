import type { Metadata, Viewport } from "next";
import { Anton, Instrument_Sans } from "next/font/google";
import { site } from "@/lib/site";
import { getSiteContent } from "@/lib/data";
import "./globals.css";

const display = Anton({ weight: "400", subsets: ["latin"], variable: "--font-display", display: "swap" });
const sans = Instrument_Sans({ subsets: ["latin"], variable: "--font-sans", display: "swap" });

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();
  return {
    metadataBase: new URL(site.url),
    title: content.seoTitle,
    description: content.seoDescription,
    alternates: { canonical: "/" },
    openGraph: { title: content.seoTitle, description: content.seoDescription, url: site.url, siteName: content.name, type: "website" },
    twitter: { card: "summary_large_image", title: content.seoTitle, description: content.seoDescription },
  };
}
export const viewport: Viewport = { themeColor: "#0a0a0a" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body className="grain">{children}</body>
    </html>
  );
}
