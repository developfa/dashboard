"use client"

import { useState, useEffect } from "react"
import { Card } from "../ui/Card"
import { FaDollarSign, FaSpinner } from "react-icons/fa"

interface CurrencyData {
  base: string
  rates: Record<string, string>
  lastUpdated: string
}

export function CurrencyWidget({ refreshInterval = 600000 }: { refreshInterval?: number }) {
  const [currency, setCurrency] = useState<CurrencyData | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchCurrency = async () => {
    try {
      const response = await fetch("/api/currency")
      const data = await response.json()
      setCurrency(data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching currency:", error)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCurrency()
    const interval = setInterval(fetchCurrency, refreshInterval)
    return () => clearInterval(interval)
  }, [refreshInterval])

  if (loading) {
    return (
      <Card title="환율">
        <div className="flex items-center justify-center py-12">
          <FaSpinner className="animate-spin text-4xl text-orange-500" />
        </div>
      </Card>
    )
  }

  if (!currency) {
    return (
      <Card title="환율">
        <p className="text-orange-600">환율 정보를 불러올 수 없습니다.</p>
      </Card>
    )
  }

  const currencyNames: Record<string, string> = {
    USD: "미국 달러",
    JPY: "일본 엔",
    EUR: "유로",
    CNY: "중국 위안",
  }

  return (
    <Card title="환율 (KRW 기준)">
      <div className="space-y-3">
        {Object.entries(currency.rates).map(([code, rate]) => (
          <div
            key={code}
            className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-100 hover:border-orange-200 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg group-hover:scale-110 transition-transform">
                <FaDollarSign className="text-white" />
              </div>
              <div>
                <p className="font-bold text-stone-800">{code}</p>
                <p className="text-xs text-stone-600">{currencyNames[code] || code}</p>
              </div>
            </div>
            <p className="text-lg font-bold text-orange-600">₩{rate}</p>
          </div>
        ))}
        <p className="text-xs text-stone-500 text-right mt-4 pt-3 border-t border-orange-100">
          마지막 업데이트: {new Date(currency.lastUpdated).toLocaleString("ko-KR")}
        </p>
      </div>
    </Card>
  )
}
