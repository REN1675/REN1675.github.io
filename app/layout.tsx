import "./globals.css"
import "./global.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { ScrollbarMeasurer, ClientLoadingScreen } from "./client-components"
import GrowingPlant from "@/components/GrowingPlant"
import Script from "next/script"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "任瑜瑜的个人网站",
  description: "任瑜瑜的个人网站",
  generator: 'ryy',
  icons: {
    icon: [
      {
        url: '/images/网站.svg',
        type: 'image/svg+xml',
      }
    ],
    apple: [
      {
        url: '/images/网站.svg',
        type: 'image/svg+xml',
      }
    ]
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        {/* 内联样式确保加载页面立即显示 */}
        <style dangerouslySetInnerHTML={{ __html: `
          body::before {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: #D4AFFF;
            z-index: 9998;
          }
          html.page-loaded body::before {
            display: none;
          }
        ` }} />
        {/* 内联脚本确保加载屏幕优先显示 */}
        <script dangerouslySetInnerHTML={{ __html: `
          document.documentElement.classList.remove('page-loaded');
          
          // 强制设置加载屏幕的背景色为荧光紫
          document.addEventListener('DOMContentLoaded', function() {
            // 查找加载屏幕元素并设置背景色
            var loadingScreens = document.querySelectorAll('div[style*="background-color"]');
            loadingScreens.forEach(function(screen) {
              screen.style.backgroundColor = '#D4AFFF';
            });
            
            // 确保body::before的背景色也是荧光紫
            var style = document.createElement('style');
            style.innerHTML = 'body::before { background-color: #D4AFFF !important; }';
            document.head.appendChild(style);
          });
          
          window.addEventListener('load', function() {
            // 延迟一点时间再添加类，以确保加载屏幕组件能正常显示
            setTimeout(function() {
              document.documentElement.classList.add('page-loaded');
            }, 100);
          });
        ` }} />
      </head>
      <body 
        className={inter.className}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ScrollbarMeasurer />
          <ClientLoadingScreen />
          {children}
          <GrowingPlant />
        </ThemeProvider>
      </body>
    </html>
  )
}
