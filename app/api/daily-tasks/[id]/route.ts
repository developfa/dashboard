import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// PUT: DailyTask 수정
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

    const body = await request.json()
    const { content, isCompleted, position, isArchived } = body

    const updateData: any = {}

    if (content !== undefined) updateData.content = content
    if (isCompleted !== undefined) {
      updateData.isCompleted = isCompleted
      if (isCompleted) {
        updateData.completedAt = new Date()
      } else {
        updateData.completedAt = null
      }
    }
    if (position !== undefined) updateData.position = position
    if (isArchived !== undefined) {
      updateData.isArchived = isArchived
      if (isArchived) {
        updateData.archivedAt = new Date()
      }
    }

    const dailyTask = await prisma.dailyTask.update({
      where: { id: id },
      data: updateData,
    })

    return NextResponse.json({ dailyTask })
  } catch (error) {
    console.error("Error updating daily task:", error)
    return NextResponse.json(
      { error: "Failed to update daily task" },
      { status: 500 }
    )
  }
}

// DELETE: DailyTask 삭제
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

    await prisma.dailyTask.delete({
      where: { id: id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting daily task:", error)
    return NextResponse.json(
      { error: "Failed to delete daily task" },
      { status: 500 }
    )
  }
}
