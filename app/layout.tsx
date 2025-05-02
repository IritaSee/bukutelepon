import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LokaPedia Bali",
  description: "Cari dan temukan UMKM di Bali dengan mudah",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <nav className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <Link 
              href="/"
              className="text-xl font-bold text-red-600 hover:text-red-800 transition-colors"
            >
              LokaPedia Bali
            </Link>
            <div className="flex gap-4">
              <Link
                href="/register"
                className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-full hover:bg-red-700 transition-colors"
              >
                Daftarkan Usaha Anda
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 text-sm font-medium text-black rounded-full hover:bg-red-500 hover:text-white transition-colors"
              >
                Login
              </Link>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
