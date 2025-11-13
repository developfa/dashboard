import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET: 모든 Memo 조회
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
    const isArchived = searchParams.get("isArchived") === "true"

    const memos = await prisma.memo.findMany({
      where: {
        userId: user.id,
        isArchived,
      },
      orderBy: [
        { isPinned: "desc" },
        { updatedAt: "desc" },
      ],
    })

    return NextResponse.json({ memos })
  } catch (error) {
    console.error("Error fetching memos:", error)
    return NextResponse.json(
      { error: "Failed to fetch memos" },
      { status: 500 }
    )
  }
}

// POST: 새 Memo 생성
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
    const { title, content, color, tags, isPinned } = body

    if (!content) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      )
    }

    const memo = await prisma.memo.create({
      data: {
        userId: user.id,
        title: title || "",
        content,
        color: color || "#fff3cd",
        tags,
        isPinned: isPinned || false,
      },
    })

    return NextResponse.json({ memo }, { status: 201 })
  } catch (error) {
    console.error("Error creating memo:", error)
    return NextResponse.json(
      { error: "Failed to create memo" },
      { status: 500 }
    )
  }
}
