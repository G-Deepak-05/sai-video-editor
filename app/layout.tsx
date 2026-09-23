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

// The Loader plays a countdown on a first visit only (see lib/loaderSeen.ts). That check is a
// localStorage read, which the server can't do — so the server-rendered HTML always includes the
// countdown, and normally React would only hide it after hydrating, a few hundred ms into a
// reload, showing a flash of it every time. This blocking inline script runs before the browser
// paints anything below it, so a returning visitor's very first paint already has it hidden —
// the same technique sites use to avoid a light-mode flash before a dark theme applies.
const HIDE_LOADER_IF_SEEN = `try{if(localStorage.getItem('saikumar-seen-loader-v1')==='1')document.documentElement.classList.add('loader-seen')}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning: the inline script below intentionally adds a class to this
    // element before React hydrates (see HIDE_LOADER_IF_SEEN) — without this flag React treats
    // that as a mismatch and logs a hydration error, even though the mutation is expected.
    <html lang="en" className={`${display.variable} ${sans.variable}`} suppressHydrationWarning>
      <body className="grain">
        <script dangerouslySetInnerHTML={{ __html: HIDE_LOADER_IF_SEEN }} />
        <style>{`html.loader-seen [data-loader-root]{display:none!important}`}</style>
        {children}
      </body>
    </html>
  );
}
