const apiUrl = '/api/dashboard'

export const dataSuara = async () => {
  try {
    const response = await fetch(`${apiUrl}/suara`, {
      method: 'GET'
    })

    if (!response.ok) {
      throw new Error('Failed to fetch data')
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching data:', error)
    return []
  }
}