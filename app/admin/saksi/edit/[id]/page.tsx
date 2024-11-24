// app/admin/edit/[id]/page.tsx
'use client' // Menandakan bahwa file ini akan dirender di client-side

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Box, Button, Grid, GridCol, LoadingOverlay, Select, Space, TextInput } from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";
import { fetchSaksiById, updateSaksi } from "../../../../lib/crud/saksi";

export default function SaksiDetail() {
  const router = useRouter()
  const [dataSaksi, setDataSaksi] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);  
  
  const params = useParams()
  const {id} = params;

  useEffect(() => {
    if (!id) return; // Pastikan id sudah ada

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const saksi = await fetchSaksiById(Number(id)); // Mengambil data berdasarkan id
        setDataSaksi(saksi);

        console.log(saksi)
      } catch (err) {
        console.error('Gagal memuat data saksi:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]); // Efek akan dijalankan saat id berubah

  const handleFieldChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;

    setDataSaksi((prevSaksi: any) => ({
      ...prevSaksi,
      [name]: value, // Update key yang sesuai dengan name field
    }));
  };

  const handleSelectChange = (target: string, value: string | null) => {
    setDataSaksi((prevSaksi: any) => ({
      ...prevSaksi,
      [target]: value, 
    }));
  }

  const handleUpdateSaksi = async() => {
    try {
      setIsLoading(true)
      await updateSaksi(Number(id), dataSaksi)
    } catch (error) {
      console.error('Update data saksi error:', error);
    }
    finally {
      router.push(`/admin/saksi`)
    }
  }

  return (
    <>
    <div>
      <h1>Update Saksi</h1>
      <Box pos="relative">
      <LoadingOverlay visible={isLoading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
      {dataSaksi && (
        <>
         <Grid justify="start">
          <GridCol span={{ base: 12, md: 6, lg: 6 }}>
            <TextInput 
              name="nama_saksi" 
              value={dataSaksi.nama_saksi} 
              onChange={handleFieldChange} 
              label="Nama Saksi"
              placeholder="Masukkan Nama Saksi"
              error={dataSaksi.nama_saksi ? "" : "Nama Saksi harus diisi"}
            />
            <Space h={'lg'} />
            <TextInput 
              name="nomor_wa" 
              value={dataSaksi.nomor_wa} 
              onChange={handleFieldChange} 
              label="Nomor WA"
              placeholder="Masukkan nomor WA"
              error={dataSaksi.nomor_wa ? "" : "Nomor WA harus diisi"}
            />
            <Space h={'lg'} />
             <TextInput 
              name="nik" 
              value={dataSaksi.nik} 
              onChange={handleFieldChange} 
              label="NIK"
              placeholder="Masukkan NIK"
              type="number"
            />      
            <Space h={'lg'} />
            <Button 
              size="compact-md" 
              color="green" 
              leftSection={
                <IconCheck size={14} />
              }
              onClick={handleUpdateSaksi}
              variant="outline">
              Simpan
            </Button>
          </GridCol>
        </Grid>
        </>
      )}
      </Box>
    </div>
    </>
  );
}
