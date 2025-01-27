import { createClient } from "../../../utils/supabase"
import Link from "next/link"
import VoteButtons from "../../components/VoteButtons"
import type { Metadata } from "next"
import Comment from "../../components/Comment"
import CommentForm from "../../components/CommentForm"

export const revalidate = 0

async function getPost(id: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("forum_posts")
    .select(`
      *,
      categories(name),
      comments(id, content, created_at, user_id)
    `)
    .eq("id", id)
    .single()

  if (error) {
    console.error("Error fetching post:", error)
    return null
  }

  return data
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const post = await getPost(params.id)

  if (!post) {
    return {
      title: "Post Not Found",
      description: "The requested post could not be found.",
    }
  }

  return {
    title: post.title,
    description: post.description.substring(0, 160),
    openGraph: {
      title: post.title,
      description: post.description.substring(0, 160),
      type: "article",
      publishedTime: post.created_at,
      authors: ["Telegram Forum User"],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description.substring(0, 160),
    },
  }
}

export default async function Post({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const post = await getPost(params.id)
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Post not found</h1>
          <Link href="/" className="text-indigo-600 hover:text-indigo-800">
            Return to Forum
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="px-6 py-4">
        <div className="flex items-center">
          <VoteButtons postId={post.id} initialUpvotes={post.upvotes} initialDownvotes={post.downvotes} />
          <div className="ml-4">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{post.title}</h1>
            <p className="text-sm text-gray-600 mb-4">
              Posted on {new Date(post.created_at).toLocaleString()} | Category: {post.categories.name}
            </p>
          </div>
        </div>
        <div className="mb-4">
          <span className="inline-block bg-indigo-100 text-indigo-800 text-xs px-2 rounded-full uppercase font-semibold tracking-wide">
            {post.type}
          </span>
        </div>
        <p className="text-gray-700 text-base mb-4">{post.description}</p>
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Telegram Link</h2>
          <a
            href={post.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 hover:text-indigo-800 break-all"
          >
            {post.link}
          </a>
        </div>
      </div>
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        {session && post.user_id === session.user.id && (
          <Link
            href={`/post/${post.id}/edit`}
            className="inline-block bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out mr-4"
          >
            Edit Post
          </Link>
        )}
        <Link
          href="/"
          className="inline-block bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out"
        >
          Back to Forum
        </Link>
      </div>
      <div className="mt-8 px-6 py-4">
        <h2 className="text-2xl font-semibold mb-4">Comments</h2>
        <CommentForm postId={post.id} />
        <div className="mt-4 space-y-4">
          {post.comments?.map((comment) => (
            <Comment key={comment.id} comment={comment} />
          ))}
        </div>
      </div>
    </div>
  )
}

