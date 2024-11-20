'use client'

import { AppShell, Burger, Group, Image, ScrollArea } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useState, useEffect } from 'react';
import { IconHome2, IconLogout, IconUsers } from '@tabler/icons-react';
import { signOut, useSession } from 'next-auth/react';
import Cookies from 'js-cookie';
import classes from './Navbar.module.css';
import Link from 'next/link';

export function Navbar({ children }: { children: React.ReactNode }) {
  const [opened, { toggle }] = useDisclosure();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeLink, setActiveLink] = useState('');
  const { data: session } = useSession(); // Gunakan hook useSession untuk memantau status login
  // Memeriksa session dan token di cookies
  useEffect(() => {
    // Jika session tersedia, artinya pengguna sudah login
    if (session) {
      setIsLoggedIn(true);
      if((session.user as any).role === "admin") setIsAdmin(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [session]); // Perbarui status login saat session berubah

  useEffect(() => {
    // Dapatkan path saat ini
    const currentPath = window.location.pathname;
    setActiveLink(currentPath); // Atur link aktif berdasarkan path saat ini
  }, []); 
  
  const adminLinks = [
    { label: 'TPS', link: '/admin/tps', icon: IconHome2 },
    { label: 'Saksi', link: '/admin/saksi', icon: IconUsers },
  ];

  const links = adminLinks.map((item) => (
    <Link href={item.link} key={item.label} className={ `${classes.link} ${item.label === activeLink ? classes.active : ''}`} >
      <div>
        <item.icon className={classes.linkIcon} stroke={1.5} />
        <span>{item.label}</span>
      </div>
    </Link>
  ));
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
        <AppShell.Section grow my="md" component={ScrollArea}>
          {isAdmin ? links : null}
        </AppShell.Section>
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
