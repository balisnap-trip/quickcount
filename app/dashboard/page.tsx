"use client"
import { BarChart } from "@mantine/charts";
import { Box, Center, Grid, GridCol, Image, LoadingOverlay, Space, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import { dataSuara } from "../lib/dashboard";

export default function Dashboard() {
  const [totalSuara, setTotalSuara] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const response = await dataSuara()
        setTotalSuara(response)
      } catch (error) {
        console.log(error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])



  const chrtData = [
    { paslon: `Paslon 1 - ${totalSuara.presentaseBupati1}`, Suara: Number(totalSuara.suara_bupati_1) },
    { paslon: `Paslon 2 - ${totalSuara.presentaseBupati2}`, Suara: Number(totalSuara.suara_bupati_2) },
  ];

  return (
    <>
      <Box pos="relative">
        <LoadingOverlay visible={isLoading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
        <Grid justify="center">
          <GridCol>
            <Text fz="h1" mb="sm" ta="center">
              HASIL HITUNG CEPAT CALON BUPATI GIANYAR 2024
            </Text>
            <Text fz="h2" mb="sm" ta="center">
              VERSI TIM PEMENANGAN PASLON KATA
            </Text>
            <Space h={40} />
            <Text fz="h3" fw={"bold"} mt="lg" mb="lg" ta="start">
              Perolehan Suara
            </Text>
            <Grid justify="start" gutter={"md"} style={{ border: "1px solid #ccc", padding: "10px" }} >
              <GridCol span={{ lg: 6, md: 12, sm: 12 }}>
                <Center h={300} >
                  <Image
                    style={{ padding: "10px" }}
                    radius="md"
                    h={300}
                    w="auto"
                    fit="contain"
                    src="paslon/bupati.png"
                  />
                </Center>

              </GridCol>
              <GridCol span={{ lg: 6, md: 12, sm: 12 }}>
                <BarChart
                  h={400}
                  maxBarWidth={80}
                  withTooltip={false}
                  data={chrtData}
                  dataKey="paslon"
                  series={[{ name: 'Suara', color: 'blue' }]}
                />
              </GridCol>
            </Grid>

          </GridCol>
        </Grid>
        <Grid justify="center">
          <GridCol>
            <Space h={20} />
            <Text fz="h3" fw={"bold"} mt="lg" mb="lg" ta="start">
              Detail
            </Text>
            <Grid justify="start" gutter={"md"}>
              <GridCol span={{ lg: 6, md: 12, sm: 12 }}>
                <Box h={300} p={10} style={{ border: "1px solid #ccc" }} >
                  <Text fz="h6" mt="md" mb="md" ta="start">
                    Total Suara Calon Bupati Paslon 1:
                    <span style={{ color: "green", fontWeight: "bold" }}> {totalSuara.suara_bupati_1} Suara</span>
                  </Text>
                  <Text fz="h6" mt="md" mb="md" ta="start">
                    Total Suara Calon Bupati Paslon 2:
                    <span style={{ color: "green", fontWeight: "bold" }}> {totalSuara.suara_bupati_2} Suara</span>
                  </Text>
                  <Text fz="h6" mt="md" mb="md" ta="start">
                    Total Suara Calon Gubernur Paslon 1:
                    <span style={{ color: "green", fontWeight: "bold" }}> {totalSuara.suara_gubernur_1} Suara</span>
                  </Text>
                  <Text fz="h6" mt="md" mb="md" ta="start">
                    Total Suara Calon Gubernur Paslon 2:
                    <span style={{ color: "green", fontWeight: "bold" }}> {totalSuara.suara_gubernur_2} Suara</span>
                  </Text>
                  <Text fz="h6" mt="md" mb="md" ta="start">
                    Total Suara Tidak Sah Bupati:
                    <span style={{ color: "red", fontWeight: "bold" }}> {totalSuara.suara_tidak_sah_bupati} Suara</span>
                  </Text>
                  <Text fz="h6" mt="md" mb="md" ta="start">
                    Total Suara Tidak Sah Gubernur:
                    <span style={{ color: "red", fontWeight: "bold" }}> {totalSuara.suara_tidak_sah_gubernur} Suara</span>
                  </Text>
                  <Text fz="h6" mt="md" mb="md" ta="start">
                    Total Suara Masuk:
                    <span style={{ color: "blue", fontWeight: "bold" }}> {totalSuara.total_suara_masuk} Suara</span>
                  </Text>
                </Box>
              </GridCol>
              <GridCol span={{ lg: 6, md: 12, sm: 12 }}>

              </GridCol>
            </Grid>

          </GridCol>
        </Grid>
      </Box>
    </>
  )
}