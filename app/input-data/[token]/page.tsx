"use client";
import { useParams , useRouter} from "next/navigation";
import { useEffect, useState } from "react";
import { getUserByToken, inputData } from "../../lib/input-data/input";
import { Alert, Box, Button, CloseButton, FileInput, Grid, GridCol, Image, LoadingOverlay, Space, Table, TableTbody, TableTd, TableTh, TableThead, TableTr, Text, TextInput } from "@mantine/core";
import { IconInfoCircle, IconPhoto } from "@tabler/icons-react";

type InputDataProps = {
  suaraBupati1: any;
  suaraBupati2: any;
  // suaraGubernur1: any;
  // suaraGubernur2: any;
  suaraTidakSahBupati: any;
  // suaraTidakSahGubernur: any;
  // totalSuaraMasuk: any;
  fotoFormulirC1Bupati: any
  // fotoFormulirC1Gubernur: any
}

export default function InputData() {
  const [saksi, setSaksi] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null); // track token validation state
  const [formData, setFormData] = useState<InputDataProps>({
    suaraBupati1: "",
    suaraBupati2: "",
    // suaraGubernur1: "",
    // suaraGubernur2: "",
    suaraTidakSahBupati: "",
    // suaraTidakSahGubernur: "",
    // totalSuaraMasuk: "",
    fotoFormulirC1Bupati: null,
    // fotoFormulirC1Gubernur: null
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

  const inputFilled = formData.suaraBupati1 !== "" && formData.suaraBupati2 !== "" && formData.suaraTidakSahBupati !== "" && formData.fotoFormulirC1Bupati !== null;
  const handleFileChange = (name: string, file: File | null) => {
    setFormData((prev) => ({ ...prev, [name]: file }));
  };

  const handleSubmit = async () => {

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
                    {!saksi.status_input && (
                      <>
                        <Space h={20} />
                        <Text fz="h3" fw={"normal"} mt="lg" mb="lg" ta="start">
                          Silahkan melakukan input data
                        </Text>
                        <Alert variant="light" color="red" title="Penting" icon={<IconInfoCircle />}>
                          Halaman ini tidak akan bisa diakses lagi setelah input data selesai. Pastikan data yang dimasukkan sudah benar<br />
                          Untuk perubahan data, silahkan hubungi admin
                        </Alert>
                      </>
                    )}
                  </GridCol>
                </Grid>
                {saksi.status_input ? (
                  <Grid justify="start" gutter={"md"}>
                    <GridCol>
                      <Text fz="h4" fw={"bold"} mt="lg" mb="lg" ta="start">
                        Anda sudah melakukan input data. Untuk perbaikan data mohon menghubungi admin
                      </Text>
                    </GridCol>
                    <GridCol span={{ base: 12, md: 6, lg: 4 }}>
                      
                      <Table striped highlightOnHover withTableBorder>
                        <TableThead>
                          <TableTr style={{ textAlign: "left"}}>
                            <TableTh style={{ padding: "8px" }}>Data Suara</TableTh>
                            <TableTh></TableTh>
                          </TableTr>
                        </TableThead>
                        <TableTbody>
                          <TableTr>
                            <TableTd>Jumlah Suara Calon Bupati Paslon 1</TableTd>
                            <TableTd>
                              <Text style={{ fontWeight: 'bold' }}>
                               {saksi.dataPerhitungan[0].suara_bupati_1}
                              </Text>
                            </TableTd>
                          </TableTr>
                          <TableTr>
                            <TableTd>Jumlah Suara Calon Bupati Paslon 1</TableTd>
                            <TableTd>
                              <Text style={{ fontWeight: 'bold' }}>
                               {saksi.dataPerhitungan[0].suara_bupati_2}
                              </Text>
                            </TableTd>
                          </TableTr>
                          <TableTr>
                            <TableTd>Jumlah Suara Tidak Sah</TableTd>
                            <TableTd>
                              <Text style={{ fontWeight: 'bold' }}>
                               {saksi.dataPerhitungan[0].suara_tidak_sah_bupati}
                              </Text>
                            </TableTd>
                          </TableTr>                          
                        </TableTbody>
                      </Table>
                      <Space h={20} />
                      {saksi.dataPerhitungan[0] && saksi.dataPerhitungan[0].buktiGambar.length > 0 && (                    
                       <div style={{ marginBottom: "10px", textAlign: "center" }}>
                           {/* Label */}
                           <Text ta={"start"} fz="sm" fw="bold" mb={5}>
                            Foto Formulir C1 yang diunggah
                           </Text>
                           
                           {/* Gambar Sebelumnya */}
                           <Image
                            src={saksi.dataPerhitungan[0].buktiGambar[0].file_path}
                            alt="Gambar sebelumnya"
                            style={{ maxWidth: "100%", maxHeight: "200px", borderRadius: "8px" }}
                           />                          
                       </div>                    
                    )}
                    </GridCol>
                  </Grid>
                ): (
                  <>
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
                      error={
                        formData.suaraBupati1 === "" || Number(formData.suaraBupati1) <= 0
                          ? "Wajib diisi dan tidak boleh 0"
                          : ""
                      }
                      rightSection={
                        <CloseButton
                          aria-label="Clear input"
                          onClick={() => setFormData((prev) => ({ ...prev, suaraBupati1: "" }))}
                          style={{ display: formData.suaraBupati1 ? undefined : 'none' }}
                        />
                      }
                    />
                    <Space h={10} />
                    <TextInput
                      value={formData.suaraBupati2}
                      onChange={(event) => handleInputChange("suaraBupati2", event)}
                      name="suara_bupati_2"
                      type="number"
                      label="Jumlah Suara Calon Bupati Paslon 2"
                      placeholder="Masukkan Jumlah Suara Calon Bupati Paslon 2"
                      error={
                        formData.suaraBupati2 === "" || Number(formData.suaraBupati2) <= 0
                          ? "Wajib diisi dan tidak boleh 0"
                          : ""
                      }
                      rightSection={
                        <CloseButton
                          aria-label="Clear input"
                          onClick={() => setFormData((prev) => ({ ...prev, suaraBupati2: "" }))}
                          style={{ display: formData.suaraBupati2 ? undefined : 'none' }}
                        />
                      }
                    />
                    <Space h={10} />
                    <TextInput
                      value={formData.suaraTidakSahBupati}
                      onChange={(event) => handleInputChange("suaraTidakSahBupati", event)}
                      name="suara_tidak_sah_bupati"
                      type="number"
                      label="Jumlah Suara tidak Sah"
                      placeholder="Masukkan Jumlah Suara Tidak Sah"
                      error={
                        formData.suaraTidakSahBupati === ""
                          ? "Wajib diisi"
                          : ""
                      }
                      rightSection={
                        <CloseButton
                          aria-label="Clear input"
                          onClick={() => setFormData((prev) => ({ ...prev, suaraTidakSahBupati: "" }))}
                          style={{ display: formData.suaraTidakSahBupati ? undefined : 'none' }}
                        />
                      }
                    />
                    {/* <TextInput
                      name="total_suara_masuk"
                      type="number"
                      label="Jumlah Total Suara Masuk"
                      placeholder="Masukkan Jumlah Suara Masuk"
                      value={formData.totalSuaraMasuk}
                      onChange={(event) => handleInputChange("totalSuaraMasuk", event)}
                    /> */}
                    <Space h={10} />
                    <FileInput
                      value={formData.fotoFormulirC1Bupati}
                      onChange={(file: File | null) => handleFileChange("fotoFormulirC1Bupati", file)}
                      name="formulir_c1_bupati"
                      label="Foto Formulir C1 (JPG/PNG)"
                      placeholder="Pilih Foto Formulir C1"
                      accept="image/png,image/jpeg"
                      mt="md"
                      error={formData.fotoFormulirC1Bupati ? "" : "Wajib diisi"}
                      rightSection={
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          {! formData.fotoFormulirC1Bupati &&<IconPhoto size={18} style={{ color: "gray" }} />}
                          {formData.fotoFormulirC1Bupati && (
                            <CloseButton
                              aria-label="Clear input"
                              onClick={() => handleFileChange("fotoFormulirC1Bupati", null)}
                            />
                          )}
                        </div>
                      }
                    />
                  </GridCol>
                  {/* <GridCol span={{ base: 12, md: 6, lg: 4 }}>
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
                  </GridCol> */}
                 
                </Grid>
                  <Button type="submit" mt="md" onClick={handleSubmit} disabled={!inputFilled}>
                    Simpan
                  </Button>
                <Space h={40} />
                  </>
                )}
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
