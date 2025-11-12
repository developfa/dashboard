"use client"

import { useState, useEffect } from "react"
import { Card } from "../ui/Card"
import { FaCalendar, FaSpinner } from "react-icons/fa"

interface CalendarEvent {
  id: string
  summary: string
  description?: string
  start: string
  end: string
  location?: string
  htmlLink: string
}

export function CalendarWidget({ refreshInterval = 600000 }: { refreshInterval?: number }) {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchEvents = async () => {
    try {
      const response = await fetch("/api/calendar")
      if (!response.ok) {
        throw new Error("Failed to fetch calendar events")
      }
      const data = await response.json()
      setEvents(data.events)
      setLoading(false)
      setError(null)
    } catch (error: any) {
      console.error("Error fetching calendar:", error)
      setError(error.message)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEvents()
    const interval = setInterval(fetchEvents, refreshInterval)
    return () => clearInterval(interval)
  }, [refreshInterval])

  if (loading) {
    return (
      <Card title="Google Calendar">
        <div className="flex items-center justify-center py-12">
          <FaSpinner className="animate-spin text-4xl text-orange-500" />
        </div>
      </Card>
    )
  }

  if (error) {
    return (
      <Card title="Google Calendar">
        <div className="text-center py-8">
          <p className="text-orange-600 font-medium">{error}</p>
          <p className="text-sm text-stone-600 mt-2">
            Google 계정으로 로그인하고 Calendar 권한을 허용해주세요.
          </p>
        </div>
      </Card>
    )
  }

  return (
    <Card title="다가오는 일정 (2주)">
      <div className="space-y-2 max-h-96 overflow-y-auto custom-scrollbar">
        {events.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-stone-500">예정된 일정이 없습니다.</p>
          </div>
        ) : (
          events.map((event) => (
            <a
              key={event.id}
              href={event.htmlLink}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-100 hover:border-orange-200 hover:shadow-md transition-all group"
            >
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex-shrink-0 group-hover:scale-110 transition-transform">
                  <FaCalendar className="text-white text-sm" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-stone-800">
                    {event.summary || "(제목 없음)"}
                  </p>
                  {event.location && (
                    <p className="text-xs text-stone-600 mt-1">📍 {event.location}</p>
                  )}
                  <div className="text-xs text-stone-500 mt-2 space-y-1">
                    <p>
                      시작: {new Date(event.start).toLocaleString("ko-KR")}
                    </p>
                    <p>
                      종료: {new Date(event.end).toLocaleString("ko-KR")}
                    </p>
                  </div>
                </div>
              </div>
            </a>
          ))
        )}
      </div>
    </Card>
  )
}
