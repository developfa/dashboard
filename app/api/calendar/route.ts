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

    // Initialize Calendar API
    const oauth2Client = new google.auth.OAuth2()
    oauth2Client.setCredentials({
      access_token: account.access_token,
    })

    const calendar = google.calendar({ version: "v3", auth: oauth2Client })

    // Get upcoming events
    const now = new Date()
    const twoWeeksLater = new Date()
    twoWeeksLater.setDate(now.getDate() + 14)

    const response = await calendar.events.list({
      calendarId: "primary",
      timeMin: now.toISOString(),
      timeMax: twoWeeksLater.toISOString(),
      maxResults: 20,
      singleEvents: true,
      orderBy: "startTime",
    })

    const events = response.data.items || []

    const formattedEvents = events.map((event) => ({
      id: event.id,
      summary: event.summary,
      description: event.description,
      start: event.start?.dateTime || event.start?.date,
      end: event.end?.dateTime || event.end?.date,
      location: event.location,
      htmlLink: event.htmlLink,
    }))

    return NextResponse.json({ events: formattedEvents })
  } catch (error: any) {
    console.error("Error fetching Calendar:", error)
    return NextResponse.json(
      { error: error.message || "Failed to fetch Calendar data" },
      { status: 500 }
    )
  }
}
