import { Suspense } from "react"
import VerifyEmailClient from "./verify-email-client"
import { Loader2 } from "lucide-react"

export default function VerifyEmailPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-md w-full space-y-8">
        <Suspense
          fallback={
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto" />
              <p className="mt-2 text-sm text-gray-600">Loading verification...</p>
            </div>
          }
        >
          <VerifyEmailClient />
        </Suspense>
      </div>
    </div>
  )
}

