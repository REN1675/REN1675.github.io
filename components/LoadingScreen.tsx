'use client';

import { useState, useEffect } from 'react';

export default function LoadingScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  useEffect(() => {
    // 确保加载页面立即显示
    document.body.style.overflow = 'hidden';
    
    // 检查页面是否已经标记为加载完成
    const checkPageLoaded = () => {
      if (document.documentElement.classList.contains('page-loaded')) {
        setIsPageLoaded(true);
      } else {
        // 如果还没加载完成，继续检查
        setTimeout(checkPageLoaded, 100);
      }
    };

    // 启动检查
    checkPageLoaded();

    // 同时监听load事件作为备份
    const handleLoad = () => {
      setTimeout(() => {
        setIsPageLoaded(true);
      }, 500);
    };

    window.addEventListener('load', handleLoad);
    return () => window.removeEventListener('load', handleLoad);
  }, []);

  const handleClick = () => {
    // 只有页面加载完成后点击才有效
    if (isPageLoaded) {
      setIsVisible(false);
      // 恢复滚动
      document.body.style.overflow = '';
      // 移除初始加载屏幕
      document.documentElement.classList.add('page-loaded');
    }
  };

  if (!isVisible) return null;

  return (
    <div 
      className="fixed inset-0 z-[999] flex items-center justify-center"
      onClick={handleClick}
      style={{ backgroundColor: '#D4AFFF' }}
    >
      <div className="loader">
        <svg xmlns="http://www.w3.org/2000/svg" width="61.949" height="21.385" viewBox="0 0 61.949 21.385" className="logo">
          <g>
            <path d="M60.493,3.675,49.176,14.992,37.684,3.5,26.309,14.817,15.05,3.558,3.5,15.167" transform="translate(-1.019 1.443)" fill="none" stroke="#7a30cf" strokeMiterlimit="10" strokeWidth="7"/>
          </g>
          <g>
            <rect width="7" height="7" fill="white" x="-9" y="24"></rect>
            <rect width="7" height="7" fill="white" x="66" y="-9"></rect>
            <rect width="7" height="7" fill="white" x="66" y="-9"></rect>
          </g>
        </svg>
      </div>

      <div className="noise"></div>
    </div>
  );
} 