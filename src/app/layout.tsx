import type { Metadata } from "next";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Personal Blog - Technical Insights & Learnings",
  description:
    "A knowledge hub documenting applied learnings in software engineering, systems architecture, and artificial intelligence.",
  openGraph: {
    title: "Personal Blog",
    description: "Technical insights and learnings",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
