"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "../../utils/supabase"

interface CommentFormProps {
  postId: string
}

export default function CommentForm({ postId }: CommentFormProps) {
  const [content, setContent] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setError("You must be signed in to comment.")
      setIsLoading(false)
      return
    }

    try {
      const { error } = await supabase.from("comments").insert({ post_id: postId, user_id: user.id, content })

      if (error) throw error

      setContent("")
      router.refresh()
    } catch (err) {
      setError("Failed to submit comment. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write a comment..."
        className="w-full p-2 border rounded-md"
        rows={3}
        required
      ></textarea>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      <button
        type="submit"
        className="mt-2 bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        disabled={isLoading}
      >
        {isLoading ? "Submitting..." : "Submit Comment"}
      </button>
    </form>
  )
}

