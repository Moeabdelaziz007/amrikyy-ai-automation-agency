# 🚀 Amrikyy AI Automation Agency

> **Revolutionizing AI with Advanced Automation Solutions**

[![Next.js](https://img.shields.io/badge/Next.js-14.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.2-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-10.16-black?style=for-the-badge&logo=framer)](https://www.framer.com/motion/)

## ✨ Features

### 🤖 **AI Agents**
- **Content Creator** - Generates high-quality content for blogs, social media, and marketing
- **Code Generator** - Creates, reviews, and optimizes code across multiple languages
- **Research Assistant** - Conducts comprehensive research and data analysis
- **Design Creator** - Generates visual designs and creative assets
- **Data Analyst** - Processes and analyzes large datasets
- **Quantum Processor** - Leverages quantum computing principles

### 🎨 **Visual Enhancements**
- **Floating Particles Animation** - Dynamic particle effects
- **Enhanced Gradient Text** - Beautiful text gradients with animations
- **Neon Glow Borders** - Glowing border effects with hover animations
- **Dashboard Stats Cards** - Interactive stat cards with animations
- **Hero Animation Effects** - Comprehensive hero section animations
- **Scanning Lines** - Animated scanning line effects
- **Pulsing Orbs** - Floating orb animations
- **Grid Pattern Overlay** - Subtle grid background pattern

### 🔒 **Enterprise Security**
- **JWT Authentication** - Secure token-based auth
- **2FA TOTP** - Two-factor authentication
- **Refresh Token Revocation** - Database-backed revocation
- **Audit Logging** - ELK + BigQuery + File logging
- **SSO Integration** - Google, Microsoft, Keycloak, Auth0
- **Rate Limiting** - API protection
- **Security Headers** - CSP, HSTS, and more

### 🚀 **Performance**
- **Next.js 14** - App Router with Server Components
- **Framer Motion** - Smooth animations
- **SWR** - Data fetching and caching
- **Tailwind CSS** - Utility-first styling
- **TypeScript** - Type safety
- **ESLint + Prettier** - Code quality

## 🛠️ Tech Stack

### **Frontend**
- **Next.js 14** - React framework with App Router
- **React 18** - UI library with Server Components
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **SWR** - Data fetching and caching
- **next-themes** - Theme management

### **Backend**
- **Python Flask** - Web framework
- **Socket.IO** - Real-time communication
- **Supabase** - PostgreSQL database
- **JWT** - Authentication tokens
- **TOTP** - Two-factor authentication
- **Winston** - Logging framework

### **Security**
- **JWT** - JSON Web Tokens
- **TOTP** - Time-based One-Time Passwords
- **bcrypt** - Password hashing
- **CSP** - Content Security Policy
- **HSTS** - HTTP Strict Transport Security
- **Rate Limiting** - API protection

### **DevOps**
- **Vercel** - Frontend hosting
- **GitHub Actions** - CI/CD pipeline
- **Docker** - Containerization
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Jest** - Testing framework

## 🚀 Quick Start

### **Prerequisites**
- Node.js 18+ 
- npm 9+
- Python 3.8+
- PostgreSQL 13+

### **Installation**

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/amrikyy-ai-automation-agency.git
   cd amrikyy-ai-automation-agency
   ```

2. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   # Edit .env.local with your actual values
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   ```
   http://localhost:3000
   ```

## 🎨 Visual Enhancements

### **Floating Particles Animation**
- **Dynamic particle effects** with customizable colors and sizes
- **Smooth animations** with easing and delays
- **Performance optimized** with efficient rendering
- **Customizable parameters** for count, speed, and opacity

### **Enhanced Gradient Text**
- **Multiple variants** (primary, secondary, cyber, electric, warning)
- **Size options** from sm to 5xl
- **Weight variations** from normal to extrabold
- **Smooth animations** with hover effects

### **Neon Glow Borders**
- **Multiple color variants** (neon-green, cyber-blue, electric-purple, etc.)
- **Intensity levels** (low, medium, high)
- **Animated effects** with hover interactions
- **Customizable glow** with different shadow intensities

### **Agent Card Enhancements**
- **Advanced hover effects** with 3D transforms and spring animations
- **Pulsing status indicators** for active agents with glowing rings
- **Animated type icons** with rotation and glow effects
- **Interactive capabilities** with hover scaling and color changes
- **Enhanced action buttons** with shimmer effects and gradient animations
- **Corner accent animations** that appear on hover
- **Floating particles** that animate when hovering over cards
- **Smooth transitions** with spring physics and easing

### **Hero Animation Effects**
- **Comprehensive animations** including particles, lines, and orbs
- **Grid pattern overlay** for depth
- **Scanning lines** for futuristic feel
- **Pulsing orbs** for ambient lighting
- **Animated text glow** for emphasis

## 🎨 Component Examples

### **StatCard Component**
```tsx
<StatCard
  title="Active Agents"
  value={6}
  trend="+12% this month"
  icon={<span className="text-xl">🤖</span>}
  color="bg-gradient-to-r from-neon-green to-cyber-blue"
  description="Total AI agents deployed"
/>
```

### **GradientText Component**
```tsx
<GradientText variant="primary" size="4xl" weight="bold">
  Amrikyy AI Automation Agency
</GradientText>
```

### **NeonBorder Component**
```tsx
<NeonBorder variant="neon-green" intensity="high" animated>
  <div className="p-6">
    <h3>Enhanced Card</h3>
    <p>With neon border effects</p>
  </div>
</NeonBorder>
```

### **Agent Card Component**
```tsx
<AgentCard
  agent={{
    id: 'content-agent',
    name: 'Content Creator',
    description: 'Generates high-quality content for blogs, social media, and marketing materials.',
    status: 'active',
    type: 'content',
    capabilities: ['Blog Writing', 'Social Media', 'SEO Optimization'],
    successRate: 95
  }}
  isActive={true}
  onRunAgent={(id) => console.log('Running agent:', id)}
  onViewDetails={(id) => console.log('Viewing details:', id)}
/>
```

### **OptimizedImage Component**
```tsx
<OptimizedImage
  src="/images/hero-bg.webp"
  alt="Hero Background"
  width={1920}
  height={1080}
  priority={true}
  placeholder="data:image/svg+xml;base64,..."
  fallback="/images/placeholder.webp"
/>
```

### **LazyLoad Component**
```tsx
<LazyLoad threshold={0.1} rootMargin="50px" delay={200}>
  <ExpensiveComponent />
</LazyLoad>

<LazySection delay={300}>
  <AgentGrid />
</LazySection>

<LazyCard delay={100}>
  <AgentCard agent={agent} />
</LazyCard>
```

### **PerformanceMonitor Component**
```tsx
<PerformanceMonitor />
// Automatically monitors and displays:
// - First Contentful Paint (FCP)
// - Largest Contentful Paint (LCP)
// - Time to First Byte (TTFB)
// - Bundle Size
```

### **Color Palette**
```scss
:root {
  --neon-green: #00ff41;
  --carbon-black: #0a0a0a;
  --medium-gray: #1a1a1a;
  --cyber-blue: #0066ff;
  --electric-purple: #8b5cf6;
}
```

### **Gradients**
```scss
.gradient-primary {
  background: linear-gradient(135deg, #00ff41 0%, #0066ff 100%);
}

.gradient-secondary {
  background: linear-gradient(135deg, #8b5cf6 0%, #2d1b4e 100%);
}
```

## 🎨 Animation Examples

### **CSS Animation Classes**
```css
/* Floating particles */
.animate-float-particles {
  animation: float-particles 6s ease-in-out infinite;
}

/* Neon glow effect */
.animate-neon-glow {
  animation: neon-glow 2s ease-in-out infinite;
}

/* Gradient shift */
.animate-gradient-shift {
  background-size: 200% 200%;
  animation: gradient-shift 3s ease infinite;
}

/* Scanning line */
.animate-scan-line {
  animation: scan-line 4s ease-in-out infinite;
}
```

### **Agent Card Animation Classes**
```html
<!-- Agent card hover effect -->
<div class="animate-agent-card-hover">Agent Card</div>

<!-- Pulsing status indicator -->
<div class="animate-agent-pulse">Active Status</div>

<!-- Shimmer effect on buttons -->
<div class="animate-agent-shimmer">Shimmer Button</div>

<!-- Corner accent animation -->
<div class="animate-agent-corner-accent">Corner Accent</div>

<!-- Floating particles on hover -->
<div class="animate-agent-floating-particle">Floating Particle</div>
```

## 🚀 Performance Optimizations

### **Animation Performance**
- **Hardware acceleration** for smooth animations
- **Efficient rendering** with optimized particle systems
- **Reduced motion** support for accessibility
- **Performance monitoring** with FPS tracking

### **CSS Bundle Size Optimization**
- **Tailwind CSS Purging** - Removes unused CSS in production
- **Consolidated Animations** - Reduced keyframes and animation classes
- **Tree-shaking** - Eliminates dead code from bundle
- **Safelist Critical Classes** - Preserves dynamically generated classes

### **Image Optimization**
- **WebP Format Support** - 25-35% better compression than JPEG
- **AVIF Format Support** - Next-generation image format
- **Responsive Images** - Multiple sizes for different devices
- **Lazy Loading** - Images load only when needed
- **Placeholder Support** - Smooth loading experience

### **Lazy Loading Implementation**
- **Intersection Observer** - Efficient viewport detection
- **Staggered Loading** - Prevents overwhelming the browser
- **Fallback Components** - Loading states for better UX
- **Customizable Thresholds** - Fine-tune loading behavior

### **Bundle Analysis & Monitoring**
- **Bundle Analyzer** - Visual bundle size analysis
- **Performance Metrics** - Real-time performance monitoring
- **Code Splitting** - Optimized chunk loading
- **Webpack Optimization** - Advanced build optimizations

### **Caching Strategy**
- **SWR caching** for data fetching
- **Static generation** for better performance
- **CDN optimization** with Vercel Edge Network
- **Service worker** for offline support

## ♿ Accessibility Features

### **Visual Accessibility**
- **High contrast mode** support
- **Reduced motion** for users with vestibular disorders
- **Color blind friendly** color palette
- **Focus indicators** for keyboard navigation

### **Screen Reader Support**
- **Semantic HTML** structure
- **ARIA labels** for interactive elements
- **Alt text** for images and icons
- **Live regions** for dynamic content

### **Keyboard Navigation**
- **Tab order** optimization
- **Keyboard shortcuts** for common actions
- **Focus management** for modals and overlays
- **Escape key** handling for dismissible elements

## 🔒 Security Features

### **Authentication**
- JWT-based authentication
- Refresh token rotation
- Database-backed revocation
- Short-lived access tokens (15 minutes)
- Long-lived refresh tokens (7 days)

### **Two-Factor Authentication**
- TOTP secret generation
- QR code creation
- Backup codes with encryption
- Time window validation
- Admin enforcement

### **Audit Logging**
- ELK Stack integration
- BigQuery support
- File-based logging
- Comprehensive event tracking
- Real-time monitoring

### **SSO Integration**
- Google OAuth
- Microsoft Azure AD
- Keycloak
- Auth0

## 🧪 Testing

### **Run Tests**
```bash
# Unit tests
npm test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage

# Security tests
npm run test:security
```

### **Test Structure**
```
tests/
├── security/
│   ├── tokenRevocation.test.ts
│   ├── twoFactorAuth.test.ts
│   └── auditLogger.test.ts
├── components/
│   ├── AgentCard.test.tsx
│   └── Dashboard.test.tsx
└── utils/
    └── helpers.test.ts
```

## 🚀 Deployment

### **Vercel Deployment**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel --prod
```

### **Environment Variables**
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
GEMINI_API_KEY=your_gemini_key
NEXT_PUBLIC_PY_BACKEND_URL=your_backend_url
NEXT_PUBLIC_APP_URL=your_app_url
```

## 📁 Project Structure

```
amrikyy-ai-automation-agency/
├── frontend/
│   ├── app/
│   │   ├── hero/
│   │   │   └── page.tsx
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── agents/
│   │   │   └── AgentCard.tsx
│   │   ├── stats/
│   │   │   └── StatCard.tsx
│   │   ├── ui/
│   │   │   ├── GradientText.tsx
│   │   │   └── NeonBorder.tsx
│   │   ├── animations/
│   │   │   ├── HeroAnimation.tsx
│   │   │   └── FloatingParticles.tsx
│   │   ├── theme-provider.tsx
│   │   └── index.ts
│   ├── styles/
│   │   └── theme-enhanced.scss
│   ├── lib/
│   │   └── security/
│   ├── tests/
│   │   └── security/
│   ├── package.json
│   ├── tailwind.config.js
│   ├── next.config.js
│   └── tsconfig.json
├── migrations/
│   └── 001_create_refresh_token_revocation.sql
├── .github/
│   └── workflows/
│       └── security.yml
├── vercel.json
└── README.md
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team** - For the amazing React framework
- **Tailwind CSS** - For the utility-first CSS framework
- **Framer Motion** - For the smooth animations
- **Supabase** - For the backend infrastructure
- **Vercel** - For the hosting platform

## 📞 Support

- **Documentation** - [docs.amrikyy-ai.com](https://docs.amrikyy-ai.com)
- **Issues** - [GitHub Issues](https://github.com/your-username/amrikyy-ai-automation-agency/issues)
- **Discord** - [Join our community](https://discord.gg/amrikyy-ai)
- **Email** - support@amrikyy-ai.com

---

**Built with ❤️ by the Amrikyy AI Team**

*Revolutionizing AI with Advanced Automation Solutions*

## 🎉 What's New in This Version

### **Visual Enhancements (v2.0)**
- ✅ **Floating Particles Animation** - Dynamic particle effects
- ✅ **Enhanced Gradient Text** - Beautiful text gradients with animations
- ✅ **Neon Glow Borders** - Glowing border effects with hover animations
- ✅ **Dashboard Stats Cards** - Interactive stat cards with animations
- ✅ **Agent Card Enhancements** - Advanced hover effects with 3D transforms
- ✅ **Pulsing Status Indicators** - Animated status indicators for active agents
- ✅ **Interactive Capabilities** - Hover effects on capability tags
- ✅ **Enhanced Action Buttons** - Shimmer effects and gradient animations
- ✅ **Corner Accent Animations** - Animated corner accents on hover
- ✅ **CSS Bundle Size Optimization** - Tailwind purging and tree-shaking
- ✅ **Image Optimization** - WebP/AVIF support with lazy loading
- ✅ **Lazy Loading Implementation** - Intersection Observer for performance
- ✅ **Bundle Analysis Tools** - Visual bundle size analysis
- ✅ **Performance Monitoring** - Real-time performance metrics
- ✅ **Hero Animation Effects** - Comprehensive hero section animations
- ✅ **Scanning Lines** - Animated scanning line effects
- ✅ **Pulsing Orbs** - Floating orb animations
- ✅ **Grid Pattern Overlay** - Subtle grid background pattern

### **Performance Improvements**
- ✅ **Hardware acceleration** for smooth animations
- ✅ **Efficient rendering** with optimized particle systems
- ✅ **Reduced motion** support for accessibility
- ✅ **Bundle optimization** with tree shaking

### **Accessibility Features**
- ✅ **High contrast mode** support
- ✅ **Screen reader** compatibility
- ✅ **Keyboard navigation** optimization
- ✅ **Focus management** for better UX

### **Security Enhancements**
- ✅ **JWT Authentication** with token rotation
- ✅ **2FA TOTP** implementation
- ✅ **Refresh Token Revocation** database
- ✅ **Audit Logging** with ELK + BigQuery
- ✅ **SSO Integration** (Google, Microsoft, Keycloak, Auth0)
- ✅ **Rate Limiting** and security headers

---

**Ready for production deployment with all visual enhancements and security features!** 🚀

## 🎉 What's New in This Version

### **Visual Enhancements (v2.0)**
- ✅ **Floating Particles Animation** - Dynamic particle effects
- ✅ **Enhanced Gradient Text** - Beautiful text gradients with animations
- ✅ **Neon Glow Borders** - Glowing border effects with hover animations
- ✅ **Dashboard Stats Cards** - Interactive stat cards with animations
- ✅ **Agent Card Enhancements** - Advanced hover effects with 3D transforms
- ✅ **Pulsing Status Indicators** - Animated status indicators for active agents
- ✅ **Interactive Capabilities** - Hover effects on capability tags
- ✅ **Enhanced Action Buttons** - Shimmer effects and gradient animations
- ✅ **Corner Accent Animations** - Animated corner accents on hover
- ✅ **CSS Bundle Size Optimization** - Tailwind purging and tree-shaking
- ✅ **Image Optimization** - WebP/AVIF support with lazy loading
- ✅ **Lazy Loading Implementation** - Intersection Observer for performance
- ✅ **Bundle Analysis Tools** - Visual bundle size analysis
- ✅ **Performance Monitoring** - Real-time performance metrics
- ✅ **Hero Animation Effects** - Comprehensive hero section animations
- ✅ **Scanning Lines** - Animated scanning line effects
- ✅ **Pulsing Orbs** - Floating orb animations
- ✅ **Grid Pattern Overlay** - Subtle grid background pattern

### **Performance Improvements**
- ✅ **Hardware acceleration** for smooth animations
- ✅ **Efficient rendering** with optimized particle systems
- ✅ **Reduced motion** support for accessibility
- ✅ **Bundle optimization** with tree shaking

### **Accessibility Features**
- ✅ **High contrast mode** support
- ✅ **Screen reader** compatibility
- ✅ **Keyboard navigation** optimization
- ✅ **Focus management** for better UX

### **Security Enhancements**
- ✅ **JWT Authentication** with token rotation
- ✅ **2FA TOTP** implementation
- ✅ **Refresh Token Revocation** database
- ✅ **Audit Logging** with ELK + BigQuery
- ✅ **SSO Integration** (Google, Microsoft, Keycloak, Auth0)
- ✅ **Rate Limiting** and security headers

---

**Ready for production deployment with all visual enhancements and security features!** 🚀
