"use client"
import { Grid, Select, GridCol } from "@mantine/core";
import React, { useEffect, useState } from "react";
import { kecamatan } from "../../lib/masterData";

const SEMUA_KECAMATAN = "SEMUA KECAMATAN"

const fetchTpsData = async () => {
  const apiUrl = `/api/admin/tps`;
  console.log(apiUrl)
  const res = await fetch(apiUrl, {
    method: 'GET'
  });
  
  if (!res.ok) {
    throw new Error('Failed to fetch TPS data');
  }

  const tpsByKecamatan = await res.json();
  return tpsByKecamatan;
};

export default function TPSPage() {
  const [selectedKec, setSelectedKec] = useState<string | null>(SEMUA_KECAMATAN);
  const [dataTps, setDataTps] = useState<any[]>([]);


  const semuaTps = Object.values(dataTps).flat();

  const filterTps = () => {
    if(selectedKec === SEMUA_KECAMATAN){
      return semuaTps
    }
    return dataTps.filter((tps) => tps.kecamatan.toLowerCase() === selectedKec?.toLowerCase())
  }

  console.log(filterTps())

  // Gunakan useEffect untuk mengambil data hanya sekali saat komponen dimuat
  useEffect(() => {
    const fetchData = async () => {
      try {
        const tps = await fetchTpsData();
        setDataTps(tps);
      } catch (error) {
        console.error('Error fetching TPS data:', error);
      }
    };
    fetchData(); // Memanggil fetchData hanya sekali saat mount
  }, []); // Dependency kosong, hanya dijalankan sekali saat komponen mount

  return (
    <>
      <h1>Data TPS</h1>
      <Grid justify="start">
        <GridCol span={{ base: 12, md: 6, lg: 6 }}>
          <Select
            searchable
            clearable
            label="Pilih Kecamatan"
            placeholder="Pilih Kecamatan"
            value={selectedKec}
            onChange={(val) => setSelectedKec(val)}
            data={[SEMUA_KECAMATAN, ...kecamatan.map((kec) => kec.kecamatan)]}
          />
        </GridCol>
      </Grid>
    </>
  );
}
