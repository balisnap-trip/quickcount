"use client";
import { BarChart } from "@mantine/charts";
import { Box, Center, Grid, Image, LoadingOverlay, Space, Text, Title, Divider, Table, NumberFormatter, TableThead, TableTr, TableTh, TableTbody, TableTd, Alert } from "@mantine/core";
import { useEffect, useState } from "react";
import { dataSuara } from "../lib/dashboard";
import { readAccess } from "../lib/access-control/access";
import { IconInfoCircle } from "@tabler/icons-react";
import { useSession } from "next-auth/react";

export default function Dashboard() {
  const [totalSuara, setTotalSuara] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [config, setConfig] = useState<any>({})
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const { data: session } = useSession(); 


  useEffect(() => {
    // Jika session tersedia, artinya pengguna sudah login
    if (session) {
      setIsLoggedIn(true);
      if((session.user as any).role === "admin") setIsAdmin(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [session]); // Perbarui status login saat session berubah

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await dataSuara();
        setTotalSuara(response);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
    fetchConfig()
  }, []);

  const fetchConfig = async() => {
    try {
      const res = await readAccess()
      setConfig(res)
    } catch (error) {
      console.log(error)
    }
  } 

  const chrtData = [
    { paslon: `Paslon 1 - ${totalSuara.presentaseBupati1 || "0%"}`, Suara: Number(totalSuara.suara_bupati_1 || 0) },
    { paslon: `Paslon 2 - ${totalSuara.presentaseBupati2 || "0%"}`, Suara: Number(totalSuara.suara_bupati_2 || 0) },
  ];


  const suaraKecamatan = totalSuara.totalSuaraPerKecamatan;
  const totalSuaraMasuk =
    Number(totalSuara.suara_bupati_1 || 0) +
    Number(totalSuara.suara_bupati_2 || 0);

    return (
    <>
      <Box pos="relative" pb={40}>
        <LoadingOverlay visible={isLoading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
        
       { config.accessEnabled && !isLoading || (isLoggedIn && isAdmin) ? (
        <>
        {/* Header */}
        <Box>
          <Image            
            alt="Header"
            w="100%"
            // h={500}
            src={"header/header.jpg"}
          />
        </Box>
          <div
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              padding: "40px",
              textAlign: "center",
              // borderRadius: "5px",
            }}
          >
            <Text c="white" fz="h1" fw={700} style={{ textShadow: "0px 2px 4px rgba(0, 0, 0, 0.6)" }}>
              Hitung Cepat Pilkada Gianyar 2024
            </Text>
            <Title order={2} c="white" mt={20}>
              Berdasarkan Dokumen C1 masing-masing TPS se-Kabupaten Gianyar
            </Title>
          </div>
        
        {/* Perolehan Suara */}
        <Box maw={{ sm: '90vw', lg: '80vw' }} mx="auto" px={20}>
          <Box mt="lg" pt={40}>
            <Title order={3} c="dark.7" fw={600}>
              Perolehan Suara
            </Title>
            <Divider my="sm" />

            <Grid align="stretch" gutter="md">
              {/* Kolom Foto */}
              <Grid.Col span={{ base: 12, md: 6 }} order={{ base: 2, md: 1 }}>
                <Center h={300}>
                  <Box
                    style={{
                      textAlign: 'center',
                      display: 'flex',           // Gunakan flexbox untuk penyusunan elemen
                      justifyContent: 'center',  // Menjajarkan gambar secara horizontal
                      alignItems: 'center',      // Menjajarkan gambar secara vertikal
                      width: '100%',
                      padding: 'md',
                    }}
                  >
                    <Image
                      alt="bupati"
                      radius="md"
                      fit="contain"
                      h={300}
                      w="auto"
                      style={{
                        maxWidth: '100%', // Pastikan gambar tidak melebihi lebar kontainer
                      }}
                      src="paslon/bupati.png"
                    />
                  </Box>
                </Center>
              </Grid.Col>
              {/* Kolom Chart */}
              <Grid.Col span={{ base: 12, md: 6 }} order={{ base: 1, md: 2 }}>
                <Box
                  p="md"
                  style={{
                    backgroundColor: "#f9f9f9",
                    borderRadius: "8px",
                    width: '100%', // memastikan chart memenuhi lebar kolom
                    overflowX: 'auto' // menambahkan scroll jika konten melebihi lebar
                  }}
                >
                  <BarChart
                    h={400}
                    maxBarWidth={80}
                    withTooltip={false}
                    data={chrtData}
                    dataKey="paslon"
                    series={[{ name: "Suara", color: "blue" }]}
                    style={{ width: '100%' }} // memastikan chart tidak melebihi lebar
                  />
                </Box>
              </Grid.Col>
            </Grid>
          </Box>
          {/* Detail / Legend */}
          <Box mt="xl">
            <Title order={3} c="dark.7" fw={600}>
              Detail Statistik Perolehan Suara
            </Title>
            <Divider my="sm" />
            <Grid gutter="md" align="stretch">
              <Grid.Col span={{ base: 12, md: 6 }}>
                <div style={{ padding: '20px' }}>
                  <Table striped highlightOnHover withTableBorder>
                    <TableThead>
                      <TableTr style={{ textAlign: "left", backgroundColor: "#918f8f" }}>
                        <TableTh style={{ padding: "8px" }}>Detail</TableTh>
                        <TableTh></TableTh>
                      </TableTr>
                    </TableThead>
                    <TableTbody>
                      <TableTr>
                        <TableTd>Total Suara Calon Bupati Paslon 1</TableTd>
                        <TableTd>
                          <Text style={{ color: 'green', fontWeight: 'bold' }}>
                            {!totalSuara ? "" : <NumberFormatter thousandSeparator value={totalSuara.suara_bupati_1} suffix=" Suara" />}
                          </Text>
                        </TableTd>
                      </TableTr>
                      <TableTr>
                        <TableTd>Total Suara Calon Bupati Paslon 2</TableTd>
                        <TableTd>
                          <Text style={{ color: 'green', fontWeight: 'bold' }}>
                            {!totalSuara ? "" : <NumberFormatter thousandSeparator value={totalSuara.suara_bupati_2} suffix=" Suara" />}
                          </Text>
                        </TableTd>
                      </TableTr>
                      <TableTr>
                        <TableTd>Total Suara Tidak Sah</TableTd>
                        <TableTd>
                          <Text style={{ color: 'red', fontWeight: 'bold' }}>
                            {!totalSuara ? "" : <NumberFormatter thousandSeparator value={totalSuara.suara_tidak_sah_bupati} suffix=" Suara" />}
                          </Text>
                        </TableTd>
                      </TableTr>
                      <TableTr>
                        <TableTd>Total Suara</TableTd>
                        <TableTd>
                          <Text style={{ color: 'blue', fontWeight: 'bold' }}>
                            {!totalSuara ? "" : <NumberFormatter thousandSeparator value={totalSuaraMasuk} suffix=" Suara" />}
                          </Text>
                        </TableTd>
                      </TableTr>
                      <TableTr>
                        <TableTd>Total DPT</TableTd>
                        <TableTd>
                          <Text style={{ color: 'blue', fontWeight: 'bold' }}>
                            {!totalSuara ? "" : <NumberFormatter thousandSeparator value={totalSuara.total_dpt} />}
                          </Text>
                        </TableTd>
                      </TableTr>
                    </TableTbody>
                  </Table>
                </div>
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 6 }}>
                <div style={{ padding: '20px', overflowX: 'auto' }}>
                  <Table striped highlightOnHover withTableBorder style={{ tableLayout: 'auto', minWidth: '100%' }}>
                    <TableThead>
                      <TableTr bg="dark.2">
                        <TableTh style={{ padding: "8px" }} rowSpan={2}>Kecamatan</TableTh>
                        <TableTh style={{ textAlign: "center" }} colSpan={2}>Paslon 1</TableTh>
                        <TableTh style={{ textAlign: "center" }} colSpan={2}>Paslon 2</TableTh>
                      </TableTr>
                      <TableTr bg="dark.2">
                        <TableTh style={{ textAlign: "center" }}>Suara</TableTh>
                        <TableTh style={{ textAlign: "center" }}>%</TableTh>
                        <TableTh style={{ textAlign: "center" }}>Suara</TableTh>
                        <TableTh style={{ textAlign: "center" }}>%</TableTh>
                      </TableTr>
                    </TableThead>
                    <TableTbody>
                      {suaraKecamatan &&
                        Object.entries(suaraKecamatan).map(([key, value], index) => {
                          const suaraValue = value as { suara_bupati_1: number; suara_bupati_2: number; persen_bupati_1?: string; persen_bupati_2?: string };
                          const bg1 =  suaraValue.suara_bupati_1 && suaraValue.suara_bupati_2
                            ? suaraValue.suara_bupati_1 > suaraValue.suara_bupati_2
                              ? "green.2"
                              : "red.2"
                            : undefined
                          const bg2 = suaraValue.suara_bupati_1 && suaraValue.suara_bupati_2
                            ? suaraValue.suara_bupati_1 < suaraValue.suara_bupati_2
                              ? "green.2"
                              : "red.2"
                            : undefined
                          return (
                            <TableTr key={index}>
                              <TableTd style={{ fontWeight: 'bold' }}>{key}</TableTd>
                          
                              {/* Suara Bupati 1 */}
                              <TableTd
                                bg={bg1}
                              >
                                <Text style={{ textAlign: "center", fontWeight: 'bold' }}>
                                  {!suaraValue.suara_bupati_1 ? "" : <NumberFormatter thousandSeparator value={suaraValue.suara_bupati_1} />}
                                </Text>
                              </TableTd>
                          
                              <TableTd  
                                bg={bg1}
                                style={{ textAlign: "center" }}>
                                {suaraValue.persen_bupati_1 || "0%"}
                              </TableTd>
                          
                              {/* Suara Bupati 2 */}
                              <TableTd
                                bg={bg2}
                              >
                                <Text style={{ textAlign: "center", fontWeight: 'bold' }}>
                                  {!suaraValue.suara_bupati_2 ? "" : <NumberFormatter thousandSeparator value={suaraValue.suara_bupati_2} />}
                                </Text>
                              </TableTd>
                          
                              <TableTd 
                                style={{ textAlign: "center" }}
                                bg={bg2}
                              >
                                {suaraValue.persen_bupati_2 || "0%"}
                              </TableTd>
                            </TableTr>
                          );
                          
                        })}
                    </TableTbody>
                  </Table>
                </div>
              </Grid.Col>
            </Grid>
          </Box>
        </Box>
        </>
       ):(
        <>
          <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <Alert variant="light" color="red" title="Akses terbatas" icon={<IconInfoCircle />}>
              <Text fz={"h2"} fw={"bold"}>Akses ke halaman ini dibatasi. </Text>
              <Text fz={"sm"}> Mohon coba lagi nanti</Text>
            </Alert>
          </Box>
        </>
       )}
      </Box>
    </>
  );
}
