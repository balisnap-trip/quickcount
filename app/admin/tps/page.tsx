"use client"
import { Grid, Select, GridCol, TableTr, TableTd, Table, TableTbody, TableThead, TableScrollContainer, TableTh, Space, Box, LoadingOverlay, Button, Group, Text, TextInput, Pagination } from "@mantine/core";
import React, { useEffect, useState } from "react";
import { kecamatan } from "../../lib/masterData";
import { useMediaQuery } from "@mantine/hooks";
import { IconEdit, IconSearch, IconX } from "@tabler/icons-react";
import { modals } from '@mantine/modals'
import { deleteTPS, fetchTpsData } from "../../lib/crud/tps";
import { useRouter } from "next/navigation";

const SEMUA_KECAMATAN = "SEMUA KECAMATAN"

const hanleEditTps = (id: number) => {
  window.location.href = `/admin/tps/edit/${id}`
}

export default function TPSPage() {
  const [selectedKec, setSelectedKec] = useState<string | null>(SEMUA_KECAMATAN);
  const [dataTps, setDataTps] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const isLg = useMediaQuery('(min-width: 1200px)');
  const router = useRouter()
  const [search, setSearch] = useState<any>("")
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalPage, setTotalPage] = useState<number>(0)

  const confirmModal = (id: number) => modals.openConfirmModal({
    title: 'Hapus data TPS',
    children: (
      <Text size="sm">
        Data yang yang dihapus tidak dapat dikembalikan
      </Text>
    ),
    labels: { confirm: 'OK', cancel: 'Batal' },
    onConfirm: () => handleDeleteTPS(id),
  });

  const handleDeleteTPS = async(id: number) => {
    setIsLoading(true)
    try {
      await deleteTPS(id)
    } catch (error) {
      console.log("Gagal menghapus data TPS")
    } finally {
      setIsLoading(false)
      router.refresh()
    }
  } 

  const rows = dataTps.map((tps) => (
    <TableTr key={tps.id_tps} >
      <TableTd>{tps.nama_tps}</TableTd>
      <TableTd>{tps.lokasi}</TableTd>
      <TableTd>{tps.kecamatan}</TableTd>
      <TableTd>{tps.total_dpt}</TableTd>
      <TableTd>
        <Group>
          <Button 
            size="compact-md" 
            leftSection={<IconEdit size={14} />} 
            variant="outline"
            onClick={() => hanleEditTps(tps.id_tps)}
          >
            Edit
          </Button>
          <Button 
            size="compact-md" 
            onClick={() => confirmModal(tps.id_tps)} 
            color="red" 
            leftSection={
              <IconX size={14} />
            } 
            variant="outline">
            Hapus
          </Button>
        </Group>
      </TableTd>

    </TableTr>
  ))

  useEffect(() => {
    setCurrentPage(1)
  }, [selectedKec, search])
  
  const fetchData = async () => {
    setIsLoading(true)
    const filter = {
      kec: selectedKec === SEMUA_KECAMATAN ? "" : selectedKec,
      query: search
    }
    try {
      const res = await fetchTpsData(currentPage, filter);
      setDataTps(res.tps);
      setTotalPage(res.totalPage)
      setIsLoading(false)
    } catch (error) {
      console.error('Error fetching TPS data:', error);
    }
  };
  // Gunakan useEffect untuk mengambil data hanya sekali saat komponen dimuat
  useEffect(() => {
    
    fetchData(); // Memanggil fetchData hanya sekali saat mount
  }, [currentPage, selectedKec]); // Dependency kosong, hanya dijalankan sekali saat komponen mount

  return (
    <>
      <h1>Data TPS</h1>
      <Box pos="relative">
        <LoadingOverlay visible={isLoading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />

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
            <Space h={"xl"} />
            <Group align="flex-end">
            <TextInput label="Pencarian" placeholder="Pencarian" value={search} onChange={(e) => setSearch(e.target.value)} />
            <Button variant="outline" onClick={() => fetchData()} leftSection={<IconSearch size={14} />}>Cari</Button>
            </Group>
          </GridCol>
        </Grid>
        <Space h={'lg'} />
        <Grid justify="start">
          <GridCol span={{ base: 12, md: 12, lg: 8 }}>
            <TableScrollContainer minWidth={isLg ? '75%' : '100%'} type="native">
              <Table>
                <TableThead>
                  <TableTr>
                    <TableTh>Nama TPS</TableTh>
                    <TableTh>Lokasi</TableTh>
                    <TableTh>Kecamatan</TableTh>
                    <TableTh>Total DPT</TableTh>
                    <TableTh></TableTh>
                  </TableTr>
                </TableThead>
                <TableTbody>{rows}</TableTbody>
              </Table>
            </TableScrollContainer>
            <Space h={'lg'} />
            <Pagination value={currentPage} onChange={setCurrentPage} total={totalPage} />
          </GridCol>
        </Grid>
      </Box>
    </>
  );
}
