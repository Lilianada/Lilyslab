import "./globals.css"
import React from "react"
import type { Metadata, Viewport } from "next"
import { ThemeProvider } from "@/components/theme/theme-provider"
import { AuthProvider } from "@/contexts/auth-context"
import { Toaster } from "@/components/ui/sonner"
import "prismjs/themes/prism-tomorrow.css"
import "katex/dist/katex.min.css"
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { Analytics } from "@vercel/analytics/next"
import { PersonStructuredData, WebsiteStructuredData } from '@/components/structured-data';
import FloatingMusicPlayer from '@/components/audio/floating-music-player';

export const viewport: Viewport = {
  themeColor: [{ media: '(prefers-color-scheme: dark)', color: '#000000' }, { media: '(prefers-color-scheme: light)', color: '#ffffff' }],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL || 'https://lilyslab.xyz'),
  title: {
    default: "Lily's Lab",
    template: "%s | Lily's Lab",
  },
  description: "Software engineer, product manager, and digital creator",
  keywords: ["design", "development", "product management", "portfolio", "Lilian Ada", "Lilyslab", "Lily's Lab", "artificial intelligence", "machine learning", "software engineer", "product manager", "digital creator"],
  authors: [{ name: "Lilian Ada", url: "https://lilianada.com" }],
  creator: "Lilian Ada",
  publisher: "Lilian Ada",
  category: "Technology",
  applicationName: "Lily's Lab",
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://lilyslab.xyz",
    title: "Lily's Lab",
    description: "Software engineer, product manager, and digital creator",
    siteName: "Lily's Lab",
    images: [
      {
        url: "/images/logo.png",
        width: 512,
        height: 512,
        alt: "Lily's Lab",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lily's Lab",
    description: "Designer, software engineer, product manager, and digital creator",
    creator: "@lilian_ada_",
    images: ["/images/logo.png"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/images/logo.png",
  },
  manifest: "/manifest.json",
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en-US',
    },
    types: {
      'application/rss+xml': '/feed',
      'application/atom+xml': '/feed?format=atom',
      'application/json': '/feed?format=json',
    },
  },
  verification: {
    google: 'google-site-verification-code',
  },
}

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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="referrer" content="strict-origin-when-cross-origin" />
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="Permissions-Policy" content="camera=(), microphone=(), geolocation=()" />
        
        {/* Structured Data for SEO */}
        <PersonStructuredData />
        <WebsiteStructuredData />
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
              <Analytics />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

