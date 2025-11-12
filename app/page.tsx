"use client"

import { useSession, signIn, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { FaGoogle, FaSpinner } from "react-icons/fa"

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard")
    }
  }, [status, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
        <FaSpinner className="animate-spin text-6xl text-white" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full">
        <h1 className="text-4xl font-bold text-center mb-2 text-gray-800">
          개인 대시보드
        </h1>
        <p className="text-center text-gray-600 mb-8">
          나만의 정보를 한눈에 확인하세요
        </p>

        <div className="space-y-4">
          <button
            onClick={() => signIn("google")}
            className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all"
          >
            <FaGoogle className="text-xl" />
            Google 계정으로 로그인
          </button>
        </div>

        <div className="mt-8 text-center text-sm text-gray-600">
          <p>로그인하면 다음 정보를 확인할 수 있습니다:</p>
          <ul className="mt-2 space-y-1 text-left">
            <li>📰 주요 뉴스 (경제, IT, 세계, 건강)</li>
            <li>🌤️ 날씨 정보</li>
            <li>💱 환율 정보</li>
            <li>📈 주식 정보</li>
            <li>📧 Gmail 받은편지함</li>
            <li>📅 Google Calendar 일정</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
