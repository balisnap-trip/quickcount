"use client"
import { Grid, Select, GridCol, TableTr, TableTd, Table, TableTbody, TableThead, TableScrollContainer, TableTh, Space, Box, LoadingOverlay, Button, Group, Pagination, TextInput, Image, Modal } from "@mantine/core";
import React, { useEffect, useState } from "react";
import { kecamatan } from "../../lib/masterData";
import { useMediaQuery } from "@mantine/hooks";
import { IconSearch } from "@tabler/icons-react";
import { aktivasiToken } from "../../lib/crud/saksi";
import { fetchPerhitungan } from "../../lib/crud/perhitungan";

const SEMUA_KECAMATAN = "SEMUA KECAMATAN"

const handleEditSaksi = (id: number) => {
  window.location.href = `/admin/saksi/edit/${id}`
}

export default function PerhitunganSuaraPage() {
  const [selectedKec, setSelectedKec] = useState<string | null>(SEMUA_KECAMATAN);
  const [dataPerhitungan, setDataPerhitungan] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const isLg = useMediaQuery('(min-width: 1200px)');
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalPage, setTotalPage] = useState<number>(0)
  const [namaSaksi, setNamaSaksi] = useState<any>("")
  const [desa, setDesa] = useState<any>("")
  const [tokenDoUpdate, setTokenDoUpdate] = useState<boolean>(false)
  const [open, setOpen] = useState(false)
  const [dataDesa, setDataDesa] = useState<any[]>([])

  const handleImageClick = () => {
    setOpen(true)
  }

  const rows = dataPerhitungan.map((perhitungan, index) => (
    <TableTr key={perhitungan.id_perhitungan} >
      <TableTd>{index + 1}</TableTd>
      <TableTd>{perhitungan.saksi.nama_saksi}</TableTd>
      <TableTd>
        {perhitungan.tps.nama_tps}
      </TableTd>
      <TableTd>{perhitungan.tps.lokasi}</TableTd>
      <TableTd>{perhitungan.tps.kecamatan}</TableTd>
      <TableTd>{perhitungan.suara_bupati_1}</TableTd>
      <TableTd>{perhitungan.suara_bupati_2}</TableTd>
      <TableTd>
        <Box>
          <Image
            src={perhitungan.buktiGambar[0].file_path}
            alt={"Bukti Gambar " + perhitungan.saksi.nama_saksi + " " + perhitungan.tps.nama_tps}
            fit="contain"
            radius="md"
            height={100}
            onClick={handleImageClick}  // Trigger modal open when clicked
            style={{ cursor: 'zoom-in' }}  // Change cursor to pointer for better UX
          />
          <Modal
            opened={open}
            onClose={() => setOpen(false)}  // Close modal when clicked outside
            title={"Bukti foto formulir " + perhitungan.saksi.nama_saksi + " " + perhitungan.tps.nama_tps + " - " + perhitungan.tps.desa + " " + perhitungan.tps.kecamatan}
            size="lg"  // You can adjust the size based on your preference
          >
            <Image
              src={perhitungan.buktiGambar[0].file_path}  // Same image source for the modal
              alt={"Bukti foto formulir " + perhitungan.saksi.nama_saksi + " " + perhitungan.tps.nama_tps + " - " + perhitungan.tps.desa + " " + perhitungan.tps.kecamatan}
              fit="contain"
              radius="md"
              width="100%"  // Make the image responsive within the modal
            />
          </Modal>
        </Box>
      </TableTd>
    </TableTr>
  ))

  const fetchData = async () => {
    setIsLoading(true)
    const filter = {
      kec: selectedKec === SEMUA_KECAMATAN ? "" : selectedKec,
      desa: "",
      namaSaksi
    }
    try {
      const res = await fetchPerhitungan(currentPage, filter);
      setDataPerhitungan(res.perhitungan);
      setTotalPage(res.totalPage)
      setDataDesa(res.desa)
      setIsLoading(false)
    } catch (error) {
      console.error('Gagal memuat saksi:', error);
    }
  };

  useEffect(() => {
    setCurrentPage(1)
  }, [selectedKec, namaSaksi, desa])

  useEffect(() => {
    fetchData(); // Memanggil fetchData hanya sekali saat mount
  }, [currentPage, selectedKec, tokenDoUpdate, desa]); // Dependency kosong, hanya dijalankan sekali saat komponen mount

  return (
    <>
      <h1>Data Perhitungan Suara</h1>
      <Box pos="relative">
        <LoadingOverlay visible={isLoading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />

        <Grid justify="start">
          <GridCol span={{ base: 12, md: 6, lg: 4 }}>
            <Select
              searchable
              clearable
              label="Pilih Kecamatan"
              placeholder="Pilih Kecamatan"
              value={selectedKec}
              onChange={(val) => setSelectedKec(val)}
              data={[...kecamatan.map((kec) => kec.kecamatan)]}
            />
            <Space h={'lg'} />
            <Select
              searchable
              clearable
              label="Pilih Desa"
              placeholder="Pilih Desa"
              value={desa}
              onChange={(val) => setDesa(val)}
              data={[...dataDesa.map((desa) => desa.desa)]}
            />
            <Space h={'lg'} />
            <Group align="flex-end" >
              <TextInput
                name="nama_saksi"
                placeholder="Masukkan nama saksi"
                label="Cari nama saksi"
                value={namaSaksi}
                onChange={(e) => setNamaSaksi(e.target.value)}
                style={{ flex: 1 }}
              />
              <Button
                size="compact-md"
                leftSection={<IconSearch size={14} />}
                variant="outline"
                onClick={() => fetchData()}
              >
                Cari
              </Button>
            </Group>
          </GridCol>
        </Grid>
        <Space h={'lg'} />
        <Grid justify="start">
          <GridCol >
            <TableScrollContainer minWidth={isLg ? '75%' : '100%'} type="native">
              <Table>
                <TableThead>
                  <TableTr>
                    <TableTh>No</TableTh>
                    <TableTh>TPS</TableTh>
                    <TableTh>Lokasi</TableTh>
                    <TableTh>Desa</TableTh>
                    <TableTh>Kecamatan</TableTh>
                    <TableTh>Suara Paslon 1</TableTh>
                    <TableTh>Suara Paslon 2</TableTh>
                    <TableTh>Bukti Form </TableTh>
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
