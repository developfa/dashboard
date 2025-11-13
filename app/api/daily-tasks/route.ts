import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET: 모든 DailyTask 조회
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const { searchParams } = new URL(request.url)
    const date = searchParams.get("date")
    const isArchived = searchParams.get("isArchived") === "true"

    const where: any = {
      userId: user.id,
      isArchived,
    }

    if (date) {
      const targetDate = new Date(date)
      targetDate.setHours(0, 0, 0, 0)
      const nextDate = new Date(targetDate)
      nextDate.setDate(nextDate.getDate() + 1)

      where.date = {
        gte: targetDate,
        lt: nextDate,
      }
    }

    const dailyTasks = await prisma.dailyTask.findMany({
      where,
      orderBy: [
        { position: "asc" },
        { createdAt: "asc" },
      ],
    })

    return NextResponse.json({ dailyTasks })
  } catch (error) {
    console.error("Error fetching daily tasks:", error)
    return NextResponse.json(
      { error: "Failed to fetch daily tasks" },
      { status: 500 }
    )
  }
}

// POST: 새 DailyTask 생성
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const body = await request.json()
    const { content, date, position } = body

    if (!content) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      )
    }

    const dailyTask = await prisma.dailyTask.create({
      data: {
        userId: user.id,
        content,
        date: date ? new Date(date) : new Date(),
        position: position || 0,
      },
    })

    return NextResponse.json({ dailyTask }, { status: 201 })
  } catch (error) {
    console.error("Error creating daily task:", error)
    return NextResponse.json(
      { error: "Failed to create daily task" },
      { status: 500 }
    )
  }
}
