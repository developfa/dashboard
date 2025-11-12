"use client"

import { useState, useEffect } from "react"
import { Card } from "../ui/Card"
import { FaNewspaper, FaSpinner } from "react-icons/fa"

interface NewsItem {
  title: string
  link: string
  pubDate: string
  source: string
}

interface NewsCategory {
  category: string
  items: NewsItem[]
}

export function NewsWidget({ refreshInterval = 600000 }: { refreshInterval?: number }) {
  const [news, setNews] = useState<NewsCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("경제")

  const fetchNews = async () => {
    try {
      const response = await fetch("/api/news")
      const data = await response.json()
      setNews(data.news)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching news:", error)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNews()
    const interval = setInterval(fetchNews, refreshInterval)
    return () => clearInterval(interval)
  }, [refreshInterval])

  const selectedNews = news.find((n) => n.category === selectedCategory)

  return (
    <Card title="주요 뉴스">
      <div className="flex gap-2 mb-4">
        {news.map((n) => (
          <button
            key={n.category}
            onClick={() => setSelectedCategory(n.category)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedCategory === n.category
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {n.category}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <FaSpinner className="animate-spin text-3xl text-blue-500" />
        </div>
      ) : (
        <div className="space-y-3">
          {selectedNews?.items.map((item, index) => (
            <a
              key={index}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200"
            >
              <div className="flex items-start gap-2">
                <FaNewspaper className="text-blue-500 mt-1 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(item.pubDate).toLocaleString("ko-KR")}
                  </p>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </Card>
  )
}
