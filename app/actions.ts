"use server"

import { createClient } from "../utils/supabase"
import { revalidatePath } from "next/cache"
import { randomBytes } from "crypto"
import { sendVerificationEmail } from "../utils/smtp"

export async function submitPost(data: {
  title: string
  description: string
  link: string
  type: string
  category: string
  user_id: string
}) {
  const supabase = createClient()
  const { error } = await supabase.from("forum_posts").insert([data])

  if (error) {
    console.error("Error submitting post:", error)
    throw new Error("Failed to submit post")
  }

  revalidatePath("/")
}

export async function updatePost(
  postId: string,
  data: {
    title: string
    description: string
    link: string
    type: string
    category: string
  },
) {
  const supabase = createClient()
  const { error } = await supabase.from("forum_posts").update(data).eq("id", postId)

  if (error) {
    console.error("Error updating post:", error)
    throw new Error("Failed to update post")
  }

  revalidatePath(`/post/${postId}`)
}

export async function deletePost(postId: string) {
  const supabase = createClient()
  const { error } = await supabase.from("forum_posts").delete().eq("id", postId)

  if (error) {
    console.error("Error deleting post:", error)
    throw new Error("Failed to delete post")
  }

  revalidatePath("/")
}

export async function submitComment(data: {
  post_id: string
  user_id: string
  content: string
}) {
  const supabase = createClient()
  const { error } = await supabase.from("comments").insert([data])

  if (error) {
    console.error("Error submitting comment:", error)
    throw new Error("Failed to submit comment")
  }

  revalidatePath(`/post/${data.post_id}`)
}

export async function createEmailVerificationToken(userId: string) {
  const supabase = createClient()
  const token = randomBytes(32).toString("hex")
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now

  const { error } = await supabase
    .from("email_verification_tokens")
    .insert({ user_id: userId, token, expires_at: expiresAt })

  if (error) {
    console.error("Error creating email verification token:", error)
    throw new Error("Failed to create email verification token")
  }

  return token
}

export async function verifyEmail(token: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("email_verification_tokens")
    .select("user_id")
    .eq("token", token)
    .gt("expires_at", new Date().toISOString())
    .single()

  if (error || !data) {
    console.error("Error verifying email:", error)
    throw new Error("Invalid or expired token")
  }

  const { error: updateError } = await supabase.auth.updateUser({ data: { is_email_verified: true } })

  if (updateError) {
    console.error("Error updating user:", updateError)
    throw new Error("Failed to verify email")
  }

  await supabase.from("email_verification_tokens").delete().eq("token", token)

  revalidatePath("/")
}

