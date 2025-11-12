"use client"

import { useState, useEffect } from "react"
import { Card } from "../ui/Card"
import { FaChartLine, FaSpinner } from "react-icons/fa"

interface Stock {
  symbol: string
  price: number
  change: number
  changePercent: string
  volume: string
  error?: string
}

export function StockWidget({ refreshInterval = 600000 }: { refreshInterval?: number }) {
  const [stocks, setStocks] = useState<Stock[]>([])
  const [loading, setLoading] = useState(true)

  const fetchStocks = async () => {
    try {
      const response = await fetch("/api/stock")
      const data = await response.json()
      setStocks(data.stocks)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching stocks:", error)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStocks()
    const interval = setInterval(fetchStocks, refreshInterval)
    return () => clearInterval(interval)
  }, [refreshInterval])

  if (loading) {
    return (
      <Card title="주식">
        <div className="flex items-center justify-center py-12">
          <FaSpinner className="animate-spin text-4xl text-orange-500" />
        </div>
      </Card>
    )
  }

  return (
    <Card title="주식 정보">
      <div className="space-y-3">
        {stocks.map((stock) => (
          <div
            key={stock.symbol}
            className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-100 hover:border-orange-200 transition-all group"
          >
            {stock.error ? (
              <div className="w-full">
                <p className="font-semibold text-stone-800">{stock.symbol}</p>
                <p className="text-xs text-orange-600 mt-1">{stock.error}</p>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-lg group-hover:scale-110 transition-transform ${
                    stock.change >= 0
                      ? "bg-gradient-to-br from-green-500 to-green-600"
                      : "bg-gradient-to-br from-red-500 to-red-600"
                  }`}>
                    <FaChartLine className="text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-stone-800">{stock.symbol}</p>
                    <p className="text-xs text-stone-600">${stock.price.toFixed(2)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`text-sm font-bold ${
                      stock.change >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {stock.change >= 0 ? "+" : ""}
                    {stock.change.toFixed(2)}
                  </p>
                  <p
                    className={`text-xs ${
                      stock.change >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {stock.changePercent}
                  </p>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </Card>
  )
}
