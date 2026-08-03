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
  title: "Mwaiseni Services SARL | Produits alimentaires de qualit\u00e9 \u00e0 Lubumbashi",
  description:
    "Mwaiseni Services SARL - Arachides grill\u00e9es, croquants artisanaux et gaufres de qualit\u00e9. De notre ferme \u00e0 votre assiette. Commandez en gros ou devenez partenaire \u00e0 Lubumbashi, RDC.",
  keywords: [
    "Mwaiseni Services",
    "arachides grill\u00e9es",
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
      "De notre ferme \u00e0 votre assiette. Produits alimentaires artisanaux de qualit\u00e9 \u00e0 Lubumbashi.",
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
