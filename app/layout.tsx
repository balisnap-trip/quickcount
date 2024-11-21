// 'use client' di sini memastikan ini adalah Client Component
'use client'

import "@mantine/core/styles.css";
import React from "react";
import { MantineProvider, ColorSchemeScript } from "@mantine/core";
import { theme } from "../theme";
import { Navbar } from "./components";
import '../public/styles/global.css';
import { SessionProvider } from "next-auth/react";
import { ModalsProvider } from "@mantine/modals";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ColorSchemeScript />
        <link rel="shortcut icon" href="/favicon.svg" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <body>
        <SessionProvider>
          <MantineProvider theme={theme}>
            <ModalsProvider>
              <Navbar>{children}</Navbar>
            </ModalsProvider>
          </MantineProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
