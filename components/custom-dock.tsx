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
  
  // 使用IntersectionObserver检测页面可见部分
  useEffect(() => {
    const sectionIds = navItems.map(item => item.href.substring(1))
    let sectionElements: Element[] = []
    
    // 创建映射存储每个部分的可见性评分
    const visibilityScores: {[key: string]: number} = {}
    sectionIds.forEach(id => {
      visibilityScores[id] = 0
    })
    
    const observerOptions = {
      root: null, // 使用视口作为根
      rootMargin: '0px',
      threshold: Array.from({ length: 11 }, (_, i) => i / 10) // 0, 0.1, 0.2, ..., 1.0
    }
    
    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        const targetId = entry.target.id
        // 根据交叉比例和元素位置计算可见性评分
        const score = entry.intersectionRatio * 100
        visibilityScores[targetId] = score
      })
      
      // 如果在页面顶部，强制设置首页为活跃
      if (window.scrollY < 100) {
        setActiveSection("home")
        return
      }
      
      // 如果在页面底部，强制设置联系方式为活跃
      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 200) {
        setActiveSection("contact")
        return
      }
      
      // 找出可见性评分最高的部分
      let highestScore = 0
      let mostVisibleSection = activeSection
      
      for (const id in visibilityScores) {
        // 添加权重：给当前处于视口上半部分的元素更高的权重
        const element = document.getElementById(id)
        let weightedScore = visibilityScores[id]
        
        if (element) {
          const rect = element.getBoundingClientRect()
          // 如果元素顶部进入视口顶部附近，给它额外加分
          if (rect.top <= 150 && rect.top >= -150) {
            weightedScore += 50
          }
        }
        
        if (weightedScore > highestScore) {
          highestScore = weightedScore
          mostVisibleSection = id
        }
      }
      
      // 只有当分数超过阈值时才切换活跃部分
      if (highestScore > 30) {
        setActiveSection(mostVisibleSection)
      }
    }
    
    // 创建观察者
    const observer = new IntersectionObserver(handleIntersection, observerOptions)
    
    // 观察所有部分
    sectionIds.forEach(id => {
      const element = document.getElementById(id)
      if (element) {
        observer.observe(element)
        sectionElements.push(element)
      }
    })
    
    // 添加滚动处理器来触发重新计算
    const handleScroll = () => {
      handleIntersection(
        sectionElements.map(element => ({
          target: element,
          intersectionRatio: getIntersectionRatio(element),
          isIntersecting: isElementVisible(element),
          boundingClientRect: element.getBoundingClientRect(),
          intersectionRect: getIntersectionRect(element),
          rootBounds: null as any,
          time: Date.now()
        }))
      )
    }
    
    // 辅助函数：计算元素与视口的交叉比例
    function getIntersectionRatio(element: Element): number {
      const rect = element.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      
      // 计算元素在视口中可见的部分
      const visibleTop = Math.max(0, rect.top)
      const visibleBottom = Math.min(viewportHeight, rect.bottom)
      
      if (visibleBottom <= visibleTop) return 0 // 不在视口中
      
      const visibleHeight = visibleBottom - visibleTop
      const ratio = visibleHeight / rect.height
      
      return Math.max(0, Math.min(1, ratio)) // 确保比例在0-1之间
    }
    
    // 辅助函数：元素是否可见
    function isElementVisible(element: Element): boolean {
      const rect = element.getBoundingClientRect()
      return (
        rect.top < window.innerHeight &&
        rect.bottom > 0
      )
    }
    
    // 辅助函数：获取元素与视口的交叉矩形
    function getIntersectionRect(element: Element): DOMRectReadOnly {
      const rect = element.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      
      const top = Math.max(0, rect.top)
      const bottom = Math.min(viewportHeight, rect.bottom)
      const height = Math.max(0, bottom - top)
      
      return {
        x: rect.x,
        y: top,
        width: rect.width,
        height,
        top,
        bottom,
        left: rect.left,
        right: rect.right,
        toJSON: () => ({})
      }
    }
    
    window.addEventListener('scroll', handleScroll)
    
    // 初始调用一次
    setTimeout(handleScroll, 100)
    
    return () => {
      // 清理
      sectionElements.forEach(element => {
        observer.unobserve(element)
      })
      observer.disconnect()
      window.removeEventListener('scroll', handleScroll)
    }
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