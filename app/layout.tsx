import type { Metadata } from "next";
// import { Inter } from "next/font/google";
import "./globals.css";
import { IBM_Plex_Sans } from "next/font/google"; // Add own font
import { cn } from "@/lib/utils";

import { ClerkProvider } from '@clerk/nextjs'

const IBMPlex = IBM_Plex_Sans({ 
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: '--font-ibm-plex' 
}); //set font variables

export const metadata: Metadata = {
  title: "ImageCraft App",
  description: "AI empowered image generator to Smartify your photos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider appearance={{
      variables: {colorPrimary:'#624cf5'}
    }}>
      <html lang="en">
        <body className={cn('font-IBMPlex antialiased', IBMPlex.variable)}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
