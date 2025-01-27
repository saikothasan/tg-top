"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function SearchBar() {
  const [search, setSearch] = useState("")
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(`/?search=${encodeURIComponent(search)}`)
  }

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="flex rounded-md shadow-sm">
        <input
          type="text"
          name="search"
          id="search"
          className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-l-md sm:text-sm border-gray-300"
          placeholder="Search for channels or groups"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          type="submit"
          className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm"
        >
          Search
        </button>
      </div>
    </form>
  )
}

