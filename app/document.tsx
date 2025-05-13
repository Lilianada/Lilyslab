import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en" className="scroll-smooth">
      <Head>
        {/* Preload critical fonts */}
        <link
          rel="preload"
          href="/_next/static/media/geist-sans-font.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/_next/static/media/geist-mono-font.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />

        {/* Favicon and PWA icons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/images/logo.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/images/logo.png" />

        {/* PWA meta tags */}
        <meta name="theme-color" content="#000000" media="(prefers-color-scheme: dark)" />
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="Lily's Lab" />
        <meta name="apple-mobile-web-app-title" content="Lily's Lab" />
        
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Font display optimization */}
        <style dangerouslySetInnerHTML={{
          __html: `
          @font-face {
            font-family: 'Geist Sans';
            font-style: normal;
            font-weight: 400;
            font-display: swap;
            src: url('/_next/static/media/geist-sans-font.woff2') format('woff2');
          }
          @font-face {
            font-family: 'Geist Mono';
            font-style: normal;
            font-weight: 400;
            font-display: swap;
            src: url('/_next/static/media/geist-mono-font.woff2') format('woff2');
          }
        `}} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
