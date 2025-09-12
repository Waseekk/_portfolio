
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Irtefa W. — Interactive Portfolio",
  description: "Animated portfolio with a built-in chatbot.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
