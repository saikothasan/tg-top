import { createClient } from "../utils/supabase"
import Link from "next/link"
import SubmissionForm from "./components/SubmissionForm"
import Pagination from "./components/Pagination"
import SearchBar from "./components/SearchBar"
import VoteButtons from "./components/VoteButtons"

export const metadata = {
  title: "Home",
  description: "Discover and share the best Telegram channels and groups on our forum.",
}

export const revalidate = 0

async function getForumPosts(page = 1, pageSize = 10, searchQuery = "", category = "") {
  const supabase = createClient()
  let query = supabase
    .from("forum_posts")
    .select(
      `
      *,
      categories(name)
    `,
      { count: "exact" },
    )
    .order("created_at", { ascending: false })
    .range((page - 1) * pageSize, page * pageSize - 1)

  if (searchQuery) {
    query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
  }

  if (category) {
    query = query.eq("category_id", category)
  }

  const { data, error, count } = await query

  if (error) {
    console.error("Error fetching forum posts:", error)
    return { posts: [], totalCount: 0 }
  }

  return { posts: data, totalCount: count }
}

async function getCategories() {
  const supabase = createClient()
  const { data, error } = await supabase.from("categories").select("id, name")
  if (error) {
    console.error("Error fetching categories:", error)
    return []
  }
  return data
}

export default async function Home({
  searchParams,
}: {
  searchParams: { page?: string; search?: string; category?: string }
}) {
  const page = Number.parseInt(searchParams.page || "1")
  const searchQuery = searchParams.search || ""
  const category = searchParams.category || ""
  const { posts, totalCount } = await getForumPosts(page, 10, searchQuery, category)
  const categories = await getCategories()

  return (
    <div className="space-y-8">
      <SubmissionForm />
      <div className="flex justify-between items-start">
        <SearchBar />
        <select
          className="border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          onChange={(e) => {
            const url = new URL(window.location.href)
            url.searchParams.set("category", e.target.value)
            url.searchParams.delete("page")
            window.location.href = url.toString()
          }}
          value={category}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <ul className="divide-y divide-gray-200">
          {posts.map((post) => (
            <li key={post.id}>
              <div className="px-4 py-4 sm:px-6 flex items-center">
                <VoteButtons postId={post.id} initialUpvotes={post.upvotes} initialDownvotes={post.downvotes} />
                <div className="ml-4 flex-grow">
                  <Link
                    href={`/post/${post.id}`}
                    className="block hover:bg-gray-50 transition duration-150 ease-in-out"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-indigo-600 truncate">{post.title}</p>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {post.type}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          {post.description.substring(0, 100)}...
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <p>
                          Posted on {new Date(post.created_at).toLocaleDateString()} | Category: {post.categories.name}
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <Pagination totalCount={totalCount} pageSize={10} currentPage={page} />
    </div>
  )
}

