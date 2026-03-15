import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    template: 'Doiscode Technology | %s',
    default: 'Doiscode Technology | Home',
  },
  description: 'Leading Software House company specializing as a Software house for agribusiness, palm oil estates, mills, and custom enterprise solutions in Indonesia and Malaysia.',
  keywords: [
    'Software House company',
    'Software house for agribusiness',
    'Agritech software',
    'Palm oil software',
    'Custom software house',
    'Doiscode Technology',
    'IoT agriculture'
  ],
  icons: {
    icon: '/images/icon-logo.png',
    apple: '/images/icon-logo.png',
  },
  openGraph: {
    title: {
      template: 'Doiscode Technology | %s',
      default: 'Doiscode Technology | Home',
    },
    description: 'Leading Software House company specializing as a Software house for agribusiness.',
    type: 'website',
    images: [{ url: '/images/icon-logo.png' }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
