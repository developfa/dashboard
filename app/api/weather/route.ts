import { NextResponse } from "next/server"
import axios from "axios"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const location = searchParams.get("location") || "Seoul"
  const apiKey = process.env.OPENWEATHER_API_KEY

  if (!apiKey) {
    return NextResponse.json(
      { error: "OpenWeather API key not configured" },
      { status: 500 }
    )
  }

  try {
    // Current weather
    const currentWeather = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric&lang=kr`
    )

    // 5-day forecast
    const forecast = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&units=metric&lang=kr`
    )

    return NextResponse.json({
      current: {
        temp: currentWeather.data.main.temp,
        feels_like: currentWeather.data.main.feels_like,
        humidity: currentWeather.data.main.humidity,
        description: currentWeather.data.weather[0].description,
        icon: currentWeather.data.weather[0].icon,
      },
      forecast: forecast.data.list.slice(0, 8).map((item: any) => ({
        dt: item.dt,
        temp: item.main.temp,
        description: item.weather[0].description,
        icon: item.weather[0].icon,
      })),
    })
  } catch (error) {
    console.error("Error fetching weather:", error)
    return NextResponse.json(
      { error: "Failed to fetch weather data" },
      { status: 500 }
    )
  }
}
