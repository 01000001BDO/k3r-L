// app/layout.tsx
import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import { FournisseurPanier } from '@/context/ContextePanier';
import { Navigation } from '@/components/Navigation';
import DynamicFooter from '@/components/DynamicFooter';
import { Playfair_Display, Montserrat } from 'next/font/google';
import './globals.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-montserrat',
});

export const metadata: Metadata = {
  title: 'Boulangerie Artisanale',
  description: 'Délicieux produits de boulangerie artisanale faits avec amour',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${playfair.variable} ${montserrat.variable} h-full`}>
      <body className="bg-boulangerie-50 font-body flex flex-col min-h-screen">
        <FournisseurPanier>
          <Navigation />
          <main className="flex-grow">{children}</main>
          <DynamicFooter />
          <Toaster position="bottom-right" />
        </FournisseurPanier>
      </body>
    </html>
  );
}