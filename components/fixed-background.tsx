"use client"

import Image from "next/image"
import { useTheme } from "next-themes"
import { useState, useEffect } from "react"

export function FixedBackground() {
  const { theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  
  // 在客户端渲染之后设置 mounted 为 true
  useEffect(() => {
    setMounted(true)
  }, [])
  
  // 确定当前主题
  const isDarkTheme = mounted && (theme === 'dark' || resolvedTheme === 'dark')
  
  // 根据当前主题选择背景图片
  const backgroundSrc = isDarkTheme
    ? "/images/gradient-background-dark.svg" 
    : "/images/gradient-background-light.svg"
  
  if (!mounted) return null
  
  return (
    <div className="fixed top-0 left-0 right-0 w-full h-[100vh] -z-10 overflow-hidden pointer-events-none">
      <div className="relative w-full h-full">
        <Image 
          src={backgroundSrc}
          alt="背景图片" 
          fill 
          priority 
          sizes="100vw"
          className={`object-cover transition-opacity duration-700 ${isDarkTheme ? 'opacity-50' : 'opacity-60'}`}
        />
        <div className={`absolute inset-0 ${isDarkTheme ? 'bg-black/30' : 'bg-white/40'}`} />
      </div>
    </div>
  )
}
