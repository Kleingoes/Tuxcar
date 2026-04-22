import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import NextTopLoader from "nextjs-toploader";
import Footer from "@/components/footer";
import { ThemeProvider } from "@/components/theme-provide";
import { ClerkProvider } from "@clerk/nextjs";

const outfit = Outfit({subsets: ["latin"],});

export const metadata: Metadata = {
  title: "Tuxcar",
  description: "Plataforma de venta de vehículos multimarcas en Chiapas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={outfit.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange>
            <NextTopLoader color="#000"/>
            {children}
            <Footer />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}