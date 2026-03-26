import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { Sidebar } from "./components/Sidebar";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Material Request System",
  description: "A premium application to manage material requests.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} antialiased`}>
      <body className="min-h-screen bg-gray-50 text-gray-900 selection:bg-indigo-500/30">
        <div className="relative flex min-h-screen">
          <div className="absolute top-0 left-0 w-full h-[500px] bg-indigo-50 blur-[120px] rounded-full -z-10 transform -translate-y-1/2 pointer-events-none"></div>

          <Sidebar />

          <div className="flex-1 flex flex-col min-w-0">
            <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white shadow-sm ring-1 ring-gray-900/5 md:hidden">
              <div className="container mx-auto flex h-16 items-center px-4">
                <Link href="/" className="flex items-center gap-2">
                  <span className="text-xl font-bold tracking-tight text-gray-900">Material Requests</span>
                </Link>
              </div>
            </header>

            <main className="flex-1 p-4 md:p-8">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
