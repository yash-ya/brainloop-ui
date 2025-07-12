import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: {
    template: "%s | BrainLoop",
    default: "BrainLoop - Master Your Concepts",
  },
  description:
    "A smart DSA problem tracker and revision tool using spaced repetition to help you retain what you learn.",
  keywords: [
    "DSA",
    "Spaced Repetition",
    "Learning",
    "Programming",
    "Interviews",
    "Coding",
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
