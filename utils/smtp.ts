import nodemailer from "nodemailer"
import CryptoJS from "crypto-js"

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number.parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export function generateVerificationToken(userId: string): string {
  const data = `${userId}:${Date.now()}`
  return CryptoJS.AES.encrypt(data, process.env.TOKEN_SECRET!).toString()
}

export function decryptVerificationToken(token: string): { userId: string; timestamp: number } | null {
  try {
    const decrypted = CryptoJS.AES.decrypt(token, process.env.TOKEN_SECRET!).toString(CryptoJS.enc.Utf8)
    const [userId, timestamp] = decrypted.split(":")
    return { userId, timestamp: Number.parseInt(timestamp) }
  } catch (error) {
    console.error("Error decrypting token:", error)
    return null
  }
}

export async function sendVerificationEmail(to: string, token: string) {
  const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/verify-email?token=${encodeURIComponent(token)}`

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject: "Verify your email for Telegram Forum",
    text: `Please verify your email by clicking on the following link: ${verificationUrl}`,
    html: `
      <p>Please verify your email by clicking on the following link:</p>
      <p><a href="${verificationUrl}">${verificationUrl}</a></p>
    `,
  })
}

