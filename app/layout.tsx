import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { ScrollbarMeasurer } from "./client-components"
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
      <body 
        className={inter.className}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <ScrollbarMeasurer />
          {children}
          <GrowingPlant />
        </ThemeProvider>
      </body>
    </html>
  )
}
