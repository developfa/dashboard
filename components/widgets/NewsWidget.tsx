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
  const [selectedCategory, setSelectedCategory] = useState("한국")
  const [showAll, setShowAll] = useState(false)

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
  const displayedItems = showAll ? selectedNews?.items : selectedNews?.items.slice(0, 5)

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    setShowAll(false)
  }

  return (
    <Card title="주요 뉴스">
      <div className="flex gap-2 mb-6 flex-wrap">
        {news.map((n) => (
          <button
            key={n.category}
            onClick={() => handleCategoryChange(n.category)}
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
        <>
          <div className="space-y-2">
            {displayedItems?.map((item, index) => (
              <a
                key={index}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block px-4 py-3 rounded-xl hover:bg-orange-50 transition-all duration-200 border border-orange-100 hover:border-orange-200 hover:shadow-md group"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <FaNewspaper className="text-orange-500 flex-shrink-0 group-hover:scale-110 transition-transform" />
                    <h3 className="text-sm font-medium text-stone-800 truncate group-hover:text-orange-600 transition-colors">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-xs text-stone-500 flex-shrink-0 whitespace-nowrap">
                    {new Date(item.pubDate).toLocaleString("ko-KR", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </p>
                </div>
              </a>
            ))}
          </div>

          {selectedNews && selectedNews.items.length > 5 && (
            <div className="mt-4 flex justify-center">
              <button
                onClick={() => setShowAll(!showAll)}
                className="px-6 py-2.5 rounded-xl font-medium text-sm bg-orange-50 text-orange-600 hover:bg-orange-100 border border-orange-200 transition-all duration-200 hover:shadow-md"
              >
                {showAll ? "접기" : `더 보기 (${selectedNews.items.length - 5}개 더)`}
              </button>
            </div>
          )}
        </>
      )}
    </Card>
  )
}
