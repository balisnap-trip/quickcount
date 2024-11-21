import { BarChart, PieChart } from "@mantine/charts";
import { Box, Center, Grid, GridCol, Image, Space, Text } from "@mantine/core";

const data = [
  { paslon: 'Paslon 1', Suara: 1200 },
  { paslon: 'Paslon 2', Suara: 1900 },
];
export default function Dashboard() {
  return (
    <>
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
          <Grid justify="start" gutter={"md"}>
            <GridCol span={{ lg: 6, md: 12, sm: 12 }}>
              <Center h={300} >
                <Image
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
                data={data}
                dataKey="paslon"
                series={[{ name: 'Suara', color: 'blue' }]}
              />
            </GridCol>
          </Grid>

        </GridCol>
      </Grid>
    </>

  )
}