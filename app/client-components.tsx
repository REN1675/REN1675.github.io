"use client"

import { useEffect } from "react"
import { useTheme } from "next-themes"

// 主题处理组件，确保主题设置不受系统影响
export function ThemeHandler() {
  const { resolvedTheme, setTheme } = useTheme()
  
  useEffect(() => {
    // 禁用系统主题偏好
    const disableSystemPreference = () => {
      // 如果检测到系统主题被使用，则强制使用light
      if (resolvedTheme === 'system') {
        setTheme('light')
      }
      
      // 手动控制HTML类，确保正确的主题被应用
      const isDark = resolvedTheme === 'dark'
      if (isDark) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
      
      // 设置背景颜色
      document.body.style.backgroundColor = isDark ? '#111827' : 'white'
    }
    
    // 执行初始化
    disableSystemPreference()
    
    // 创建一个MutationObserver监听HTML类的变化
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          disableSystemPreference()
        }
      })
    })
    
    observer.observe(document.documentElement, { attributes: true })
    
    // 清理
    return () => observer.disconnect()
  }, [resolvedTheme, setTheme])
  
  return null
}

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