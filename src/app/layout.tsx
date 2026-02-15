import type { Metadata, Viewport } from "next";
import "./globals.css";

// 1. Mobile App Feel (Prevents zooming, sets color)
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, 
  themeColor: "#0f172a", 
};

// 2. SEO & Branding
export const metadata: Metadata = {
  title: "Choronko WIFI | Premium Internet",
  description: "High-speed, unlimited internet access. Instant connection with MTN & Orange Money.",
  openGraph: {
    title: "Choronko WIFI",
    description: "Get unlimited internet access now.",
    siteName: "Choronko WIFI",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#F8FAFC] text-slate-900">
        {children}
      </body>
    </html>
  );
}