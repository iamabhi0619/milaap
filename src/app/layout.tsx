import { Overpass, Overpass_Mono, Roboto } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import ClientLayout from "./ClientLayout";


const overpass = Overpass({
  subsets: ["latin"],
  variable: "--font-overpass",
  weight: ["300", "400", "500", "600", "700"],
})

const overpassMono = Overpass_Mono({
  subsets: ["latin"],
  variable: "--font-overpass-mono",
  weight: ["300", "400", "500", "600", "700"],
})

const roboto = Roboto({
  subsets: ["latin"],
  variable: "--font-roboto",
  weight: ["300", "400", "500", "600", "700"],
})

export const metadata = {
  title: 'Milaap',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${roboto.className} ${overpass.className} ${overpassMono.className} antialiased`}>
        <Toaster richColors expand={true} position="top-right" />
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
