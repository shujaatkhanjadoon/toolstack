import type { Metadata } from "next";
import { Poppins, Montserrat } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import "./globals.css";

const poppins = Poppins({ subsets: ["latin"],
  weight: ["400", "500", "600"] });

  const montserrat = Montserrat({ 
  subsets: ["latin"],
  weight: ["400", "500"]
});

export const metadata: Metadata = {
  title: "ToolStack - Your All-in-One Suite of Modern Web Tools",
  description: "Free, fast, and easy-to-use tools for developers, students, and professionals.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.className} ${montserrat.className}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          {/* MAIN FIX: Removed 'container' and 'py-4' here. We'll control padding on a per-page basis. */}
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}