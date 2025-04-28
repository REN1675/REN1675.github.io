"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"

// 简化的主题处理组件，参考zhanzhan-21项目
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
    
    // 添加必要的meta标签
    const updateMetaTags = () => {
      const isDarkMode = document.documentElement.classList.contains('dark')
      
      // 更新color-scheme meta标签
      let metaColorScheme = document.querySelector('meta[name="color-scheme"]')
      if (!metaColorScheme) {
        metaColorScheme = document.createElement('meta')
        metaColorScheme.setAttribute('name', 'color-scheme')
        document.head.appendChild(metaColorScheme)
      }
      
      // 根据当前主题设置color-scheme
      metaColorScheme.setAttribute('content', isDarkMode ? 'dark' : 'light')
      
      // 更新theme-color标签
      const themeColorLight = document.querySelector('meta[name="theme-color"][media="(prefers-color-scheme: light)"]')
      const themeColorDark = document.querySelector('meta[name="theme-color"][media="(prefers-color-scheme: dark)"]')
      
      if (themeColorLight) {
        themeColorLight.setAttribute('media', isDarkMode ? 'not all' : '(prefers-color-scheme: light)')
      }
      
      if (themeColorDark) {
        themeColorDark.setAttribute('media', isDarkMode ? 'all' : '(prefers-color-scheme: dark)')
      }
      
      // 设置数据属性到body
      document.body.dataset.theme = isDarkMode ? 'dark' : 'light'
    }
    
    // 初始同步系统主题
    const syncWithSystem = () => {
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      if (theme === 'system') {
        setTheme(systemPrefersDark ? 'dark' : 'light')
      }
      updateMetaTags()
    }
    
    // 执行初始化
    syncWithSystem()
    
    // 监听主题变化
    const observer = new MutationObserver(() => {
      updateMetaTags()
    })
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })
    
    // 监听系统主题变化
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleMediaChange = (e: MediaQueryListEvent) => {
      if (theme === 'system') {
        setTheme(e.matches ? 'dark' : 'light')
        updateMetaTags()
      }
    }
    
    mediaQuery.addEventListener('change', handleMediaChange)
    
    // 清理函数
    return () => {
      observer.disconnect()
      mediaQuery.removeEventListener('change', handleMediaChange)
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