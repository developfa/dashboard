import { NextResponse } from "next/server"
import axios from "axios"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const currencies = searchParams.get("currencies")?.split(",") || ["USD", "JPY", "EUR", "CNY"]
  const apiKey = process.env.EXCHANGERATE_API_KEY

  if (!apiKey) {
    return NextResponse.json(
      { error: "ExchangeRate API key not configured" },
      { status: 500 }
    )
  }

  try {
    // ExchangeRate-API를 사용
    const response = await axios.get(
      `https://v6.exchangerate-api.com/v6/${apiKey}/latest/KRW`
    )

    const rates = currencies.reduce((acc: any, currency: string) => {
      const rate = response.data.conversion_rates[currency]
      if (rate) {
        // KRW to currency 변환 (역수 계산)
        acc[currency] = (1 / rate).toFixed(2)
      }
      return acc
    }, {})

    return NextResponse.json({
      base: "KRW",
      rates,
      lastUpdated: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error fetching currency rates:", error)
    return NextResponse.json(
      { error: "Failed to fetch currency rates" },
      { status: 500 }
    )
  }
}
