import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Educational Digital Nexus",
  description: "Contenido digital educativo abierto",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script src="/pdfjs/pdf.mjs" type="module" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
