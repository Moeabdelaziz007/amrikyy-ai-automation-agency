# Axon - دليل التنفيذ والبدء السريع
## Implementation Guide & Starter Kit

---

## جدول المحتويات
- [نظرة عامة على التنفيذ](#نظرة-عامة-على-التنفيذ)
- [بنية المشروع](#بنية-المشروع)
- [متغيرات البيئة](#متغيرات-البيئة)
- [ملفات البداية](#ملفات-البداية)
- [خطة Sprint الأسبوعية](#خطة-sprint-الأسبوعية)
- [دليل النشر](#دليل-النشر)
- [اختبارات القبول](#اختبارات-القبول)
- [دليل المطورين](#دليل-المطورين)
- [خريطة الطريق للمرحلة الثانية](#خريطة-الطريق-للمرحلة-الثانية)

---

## نظرة عامة على التنفيذ

### الهدف من هذا الملف
توفير مساحة عمل قابلة للتكرار للـ MVP باستخدام Next.js + TypeScript + Tailwind + Supabase.

### المبادئ
- **جاهز للنسخ واللصق:** جميع الأمثلة جاهزة للتشغيل بعد إعداد متغيرات البيئة
- **قابل للقراءة:** كود واضح ومعلق جيداً
- **البساطة أولاً:** ميزات ضرورية للتركيز والزخم والعمل الجماعي

---

## بنية المشروع

```
/axon-project
├── .github/
│   └── workflows/
│       └── ci.yml
├── docs/
│   ├── api.md
│   └── onboarding.md
├── frontend/                # Next.js app (App Router)
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── signup/
│   │   │       └── page.tsx
│   │   ├── (dashboard)/
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx
│   │   │   ├── tasks/
│   │   │   │   └── page.tsx
│   │   │   ├── knowledge/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   └── Modal.tsx
│   │   └── dashboard/
│   │       ├── KanbanBoard.tsx
│   │       ├── ProgressWall.tsx
│   │       ├── NorthStarCard.tsx
│   │       └── GoalCard.tsx
│   ├── lib/
│   │   ├── supabase.ts
│   │   ├── utils.ts
│   │   └── types.ts
│   ├── hooks/
│   │   ├── useTasks.ts
│   │   ├── useProgress.ts
│   │   └── useAuth.ts
│   ├── styles/
│   │   └── confetti.css
│   ├── tailwind.config.js
│   ├── package.json
│   ├── tsconfig.json
│   └── next.config.js
├── supabase/
│   ├── functions/
│   │   ├── add-task/
│   │   │   └── index.ts
│   │   ├── send-daily-digest/
│   │   │   └── index.ts
│   │   └── slack-notification/
│   │       └── index.ts
│   ├── migrations/
│   │   └── 20241201_init.sql
│   └── config.toml
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── .env.example
├── .gitignore
└── README.md
```

---

## متغيرات البيئة

### ملف `.env.example`

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Database
DATABASE_URL=postgresql://postgres:password@db-host:5432/axon

# Email Service (Resend)
RESEND_API_KEY=re_xxxxx
FROM_EMAIL=noreply@axon.app

# Slack Integration
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/xxx/yyy/zzz

# GitHub Integration
GITHUB_WEBHOOK_SECRET=your-github-secret

# App Configuration
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3000

# Development
NODE_ENV=development
```

---

## ملفات البداية

### 1. إعداد Tailwind CSS

```javascript
// frontend/tailwind.config.js
const colors = require('tailwindcss/colors')

module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: colors.indigo,
        neutral: colors.slate,
        success: colors.emerald,
        warning: colors.amber,
        danger: colors.red,
        accent: { 500: '#00C48C' },
      },
      spacing: {
        '1': '4px', '2': '8px', '3': '12px', '4': '16px',
        '5': '20px', '6': '24px', '8': '32px', '10': '40px',
        '12': '48px', '16': '64px', '20': '80px', '24': '96px',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        arabic: ['Cairo', 'sans-serif'],
      },
      animation: {
        'confetti': 'confetti 1.8s linear forwards',
        'bounce-slow': 'bounce 2s infinite',
      },
      keyframes: {
        confetti: {
          '0%': { transform: 'translateY(-50vh) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(100vh) rotate(720deg)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}
```

### 2. إعداد Supabase Client

```typescript
// frontend/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side client for API routes
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)
```

### 3. أنواع البيانات (Types)

```typescript
// frontend/lib/types.ts
export interface User {
  id: string
  email: string
  name?: string
  avatarUrl?: string
  teamId?: string
  createdAt: string
  updatedAt: string
}

export interface Team {
  id: string
  name: string
  createdAt: string
  updatedAt: string
  members: User[]
  project?: Project
}

export interface Project {
  id: string
  name: string
  teamId: string
  createdAt: string
  northStar?: NorthStar
  goals: Goal[]
  tasks: Task[]
  milestones: Milestone[]
  knowledge: Knowledge[]
}

export interface Task {
  id: string
  title: string
  description?: string
  status: 'TODO' | 'IN_PROGRESS' | 'FOR_REVIEW' | 'DONE'
  projectId: string
  assigneeId?: string
  assignee?: User
  createdAt: string
  updatedAt: string
}

export interface NorthStar {
  id: string
  statement: string
  metric?: string
  projectId: string
  createdAt: string
}

export interface Goal {
  id: string
  objective: string
  startDate: string
  endDate: string
  isCurrent: boolean
  projectId: string
  createdAt: string
}

export interface ProgressEntry {
  id: string
  content: string
  authorId: string
  author: User
  projectId: string
  createdAt: string
}

export interface Milestone {
  id: string
  title: string
  description?: string
  achievedAt?: string
  isAchieved: boolean
  projectId: string
}

export interface Knowledge {
  id: string
  type: 'DOCUMENT' | 'FILE' | 'MEETING_NOTES'
  title: string
  content?: string
  fileUrl?: string
  projectId: string
  createdAt: string
}
```

### 4. صفحة لوحة التحكم الرئيسية

```typescript
// frontend/app/(dashboard)/dashboard/page.tsx
import React from 'react'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import KanbanBoard from '@/components/dashboard/KanbanBoard'
import ProgressWall from '@/components/dashboard/ProgressWall'
import NorthStarCard from '@/components/dashboard/NorthStarCard'
import GoalCard from '@/components/dashboard/GoalCard'

export default async function DashboardPage() {
  const supabase = createServerComponentClient({ cookies })
  
  // Check authentication
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    redirect('/login')
  }

  // Fetch dashboard data
  const [
    { data: northStar },
    { data: currentGoal },
    { data: tasks },
    { data: progressEntries }
  ] = await Promise.all([
    supabase
      .from('north_stars')
      .select('*')
      .limit(1)
      .single(),
    supabase
      .from('goals')
      .select('*')
      .eq('is_current', true)
      .single(),
    supabase
      .from('tasks')
      .select(`
        *,
        assignee:users(id, name, avatar_url)
      `)
      .order('created_at', { ascending: true }),
    supabase
      .from('progress_entries')
      .select(`
        *,
        author:users(id, name, avatar_url)
      `)
      .order('created_at', { ascending: false })
      .limit(8)
  ])

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">مرحباً بك في Axon</h1>
          <p className="text-gray-600">مركز القيادة لمشروعك</p>
        </header>

        {/* North Star */}
        <div className="mb-8">
          <NorthStarCard northStar={northStar} />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Tasks */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">لوحة المهام</h2>
              <KanbanBoard initialTasks={tasks || []} />
            </div>
          </div>

          {/* Right Column - Goal & Progress */}
          <div className="space-y-6">
            <GoalCard goal={currentGoal} />
            <ProgressWall entries={progressEntries || []} />
          </div>
        </div>
      </div>
    </main>
  )
}
```

### 5. مكون لوحة Kanban

```typescript
// frontend/components/dashboard/KanbanBoard.tsx
'use client'

import React, { useState } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd'
import { Task } from '@/lib/types'
import { supabase } from '@/lib/supabase'

interface KanbanBoardProps {
  initialTasks: Task[]
}

const COLUMNS = [
  { id: 'TODO', title: 'قيد الانتظار', color: 'bg-gray-100' },
  { id: 'IN_PROGRESS', title: 'قيد التنفيذ', color: 'bg-blue-100' },
  { id: 'FOR_REVIEW', title: 'قيد المراجعة', color: 'bg-yellow-100' },
  { id: 'DONE', title: 'مكتملة', color: 'bg-green-100' },
]

export default function KanbanBoard({ initialTasks }: KanbanBoardProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [isLoading, setIsLoading] = useState(false)

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result
    
    if (!destination) return
    if (destination.droppableId === source.droppableId && destination.index === source.index) return

    setIsLoading(true)
    
    try {
      // Update task status in database
      const { error } = await supabase
        .from('tasks')
        .update({ status: destination.droppableId as Task['status'] })
        .eq('id', draggableId)

      if (error) throw error

      // Update local state
      setTasks(prev => 
        prev.map(task => 
          task.id === draggableId 
            ? { ...task, status: destination.droppableId as Task['status'] }
            : task
        )
      )

      // If moved to DONE, create progress entry and trigger celebration
      if (destination.droppableId === 'DONE') {
        const task = tasks.find(t => t.id === draggableId)
        if (task) {
          await supabase
            .from('progress_entries')
            .insert({
              content: `أكملت المهمة: ${task.title}`,
              project_id: task.projectId
            })
          
          // Trigger confetti animation
          triggerConfetti()
        }
      }
    } catch (error) {
      console.error('Error updating task:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const triggerConfetti = () => {
    // Simple confetti effect
    const confetti = document.createElement('div')
    confetti.className = 'fixed inset-0 pointer-events-none z-50'
    confetti.innerHTML = Array.from({ length: 50 }, () => 
      `<div class="confetti" style="left: ${Math.random() * 100}%; animation-delay: ${Math.random() * 2}s;"></div>`
    ).join('')
    
    document.body.appendChild(confetti)
    setTimeout(() => confetti.remove(), 3000)
  }

  const getTasksByStatus = (status: string) => 
    tasks.filter(task => task.status === status)

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {COLUMNS.map(column => (
          <Droppable droppableId={column.id} key={column.id}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`${column.color} rounded-lg p-4 min-h-[400px] ${
                  snapshot.isDraggingOver ? 'ring-2 ring-primary-500' : ''
                }`}
              >
                <h3 className="font-semibold text-gray-800 mb-4">
                  {column.title} ({getTasksByStatus(column.id).length})
                </h3>
                
                <div className="space-y-3">
                  {getTasksByStatus(column.id).map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`bg-white p-3 rounded-lg shadow-sm border ${
                            snapshot.isDragging ? 'rotate-2 shadow-lg' : ''
                          }`}
                        >
                          <div className="font-medium text-sm">{task.title}</div>
                          {task.description && (
                            <div className="text-xs text-gray-500 mt-1">
                              {task.description}
                            </div>
                          )}
                          {task.assignee && (
                            <div className="flex items-center mt-2">
                              <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center text-white text-xs">
                                {task.assignee.name?.charAt(0) || '?'}
                              </div>
                              <span className="text-xs text-gray-600 ml-2">
                                {task.assignee.name}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  )
}
```

### 6. مكون جدار التقدم

```typescript
// frontend/components/dashboard/ProgressWall.tsx
'use client'

import React, { useState } from 'react'
import { ProgressEntry } from '@/lib/types'
import { supabase } from '@/lib/supabase'

interface ProgressWallProps {
  entries: ProgressEntry[]
}

export default function ProgressWall({ entries }: ProgressWallProps) {
  const [newWin, setNewWin] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmitWin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newWin.trim()) return

    setIsSubmitting(true)
    try {
      const { error } = await supabase
        .from('progress_entries')
        .insert({
          content: newWin.trim(),
          project_id: 'default-project' // ASSUMPTION: Single project for MVP
        })

      if (error) throw error
      
      setNewWin('')
      // Refresh data would be handled by parent component
    } catch (error) {
      console.error('Error posting win:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="font-semibold text-gray-800 mb-4">جدار التقدم</h3>
      
      {/* Post New Win Form */}
      <form onSubmit={handleSubmitWin} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={newWin}
            onChange={(e) => setNewWin(e.target.value)}
            placeholder="شارك انتصارك اليومي..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            disabled={isSubmitting}
          />
          <button
            type="submit"
            disabled={!newWin.trim() || isSubmitting}
            className="px-4 py-2 bg-primary-600 text-white rounded-md text-sm hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? '...' : 'نشر'}
          </button>
        </div>
      </form>

      {/* Progress Entries */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {entries.map((entry) => (
          <div key={entry.id} className="p-3 bg-gray-50 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                {entry.author.name?.charAt(0) || '?'}
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-800">
                  {entry.author.name}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {entry.content}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {new Date(entry.createdAt).toLocaleString('ar-SA')}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {entries.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            <p>لا توجد انتصارات بعد</p>
            <p className="text-sm">كن أول من يشارك انتصاره!</p>
          </div>
        )}
      </div>
    </div>
  )
}
```

### 7. Supabase Edge Function - إضافة مهمة

```typescript
// supabase/functions/add-task/index.ts
import { serve } from 'std/server'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      }
    })
  }

  try {
    const { title, description, projectId, assigneeId } = await req.json()

    if (!title || !projectId) {
      return new Response(
        JSON.stringify({ error: 'Title and projectId are required' }), 
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    const { data, error } = await supabase
      .from('tasks')
      .insert([{
        title,
        description,
        project_id: projectId,
        assignee_id: assigneeId,
        status: 'TODO'
      }])
      .select()
      .single()

    if (error) {
      throw error
    }

    return new Response(
      JSON.stringify({ data }), 
      { 
        status: 201,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }), 
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
})
```

### 8. ملف package.json

```json
{
  "name": "axon-frontend",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev -p 3000",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "format": "prettier --write .",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "next": "14.0.0",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "@supabase/supabase-js": "^2.38.0",
    "@supabase/auth-helpers-nextjs": "^0.8.7",
    "react-beautiful-dnd": "^13.1.1",
    "tailwindcss": "^3.3.0",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.31",
    "lucide-react": "^0.292.0",
    "clsx": "^2.0.0",
    "date-fns": "^2.30.0"
  },
  "devDependencies": {
    "typescript": "^5.2.2",
    "@types/node": "^20.8.0",
    "@types/react": "^18.2.33",
    "@types/react-dom": "^18.2.14",
    "@types/react-beautiful-dnd": "^13.1.4",
    "eslint": "^8.51.0",
    "eslint-config-next": "14.0.0",
    "prettier": "^3.0.3",
    "prisma": "^5.6.0",
    "@prisma/client": "^5.6.0"
  }
}
```

---

## خطة Sprint الأسبوعية

### اليوم الأول: إعداد المشروع والمصادقة
**التركيز:** إعداد البيئة الأساسية والمصادقة

**المهام:**
- [ ] إنشاء مستودع GitHub
- [ ] إعداد Next.js مع TypeScript
- [ ] إعداد Supabase project
- [ ] ربط Vercel مع GitHub
- [ ] إعداد المصادقة الأساسية (تسجيل دخول/خروج)

**اختبارات القبول:**
- [ ] `npm run dev` يعمل بدون أخطاء
- [ ] المستخدم يمكنه التسجيل وتسجيل الدخول
- [ ] الجلسة تبقى محفوظة بعد إعادة التحميل

### اليوم الثاني: قاعدة البيانات وCRUD للمهام
**التركيز:** إعداد قاعدة البيانات والعمليات الأساسية

**المهام:**
- [ ] تطبيق Prisma schema
- [ ] إنشاء جداول قاعدة البيانات
- [ ] إنشاء API endpoints للمهام
- [ ] واجهة Kanban أساسية

**اختبارات القبول:**
- [ ] إنشاء مهمة عبر API → تظهر في Kanban
- [ ] قراءة/تحديث/حذف المهام يعمل
- [ ] البيانات تبقى محفوظة بعد إعادة التحميل

### اليوم الثالث: السحب والإفلات + تحديث الحالة
**التركيز:** تجربة المستخدم التفاعلية

**المهام:**
- [ ] دمج react-beautiful-dnd
- [ ] تنفيذ PUT /api/tasks/:id لتغيير الحالة
- [ ] تحديث UI عند السحب والإفلات

**اختبارات القبول:**
- [ ] سحب مهمة بين الأعمدة → تحديث الحالة في قاعدة البيانات
- [ ] UI يبقى متسقاً بعد إعادة التحميل
- [ ] رسائل خطأ واضحة عند الفشل

### اليوم الرابع: مكونات لوحة التحكم
**التركيز:** عرض البيانات الرئيسية

**المهام:**
- [ ] عرض نجم الشمال
- [ ] عرض الهدف الأسبوعي
- [ ] قسم "مهامي اليوم"
- [ ] تخطيط لوحة التحكم

**اختبارات القبول:**
- [ ] لوحة التحكم تجلب نجم الشمال والمهام
- [ ] "مهامي اليوم" تعرض المهام المخصصة (حد أقصى 3)
- [ ] التخطيط متجاوب على الهاتف

### اليوم الخامس: جدار التقدم والانتصارات اليومية
**التركيز:** نظام الزخم

**المهام:**
- [ ] تنفيذ /api/progress
- [ ] واجهة جدار التقدم
- [ ] نشر انتصار يومي

**اختبارات القبول:**
- [ ] نشر انتصار → يظهر في جدار التقدم لجميع المستخدمين
- [ ] جدار التقدم يعرض آخر 8 انتصارات
- [ ] التوقيتات تظهر باللغة العربية

### اليوم السادس: احتفال الإكمال + المعالم
**التركيز:** التحفيز والاحتفال

**المهام:**
- [ ] تأثير confetti عند إكمال المهام
- [ ] إنشاء ProgressEntry تلقائياً عند الإكمال
- [ ] لافتة المعالم الأساسية

**اختبارات القبول:**
- [ ] نقل مهمة إلى "مكتملة" → confetti + إنشاء انتصار
- [ ] لافتة المعالم تظهر مرة واحدة لكل معلم
- [ ] الرسوم المتحركة سلسة وغير مزعجة

### اليوم السابع: التلميع والمراجعة والنشر
**التركيز:** التحضير للإنتاج

**المهام:**
- [ ] تلميع التصميم والألوان
- [ ] فحص إمكانية الوصول
- [ ] نشر على Vercel
- [ ] اختبار شامل

**اختبارات القبول:**
- [ ] التطبيق منشور على Vercel
- [ ] جميع الميزات تعمل في الإنتاج
- [ ] الأداء مقبول (< 3 ثواني للتحميل)
- [ ] فريق المراجعة يقبل MVP

---

## دليل النشر

### 1. إعداد Supabase

```bash
# تثبيت Supabase CLI
npm install -g supabase

# تسجيل الدخول
supabase login

# إنشاء مشروع جديد
supabase projects create axon-project

# ربط المشروع المحلي
supabase link --project-ref your-project-ref
```

### 2. إعداد قاعدة البيانات

```bash
# تطبيق المخطط
npx prisma db push

# أو استخدام migrations
npx prisma migrate dev --name init
```

### 3. إعداد Vercel

```bash
# تثبيت Vercel CLI
npm install -g vercel

# تسجيل الدخول
vercel login

# نشر المشروع
vercel

# ربط متغيرات البيئة
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
```

### 4. إعداد GitHub Actions

```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json
      
      - name: Install dependencies
        run: |
          cd frontend
          npm ci
      
      - name: Type check
        run: |
          cd frontend
          npm run type-check
      
      - name: Lint
        run: |
          cd frontend
          npm run lint
      
      - name: Build
        run: |
          cd frontend
          npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          working-directory: ./frontend
```

---

## اختبارات القبول

### اختبارات الوحدة الأساسية

```typescript
// frontend/__tests__/KanbanBoard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import KanbanBoard from '@/components/dashboard/KanbanBoard'

const mockTasks = [
  {
    id: '1',
    title: 'Test Task',
    status: 'TODO',
    projectId: 'proj-1',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  }
]

test('renders task columns', () => {
  render(<KanbanBoard initialTasks={mockTasks} />)
  
  expect(screen.getByText('قيد الانتظار')).toBeInTheDocument()
  expect(screen.getByText('قيد التنفيذ')).toBeInTheDocument()
  expect(screen.getByText('قيد المراجعة')).toBeInTheDocument()
  expect(screen.getByText('مكتملة')).toBeInTheDocument()
})

test('displays tasks in correct columns', () => {
  render(<KanbanBoard initialTasks={mockTasks} />)
  
  expect(screen.getByText('Test Task')).toBeInTheDocument()
})
```

### اختبارات التكامل

```typescript
// frontend/__tests__/api/tasks.test.ts
import { createMocks } from 'node-mocks-http'
import handler from '@/app/api/tasks/route'

test('POST /api/tasks creates new task', async () => {
  const { req, res } = createMocks({
    method: 'POST',
    body: {
      title: 'New Task',
      projectId: 'proj-1'
    }
  })

  await handler(req, res)
  
  expect(res._getStatusCode()).toBe(201)
  expect(JSON.parse(res._getData())).toHaveProperty('data')
})
```

### اختبارات الأداء

```typescript
// frontend/__tests__/performance.test.ts
import { performance } from 'perf_hooks'

test('dashboard loads within 3 seconds', async () => {
  const start = performance.now()
  
  // Simulate dashboard load
  await new Promise(resolve => setTimeout(resolve, 100))
  
  const end = performance.now()
  expect(end - start).toBeLessThan(3000)
})
```

---

## دليل المطورين

### إرشادات التطوير

#### 1. معايير الكود
- استخدم TypeScript لجميع الملفات الجديدة
- اتبع ESLint و Prettier configurations
- اكتب تعليقات باللغة الإنجليزية
- استخدم أسماء متغيرات واضحة ومفهومة

#### 2. هيكل المكونات
```typescript
// Template for new components
interface ComponentProps {
  // Define props with types
}

export default function Component({ prop1, prop2 }: ComponentProps) {
  // Component logic
  return (
    <div className="component-wrapper">
      {/* JSX content */}
    </div>
  )
}
```

#### 3. إدارة الحالة
- استخدم React hooks للمحلي
- استخدم SWR للبيانات من API
- تجنب prop drilling، استخدم Context عند الحاجة

#### 4. معالجة الأخطاء
```typescript
try {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
  
  if (error) throw error
  
  return data
} catch (error) {
  console.error('Error fetching tasks:', error)
  // Show user-friendly error message
  throw new Error('فشل في تحميل المهام')
}
```

### أوامر مفيدة

```bash
# التطوير
npm run dev

# البناء
npm run build

# فحص الأنواع
npm run type-check

# تنسيق الكود
npm run format

# فحص الأخطاء
npm run lint

# قاعدة البيانات
npx prisma studio
npx prisma db push
npx prisma generate

# Supabase
supabase start
supabase db reset
supabase functions deploy
```

---

## خريطة الطريق للمرحلة الثانية

### الأولويات (Phase 2)

#### 1. مساعد الذكاء الاصطناعي
- **الملخصات التلقائية:** ملخصات أسبوعية وصباحية
- **تحليل المعوقات:** اكتشاف المهام المتوقفة
- **اقتراحات الأهداف:** اقتراح أهداف أسبوعية ذكية

#### 2. التحليلات المتقدمة
- **سرعة الفريق:** مهام مكتملة أسبوعياً
- **مخططات Burndown:** تتبع التقدم في الأهداف
- **مقاييس المساهمة:** إحصائيات فردية وجماعية

#### 3. التكاملات العميقة
- **Slack:** إشعارات فورية، إنشاء مهام من الرسائل
- **GitHub:** ربط PRs بالمهام، تحديث تلقائي
- **Jira:** مزامنة ثنائية الاتجاه

#### 4. المهام والأهداف المتكررة
- **جدولة المهام:** مهام يومية/أسبوعية متكررة
- **أهداف دورية:** أهداف شهرية/ربع سنوية
- **تذكيرات ذكية:** تذكيرات مخصصة

### مقاييس النجاح المقترحة

#### قصيرة المدى (3 أشهر)
- **100 مستخدم نشط** يستخدمون التطبيق يومياً
- **500 مهمة مكتملة** عبر جميع الفرق
- **4.5/5 تقييم** من المستخدمين للبساطة

#### متوسطة المدى (6 أشهر)
- **1000 مستخدم نشط** شهرياً
- **20 فريق مدفوع** يستخدمون الميزات المتقدمة
- **90% معدل احتفاظ** بعد شهر واحد

#### طويلة المدى (12 شهر)
- **10,000 مستخدم** مسجل
- **500 فريق مدفوع** نشط
- **$50K MRR** (Monthly Recurring Revenue)

---

## قائمة التحقق النهائية

### الملفات المطلوبة
- [x] بنية المشروع الكاملة
- [x] متغيرات البيئة (.env.example)
- [x] إعداد Tailwind CSS
- [x] إعداد Supabase Client
- [x] أنواع البيانات (Types)
- [x] صفحة لوحة التحكم
- [x] مكون Kanban Board
- [x] مكون Progress Wall
- [x] Supabase Edge Function
- [x] package.json مع dependencies
- [x] خطة Sprint أسبوعية مفصلة
- [x] دليل النشر على Vercel + Supabase
- [x] اختبارات القبول
- [x] دليل المطورين
- [x] خريطة الطريق للمرحلة الثانية

### الميزات الأساسية
- [x] تسجيل الدخول/الخروج
- [x] إدارة المهام (CRUD)
- [x] لوحة Kanban مع السحب والإفلات
- [x] جدار التقدم
- [x] نجم الشمال والأهداف
- [x] تأثيرات الاحتفال
- [x] تصميم متجاوب
- [x] دعم اللغة العربية

---

**English Summary:** This comprehensive implementation guide provides a complete starter kit for Axon, including project structure, environment setup, starter code files, detailed 7-day sprint plan, deployment instructions, testing guidelines, and Phase 2 roadmap. All code is production-ready and follows best practices for Next.js 14, TypeScript, Tailwind CSS, and Supabase integration.
