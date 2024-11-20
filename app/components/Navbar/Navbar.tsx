'use client'

import { AppShell, Burger, Group, Image } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useState, useEffect } from 'react';
import { IconLogout } from '@tabler/icons-react';
import { signOut, useSession } from 'next-auth/react';
import Cookies from 'js-cookie';
import classes from './Navbar.module.css';

export function Navbar({ children }: { children: React.ReactNode }) {
  const [opened, { toggle }] = useDisclosure();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { data: session } = useSession(); // Gunakan hook useSession untuk memantau status login

  // Memeriksa session dan token di cookies
  useEffect(() => {
    // Jika session tersedia, artinya pengguna sudah login
    if (session) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [session]); // Perbarui status login saat session berubah

  // Fungsi untuk logout, hapus token dan panggil signOut
  const handleLogout = () => {
    // Menghapus token dari cookie
    Cookies.remove('token');
    // Memanggil signOut untuk mengeluarkan pengguna dari sesi (NextAuth.js)
    signOut({ callbackUrl: '/' }); // Redirect ke halaman utama setelah logout
  };

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Image src={'/logo/qc.png'} alt="logo" width={30} height={30} />
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        {/* Hanya menampilkan tombol logout jika sudah login */}
        {isLoggedIn && (
          <div className={classes.footer}>
            <a
              href="#"
              className={classes.link}
              onClick={(event) => {
                event.preventDefault();
                handleLogout(); // Logout saat tombol diklik
              }}
            >
              <IconLogout className={classes.linkIcon} stroke={1.5} />
              <span>Logout</span>
            </a>
          </div>
        )}
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
