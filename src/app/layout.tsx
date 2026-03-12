import type { Metadata, Viewport } from "next";
import { Overpass, Overpass_Mono, Roboto, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import ClientLayout from "./ClientLayout";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

const overpass = Overpass({
  subsets: ["latin"],
  variable: "--font-overpass",
  weight: ["300", "400", "500", "600", "700"],
});

const overpassMono = Overpass_Mono({
  subsets: ["latin"],
  variable: "--font-overpass-mono",
  weight: ["300", "400", "500", "600", "700"],
});

const roboto = Roboto({
  subsets: ["latin"],
  variable: "--font-roboto",
  weight: ["300", "400", "500", "600", "700"],
});

// Comprehensive SEO Metadata
export const metadata: Metadata = {
  title: {
    default: 'Milaap - Connect, Chat, and Collaborate',
    template: '%s | Milaap'
  },
  description: 'Milaap is a modern messaging platform for real-time communication. Connect with friends, family, and teams with instant messaging, voice messages, file sharing, and more.',
  keywords: ['chat', 'messaging', 'real-time', 'communication', 'instant messaging', 'team collaboration', 'secure chat', 'milaap'],
  authors: [{ name: 'Milaap Team' }],
  creator: 'Milaap',
  publisher: 'Milaap',

  // Open Graph (Facebook, LinkedIn)
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://milaap.iamabhi.dev',
    title: 'Milaap - Connect, Chat, and Collaborate',
    description: 'Modern, secure messaging platform for real-time communication with instant messaging, voice messages, and file sharing.',
    siteName: 'Milaap',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Milaap - Modern Messaging Platform',
      }
    ],
  },

  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: 'Milaap - Connect, Chat, and Collaborate',
    description: 'Modern, secure messaging platform for real-time communication.',
    images: ['/twitter-image.png'],
    creator: '@milaap',
  },

  // PWA Manifest
  manifest: '/manifest.json',

  // App Links
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Milaap',
  },

  // Format Detection
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },

  // Icons
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png' },
      { url: '/apple-icon-180.png', sizes: '180x180', type: 'image/png' },
    ],
  },

  // Verification
  verification: {
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },

  // Other metadata
  category: 'technology',
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
};

// Viewport configuration
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("font-sans", inter.variable)}>
      <body className={`${roboto.className} ${overpass.className} ${overpassMono.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange>
          <ClientLayout>
            {children}
            <Toaster position="top-right" richColors />
          </ClientLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
