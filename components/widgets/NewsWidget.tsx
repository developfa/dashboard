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
      <div className="flex gap-2 mb-6 flex-wrap">
        {news.map((n) => (
          <button
            key={n.category}
            onClick={() => setSelectedCategory(n.category)}
            className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-200 ${
              selectedCategory === n.category
                ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md"
                : "bg-orange-50 text-stone-700 hover:bg-orange-100 border border-orange-200"
            }`}
          >
            {n.category}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <FaSpinner className="animate-spin text-4xl text-orange-500" />
        </div>
      ) : (
        <div className="space-y-3">
          {selectedNews?.items.map((item, index) => (
            <a
              key={index}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 rounded-xl hover:bg-orange-50 transition-all duration-200 border border-orange-100 hover:border-orange-200 hover:shadow-md group"
            >
              <div className="flex items-start gap-3">
                <FaNewspaper className="text-orange-500 mt-1 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-stone-800 line-clamp-2 group-hover:text-orange-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-stone-500 mt-2">
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
