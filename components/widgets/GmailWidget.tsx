"use client"

import { useState, useEffect } from "react"
import { Card } from "../ui/Card"
import { FaEnvelope, FaSpinner } from "react-icons/fa"

interface Email {
  id: string
  from: string
  subject: string
  date: string
  snippet: string
}

export function GmailWidget({ refreshInterval = 600000 }: { refreshInterval?: number }) {
  const [emails, setEmails] = useState<Email[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchEmails = async () => {
    try {
      const response = await fetch("/api/gmail")
      if (!response.ok) {
        throw new Error("Failed to fetch emails")
      }
      const data = await response.json()
      setEmails(data.emails)
      setLoading(false)
      setError(null)
    } catch (error: any) {
      console.error("Error fetching emails:", error)
      setError(error.message)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEmails()
    const interval = setInterval(fetchEmails, refreshInterval)
    return () => clearInterval(interval)
  }, [refreshInterval])

  if (loading) {
    return (
      <Card title="Gmail">
        <div className="flex items-center justify-center py-12">
          <FaSpinner className="animate-spin text-4xl text-orange-500" />
        </div>
      </Card>
    )
  }

  if (error) {
    return (
      <Card title="Gmail">
        <div className="text-center py-8">
          <p className="text-orange-600 font-medium">{error}</p>
          <p className="text-sm text-stone-600 mt-2">
            Google 계정으로 로그인하고 Gmail 권한을 허용해주세요.
          </p>
        </div>
      </Card>
    )
  }

  return (
    <Card title="Gmail 받은편지함">
      <div className="space-y-2 max-h-96 overflow-y-auto custom-scrollbar">
        {emails.map((email) => (
          <div
            key={email.id}
            className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-100 hover:border-orange-200 hover:shadow-md transition-all group"
          >
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex-shrink-0 group-hover:scale-110 transition-transform">
                <FaEnvelope className="text-white text-sm" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-stone-800 truncate">
                  {email.subject || "(제목 없음)"}
                </p>
                <p className="text-xs text-stone-600 truncate mt-1">{email.from}</p>
                <p className="text-xs text-stone-500 mt-2 line-clamp-2">{email.snippet}</p>
                <p className="text-xs text-stone-400 mt-2">
                  {new Date(email.date).toLocaleString("ko-KR")}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
