import React from "react"
import type { Metadata, Viewport } from "next"
import "./globals.css"
import Sidebar from "@/components/sidebar"
import { ThemeProvider } from "@/components/theme-provider"
import MobileNav from "@/components/mobile-nav"
import { AuthProvider } from "@/contexts/auth-context"
import { Toaster } from "@/components/ui/toaster"
import "prismjs/themes/prism-tomorrow.css"
import "katex/dist/katex.min.css"
import { Breadcrumb } from "@/components/breadcrumb-nav"
import { BuyMeCoffee } from "@/components/buy-me-coffee"
import { AudioProvider } from "@/lib/audio/audio-context"
// ViewCounter temporarily removed to fix build errors
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { PersonStructuredData, WebsiteStructuredData } from '@/components/structured-data';



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
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <head>
        {/* PWA Meta Tags */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        
        {/* Performance Optimization */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />
        
        {/* Security Headers */}
        <meta name="referrer" content="strict-origin-when-cross-origin" />
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        {/* <meta httpEquiv="X-Frame-Options" content="DENY" /> */}
        <meta httpEquiv="Permissions-Policy" content="camera=(), microphone=(), geolocation=()" />
        
        {/* Structured Data for SEO */}
        <PersonStructuredData />
        <WebsiteStructuredData />
        
        {/* Service Worker */}
        <script src="/sw-register.js" defer></script>
      </head>
      <body className={GeistSans.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <AudioProvider>
              <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:p-4 focus:bg-background focus:z-50" aria-label="Skip to main content">
                Skip to main content
              </a>
              <main id="main-content" className="flex min-h-screen flex-col bg-background transition-colors duration-300 lg:flex-row relative">
                <Sidebar />
                <MobileNav />
                <div className="flex-1 px-4 py-6 lg:px-8 lg:py-10 flex flex-col min-h-[calc(100vh-4rem)]" role="region" aria-label="Main content"> 
                  <Breadcrumb />
                  <div className="flex-1 flex flex-col">
                    {children}
                  </div>
                </div>
              </main>
              <Toaster />
              <BuyMeCoffee />
              {/* ViewCounter temporarily removed to fix build errors */}
            </AudioProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

