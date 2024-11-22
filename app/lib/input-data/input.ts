const apiUrl = `/api/input-data`
export const getUserByToken = async (token: string) => {
  const res = await fetch(`${apiUrl}/user`, {
    method: 'POST',
    body: JSON.stringify({ token })
  })
  if (!res.ok) {
    throw new Error('Failed to fetch user data')
  }
  const user = await res.json()
  return user
}

export const inputData = async (data: any) => {
  console.log(data)

  try {
    const res = await fetch(`${apiUrl}/input`, {
      method: 'POST',
      body: data
    })

    if (!res.ok) {
      throw new Error('Failed to input data')
    }
    const result = await res.json()
    return result
  } catch (error) {
    
  }
}