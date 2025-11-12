"use client"

import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { FaSpinner, FaCog, FaSignOutAlt } from "react-icons/fa"
import { NewsWidget } from "@/components/widgets/NewsWidget"
import { WeatherWidget } from "@/components/widgets/WeatherWidget"
import { CurrencyWidget } from "@/components/widgets/CurrencyWidget"
import { StockWidget } from "@/components/widgets/StockWidget"
import { GmailWidget } from "@/components/widgets/GmailWidget"
import { CalendarWidget } from "@/components/widgets/CalendarWidget"

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [refreshInterval, setRefreshInterval] = useState(600000) // 10분 기본값

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/")
    }
  }, [status, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <FaSpinner className="animate-spin text-6xl text-blue-500" />
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">개인 대시보드</h1>
              <p className="text-sm text-gray-600">
                환영합니다, {session.user?.name || session.user?.email}님!
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push("/settings")}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FaCog />
                설정
              </button>
              <button
                onClick={() => signOut()}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white hover:bg-red-600 rounded-lg transition-colors"
              >
                <FaSignOutAlt />
                로그아웃
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 뉴스 위젯 - 전체 너비 */}
          <div className="lg:col-span-3">
            <NewsWidget refreshInterval={refreshInterval} />
          </div>

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

          {/* Gmail 위젯 - 2칸 */}
          <div className="lg:col-span-2">
            <GmailWidget refreshInterval={refreshInterval} />
          </div>

          {/* Calendar 위젯 - 1칸 */}
          <div>
            <CalendarWidget refreshInterval={refreshInterval} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-sm text-gray-600">
            자동 새로고침: {refreshInterval / 1000 / 60}분마다
          </p>
        </div>
      </footer>
    </div>
  )
}
