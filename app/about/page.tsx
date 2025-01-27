export const metadata = {
  title: "About Us",
  description:
    "Learn more about Telegram Forum and our mission to connect people through Telegram channels and groups.",
}

import Link from "next/link"

export default function About() {
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="px-6 py-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">About Telegram Forum</h1>
        <p className="text-gray-700 text-base mb-4">
          Welcome to Telegram Forum, a community-driven platform for sharing and discovering the best Telegram channels
          and groups. Our mission is to connect people with valuable content and like-minded individuals across various
          interests and topics.
        </p>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Why Use Telegram Forum?</h2>
        <ul className="list-disc list-inside text-gray-700 mb-4">
          <li>Discover new and interesting Telegram channels and groups</li>
          <li>Share your favorite Telegram communities with others</li>
          <li>Connect with people who share your interests</li>
          <li>Stay updated on trending topics and discussions</li>
        </ul>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">How It Works</h2>
        <ol className="list-decimal list-inside text-gray-700 mb-4">
          <li>Browse through the list of submitted Telegram channels and groups</li>
          <li>Submit your own favorite Telegram communities</li>
          <li>Search for specific topics or interests</li>
          <li>Join the discussions and connect with others</li>
        </ol>
        <p className="text-gray-700 text-base mb-4">
          We encourage respectful and meaningful interactions within our community. Please make sure to follow our
          guidelines when submitting or engaging with content on Telegram Forum.
        </p>
      </div>
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <Link
          href="/"
          className="inline-block bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out"
        >
          Back to Forum
        </Link>
      </div>
    </div>
  )
}

