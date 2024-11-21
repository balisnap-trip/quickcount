const apiUrl = `/api/admin/saksi`;

export const fetchDataSaksi = async (page: number, filter : {kec: string | null, namaSaksi: string | null }) => {
  const perPage=20;

  const params = {page, perPage, filter}
  const res = await fetch(apiUrl, {
    method: 'POST',
    body: JSON.stringify(params)
  });

  if (!res.ok) {
    throw new Error('Gagal memuat data saksi');
  }

  const saksi = await res.json();

  return saksi;
};

export const fetchSaksiById = async (id: number) => {
  const params = { id }
  const res = await fetch(`${apiUrl}/edit`, {
    method: 'POST',
    body: JSON.stringify(params)
  })
  
  if (!res.ok) {
    throw new Error('Gagal memuat data saksi');
  }
  const saksi = await res.json()
  return saksi
}

export const updateSaksi = async(id: number, data: any) => {
  const params = {id, data}
  const res = await fetch(`${apiUrl}/update`, {
    method: 'POST',
    body: JSON.stringify(params)
  })
  if(!res.ok){
    throw new Error('Failed to update TPS data');
  }

  const saksi = await res.json()
  return saksi
}

export const deleteSaksi = async(id: number) => {
  const params = { id }
  const res = await fetch(`${apiUrl}/delete`, {
    method: 'POST',
    body: JSON.stringify(params)
  })

  if(!res.ok){
    throw new Error('Gagal memuat data saksi');
  }

  const saksi = await res.json()
  return saksi
}

export const aktivasiToken = async(flag: boolean, id: number | null = null) => {
 try {
  const params = { flag, id }
  const res = await fetch(`${apiUrl}/aktivasi-token`, {
    method: 'POST',
    body: JSON.stringify(params)
  })
  const tokenAktif = await res.json()
  return tokenAktif
 } catch (error) {
  throw new Error('Gagal mengaktifkan token');
 }
}

export const kirimToken = async(id: number | null = null) => {
  try {
    const params = {id}
    const res = await fetch(`${apiUrl}/kirim-token`, {
      method: 'POST',
      body: JSON.stringify(params)
    })

    const success = await res.json()
    return success
  } catch (error) {
    throw new Error('Gagal kirim token');
  }
}

export const perbaikanData = async(id: number | null = null) => {
  try {
    const params = {id}
    const res = await fetch(`${apiUrl}/perbaikan-data`, {
      method: 'POST',
      body: JSON.stringify(params)
    })

    const success = await res.json()
    return success
  } catch (error) {
    throw new Error('Gagal perbaikan data');
  }
}