"use client"

import { useState } from "react"
import { createClient } from "../../utils/supabase"
import { ArrowUp, ArrowDown } from "lucide-react"

interface VoteButtonsProps {
  postId: string
  initialUpvotes: number
  initialDownvotes: number
}

export default function VoteButtons({ postId, initialUpvotes, initialDownvotes }: VoteButtonsProps) {
  const [upvotes, setUpvotes] = useState(initialUpvotes)
  const [downvotes, setDownvotes] = useState(initialDownvotes)
  const [userVote, setUserVote] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const handleVote = async (voteType: boolean) => {
    setIsLoading(true)
    setError(null)
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      setError("You must be signed in to vote.")
      setIsLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from("votes")
        .upsert({ user_id: user.id, post_id: postId, vote_type: voteType }, { onConflict: "user_id,post_id" })

      if (error) throw error

      // Update local state
      if (userVote === voteType) {
        // Undo vote
        setUpvotes((prev) => (voteType ? prev - 1 : prev))
        setDownvotes((prev) => (voteType ? prev : prev - 1))
        setUserVote(null)
      } else {
        // Change vote
        setUpvotes((prev) => (voteType ? prev + 1 : userVote === false ? prev + 1 : prev))
        setDownvotes((prev) => (voteType ? (userVote === true ? prev + 1 : prev) : prev + 1))
        setUserVote(voteType)
      }

      // Update post votes count
      await supabase
        .from("forum_posts")
        .update({
          upvotes: voteType ? upvotes + 1 : upvotes,
          downvotes: voteType ? downvotes : downvotes + 1,
        })
        .eq("id", postId)
    } catch (err) {
      setError("Failed to submit vote. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={() => handleVote(true)}
        className={`p-1 ${userVote === true ? "text-indigo-600" : "text-gray-400"} hover:text-indigo-600 ${
          isLoading ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={isLoading}
      >
        <ArrowUp size={24} />
      </button>
      <span className="text-sm font-medium">{upvotes - downvotes}</span>
      <button
        onClick={() => handleVote(false)}
        className={`p-1 ${userVote === false ? "text-red-600" : "text-gray-400"} hover:text-red-600 ${
          isLoading ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={isLoading}
      >
        <ArrowDown size={24} />
      </button>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  )
}

