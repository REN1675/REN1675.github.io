'use client';

import React, { useEffect, useState, useRef } from 'react';

const GrowingPlant: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const animationRef = useRef<number | null>(null);
  const wasScrollingRef = useRef(false);
  const lastScrollY = useRef(0);
  const svgRef = useRef<SVGSVGElement>(null);
  
  // 使用防抖函数来避免过多的重渲染
  const debounce = (fn: Function, ms = 100) => {
    let timeoutId: ReturnType<typeof setTimeout>;
    return function(...args: any[]) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn(...args), ms);
    };
  };

  useEffect(() => {
    // 更新滚动进度的函数
    const updateScrollProgress = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      
      // 防止除以零
      if (documentHeight <= windowHeight) {
        setScrollProgress(0);
        return;
      }
      
      // 计算滚动进度，范围从0到1
      const progress = scrollTop / (documentHeight - windowHeight);
      setScrollProgress(Math.min(Math.max(0, progress), 1));
      
      // 标记正在滚动
      wasScrollingRef.current = true;
      lastScrollY.current = scrollTop;
      
      // 如果存在先前的动画帧请求，则取消它
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
      
      // 设置新的动画帧，确保UI更新是平滑的
      animationRef.current = requestAnimationFrame(() => {
        animationRef.current = null;
      });
    };
    
    // 滚动停止检测
    const scrollStopDetection = debounce(() => {
      wasScrollingRef.current = false;
    }, 150);

    // 添加滚动事件监听器
    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    window.addEventListener('scroll', scrollStopDetection, { passive: true });
    
    // 初始化时计算一次
    updateScrollProgress();
    
    // 清理函数
    return () => {
      window.removeEventListener('scroll', updateScrollProgress);
      window.removeEventListener('scroll', scrollStopDetection);
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // 植物各部分显示的计算
  const stemHeight = Math.max(0, scrollProgress * 53.4);
  const petalOpacity1 = scrollProgress > 0.3 ? Math.min(1, (scrollProgress - 0.3) * 5) : 0;
  const petalOpacity2 = scrollProgress > 0.5 ? Math.min(1, (scrollProgress - 0.5) * 5) : 0;
  const flowerOpacity = scrollProgress > 0.7 ? Math.min(1, (scrollProgress - 0.7) * 5) : 0;
  
  const petalScale1 = scrollProgress > 0.3 ? Math.min(1, (scrollProgress - 0.3) * 5) : 0;
  const petalScale2 = scrollProgress > 0.5 ? Math.min(1, (scrollProgress - 0.5) * 5) : 0;
  const flowerScale = scrollProgress > 0.7 ? Math.min(1, (scrollProgress - 0.7) * 5) : 0;

  return (
    <div className="fixed right-5 bottom-0 z-50 hidden md:block pointer-events-none">
      <div className="relative w-40 h-[60vh]">
        <svg 
          ref={svgRef}
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 224 180" 
          width="224" 
          height="180" 
          className="absolute bottom-0 right-0"
        >
          <g className="flower" fill="none" strokeWidth="1.2" strokeLinecap="round" strokeMiterlimit="10">
            {/* 花盆 */}
            <g className="flower__pot">
              {/* 花盆底部 */}
              <path 
                fill="none" 
                stroke="#F56E59" 
                strokeWidth="1.5" 
                strokeLinejoin="round" 
                d="M104 148h33v12c0 9.1-7.4 16.6-16.6 16.6h0c-9.1 0-16.4-7.4-16.4-16.6v-12z" 
              />
              {/* 花盆顶部边缘 */}
              <path 
                fill="none" 
                stroke="#F56E59" 
                strokeWidth="1.5" 
                strokeLinejoin="round" 
                d="M102 143h38v5h-38z" 
              />
              {/* 添加土壤 */}
              <path 
                fill="#8B4513" 
                stroke="#8B4513" 
                strokeWidth="0.8" 
                d="M106 148h28v2c0 0-6 3-14 3s-14-3-14-3v-2z" 
              />
            </g>

            {/* 茎 - 使用计算好的高度 */}
            <path 
              stroke="#58F4FF" 
              strokeLinecap="round"
              strokeWidth="2"
              d={`M121 143 L121 ${143 - stemHeight}`} 
            />

            {/* 花瓣1组 */}
            <g style={{ 
              opacity: petalOpacity1, 
              transform: `scale(${petalScale1})`,
              transformOrigin: '121px 130px',
            }}>
              <g>
                <path stroke="#F56E59" d="M121 137l-16.8-16.8" />
                <path stroke="#A041FF" strokeLinejoin="round" d="M114 130c-2.7 2.7-7.1 2.7-9.8 0-2.7-2.7-2.7-7.1 0-9.8l9.3 9.3.5.5z" />
                <path stroke="#F56E59" d="M106 127l7.7 2.9" />
              </g>

              <g>
                <path stroke="#F56E59" d="M121 131l16.8-16.8" />
                <path stroke="#A041FF" strokeLinejoin="round" d="M128 124c2.7 2.7 7.1 2.7 9.8 0 2.7-2.7 2.7-7.1 0-9.8l-9.3 9.3-.5.5z" />
                <path stroke="#F56E59" d="M136 121l-7.7 3" />
              </g>
            </g>

            {/* 花瓣2组 */}
            <g style={{ 
              opacity: petalOpacity2, 
              transform: `scale(${petalScale2})`,
              transformOrigin: '121px 110px',
            }}>
              <g>
                <path stroke="#F56E59" d="M121 118l-16.8-16.8" />
                <path stroke="#A041FF" strokeLinejoin="round" d="M114 111c-2.7 2.7-7.1 2.7-9.8 0-2.7-2.7-2.7-7.1 0-9.8l9.3 9.3.5.5z" />
                <path stroke="#F56E59" d="M106 108l7.7 2.9" />
              </g>

              <g>
                <path stroke="#F56E59" d="M121 112l16.8-16.7" />
                <path stroke="#A041FF" strokeLinejoin="round" d="M128 105c2.7 2.7 7.1 2.7 9.8 0 2.7-2.7 2.7-7.1 0-9.8l-9.3 9.3-.5.5z" />
                <path stroke="#F56E59" d="M136 102l-7.7 2.9" />
              </g>
            </g>

            {/* 梅花形状花朵 */}
            <g opacity={flowerOpacity} style={{ 
              transform: `scale(${flowerScale})`,
              transformOrigin: '121px 90px',
            }}>
              {/* 梅花形状，粉色填充，无轮廓 */}
              <path 
                d="M121 72 C126 72 130 77 130 83 C130 89 126 93 121 97 C116 93 112 89 112 83 C112 77 116 72 121 72 Z
                   M136 83 C136 88 131 92 125 92 C119 92 115 88 110 83 C115 78 119 74 125 74 C131 74 136 78 136 83 Z
                   M132 98 C127 98 123 93 123 87 C123 81 127 77 132 73 C137 77 141 81 141 87 C141 93 137 98 132 98 Z
                   M110 98 C105 98 101 93 101 87 C101 81 105 77 110 73 C115 77 119 81 119 87 C119 93 115 98 110 98 Z
                   M121 108 C116 108 112 103 112 97 C112 91 116 87 121 83 C126 87 130 91 130 97 C130 103 126 108 121 108 Z"
                fill="#FF9EC4" 
                stroke="none"
              />
              
              {/* 中心白色花蕊 */}
              <path 
                d="M121 85 L125 95 L115 90 L127 90 L117 95 Z" 
                fill="white"
                stroke="white"
                strokeWidth="0.5"
              />
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
};

export default GrowingPlant; 