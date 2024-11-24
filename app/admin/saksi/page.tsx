"use client"
import { Grid, Select, GridCol, TableTr, TableTd, Table, TableTbody, TableThead, TableScrollContainer, TableTh, Space, Box, LoadingOverlay, Button, Group, Text, Pagination, TextInput, Switch } from "@mantine/core";
import React, { useEffect, useState } from "react";
import { kecamatan } from "../../lib/masterData";
import { useMediaQuery } from "@mantine/hooks";
import { IconCheck, IconEdit, IconMail, IconSearch, IconX } from "@tabler/icons-react";
import { modals } from '@mantine/modals'
import { useRouter } from "next/navigation";
import { aktivasiToken, deleteSaksi, fetchDataSaksi, kirimToken, perbaikanData } from "../../lib/crud/saksi";

const SEMUA_KECAMATAN = "SEMUA KECAMATAN"

const handleEditSaksi = (id: number) => {
  window.location.href = `/admin/saksi/edit/${id}`
}

export default function SaksiPage() {
  const [selectedKec, setSelectedKec] = useState<string | null>(SEMUA_KECAMATAN);
  const [dataSaksi, setDataSaksi] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const isLg = useMediaQuery('(min-width: 1200px)');
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalPage, setTotalPage] = useState<number>(0)
  const [namaSaksi, setNamaSaksi] = useState<any>("")
  const [tokenDoUpdate, setTokenDoUpdate] = useState<boolean>(false)

  const confirmModal = (id: number) => modals.openConfirmModal({
    title: 'Hapus data Saksi',
    children: (
      <Text size="sm">
        Data yang yang dihapus tidak dapat dikembalikan
      </Text>
    ),
    labels: { confirm: 'OK', cancel: 'Batal' },
    onConfirm: () => handleDeleteSaksi(id),
  });

  const handleDeleteSaksi = async (id: number) => {
    setIsLoading(true)
    try {
      await deleteSaksi(id)
    } catch (error) {
      console.log("Gagal menghapus data saksi")
    } finally {
      setIsLoading(false)
      router.back()
    }
  }

  const rows = dataSaksi.map((saksi, index) => (
    <TableTr key={saksi.id_saksi} >
      <TableTd>{index + 1}</TableTd>
      <TableTd>{saksi.nama_saksi}</TableTd>
      <TableTd>{saksi.nomor_wa}</TableTd>
      <TableTd>{saksi.nik}</TableTd>
      <TableTd>
        <Switch
          size="md"
          onLabel="ON"
          offLabel="OFF"
          checked={saksi.token != null}
          disabled={!saksi.nomor_wa}
          onChange={() => handleAktivasiToken(!saksi.token, saksi.id_saksi)}
        />

      </TableTd>
      <TableTd>{saksi.status_input}</TableTd>
      <TableTd>{saksi.saksiTPS[0].tps.nama_tps}</TableTd>
      <TableTd>{saksi.saksiTPS[0].tps.lokasi}</TableTd>
      <TableTd>{saksi.saksiTPS[0].tps.desa}</TableTd>
      <TableTd>{saksi.saksiTPS[0].tps.kecamatan}</TableTd>
      <TableTd>
        <Group>
          <Button
            size="compact-md"
            leftSection={<IconEdit size={14} />}
            variant="outline"
            onClick={() => handleEditSaksi(saksi.id_saksi)}
          >
            Edit
          </Button>
          <Button
            size="compact-md"
            onClick={() => confirmModal(saksi.id_saksi)}
            color="red"
            leftSection={
              <IconX size={14} />
            }
            variant="outline">
            Hapus
          </Button>
          <Button
            size="compact-md"
            disabled={!saksi.nomor_wa || !saksi.token}
            onClick={() => handleKirimToken(saksi.id_saksi)}
            color="blue"
            leftSection={
              <IconMail size={14} />
            }
            variant="outline">
            Kirim Token
          </Button>
          { saksi.status_input && (
            <Button
              size="compact-md"
              onClick={() => perbaikanData(saksi.id_saksi)}
              color="blue"
              leftSection={
                <IconEdit size={14} />
              }
              variant="outline">
              Perbaikan Data
            </Button>
          )}
        </Group>
      </TableTd>
    </TableTr>
  ))

  const fetchData = async () => {
    setIsLoading(true)
    const filter = {
      kec: selectedKec === SEMUA_KECAMATAN ? "" : selectedKec,
      namaSaksi
    }
    try {
      const res = await fetchDataSaksi(currentPage, filter);
      setDataSaksi(res.saksi);
      setTotalPage(res.totalPage)
      setIsLoading(false)
    } catch (error) {
      console.error('Gagal memuat saksi:', error);
    }
  };

  useEffect(() => {
    setCurrentPage(1)
  }, [selectedKec, namaSaksi])


  // Gunakan useEffect untuk mengambil data hanya sekali saat komponen dimuat
  useEffect(() => {
    fetchData(); // Memanggil fetchData hanya sekali saat mount
  }, [currentPage, selectedKec, tokenDoUpdate]); // Dependency kosong, hanya dijalankan sekali saat komponen mount

  const handleAktivasiToken = async (flag: boolean, id: number | null = null) => {
    try {
      setIsLoading(true)
      await aktivasiToken(flag, id)
      setTokenDoUpdate(prev => !prev)
    } catch (error) {
      throw new Error('Gagal aktivasi token');
    } finally {
      setIsLoading(false)
    }
  }

  const handleKirimToken = async (id: number | null = null) => {
    try {
      setIsLoading(true)
      await kirimToken(id)
    } catch (error) {
      throw new Error('Gagal kirim token');
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <>
      <h1>Data Saksi</h1>
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
              data={[SEMUA_KECAMATAN, ...kecamatan.map((kec) => kec.kecamatan)]}
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
            <Group>
              <Button
                size="compact-md"
                leftSection={<IconCheck size={14} />}
                variant="outline"
                onClick={() => handleAktivasiToken(true)}
              >
                Aktifkan Token
              </Button>
              <Button
                size="compact-md"
                onClick={() => handleAktivasiToken(false)}
                color="red"
                leftSection={
                  <IconX size={14} />
                }
                variant="outline">
                Nonaktifkan Token
              </Button>
              {/* <Button
                size="compact-md"
                onClick={() => handleKirimToken()}
                color="blue"
                leftSection={
                  <IconMail size={14} />
                }
                variant="outline">
                Kirim Token
              </Button> */}
            </Group>
            <Space h={"lg"} />

            <TableScrollContainer minWidth={isLg ? '75%' : '100%'} type="native">
              <Table>
                <TableThead>
                  <TableTr>
                    <TableTh>No</TableTh>
                    <TableTh>Nama Saksi</TableTh>
                    <TableTh>Nomor WA</TableTh>
                    <TableTh>NIK</TableTh>
                    <TableTh>Status Token</TableTh>
                    <TableTh>Status Input</TableTh>
                    <TableTh>TPS</TableTh>
                    <TableTh>Lokasi</TableTh>
                    <TableTh>Desa</TableTh>
                    <TableTh>Kecamatan</TableTh>
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
