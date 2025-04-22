"use client"

import { Home, Mail, BookOpen, Code, Briefcase } from "lucide-react"
import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"

const navItems = [
  { name: "首页", href: "#home", icon: Home },
  { name: "实习经历", href: "#experience", icon: Briefcase },
  { name: "教育经历", href: "#education", icon: BookOpen },
  { name: "技能专长", href: "#skills", icon: Code },
  { name: "联系方式", href: "#contact", icon: Mail }
]

export function CustomDock() {
  const [activeSection, setActiveSection] = useState("home")
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const { theme } = useTheme()
  const dockRef = useRef<HTMLDivElement>(null)

  // 处理滚动事件，检测当前活跃的部分
  useEffect(() => {
    const handleScroll = () => {
      // 获取所有部分并确定当前可见的部分
      const sections = navItems.map((item) => item.href.substring(1))

      // 找到当前在视口中的部分
      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          // 如果部分在视口中，将其设置为活跃部分
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    // 添加滚动事件监听器
    window.addEventListener("scroll", handleScroll)
    // 初始调用一次以设置初始状态
    handleScroll()

    // 清理函数
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // 处理导航点击，平滑滚动到目标部分
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const targetId = href.substring(1)
    const element = document.getElementById(targetId)

    if (element) {
      // 平滑滚动到目标元素
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div 
      ref={dockRef}
      className="flex items-center justify-center gap-5 rounded-full bg-transparent"
    >
      {navItems.map((item) => (
        <div 
          key={item.name} 
          className="relative group"
          onMouseEnter={() => setHoveredItem(item.name)}
          onMouseLeave={() => setHoveredItem(null)}
        >
          <Link
            href={item.href}
            onClick={(e) => handleNavClick(e, item.href)}
            className={cn(
              "flex items-center justify-center rounded-full transition-all duration-300 ease-in-out transform",
              activeSection === item.href.substring(1)
                ? "bg-indigo-100/80 dark:bg-purple-600/40 text-indigo-600 dark:text-purple-300"
                : "hover:bg-indigo-50/80 dark:hover:bg-purple-700/30 text-gray-700 dark:text-gray-200",
              hoveredItem === item.name ? "h-14 w-14 scale-110" : "h-12 w-12"
            )}
            aria-label={item.name}
          >
            <item.icon className={cn(
              "transition-all duration-300 ease-in-out",
              hoveredItem === item.name ? "h-7 w-7" : "h-6 w-6"
            )} />
          </Link>
          
          {/* 工具提示 */}
          <div className={cn(
            "absolute top-full mt-2 left-1/2 transform -translate-x-1/2 px-3 py-2 rounded-lg bg-white/95 dark:bg-purple-900/95 text-gray-900 dark:text-white text-sm font-medium whitespace-nowrap border border-indigo-200 dark:border-purple-500/30 shadow-lg transition-all duration-300 ease-in-out z-50",
            hoveredItem === item.name ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
          )}>
            {item.name}
            <div className="absolute w-2 h-2 bg-white dark:bg-purple-900 border-t border-l border-indigo-200 dark:border-purple-500/30 transform rotate-45 left-1/2 -top-1 -translate-x-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  )
} 