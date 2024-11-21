// app/admin/edit/[id]/page.tsx
'use client' // Menandakan bahwa file ini akan dirender di client-side

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchTpsById, updateTps } from "../../../../lib/crud/tps";
import { Box, Button, Grid, GridCol, LoadingOverlay, Select, Space, TextInput } from "@mantine/core";
import { kecamatan } from "../../../../lib/masterData";
import { IconCheck } from "@tabler/icons-react";

export default function TpsDetail() {
  const router = useRouter()
  const [dataTps, setDataTps] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);  
  
  const params = useParams()
  const {id} = params;

  useEffect(() => {
    if (!id) return; // Pastikan id sudah ada

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const tps = await fetchTpsById(Number(id)); // Mengambil data berdasarkan id
        setDataTps(tps);
      } catch (err) {
        console.error('Error fetching TPS data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]); // Efek akan dijalankan saat id berubah

  const handleFieldChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;

    // Update state dataTps sesuai dengan name dan value dari field yang berubah
    setDataTps((prevDataTps: any) => ({
      ...prevDataTps,
      [name]: value, // Update key yang sesuai dengan name field
    }));
  };

  const handleSelectChange = (target: string, value: string | null) => {
    setDataTps((prevDataTps: any) => ({
      ...prevDataTps,
      [target]: value, 
    }));
  }

  const handleUpdateTps = async() => {
    try {
      setIsLoading(true)
      await updateTps(Number(id), dataTps)
    } catch (error) {
      console.error('Error update TPS data:', error);
    }
    finally {
      router.back()
    }
  }

  return (
    <>
    <div>
      <h1>Update TPS</h1>
      <Box pos="relative">
      <LoadingOverlay visible={isLoading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
      {dataTps && (
        <>
         <Grid justify="start">
          <GridCol span={{ base: 12, md: 6, lg: 6 }}>
            <TextInput 
              name="nama_tps" 
              value={dataTps.nama_tps} 
              onChange={handleFieldChange} 
              label="Nama TPS"
              placeholder="Masukkan Nama TPS"
              error={dataTps.nama_tps ? "" : "Nama TPS harus diisi"}
            />
            <Space h={'lg'} />
            <TextInput 
              name="lokasi" 
              value={dataTps.lokasi} 
              onChange={handleFieldChange} 
              label="Lokasi TPS"
              placeholder="Masukkan Lokasi TPS"
              error={dataTps.lokasi ? "" : "Lokasi TPS harus diisi"}
            />
            <Space h={'lg'} />
            <TextInput 
              name="desa" 
              value={dataTps.desa} 
              onChange={handleFieldChange} 
              label="Desa"
              placeholder="Masukkan Desa"
              error={dataTps.desa ? "" : "Desa harus diisi"}
            />
            <Space h={'lg'} />
            <Select 
              name="kecamatan" 
              searchable 
              clearable 
              value={dataTps.kecamatan} 
              data={kecamatan.map((kec) => kec.kecamatan)} 
              onChange={(e) => handleSelectChange('kecamatan', e)}
              label="Kecamatan"
              placeholder="Pilih Kecamatan"
              error={dataTps.kecamatan ? "": "Kecamatan harus diisi"}
            />
            <Space h={'lg'} />
            <TextInput 
              name="total_dpt" 
              value={dataTps.total_dpt} 
              type="number" 
              label="Total DPT"
              placeholder="Masukkan Total DPT"
              error={dataTps.total_dpt ? "" : "Total DPT harus diisi"}
              onChange={handleFieldChange} 
            />
            <Space h={'lg'} />
            <Button 
              size="compact-md" 
              color="green" 
              leftSection={
                <IconCheck size={14} />
              }
              onClick={handleUpdateTps}
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
