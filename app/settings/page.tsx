"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { FaSpinner, FaArrowLeft, FaSave, FaCheckCircle } from "react-icons/fa"
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
        <FaSpinner className="animate-spin text-6xl text-orange-500" />
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen" style={{ background: '#FFFBEB' }}>
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-orange-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/dashboard")}
              className="flex items-center gap-2 px-4 py-2 text-stone-700 hover:bg-orange-50 rounded-xl transition-all duration-200 border border-transparent hover:border-orange-200"
            >
              <FaArrowLeft className="text-orange-500" />
              대시보드로
            </button>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
              설정
            </h1>
          </div>
        </div>
      </header>

      {/* Settings Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card title="일반 설정">
          <div className="space-y-6">
            {/* 새로고침 주기 설정 */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-3">
                자동 새로고침 주기
              </label>
              <div className="p-5 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl border border-orange-100">
                <div className="flex items-center gap-4 mb-3">
                  <input
                    type="range"
                    min="1"
                    max="60"
                    value={refreshInterval}
                    onChange={(e) => setRefreshInterval(parseInt(e.target.value))}
                    className="flex-1 h-2 bg-orange-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                    style={{
                      background: `linear-gradient(to right, #FB923C ${(refreshInterval / 60) * 100}%, #FED7AA ${(refreshInterval / 60) * 100}%)`
                    }}
                  />
                  <div className="flex items-center justify-center min-w-[80px] h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-md">
                    <span className="text-2xl font-bold text-white">
                      {refreshInterval}분
                    </span>
                  </div>
                </div>
                <p className="text-sm text-stone-600">
                  위젯 데이터가 <span className="font-semibold text-orange-600">{refreshInterval}분</span>마다 자동으로 업데이트됩니다.
                </p>
              </div>
            </div>

            {/* 추천 주기 정보 */}
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-stone-800 mb-3 flex items-center gap-2">
                <span className="text-orange-500">💡</span>
                추천 새로고침 주기
              </h3>
              <ul className="text-sm text-stone-700 space-y-2">
                <li className="flex items-center gap-2">
                  <span className="text-orange-500">•</span>
                  <span><strong>5분:</strong> 실시간 정보가 중요한 경우 (주식, 환율 등)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-orange-500">•</span>
                  <span><strong>10분:</strong> 일반적인 사용 (권장)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-orange-500">•</span>
                  <span><strong>30분:</strong> 데이터 사용량을 줄이고 싶은 경우</span>
                </li>
              </ul>
            </div>

            {/* 저장 버튼 */}
            <div className="flex items-center gap-4">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <FaSpinner className="animate-spin" />
                ) : (
                  <FaSave />
                )}
                {saving ? "저장 중..." : "설정 저장"}
              </button>
              {saved && (
                <span className="flex items-center gap-2 text-green-600 font-medium animate-fade-in">
                  <FaCheckCircle />
                  저장되었습니다!
                </span>
              )}
            </div>
          </div>
        </Card>

        {/* API 키 설정 안내 */}
        <Card title="API 키 설정" className="mt-6">
          <div className="space-y-5">
            <p className="text-stone-700">
              일부 기능을 사용하려면 아래 API 키가 필요합니다:
            </p>
            <div className="space-y-3">
              <div className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-100">
                <p className="font-semibold text-stone-800 mb-1">OpenWeatherMap API</p>
                <p className="text-sm text-stone-600 mb-2">날씨 정보</p>
                <a
                  href="https://openweathermap.org/api"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-orange-600 hover:text-orange-700 font-medium"
                >
                  무료 가입하기 →
                </a>
              </div>

              <div className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-100">
                <p className="font-semibold text-stone-800 mb-1">ExchangeRate-API</p>
                <p className="text-sm text-stone-600 mb-2">환율 정보</p>
                <a
                  href="https://www.exchangerate-api.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-orange-600 hover:text-orange-700 font-medium"
                >
                  무료 가입하기 →
                </a>
              </div>

              <div className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-100">
                <p className="font-semibold text-stone-800 mb-1">Alpha Vantage API</p>
                <p className="text-sm text-stone-600 mb-2">주식 정보</p>
                <a
                  href="https://www.alphavantage.co/support/#api-key"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-orange-600 hover:text-orange-700 font-medium"
                >
                  무료 가입하기 →
                </a>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-orange-100">
              <p className="text-sm text-stone-600">
                💡 API 키는 서버의 <code className="px-2 py-1 bg-orange-100 text-orange-700 rounded font-mono text-xs">.env</code> 파일에 설정해주세요.
              </p>
            </div>
          </div>
        </Card>
      </main>
    </div>
  )
}
