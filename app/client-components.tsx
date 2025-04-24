"use client"

import { useEffect } from "react"
import dynamic from 'next/dynamic'

// 禁用SSR导入LoadingScreen组件 - 确保立即加载优先显示
export const ClientLoadingScreen = dynamic(
  () => import('@/components/LoadingScreen'),
  { 
    ssr: false, 
    loading: () => (
      <div className="fixed inset-0 z-[999] flex flex-col items-center justify-center" style={{ backgroundColor: '#D4AFFF' }}>
        {/* 移除加载文字，保持空白 */}
      </div>
    )
  }
)

export function ScrollbarMeasurer() {
  useEffect(() => {
    // 测量滚动条宽度
    const calculateScrollbarWidth = (): number => {
      // 创建一个内容溢出的div
      const outer = document.createElement('div');
      outer.style.visibility = 'hidden';
      outer.style.overflow = 'scroll';
      document.body.appendChild(outer);
      
      // 创建一个inner div并放入outer
      const inner = document.createElement('div');
      outer.appendChild(inner);
      
      // 计算滚动条宽度
      const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;
      
      // 清理
      document.body.removeChild(outer);
      
      return scrollbarWidth;
    };
    
    // 设置滚动条宽度到CSS变量
    const setScrollbarWidth = (width: number): void => {
      document.documentElement.style.setProperty('--scrollbar-width', `${width}px`);
      document.body.style.setProperty('--scrollbar-width', `${width}px`);
    };
    
    // 处理初始化
    const init = (): void => {
      const scrollbarWidth = calculateScrollbarWidth();
      setScrollbarWidth(scrollbarWidth);
      document.body.classList.add('scrollbar-measured');
      
      // 移除 Grammarly 扩展添加的属性，防止 React 水合错误
      if (document.body.hasAttribute('data-new-gr-c-s-check-loaded')) {
        document.body.removeAttribute('data-new-gr-c-s-check-loaded');
      }
      if (document.body.hasAttribute('data-gr-ext-installed')) {
        document.body.removeAttribute('data-gr-ext-installed');
      }
    };
    
    // 初始化
    if (typeof window !== 'undefined') {
      init();
      
      // 确保DOM完全加载后再次尝试移除属性
      window.addEventListener('DOMContentLoaded', () => {
        document.body.removeAttribute('data-new-gr-c-s-check-loaded');
        document.body.removeAttribute('data-gr-ext-installed');
      });
    }
    
    // 窗口大小改变时重新测量
    const handleResize = (): void => {
      const newWidth = calculateScrollbarWidth();
      setScrollbarWidth(newWidth);
    };
    
    window.addEventListener('resize', handleResize);
    
    // 清理事件监听器
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('DOMContentLoaded', () => {});
    };
  }, []);
  
  // 此组件不渲染任何内容
  return null;
} 