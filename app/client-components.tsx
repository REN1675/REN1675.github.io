"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"

// 主题处理组件，确保主题设置不受系统影响，但允许手动切换
export function ThemeHandler() {
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme, theme, setTheme } = useTheme()
  
  // 确保仅在客户端执行主题处理
  useEffect(() => {
    setMounted(true)
  }, [])
  
  useEffect(() => {
    // 只有在客户端渲染后才执行
    if (!mounted) return
    
    // 只禁用系统主题偏好，不影响手动切换
    const disableSystemPreference = () => {
      // 只有当检测到系统主题被使用时，才强制使用light
      if (resolvedTheme === 'system') {
        setTheme('light')
      }
    }
    
    // 执行初始化
    disableSystemPreference()
    
    // 清理函数
    return () => {}
  }, [mounted, resolvedTheme, setTheme])
  
  // 不渲染任何内容
  return null
}

export function ScrollbarMeasurer() {
  const [mounted, setMounted] = useState(false)
  
  // 确保在客户端执行
  useEffect(() => {
    setMounted(true)
  }, [])
  
  useEffect(() => {
    // 只有在客户端渲染后才执行
    if (!mounted) return
    
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
  }, [mounted]);
  
  // 此组件不渲染任何内容
  return null;
} 