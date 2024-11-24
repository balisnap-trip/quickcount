"use client"
import { Alert, Box, Button, Grid, GridCol, LoadingOverlay, Space, TextInput } from "@mantine/core";
import React, { useEffect, useState } from "react";
import { useMediaQuery } from "@mantine/hooks";
import {  IconCheck, IconInfoCircle, IconSearch } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { searchNoWa } from "../lib/verifikasi/verifikasi";
import { updateSaksi } from "../lib/crud/saksi";


export default function VerifikasiPage() {
  const [dataSaksi, setDataSaksi] = useState<any>({});
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const router = useRouter()
  const [nomorWa, setNomorWa] = useState<any>("")
  const [errors, setErrors] = useState<any>({})
  const [formData, setFormData] = useState<any>({
    nama_saksi: "",
    nik: "",
    nomor_wa: "",
  });

  const [saksiNotFound, setSaksiNotFound] = useState<boolean>(false)

  const handleCariNomorWa = async () => {
    setIsLoading(true)
    try {
      if(nomorWa === "") {
        setErrors({nomor_wa: "Nomor WA tidak boleh kosong"})
      } else {
        setErrors({})
        const res = await searchNoWa(nomorWa)
        setDataSaksi(res)
        setSaksiNotFound(false)
      }
      
    } catch (error) {
      setSaksiNotFound(true)
      console.log("Gagal memuat data saksi")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if(nomorWa != ""){
      setErrors({})
    }
  }, [nomorWa])

  useEffect(() => {
    if (dataSaksi) {
      const validFields = ['nama_saksi', 'nik', 'nomor_wa']; // Fields to be copied
      const formDataCopy: any = {};
  
      validFields.forEach((key) => {
        // Set default empty string if field doesn't exist in dataSaksi
        formDataCopy[key] = dataSaksi[key] || ""; // Fallback to empty string if undefined
      });
  
      setFormData(formDataCopy); // Update formData with valid fields
    }
  }, [dataSaksi]);
  

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevFormData: any) => ({
      ...prevFormData,
      [name]: value,
    }));
  }

  const handleUpdateSaksi = async () => {
    try {
      setIsLoading(true)
      const res = await updateSaksi(dataSaksi.id_saksi, formData)
      if(res) {
        router.push(`/verifikasi/sukses`)
      }
    } catch (error) {
      console.log("Gagal memuat data saksi")
    }
  }
  return (
    <>
      <h1>Verifikasi Data Saksi</h1>
      <Box pos="relative">
        <LoadingOverlay visible={isLoading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
        <Grid justify="start">
          <GridCol span={{ base: 12, md: 6, lg: 4 }}>            
            {Object.keys(dataSaksi).length < 1 ? (
              <>
                <TextInput
                  style={{ paddingTop: 10, flex: 1 }}
                  name="nomor_wa"
                  placeholder="Masukkan Nomor WhatsApp"
                  label="Nomor WhatsApp"
                  value={nomorWa}
                  onChange={(e) => setNomorWa(e.target.value)}
                  error={errors.nomor_wa}
                  type="number"
                />
                <Space h={"md"} />
                <Button
                  size="compact-lg"
                  leftSection={<IconSearch size={14} />}
                  variant="outline"
                  onClick={handleCariNomorWa}
                >
                  Cari
                </Button>
                <Space h={"md"} />
                {saksiNotFound && (
                  <Alert variant="light" color="red" title="Data tidak ditemukan" icon={<IconInfoCircle />}>
                    Data sakisi tidak ditemukan. Pastikan nomor WhatsApp yang Anda masukkan benar.
                  </Alert>
                )}
              </>
            ) : (
              <>
                <TextInput
                  style={{ paddingTop: 10, flex: 1 }}
                  name="nama_saksi"
                  placeholder="Masukkan Nama Anda"
                  label="Nama Saksi"
                  value={formData.nama_saksi}
                  onChange={(e) => handleInputChange(e) }               
                  type="text"
                  error={formData.nama_saksi ? "" : "Nama saksi tidak boleh kosong"}
                />
                <Space h={"md"} />
                <TextInput
                  style={{ paddingTop: 10, flex: 1 }}
                  name="nik"
                  placeholder="Masukkan NIK Anda"
                  label="NIK"
                  value={formData.nik}
                  onChange={(e) => handleInputChange(e)}
                  type="number"
                  error={formData.nomor_wa ? "" : "NIK tidak boleh kosong"}
                />
                <Space h={"md"} />
                <TextInput
                  style={{ paddingTop: 10, flex: 1 }}
                  name="nomor_wa"
                  placeholder="Masukkan Nomor WhatsApp"
                  label="Nomor WhatsApp"
                  value={formData.nomor_wa}
                  onChange={(e) => handleInputChange(e)}
                  type="number"
                  error={formData.nomor_wa ? "" : "Nomor WA tidak boleh kosong"}
                />
                <Space h={"md"} />
                <Button
                  size="compact-lg"
                  leftSection={<IconCheck size={14} />}
                  variant="outline"
                  onClick={handleUpdateSaksi}
                >
                  Simpan
                </Button>
              </>
            )}
                        
          </GridCol>
        </Grid>     
      </Box>
    </>
  );
}
