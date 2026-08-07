import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mwaiseni Services SARL | Produits alimentaires de qualité à Lubumbashi",
  description:
    "Mwaiseni Services SARL - Arachides grillées, croquants artisanaux et gaufres de qualité. De notre ferme à votre assiette. Commandez en gros ou devenez partenaire à Lubumbashi, RDC.",
  keywords: [
    "Mwaiseni Services",
    "arachides grillées",
    "croquants",
    "gaufres",
    "Nkalanga Yetu",
    "Lubumbashi",
    "RDC",
    "produits alimentaires",
    "grossiste",
    "partenariat",
  ],
  authors: [{ name: "Mwaiseni Services SARL" }],
  openGraph: {
    title: "Mwaiseni Services SARL",
    description:
      "De notre ferme à votre assiette. Produits alimentaires artisanaux de qualité à Lubumbashi.",
    type: "website",
    locale: "fr_CD",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
