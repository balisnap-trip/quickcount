
const instancesMap = {
  [Number(process.env.GREENAPI_ID)]: {
    waInstance: process.env.GREENAPI_ID,
    token: process.env.GREENAPI_TOKEN,
  },
  [Number(process.env.GREENAPI_ID_2)]: {
    waInstance: process.env.GREENAPI_ID_2,
    token: process.env.GREENAPI_TOKEN_2,
  },
};

const defaultInstance = {
  waInstance: process.env.GREENAPI_ID,
  token: process.env.GREENAPI_TOKEN,
};
export const sendMessage = async(messagePayload: any, idInstance: number | null = null) => {
  const { waInstance, token } = instancesMap[idInstance as number] || defaultInstance;
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