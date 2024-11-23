import { Button, Text } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";

export default function Sukses() {
  return (
    <>
      <Text fz={"h2"} mb="md" fw={"bold"}>Verifikasi berhasil</Text>
      <Button leftSection={<IconArrowLeft />} component="a" href="/dashboard" variant="default" color="dark">Dashboard</Button>
    </>
  );
}