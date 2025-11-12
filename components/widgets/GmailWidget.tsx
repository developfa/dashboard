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
        <div className="flex items-center justify-center py-8">
          <FaSpinner className="animate-spin text-3xl text-blue-500" />
        </div>
      </Card>
    )
  }

  if (error) {
    return (
      <Card title="Gmail">
        <p className="text-red-500">{error}</p>
        <p className="text-sm text-gray-600 mt-2">
          Google 계정으로 로그인하고 Gmail 권한을 허용해주세요.
        </p>
      </Card>
    )
  }

  return (
    <Card title="Gmail 받은편지함">
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {emails.map((email) => (
          <div
            key={email.id}
            className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-start gap-2">
              <FaEnvelope className="text-blue-500 mt-1 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {email.subject || "(제목 없음)"}
                </p>
                <p className="text-xs text-gray-600 truncate">{email.from}</p>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{email.snippet}</p>
                <p className="text-xs text-gray-400 mt-1">
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
