
export const sendMessage = async(messagePayload: any) => {
  const apiUrl = `${process.env.GREENAPI_URL}/waInstance${process.env.GREENAPI_ID}/sendMessage/${process.env.GREENAPI_TOKEN}`
  
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