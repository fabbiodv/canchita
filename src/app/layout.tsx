import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "sonner";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Canchita - Reserva de Canchas",
  description: "Sistema web para la reserva de canchas de futbol. Reserva diferentes tipos de canchas (Fútbol 5, 7 y 11) de manera fácil y rápida.",
  keywords: ["reserva canchas", "fútbol", "canchas deportivas", "reservas online"],
  authors: [
    {
      name: "Canchita",
    },
  ],
  openGraph: {
    title: "Canchita - Sistema de Reserva de Canchas",
    description: "Reserva tu cancha de fútbol de manera fácil y rápida",
    type: "website",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='es' suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
