"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { FaSpinner, FaArrowLeft, FaSave } from "react-icons/fa"
import { Card } from "@/components/ui/Card"

export default function Settings() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [refreshInterval, setRefreshInterval] = useState(10) // 분 단위
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/")
    }
  }, [status, router])

  const handleSave = () => {
    setSaving(true)
    // localStorage에 설정 저장
    localStorage.setItem("dashboardRefreshInterval", refreshInterval.toString())

    setTimeout(() => {
      setSaving(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }, 500)
  }

  useEffect(() => {
    // localStorage에서 설정 불러오기
    const savedInterval = localStorage.getItem("dashboardRefreshInterval")
    if (savedInterval) {
      setRefreshInterval(parseInt(savedInterval))
    }
  }, [])

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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/dashboard")}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FaArrowLeft />
              대시보드로
            </button>
            <h1 className="text-2xl font-bold text-gray-900">설정</h1>
          </div>
        </div>
      </header>

      {/* Settings Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card title="일반 설정">
          <div className="space-y-6">
            {/* 새로고침 주기 설정 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                자동 새로고침 주기 (분)
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="1"
                  max="60"
                  value={refreshInterval}
                  onChange={(e) => setRefreshInterval(parseInt(e.target.value))}
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-lg font-semibold text-gray-900 min-w-[60px]">
                  {refreshInterval}분
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-600">
                위젯 데이터가 {refreshInterval}분마다 자동으로 업데이트됩니다.
              </p>
            </div>

            {/* 추천 주기 정보 */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-blue-900 mb-2">
                추천 새로고침 주기
              </h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• 5분: 실시간 정보가 중요한 경우 (주식, 환율 등)</li>
                <li>• 10분: 일반적인 사용 (권장)</li>
                <li>• 30분: 데이터 사용량을 줄이고 싶은 경우</li>
              </ul>
            </div>

            {/* 저장 버튼 */}
            <div className="flex gap-4">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-400"
              >
                {saving ? (
                  <FaSpinner className="animate-spin" />
                ) : (
                  <FaSave />
                )}
                {saving ? "저장 중..." : "설정 저장"}
              </button>
              {saved && (
                <span className="flex items-center text-green-600 font-medium">
                  ✓ 저장되었습니다!
                </span>
              )}
            </div>
          </div>
        </Card>

        {/* API 키 설정 안내 */}
        <Card title="API 키 설정" className="mt-6">
          <div className="space-y-4">
            <p className="text-gray-700">
              일부 기능을 사용하려면 아래 API 키가 필요합니다:
            </p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <strong>OpenWeatherMap API:</strong> 날씨 정보
                <br />
                <a
                  href="https://openweathermap.org/api"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  무료 가입하기 →
                </a>
              </li>
              <li>
                <strong>ExchangeRate-API:</strong> 환율 정보
                <br />
                <a
                  href="https://www.exchangerate-api.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  무료 가입하기 →
                </a>
              </li>
              <li>
                <strong>Alpha Vantage API:</strong> 주식 정보
                <br />
                <a
                  href="https://www.alphavantage.co/support/#api-key"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  무료 가입하기 →
                </a>
              </li>
            </ul>
            <p className="text-sm text-gray-600 mt-4">
              API 키는 서버의 .env 파일에 설정해주세요.
            </p>
          </div>
        </Card>
      </main>
    </div>
  )
}
