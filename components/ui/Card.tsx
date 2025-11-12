import React from "react"

interface CardProps {
  children: React.ReactNode
  className?: string
  title?: string
}

export function Card({ children, className = "", title }: CardProps) {
  return (
    <div
      className={`bg-white rounded-2xl shadow-md border border-orange-100 p-6 hover:shadow-xl transition-all duration-200 ${className}`}
    >
      {title && (
        <h2 className="text-xl font-bold mb-4 bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
          {title}
        </h2>
      )}
      {children}
    </div>
  )
}
