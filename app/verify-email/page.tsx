"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { verifyEmail } from "../actions"

export default function VerifyEmail() {
  const [message, setMessage] = useState("Verifying your email...")
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  useEffect(() => {
    if (token) {
      verifyEmail(token).then(() => {
        setMessage("Your email has been verified successfully!")
        setTimeout(() => router.push("/"), 3000)
      })
      catch((error) =>
      setMessage(`Failed to verify email: ${error.message}`)
      )
    } else {
      setMessage("Invalid verification link")
    }
  }, [token, router])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Email Verification</h2>
          <p className="mt-2 text-sm text-gray-600">{message}</p>
        </div>
      </div>
    </div>
  )
}

