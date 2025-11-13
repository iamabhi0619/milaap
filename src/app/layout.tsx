import type { Metadata, Viewport } from "next";
import { Overpass, Overpass_Mono, Roboto } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import ClientLayout from "./ClientLayout";
import { ThemeProvider } from "@/components/theme-provider";


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
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                function getCookie(name) {
                  const nameEQ = name + "=";
                  const ca = document.cookie.split(";");
                  for (let i = 0; i < ca.length; i++) {
                    let c = ca[i];
                    while (c.charAt(0) === " ") c = c.substring(1, c.length);
                    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
                  }
                  return null;
                }
                
                const presets = {
                  "native-blues": {
                    primary: "oklch(0.45 0.12 240)",
                    accent: "oklch(0.55 0.10 220)",
                    secondary: "oklch(0.90 0.02 240)",
                  },
                  "ocean-breeze": {
                    primary: "oklch(0.45 0.15 200)",
                    accent: "oklch(0.55 0.12 180)",
                    secondary: "oklch(0.88 0.02 190)",
                  },
                  "sunset-glow": {
                    primary: "oklch(0.50 0.18 30)",
                    accent: "oklch(0.60 0.15 40)",
                    secondary: "oklch(0.88 0.02 35)",
                  },
                  "midnight-sky": {
                    primary: "oklch(0.35 0.12 270)",
                    accent: "oklch(0.50 0.15 280)",
                    secondary: "oklch(0.88 0.02 275)",
                  },
                };
                
                const savedPreset = getCookie("themePreset") || "native-blues";
                const savedScale = getCookie("scale") || "";
                const savedRadius = getCookie("radius") || "";
                
                const root = document.documentElement;
                
                // Apply theme colors
                const colors = presets[savedPreset];
                if (colors) {
                  root.style.setProperty("--primary", colors.primary);
                  root.style.setProperty("--accent", colors.accent);
                  root.style.setProperty("--secondary", colors.secondary);
                }
                
                // Apply scale
                const scaleValues = { "": "1", "xs": "0.875", "lg": "1.125" };
                root.style.fontSize = (parseFloat(scaleValues[savedScale] || "1") * 100) + "%";
                root.style.setProperty("--spacing", savedScale === "" ? "0.25rem" : "calc(0.25rem * " + scaleValues[savedScale] + ")");
                
                // Apply radius
                const radiusValues = { "": "0.5rem", "sm": "0.25rem", "xl": "0.75rem" };
                root.style.setProperty("--radius", radiusValues[savedRadius] || "0.5rem");
              })();
            `,
          }}
        />
      </head>
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
