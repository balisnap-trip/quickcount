const apiUrl = '/api/verifikasi'
export const searchNoWa = async (noWa: string) => {
  try {
    const res = await fetch(`${apiUrl}/cek-wa`, {
      method: 'POST',
      body: JSON.stringify({ noWa })
    })

    if (!res.ok) {
      throw new Error('Gagal memuat data user');
    }
    const user = await res.json()
    return user
  } catch (error) {
    throw new Error('Gagal memuat data user');
  }
}