import "./globals.css"
import { Inter } from "next/font/google"
import { createClient } from "../utils/supabase"
import Link from "next/link"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  metadataBase: new URL("https://your-domain.com"),
  title: {
    default: "Telegram Forum - Share and Discover Channels & Groups",
    template: "%s | Telegram Forum",
  },
  description:
    "Join our community to share and discover the best Telegram channels and groups. Connect with like-minded individuals and expand your network.",
  keywords: ["Telegram", "forum", "channels", "groups", "community", "social media"],
  authors: [{ name: "Your Name" }],
  creator: "Your Name or Company",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://your-domain.com",
    title: "Telegram Forum - Share and Discover Channels & Groups",
    description:
      "Join our community to share and discover the best Telegram channels and groups. Connect with like-minded individuals and expand your network.",
    siteName: "Telegram Forum",
    images: [
      {
        url: "https://your-domain.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Telegram Forum",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Telegram Forum - Share and Discover Channels & Groups",
    description:
      "Join our community to share and discover the best Telegram channels and groups. Connect with like-minded individuals and expand your network.",
    images: ["https://your-domain.com/twitter-image.jpg"],
    creator: "@yourtwitterhandle",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50`}>
        <div className="min-h-screen flex flex-col">
          <header className="bg-indigo-600 shadow-lg">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
              <h1 className="text-3xl font-bold text-white">Telegram Forum</h1>
              <nav className="flex items-center">
                <Link href="/" className="text-white hover:text-indigo-200 px-3 py-2 rounded-md text-sm font-medium">
                  Home
                </Link>
                <Link
                  href="/about"
                  className="text-white hover:text-indigo-200 px-3 py-2 rounded-md text-sm font-medium"
                >
                  About
                </Link>
                {session ? (
                  <>
                    <Link
                      href="/profile"
                      className="text-white hover:text-indigo-200 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Profile
                    </Link>
                    <form action="/auth/signout" method="post">
                      <button
                        type="submit"
                        className="text-white hover:text-indigo-200 px-3 py-2 rounded-md text-sm font-medium"
                      >
                        Sign Out
                      </button>
                    </form>
                  </>
                ) : (
                  <Link
                    href="/auth"
                    className="text-white hover:text-indigo-200 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Sign In
                  </Link>
                )}
              </nav>
            </div>
          </header>
          <main className="flex-grow">
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">{children}</div>
          </main>
          <footer className="bg-gray-800 text-white py-4">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <p>&copy; 2023 Telegram Forum. All rights reserved.</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}

