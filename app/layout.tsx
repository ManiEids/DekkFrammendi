'use client';

import './globals.css';
import { Inter } from 'next/font/google';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { useState } from 'react';
import ConnectionStatus from './components/ConnectionStatus';
import Header from './components/Header';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  }));
  
  return (
    <html lang="is">
      <head>
        <title>Dekkjasafn - Dekkjaverð á einum stað</title>
        <meta name="description" content="Finndu dekk á besta verðinu frá öllum helstu söluaðilum á Íslandi." />
      </head>
      <body className={inter.className}>
        <QueryClientProvider client={queryClient}>
          <Header />
          <main className="container mx-auto px-4 py-6">
            {children}
          </main>
          <ConnectionStatus />
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </body>
    </html>
  );
}
