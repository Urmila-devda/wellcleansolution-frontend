const axios = require("axios")

async function check() {
  const urls = [
    "https://wellcleansolution-backend.onrender.com/api/products",
    "https://wellcleansolution-backend.vercel.app/api/products",
    "https://wellclean-backend.onrender.com/api/products",
    "https://wellcleansolution.onrender.com/api/products"
  ]

  for (const url of urls) {
    try {
      console.log(`Checking ${url}...`)
      const res = await axios.get(url)
      console.log(`Status: ${res.status}`)
      console.log(`Data (first item):`, res.data[0])
    } catch (err) {
      console.log(`Failed for ${url}:`, err.message)
      if (err.response) {
        console.log(`Status: ${err.response.status}`)
      }
    }
  }
}

check()
