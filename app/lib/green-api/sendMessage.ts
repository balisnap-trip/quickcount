
export const sendMessage = async(messagePayload: any, idInstance: number | null = null) => {
  const waInstance = idInstance ? idInstance : process.env.GREENAPI_INSTANCE
  const token = idInstance ? process.env.GREENAPI_TOKEN_2 : process.env.GREENAPI_TOKEN
  const apiUrl = `${process.env.GREENAPI_URL}/waInstance${waInstance}/sendMessage/${token}`
  
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(messagePayload)
  })

  if (!response.ok) {
    throw new Error('Failed to send message')
  }

  return response
}