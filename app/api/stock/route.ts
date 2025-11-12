import { NextResponse } from "next/server"
import axios from "axios"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const symbols = searchParams.get("symbols")?.split(",") || ["AAPL", "GOOGL", "MSFT"]
  const apiKey = process.env.ALPHAVANTAGE_API_KEY

  if (!apiKey) {
    return NextResponse.json(
      { error: "Alpha Vantage API key not configured" },
      { status: 500 }
    )
  }

  try {
    const stockPromises = symbols.map(async (symbol: string) => {
      try {
        const response = await axios.get(
          `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`
        )

        const quote = response.data["Global Quote"]
        if (!quote || Object.keys(quote).length === 0) {
          return {
            symbol,
            error: "No data available",
          }
        }

        return {
          symbol: quote["01. symbol"],
          price: parseFloat(quote["05. price"]),
          change: parseFloat(quote["09. change"]),
          changePercent: quote["10. change percent"],
          volume: quote["06. volume"],
        }
      } catch (error) {
        console.error(`Error fetching ${symbol}:`, error)
        return {
          symbol,
          error: "Failed to fetch data",
        }
      }
    })

    const stocks = await Promise.all(stockPromises)
    return NextResponse.json({ stocks })
  } catch (error) {
    console.error("Error fetching stock data:", error)
    return NextResponse.json(
      { error: "Failed to fetch stock data" },
      { status: 500 }
    )
  }
}
