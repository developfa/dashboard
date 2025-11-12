"use client"

import { useState, useEffect } from "react"
import { Card } from "../ui/Card"
import { FaCloudSun, FaSpinner } from "react-icons/fa"

interface WeatherData {
  current: {
    temp: number
    feels_like: number
    humidity: number
    description: string
    icon: string
  }
  forecast: Array<{
    dt: number
    temp: number
    description: string
    icon: string
  }>
}

export function WeatherWidget({ refreshInterval = 600000 }: { refreshInterval?: number }) {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchWeather = async () => {
    try {
      const response = await fetch("/api/weather?location=Seoul")
      const data = await response.json()
      setWeather(data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching weather:", error)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWeather()
    const interval = setInterval(fetchWeather, refreshInterval)
    return () => clearInterval(interval)
  }, [refreshInterval])

  if (loading) {
    return (
      <Card title="날씨">
        <div className="flex items-center justify-center py-8">
          <FaSpinner className="animate-spin text-3xl text-blue-500" />
        </div>
      </Card>
    )
  }

  if (!weather) {
    return (
      <Card title="날씨">
        <p className="text-red-500">날씨 정보를 불러올 수 없습니다.</p>
      </Card>
    )
  }

  return (
    <Card title="날씨 (서울)">
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <img
            src={`https://openweathermap.org/img/wn/${weather.current.icon}@2x.png`}
            alt="weather"
            className="w-20 h-20"
          />
          <div>
            <p className="text-4xl font-bold text-gray-900">
              {Math.round(weather.current.temp)}°C
            </p>
            <p className="text-sm text-gray-600">{weather.current.description}</p>
            <p className="text-xs text-gray-500">
              체감 {Math.round(weather.current.feels_like)}°C | 습도{" "}
              {weather.current.humidity}%
            </p>
          </div>
        </div>

        <div className="border-t pt-4">
          <h4 className="text-sm font-semibold mb-2 text-gray-700">3시간 간격 예보</h4>
          <div className="grid grid-cols-4 gap-2">
            {weather.forecast.slice(0, 4).map((item, index) => (
              <div key={index} className="text-center">
                <p className="text-xs text-gray-600">
                  {new Date(item.dt * 1000).toLocaleTimeString("ko-KR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                <img
                  src={`https://openweathermap.org/img/wn/${item.icon}.png`}
                  alt="weather"
                  className="w-10 h-10 mx-auto"
                />
                <p className="text-sm font-medium">{Math.round(item.temp)}°C</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
}
