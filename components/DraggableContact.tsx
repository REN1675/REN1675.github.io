'use client'

import React, { useState, useRef, useEffect } from 'react'
import { ChevronRight, Mail, Phone } from 'lucide-react'
import Image from 'next/image'

interface ContactMethod {
  icon: React.ReactNode | string
  label: string
  value: string
  href: string
  type: 'phone' | 'email' | 'github' | 'location'
  color: string
}

const DraggableContact: React.FC = () => {
  const [isDragging, setIsDragging] = useState(false)
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 })
  const [initialPosition, setInitialPosition] = useState({ x: 0, y: 0 })
  const [isReturning, setIsReturning] = useState(false)
  const [isScrolling, setIsScrolling] = useState(false)
  const phoneRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const lineRef = useRef<SVGPathElement>(null)
  const cursorRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const contactMeRef = useRef<HTMLHeadingElement>(null)
  const aLetterRef = useRef<DOMRect | null>(null)
  
  // 联系方式数据
  const contactMethods: ContactMethod[] = [
    {
      icon: <Mail className="h-10 w-10" />,
      label: '电子邮箱',
      value: '1159680834@qq.com',
      href: 'mailto:1159680834@qq.com',
      type: 'email',
      color: '#3B82F6'
    },
    {
      icon: <Phone className="h-10 w-10" />,
      label: '电话',
      value: '+86 150-3542-1059',
      href: 'tel:15035421059',
      type: 'phone',
      color: '#0DD3CA'
    },
    {
      icon: (
        <svg
          viewBox="0 0 24 24"
          className="h-10 w-10"
          fill="currentColor"
        >
          <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.463 2 11.97c0 4.404 2.865 8.14 6.839 9.458.5.092.682-.216.682-.48 0-.236-.008-.864-.013-1.695-2.782.602-3.369-1.337-3.369-1.337-.454-1.151-1.11-1.458-1.11-1.458-.908-.618.069-.606.069-.606 1.003.07 1.531 1.027 1.531 1.027.892 1.524 2.341 1.084 2.91.828.092-.643.35-1.083.636-1.332-2.22-.251-4.555-1.107-4.555-4.927 0-1.088.39-1.979 1.029-2.675-.103-.252-.446-1.266.098-2.638 0 0 .84-.268 2.75 1.022A9.607 9.607 0 0112 6.82c.85.004 1.705.114 2.504.336 1.909-1.29 2.747-1.022 2.747-1.022.546 1.372.202 2.386.1 2.638.64.696 1.028 1.587 1.028 2.675 0 3.83-2.339 4.673-4.566 4.92.359.307.678.915.678 1.846 0 1.332-.012 2.407-.012 2.734 0 .267.18.577.688.48 3.97-1.32 6.833-5.054 6.833-9.458C22 6.463 17.522 2 12 2z" />
        </svg>
      ),
      label: 'GitHub',
      value: 'github.com/REN1675',
      href: 'https://github.com/REN1675/REN1675.github.io',
      type: 'github',
      color: '#6366F1'
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      label: '当前所在地',
      value: '山西省 大同市',
      href: '#',
      type: 'location',
      color: '#EC4899'
    }
  ]

  // 添加自动调整标题大小的效果
  useEffect(() => {
    const adjustTitleSize = () => {
      if (contactMeRef.current && containerRef.current) {
        const titleElement = contactMeRef.current;
        const containerWidth = containerRef.current.offsetWidth;
        const titleWidth = titleElement.scrollWidth;
        
        // 计算缩放比例，保证标题在容器内完全可见
        // 添加一个小的安全边距 (0.95)
        let scale = (containerWidth / titleWidth) * 0.95; 
        
        // 限制最小和最大缩放
        scale = Math.max(0.4, Math.min(scale, 1)); 
        
        // 应用缩放
        titleElement.style.setProperty('--title-scale', scale.toString());
      }
    };
    
    // 初始调整
    adjustTitleSize();
    
    // 窗口大小变化时重新调整
    window.addEventListener('resize', adjustTitleSize);
    
    return () => {
      window.removeEventListener('resize', adjustTitleSize);
    };
  }, []);

  // 找到标题位置的函数
  useEffect(() => {
    const findTitleCenterPosition = () => {
      if (contactMeRef.current && containerRef.current) {
        // 获取标题元素
        const title = contactMeRef.current;
        const titleRect = title.getBoundingClientRect();
        
        // 获取A字母的位置（大约是标题宽度的48%处）
        const titleWidth = titleRect.width;
        const aLetterX = titleRect.left + titleWidth * 0.48; // 改为0.48, 对应标题中的A字母
        const letterY = titleRect.top + titleRect.height * 0.5; // 垂直中心
        
        // 记录A字母位置作为电话线起点
        aLetterRef.current = new DOMRect(aLetterX, letterY, 0, 0);
        
        // 更新电话图标位置和电话线
        if (phoneRef.current) {
          const phoneRect = phoneRef.current.getBoundingClientRect();
          setInitialPosition({
            x: phoneRect.left + phoneRect.width / 2,
            y: phoneRect.top + phoneRect.height / 2
          });
          
          // 延时调用确保状态已更新
          setTimeout(() => {
            forceSetPhoneLine(); // 使用forceSetPhoneLine替代updatePhoneLine
          }, 0);
        }
      } else {
        console.log('找不到标题元素');
      }
    };
    
    // 确保在DOM渲染完成并应用了样式后计算
    setTimeout(findTitleCenterPosition, 500);
    
    // 监听窗口大小变化，重新计算位置
    window.addEventListener('resize', findTitleCenterPosition);
    window.addEventListener('scroll', () => {
      findTitleCenterPosition(); // 滚动时重新计算所有位置
    });
    
    return () => {
      window.removeEventListener('resize', findTitleCenterPosition);
      window.removeEventListener('scroll', findTitleCenterPosition);
    };
  }, []);

  // 处理电话拖拽逻辑 - 确保在所有可能更新电话线的地方使用forceSetPhoneLine
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && phoneRef.current) {
        // 更新拖拽位置
        const newPosition = { x: e.clientX, y: e.clientY };
        setDragPosition(newPosition);
        
        // 移动电话图标
        movePhone(newPosition.x, newPosition.y);
        
        // 检查是否拖到底部触发回到顶部
        const windowHeight = window.innerHeight;
        const threshold = windowHeight * 0.9; // 页面90%的位置
        
        if (e.clientY > threshold) {
          releaseDrag();
          setIsScrolling(true);
          
          // 平滑滚动到顶部
          window.scrollTo({ top: 0, behavior: 'smooth' });
          
          // 滚动完成后恢复电话位置
          setTimeout(() => {
            setIsScrolling(false);
            returnToInitialPosition(true);
          }, 1000);
        }
      }
    };

    const handleMouseUp = () => {
      if (isDragging) {
        releaseDrag();
        returnToInitialPosition();
      }
    };

    // 为触摸设备添加事件处理
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches && e.touches[0] && isDragging) {
        e.preventDefault(); // 防止页面滚动
        const touch = e.touches[0];
        
        // 更新拖拽位置
        const newPosition = { x: touch.clientX, y: touch.clientY };
        setDragPosition(newPosition);
        
        // 移动电话图标
        movePhone(newPosition.x, newPosition.y);
        
        // 检查是否拖到底部触发回到顶部
        const windowHeight = window.innerHeight;
        const threshold = windowHeight * 0.9;
        
        if (touch.clientY > threshold) {
          releaseDrag();
          setIsScrolling(true);
          
          window.scrollTo({ top: 0, behavior: 'smooth' });
          
          setTimeout(() => {
            setIsScrolling(false);
            returnToInitialPosition(true);
          }, 1000);
        }
      }
    };

    // 添加事件监听
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging]);

  // 开始拖拽
  const startDrag = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    
    let clientX, clientY;
    
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    setIsDragging(true);
    setDragPosition({ x: clientX, y: clientY });
    
    // 重要：记录初始位置，这对于准确计算拖拽偏移至关重要
    if (phoneRef.current) {
      const rect = phoneRef.current.getBoundingClientRect();
      setInitialPosition({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
      });
    }
  };

  // 释放拖拽
  const releaseDrag = () => {
    setIsDragging(false);
  };

  // 移动电话
  const movePhone = (x: number, y: number) => {
    if (phoneRef.current && initialPosition.x && initialPosition.y) {
      const deltaX = x - initialPosition.x;
      const deltaY = y - initialPosition.y;
      phoneRef.current.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
      
      // 移动后立即更新电话线，确保实时跟踪
      requestAnimationFrame(forceSetPhoneLine);
    }
  };

  // 添加直接强制设置电话线的函数（绕过updatePhoneLine中的逻辑）
  const forceSetPhoneLine = () => {
    if (!lineRef.current || !contactMeRef.current || !phoneRef.current) return;
    
    try {
      // 获取CONTACT ME标题的位置
      const titleRect = contactMeRef.current.getBoundingClientRect();
      // 获取电话图标的位置
      const phoneRect = phoneRef.current.getBoundingClientRect();
      // 获取容器位置
      const containerRect = containerRef.current?.getBoundingClientRect() || new DOMRect(0, 0, 0, 0);
      
      // 计算相对于容器的坐标
      // 线条起点 - "CONTACT ME"标题中的"A"字母位置
      const startX = titleRect.left - containerRect.left + titleRect.width * 0.48; // A字母中心位置
      const startY = titleRect.top - containerRect.top + titleRect.height * 0.5; // 垂直中心
      
      // 线条终点 - 电话图标位置 - 使用固定偏移确保一致性
      // 始终连接到电话图标正中心，无论它如何变换
      const endX = phoneRect.left - containerRect.left + phoneRect.width * 0.5;
      const endY = phoneRect.top - containerRect.top + phoneRect.height * 0.5;
      
      // 计算垂下的曲线控制点
      // 使用更明显的下垂效果
      const controlPoint1X = startX + (endX - startX) * 0.2;
      const controlPoint1Y = startY + Math.max(100, (endY - startY) * 0.4);
      
      const controlPoint2X = startX + (endX - startX) * 0.8;
      const controlPoint2Y = endY - 30;
      
      // 绘制贝塞尔曲线
      const path = `M${startX},${startY} C${controlPoint1X},${controlPoint1Y} ${controlPoint2X},${controlPoint2Y} ${endX},${endY}`;
      
      // 设置路径
      if (lineRef.current) {
        lineRef.current.setAttribute('d', path);
        lineRef.current.setAttribute('stroke', '#0DD3CA');
        lineRef.current.setAttribute('stroke-width', '2.5');
        lineRef.current.setAttribute('stroke-dasharray', '4 2');
        lineRef.current.style.opacity = '1';
      }
    } catch (error) {
      console.error('设置电话线出错:', error);
    }
  };
  
  // 组件每次渲染后都尝试更新电话线
  useEffect(() => {
    // 短暂延迟，确保所有元素都已渲染完成
    const timer = setTimeout(() => {
      forceSetPhoneLine();
    }, 500);
    
    return () => clearTimeout(timer);
  });
  
  // 添加滚动监听和调整大小监听
  useEffect(() => {
    const handleUpdate = () => {
      // 仅在非拖拽和非返回状态下更新
      if (!isDragging && !isReturning) {
        forceSetPhoneLine();
      }
    };
    
    // 监听事件
    window.addEventListener('resize', handleUpdate);
    window.addEventListener('scroll', handleUpdate);
    window.addEventListener('load', handleUpdate);
    
    // 初始次数有限的间隔刷新
    let count = 0;
    const interval = setInterval(() => {
      // 仅在非拖拽和非返回状态下更新
      if (!isDragging && !isReturning) {
        forceSetPhoneLine();
      }
      count++;
      if (count >= 5) clearInterval(interval);
    }, 500);
    
    return () => {
      window.removeEventListener('resize', handleUpdate);
      window.removeEventListener('scroll', handleUpdate);
      window.removeEventListener('load', handleUpdate);
      clearInterval(interval);
    };
  }, [isDragging, isReturning]);

  // 重写updatePhoneLine函数，直接使用forceSetPhoneLine
  const updatePhoneLine = () => {
    forceSetPhoneLine();
  };

  // 返回初始位置
  const returnToInitialPosition = (immediate = false) => {
    if (phoneRef.current) {
      setIsReturning(true);
      
      // 设置过渡动画
      const duration = immediate ? 300 : 600;
      const easing = immediate ? 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'cubic-bezier(0.68, -0.6, 0.32, 1.6)';
      phoneRef.current.style.transition = `transform ${duration}ms ${easing}`;
      
      // 确保返回准确的原始位置
      phoneRef.current.style.transform = 'translate(0, 0)';
      
      // 在动画过程中持续更新电话线位置，确保电话线跟随平滑
      const startTime = Date.now();
      const updateDuringAnimation = () => {
        const elapsedTime = Date.now() - startTime;
        if (elapsedTime <= duration) {
          // 更新电话线
          forceSetPhoneLine();
          // 继续下一帧更新
          requestAnimationFrame(updateDuringAnimation);
        } else {
          // 动画结束，强制设置回初始状态
          if (phoneRef.current) {
            // 确保变换真正结束
            phoneRef.current.style.transition = '';
            phoneRef.current.style.transform = 'translate(0, 0)';
            
            // 延迟一帧再更新电话线，确保DOM已更新
            requestAnimationFrame(() => {
              forceSetPhoneLine();
              setIsReturning(false);
            });
          }
        }
      };
      
      // 启动动画帧更新
      requestAnimationFrame(updateDuringAnimation);
    }
  };

  // 确保组件加载后电话线正确连接到初始位置的电话图标
  useEffect(() => {
    // 组件加载后设置初始电话线位置
    const setInitialPhoneLine = () => {
      // 确保电话图标在原始位置
      if (phoneRef.current) {
        phoneRef.current.style.transform = 'translate(0, 0)';
      }
      
      // 设置电话线
      forceSetPhoneLine();
    };
    
    // DOM完全加载后执行
    if (document.readyState === 'complete') {
      setInitialPhoneLine();
    } else {
      window.addEventListener('load', setInitialPhoneLine);
      return () => window.removeEventListener('load', setInitialPhoneLine);
    }
  }, []);

  // 处理电话点击
  const handlePhoneClick = (e: React.MouseEvent) => {
    if (!isDragging && !isReturning) {
      window.location.href = 'tel:15035421059';
    }
  };

  // 组件加载后强制更新电话线
  useEffect(() => {
    const timer = setTimeout(() => {
      forceSetPhoneLine();
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  // 添加专门用于修复电话线颜色问题的效果
  useEffect(() => {
    // 强制设置电话线颜色为青绿色
    const forceLineColor = () => {
      if (lineRef.current) {
        lineRef.current.setAttribute('stroke', '#0DD3CA');
      }
    };
    
    // 在可能触发颜色变化的场景下执行
    window.addEventListener('resize', forceLineColor);
    window.addEventListener('scroll', forceLineColor);
    
    // 初始执行
    forceLineColor();
    
    // 设置持续检查
    const interval = setInterval(forceLineColor, 200);
    
    return () => {
      window.removeEventListener('resize', forceLineColor);
      window.removeEventListener('scroll', forceLineColor);
      clearInterval(interval);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full max-w-5xl mx-auto">
      {/* SVG层用于绘制电话线 - 修改为绝对定位，但不撑开页面布局 */}
      <div className="absolute top-0 left-0 w-full pointer-events-none z-30" style={{ height: "100%", position: "absolute" }}>
        <svg width="100%" height="100%" className="overflow-visible" style={{transform: 'translateZ(0)'}}>
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="1" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <path
            ref={lineRef}
            d="M0,0 Q0,0 0,0"
            fill="none"
            stroke="#0DD3CA"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="3 3"
            filter="url(#glow)"
            style={{ opacity: 0 }}
          />
        </svg>
      </div>
      
      {/* CONTACT ME 大文字 */}
      <div className="flex justify-center items-center mb-16 relative w-full">
        <div className="relative inline-block">
          <h2 
            ref={contactMeRef}
            className="text-7xl sm:text-8xl md:text-[10rem] lg:text-[12rem] font-black text-indigo-600 dark:text-purple-400 whitespace-nowrap"
            style={{ 
              transform: 'scale(var(--title-scale, 0.9))', 
              transformOrigin: 'center center',
            }}
          >
            CONTACT ME
          </h2>
          
          {/* 邮件图标 */}
          <div className="absolute left-[30%] -top-2 transform rotate-12 animate-float-slow">
            {contactMethods[0].icon && (
              <a 
                href={contactMethods[0].href}
                className="cursor-pointer hover:scale-110 transition-transform duration-300 block"
              >
                <div className="text-5xl md:text-6xl lg:text-7xl" style={{ color: contactMethods[0].color }}>
                  {contactMethods[0].icon}
                </div>
              </a>
            )}
          </div>
          
          {/* 可拖拽电话图标 */}
          <div 
            ref={phoneRef}
            className={`absolute bottom-[-90px] sm:bottom-[-70px] md:bottom-[-60px] left-[35%] sm:left-[40%] md:left-[45%] transform -translate-x-1/2 z-30 cursor-grab ${isDragging ? 'cursor-grabbing' : ''}`}
            onMouseDown={startDrag}
            onTouchStart={startDrag}
            onClick={handlePhoneClick}
          >
            <div className="relative group">
              {/* 电话图标闪烁效果 */}
              <div className="absolute inset-0 bg-cyan-500/30 rounded-full scale-110 group-hover:scale-125 animate-ping-slow"></div>
              
              {/* 电话图标 */}
              <div className="relative text-5xl md:text-6xl lg:text-7xl" style={{ color: '#0DD3CA' }}>
                {contactMethods[1].icon}
              </div>
              
              {/* 拖拽提示 */}
              <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-xs opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800/80 text-white px-2 py-1 rounded">
                拖拽到底部回顶部
              </span>
            </div>
          </div>
          
          {/* GitHub图标 */}
          <div className="absolute left-[10%] top-1/2 transform rotate-6 animate-float-slow">
            {contactMethods[2].icon && (
              <a 
                href={contactMethods[2].href}
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer hover:scale-110 transition-transform duration-300 block"
              >
                <div className="text-5xl md:text-6xl lg:text-7xl" style={{ color: contactMethods[2].color }}>
                  {contactMethods[2].icon}
                </div>
              </a>
            )}
          </div>
          
          {/* 定位图标 */}
          <div className="absolute right-[9%] bottom-4 transform rotate-6 animate-float-slow">
            {contactMethods[3].icon && (
              <a 
                href={contactMethods[3].href}
                className="cursor-pointer hover:scale-110 transition-transform duration-300 block"
              >
                <div className="text-5xl md:text-6xl lg:text-7xl" style={{ color: contactMethods[3].color }}>
                  {contactMethods[3].icon}
                </div>
              </a>
            )}
          </div>
        </div>
      </div>
      
      {/* 联系方式卡片 */}
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {contactMethods.map((contact, index) => (
            <a
              key={index}
              href={contact.href}
              target={contact.type === 'github' ? '_blank' : undefined}
              rel={contact.type === 'github' ? 'noopener noreferrer' : undefined}
              className="flex items-center p-3 md:p-4 rounded-xl bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700 group"
              style={{ color: contact.color }}
            >
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-lg mr-3 md:mr-4 flex items-center justify-center flex-shrink-0">
                <div className="text-xl md:text-2xl">{contact.icon}</div>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-base md:text-lg font-bold mb-0.5 truncate text-gray-900 dark:text-white">{contact.label}</h3>
                <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 group-hover:underline flex items-center truncate">
                  {contact.value}
                  <ChevronRight className="ml-1 h-3 w-3 md:h-4 md:w-4 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DraggableContact 