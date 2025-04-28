"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"

// 增强的主题处理组件，使系统主题和网站主题保持一致
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
    
    // 设置meta标签，确保正确响应系统主题
    const addMetaTags = () => {
      // 添加颜色方案meta标签
      let metaColorScheme = document.querySelector('meta[name="color-scheme"]')
      if (!metaColorScheme) {
        metaColorScheme = document.createElement('meta')
        metaColorScheme.setAttribute('name', 'color-scheme')
        document.head.appendChild(metaColorScheme)
      }
      
      // 根据当前网站主题设置color-scheme
      if (theme === 'dark' || resolvedTheme === 'dark') {
        metaColorScheme.setAttribute('content', 'dark')
      } else {
        metaColorScheme.setAttribute('content', 'light')
      }
    }
    
    // 处理系统主题与网站主题同步
    const handleThemeSync = () => {
      const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
      
      // 如果是系统主题，则根据系统设置来设置网站主题
      if (theme === 'system' || !theme) {
        setTheme(isDarkMode ? 'dark' : 'light')
      }
      
      // 主动监听系统主题变化
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handleMediaChange = (e: MediaQueryListEvent) => {
        // 如果用户选择跟随系统主题，则同步变化
        if (theme === 'system' || !theme) {
          setTheme(e.matches ? 'dark' : 'light')
        }
      }
      
      mediaQuery.addEventListener('change', handleMediaChange)
      return () => mediaQuery.removeEventListener('change', handleMediaChange)
    }
    
    // 执行初始化
    addMetaTags()
    const cleanup = handleThemeSync()
    
    // 当主题改变时更新meta标签
    const observer = new MutationObserver(() => {
      addMetaTags()
    })
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })
    
    // 清理函数
    return () => {
      cleanup()
      observer.disconnect()
    }
  }, [mounted, resolvedTheme, theme, setTheme])
  
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