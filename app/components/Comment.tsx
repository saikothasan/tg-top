import { createClient } from "../../utils/supabase"

interface CommentProps {
  comment: {
    id: string
    content: string
    created_at: string
    user_id: string
  }
}

export default async function Comment({ comment }: CommentProps) {
  const supabase = createClient()
  const { data: user } = await supabase.from("users").select("email").eq("id", comment.user_id).single()

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <p className="text-gray-800">{comment.content}</p>
      <div className="mt-2 text-sm text-gray-500">
        <span>{user?.email}</span>
        <span className="mx-1">•</span>
        <span>{new Date(comment.created_at).toLocaleString()}</span>
      </div>
    </div>
  )
}

