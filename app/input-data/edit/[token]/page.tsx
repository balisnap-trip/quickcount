"use client";
import { useParams , useRouter} from "next/navigation";
import { useEffect, useState } from "react";
import { Alert, Box, Button, CloseButton, FileInput, Grid, GridCol, Image, LoadingOverlay, Space, Text, TextInput } from "@mantine/core";
import { IconInfoCircle, IconPhoto } from "@tabler/icons-react";
import { getStatusEdit, updateInput } from "../../../lib/input-data/input";

type InputDataProps = {
  suara_bupati_1: any;
  suara_bupati_2: any;
  // suaraGubernur1: any;
  // suaraGubernur2: any;
  suara_tidak_sah_bupati: any;
  // suaraTidakSahGubernur: any;
  // totalSuaraMasuk: any;
  buktiGambar: any
  // fotoFormulirC1Gubernur: any
}

export default function EditData() {
  const [saksi, setSaksi] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null); // track token validation state
  const [formData, setFormData] = useState<InputDataProps>({
    suara_bupati_1: "",
    suara_bupati_2: "",   
    suara_tidak_sah_bupati: "",
 
    buktiGambar: null,
   })
  const router = useRouter()
  const params = useParams();
  const { token } = params;

  

  useEffect(() => {
    const fetchSaksi = async () => {
      try {
        setIsLoading(true);
        const response = await getStatusEdit(token as string);
        if (response) {
          setSaksi(response);
          setFormData(response.dataPerhitungan[0]);
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

  const inputFilled = formData.suara_bupati_1 !== "" && formData.suara_bupati_2 !== "" && formData.suara_tidak_sah_bupati !== "" && formData.buktiGambar !== null;
  const handleFileChange = (name: string, file: File | null) => {
    setFormData((prev) => ({ ...prev, [name]: file }));
  };

  const handleUpdateInput = async () => {
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

      data.append("id_perhitungan", saksi.dataPerhitungan[0].id_perhitungan);
      data.append("idSaksi", saksi.id_saksi);
      data.append("idTps", saksi.saksiTPS[0].tps.id_tps);
      data.append("id_gambar", saksi.dataPerhitungan[0].buktiGambar[0].id_gambar);
      const response = await updateInput(data);

      if (response && response.status === "success") {
        router.push(`/input-data/edit/${token}/sukses`)
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
                {saksi.status_input && saksi.status_edit ? (
                  <Grid justify="start" gutter={"md"}>
                    <GridCol>
                      <Text fz="h4" fw={"bold"} mt="lg" mb="lg" ta="start">
                        Anda sudah melakukan perbaikan data.
                      </Text>
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
                      value={formData.suara_bupati_1}
                      onChange={(event) => handleInputChange("suara_bupati_1", event)}
                      name="suara_bupati_1"
                      type="number"
                      label="Jumlah Suara Calon Bupati Paslon 1"
                      placeholder="Masukkan Jumlah Suara Calon Bupati Paslon 1"
                      error={
                        formData.suara_bupati_1 === "" || Number(formData.suara_bupati_1) <= 0
                          ? "Wajib diisi dan tidak boleh 0"
                          : ""
                      }
                      rightSection={
                        <CloseButton
                          aria-label="Clear input"
                          onClick={() => setFormData((prev) => ({ ...prev, suara_bupati_1: "" }))}
                          style={{ display: formData.suara_bupati_1 ? undefined : 'none' }}
                        />
                      }
                    />
                    <Space h={10} />
                    <TextInput
                      value={formData.suara_bupati_2}
                      onChange={(event) => handleInputChange("suara_bupati_2", event)}
                      name="suara_bupati_2"
                      type="number"
                      label="Jumlah Suara Calon Bupati Paslon 2"
                      placeholder="Masukkan Jumlah Suara Calon Bupati Paslon 2"
                      error={
                        formData.suara_bupati_2 === "" || Number(formData.suara_bupati_2) <= 0
                          ? "Wajib diisi dan tidak boleh 0"
                          : ""
                      }
                      rightSection={
                        <CloseButton
                          aria-label="Clear input"
                          onClick={() => setFormData((prev) => ({ ...prev, suara_bupati_2: "" }))}
                          style={{ display: formData.suara_bupati_2 ? undefined : 'none' }}
                        />
                      }
                    />
                    <Space h={10} />
                    <TextInput
                      value={formData.suara_tidak_sah_bupati}
                      onChange={(event) => handleInputChange("suara_tidak_sah_bupati", event)}
                      name="suara_tidak_sah_bupati"
                      type="number"
                      label="Jumlah Suara tidak Sah"
                      placeholder="Masukkan Jumlah Suara Tidak Sah"
                      error={
                        formData.suara_tidak_sah_bupati === "" || Number(formData.suara_tidak_sah_bupati) <= 0
                          ? "Wajib diisi dan tidak boleh 0"
                          : ""
                      }
                      rightSection={
                        <CloseButton
                          aria-label="Clear input"
                          onClick={() => setFormData((prev) => ({ ...prev, suara_tidak_sah_bupati: "" }))}
                          style={{ display: formData.suara_tidak_sah_bupati ? undefined : 'none' }}
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
                    {formData.buktiGambar && formData.buktiGambar.length > 0 && (                    
                       <div style={{ marginBottom: "10px", textAlign: "center" }}>
                           {/* Label */}
                           <Text ta={"start"} fz="sm" fw="bold" mb={5}>
                            Foto Formulir C1 yang diunggah
                           </Text>
                           
                           {/* Gambar Sebelumnya */}
                           <Image
                            src={formData.buktiGambar[0].file_path}
                            alt="Gambar sebelumnya"
                            style={{ maxWidth: "100%", maxHeight: "200px", borderRadius: "8px" }}
                           />
                           
                           {/* Tombol Hapus */}
                           <Button
                            mt={10}                           
                            color="red"
                            size="xs"
                            onClick={() => handleFileChange("buktiGambar", null)} // Fungsi untuk menghapus gambar
                            >
                            Hapus Foto
                           </Button>
                       </div>                    
                    )}

                    { (formData.buktiGambar == null || formData.buktiGambar instanceof File) && (
                        <FileInput
                        value={formData.buktiGambar ? formData.buktiGambar : null}
                        onChange={(file: File | null) => handleFileChange("buktiGambar", file)}
                        name="formulir_c1_bupati"
                        label="Foto Formulir C1 (JPG/PNG)"
                        placeholder="Pilih Foto Formulir C1"
                        accept="image/png,image/jpeg"
                        mt="md"
                        error={formData.buktiGambar ? "" : "Wajib diisi"}
                        rightSection={
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            {!formData.buktiGambar && <IconPhoto size={18} style={{ color: "gray" }} />}
                            {formData.buktiGambar && (
                                <CloseButton
                                aria-label="Clear input"
                                onClick={() => handleFileChange("buktiGambar", null)}
                                />
                            )}
                            </div>
                        }
                        />
                    )}
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
                 <Space h={10} />
                </Grid>
                  <Button type="submit" mt="md" onClick={handleUpdateInput} disabled={!inputFilled}>
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
