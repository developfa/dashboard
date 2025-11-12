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
        <div className="flex items-center justify-center py-8">
          <FaSpinner className="animate-spin text-3xl text-blue-500" />
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
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            {stock.error ? (
              <div className="w-full">
                <p className="font-semibold text-gray-900">{stock.symbol}</p>
                <p className="text-xs text-red-500">{stock.error}</p>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <FaChartLine
                    className={stock.change >= 0 ? "text-green-500" : "text-red-500"}
                  />
                  <div>
                    <p className="font-semibold text-gray-900">{stock.symbol}</p>
                    <p className="text-xs text-gray-600">${stock.price.toFixed(2)}</p>
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
