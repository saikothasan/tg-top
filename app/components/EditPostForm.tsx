"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "../../utils/supabase"

interface EditPostFormProps {
  post: {
    id: string
    title: string
    description: string
    link: string
    type: string
    category_id: string
  }
}

export default function EditPostForm({ post }: EditPostFormProps) {
  const [title, setTitle] = useState(post.title)
  const [description, setDescription] = useState(post.description)
  const [link, setLink] = useState(post.link)
  const [type, setType] = useState(post.type)
  const [category, setCategory] = useState(post.category_id)
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([])
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase.from("categories").select("id, name")
      if (data) setCategories(data)
      if (error) console.error("Error fetching categories:", error)
    }

    fetchCategories()
  }, [supabase]) // Added supabase to dependencies

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase
      .from("forum_posts")
      .update({ title, description, link, type, category_id: category })
      .eq("id", post.id)

    if (error) {
      console.error("Error updating post:", error)
      alert("Failed to update post. Please try again.")
    } else {
      router.push(`/post/${post.id}`)
      router.refresh()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          required
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          required
        ></textarea>
      </div>
      <div>
        <label htmlFor="link" className="block text-sm font-medium text-gray-700">
          Telegram Link
        </label>
        <input
          type="url"
          id="link"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          required
        />
      </div>
      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-700">
          Type
        </label>
        <select
          id="type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
          <option value="channel">Channel</option>
          <option value="group">Group</option>
        </select>
      </div>
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
          Category
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          required
        >
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Update Post
        </button>
      </div>
    </form>
  )
}

