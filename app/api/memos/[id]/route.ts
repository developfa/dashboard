import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET: Memo 상세 조회
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

    const memo = await prisma.memo.findFirst({
      where: {
        id: id,
        userId: user.id,
      },
    })

    if (!memo) {
      return NextResponse.json({ error: "Memo not found" }, { status: 404 })
    }

    return NextResponse.json({ memo })
  } catch (error) {
    console.error("Error fetching memo:", error)
    return NextResponse.json(
      { error: "Failed to fetch memo" },
      { status: 500 }
    )
  }
}

// PUT: Memo 수정
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
    const { title, content, color, tags, isPinned, isArchived } = body

    const updateData: any = {}

    if (title !== undefined) updateData.title = title
    if (content !== undefined) updateData.content = content
    if (color !== undefined) updateData.color = color
    if (tags !== undefined) updateData.tags = tags
    if (isPinned !== undefined) updateData.isPinned = isPinned
    if (isArchived !== undefined) updateData.isArchived = isArchived

    const memo = await prisma.memo.update({
      where: { id: id },
      data: updateData,
    })

    return NextResponse.json({ memo })
  } catch (error) {
    console.error("Error updating memo:", error)
    return NextResponse.json(
      { error: "Failed to update memo" },
      { status: 500 }
    )
  }
}

// DELETE: Memo 삭제
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

    await prisma.memo.delete({
      where: { id: id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting memo:", error)
    return NextResponse.json(
      { error: "Failed to delete memo" },
      { status: 500 }
    )
  }
}
