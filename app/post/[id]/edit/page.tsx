import { createClient } from "../../../../utils/supabase"
import { redirect } from "next/navigation"
import EditPostForm from "../../../components/EditPostForm"

export const metadata = {
  title: "Edit Post",
  description: "Edit your Telegram channel or group submission.",
}

async function getPost(id: string) {
  const supabase = createClient()
  const { data, error } = await supabase.from("forum_posts").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching post:", error)
    return null
  }

  return data
}

export default async function EditPost({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/auth")
  }

  const post = await getPost(params.id)

  if (!post) {
    return <div>Post not found</div>
  }

  if (post.user_id !== session.user.id) {
    redirect(`/post/${params.id}`)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Edit Post</h1>
      <EditPostForm post={post} />
    </div>
  )
}

