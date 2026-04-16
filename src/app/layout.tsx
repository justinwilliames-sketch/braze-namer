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
  title: "Orbit Namer — Naming Convention Generator",
  description: "Generate consistent naming conventions for your Braze assets. An Orbit web app.",
  icons: { icon: "/orbit-icon.png", apple: "/orbit-icon.png" },
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
        <script
          data-name="BMC-Widget"
          data-cfasync="false"
          src="https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js"
          data-id="justinwilliames"
          data-description="Support Orbit development"
          data-message="Orbit Namer is free — if it saves you time, a coffee goes a long way."
          data-color="#000000"
          data-position="Right"
          data-x_margin="18"
          data-y_margin="18"
        />
      </body>
    </html>
  );
}
