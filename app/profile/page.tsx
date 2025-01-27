import { createClient } from "../../utils/supabase"
import { redirect } from "next/navigation"
import SubmissionForm from "../components/SubmissionForm"

export const metadata = {
  title: "User Profile",
  description: "View and manage your Telegram Forum profile and submissions.",
}

export default async function Profile() {
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/auth")
  }

  const { data: posts, error } = await supabase
    .from("forum_posts")
    .select("*")
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching user posts:", error)
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Your Profile</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Your Information</h2>
        <p>
          <strong>Email:</strong> {session.user.email}
        </p>
        <p>
          <strong>User ID:</strong> {session.user.id}
        </p>
      </div>
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Your Submissions</h2>
        {posts && posts.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {posts.map((post) => (
              <li key={post.id} className="py-4">
                <h3 className="text-lg font-medium">{post.title}</h3>
                <p className="text-gray-600">{post.description.substring(0, 100)}...</p>
                <p className="text-sm text-gray-500 mt-1">Posted on {new Date(post.created_at).toLocaleDateString()}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>You haven't made any submissions yet.</p>
        )}
      </div>
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Submit a New Post</h2>
        <SubmissionForm />
      </div>
    </div>
  )
}

