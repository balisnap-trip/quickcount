
const apiUrl = '/api/admin/akses'
export const readAccess = async () => {
  try {
    const config = await fetch(`${apiUrl}`, {
      method: 'GET'
    })

    if(!config.ok){
      throw new Error('Gagal memuat konfigurasi')
    }
    const data = await config.json()

    return data
  } catch (error) {
    console.error('Gagal memuat konfigurasi:', error);
    return null;
  }
}

export const updateConfig = async(data: {enabledAccess: boolean}) => {

  try {
    const config = await fetch(`${apiUrl}/update`, {
      method: 'POST',
      body: JSON.stringify(data)
    })

    if(!config.ok){
      throw new Error('Gagal memperbarui konfigurasi')
    }
    const res = await config.json()
    return res
  } catch (error) {
    console.error('Gagal memperbarui konfigurasi:', error);
    return null;
  }
}