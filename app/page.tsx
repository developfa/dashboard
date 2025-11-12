"use client"

import { useSession, signIn } from "next-auth/react"
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100">
        <FaSpinner className="animate-spin text-6xl text-orange-500" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100">
      <div className="w-full max-w-md mx-4">
        {/* Logo/Title Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl mb-4 shadow-lg">
            <span className="text-3xl">📊</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent mb-2">
            개인 대시보드
          </h1>
          <p className="text-stone-600 text-lg">
            나만의 정보를 한눈에
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-orange-100 p-8 backdrop-blur-sm">
          <button
            onClick={() => signIn("google")}
            className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <FaGoogle className="text-xl" />
            Google 계정으로 시작하기
          </button>

          {/* Features List */}
          <div className="mt-8 pt-8 border-t border-orange-100">
            <p className="text-sm text-stone-600 font-medium mb-4">제공되는 기능</p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2 text-stone-700">
                <span className="text-orange-500">📰</span>
                <span>실시간 뉴스</span>
              </div>
              <div className="flex items-center gap-2 text-stone-700">
                <span className="text-orange-500">🌤️</span>
                <span>날씨 정보</span>
              </div>
              <div className="flex items-center gap-2 text-stone-700">
                <span className="text-orange-500">💱</span>
                <span>환율 정보</span>
              </div>
              <div className="flex items-center gap-2 text-stone-700">
                <span className="text-orange-500">📈</span>
                <span>주식 정보</span>
              </div>
              <div className="flex items-center gap-2 text-stone-700">
                <span className="text-orange-500">📧</span>
                <span>Gmail 연동</span>
              </div>
              <div className="flex items-center gap-2 text-stone-700">
                <span className="text-orange-500">📅</span>
                <span>캘린더 연동</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-stone-500 mt-6">
          모든 데이터는 안전하게 보호됩니다
        </p>
      </div>
    </div>
  )
}
