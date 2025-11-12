import { NextResponse } from "next/server"
import Parser from "rss-parser"

const parser = new Parser()

const NEWS_FEEDS = {
  경제: "https://news.google.com/rss/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRGx6Ylc4U0FtdHZHZ0pMVWlnQVAB?hl=ko&gl=KR&ceid=KR:ko",
  IT: "https://news.google.com/rss/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRGRqTVhZU0FtdHZHZ0pMVWlnQVAB?hl=ko&gl=KR&ceid=KR:ko",
  세계: "https://news.google.com/rss/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRGx1YlY4U0FtdHZHZ0pMVWlnQVAB?hl=ko&gl=KR&ceid=KR:ko",
  건강: "https://news.google.com/rss/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNR3QwTlRFU0FtdHZHZ0pMVWlnQVAB?hl=ko&gl=KR&ceid=KR:ko",
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const categories = searchParams.get("categories")?.split(",") || ["경제", "IT", "세계", "건강"]

  try {
    const newsPromises = categories.map(async (category) => {
      const feedUrl = NEWS_FEEDS[category as keyof typeof NEWS_FEEDS]
      if (!feedUrl) return { category, items: [] }

      try {
        const feed = await parser.parseURL(feedUrl)
        return {
          category,
          items: feed.items.slice(0, 5).map((item) => ({
            title: item.title,
            link: item.link,
            pubDate: item.pubDate,
            source: item.creator || "Google News",
          })),
        }
      } catch (error) {
        console.error(`Error fetching ${category} news:`, error)
        return { category, items: [] }
      }
    })

    const news = await Promise.all(newsPromises)
    return NextResponse.json({ news })
  } catch (error) {
    console.error("Error fetching news:", error)
    return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 })
  }
}
