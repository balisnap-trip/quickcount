type Filter =  {
    kec: string | null;
    desa: string | null;
    namaSaksi: string | null;
}

const apiUrl = '/api/admin/perhitungan';
export const fetchPerhitungan = async (page: number, filter : Filter) => {
    const perPage=20;
  
    const params = {page, perPage, filter}
    const res = await fetch(`${apiUrl}`, {
      method: 'POST',
      body: JSON.stringify(params)
    });
  
    if (!res.ok) {
      throw new Error('Gagal memuat data perhitungan');
    }
  
    const saksi = await res.json();
  
    return saksi;
  };