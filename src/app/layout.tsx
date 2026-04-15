import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import Nav from "@/components/nav";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Brazenamer — Naming Convention Generator",
  description: "Generate consistent naming conventions for your Braze assets.",
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
      className={`${jakarta.variable} ${jetbrains.variable}`}
    >
      <head>
        <script
          // Prevent dark-mode flash on first load
          dangerouslySetInnerHTML={{
            __html: `
              (function(){
                try {
                  var d = document.documentElement;
                  var m = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  d.classList.toggle('dark', m);
                } catch(e){}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 font-sans antialiased">
        <Nav />
        {children}
      </body>
    </html>
  );
}
