import jsC8 from "jsc8"

const jsc8Client = new jsC8({
    url: `https://${process.env.REACT_APP_GDN_URL}`,
    fabricName: process.env.REACT_APP_FABRIC_NAME,
    apiKey: process.env.REACT_APP_API_KEY,
})

export default jsc8Client
