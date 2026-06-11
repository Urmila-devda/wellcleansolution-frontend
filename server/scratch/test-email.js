const dotenv = require("dotenv")
const path = require("path")
const sgMail = require("@sendgrid/mail")

// Load environment variables from server/.env
dotenv.config({ path: path.join(__dirname, "..", ".env") })

const apiKey = (process.env.SENDGRID_API_KEY || "").trim()
const fromEmail = (process.env.SENDGRID_FROM_EMAIL || "").trim()
const adminEmail = (process.env.ADMIN_EMAIL || "").trim()

if (!apiKey) {
  console.error("Error: SENDGRID_API_KEY is not defined in the environment.")
  process.exit(1)
}
if (!fromEmail) {
  console.error("Error: SENDGRID_FROM_EMAIL is not defined in the environment.")
  process.exit(1)
}

sgMail.setApiKey(apiKey)

const testMail = async () => {
  console.log("Starting direct SendGrid test...")
  console.log("API Key length:", apiKey.length)
  console.log("Sender Email:", fromEmail)
  console.log("Admin/Recipient Email:", adminEmail)

  const msg = {
    to: adminEmail || fromEmail,
    from: {
      name: "WellClean Test",
      email: fromEmail,
    },
    subject: "SendGrid Direct Test Email",
    text: "This is a plain text test email from WellClean store.",
    html: "<strong>This is a bold text test email from WellClean store.</strong>",
  }

  try {
    const response = await sgMail.send(msg)
    console.log("Email request sent successfully!")
    console.log("Response Status Code:", response[0].statusCode)
    console.log("Response Headers:", response[0].headers)
    console.log("Response Body (if any):", response[0].body)
  } catch (error) {
    console.error("SendGrid API Error:")
    if (error.response) {
      console.error("Status Code:", error.response.statusCode)
      console.error("Body:", JSON.stringify(error.response.body, null, 2))
      console.error("Headers:", error.response.headers)
    } else {
      console.error(error)
    }
  }
}

testMail()
