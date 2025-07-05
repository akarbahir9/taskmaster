import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navigation } from "@/components/navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ScriptSpark - AI-Powered Movie Script Generator",
  description: "Transform your movie ideas into professional screenplays with the power of AI. Create compelling stories with rich characters and industry-standard formatting.",
  keywords: ["screenplay", "script writing", "AI", "movie script", "screenwriting", "film"],
  authors: [{ name: "ScriptSpark Team" }],
  creator: "ScriptSpark",
  publisher: "ScriptSpark",
  robots: "index, follow",
  openGraph: {
    title: "ScriptSpark - AI-Powered Movie Script Generator",
    description: "Transform your movie ideas into professional screenplays with the power of AI.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "ScriptSpark - AI-Powered Movie Script Generator",
    description: "Transform your movie ideas into professional screenplays with the power of AI.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navigation />
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
