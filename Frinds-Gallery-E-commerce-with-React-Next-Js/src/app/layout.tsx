import type { Metadata } from "next";
import { Providers } from "@/components/Providers";
import "../index.css";

export const metadata: Metadata = {
  title: "Friend's Gallery | Your Fashion, Your Identity",
  description: "Modern E-commerce platform for fashion and style.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
