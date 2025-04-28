import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { ScrollbarMeasurer, ThemeHandler } from "./client-components"
import GrowingPlant from "@/components/GrowingPlant"

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
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta name="color-scheme" content="light dark" />
        <meta name="theme-color" media="(prefers-color-scheme: light)" content="#ffffff" />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#111827" />
      </head>
      <body 
        className={inter.className}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={true}
          disableTransitionOnChange={false}
          storageKey="personal-site-theme"
        >
          <ScrollbarMeasurer />
          <ThemeHandler />
          {children}
          <GrowingPlant />
        </ThemeProvider>
      </body>
    </html>
  )
}
