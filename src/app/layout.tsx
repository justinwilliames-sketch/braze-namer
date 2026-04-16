import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import Nav from "@/components/nav";
import Footer from "@/components/footer";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Orbit Namer — Naming Convention Generator",
  description: "Generate consistent naming conventions for your Braze assets. An Orbit web app.",
  icons: { icon: "/orbit-icon.png", apple: "/orbit-icon.png" },
  openGraph: {
    title: "Orbit Namer — Naming Convention Generator",
    description: "Generate consistent naming conventions for your Braze assets.",
    url: "https://namer.yourorbit.team",
    images: ["/orbit-icon.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${mono.variable}`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var d=document.documentElement;var m=window.matchMedia('(prefers-color-scheme:dark)').matches;d.classList.toggle('dark',m)}catch(e){}})()`,
          }}
        />
      </head>
      <body className="min-h-screen bg-white dark:bg-[#0A0A0B] text-neutral-500 dark:text-neutral-400 font-sans antialiased">
        <Nav />
        <div className="pt-12">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
