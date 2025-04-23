"use client"

import { useEffect, useState } from "react"
import { Button } from "../components/ui/button"
import { Mail, Phone, Award, BookOpen, Briefcase, User, Code, FileText, Shield, ChevronRight, Moon, Sun, PlusCircle, Lightbulb, X, Mountain, Utensils, Book, Heart, Menu, Home as HomeIcon, ChevronDown, GraduationCap, Brain, Trophy, ChevronUp } from "lucide-react"
import Link from "next/link"
import { Card, CardContent } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Progress } from "../components/ui/progress"
import { FixedBackground } from "../components/fixed-background"
import Image from "next/image"
import { useTheme } from "next-themes"
import { CustomDock } from "../components/custom-dock"
import { cn } from "../lib/utils"
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "../components/ui/collapsible"
import { Dialog, DialogContent, DialogClose, DialogTitle, DialogTrigger, DialogDescription, DialogFooter, DialogHeader } from "../components/ui/dialog"
import { SkillsOrbit } from "../components/skills-orbit"
import { Code as CodeIcon, Database, LineChart, Users, MessagesSquare, HelpingHand, Puzzle, ListTodo } from "lucide-react"
import React from "react"

// 技能数据
const skills = [
  "客户服务",
  "数据分析",
  "Python",
  "Excel",
  "沟通能力",
  "团队协作",
  "问题解决",
  "项目管理",
]

// 环绕技能数据 - 添加图标、类别和熟练度
const orbitSkills = [
  { name: "客户服务", icon: <HelpingHand />, category: "专业技能", level: "熟练", value: 85, description: "专业高效处理客诉事件，保持冷静并提供解决方案" },
  { name: "数据分析", icon: <LineChart />, category: "专业技能", level: "入门", value: 75, description: "借助AI工具使用Python自动化处理Excel数据分析，自动发送邮件等" },
  { name: "Python", icon: <CodeIcon />, category: "专业技能", level: "入门", value: 70, description: "使用Python自动化处理Excel数据，提高工作效率" },
  { name: "Excel", icon: <Database />, category: "专业技能", level: "熟练", value: 80, description: "熟悉Excel各项功能，能进行数据清洗和分析" },
  { name: "沟通能力", icon: <MessagesSquare />, category: "软技能", level: "良好", value: 90, description: "善于换位思考，理解客户需求，有效解决问题" },
  { name: "团队协作", icon: <Users />, category: "软技能", level: "优秀", value: 85, description: "能够有效与团队成员合作，共同完成目标" },
  { name: "问题解决", icon: <Puzzle />, category: "软技能", level: "良好", value: 80, description: "能够分析复杂问题并找出有效解决方案" },
  { name: "英语", icon: <BookOpen />, category: "软技能", level: "CET-6", value: 70, description: "能够进行技术文档阅读和基本的英语交流" },
]

// 打字机效果的标题
const typingTitles = ["服务运营", "客户服务", "数据分析"]

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const [scrolled, setScrolled] = useState(false)
  const [typingText, setTypingText] = useState("")
  const [typingIndex, setTypingIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [typingSpeed, setTypingSpeed] = useState(150)
  const [themeButtonHovered, setThemeButtonHovered] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  // 添加教育经历相关状态
  const [selectedSchool, setSelectedSchool] = useState<"sxu" | "xmut" | null>(null)

  useEffect(() => {
    setMounted(true)
    
    // 添加隐藏滚动条的样式
    const style = document.createElement('style');
    style.textContent = `
      *::-webkit-scrollbar {
        display: none !important;
        width: 0 !important;
        height: 0 !important;
        background: transparent !important;
      }
      * {
        -ms-overflow-style: none !important;
        scrollbar-width: none !important;
      }
      [data-dialog-content] > div {
        -ms-overflow-style: none !important;
        scrollbar-width: none !important;
      }
      [data-dialog-content] > div::-webkit-scrollbar {
        display: none !important;
        width: 0 !important;
      }
    `;
    document.head.appendChild(style);
    
    // 移除 Grammarly 扩展添加的属性
    const body = document.querySelector('body')
    if (body) {
      body.removeAttribute('data-new-gr-c-s-check-loaded')
      body.removeAttribute('data-gr-ext-installed')
    }
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    
    // 监听 Collapsible 状态变化以同步左侧轮岗经历的显示
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-state') {
          const collapsible = document.getElementById('work-experience-collapsible')
          const rotationHistory = document.querySelector('[data-state-from="work-experience-collapsible"]')
          
          if (collapsible && rotationHistory) {
            const state = collapsible.getAttribute('data-state')
            if (state) {
              rotationHistory.setAttribute('data-state', state)
            }
          }
        }
      })
    })
    
    const collapsible = document.getElementById('work-experience-collapsible')
    if (collapsible) {
      observer.observe(collapsible, { attributes: true })
    }
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      observer.disconnect()
    }
  }, [])

  // 处理导航项点击，用于移动设备菜单
  const handleNavClick = (href: string) => {
    const targetId = href.substring(1)
    const element = document.getElementById(targetId)
    
    if (element) {
      // 平滑滚动到目标元素
      element.scrollIntoView({ behavior: "smooth" })
      setMobileMenuOpen(false)
    }
  }

  // 打字机效果
  useEffect(() => {
    if (!mounted) return

    const currentTitle = typingTitles[typingIndex]
    
    // 设置不同的打字速度
    const typeSpeed = isDeleting ? 80 : 120
    const pauseBeforeDelete = 2000
    const pauseBeforeType = 700
    
    let timer
    
    if (isDeleting) {
      if (typingText.length === 0) {
        setIsDeleting(false)
        setTypingIndex((prev) => (prev + 1) % typingTitles.length)
        timer = setTimeout(() => {}, pauseBeforeType)
      } else {
        timer = setTimeout(() => {
          setTypingText(currentTitle.substring(0, typingText.length - 1))
        }, typeSpeed)
      }
    } else {
      if (typingText === currentTitle) {
        timer = setTimeout(() => {
          setIsDeleting(true)
        }, pauseBeforeDelete)
      } else {
        timer = setTimeout(() => {
          setTypingText(currentTitle.substring(0, typingText.length + 1))
        }, typeSpeed)
      }
    }
    
    return () => clearTimeout(timer)
  }, [typingText, typingIndex, isDeleting, mounted])

  if (!mounted) return null

  return (
    <div className="flex flex-col min-h-screen">
      {/* 移除背景组件 */}
      
      {/* 导航栏 */}
      <header
        className={`fixed top-0 w-full z-40 transition-all duration-300 ${
          scrolled 
            ? 'bg-white/90 dark:bg-purple-900/90 backdrop-blur-md shadow-lg' 
            : 'bg-transparent'
        }`}
      >
        <div className="container max-w-[1440px] mx-auto px-4 h-20 flex items-center justify-between">
          {/* 左侧Logo */}
          <div className="flex items-center">
            <Link
              href="#home"
              className="font-bold text-2xl md:text-3xl transition-transform duration-300 hover:scale-105 text-gray-900 dark:text-white"
              onClick={(e) => {
                e.preventDefault()
                document.getElementById("home")?.scrollIntoView({ behavior: "smooth" })
              }}
            >
              <span className="gradient-text">任瑜瑜</span>
            </Link>
          </div>
          
          {/* 中间导航 - 仅在桌面显示 */}
          <div className="hidden md:flex justify-center">
            <div className="rounded-full bg-white/80 dark:bg-purple-900/80 backdrop-blur-md border border-indigo-200 dark:border-purple-500/30 shadow-md py-2 px-5">
              {mounted && <CustomDock />}
            </div>
          </div>
          
          {/* 右侧主题切换与移动菜单 */}
          <div className="flex items-center gap-2">
            {/* 移动设备汉堡菜单按钮 */}
            <div className="md:hidden">
              <div className="rounded-full bg-white/80 dark:bg-purple-900/80 backdrop-blur-md border border-indigo-200 dark:border-purple-500/30 shadow-md py-2 px-2">
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="flex items-center justify-center rounded-full w-10 h-10 text-gray-700 dark:text-gray-200 hover:bg-indigo-50/80 dark:hover:bg-purple-700/30 transition-all duration-300"
                  aria-label="菜单"
                >
                  {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
              </div>
            </div>
            
            {/* 主题切换 */}
            <div 
              className="relative group rounded-full bg-white/80 dark:bg-purple-900/80 backdrop-blur-md border border-indigo-200 dark:border-purple-500/30 shadow-md py-2 px-2"
              onMouseEnter={() => setThemeButtonHovered(true)}
              onMouseLeave={() => setThemeButtonHovered(false)}
            >
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="flex items-center justify-center rounded-full w-10 h-10 text-gray-700 dark:text-gray-200 hover:bg-indigo-50/80 dark:hover:bg-purple-700/30 transition-all duration-300 ease-in-out transform"
                aria-label="切换主题"
          >
                {theme === 'dark' 
                  ? <Sun className="h-5 w-5" /> 
                  : <Moon className="h-5 w-5" />
                }
          </button>
              
              {/* 工具提示 */}
              <div className={cn(
                "absolute top-full mt-2 left-1/2 transform -translate-x-1/2 px-3 py-2 rounded-lg bg-white/95 dark:bg-purple-900/95 text-gray-900 dark:text-white text-sm font-medium whitespace-nowrap border border-indigo-200 dark:border-purple-500/30 shadow-lg transition-all duration-300 ease-in-out z-50",
                "group-hover:opacity-100 group-hover:scale-100 opacity-0 scale-95 pointer-events-none"
              )}>
                切换主题
                <div className="absolute w-2 h-2 bg-white dark:bg-purple-900 border-t border-l border-indigo-200 dark:border-purple-500/30 transform rotate-45 left-1/2 -top-1 -translate-x-1/2"></div>
              </div>
            </div>
          </div>
        </div>

        {/* 移动导航菜单 - 仅在移动设备显示 */}
        <div className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
          mobileMenuOpen 
            ? 'max-h-[400px] opacity-100 border-b border-indigo-200 dark:border-purple-500/30 bg-white/90 dark:bg-purple-900/90 backdrop-blur-md shadow-md' 
            : 'max-h-0 opacity-0'
        }`}>
          <div className="container max-w-[1440px] mx-auto px-4 py-4 space-y-2">
            {[
              { name: "首页", href: "#home", icon: HomeIcon },
              { name: "实习经历", href: "#experience", icon: Briefcase },
              { name: "教育经历", href: "#education", icon: BookOpen },
              { name: "技能专长", href: "#skills", icon: Code },
              { name: "联系方式", href: "#contact", icon: Mail }
            ].map((item) => (
              <div 
                key={item.name}
                className="flex items-center w-full rounded-lg hover:bg-indigo-50/80 dark:hover:bg-purple-700/30 transition-colors p-3 cursor-pointer"
                onClick={() => handleNavClick(item.href)}
              >
                <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-purple-800/60 flex items-center justify-center mr-3">
                  <item.icon className="h-4 w-4 text-indigo-600 dark:text-purple-300" />
                </div>
                <span className="text-gray-900 dark:text-white font-medium">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </header>

      <main className="flex-1 pt-20 text-gray-900 dark:text-white">
        {/* Hero Section */}
        <section id="home" className="hero-section py-8 md:py-12 animate-fade-in relative">
          <div className="absolute inset-0 full-width-bg bg-white/80 dark:bg-white/5"></div>
          <div className="container max-w-[1440px] mx-auto px-4 relative z-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 w-full">
              <div className="flex-1 space-y-3 md:space-y-5 max-w-2xl">
                <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold flex flex-wrap items-center">
                  <span className="inline-block text-gray-900 dark:text-white">你好，我是</span>{' '}<span className="gradient-text">任瑜瑜</span>
                </h1>
                <p className="text-xl sm:text-2xl md:text-3xl text-gray-700 dark:text-gray-100 h-10">
                  <span className="inline-block border-r-2 border-indigo-500 dark:border-purple-500 pr-1 animate-blink-caret">
                    {typingText}
                  </span>
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="text-base md:text-xl bg-indigo-50/50 dark:bg-white/10 text-indigo-700 dark:text-white border-indigo-200 dark:border-white/20 py-1">
                    24岁
                  </Badge>
                  <Badge variant="outline" className="text-base md:text-xl bg-indigo-50/50 dark:bg-white/10 text-indigo-700 dark:text-white border-indigo-200 dark:border-white/20 py-1">
                    中共党员
                  </Badge>
                  <Badge variant="outline" className="text-base md:text-xl bg-indigo-50/50 dark:bg-white/10 text-indigo-700 dark:text-white border-indigo-200 dark:border-white/20 py-1">
                    硕士研究生
                  </Badge>
                </div>
                <p className="text-base sm:text-xl md:text-2xl text-gray-700 dark:text-gray-100 max-w-[600px]">
                  京东科技客户体验与服务部山西分中心新锐之星，目前轮岗于危机处理组。做事认真，有责任心，注重数据驱动分析决策。
                </p>
                <div className="flex flex-row gap-3 pt-2 md:pt-4">
                  <Button
                    onClick={() => {
                      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
                    }}
                    className="transition-all duration-300 hover:scale-105 bg-indigo-600 hover:bg-indigo-700 dark:bg-purple-600 dark:hover:bg-purple-700 text-white text-sm sm:text-base md:text-xl py-2.5 sm:py-3 md:py-6 px-4 md:px-8 w-1/2 sm:w-auto"
                  >
                    <Mail className="mr-1.5 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" /> 联系我
                  </Button>
                  <a 
                    href="/任瑜瑜简历.pdf" 
                    download="任瑜瑜简历.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-1/2 sm:w-auto"
                  >
                    <Button
                      variant="outline"
                      className="transition-all duration-300 hover:scale-105 bg-indigo-50/50 dark:bg-white/10 text-indigo-700 dark:text-white border-indigo-200 dark:border-white/20 hover:bg-indigo-100 dark:hover:bg-white/20 text-sm sm:text-base md:text-xl py-2.5 sm:py-3 md:py-6 px-4 md:px-8 w-full"
                    >
                      <FileText className="mr-1.5 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" /> 下载简历
                  </Button>
                  </a>
                </div>
              </div>
              <div className="flex-1 flex justify-center md:justify-end animate-float mt-6 md:mt-0">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 dark:from-purple-500 dark:to-blue-500 rounded-full blur-lg opacity-50"></div>
                  <div className="image-container w-60 h-60 md:w-80 md:h-80 relative border-4 border-indigo-400/50 dark:border-purple-400/50 transition-transform duration-500 hover:scale-105 animate-pulse-slow">
                    <Image src="/images/ren-character.svg" alt="任字图像" fill className="object-cover p-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 实习经历 Section */}
        <section id="experience" className="py-16 relative">
          <div className="absolute inset-0 full-width-bg bg-indigo-50/80 dark:bg-purple-800/60"></div>
          <div className="container max-w-[1440px] mx-auto px-4 relative z-10">
            <div className="flex items-center justify-center gap-2 mb-12">
              <Briefcase className="h-8 w-8 text-indigo-500 dark:text-purple-400" />
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">实习经历</h2>
            </div>

            {/* 经验时间线 */}
            <div className="relative mb-16">
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-indigo-200 dark:bg-purple-600/40"></div>
            </div>

            {/* 京东科技 */}
            <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2 mb-12 bg-white/70 dark:bg-white/10 border-indigo-100 dark:border-white/10">
              <CardContent className="p-0">
                {/* 窄屏简化版本 */}
                <div className="flex flex-col sm:hidden">
                  <div className="bg-indigo-100/70 dark:bg-purple-800/50 p-4 relative overflow-hidden">
                    {/* 装饰背景元素 */}
                    <div className="absolute -right-8 -top-8 w-16 h-16 rounded-full bg-indigo-300/30 dark:bg-purple-500/30"></div>
                    <div className="absolute -left-4 -bottom-4 w-12 h-12 rounded-full bg-indigo-300/30 dark:bg-purple-500/30"></div>
                    
                    {/* 公司标志 */}
                    <div className="w-16 h-16 mx-auto mb-3 rounded-xl bg-white/90 dark:bg-purple-900/50 p-2 shadow-md flex items-center justify-center relative">
                      <Image 
                        src="/images/jd-logo.svg" 
                        alt="京东Logo" 
                        fill
                        className="object-contain p-2"
                      />
                    </div>

                    <h3 className="font-bold text-xl text-gray-900 dark:text-white text-center">京东科技—客户体验与服务部—山西分中心</h3>
                    <p className="text-indigo-600 dark:text-purple-300 font-medium mt-2 text-lg text-center">新锐之星-服务运营提升岗位</p>
                    <p className="font-medium mt-2 text-gray-700 dark:text-gray-200 text-base text-center">2023年12月13日 - 至今</p>
                    
                    <div className="mt-4 flex justify-center">
                      <Collapsible className="w-full">
                        <div className="flex justify-between items-center">
                          <CollapsibleTrigger asChild className="data-[state=open]:hidden flex-1">
                            <Button variant="outline" className="bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-700 hover:bg-indigo-500/20 max-w-[280px] mx-auto flex flex-row items-center">
                              <span>查看详情</span> <ChevronDown className="ml-1 h-4 w-4 transition-transform duration-200" />
                            </Button>
                          </CollapsibleTrigger>
                        </div>
                        <CollapsibleContent className="mt-4">
                          <div className="space-y-5">
                            <div>
                              <h4 className="font-semibold text-xl text-gray-900 dark:text-white flex items-center">
                                <Briefcase className="h-5 w-5 text-indigo-500 dark:text-purple-400 mr-2 flex-shrink-0" />
                                工作与学习内容
                              </h4>
                              <div className="grid gap-3 mt-3">
                                <div className="bg-gray-50/80 dark:bg-gray-800/50 p-3 rounded-lg border border-indigo-100 dark:border-purple-500/20 hover:shadow-md transition-all">
                                  <div className="flex items-start">
                                    <div className="bg-indigo-100 dark:bg-purple-800/60 p-1.5 rounded-full mr-2 flex-shrink-0">
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-600 dark:text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                      </svg>
                                    </div>
                                    <div>
                                      <h5 className="text-base font-medium text-gray-900 dark:text-white">客户服务</h5>
                                      <p className="text-sm text-gray-700 dark:text-gray-200">承接客诉、处理工单，秉持客户问题到我为止的理念</p>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="bg-gray-50/80 dark:bg-gray-800/50 p-3 rounded-lg border border-indigo-100 dark:border-purple-500/20 hover:shadow-md transition-all">
                                  <div className="flex items-start">
                                    <div className="bg-indigo-100 dark:bg-purple-800/60 p-1.5 rounded-full mr-2 flex-shrink-0">
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-600 dark:text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                                      </svg>
                                    </div>
                                    <div>
                                      <h5 className="text-base font-medium text-gray-900 dark:text-white">系统优化</h5>
                                      <p className="text-sm text-gray-700 dark:text-gray-200">提报VOE，参与系统优化需求沟通与建议</p>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="bg-gray-50/80 dark:bg-gray-800/50 p-3 rounded-lg border border-indigo-100 dark:border-purple-500/20 hover:shadow-md transition-all">
                                  <div className="flex items-start">
                                    <div className="bg-indigo-100 dark:bg-purple-800/60 p-1.5 rounded-full mr-2 flex-shrink-0">
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-600 dark:text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                      </svg>
                                    </div>
                                    <div>
                                      <h5 className="text-base font-medium text-gray-900 dark:text-white">数据分析</h5>
                                      <p className="text-sm text-gray-700 dark:text-gray-200">负责人员留存A级项目，分析流失率数据</p>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="bg-gray-50/80 dark:bg-gray-800/50 p-3 rounded-lg border border-indigo-100 dark:border-purple-500/20 hover:shadow-md transition-all">
                                  <div className="flex items-start">
                                    <div className="bg-indigo-100 dark:bg-purple-800/60 p-1.5 rounded-full mr-2 flex-shrink-0">
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-600 dark:text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                      </svg>
                                    </div>
                                    <div>
                                      <h5 className="text-base font-medium text-gray-900 dark:text-white">会务组织</h5>
                                      <p className="text-sm text-gray-700 dark:text-gray-200">负责圆桌会议组织、通知与纪要工作</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="font-semibold text-xl text-gray-900 dark:text-white flex items-center">
                                <Award className="h-5 w-5 text-indigo-500 dark:text-purple-400 mr-2" />
                                成果与能力
                              </h4>
                              <div className="grid gap-3 mt-3">
                                <div className="bg-gray-50/80 dark:bg-gray-800/50 p-3 rounded-lg border border-indigo-100 dark:border-purple-500/20 hover:shadow-md transition-all">
                                  <div className="flex items-start">
                                    <div className="bg-indigo-100 dark:bg-purple-800/60 p-1.5 rounded-full mr-2 flex-shrink-0">
                                      <Shield className="h-4 w-4 text-indigo-600 dark:text-purple-300" />
                                    </div>
                                    <div>
                                      <h5 className="text-base font-medium text-gray-900 dark:text-white">客户表扬</h5>
                                      <p className="text-sm text-gray-700 dark:text-gray-200">获得两次客户表扬，受到主管和导师的一致好评</p>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="bg-gray-50/80 dark:bg-gray-800/50 p-3 rounded-lg border border-indigo-100 dark:border-purple-500/20 hover:shadow-md transition-all">
                                  <div className="flex items-start">
                                    <div className="bg-indigo-100 dark:bg-purple-800/60 p-1.5 rounded-full mr-2 flex-shrink-0">
                                      <Code className="h-4 w-4 text-indigo-600 dark:text-purple-300" />
                                    </div>
                                    <div>
                                      <h5 className="text-base font-medium text-gray-900 dark:text-white">技术应用</h5>
                                      <p className="text-sm text-gray-700 dark:text-gray-200">使用Python实现人员数据录入半自动化，提高工作效率</p>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="bg-gray-50/80 dark:bg-gray-800/50 p-3 rounded-lg border border-indigo-100 dark:border-purple-500/20 hover:shadow-md transition-all">
                                  <div className="flex items-start">
                                    <div className="bg-indigo-100 dark:bg-purple-800/60 p-1.5 rounded-full mr-2 flex-shrink-0">
                                      <Lightbulb className="h-4 w-4 text-indigo-600 dark:text-purple-300" />
                                    </div>
                                    <div>
                                      <h5 className="text-base font-medium text-gray-900 dark:text-white">能力提升</h5>
                                      <p className="text-sm text-gray-700 dark:text-gray-200">参加储备主管培训，通过主管KCR认证，提升业务与管理能力</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="font-semibold text-xl text-gray-900 dark:text-white flex items-center">
                                <PlusCircle className="h-5 w-5 text-indigo-500 dark:text-purple-400 mr-2" />
                                轮岗经历
                              </h4>
                              <div className="space-y-3 mt-3">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center">
                                    <div className="w-2 h-2 rounded-full bg-indigo-400/80 dark:bg-purple-400/80 mr-1"></div>
                                    <Badge className="bg-indigo-400/80 dark:bg-purple-400/80 text-white hover:bg-indigo-500/80 dark:hover:bg-purple-500/80 text-sm whitespace-normal max-w-full sm:max-w-[170px] text-center">消金语音服务部</Badge>
                                  </div>
                                  <div className="text-xs text-gray-500 dark:text-gray-300 ml-3 whitespace-nowrap">2023.12-2024.02</div>
                                </div>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center">
                                    <div className="w-2 h-2 rounded-full bg-blue-500/80 mr-1"></div>
                                    <Badge className="bg-blue-500/80 text-white hover:bg-blue-600/80 text-sm whitespace-normal max-w-full sm:max-w-[170px] text-center">消金在线服务部</Badge>
                                  </div>
                                  <div className="text-xs text-gray-500 dark:text-gray-300 ml-3 whitespace-nowrap">2024.02-2024.04</div>
                                </div>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center">
                                    <div className="w-2 h-2 rounded-full bg-indigo-500/80 dark:bg-purple-500/80 mr-1"></div>
                                    <Badge className="bg-indigo-500/80 dark:bg-purple-500/80 text-white hover:bg-indigo-600/80 dark:hover:bg-purple-600/80 text-sm whitespace-normal max-w-full sm:max-w-[170px] text-center">危机处理组</Badge>
                                  </div>
                                  <div className="text-xs text-gray-500 dark:text-gray-300 ml-3 whitespace-nowrap">2024.04-至今</div>
                                </div>
                              </div>
                            </div>

                            <div className="flex justify-end">
                              <CollapsibleTrigger asChild>
                                <Button variant="outline" size="sm" className="bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-700 hover:bg-indigo-500/20 mt-4">
                                  <span>收起内容</span> <ChevronDown className="ml-1 h-4 w-4 rotate-180" />
                                </Button>
                              </CollapsibleTrigger>
                            </div>
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    </div>
                  </div>
                </div>

                {/* 宽屏完整版本 */}
                <div className="hidden sm:flex flex-col md:flex-row">
                  <div className="bg-indigo-100/70 dark:bg-purple-800/50 p-6 md:w-1/4 relative overflow-hidden">
                    {/* 装饰背景元素 */}
                    <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full bg-indigo-300/30 dark:bg-purple-500/30"></div>
                    <div className="absolute -left-4 -bottom-4 w-16 h-16 rounded-full bg-indigo-300/30 dark:bg-purple-500/30"></div>
                    
                    {/* 公司标志 */}
                    <div className="w-24 h-24 mx-auto mb-4 rounded-xl bg-white/90 dark:bg-purple-900/50 p-2 shadow-md flex items-center justify-center relative">
                      <Image 
                        src="/images/jd-logo.svg" 
                        alt="京东Logo" 
                        fill
                        className="object-contain p-2"
                      />
                    </div>

                    <h3 className="font-bold text-2xl text-gray-900 dark:text-white">京东科技—客户体验与服务部—山西分中心</h3>
                    <p className="text-indigo-600 dark:text-purple-300 font-medium mt-3 text-xl">新锐之星-服务运营提升岗位</p>
                    <p className="font-medium mt-3 text-gray-700 dark:text-gray-200 text-xl">2023年12月13日 - 至今</p>
                    
                    <div className="jd-rotation-history mt-4" style={{ display: 'none' }}>
                      <div className="space-y-3 mt-2">
                        <h5 className="font-medium text-lg text-gray-900 dark:text-white mb-2 border-b border-indigo-100 dark:border-purple-500/20 pb-1">轮岗经历</h5>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full bg-indigo-400/80 dark:bg-purple-400/80 mr-2"></div>
                            <Badge className="bg-indigo-400/80 dark:bg-purple-400/80 text-white hover:bg-indigo-500/80 dark:hover:bg-purple-500/80 text-base">消金语音服务部</Badge>
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-300">2023.12-2024.02</div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full bg-blue-500/80 mr-2"></div>
                            <Badge className="bg-blue-500/80 text-white hover:bg-blue-600/80 text-base">消金在线服务部</Badge>
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-300">2024.02-2024.04</div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full bg-indigo-500/80 dark:bg-purple-500/80 mr-2"></div>
                            <Badge className="bg-indigo-500/80 dark:bg-purple-500/80 text-white hover:bg-indigo-600/80 dark:hover:bg-purple-600/80 text-base">危机处理组</Badge>
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-300">2024.04-至今</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-8 md:w-3/4 relative">
                    {/* 工作亮点 */}
                    <div className="absolute top-6 right-6 flex flex-col items-center text-indigo-600 dark:text-purple-300">
                      <div className="text-3xl font-bold">2</div>
                      <div className="text-sm">客户表扬</div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <h4 className="font-semibold text-2xl text-gray-900 dark:text-white flex items-center">
                          <Briefcase className="h-6 w-6 text-indigo-500 dark:text-purple-400 mr-2" />
                          工作与学习内容
                        </h4>
                        <div className="grid md:grid-cols-2 gap-4 mt-4">
                          <div className="bg-gray-50/80 dark:bg-gray-800/50 p-4 rounded-lg border border-indigo-100 dark:border-purple-500/20 hover:shadow-md transition-all">
                            <div className="flex items-start">
                              <div className="bg-indigo-100 dark:bg-purple-800/60 p-2 rounded-full mr-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600 dark:text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                              </div>
                              <div>
                                <h5 className="text-lg font-medium text-gray-900 dark:text-white">客户服务</h5>
                                <p className="text-gray-700 dark:text-gray-200">承接客诉、处理工单，秉持客户问题到我为止的理念</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-gray-50/80 dark:bg-gray-800/50 p-4 rounded-lg border border-indigo-100 dark:border-purple-500/20 hover:shadow-md transition-all">
                            <div className="flex items-start">
                              <div className="bg-indigo-100 dark:bg-purple-800/60 p-2 rounded-full mr-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600 dark:text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                                </svg>
                              </div>
                              <div>
                                <h5 className="text-lg font-medium text-gray-900 dark:text-white">系统优化</h5>
                                <p className="text-gray-700 dark:text-gray-200">提报VOE，参与系统优化需求沟通与建议</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-gray-50/80 dark:bg-gray-800/50 p-4 rounded-lg border border-indigo-100 dark:border-purple-500/20 hover:shadow-md transition-all">
                            <div className="flex items-start">
                              <div className="bg-indigo-100 dark:bg-purple-800/60 p-2 rounded-full mr-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600 dark:text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                              </div>
                              <div>
                                <h5 className="text-lg font-medium text-gray-900 dark:text-white">数据分析</h5>
                                <p className="text-gray-700 dark:text-gray-200">负责人员留存A级项目，分析流失率数据</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-gray-50/80 dark:bg-gray-800/50 p-4 rounded-lg border border-indigo-100 dark:border-purple-500/20 hover:shadow-md transition-all">
                            <div className="flex items-start">
                              <div className="bg-indigo-100 dark:bg-purple-800/60 p-2 rounded-full mr-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600 dark:text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                              </div>
                              <div>
                                <h5 className="text-lg font-medium text-gray-900 dark:text-white">会务组织</h5>
                                <p className="text-gray-700 dark:text-gray-200">负责圆桌会议组织、通知与纪要工作</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <Collapsible className="mt-4" id="work-experience-collapsible">
                          <CollapsibleContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="bg-gray-50/80 dark:bg-gray-800/50 p-4 rounded-lg border border-indigo-100 dark:border-purple-500/20 hover:shadow-md transition-all">
                                <div className="flex items-start">
                                  <div className="bg-indigo-100 dark:bg-purple-800/60 p-2 rounded-full mr-3">
                                    <Code className="h-6 w-6 text-indigo-600 dark:text-purple-300" />
                                  </div>
                                  <div>
                                    <h5 className="text-lg font-medium text-gray-900 dark:text-white">技术应用</h5>
                                    <p className="text-gray-700 dark:text-gray-200">使用Python实现人员数据录入半自动化，提高工作效率</p>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="bg-gray-50/80 dark:bg-gray-800/50 p-4 rounded-lg border border-indigo-100 dark:border-purple-500/20 hover:shadow-md transition-all">
                                <div className="flex items-start">
                                  <div className="bg-indigo-100 dark:bg-purple-800/60 p-2 rounded-full mr-3">
                                    <Award className="h-6 w-6 text-indigo-600 dark:text-purple-300" />
                                  </div>
                                  <div>
                                    <h5 className="text-lg font-medium text-gray-900 dark:text-white">能力提升</h5>
                                    <p className="text-gray-700 dark:text-gray-200">参加储备主管培训，通过主管KCR认证，提升业务与管理能力</p>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="bg-gray-50/80 dark:bg-gray-800/50 p-4 rounded-lg border border-indigo-100 dark:border-purple-500/20 hover:shadow-md transition-all md:col-span-2">
                                <div className="flex items-start">
                                  <div className="bg-indigo-100 dark:bg-purple-800/60 p-2 rounded-full mr-3">
                                    <Lightbulb className="h-6 w-6 text-indigo-600 dark:text-purple-300" />
                                  </div>
                                  <div>
                                    <h5 className="text-lg font-medium text-gray-900 dark:text-white">成果展示</h5>
                                    <p className="text-gray-700 dark:text-gray-200">在危机处理组中积极解决投诉问题，获得两次客户表扬，受到主管和导师的一致好评。工作中注重团队协作，主动承担责任，在复杂问题解决方面展现出色的沟通能力和抗压能力。</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CollapsibleContent>
                          
                          <div className="flex justify-end mt-4">
                            <CollapsibleTrigger className="group px-4 py-2 rounded-md bg-indigo-100 dark:bg-purple-800/60 text-indigo-600 dark:text-purple-300 hover:bg-indigo-200 dark:hover:bg-purple-700/60 transition-all flex items-center gap-2 text-sm font-medium"
                              onClick={() => {
                                // 当按钮被点击时切换轮岗经历的显示状态
                                setTimeout(() => {
                                  const rotationHistory = document.querySelector('.jd-rotation-history') as HTMLElement;
                                  if (rotationHistory) {
                                    const collapsible = document.getElementById('work-experience-collapsible');
                                    const isOpen = collapsible?.getAttribute('data-state') === 'open';
                                    rotationHistory.style.display = isOpen ? 'block' : 'none';
                                  }
                                }, 0);
                              }}
                            >
                              <PlusCircle className="h-4 w-4 transition-transform group-data-[state=open]:rotate-45" /> 
                              <span>
                                <span className="group-data-[state=open]:hidden">查看更多</span>
                                <span className="hidden group-data-[state=open]:inline">收起</span>
                              </span>
                            </CollapsibleTrigger>
                          </div>
                        </Collapsible>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 康明斯公司 */}
            <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2 mb-12 bg-white/70 dark:bg-white/10 border-indigo-100 dark:border-white/10">
              <CardContent className="p-0">
                {/* 窄屏简化版本 */}
                <div className="flex flex-col sm:hidden">
                  <div className="bg-indigo-100/70 dark:bg-purple-800/50 p-4 relative overflow-hidden">
                    {/* 装饰背景元素 */}
                    <div className="absolute -right-8 -top-8 w-16 h-16 rounded-full bg-indigo-300/30 dark:bg-purple-500/30"></div>
                    <div className="absolute -left-4 -bottom-4 w-12 h-12 rounded-full bg-indigo-300/30 dark:bg-purple-500/30"></div>
                    
                    {/* 公司标志 */}
                    <div className="w-16 h-16 mx-auto mb-3 rounded-xl bg-white/90 dark:bg-purple-900/50 p-2 shadow-md flex items-center justify-center relative">
                      <Image 
                        src="/images/cummins.png" 
                        alt="康明斯Logo" 
                        fill
                        className="object-contain p-2"
                      />
                    </div>

                    <h3 className="font-bold text-xl text-gray-900 dark:text-white text-center">康明斯(中国)投资有限公司-沈阳SITE</h3>
                    <p className="text-indigo-600 dark:text-purple-300 font-medium mt-2 text-lg text-center">大马力客户服务支持实习生</p>
                    <p className="font-medium mt-2 text-gray-700 dark:text-gray-200 text-base text-center">2024年03月 - 2024年08月</p>
                    
                    <div className="mt-4 flex justify-center">
                      <Collapsible className="w-full">
                        <div className="flex justify-between items-center">
                          <CollapsibleTrigger asChild className="data-[state=open]:hidden flex-1">
                            <Button variant="outline" className="bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-700 hover:bg-indigo-500/20 max-w-[280px] mx-auto flex flex-row items-center">
                              <span>查看详情</span> <ChevronDown className="ml-1 h-4 w-4 transition-transform duration-200" />
                            </Button>
                          </CollapsibleTrigger>
                        </div>
                        <CollapsibleContent className="mt-4">
                          <div className="space-y-5">
                            <div>
                              <h4 className="font-semibold text-xl text-gray-900 dark:text-white flex items-center">
                                <Briefcase className="h-5 w-5 text-indigo-500 dark:text-purple-400 mr-2 flex-shrink-0" />
                                主要工作内容
                              </h4>
                              <div className="grid gap-3 mt-3">
                                <div className="bg-gray-50/80 dark:bg-gray-800/50 p-3 rounded-lg border border-indigo-100 dark:border-purple-500/20 hover:shadow-md transition-all">
                                  <div className="flex items-start">
                                    <div className="bg-indigo-100 dark:bg-purple-800/60 p-1.5 rounded-full mr-2 flex-shrink-0">
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-600 dark:text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                      </svg>
                                    </div>
                                    <div>
                                      <h5 className="text-base font-medium text-gray-900 dark:text-white">数据管理</h5>
                                      <p className="text-sm text-gray-700 dark:text-gray-200">维护服务技师工时和差旅数据，支持财务回款</p>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="bg-gray-50/80 dark:bg-gray-800/50 p-3 rounded-lg border border-indigo-100 dark:border-purple-500/20 hover:shadow-md transition-all">
                                  <div className="flex items-start">
                                    <div className="bg-indigo-100 dark:bg-purple-800/60 p-1.5 rounded-full mr-2 flex-shrink-0">
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-600 dark:text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                      </svg>
                                    </div>
                                    <div>
                                      <h5 className="text-base font-medium text-gray-900 dark:text-white">采购流程</h5>
                                      <p className="text-sm text-gray-700 dark:text-gray-200">处理劳保用品等采购，负责供应商沟通</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="font-semibold text-xl text-gray-900 dark:text-white flex items-center">
                                <Award className="h-5 w-5 text-indigo-500 dark:text-purple-400 mr-2" />
                                创新与成果
                              </h4>
                              
                              {/* 替换此部分为更生动的创新成果显示 */}
                              <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 dark:from-purple-900/20 dark:to-purple-800/30 rounded-xl p-4 mt-3 border border-indigo-200 dark:border-purple-500/20">
                                <div className="flex flex-col items-center">
                                  <p className="text-base text-gray-700 dark:text-gray-200 mb-3">
                                    优化工时数据处理流程。通过学习和使用函数、Python库，结合人工智能，自动化了Excel数据处理与邮件发送流程
                                  </p>
                                  <div className="w-full flex items-center mb-2">
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mr-2">
                                      <div className="bg-indigo-500 dark:bg-purple-500 h-3 rounded-full" style={{ width: '92%' }}></div>
                                    </div>
                                    <span className="text-indigo-600 dark:text-purple-300 font-bold text-sm whitespace-nowrap">92%</span>
                                  </div>
                                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">工作效率提升</p>
                                  
                                  <div className="text-center mt-2">
                                    <div className="text-2xl font-bold text-indigo-600 dark:text-purple-300">60分钟</div>
                                    <div className="text-xs text-gray-600 dark:text-gray-300">每日节省时间</div>
                                    <div className="flex items-center justify-center mt-2">
                                      <div className="text-red-500 line-through mr-2 text-sm">65min</div>
                                      <div className="text-green-500 text-sm">→</div>
                                      <div className="text-green-500 ml-2 text-sm">5min</div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="flex justify-end">
                              <CollapsibleTrigger asChild>
                                <Button variant="outline" size="sm" className="bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-700 hover:bg-indigo-500/20 mt-4">
                                  <span>收起内容</span> <ChevronDown className="ml-1 h-4 w-4 rotate-180" />
                                </Button>
                              </CollapsibleTrigger>
                            </div>
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    </div>
                  </div>
                </div>

                {/* 宽屏完整版本 */}
                <div className="hidden sm:flex flex-col md:flex-row">
                  <div className="bg-indigo-100/70 dark:bg-purple-800/50 p-6 md:w-1/4 relative overflow-hidden">
                    {/* 装饰背景元素 */}
                    <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full bg-indigo-300/30 dark:bg-purple-500/30"></div>
                    <div className="absolute -left-4 -bottom-4 w-16 h-16 rounded-full bg-indigo-300/30 dark:bg-purple-500/30"></div>
                    
                    {/* 公司标志 */}
                    <div className="w-24 h-24 mx-auto mb-4 rounded-xl bg-white/90 dark:bg-purple-900/50 p-2 shadow-md flex items-center justify-center relative">
                      <Image 
                        src="/images/cummins.png" 
                        alt="康明斯Logo" 
                        fill
                        className="object-contain p-2"
                      />
                    </div>

                    <h3 className="font-bold text-2xl text-gray-900 dark:text-white">康明斯(中国)投资有限公司-沈阳SITE</h3>
                    <p className="text-indigo-600 dark:text-purple-300 font-medium mt-3 text-xl">大马力客户服务支持实习生</p>
                    <p className="font-medium mt-3 text-gray-700 dark:text-gray-200 text-xl">2024年03月 - 2024年08月</p>
                  </div>
                  <div className="p-8 md:w-3/4 relative">
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-semibold text-2xl text-gray-900 dark:text-white flex items-center">
                          <Briefcase className="h-6 w-6 text-indigo-500 dark:text-purple-400 mr-2" />
                          主要工作内容
                        </h4>
                        <div className="grid md:grid-cols-2 gap-4 mt-4">
                          <div className="bg-gray-50/80 dark:bg-gray-800/50 p-4 rounded-lg border border-indigo-100 dark:border-purple-500/20 hover:shadow-md transition-all">
                            <div className="flex items-start">
                              <div className="bg-indigo-100 dark:bg-purple-800/60 p-2 rounded-full mr-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600 dark:text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                              </div>
                              <div>
                                <h5 className="text-lg font-medium text-gray-900 dark:text-white">数据管理</h5>
                                <p className="text-gray-700 dark:text-gray-200">维护服务技师工时和差旅数据，支持财务回款</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-gray-50/80 dark:bg-gray-800/50 p-4 rounded-lg border border-indigo-100 dark:border-purple-500/20 hover:shadow-md transition-all">
                            <div className="flex items-start">
                              <div className="bg-indigo-100 dark:bg-purple-800/60 p-2 rounded-full mr-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600 dark:text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                              </div>
                              <div>
                                <h5 className="text-lg font-medium text-gray-900 dark:text-white">采购流程</h5>
                                <p className="text-gray-700 dark:text-gray-200">处理劳保用品等采购，负责供应商沟通</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 dark:from-purple-900/20 dark:to-purple-800/30 rounded-xl p-6 mt-6 border border-indigo-200 dark:border-purple-500/20">
                        <h4 className="font-semibold text-xl text-gray-900 dark:text-white flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-500 dark:text-purple-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          创新工作成果
                        </h4>
                        <div className="flex flex-col md:flex-row items-center mt-4 gap-4">
                          <div className="w-full md:w-2/3">
                            <p className="text-lg text-gray-700 dark:text-gray-200">
                              优化工时数据处理流程。通过学习和使用函数、Python库，结合人工智能，自动化了Excel数据处理与邮件发送流程
                            </p>
                            <div className="mt-4 flex items-center">
                              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mr-3">
                                <div className="bg-indigo-500 dark:bg-purple-500 h-4 rounded-full" style={{ width: '92%' }}></div>
                              </div>
                              <span className="text-indigo-600 dark:text-purple-300 font-bold text-base">92%</span>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">工作效率提升</p>
                          </div>
                          <div className="w-full md:w-1/3 flex justify-center">
                            <div className="text-center">
                              <div className="text-3xl font-bold text-indigo-600 dark:text-purple-300">60分钟</div>
                              <div className="text-sm text-gray-600 dark:text-gray-300">每日节省时间</div>
                              <div className="flex items-center justify-center mt-2 text-lg">
                                <div className="text-red-500 line-through mr-2">65min</div>
                                <div className="text-green-500">→</div>
                                <div className="text-green-500 ml-2">5min</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 教育经历 Section */}
            <section id="education" className="py-16 relative">
              <div className="absolute inset-0 full-width-bg bg-white/80 dark:bg-gray-950"></div>
              <div className="container max-w-[1440px] mx-auto px-4 relative z-10">
                <div className="flex items-center justify-center gap-2 mb-8">
                  <BookOpen className="h-6 w-6 text-indigo-500 dark:text-purple-400" />
                  <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">教育经历</h2>
                </div>

                {/* 学校卡片预览 */}
                <div className="grid md:grid-cols-2 gap-8">
                  {/* 山西大学预览卡片 */}
                  <div 
                    className="bg-indigo-50/80 dark:bg-indigo-900/20 p-6 rounded-xl border border-indigo-200 dark:border-indigo-500/20 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col items-center transform hover:scale-[1.02]"
                    onClick={() => setSelectedSchool("sxu")}
                  >
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-4 shadow-md overflow-hidden">
                      <Image 
                        src="/images/山西大学.png" 
                        alt="山西大学Logo" 
                        width={96}
                        height={96}
                        className="object-contain"
                      />
                    </div>
                    <h3 className="font-bold text-2xl text-gray-900 dark:text-white mb-2">山西大学</h3>
                    <div className="flex gap-2 mb-2">
                      <Badge variant="outline" className="bg-indigo-100/50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-200 border-indigo-300 dark:border-indigo-400/30 text-sm">
                        硕士
                      </Badge>
                      <Badge className="bg-indigo-500/70 dark:bg-indigo-600/70 text-white text-sm">双一流</Badge>
                    </div>
                    <p className="text-gray-700 dark:text-gray-200 text-center">外国哲学 | 2022-2025</p>
                    <div 
                      onClick={() => setSelectedSchool("sxu")}
                      className="mt-4 inline-flex items-center cursor-pointer text-indigo-600 dark:text-indigo-400 hover:underline px-4 py-2"
                    >
                      查看详情 <ChevronRight className="h-4 w-4 ml-1" />
                    </div>
                  </div>

                  {/* 厦门理工学院预览卡片 */}
                  <div 
                    className="bg-indigo-50/80 dark:bg-indigo-900/20 p-6 rounded-xl border border-indigo-200 dark:border-indigo-500/20 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col items-center transform hover:scale-[1.02]"
                    onClick={() => setSelectedSchool("xmut")}
                  >
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-4 shadow-md overflow-hidden">
                      <Image 
                        src="/images/厦门理工.png" 
                        alt="厦门理工学院Logo" 
                        width={96}
                        height={96}
                        className="object-contain"
                      />
                    </div>
                    <h3 className="font-bold text-2xl text-gray-900 dark:text-white mb-2">厦门理工学院</h3>
                    <div className="flex gap-2 mb-2">
                      <Badge variant="outline" className="bg-indigo-100/50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-200 border-indigo-300 dark:border-indigo-400/30 text-sm">
                        本科
                      </Badge>
                    </div>
                    <p className="text-gray-700 dark:text-gray-200 text-center">通信工程 | 2018-2022</p>
                    <div 
                      onClick={() => setSelectedSchool("xmut")}
                      className="mt-4 inline-flex items-center cursor-pointer text-indigo-600 dark:text-indigo-400 hover:underline px-4 py-2"
                    >
                      查看详情 <ChevronRight className="h-4 w-4 ml-1" />
                    </div>
                  </div>
                </div>

                {/* 山西大学详情模态框 */}
                <Dialog open={selectedSchool === "sxu"} onOpenChange={() => setSelectedSchool(null)}>
                  <DialogContent className="max-w-3xl md:max-w-4xl lg:max-w-5xl p-0 overflow-hidden max-h-[75vh] transform motion-safe:transition-all motion-safe:duration-300 rounded-[32px] z-50 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-10 sm:mt-16 w-[calc(100%-24px)] sm:w-auto">
                    <DialogTitle className="sr-only">山西大学详细信息</DialogTitle>
                    <div className="sticky top-0 bg-white dark:bg-gray-900 p-3 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center z-20">
                      <h3 className="font-bold text-xl text-gray-900 dark:text-white flex items-center gap-2">
                        <Image 
                          src="/images/山西大学.png" 
                          alt="山西大学Logo" 
                          width={28}
                          height={28}
                          className="object-contain"
                        />
                        山西大学
                      </h3>
                    </div>
                    <div className="p-4 md:p-6 overflow-y-auto max-h-[calc(75vh-60px)]" style={{ msOverflowStyle: 'none', scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}>
                      <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                        {/* 左侧信息 */}
                        <div className="md:w-1/3 bg-indigo-50/80 dark:bg-gray-800/50 p-4 rounded-xl border border-indigo-100 dark:border-indigo-500/20">
                          <div className="flex items-center gap-2 mb-4">
                            <Badge className="bg-teal-500/70 dark:bg-teal-600/70 text-white text-sm">双一流</Badge>
                            <Badge variant="outline" className="bg-purple-200/50 dark:bg-purple-500/20 text-purple-700 dark:text-white border-purple-300 dark:border-purple-400/30 text-sm">
                              硕士
                            </Badge>
                          </div>
                          
                          <h4 className="font-semibold text-xl text-gray-900 dark:text-white mb-2">外国哲学</h4>
                          <p className="text-gray-600 dark:text-gray-300 mb-4">哲学学院</p>
                          
                          <div className="space-y-3 mb-4">
                            <div className="flex items-center gap-2">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-500 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <p className="text-gray-700 dark:text-gray-200">2022年09月 - 2025年06月</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-500 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              <p className="text-gray-700 dark:text-gray-200">太原</p>
                            </div>
                          </div>
                        </div>
                        
                        {/* 右侧详情 */}
                        <div className="md:w-2/3">
                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="bg-indigo-50/80 dark:bg-gray-800/50 p-6 rounded-2xl border border-indigo-100 dark:border-indigo-500/20 hover:shadow-md transition-all">
                              <div className="flex items-center gap-2 mb-2">
                                <Award className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />
                                <h5 className="font-medium text-lg text-gray-900 dark:text-white">荣誉奖项</h5>
                              </div>
                              <ul className="space-y-1">
                                <li className="flex items-end">
                                  <div className="flex items-start gap-1 flex-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 dark:bg-indigo-400 mt-1.5"></div>
                                    <span className="text-gray-700 dark:text-gray-200">三等奖学金</span>
                                  </div>
                                  <span className="text-xs text-gray-500 dark:text-gray-400 min-w-[70px] text-right">2022-2023</span>
                                </li>
                                <li className="flex items-end">
                                  <div className="flex items-start gap-1 flex-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 dark:bg-indigo-400 mt-1.5"></div>
                                    <span className="text-gray-700 dark:text-gray-200">三等奖学金</span>
                                  </div>
                                  <span className="text-xs text-gray-500 dark:text-gray-400 min-w-[70px] text-right">2023-2024</span>
                                </li>
                              </ul>
                            </div>
                            
                            <div className="bg-indigo-50/80 dark:bg-gray-800/50 p-6 rounded-2xl border border-indigo-100 dark:border-indigo-500/20 hover:shadow-md transition-all">
                              <div className="flex items-center gap-2 mb-2">
                                <User className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />
                                <h5 className="font-medium text-lg text-gray-900 dark:text-white">担任职务</h5>
                              </div>
                              <p className="text-gray-700 dark:text-gray-200 text-justify">
                                2023-2024学年第一学期担任哲学学院党办助管，负责党员资料审核与整理、党务系统与网站平台管理相关工作。
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                {/* 厦门理工学院详情模态框 */}
                <Dialog open={selectedSchool === "xmut"} onOpenChange={() => setSelectedSchool(null)}>
                  <DialogContent className="max-w-3xl md:max-w-4xl lg:max-w-5xl p-0 overflow-hidden max-h-[75vh] transform motion-safe:transition-all motion-safe:duration-300 rounded-[32px] z-50 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-10 sm:mt-16 w-[calc(100%-24px)] sm:w-auto">
                    <DialogTitle className="sr-only">厦门理工学院详细信息</DialogTitle>
                    <div className="sticky top-0 bg-white dark:bg-gray-900 p-3 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center z-20">
                      <h3 className="font-bold text-xl text-gray-900 dark:text-white flex items-center gap-2">
                        <Image 
                          src="/images/厦门理工.png" 
                          alt="厦门理工学院Logo" 
                          width={28}
                          height={28}
                          className="object-contain"
                        />
                        厦门理工学院
                      </h3>
                    </div>
                    <div className="p-4 md:p-6 overflow-y-auto max-h-[calc(75vh-60px)]" style={{ msOverflowStyle: 'none', scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}>
                      <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                        {/* 左侧信息 */}
                        <div className="md:w-1/3 bg-indigo-50/80 dark:bg-gray-800/50 p-4 rounded-xl border border-indigo-100 dark:border-indigo-500/20">
                          <div className="flex items-center gap-2 mb-4">
                            <Badge variant="outline" className="bg-purple-200/50 dark:bg-purple-500/20 text-purple-700 dark:text-white border-purple-300 dark:border-purple-400/30 text-sm">
                              本科
                            </Badge>
                          </div>
                          
                          <h4 className="font-semibold text-xl text-gray-900 dark:text-white mb-2">通信工程</h4>
                          <p className="text-gray-600 dark:text-gray-300 mb-4">光电与通信工程学院</p>
                          
                          <div className="space-y-3 mb-4">
                            <div className="flex items-center gap-2">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-500 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <p className="text-gray-700 dark:text-gray-200">2018年09月 - 2022年06月</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-500 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              <p className="text-gray-700 dark:text-gray-200">厦门</p>
                            </div>
                          </div>
                        </div>
                        
                        {/* 右侧详情 */}
                        <div className="md:w-2/3">
                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="bg-indigo-50/80 dark:bg-gray-800/50 p-6 rounded-2xl border border-indigo-100 dark:border-indigo-500/20 hover:shadow-md transition-all">
                              <div className="flex items-center gap-2 mb-2">
                                <Award className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />
                                <h5 className="font-medium text-lg text-gray-900 dark:text-white">荣誉奖项</h5>
                              </div>
                              <ul className="space-y-1">
                                <li className="flex items-end">
                                  <div className="flex items-start gap-1 flex-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 dark:bg-indigo-400 mt-1.5"></div>
                                    <span className="text-gray-700 dark:text-gray-200">国家励志奖学金</span>
                                  </div>
                                  <span className="text-xs text-gray-500 dark:text-gray-400 min-w-[70px] text-right">2019-2020</span>
                                </li>
                                <li className="flex items-end">
                                  <div className="flex items-start gap-1 flex-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 dark:bg-indigo-400 mt-1.5"></div>
                                    <span className="text-gray-700 dark:text-gray-200">国家励志奖学金</span>
                                  </div>
                                  <span className="text-xs text-gray-500 dark:text-gray-400 min-w-[70px] text-right">2020-2021</span>
                                </li>
                                <li className="flex items-end">
                                  <div className="flex items-start gap-1 flex-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 dark:bg-indigo-400 mt-1.5"></div>
                                    <span className="text-gray-700 dark:text-gray-200">三好学生</span>
                                  </div>
                                  <span className="text-xs text-gray-500 dark:text-gray-400 min-w-[70px] text-right">2018-2019</span>
                                </li>
                                <li className="flex items-end">
                                  <div className="flex items-start gap-1 flex-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 dark:bg-indigo-400 mt-1.5"></div>
                                    <span className="text-gray-700 dark:text-gray-200">优秀班干部</span>
                                  </div>
                                  <span className="text-xs text-gray-500 dark:text-gray-400 min-w-[70px] text-right">2021-2022</span>
                                </li>
                              </ul>
                            </div>
                            
                            <div className="bg-indigo-50/80 dark:bg-gray-800/50 p-6 rounded-2xl border border-indigo-100 dark:border-indigo-500/20 hover:shadow-md transition-all">
                              <div className="flex items-center gap-2 mb-2">
                                <User className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />
                                <h5 className="font-medium text-lg text-gray-900 dark:text-white">担任职务</h5>
                              </div>
                              <p className="text-gray-700 dark:text-gray-200 text-justify">
                                2020-2022学年任班级班长，负责班级事务管理，组织实施班级活动
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </section>

            {/* 技能 Section */}
            <section id="skills" className="pt-16 pb-6 animate-slide-in relative">
              <div className="absolute inset-0 full-width-bg bg-transparent"></div>
              <div className="container max-w-[1440px] mx-auto px-4 relative z-10">
                <div className="flex items-center justify-center gap-2 mb-8">
                  <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">技能专长</h2>
                </div>

                {/* 环绕技能展示 */}
                <div className="mb-12">
                  <div className="relative flex flex-col md:flex-row">
                    <div className="flex justify-center md:w-1/2 w-full">
                      <SkillsOrbit 
                        skills={orbitSkills} 
                        centerNode={{ 
                          name: "核心技能", 
                          icon: <Code className="h-8 w-8 text-indigo-600 dark:text-purple-300" /> 
                        }}
                        innerRadius={120}
                        outerRadius={220}
                        rotationSpeed={0.002}
                      />
                    </div>
                    
                    {/* 动态技能详情卡片 - 放在右侧，在小屏幕上改为底部 */}
                    <div className="md:w-1/2 w-full flex items-center justify-center mt-4 md:mt-0">
                      <div className="relative w-full max-w-md min-h-[200px] md:min-h-[200px] h-[250px] flex items-center justify-center overflow-hidden"
                      >
                        {orbitSkills.map((skill) => (
                          <div 
                            key={`detail-${skill.name}`} 
                            id={`skill-detail-${skill.name.replace(/\s+/g, '-').toLowerCase()}`}
                            className="absolute inset-0 opacity-0 pointer-events-none transition-all duration-300 ease-in-out transform translate-x-4 scale-95 bg-white/80 dark:bg-purple-900/60 backdrop-blur-sm rounded-xl p-4 border border-indigo-100 dark:border-purple-500/30 shadow-lg z-10"
                          >
                            <div className="flex items-center gap-3 mb-2">
                              <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-purple-900/80 flex items-center justify-center">
                                {React.cloneElement(skill.icon, { className: "h-4 w-4 text-indigo-600 dark:text-purple-300" })}
                              </div>
                              <div>
                                <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{skill.name}</h3>
                                <div className="flex items-center">
                                  <span className="text-sm px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-purple-800/60 text-indigo-700 dark:text-purple-100">{skill.level}</span>
                                  <span className="ml-2 text-sm text-gray-500 dark:text-gray-300">{skill.category}</span>
                                </div>
              </div>
            </div>

                            <div className="mb-2">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm text-gray-600 dark:text-gray-300">熟练度</span>
                                <span className="text-sm font-medium text-indigo-600 dark:text-purple-300">{skill.value}%</span>
                          </div>
                          <Progress 
                                  value={skill.value} 
                                  className="h-1.5 bg-indigo-100 dark:bg-purple-900/70 [&>div]:bg-gradient-to-r [&>div]:from-indigo-500 [&>div]:to-purple-500 dark:[&>div]:from-purple-500 dark:[&>div]:to-indigo-400"
                          />
                        </div>

                            <p className="text-base leading-tight text-gray-700 dark:text-gray-100 line-clamp-2">{skill.description}</p>
                            
                            {/* 添加装饰性元素 */}
                            <div className="absolute top-4 left-0 transform -translate-x-1 w-1.5 h-6 bg-indigo-500 dark:bg-purple-500 rounded-r-full opacity-80"></div>
                          </div>
                        ))}
                        
                        {/* 默认提示文本 */}
                        <div 
                          id="skill-detail-default"
                          className="flex flex-col items-center justify-center text-center p-4 h-full"
                        >
                          <div className="mb-4 p-4 rounded-full bg-indigo-100/50 dark:bg-purple-900/30">
                            <Code className="h-8 w-8 text-indigo-500/70 dark:text-purple-400/70" />
                          </div>
                          <h3 className="text-xl font-medium text-gray-400 dark:text-gray-500 mb-2">查看技能详情</h3>
                          <p className="text-base text-gray-400 dark:text-gray-500">
                            将鼠标悬停在左侧技能图标上<br/>查看详细信息
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 个人兴趣爱好 */}
                <div className="mt-12">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-6 flex items-center justify-center gap-2">
                    <Heart className="h-5 w-5 text-indigo-500 dark:text-purple-400" />
                    个人兴趣爱好
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* 读书卡片 */}
                    <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-indigo-50 to-white dark:from-purple-900/40 dark:to-purple-800/60 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                      <div className="absolute -right-8 -bottom-8 w-24 h-24 rounded-full bg-indigo-100/80 dark:bg-purple-700/30 group-hover:scale-125 transition-transform duration-500"></div>
                      <div className="absolute left-0 bottom-0 h-1 w-full bg-gradient-to-r from-indigo-500/40 to-purple-500/40"></div>
                      
                      <div className="relative p-5">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="p-3 rounded-lg bg-white/90 dark:bg-purple-900/70 shadow-md flex items-center justify-center">
                            <Book className="h-8 w-8 text-indigo-600 dark:text-purple-300" />
                          </div>
                          <h4 className="font-bold text-xl text-gray-900 dark:text-white">读书</h4>
                        </div>

                        <p className="text-gray-700 dark:text-gray-200 leading-relaxed">
                          对精神分析理论很感兴趣，最近在阅读《拉康论爱》，探索心理学的深层内涵。
                        </p>
                        
                        <div className="flex items-center mt-4">
                          <Badge 
                            variant="outline" 
                            className="bg-indigo-50/50 dark:bg-purple-900/30 text-indigo-600 dark:text-purple-300 border-indigo-200 dark:border-purple-500/30"
                          >
                            <Book className="h-4 w-4 mr-1" />
                            最近阅读：《拉康论爱》
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    {/* 爬山卡片 */}
                    <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-indigo-50 to-white dark:from-purple-900/40 dark:to-purple-800/60 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                      <div className="absolute -right-8 -bottom-8 w-24 h-24 rounded-full bg-indigo-100/80 dark:bg-purple-700/30 group-hover:scale-125 transition-transform duration-500"></div>
                      <div className="absolute left-0 bottom-0 h-1 w-full bg-gradient-to-r from-indigo-500/40 to-purple-500/40"></div>
                      
                      <div className="relative p-5">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="p-3 rounded-lg bg-white/90 dark:bg-purple-900/70 shadow-md flex items-center justify-center">
                            <Mountain className="h-8 w-8 text-indigo-600 dark:text-purple-300" />
                          </div>
                          <h4 className="font-bold text-xl text-gray-900 dark:text-white">爬山</h4>
                        </div>
                        
                        <p className="text-gray-700 dark:text-gray-200 leading-relaxed">
                          由于膝关节损伤和时间安排，近期处于停滞状态，期待康复后继续探索自然美景。
                        </p>
                        
                        <div className="flex items-center justify-between mt-4">
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            <span className="inline-block px-2 py-1 rounded-full bg-indigo-100/70 dark:bg-purple-800/50 text-indigo-700 dark:text-purple-200 mr-2">休整</span>
                            <span className="inline-block px-2 py-1 rounded-full bg-indigo-100/70 dark:bg-purple-800/50 text-indigo-700 dark:text-purple-200">康复中</span>
                          </div>
                          <div className="text-indigo-500 dark:text-purple-300 text-sm font-medium">75%</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* 烹饪卡片 */}
                    <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-indigo-50 to-white dark:from-purple-900/40 dark:to-purple-800/60 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                      <div className="absolute -right-8 -bottom-8 w-24 h-24 rounded-full bg-indigo-100/80 dark:bg-purple-700/30 group-hover:scale-125 transition-transform duration-500"></div>
                      <div className="absolute left-0 bottom-0 h-1 w-full bg-gradient-to-r from-indigo-500/40 to-purple-500/40"></div>
                      
                      <div className="relative p-5">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="p-3 rounded-lg bg-white/90 dark:bg-purple-900/70 shadow-md flex items-center justify-center">
                            <Utensils className="h-8 w-8 text-indigo-600 dark:text-purple-300" />
                          </div>
                          <h4 className="font-bold text-xl text-gray-900 dark:text-white">烹饪</h4>
                        </div>

                        <p className="text-gray-700 dark:text-gray-200 leading-relaxed">
                          近期正在学习做饭，对自己的要求就是注意安全，不炸厨房。从简单菜品开始尝试。
                        </p>
                        
                        <div className="mt-4 flex items-center">
                          <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-3">
                            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 dark:from-purple-500 dark:to-indigo-400 h-2 rounded-full" style={{ width: '30%' }}></div>
                          </div>
                          <span className="text-indigo-600 dark:text-purple-300 font-bold">初学者</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            </div>
        </section>

        {/* 联系方式部分 - 直接与技能专长相同层级 */}
        <section id="contact" className="py-16 bg-white dark:bg-gray-900 w-full">
          <div className="container max-w-[1440px] mx-auto px-4">
            <div className="flex items-center justify-center gap-2 mb-8">
              <Mail className="h-6 w-6 text-indigo-500 dark:text-purple-400" />
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">联系我</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6 flex-grow">
              {/* 左侧联系信息 */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300">
                <div className="space-y-6">
                  {/* 邮箱 */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-indigo-100 dark:bg-purple-800/60 flex items-center justify-center flex-shrink-0">
                      <Mail className="h-6 w-6 text-indigo-600 dark:text-purple-300" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">电子邮箱</h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-2">工作日内24小时回复</p>
                      <a 
                        href="mailto:1159680834@qq.com" 
                        className="text-indigo-600 dark:text-purple-300 hover:underline flex items-center gap-1"
                      >
                        1159680834@qq.com
                        <ChevronRight className="h-4 w-4" />
                      </a>
                    </div>
                  </div>

                  {/* 电话 */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-indigo-100 dark:bg-purple-800/60 flex items-center justify-center flex-shrink-0">
                      <Phone className="h-6 w-6 text-indigo-600 dark:text-purple-300" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">联系电话</h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-2">周一至周日 9:00-22:00</p>
                      <a 
                        href="tel:15035421059" 
                        className="text-indigo-600 dark:text-purple-300 hover:underline flex items-center gap-1"
                      >
                        +86 150-3542-1059
                        <ChevronRight className="h-4 w-4" />
                      </a>
                    </div>
                  </div>

                  {/* GitHub */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-indigo-100 dark:bg-purple-800/60 flex items-center justify-center flex-shrink-0">
                      <svg
                        viewBox="0 0 24 24"
                        className="h-6 w-6 text-indigo-600 dark:text-purple-300"
                        fill="currentColor"
                      >
                        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.463 2 11.97c0 4.404 2.865 8.14 6.839 9.458.5.092.682-.216.682-.48 0-.236-.008-.864-.013-1.695-2.782.602-3.369-1.337-3.369-1.337-.454-1.151-1.11-1.458-1.11-1.458-.908-.618.069-.606.069-.606 1.003.07 1.531 1.027 1.531 1.027.892 1.524 2.341 1.084 2.91.828.092-.643.35-1.083.636-1.332-2.22-.251-4.555-1.107-4.555-4.927 0-1.088.39-1.979 1.029-2.675-.103-.252-.446-1.266.098-2.638 0 0 .84-.268 2.75 1.022A9.607 9.607 0 0112 6.82c.85.004 1.705.114 2.504.336 1.909-1.29 2.747-1.022 2.747-1.022.546 1.372.202 2.386.1 2.638.64.696 1.028 1.587 1.028 2.675 0 3.83-2.339 4.673-4.566 4.92.359.307.678.915.678 1.846 0 1.332-.012 2.407-.012 2.734 0 .267.18.577.688.48 3.97-1.32 6.833-5.054 6.833-9.458C22 6.463 17.522 2 12 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">GitHub</h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-2">查看我的网站项目</p>
                      <a 
                        href="https://github.com/REN1675/REN1675.github.io" 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 dark:text-purple-300 hover:underline flex items-center gap-1"
                      >
                        github.com/REN1675
                        <ChevronRight className="h-4 w-4" />
                      </a>
                    </div>
                  </div>

                  {/* 地址 - 更新城市 */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-indigo-100 dark:bg-purple-800/60 flex items-center justify-center flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600 dark:text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">当前所在地</h3>
                      <p className="text-gray-600 dark:text-gray-300">山西省 大同市</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 右侧快捷操作 */}
              <div className="hidden sm:block bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300">
                <div className="text-center mb-8">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 dark:from-purple-500 dark:to-indigo-400 mx-auto mb-6 flex items-center justify-center shadow-lg">
                    <Mail className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">快速联系</h3>
                  <p className="text-lg text-gray-700 dark:text-gray-200 mb-6">
                    选择以下方式立即联系我，期待与您的交流
                  </p>
                </div>

                <div className="space-y-4">
                  <Button 
                    className="w-full transform hover:scale-105 active:scale-95 transition-all duration-200 bg-indigo-600 hover:bg-indigo-700 dark:bg-purple-600 dark:hover:bg-purple-700 text-white text-xl py-6"
                    onClick={() => window.location.href = 'mailto:1159680834@qq.com'}
                  >
                    <Mail className="mr-2 h-6 w-6" />
                    发送邮件
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full transform hover:scale-105 active:scale-95 transition-all duration-200 text-indigo-700 dark:text-white bg-indigo-50/50 dark:bg-purple-900/30 border-indigo-200 dark:border-purple-500/30 text-xl py-6"
                    onClick={() => window.location.href = 'tel:15035421059'}
                  >
                    <Phone className="mr-2 h-6 w-6" />
                    拨打电话
                  </Button>
                </div>

                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    工作日内会在24小时内回复
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 页脚部分 */}
      <footer className="py-5 border-t border-indigo-200 dark:border-purple-500/20 bg-white dark:bg-gray-900">
        <div className="container max-w-[1440px] mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">© {new Date().getFullYear()} 任瑜瑜. 保留所有权利.</div>
            
            <div className="flex items-center space-x-4">
              <a 
                href="https://github.com/REN1675" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-purple-400 transition-colors"
                aria-label="GitHub"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.463 2 11.97c0 4.404 2.865 8.14 6.839 9.458.5.092.682-.216.682-.48 0-.236-.008-.864-.013-1.695-2.782.602-3.369-1.337-3.369-1.337-.454-1.151-1.11-1.458-1.11-1.458-.908-.618.069-.606.069-.606 1.003.07 1.531 1.027 1.531 1.027.892 1.524 2.341 1.084 2.91.828.092-.643.35-1.083.636-1.332-2.22-.251-4.555-1.107-4.555-4.927 0-1.088.39-1.979 1.029-2.675-.103-.252-.446-1.266.098-2.638 0 0 .84-.268 2.75 1.022A9.607 9.607 0 0112 6.82c.85.004 1.705.114 2.504.336 1.909-1.29 2.747-1.022 2.747-1.022.546 1.372.202 2.386.1 2.638.64.696 1.028 1.587 1.028 2.675 0 3.83-2.339 4.673-4.566 4.92.359.307.678.915.678 1.846 0 1.332-.012 2.407-.012 2.734 0 .267.18.577.688.48 3.97-1.32 6.833-5.054 6.833-9.458C22 6.463 17.522 2 12 2z" />
                </svg>
              </a>
              <a 
                href="mailto:1159680834@qq.com" 
                className="text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-purple-400 transition-colors"
                aria-label="邮箱"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </a>
              <a 
                href="tel:15035421059" 
                className="text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-purple-400 transition-colors"
                aria-label="电话"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
