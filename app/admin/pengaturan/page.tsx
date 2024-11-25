'use client'; // Menandakan bahwa file ini akan dirender di client-side

import React, { useEffect, useState } from 'react';
import { Box, Grid, LoadingOverlay, Switch } from '@mantine/core';
import { readAccess, updateConfig } from '../../lib/access-control/access';

export default function SaksiDetail() {
  const [config, setConfig] = useState<{ accessEnabled: boolean } >({ accessEnabled: false });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Ambil konfigurasi saat komponen pertama kali dimuat
  useEffect(() => {
    const fetchConfig = async () => {
      setIsLoading(true); // Tampilkan loading saat fetching data
      try {
        const res = await readAccess(); // Ambil data akses
        console.log(res);
        setConfig(res); // Set data ke state config

      } catch (error) {
        console.error('Error fetching configuration:', error);
      } finally {
        setIsLoading(false); // Sembunyikan loading
      }
    };
    fetchConfig();
  }, []); // Hanya eksekusi saat komponen pertama kali dimuat

  // Fungsi untuk menangani perubahan akses publik
  const handlePublicAccessChange = async (event: any) => {
    setIsLoading(true); // Tampilkan loading saat proses perubahan
    const isEnabled = event.currentTarget.checked; // Ambil nilai checkbox
    const dataToWrite = { enabledAccess: isEnabled }; // Siapkan data untuk dikirim

    try {
      await updateConfig(dataToWrite); // Kirim perubahan konfigurasi
      setConfig((prevConfig: any) => ({ ...prevConfig, accessEnabled: isEnabled })); // Update state config secara lokal
    } catch (error) {
      console.error('Error updating configuration:', error);
    } finally {
      setIsLoading(false); // Sembunyikan loading setelah proses selesai
    }
  };

  return (
    <div>
      <h1>Pengaturan</h1>
      <Box pos="relative" h={200}>
        <LoadingOverlay visible={isLoading} zIndex={1000} overlayProps={{ radius: 'sm', blur: 2 }} />
        {config && (
          <Grid justify="start" p={10}>
            <Switch
              checked={config.accessEnabled}
              label="Buka Akses Data Publik"
              onChange={handlePublicAccessChange} // Tangani perubahan
            />
          </Grid>
        )}
      </Box>
    </div>
  );
}
