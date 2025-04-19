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
import "react-notion-x/src/styles.css"
import "prismjs/themes/prism-tomorrow.css"
import "katex/dist/katex.min.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "Lily's Lab",
    template: "%s | Lily's Lab",
  },
  description: "Designer, software engineer, product manager, and digital creator",
  keywords: ["design", "development", "product management", "portfolio", "Lilian Okeke"],
  authors: [{ name: "Lilian Okeke" }],
  creator: "Lilian Okeke",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://lilyslab.xyz",
    title: "Lily's Lab",
    description: "Designer, software engineer, product manager, and digital creator",
    siteName: "Lily's Lab",
    images: [
      {
        url: "/logo.png",
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
    images: ["/logo.png"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/logo.png",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <div className="flex min-h-screen flex-col bg-background dark:bg-[#111] transition-colors duration-300 md:flex-row">
              <Sidebar />
              <MobileNav />
              <main className="flex-1 px-4 py-6 md:px-8 md:py-10 main-noise-bg"> <Breadcrumb />{children}</main>
            </div>
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}


import './globals.css'
import { Breadcrumb } from "@/components/breadcrumb-nav"
