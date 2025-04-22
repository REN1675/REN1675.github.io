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
  
  // 计算位置
  useEffect(() => {
    const totalSkills = skills.length
    const halfSkills = Math.ceil(totalSkills / 2)
    
    // 将技能分成两个圆环
    const skillsWithPos = skills.map((skill, index) => {
      // 为每个技能分配一个环绕角度
      const angle = (index < halfSkills) 
        ? (index * (2 * Math.PI / halfSkills)) 
        : ((index - halfSkills) * (2 * Math.PI / (totalSkills - halfSkills)))
      
      // 确定该技能在内环还是外环
      const radius = index < halfSkills ? innerRadius : outerRadius
      
      // 计算位置
      const x = Math.cos(angle) * radius
      const y = Math.sin(angle) * radius
      
      return {
        ...skill,
        position: { x, y }
      }
    })
    
    setSkillsWithPositions(skillsWithPos)
  }, [skills, innerRadius, outerRadius])
  
  // 优化后的动画旋转，使用requestAnimationFrame的时间参数
  useEffect(() => {
    let rotationValue = rotation
    
    const animate = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp
      
      // 计算帧间时间差，确保在不同设备/浏览器上保持一致的旋转速度
      const deltaTime = timestamp - lastTimeRef.current
      rotationValue += rotationSpeed * (deltaTime / 16.66) // 基于60fps标准化速度
      
      lastTimeRef.current = timestamp
      setRotation(rotationValue)
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
  
  return (
    <div 
      ref={containerRef}
      className={cn("relative w-full h-[500px] flex items-center justify-center", className)}
      // 移除容器的鼠标事件
    >
      {/* 主要轨道 - 增加透明渐变效果 */}
      <div className="absolute w-[240px] h-[240px] rounded-full border-2 border-indigo-300/30 dark:border-purple-500/30 bg-indigo-50/10 dark:bg-purple-900/10" />
      <div className="absolute w-[440px] h-[440px] rounded-full border-2 border-indigo-300/30 dark:border-purple-500/30 bg-indigo-50/5 dark:bg-purple-900/5" />
      
      {/* 中心节点 */}
      <div 
        className="absolute z-20 flex items-center justify-center bg-white dark:bg-purple-900/80 shadow-lg rounded-full p-3 w-20 h-20 transition-all duration-300 hover:scale-110" 
        style={{
          boxShadow: "0 0 20px rgba(139, 92, 246, 0.3)",
        }}
      >
        {typeof centerNode.icon === 'string' ? (
          <Image
            src={centerNode.icon}
            alt={centerNode.name}
            width={48}
            height={48}
            className="object-contain"
          />
        ) : centerNode.icon ? (
          <div className="text-indigo-500 dark:text-purple-300 text-3xl">{centerNode.icon}</div>
        ) : (
          <div className="text-indigo-600 dark:text-purple-300 font-bold text-lg text-center">{centerNode.name}</div>
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
            className="absolute z-10 flex flex-col items-center transition-all duration-300"
            style={{
              transform: `translate(${x}px, ${y}px)`,
              transition: "transform 0.3s cubic-bezier(0.25, 0.1, 0.25, 1.0)", // 添加平滑过渡
              willChange: "transform" // 性能优化，告知浏览器元素将被频繁变换
            }}
            onMouseEnter={() => handleSkillMouseEnter(skill.name)}
            onMouseLeave={handleSkillMouseLeave}
          >
            {/* 图标带白色背景 */}
            <div className={cn(
              "flex items-center justify-center bg-white dark:bg-gray-800 rounded-full shadow-md w-12 h-12 cursor-pointer",
              isHovered ? "scale-110 ring-2 ring-indigo-500 dark:ring-purple-400" : "scale-100 hover:ring-1 hover:ring-indigo-300 dark:hover:ring-purple-500/50",
              "transition-all duration-200"
            )}>
              {typeof skill.icon === 'string' ? (
                <Image 
                  src={skill.icon} 
                  alt={skill.name} 
                  width={24}
                  height={24}
                  className="object-contain"
                />
              ) : skill.icon ? (
                <div className={cn(
                  "text-xl",
                  isHovered ? "text-indigo-600 dark:text-purple-400" : "text-indigo-500 dark:text-purple-300"
                )}>
                  {skill.icon}
                </div>
              ) : (
                <Badge className="bg-indigo-100/70 dark:bg-purple-600/40 text-indigo-700 dark:text-purple-100 border-none">
                  {skill.name}
                </Badge>
              )}
            </div>
            
            {/* 技能名称显示在下方，带有渐变效果 */}
            <div className={cn(
              "mt-1 px-2 py-0.5 rounded-full text-center font-medium transition-all duration-200",
              isHovered ? "text-sm bg-indigo-100/80 dark:bg-purple-900/50 text-indigo-700 dark:text-white" : "text-xs text-gray-800 dark:text-gray-200"
            )}>
              {skill.name}
            </div>
          </div>
        )
      })}
    </div>
  )
} 