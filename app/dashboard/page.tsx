"use client"

import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { FaSpinner, FaCog, FaSignOutAlt, FaCalendarAlt, FaNewspaper } from "react-icons/fa"
import { NewsWidget } from "@/components/widgets/NewsWidget"
import { WeatherWidget } from "@/components/widgets/WeatherWidget"
import { CurrencyWidget } from "@/components/widgets/CurrencyWidget"
import { StockWidget } from "@/components/widgets/StockWidget"

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [refreshInterval, setRefreshInterval] = useState(600000) // 10분 기본값
  const [activeTab, setActiveTab] = useState<"schedule" | "news">("news")

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/")
    }
  }, [status, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <FaSpinner className="animate-spin text-6xl text-orange-500" />
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen" style={{ background: '#FFFBEB' }}>
      {/* Header - Fixed */}
      <header className="bg-white shadow-sm border-b border-orange-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-md">
                <span className="text-xl">📊</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
                  개인 대시보드
                </h1>
                <p className="text-sm text-stone-600">
                  환영합니다, {session.user?.name || session.user?.email}님
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push("/settings")}
                className="flex items-center gap-2 px-4 py-2 text-stone-700 hover:bg-orange-50 rounded-xl transition-all duration-200 border border-transparent hover:border-orange-200"
              >
                <FaCog className="text-orange-500" />
                <span className="hidden sm:inline">설정</span>
              </button>
              <button
                onClick={() => signOut()}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <FaSignOutAlt />
                <span className="hidden sm:inline">로그아웃</span>
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 border-t border-orange-100 pt-2">
            <button
              onClick={() => setActiveTab("news")}
              className={`flex items-center gap-2 px-6 py-3 rounded-t-xl font-medium transition-all duration-200 ${
                activeTab === "news"
                  ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md"
                  : "text-stone-700 hover:bg-orange-50"
              }`}
            >
              <FaNewspaper />
              <span>뉴스</span>
            </button>
            <button
              onClick={() => setActiveTab("schedule")}
              className={`flex items-center gap-2 px-6 py-3 rounded-t-xl font-medium transition-all duration-200 ${
                activeTab === "schedule"
                  ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md"
                  : "text-stone-700 hover:bg-orange-50"
              }`}
            >
              <FaCalendarAlt />
              <span>일정관리</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 뉴스 탭 */}
        {activeTab === "news" && (
          <div className="space-y-6">
            {/* 뉴스 위젯 - 전체 너비 */}
            <NewsWidget refreshInterval={refreshInterval} />

            {/* 하단 정보 위젯들 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* 날씨 위젯 */}
              <div>
                <WeatherWidget refreshInterval={refreshInterval} />
              </div>

              {/* 환율 위젯 */}
              <div>
                <CurrencyWidget refreshInterval={refreshInterval} />
              </div>

              {/* 주식 위젯 */}
              <div>
                <StockWidget refreshInterval={refreshInterval} />
              </div>
            </div>
          </div>
        )}

        {/* 일정관리 탭 */}
        {activeTab === "schedule" && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg border border-orange-100 p-8">
              <h2 className="text-xl font-bold text-stone-800 mb-4">일정관리</h2>
              <p className="text-stone-600">일정관리 기능이 여기에 추가됩니다.</p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-orange-100 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-sm text-stone-500">
            자동 새로고침: <span className="text-orange-600 font-medium">{refreshInterval / 1000 / 60}분</span>마다
          </p>
        </div>
      </footer>
    </div>
  )
}
