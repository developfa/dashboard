import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET: Task 상세 조회
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
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

    const task = await prisma.task.findFirst({
      where: {
        id: id,
        userId: user.id,
      },
      include: {
        category: true,
      },
    })

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    return NextResponse.json({ task })
  } catch (error) {
    console.error("Error fetching task:", error)
    return NextResponse.json(
      { error: "Failed to fetch task" },
      { status: 500 }
    )
  }
}

// PUT: Task 수정
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
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
      isArchived,
    } = body

    const updateData: any = {}

    if (title !== undefined) updateData.title = title
    if (description !== undefined) updateData.description = description
    if (dueDate !== undefined) updateData.dueDate = dueDate ? new Date(dueDate) : null
    if (priority !== undefined) updateData.priority = priority
    if (status !== undefined) {
      updateData.status = status
      if (status === "completed") {
        updateData.completedAt = new Date()
      } else if (updateData.completedAt !== undefined) {
        updateData.completedAt = null
      }
    }
    if (tags !== undefined) updateData.tags = tags
    if (categoryId !== undefined) updateData.categoryId = categoryId
    if (showInProgress !== undefined) updateData.showInProgress = showInProgress
    if (showInUrgent !== undefined) updateData.showInUrgent = showInUrgent
    if (recurrence !== undefined) updateData.recurrence = recurrence
    if (isArchived !== undefined) updateData.isArchived = isArchived

    const task = await prisma.task.update({
      where: {
        id: id,
      },
      data: updateData,
      include: {
        category: true,
      },
    })

    return NextResponse.json({ task })
  } catch (error) {
    console.error("Error updating task:", error)
    return NextResponse.json(
      { error: "Failed to update task" },
      { status: 500 }
    )
  }
}

// DELETE: Task 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
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

    await prisma.task.delete({
      where: {
        id: id,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting task:", error)
    return NextResponse.json(
      { error: "Failed to delete task" },
      { status: 500 }
    )
  }
}
