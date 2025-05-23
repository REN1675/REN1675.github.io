# 任瑜瑜个人网站

这是任瑜瑜的个人展示网站，采用现代化前端技术栈开发，用于展示个人信息、工作经历、教育背景、技能专长和联系方式等。

## 网站特色

- 🎨 精美的UI设计，支持亮色/暗色主题一键切换，智能跟随系统主题偏好设置
- 📱 完全响应式布局，在各种设备上都能良好展示
- 🚀 流畅的动画效果和交互体验
- 🛠️ 模块化设计，各个内容板块清晰分明
- 🔍 优化的页面结构，方便访问者快速找到需要的信息
- 🌱 随滚动生长的树苗动画，增添页面活力

## 主题功能说明

网站提供了深色和浅色主题切换功能，并会根据用户系统设置自动适应最佳显示模式：

- **智能跟随系统主题**：网站优先检测并应用用户设备的主题偏好
- **手动切换主题**：用户可随时通过右上角的主题切换按钮更改显示模式
- **记忆用户设置**：网站会记住用户的主题偏好，下次访问时自动应用
- **适配所有移动设备**：兼容iOS和Android设备的深色/浅色模式，确保颜色始终正确显示
- **适配移动设备**：针对移动设备进行了特别优化，确保在手机浅色/深色模式下都能正确显示

## 主要内容板块

- **个人简介** - 基本信息和专业背景简述
- **实习经历** - 详细的工作职责、成果和贡献
  - 京东科技 - 客户体验与服务部（山西分中心）
  - 康明斯(中国)投资有限公司 - 大马力客户服务支持
- **教育背景** - 学历信息、荣誉奖项和学术成就
  - 山西大学 - 外国哲学（硕士）
  - 厦门理工学院 - 通信工程（本科）
- **技能专长** - 技术能力和专业技能的可视化展示
- **兴趣爱好** - 个人生活和兴趣的展示
- **联系方式** - 多种渠道的联系信息

## 技术栈

- **前端框架**: Next.js
- **UI组件**: Radix UI + 自定义组件
- **样式解决方案**: Tailwind CSS
- **类型系统**: TypeScript
- **动画效果**: CSS 动画 + React 状态过渡
- **部署平台**: GitHub Pages
- **主题管理**: next-themes + 自定义主题系统

## 项目结构

```
├── app/          # Next.js 应用程序目录
├── components/   # React 组件
│   ├── ui/       # 基础UI组件
│   ├── GrowingPlant.tsx # 滚动生长树苗动画组件
│   └── ...       # 业务组件
├── lib/          # 工具函数和配置
└── public/       # 静态资源与图片
```

## 部署信息

本网站通过GitHub Actions自动部署到GitHub Pages：

- **访问地址**: [https://ren1675.github.io](https://ren1675.github.io)
- **部署方式**: 推送到main分支后自动触发构建和部署
- **构建工具**: Next.js静态网站生成

## 最近更新

- **2023-XX-XX**: 优化主题切换系统，解决移动设备深色/浅色模式适配问题
- **2023-XX-XX**: 添加渐变背景和动画效果，提升视觉体验
- **2023-XX-XX**: 初始版本发布
