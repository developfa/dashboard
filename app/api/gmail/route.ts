import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { google } from "googleapis"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // Get user's Google account with access token
    const account = await prisma.account.findFirst({
      where: {
        userId: session.user.id,
        provider: "google",
      },
    })

    if (!account?.access_token) {
      return NextResponse.json(
        { error: "Google account not connected" },
        { status: 400 }
      )
    }

    // Initialize Gmail API
    const oauth2Client = new google.auth.OAuth2()
    oauth2Client.setCredentials({
      access_token: account.access_token,
    })

    const gmail = google.gmail({ version: "v1", auth: oauth2Client })

    // Get recent emails
    const response = await gmail.users.messages.list({
      userId: "me",
      maxResults: 10,
      labelIds: ["INBOX"],
    })

    const messages = response.data.messages || []

    // Get email details
    const emailPromises = messages.map(async (message) => {
      const email = await gmail.users.messages.get({
        userId: "me",
        id: message.id!,
        format: "metadata",
        metadataHeaders: ["From", "Subject", "Date"],
      })

      const headers = email.data.payload?.headers || []
      const from = headers.find((h) => h.name === "From")?.value || ""
      const subject = headers.find((h) => h.name === "Subject")?.value || ""
      const date = headers.find((h) => h.name === "Date")?.value || ""

      return {
        id: message.id,
        from,
        subject,
        date,
        snippet: email.data.snippet,
      }
    })

    const emails = await Promise.all(emailPromises)

    return NextResponse.json({ emails })
  } catch (error: any) {
    console.error("Error fetching Gmail:", error)
    return NextResponse.json(
      { error: error.message || "Failed to fetch Gmail data" },
      { status: 500 }
    )
  }
}
