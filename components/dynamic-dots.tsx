"use client"

import { useEffect, useRef } from 'react'

interface Dot {
  el: SVGCircleElement
  anchor: { x: number; y: number }
  position: { x: number; y: number }
  smooth: { x: number; y: number }
  velocity: { x: number; y: number }
  move: { x: number; y: number }
}

interface MouseState {
  x: number
  y: number
  prevX: number
  prevY: number
  speed: number
  isActive: boolean
  inContainer: boolean
}

interface CircleConfig {
  radius: number
  margin: number
}

export function DynamicDots() {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const dotsRef = useRef<Dot[]>([])
  const mouseRef = useRef<MouseState>({
    x: 0,
    y: 0,
    prevX: 0,
    prevY: 0,
    speed: 0,
    isActive: false,
    inContainer: false
  })
  const animationRef = useRef<number | null>(null)
  
  const circleConfig: CircleConfig = {
    radius: 3,
    margin: 16
  }

  // 处理鼠标移动
  const handleMouseMove = (e: MouseEvent) => {
    if (!containerRef.current || !svgRef.current) return
    
    // 保存全局鼠标位置
    mouseRef.current.x = e.clientX
    mouseRef.current.y = e.clientY
    
    // 获取容器位置
    const container = containerRef.current.closest('.image-container')
    if (!container) return
    
    const containerRect = container.getBoundingClientRect()
    
    // 检测鼠标是否在容器内或附近
    const expandedBounds = {
      left: containerRect.left - 100,
      right: containerRect.right + 100,
      top: containerRect.top - 100,
      bottom: containerRect.bottom + 100
    }
    
    const isNearContainer = 
      e.clientX >= expandedBounds.left && 
      e.clientX <= expandedBounds.right && 
      e.clientY >= expandedBounds.top && 
      e.clientY <= expandedBounds.bottom
    
    mouseRef.current.isActive = isNearContainer
    
    // 检测鼠标是否在容器内，用于直接计算相对位置
    const isInContainer = 
      e.clientX >= containerRect.left && 
      e.clientX <= containerRect.right && 
      e.clientY >= containerRect.top && 
      e.clientY <= containerRect.bottom
    
    mouseRef.current.inContainer = isInContainer
  }
  
  // 处理鼠标离开
  const handleMouseLeave = () => {
    mouseRef.current.isActive = false
    mouseRef.current.inContainer = false
  }

  // 计算鼠标速度
  const calculateMouseSpeed = () => {
    const mouse = mouseRef.current
    const distX = mouse.prevX - mouse.x
    const distY = mouse.prevY - mouse.y
    const dist = Math.hypot(distX, distY)

    mouse.speed += (dist - mouse.speed) * 0.6
    if (mouse.speed < 0.001) {
      mouse.speed = 0
    }

    mouse.prevX = mouse.x
    mouse.prevY = mouse.y
    
    setTimeout(calculateMouseSpeed, 16)
  }

  // 创建点阵
  const createDots = () => {
    if (!svgRef.current) return
    
    const svg = svgRef.current
    const bounding = svg.getBoundingClientRect()
    const svgWidth = bounding.width
    const svgHeight = bounding.height
    
    // 清除之前的点
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild)
    }
    dotsRef.current = []
    
    const dotSize = circleConfig.radius + circleConfig.margin
    const rows = Math.floor(svgHeight / dotSize)
    const cols = Math.floor(svgWidth / dotSize)
    
    const x = ((svgWidth % dotSize) / 2)
    const y = ((svgHeight % dotSize) / 2)
    
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const anchorX = x + (col * dotSize) + (dotSize / 2)
        const anchorY = y + (row * dotSize) + (dotSize / 2)
        
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
        circle.setAttribute('cx', anchorX.toString())
        circle.setAttribute('cy', anchorY.toString())
        circle.setAttribute('r', (circleConfig.radius / 2).toString())
        
        svg.appendChild(circle)
        
        const dot: Dot = {
          el: circle,
          anchor: { x: anchorX, y: anchorY },
          position: { x: anchorX, y: anchorY },
          smooth: { x: anchorX, y: anchorY },
          velocity: { x: 0, y: 0 },
          move: { x: 0, y: 0 }
        }
        
        dotsRef.current.push(dot)
      }
    }
  }
  
  // 动画帧
  const tick = () => {
    if (!svgRef.current || !containerRef.current) return
    
    const container = containerRef.current.closest('.image-container')
    if (!container) {
      animationRef.current = requestAnimationFrame(tick)
      return
    }
    
    const containerRect = container.getBoundingClientRect()
    const svgRect = svgRef.current.getBoundingClientRect()
    
    // 只有当鼠标活跃时才计算交互效果
    if (mouseRef.current.isActive) {
      let mouseX, mouseY;
      
      // 当鼠标在容器内时使用相对于容器的位置
      if (mouseRef.current.inContainer) {
        mouseX = mouseRef.current.x - containerRect.left
        mouseY = mouseRef.current.y - containerRect.top
      } else {
        // 在容器外时，计算最近的投影点
        mouseX = Math.max(0, Math.min(containerRect.width, mouseRef.current.x - containerRect.left))
        mouseY = Math.max(0, Math.min(containerRect.height, mouseRef.current.y - containerRect.top))
      }
      
      // 对每个点计算受力情况
      dotsRef.current.forEach(dot => {
        // 这里的坐标是点相对于SVG左上角的偏移
        // 我们需要直接计算鼠标与点之间的相对距离
        const distX = mouseX - dot.position.x
        const distY = mouseY - dot.position.y
        const dist = Math.max(Math.hypot(distX, distY), 1)
        
        // 计算点应该移动的方向和强度
        const angle = Math.atan2(distY, distX)
        
        // 根据距离调整力度
        let force = 0
        const influenceRadius = 180 // 鼠标影响半径
        
        if (dist < influenceRadius) {
          // 指数衰减效果，靠近鼠标效果更明显
          force = Math.pow(1 - dist / influenceRadius, 2) * 4
          
          // 向鼠标反方向施加力
          dot.velocity.x += Math.cos(angle) * -force
          dot.velocity.y += Math.sin(angle) * -force
          
          // 对于非常接近的点，添加一些随机性
          if (dist < 40) {
            dot.velocity.x += (Math.random() - 0.5) * 0.8
            dot.velocity.y += (Math.random() - 0.5) * 0.8
          }
        }
      })
    }
    
    // 更新所有点的位置
    dotsRef.current.forEach(dot => {
      // 添加摩擦力
      dot.velocity.x *= 0.92
      dot.velocity.y *= 0.92
      
      // 向锚点位置的回弹力
      const springFactor = 0.08
      dot.velocity.x += (dot.anchor.x - dot.position.x) * springFactor
      dot.velocity.y += (dot.anchor.y - dot.position.y) * springFactor
      
      // 更新位置
      dot.position.x += dot.velocity.x
      dot.position.y += dot.velocity.y
      
      // 平滑过渡
      dot.smooth.x += (dot.position.x - dot.smooth.x) * 0.2
      dot.smooth.y += (dot.position.y - dot.smooth.y) * 0.2
      
      // 更新DOM
      dot.el.setAttribute('cx', dot.smooth.x.toString())
      dot.el.setAttribute('cy', dot.smooth.y.toString())
      
      // 根据速度调整点的大小
      const speed = Math.hypot(dot.velocity.x, dot.velocity.y)
      const baseSize = circleConfig.radius / 2
      const maxSizeIncrease = 2
      const newSize = baseSize + Math.min(speed * 0.8, maxSizeIncrease)
      dot.el.setAttribute('r', newSize.toString())
    })
    
    animationRef.current = requestAnimationFrame(tick)
  }
  
  // 处理窗口大小变化
  const handleResize = () => {
    createDots()
  }
  
  useEffect(() => {
    // 添加事件监听
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseleave', handleMouseLeave)
    window.addEventListener('resize', handleResize)
    
    // 组件挂载后才能操作DOM
    if (svgRef.current) {
      // 初始化
      createDots()
      calculateMouseSpeed()
      animationRef.current = requestAnimationFrame(tick)
    }
    
    // 清理函数
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
      window.removeEventListener('resize', handleResize)
      
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])
  
  return (
    <div ref={containerRef} className="w-full h-full">
      <svg 
        ref={svgRef} 
        className="absolute inset-0 w-full h-full overflow-visible"
        style={{ overflow: 'visible' }}
      ></svg>
    </div>
  )
} 