import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET: 모든 Task 조회
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
    const status = searchParams.get("status")
    const categoryId = searchParams.get("categoryId")
    const isArchived = searchParams.get("isArchived") === "true"

    const where: any = { userId: user.id, isArchived }

    if (status && status !== "all") {
      where.status = status
    }

    if (categoryId && categoryId !== "all") {
      where.categoryId = categoryId
    }

    const tasks = await prisma.task.findMany({
      where,
      include: {
        category: true,
      },
      orderBy: [
        { priority: "desc" },
        { dueDate: "asc" },
      ],
    })

    return NextResponse.json({ tasks })
  } catch (error) {
    console.error("Error fetching tasks:", error)
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    )
  }
}

// POST: 새 Task 생성
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
    const {
      title,
      description,
      dueDate,
      priority,
      status,
      tags,
      categoryId,
      showInProgress,
      showInUrgent,
      recurrence,
    } = body

    if (!title) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      )
    }

    const task = await prisma.task.create({
      data: {
        userId: user.id,
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : null,
        priority: priority || "medium",
        status: status || "todo",
        tags,
        categoryId,
        showInProgress: showInProgress !== undefined ? showInProgress : true,
        showInUrgent: showInUrgent !== undefined ? showInUrgent : true,
        recurrence: recurrence || "none",
      },
      include: {
        category: true,
      },
    })

    return NextResponse.json({ task }, { status: 201 })
  } catch (error) {
    console.error("Error creating task:", error)
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    )
  }
}
