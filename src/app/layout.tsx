import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/shared/header';
import { AuthProvider } from '@/context/auth-context';
import Footer from '@/components/shared/footer';

export const metadata: Metadata = {
  title: 'Innovent - Campus Event Hub',
  description: 'Your one-stop platform for campus events. Discover, register, and create events with ease.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased min-h-screen flex flex-col">
        <AuthProvider>
          <Header />
          <main className="flex-grow px-4">{children}</main>
          <Footer />
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
