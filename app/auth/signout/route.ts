import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error("Error signing out:", error)
    return NextResponse.json({ error: "Error signing out" }, { status: 500 })
  }

  return NextResponse.redirect(new URL("/", request.url), {
    status: 302,
  })
}

