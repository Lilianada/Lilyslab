import "./globals.css"
import React from "react"
import type { Metadata, Viewport } from "next"
import { ThemeProvider } from "@/components/theme/theme-provider"
import { AuthProvider } from "@/contexts/auth-context"
import { Toaster } from "@/components/ui/sonner"
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { VisitorBeacon } from "@/components/analytics/VisitorBeacon"
import { PersonStructuredData, WebsiteStructuredData } from '@/components/structured-data';
import FloatingMusicPlayer from '@/components/audio/floating-music-player';
import { FunLayer } from '@/components/fun/FunLayer';

export const viewport: Viewport = {
  themeColor: [{ media: '(prefers-color-scheme: dark)', color: '#000000' }, { media: '(prefers-color-scheme: light)', color: '#ffffff' }],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

const SITE_DESCRIPTION =
  "The digital garden of Lilian Ada (Lily), a writer and software engineer: essays and notes on writing, creativity, digital gardens and the personal web, plus free little web apps like Burn CD and Write Online.";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://lilyslab.xyz"),
  title: {
    default: "Lily's Lab · Lilian Ada, writer and software engineer",
    template: "%s | Lily's Lab",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "Lilian Ada",
    "Lily's Lab",
    "Lilyslab",
    "writer",
    "essays",
    "digital garden",
    "personal website",
    "indie web",
    "writing",
    "creativity",
    "software engineer",
    "product manager",
  ],
  authors: [{ name: "Lilian Ada", url: "https://lilyslab.xyz" }],
  creator: "Lilian Ada",
  publisher: "Lilian Ada",
  category: "Writing",
  applicationName: "Lily's Lab",
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large", "max-video-preview": -1 },
  },
  // Paste the code from Google Search Console (and Bing Webmaster Tools) into
  // these environment variables on Netlify to prove you own the site.
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    other: process.env.BING_SITE_VERIFICATION ? { "msvalidate.01": process.env.BING_SITE_VERIFICATION } : undefined,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://lilyslab.xyz",
    title: "Lily's Lab",
    description: SITE_DESCRIPTION,
    siteName: "Lily's Lab",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lily's Lab",
    description: SITE_DESCRIPTION,
    creator: "@lilian_ada_",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/images/logo.png",
  },
  manifest: "/manifest.json",
  alternates: {
    types: {
      "application/rss+xml": "/feed",
      "application/atom+xml": "/feed?format=atom",
      "application/json": "/feed?format=json",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // This will be true for all routes except those in the (no-sidebar) group
  // Next.js handles this automatically based on route groups

  return (
    <html lang="en" suppressHydrationWarning className={`scroll-smooth ${GeistSans.variable} ${GeistMono.variable}`}>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="me" href="https://github.com/lilianada" />

        {/* Structured Data for SEO */}
        <PersonStructuredData />
        <WebsiteStructuredData />

        {/* Webmention endpoints */}
        <link 
          rel="webmention" 
          href="https://webmention.io/lilyslab.xyz/webmention" 
        />
        <link 
          rel="pingback" 
          href="https://webmention.io/lilyslab.xyz/xmlrpc" 
        />
      </head>
      <body className="font-sans">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <AuthProvider>
              <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:p-4 focus:bg-background focus:z-50" aria-label="Skip to main content">
                Skip to main content
              </a>
              <main id="main-content">
                {children}
              </main>
              <Toaster />
              <FloatingMusicPlayer />
              <FunLayer />
              <VisitorBeacon />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

