"use client";
import { useParams , useRouter} from "next/navigation";
import { useEffect, useState } from "react";
import { getUserByToken, inputData } from "../../lib/input-data/input";
import { Alert, Box, Button, FileInput, Grid, GridCol, LoadingOverlay, Space, Text, TextInput } from "@mantine/core";
import { IconInfoCircle, IconPhoto } from "@tabler/icons-react";

type InputDataProps = {
  suaraBupati1: any;
  suaraBupati2: any;
  suaraGubernur1: any;
  suaraGubernur2: any;
  suaraTidakSahBupati: any;
  suaraTidakSahGubernur: any;
  totalSuaraMasuk: any;
  fotoFormulirC1Bupati: any
  fotoFormulirC1Gubernur: any
}

export default function InputData() {
  const [saksi, setSaksi] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null); // track token validation state
  const [formData, setFormData] = useState<InputDataProps>({
    suaraBupati1: "",
    suaraBupati2: "",
    suaraGubernur1: "",
    suaraGubernur2: "",
    suaraTidakSahBupati: "",
    suaraTidakSahGubernur: "",
    totalSuaraMasuk: "",
    fotoFormulirC1Bupati: null,
    fotoFormulirC1Gubernur: null
  })
  const router = useRouter()
  const params = useParams();
  const { token } = params;

  useEffect(() => {
    const fetchSaksi = async () => {
      try {
        setIsLoading(true);
        const response = await getUserByToken(token as string);
        if (response) {
          setSaksi(response);
          setIsTokenValid(true); // Token is valid
        } else {
          setIsTokenValid(false); // No data means invalid token
        }
      } catch (error) {
        console.error(error);
        setIsTokenValid(false); // Handle error (e.g., token invalid)
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      fetchSaksi();
    }
  }, [token]);

  const handleInputChange = (name: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  }

  const handleFileChange = (name: string, file: File | null) => {
    setFormData((prev) => ({ ...prev, [name]: file }));
  };

  const handleSubmit = async () => {

    console.log(formData);
    try {
      setIsLoading(true);
      const data = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (value instanceof File) {
          data.append(key, value);
        }
        else {
          data.append(key, value);
        }
      })

      data.append("idSaksi", saksi.id_saksi);
      data.append("idTps", saksi.saksiTPS[0].tps.id_tps);

      const response = await inputData(data);

      if (response && response.status === "success") {
        router.push(`/input-data/${token}/sukses`)
      }

    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <>
      <Box pos="relative">
        <LoadingOverlay visible={isLoading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
        {isTokenValid === null ? (
          <></>
        ) : (
          <>
            {saksi ? (
              <>
                <Grid justify="start">
                  <GridCol span={{ base: 12, md: 8, lg: 8 }}>
                    <Text fz="h3" fw={"bold"} mt="lg" mb="lg" ta="start">
                      Selamat Datang {saksi.nama_saksi}
                    </Text>
                    {saksi.saksiTPS && (
                      <Text fz={"h4"} fw={"bold"} mt="lg" mb="lg" ta="start">
                        Saksi TPS: {`${saksi.saksiTPS[0].tps.nama_tps} ${saksi.saksiTPS[0].tps.lokasi}, ${saksi.saksiTPS[0].tps.desa}, ${saksi.saksiTPS[0].tps.kecamatan}`}
                      </Text>
                    )}
                    <Space h={20} />
                    <Text fz="h3" fw={"normal"} mt="lg" mb="lg" ta="start">
                      Silahkan melakukan input data
                    </Text>
                    <Alert variant="light" color="red" title="Penting" icon={<IconInfoCircle />}>
                      Halaman ini tidak akan bisa diakses lagi setelah input data selesai. Pastikan data yang dimasukkan sudah benar<br />
                      Untuk perubahan data, silahkan hubungi admin
                    </Alert>
                  </GridCol>
                </Grid>
                <Grid justify="start" gutter={"md"}>
                  <GridCol span={{ base: 12, md: 6, lg: 4 }}>
                    <Text fz="h4" fw={"normal"} mt="lg" mb="lg" ta="start">
                      Calon Bupati Gianyar
                    </Text>
                    <TextInput
                      value={formData.suaraBupati1}
                      onChange={(event) => handleInputChange("suaraBupati1", event)}
                      name="suara_bupati_1"
                      type="number"
                      label="Jumlah Suara Calon Bupati Paslon 1"
                      placeholder="Masukkan Jumlah Suara Calon Bupati Paslon 1"
                    />
                    <Space h={10} />
                    <TextInput
                      value={formData.suaraBupati2}
                      onChange={(event) => handleInputChange("suaraBupati2", event)}
                      name="suara_bupati_2"
                      type="number"
                      label="Jumlah Suara Calon Bupati Paslon 2"
                      placeholder="Masukkan Jumlah Suara Calon Bupati Paslon 2"
                    />
                    <TextInput
                      value={formData.suaraTidakSahBupati}
                      onChange={(event) => handleInputChange("suaraTidakSahBupati", event)}
                      name="suara_tidak_sah_bupati"
                      type="number"
                      label="Jumlah Suara tidak Sah"
                      placeholder="Masukkan Jumlah Suara Tidak Sah"
                    />
                    <TextInput
                      name="total_suara_masuk"
                      type="number"
                      label="Jumlah Total Suara Masuk"
                      placeholder="Masukkan Jumlah Suara Masuk"
                      value={formData.totalSuaraMasuk}
                      onChange={(event) => handleInputChange("totalSuaraMasuk", event)}
                    />
                    <FileInput
                      value={formData.fotoFormulirC1Bupati}
                      onChange={(file: File | null) => handleFileChange("fotoFormulirC1Bupati", file)}
                      name="formulir_c1_bupati"
                      rightSection={<IconPhoto size={14} />}
                      label="Foto Formulir C1 (JPG/PNG)"
                      placeholder="Pilih Foto Formulir C1"
                      rightSectionPointerEvents="none"
                      accept="image/png,image/jpeg"
                      mt="md"
                    />
                  </GridCol>
                  <GridCol span={{ base: 12, md: 6, lg: 4 }}>
                    <Text fz="h4" fw={"normal"} mt="lg" mb="lg" ta="start">
                      Calon Gubernur Bali
                    </Text>
                    <TextInput
                      value={formData.suaraGubernur1}
                      onChange={(event) => handleInputChange("suaraGubernur1", event)}
                      name="suara_gubernur_1"
                      type="number"
                      label="Jumlah Suara Calon Gubernur Paslon 1"
                      placeholder="Masukkan Jumlah Suara Calon Gubernur Paslon 1"
                    />
                    <Space h={10} />
                    <TextInput
                      value={formData.suaraGubernur2}
                      onChange={(event) => handleInputChange("suaraGubernur2", event)}
                      name="suara_gubernur_2"
                      type="number"
                      label="Jumlah Suara Calon Gubernur Paslon 2"
                      placeholder="Masukkan Jumlah Suara Calon Gubernur Paslon 2"
                    />
                    <TextInput
                      value={formData.suaraTidakSahGubernur}
                      onChange={(event) => handleInputChange("suaraTidakSahGubernur", event)}
                      name="suara_tidak_sah_gubernur"
                      type="number"
                      label="Jumlah Suara tidak Sah"
                      placeholder="Masukkan Jumlah Suara Tidak Sah"
                    />
                    <FileInput
                      name="formulir_c1_gubernur"
                      value={formData.fotoFormulirC1Gubernur}
                      onChange={(file: File | null) => handleFileChange("fotoFormulirC1Gubernur", file)}
                      rightSection={<IconPhoto size={14} />}
                      label="Foto Formulir C1 (JPG/PNG)"
                      placeholder="Pilih Foto Formulir C1"
                      rightSectionPointerEvents="none"
                      accept="image/png,image/jpeg"
                      mt="md"
                    />
                  </GridCol>
                 
                </Grid>
                <Button type="submit" mt="md" onClick={handleSubmit}>
                    Submit
                  </Button>
                  <Space h={40} />
              </>
            ) : (
              <Text fz="h3" fw={"normal"} mt="lg" mb="lg" ta="start">
                Token Tidak Valid
              </Text>
            )}
          </>
        )}
      </Box>
    </>
  );
}
