import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import "./notion.css"
import Sidebar from "@/components/sidebar"
import { ThemeProvider } from "@/components/theme-provider"
import MobileNav from "@/components/mobile-nav"
import { AuthProvider } from "@/contexts/auth-context"
import { Toaster } from "@/components/ui/toaster"
import "prismjs/themes/prism-tomorrow.css"
import "katex/dist/katex.min.css"
import { Breadcrumb } from "@/components/breadcrumb-nav"
import { BuyMeCoffee } from "@/components/buy-me-coffee"
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';




export const metadata: Metadata = {
  title: {
    default: "Lily's Lab",
    template: "%s | Lily's Lab",
  },
  description: "Software engineer, product manager, and digital creator",
  keywords: ["design", "development", "product management", "portfolio", "Lilian Ada", "Lilyslab", "Lily's Lab", "artificial intelligence", "machine learning", "software engineer", "product manager", "digital creator"],
  authors: [{ name: "Lilian Ada" }],
  creator: "Lilian Ada",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://lilyslab.xyz",
    title: "Lily's Lab",
    description: "Software engineer, product manager, and digital creator",
    siteName: "Lily's Lab",
    images: [
      {
        url: "/12.png",
        width: 1200,
        height: 1200,
        alt: "Lily's Lab",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lily's Lab",
    description: "Designer, software engineer, product manager, and digital creator",
    creator: "@lilian_ada_",
    images: ["/12.png"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/12.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
     <body className={GeistSans.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <main className="flex min-h-screen flex-col bg-background  transition-colors duration-300 lg:flex-row relative">
              <Sidebar />
              <MobileNav />
              <div className="flex-1 px-4 py-6 lg:px-8 lg:py-10 "> 
                <Breadcrumb />
                {children}
              </div>
            </main>
            <Toaster />
            <BuyMeCoffee />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

