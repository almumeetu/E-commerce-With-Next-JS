import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/src/context/CartContext";
import NavbarWrapper from "@/components/NavbarWrapper";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import { Toaster, ToastProvider } from '@/lib/toast';

export const metadata: Metadata = {
    title: "রোজারহাট – রমজান বাজার",
    description: "উন্নত মানের খেজুর, ইফতার সামগ্রী এবং ইসলামিক পণ্য।",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="bn">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@300;400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700;800;900&family=Roboto:wght@300;400;500;700;900&display=swap" rel="stylesheet" />
            </head>
            <body className="font-sans antialiased bg-emerald-950" style={{ fontFamily: '"Hind Siliguri", sans-serif' }}>
                <CartProvider>
                    <ToastProvider>
                        <div className="flex flex-col min-h-screen">
                            <Toaster />
                            <NavbarWrapper />
                            <main className="flex-grow">
                                {children}
                            </main>
                            <Footer />
                            <BackToTop />
                        </div>
                    </ToastProvider>
                </CartProvider>
            </body>
        </html>
    );
}

