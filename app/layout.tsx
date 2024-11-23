'use client';

import React from 'react';
import '@mantine/core/styles.css';
import '../public/styles/global.css'; // Masih diperbolehkan jika hanya untuk global styles
import { MantineProvider, ColorSchemeScript } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { SessionProvider } from 'next-auth/react';
import { Navbar } from './components';
import { theme } from '../theme';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* SEO Meta Tags */}
        <title>Hitung Cepat Pemilihan Calon Bupati Gianyar 2024</title>
        <meta name="description" content="Aplikasi hitung cepat untuk pemilihan calon Bupati Gianyar 2024." />
        <meta property="og:title" content="Hitung Cepat Pemilihan Calon Bupati Gianyar 2024" />
        <meta
          property="og:description"
          content="Aplikasi ini digunakan untuk membantu menghitung cepat hasil pemilihan calon Bupati Gianyar 2024."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${process.env.NEXT_PUBLIC_URL}`} />
        <meta property="og:image" content={`${process.env.NEXT_PUBLIC_URL}/paslon/bupati.png`} />
        <meta property="og:locale" content="id_ID" />
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no" />
        <link rel="icon" href="/favicon.ico" />
        <ColorSchemeScript />
      </head>
      <body>
        <SessionProvider>
          <MantineProvider withGlobalClasses withCssVariables withStaticClasses theme={theme}>
            <ModalsProvider>
              <Navbar>{children}</Navbar>
            </ModalsProvider>
          </MantineProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
