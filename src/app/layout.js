import "./globals.css";
import { Metadata } from "next";

export const metadata = {
  title: "MindSync",
  description:
    "MindSync é um jogo online divertido onde você e sua dupla sincronizam suas mentes. Desafie sua conexão mental!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`antialiased`}>{children}</body>
    </html>
  );
}
