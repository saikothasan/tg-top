"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"

interface PaginationProps {
  totalCount: number
  pageSize: number
  currentPage: number
}

export default function Pagination({ totalCount, pageSize, currentPage }: PaginationProps) {
  const totalPages = Math.ceil(totalCount / pageSize)
  const searchParams = useSearchParams()
  const search = searchParams.get("search") || ""

  if (totalPages <= 1) return null

  return (
    <nav className="border-t border-gray-200 px-4 flex items-center justify-between sm:px-0">
      <div className="-mt-px w-0 flex-1 flex">
        {currentPage > 1 && (
          <Link
            href={`/?page=${currentPage - 1}${search ? `&search=${search}` : ""}`}
            className="border-t-2 border-transparent pt-4 pr-1 inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
          >
            <svg className="mr-3 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Previous
          </Link>
        )}
      </div>
      <div className="hidden md:-mt-px md:flex">
        {[...Array(totalPages)].map((_, i) => (
          <Link
            key={i}
            href={`/?page=${i + 1}${search ? `&search=${search}` : ""}`}
            className={`border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 border-t-2 pt-4 px-4 inline-flex items-center text-sm font-medium ${
              currentPage === i + 1 ? "border-indigo-500 text-indigo-600" : ""
            }`}
          >
            {i + 1}
          </Link>
        ))}
      </div>
      <div className="-mt-px w-0 flex-1 flex justify-end">
        {currentPage < totalPages && (
          <Link
            href={`/?page=${currentPage + 1}${search ? `&search=${search}` : ""}`}
            className="border-t-2 border-transparent pt-4 pl-1 inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
          >
            Next
            <svg className="ml-3 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        )}
      </div>
    </nav>
  )
}

