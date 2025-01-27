"use server"

import { createClient } from "../utils/supabase"
import { revalidatePath } from "next/cache"
import CryptoJS from "crypto-js"

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
  const tokenData = {
    userId: userId,
    timestamp: Date.now(),
  }
  const token = CryptoJS.AES.encrypt(JSON.stringify(tokenData), process.env.TOKEN_SECRET!).toString()

  // In a real-world scenario, you might want to store this token in the database
  // and associate it with the user for additional security checks

  return token
}

export async function verifyEmail(token: string) {
  const supabase = createClient()

  try {
    const decryptedBytes = CryptoJS.AES.decrypt(token, process.env.TOKEN_SECRET!)
    const decryptedData = JSON.parse(decryptedBytes.toString(CryptoJS.enc.Utf8))

    const { userId, timestamp } = decryptedData
    const tokenAge = Date.now() - timestamp
    const tokenExpirationTime = 24 * 60 * 60 * 1000 // 24 hours

    if (tokenAge > tokenExpirationTime) {
      throw new Error("Token has expired")
    }

    const { error: updateError } = await supabase.from("users").update({ is_email_verified: true }).eq("id", userId)

    if (updateError) {
      console.error("Error updating user:", updateError)
      throw new Error("Failed to verify email")
    }

    revalidatePath("/")
  } catch (error) {
    console.error("Error verifying email:", error)
    throw new Error("Invalid or expired token")
  }
}

