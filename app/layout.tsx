import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const heading = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Manifest Kapchorwa — Church Ministry in Kapchorwa, Uganda",
    template: "%s | Manifest Kapchorwa",
  },
  description:
    "Official church ministry website for Manifest Kapchorwa in the scenic highlands of Eastern Uganda. Join us for Sunday worship, discipleship, written devotionals, and community fellowship.",
  keywords: [
    "Manifest Kapchorwa",
    "Church in Kapchorwa",
    "Kapchorwa Uganda",
    "Sebei church",
    "Christian ministry Uganda",
    "Sunday worship Kapchorwa",
    "Uganda devotions",
    "Prayer requests Uganda",
  ],
  authors: [{ name: "Manifest Kapchorwa Ministry Team" }],
  creator: "Manifest Kapchorwa",
  manifest: "/manifest.webmanifest",
  openGraph: {
    type: "website",
    locale: "en_UG",
    url: "https://manifestkapchorwa.org",
    siteName: "Manifest Kapchorwa",
    title: "Manifest Kapchorwa — Church Ministry in Kapchorwa, Uganda",
    description:
      "A vibrant, Christ-centered church community worshipping God in the scenic highlands of Kapchorwa, Uganda.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#72b729", // Vibrant Brand Green
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${sans.variable} ${heading.variable}`} suppressHydrationWarning>
      <body className="min-h-screen font-sans antialiased flex flex-col bg-white text-neutral-900" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
