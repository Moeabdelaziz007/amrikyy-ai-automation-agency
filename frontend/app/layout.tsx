// app/layout.tsx - Enhanced Layout with Performance Optimizations
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '../components/theme-provider';
import { PerformanceMonitor } from '../components/ui/PerformanceMonitor';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
});

export const metadata: Metadata = {
  title: 'Amrikyy AI Automation Agency',
  description: 'Revolutionizing AI with Advanced Automation Solutions',
  keywords: ['AI', 'Automation', 'AI Agency', 'Technology', 'Innovation'],
  authors: [{ name: 'Amrikyy AI Team' }],
  creator: 'Amrikyy AI',
  publisher: 'Amrikyy AI',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://amrikyy-ai.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Amrikyy AI Automation Agency',
    description: 'Revolutionizing AI with Advanced Automation Solutions',
    url: 'https://amrikyy-ai.vercel.app',
    siteName: 'Amrikyy AI Automation Agency',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Amrikyy AI Automation Agency',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Amrikyy AI Automation Agency',
    description: 'Revolutionizing AI with Advanced Automation Solutions',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Critical CSS Inline */}
        <style dangerouslySetInnerHTML={{ 
          __html: `
            * { margin: 0; padding: 0; box-sizing: border-box; }
            html { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
            body { background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%); color: #ffffff; }
            .loading { display: inline-block; width: 20px; height: 20px; border: 2px solid #00ff88; border-radius: 50%; border-top-color: transparent; animation: spin 1s linear infinite; }
            @keyframes spin { to { transform: rotate(360deg); } }
          ` 
        }} />
        
        {/* Preload Critical Resources */}
        <link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/images/hero-bg.webp" as="image" />
        
        {/* DNS Prefetch */}
        <link rel="dns-prefetch" href="//cdn.stayx-team.com" />
        <link rel="dns-prefetch" href="//api.stayx-team.com" />
        
        {/* Preconnect to Critical Domains */}
        <link rel="preconnect" href="https://cdn.stayx-team.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://api.stayx-team.com" crossOrigin="anonymous" />
        
        {/* Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js')
                    .then((registration) => {
                      console.log('SW registered: ', registration);
                    })
                    .catch((registrationError) => {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />
        
        {/* Standard Meta Tags */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#00ff41" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Amrikyy AI" />
        <meta name="application-name" content="Amrikyy AI" />
        <meta name="msapplication-TileColor" content="#00ff41" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <div className="min-h-screen bg-gradient-to-br from-carbon-black to-medium-gray">
            {children}
            <PerformanceMonitor />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
