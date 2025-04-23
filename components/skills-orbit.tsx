"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

type SkillNode = {
  name: string
  icon?: string | React.ReactNode
  color?: string
  position?: { x: number; y: number }
  category?: string
  level?: string
  value?: number
  description?: string
}

interface SkillsOrbitProps {
  skills: SkillNode[]
  centerNode?: SkillNode
  className?: string
  innerRadius?: number
  outerRadius?: number
  rotationSpeed?: number
  alternateDirection?: boolean
}

export function SkillsOrbit({
  skills,
  centerNode = { name: "核心技能" },
  className,
  innerRadius = 120,
  outerRadius = 220,
  rotationSpeed = 0.005,
  alternateDirection = true,
}: SkillsOrbitProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [rotation, setRotation] = useState(0)
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null)
  const [skillsWithPositions, setSkillsWithPositions] = useState<SkillNode[]>(skills)
  const animationRef = useRef<number | null>(null)
  const lastTimeRef = useRef<number>(0)
  const [windowWidth, setWindowWidth] = useState(0)
  const [responsiveInnerRadius, setResponsiveInnerRadius] = useState(innerRadius)
  const [responsiveOuterRadius, setResponsiveOuterRadius] = useState(outerRadius)
  
  // 初始化窗口宽度并添加窗口尺寸变化监听
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // 初始化窗口宽度
      setWindowWidth(window.innerWidth)
      
      // 计算响应式半径
      const updateRadii = () => {
        const width = window.innerWidth
        setWindowWidth(width)
        
        // 为不同屏幕尺寸设置不同半径
        if (width < 480) { // 手机屏幕
          setResponsiveInnerRadius(Math.min(80, innerRadius * 0.65))
          setResponsiveOuterRadius(Math.min(140, outerRadius * 0.65))
        } else if (width < 768) { // 平板小屏
          setResponsiveInnerRadius(Math.min(100, innerRadius * 0.8))
          setResponsiveOuterRadius(Math.min(180, outerRadius * 0.8))
        } else if (width < 1024) { // 平板大屏
          setResponsiveInnerRadius(innerRadius * 0.9)
          setResponsiveOuterRadius(outerRadius * 0.9)
        } else { // 桌面
          setResponsiveInnerRadius(innerRadius)
          setResponsiveOuterRadius(outerRadius)
        }
      }
      
      // 初始计算
      updateRadii()
      
      // 监听窗口大小变化
      const handleResize = () => {
        updateRadii()
      }
      
      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }
  }, [innerRadius, outerRadius])
  
  // 计算位置 - 使用响应式半径
  useEffect(() => {
    const totalSkills = skills.length
    const halfSkills = Math.ceil(totalSkills / 2)
    
    // 将技能分成两个圆环
    const skillsWithPos = skills.map((skill, index) => {
      // 为每个技能分配一个环绕角度
      const angle = (index < halfSkills) 
        ? (index * (2 * Math.PI / halfSkills)) 
        : ((index - halfSkills) * (2 * Math.PI / (totalSkills - halfSkills)))
      
      // 确定该技能在内环还是外环，使用响应式半径
      const radius = index < halfSkills ? responsiveInnerRadius : responsiveOuterRadius
      
      // 计算位置
      const x = Math.cos(angle) * radius
      const y = Math.sin(angle) * radius
      
      return {
        ...skill,
        position: { x, y }
      }
    })
    
    setSkillsWithPositions(skillsWithPos)
  }, [skills, responsiveInnerRadius, responsiveOuterRadius])
  
  // 优化的动画旋转，降低更新频率并使用更平滑的插值
  useEffect(() => {
    let rotationValue = rotation
    let accumulatedTime = 0;
    const updateInterval = 30; // 每30ms更新一次状态，减少重绘频率
    
    const animate = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp
      
      // 计算帧间时间差
      const deltaTime = timestamp - lastTimeRef.current
      lastTimeRef.current = timestamp
      
      // 累积时间
      accumulatedTime += deltaTime;
      
      // 计算旋转增量，保持连贯性
      rotationValue += rotationSpeed * (deltaTime / 16.66)
      
      // 只在累积时间达到更新间隔时更新DOM
      if (accumulatedTime >= updateInterval) {
        setRotation(rotationValue)
        accumulatedTime = 0;
      }
      
      animationRef.current = requestAnimationFrame(animate)
    }
    
    animationRef.current = requestAnimationFrame(animate)
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [rotationSpeed])
  
  // 暂停/恢复轨道旋转
  const handleMouseEnter = () => {
    // 移除整个容器的暂停效果，只在单个技能悬停时暂停
    // 不再暂停整个轨道
  }
  
  const handleMouseLeave = () => {
    // 相应地，也不需要整个容器的恢复效果
  }
  
  // 处理单个技能节点的悬停
  const handleSkillMouseEnter = (skillName: string) => {
    setHoveredSkill(skillName)
    // 只有悬停到具体技能时才暂停
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
      animationRef.current = null
    }
    
    // 显示对应的技能详情卡片
    const detailCard = document.getElementById(`skill-detail-${skillName.replace(/\s+/g, '-').toLowerCase()}`)
    const defaultCard = document.getElementById('skill-detail-default')
    
    if (detailCard) {
      // 隐藏默认卡片
      if (defaultCard) {
        defaultCard.style.display = 'none'
      }
      
      // 重置所有卡片
      document.querySelectorAll('[id^="skill-detail-"]').forEach(card => {
        if (card.id !== 'skill-detail-default') {
          (card as HTMLElement).style.opacity = '0'
          ;(card as HTMLElement).style.transform = 'translate(10px, 0) scale(0.95)'
          ;(card as HTMLElement).style.pointerEvents = 'none'
        }
      })
      
      // 显示当前卡片
      detailCard.style.opacity = '1'
      detailCard.style.transform = 'translate(0, 0) scale(1)'
      detailCard.style.pointerEvents = 'auto'
    }
  }
  
  const handleSkillMouseLeave = () => {
    setHoveredSkill(null)
    // 离开技能后恢复旋转
    if (!animationRef.current) {
      lastTimeRef.current = 0
      animationRef.current = requestAnimationFrame((timestamp) => {
        lastTimeRef.current = timestamp
        const animate = (t: number) => {
          if (!lastTimeRef.current) lastTimeRef.current = t
          
          const deltaTime = t - lastTimeRef.current
          setRotation(r => r + rotationSpeed * (deltaTime / 16.66))
          
          lastTimeRef.current = t
          animationRef.current = requestAnimationFrame(animate)
        }
        animationRef.current = requestAnimationFrame(animate)
      })
    }
    
    // 立即隐藏所有详情卡片，显示默认卡片
    const defaultCard = document.getElementById('skill-detail-default')
    if (defaultCard) {
      defaultCard.style.display = 'flex'
    }
    
    document.querySelectorAll('[id^="skill-detail-"]').forEach(card => {
      if (card.id !== 'skill-detail-default') {
        (card as HTMLElement).style.opacity = '0'
        ;(card as HTMLElement).style.transform = 'translate(10px, 0) scale(0.95)'
        ;(card as HTMLElement).style.pointerEvents = 'none'
      }
    })
  }

  // 计算小屏幕下的轨道大小
  const getResponsiveTrackSize = (baseSize: number) => {
    if (windowWidth < 480) return baseSize * 0.65;
    if (windowWidth < 768) return baseSize * 0.8;
    if (windowWidth < 1024) return baseSize * 0.9;
    return baseSize;
  };
  
  // 计算小屏幕下的图标和文字大小
  const getNodeSize = () => {
    if (windowWidth < 480) return 'w-8 h-8';
    if (windowWidth < 768) return 'w-10 h-10';
    return 'w-12 h-12';
  };
  
  return (
    <div 
      ref={containerRef}
      className={cn("relative w-full h-[500px] md:h-[500px] sm:h-[400px] xs:h-[350px] flex items-center justify-center", className)}
      // 移除容器的鼠标事件
    >
      {/* 主要轨道 - 增加透明渐变效果，响应式大小 */}
      <div className="absolute rounded-full border-2 border-indigo-300/30 dark:border-purple-500/30 bg-indigo-50/10 dark:bg-purple-900/10" 
        style={{
          width: `${getResponsiveTrackSize(240)}px`,
          height: `${getResponsiveTrackSize(240)}px`
        }}
      />
      <div className="absolute rounded-full border-2 border-indigo-300/30 dark:border-purple-500/30 bg-indigo-50/5 dark:bg-purple-900/5" 
        style={{
          width: `${getResponsiveTrackSize(440)}px`,
          height: `${getResponsiveTrackSize(440)}px`
        }}
      />
      
      {/* 中心节点 - 响应式大小 */}
      <div 
        className={cn(
          "absolute z-20 flex items-center justify-center bg-white dark:bg-purple-900/80 shadow-lg rounded-full transition-all duration-300 hover:scale-110",
          windowWidth < 480 ? "w-14 h-14 p-2" : windowWidth < 768 ? "w-16 h-16 p-2" : "w-20 h-20 p-3"
        )}
        style={{
          boxShadow: "0 0 20px rgba(139, 92, 246, 0.3)",
        }}
      >
        {typeof centerNode.icon === 'string' ? (
          <Image
            src={centerNode.icon}
            alt={centerNode.name}
            width={windowWidth < 480 ? 32 : windowWidth < 768 ? 40 : 48}
            height={windowWidth < 480 ? 32 : windowWidth < 768 ? 40 : 48}
            className="object-contain"
          />
        ) : centerNode.icon ? (
          <div className={cn(
            "text-indigo-500 dark:text-purple-300",
            windowWidth < 480 ? "text-xl" : windowWidth < 768 ? "text-2xl" : "text-3xl"
          )}>
            {centerNode.icon}
          </div>
        ) : (
          <div className={cn(
            "text-indigo-600 dark:text-purple-300 font-bold text-center",
            windowWidth < 480 ? "text-sm" : windowWidth < 768 ? "text-base" : "text-lg"
          )}>
            {centerNode.name}
          </div>
        )}
      </div>
      
      {/* 技能节点 */}
      {skillsWithPositions.map((skill, index) => {
        const isHovered = hoveredSkill === skill.name
        const isInnerCircle = index < Math.ceil(skills.length / 2)
        
        // 应用旋转，使用CSS变换进行平滑插值
        const rotationAngle = alternateDirection && isInnerCircle 
          ? -rotation 
          : rotation
        
        // 计算旋转后的位置
        let x = 0, y = 0
        if (skill.position) {
          const angle = Math.atan2(skill.position.y, skill.position.x) + rotationAngle
          const radius = Math.sqrt(Math.pow(skill.position.x, 2) + Math.pow(skill.position.y, 2))
          x = Math.cos(angle) * radius
          y = Math.sin(angle) * radius
        }
        
        return (
          <div
            key={skill.name}
            className="absolute z-10 flex flex-col items-center"
            style={{
              transform: `translate(${x}px, ${y}px)`,
              transition: "transform 0.5s cubic-bezier(0.17, 0.67, 0.41, 0.99)", // 使用更平滑的贝塞尔曲线
              willChange: "transform", // 性能优化
              transformStyle: "preserve-3d", // 提高GPU渲染性能
              backfaceVisibility: "hidden" // 防止回流问题
            }}
            onMouseEnter={() => handleSkillMouseEnter(skill.name)}
            onMouseLeave={handleSkillMouseLeave}
          >
            {/* 图标带白色背景 - 响应式大小 */}
            <div className={cn(
              "flex items-center justify-center bg-white rounded-full shadow-md cursor-pointer",
              isHovered ? "scale-110 ring-2 ring-indigo-500 dark:ring-purple-400" : "scale-100 hover:ring-1 hover:ring-indigo-300 dark:hover:ring-purple-500/50",
              "transition-all duration-200",
              windowWidth < 480 ? "w-8 h-8" : windowWidth < 768 ? "w-10 h-10" : "w-12 h-12"
            )}>
              {typeof skill.icon === 'string' ? (
                <Image 
                  src={skill.icon} 
                  alt={skill.name} 
                  width={windowWidth < 480 ? 16 : windowWidth < 768 ? 20 : 24}
                  height={windowWidth < 480 ? 16 : windowWidth < 768 ? 20 : 24}
                  className="object-contain"
                />
              ) : skill.icon ? (
                <div className={cn(
                  windowWidth < 480 ? "text-base" : windowWidth < 768 ? "text-lg" : "text-xl",
                  isHovered ? "text-indigo-600 dark:text-purple-400" : "text-indigo-500 dark:text-purple-300"
                )}>
                  {skill.icon}
                </div>
              ) : (
                <Badge className="bg-indigo-100/70 dark:bg-purple-600/40 text-indigo-700 dark:text-purple-100 border-none text-xs">
                  {skill.name}
                </Badge>
              )}
            </div>
            
            {/* 技能名称显示在下方，带有渐变效果 - 响应式文字大小 */}
            <div className={cn(
              "mt-1 px-2 py-0.5 rounded-full text-center font-medium transition-all duration-200",
              isHovered 
                ? `${windowWidth < 480 ? "text-xs" : "text-sm"} bg-indigo-100/80 dark:bg-purple-900/50 text-indigo-700 dark:text-white` 
                : `${windowWidth < 480 ? "text-[10px]" : "text-xs"} text-gray-800 dark:text-gray-200`
            )}>
              {skill.name}
            </div>
          </div>
        )
      })}
    </div>
  )
} 