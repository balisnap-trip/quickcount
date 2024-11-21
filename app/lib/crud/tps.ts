const apiUrl = `/api/admin/tps`;

export const fetchTpsData = async (page: number, filter: {kec: string | null, query: string | null}) => {
  const perPage = 20
  const params = {page, perPage, filter}
  const res = await fetch(apiUrl, {
    method: 'POST',
    body: JSON.stringify(params)
  });

  if (!res.ok) {
    throw new Error('Failed to fetch TPS data');
  }

  const tpsByKecamatan = await res.json();
  return tpsByKecamatan;
};

export const fetchTpsById = async (id: number) => {
  const params = { id }
  const res = await fetch(`${apiUrl}/edit`, {
    method: 'POST',
    body: JSON.stringify(params)
  })
  
  if (!res.ok) {
    throw new Error('Failed to fetch TPS data');
  }
  const tps = await res.json()
  return tps
}

export const updateTps = async(id: number, data: any) => {
  const params = {id, data}
  const res = await fetch(`${apiUrl}/update`, {
    method: 'POST',
    body: JSON.stringify(params)
  })
  if(!res.ok){
    throw new Error('Failed to update TPS data');
  }

  const tps = await res.json()
  return tps
}

export const deleteTPS = async(id: number) => {
  const params = { id }
  const res = await fetch(`${apiUrl}/delete`, {
    method: 'POST',
    body: JSON.stringify(params)
  })

  if(!res.ok){
    throw new Error('Failed to delete TPS data');
  }

  const tps = await res.json()
  return tps
}