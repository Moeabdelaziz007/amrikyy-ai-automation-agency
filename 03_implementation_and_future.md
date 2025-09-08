📑 03_implementation_and_future.md
The Nucleus — Implementation & Future (Starter Kit, Code, Sprint, Roadmap)

This file contains the practical artifacts your IDEA Agent needs to implement The Nucleus from zero to a working MVP and prepare Phase 2.

Table of Contents

High-level goals of this file

Repo & folder structure (copy/paste)

Environment variables (.env.example)

Package scripts & CI skeleton

Tailwind / design tokens (tailwind.config.js)

Prisma schema (core tables) — code block

Starter Frontend — Next.js + TypeScript pages & components (copy/paste-ready)

/frontend/app/(dashboard)/dashboard/page.tsx

/frontend/components/dashboard/KanbanBoard.tsx

/frontend/lib/supabaseClient.ts

Starter Backend — Supabase Edge Function add-task (copy/paste-ready)

API request/response examples (curl)

Momentum features: DB design, queries, UI notes, confetti CSS

Integrations (Slack, Email, GitHub webhooks)

Security & Roles (Supabase RLS examples)

First-week Sprint Plan — day-by-day (detailed)

Developer README.md (draft) & Quickstart

User Onboarding Guide (first-run walkthrough)

Phase 2 roadmap & scaling notes

Final checklist of delivered artifacts (checked)

1. High-level goals of this file

Provide a minimal reproducible workspace for an MVP using Next.js + TypeScript + Tailwind + Supabase.

Ensure all examples are ready to paste into files and run (after setting env vars and installing deps).

Keep the code readable and well-commented; production hardening is left to later iterations.

Preserve the "less is more" design: features necessary for focus, momentum, and teamwork.

2. Repo & folder structure (copy/paste)
/the-nucleus
├── .github/
│   └── workflows/
│       └── ci.yml
├── docs/
│   ├── api.md
│   └── onboarding.md
├── frontend/                # Next.js app (App Router)
│   ├── app/
│   │   ├── (auth)/
│   │   ├── (dashboard)/
│   │   │   └── dashboard/
│   │   │       └── page.tsx
│   │   └── page.tsx         # Landing
│   ├── components/
│   │   └── dashboard/
│   │       ├── KanbanBoard.tsx
│   │       └── ProgressWall.tsx
│   ├── lib/
│   │   └── supabaseClient.ts
│   ├── styles/
│   │   └── globals.css
│   ├── tailwind.config.js
│   ├── package.json
│   └── tsconfig.json
├── supabase/                # Supabase functions and migrations
│   ├── functions/
│   │   └── add-task/
│   │       └── index.ts
│   └── migrations/
│       └── 20250906_init.sql
├── backend/                 # Optional serverless functions or API routes
│   └── (if using custom server)
├── infra/                   # IaC (optional)
│   └── README.md
├── docs/README.md
└── README.md

3. Environment variables (.env.example)

Place these in root / .env or respective locations. Do not commit secrets.

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xyzcompany.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=public-anon-key

# For Supabase Edge Functions (service key, server side only)
SUPABASE_SERVICE_ROLE_KEY=service-role-key

# Prisma / DATABASE URL (for local migrations)
DATABASE_URL=postgresql://postgres:password@db-host:5432/the_nucleus

# SendGrid / Email provider
SENDGRID_API_KEY=SG.xxxxx

# Slack webhook
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/xxx/yyy/zzz

# GitHub webhook secret
GITHUB_WEBHOOK_SECRET=your_github_secret

# App
NEXTAUTH_SECRET=super-secret-please-change

4. Package scripts & GitHub Actions CI skeleton
/frontend/package.json (scripts snippet)
{
  "name": "the-nucleus-frontend",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev -p 3000",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "format": "prettier --write ."
  },
  "dependencies": {
    "next": "14.x",
    "react": "18.x",
    "react-dom": "18.x",
    "@supabase/supabase-js": "^2.0.0",
    "tailwindcss": "^3.0.0",
    "react-beautiful-dnd": "^13.1.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "eslint": "^8.0.0",
    "prettier": "^2.0.0"
  }
}

.github/workflows/ci.yml skeleton
name: CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [18.x]
    steps:
      - uses: actions/checkout@v4
      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
      - name: Install dependencies
        run: |
          cd frontend
          npm ci
      - name: Lint
        run: |
          cd frontend
          npm run lint
      - name: Build
        run: |
          cd frontend
          npm run build

5. Tailwind / design tokens (tailwind.config.js)
// /frontend/tailwind.config.js
const colors = require('tailwindcss/colors')

module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: colors.indigo,
        neutral: colors.slate,
        success: colors.emerald,
        accent: { 500: '#00C48C' },
      },
      spacing: {
        1: '4px', 2: '8px', 3: '12px', 4: '16px', 5: '20px', 6: '24px'
      }
    },
    fontFamily: {
      sans: ['Inter', 'sans-serif'],
    }
  },
  plugins: []
}

6. Prisma schema (core tables) — code block

Place this in /backend/prisma/schema.prisma or at root if managing migrations locally.

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum TaskStatus {
  TODO
  IN_PROGRESS
  FOR_REVIEW
  DONE
}

model User {
  id            String    @id @default(uuid())
  email         String    @unique
  name          String?
  avatarUrl     String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  teamUsers     TeamUser[]
  assignedTasks Task[]    @relation("AssigneeTasks", fields: [id], references: [assigneeId])
  progressEntries ProgressEntry[]
}

model Team {
  id        String    @id @default(uuid())
  name      String
  createdAt DateTime  @default(now())
  projects  Project[]
  members   TeamUser[]
}

model TeamUser {
  id      String @id @default(uuid())
  team    Team   @relation(fields: [teamId], references: [id])
  teamId  String
  user    User   @relation(fields: [userId], references: [id])
  userId  String
  role    String
}

model Project {
  id         String     @id @default(uuid())
  name       String
  teamId     String
  team       Team       @relation(fields: [teamId], references: [id])
  createdAt  DateTime   @default(now())
  northStar  NorthStar?
  goals      Goal[]
  tasks      Task[]
  knowledge  Knowledge[]
  progress   ProgressEntry[]
  milestones Milestone[]
}

model NorthStar {
  id        String   @id @default(uuid())
  statement String
  metric    String?
  project   Project  @relation(fields: [projectId], references: [id])
  projectId String   @unique
  createdAt DateTime @default(now())
}

model Goal {
  id        String   @id @default(uuid())
  objective String
  startDate DateTime
  endDate   DateTime
  isCurrent Boolean  @default(true)
  project   Project  @relation(fields: [projectId], references: [id])
  projectId String
  createdAt DateTime @default(now())
}

model Task {
  id          String      @id @default(uuid())
  title       String
  description String?
  status      TaskStatus  @default(TODO)
  project     Project     @relation(fields: [projectId], references: [id])
  projectId   String
  assigneeId  String?
  assignee    User?       @relation("AssigneeTasks", fields: [assigneeId], references: [id])
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
  activity    ActivityLog[]
}

model ActivityLog {
  id        String   @id @default(uuid())
  taskId    String
  task      Task     @relation(fields: [taskId], references: [id])
  change    String
  userId    String
  createdAt DateTime @default(now())
}

model Milestone {
  id         String   @id @default(uuid())
  title      String
  description String?
  achievedAt DateTime?
  isAchieved Boolean @default(false)
  project    Project  @relation(fields: [projectId], references: [id])
  projectId  String
}

model ProgressEntry {
  id        String   @id @default(uuid())
  content   String
  authorId  String
  author    User     @relation(fields: [authorId], references: [id])
  projectId String
  project   Project  @relation(fields: [projectId], references: [id])
  createdAt DateTime @default(now())
}

model Knowledge {
  id        String   @id @default(uuid())
  type      String
  title     String
  content   String?
  fileUrl   String?
  projectId String
  project   Project  @relation(fields: [projectId], references: [id])
  createdAt DateTime @default(now())
}

7. Starter Frontend — Next.js + TypeScript pages & components (copy/paste-ready)

Note: these examples assume @supabase/supabase-js v2. Use createClient on client side and createServerComponentClient on server components if using Next.js app router server components.

/frontend/lib/supabaseClient.ts
// /frontend/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

/frontend/app/(dashboard)/dashboard/page.tsx
// /frontend/app/(dashboard)/dashboard/page.tsx
import React from 'react'
import { supabase } from '@/lib/supabaseClient'
import KanbanBoard from '@/components/dashboard/KanbanBoard'
import ProgressWall from '@/components/dashboard/ProgressWall'

export default async function DashboardPage() {
  // Server-side fetch (in real app, use server components or APIs)
  const { data: northStar } = await supabase
    .from('north_stars')
    .select('*')
    .limit(1)
    .single()

  const { data: tasks } = await supabase
    .from('tasks')
    .select('*')
    .order('created_at', { ascending: true })

  const { data: wins } = await supabase
    .from('progress_entries')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(8)

  return (
    <main className="p-8">
      <header>
        <h1 className="text-3xl font-bold">{northStar?.statement || 'Set your North Star'}</h1>
      </header>

      <div className="mt-6 grid grid-cols-3 gap-6">
        <section className="col-span-2">
          <h2 className="text-xl font-semibold mb-4">Task Board</h2>
          <KanbanBoard initialTasks={tasks || []} />
        </section>

        <aside className="col-span-1">
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-medium">This Week's Goal</h3>
            <p className="text-sm text-gray-600">No goal set</p>
          </div>

          <div className="mt-4">
            <h3 className="font-medium">Progress Wall</h3>
            <ProgressWall entries={wins || []} />
          </div>
        </aside>
      </div>
    </main>
  )
}

/frontend/components/dashboard/KanbanBoard.tsx (React client component)
// /frontend/components/dashboard/KanbanBoard.tsx
'use client'

import React from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd'

type Task = {
  id: string
  title: string
  description?: string
  status: string
}

export default function KanbanBoard({ initialTasks = [] }: { initialTasks: Task[] }) {
  const [tasks, setTasks] = React.useState<Task[]>(initialTasks)
  const columns = ['TODO', 'IN_PROGRESS', 'FOR_REVIEW', 'DONE']

  function handleOnDragEnd(result: DropResult) {
    const { destination, source, draggableId } = result
    if (!destination) return
    if (destination.droppableId === source.droppableId && destination.index === source.index) return

    // naive local reorder + status change
    setTasks(prev => {
      const task = prev.find(t => t.id === draggableId)!
      const updated = prev.map(t => (t.id === draggableId ? { ...t, status: destination.droppableId } : t))
      // TODO: call API to persist task status change
      fetch(`/api/tasks/${draggableId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: destination.droppableId })
      })
      return updated
    })
  }

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <div className="grid grid-cols-4 gap-4">
        {columns.map(col => (
          <Droppable droppableId={col} key={col}>
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps} className="bg-gray-50 p-3 rounded">
                <h4 className="font-semibold mb-2">{col.replace('_', ' ')}</h4>
                <div className="min-h-[150px]">
                  {tasks.filter(t => t.status === col).map((task, idx) => (
                    <Draggable key={task.id} draggableId={task.id} index={idx}>
                      {(provided) => (
                        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}
                             className="bg-white p-3 rounded shadow mb-2">
                          <div className="font-medium">{task.title}</div>
                          <div className="text-xs text-gray-500">{task.description}</div>
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

/frontend/components/dashboard/ProgressWall.tsx (simple)
// /frontend/components/dashboard/ProgressWall.tsx
'use client'
import React from 'react'

export default function ProgressWall({ entries = [] }: { entries: any[] }) {
  return (
    <div className="space-y-2">
      {entries.map((e: any) => (
        <div key={e.id} className="p-3 bg-white rounded shadow text-sm">
          <div className="font-semibold">{e.author_id}</div>
          <div className="text-gray-700">{e.content}</div>
          <div className="text-xs text-gray-400">{new Date(e.created_at).toLocaleString()}</div>
        </div>
      ))}
    </div>
  )
}

8. Starter Backend — Supabase Edge Function add-task (copy/paste-ready)

Place in /supabase/functions/add-task/index.ts (Deno). This example uses createClient from supabase-js.

// /supabase/functions/add-task/index.ts
import { serve } from 'std/server'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { status: 200 })
  try {
    const body = await req.json()
    const { title, description, projectId, assigneeId } = body

    const { data, error } = await supabase
      .from('tasks')
      .insert([{ title, description, project_id: projectId, assignee_id: assigneeId, status: 'TODO' }])
      .select()
      .single()

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 400 })
    }

    return new Response(JSON.stringify({ data }), { status: 201 })
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 })
  }
})

9. API request/response examples (curl)
Create task
curl -X POST https://your-supabase-edge-functions-url/add-task \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SERVICE_ROLE_KEY" \
  -d '{"title":"Design login modal","description":"Create UI/UX","projectId":"proj-uuid","assigneeId":"user-uuid"}'

Update task status
curl -X PUT https://your-app.com/api/tasks/<taskId> \
  -H "Content-Type: application/json" \
  -d '{"status":"DONE"}'

10. Momentum features: DB design, queries, UI notes, confetti CSS
DB (already included in Prisma): ProgressEntry, Milestone, Achievement (add if desired)

Add Achievement and Streak if you want to track streaks.

model Achievement {
  id        String  @id @default(uuid())
  userId    String
  key       String  // e.g., "streak_5", "first_milestone"
  meta      Json?
  createdAt DateTime @default(now())
}

Example query: create ProgressEntry & optionally Achievement (pseudo)

When task moves to DONE, create ProgressEntry with content: "{user} completed {task}".

Run a query to check yesterday's ProgressEntry to update streak.

Confetti CSS (simple)
/* /frontend/styles/confetti.css */
@keyframes confetti {
  0% { transform: translateY(-50vh) rotate(0); opacity: 1; }
  100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
}
.confetti {
  position: absolute;
  width: 10px;
  height: 14px;
  background: var(--tw-color-primary-500);
  animation: confetti 1.8s linear forwards;
}

UI note (non-addictive rewards)

Limit Daily Win to 1 per user per day.

Badges are ephemeral and visible on profile for 7 days.

Celebrate milestones with a 10–15s banner + confetti (only once per milestone per team).

11. Integrations (Slack, Email, GitHub webhooks)
Slack milestone announcement (JSON payload)
{
  "text": ":tada: Milestone reached!",
  "blocks": [
    { "type": "section", "text": { "type": "mrkdwn", "text": "*Milestone:* Launch Beta\n*Project:* The Nucleus" } },
    { "type": "context", "elements": [{ "type": "mrkdwn", "text": "Congrats team! 🎉" }] }
  ]
}


Send via POST to SLACK_WEBHOOK_URL.

Morning digest email (SendGrid HTML snippet)
<h2>Good morning, Team</h2>
<p>Today's goal: <strong>Launch landing page — 50 signups</strong></p>
<ul>
  <li>Ahmed — Finish API integration</li>
  <li>Sarah — Publish hero copy</li>
  <li>Leila — QA signup flow</li>
</ul>
<p>Remember to post one win today in "Daily Wins" ✨</p>

GitHub webhook -> create task (flow)

GitHub sends issues.opened or pull_request event to your Edge Function (verify X-Hub-Signature with GITHUB_WEBHOOK_SECRET).

Function parses payload, inserts a Task with tags: ['github'], title: issue.title, description: issue.body.

12. Security & Roles (Supabase RLS examples)
Role matrix

owner — full control (team-level)

admin — manage projects & members

editor — create/update tasks, posts

commenter — create comments/notes

viewer — read-only

Supabase RLS example (policy)
-- Example: allow select on tasks only for team members
create policy "select_task_if_member" on public.tasks
  for select using (
    exists (
      select 1 from public.team_users tu
      where tu.team_id = (select team_id from public.projects p where p.id = tasks.project_id)
        and tu.user_id = auth.uid()
    )
  );


Implement similar policies for inserts/updates: check role in team_users table.

13. First-week Sprint Plan — day-by-day (detailed)
Day	Focus	Tasks	Acceptance Criteria / Tests
Day 1	Project scaffolding & auth	Repo, Next.js scaffold, Supabase project, auth email sign-in	npm run dev runs; user can sign up/login with magic link
Day 2	DB & Kanban CRUD	Run Prisma migrations, create tasks table, implement /api/tasks endpoints, basic Kanban UI	Create task via API → appears in Kanban; read+update+delete work
Day 3	Drag & drop + status persistence	Integrate react-beautiful-dnd, implement PUT /api/tasks/:id to change status	Drag task column → DB status changes, UI persists across reload
Day 4	Dashboard components	North Star display, This Week's Goal, My Tasks list	Dashboard fetches north star & tasks; "My Tasks" shows assigned tasks (limit 3)
Day 5	Progress Wall & Daily Win	Implement /api/progress, ProgressWall UI, posting daily win	Posting a win appears in Progress Wall for all users
Day 6	Done celebration + milestone	When task status= DONE -> confetti + create ProgressEntry; milestone banner prototype	Moving task to DONE creates progress entry and triggers banner animation once
Day 7	Polish, QA, deploy	Styling polishing, accessibility check, deploy to Vercel, team demo	App deployed to preview URL; demo script works; stakeholders accept MVP checklist

Test cases to run daily

Create a task → Should return 201 and be visible in Kanban.

Move a task → Status updates in DB.

Post a win → Appears in Progress Wall.

Sign up / login → Session persists.

14. Developer README.md (draft) & Quickstart
/README.md (root — draft)
# The Nucleus — Focused Command Center (MVP)

## Tech
- Frontend: Next.js (App Router), TypeScript, Tailwind
- Backend: Supabase (Postgres, Auth, Storage, Edge Functions)
- Hosting: Vercel (frontend), Supabase (DB + functions)

## Quickstart (local)
1. Clone:
   ```bash
   git clone <repo_url>
   cd the-nucleus


Setup environment variables:

Copy .env.example to .env.local (frontend) and set values.

Install:

cd frontend
npm ci


Run:

npm run dev


Supabase:

Create a Supabase project, add tables via Prisma migrations (npx prisma db push) or SQL migrations.

Useful commands

npm run dev — start frontend

npm run build — build for production

npx prisma migrate deploy — deploy DB migrations (if using Prisma Migrate)

Notes

Keep SUPABASE_SERVICE_ROLE_KEY secret; only use in server environment.


---

## 15. User Onboarding Guide (first-run walkthrough)

### Short flow (for product copy or onboarding modal)
1. **Welcome screen**: "Welcome to The Nucleus — Ready to focus on one project?" CTA: Create new project or Join existing.
2. **Set North Star**: One sentence: "What big thing are we aiming for?" (example placeholder)
3. **Set This Week's Goal**: One measurable goal.
4. **Invite teammates**: Enter emails (invites via Supabase).
5. **Add 2 tasks for today**: Quick-add UI.
6. **Post first Daily Win**: Prompt text: "Share one thing you’ll do today."

Provide placeholder screenshots in `docs/onboarding.md` (IDEA Agent can create them later).

---

## 16. Phase 2 roadmap & scaling notes

**Prioritized Phase 2 features**
1. **AI Assistant:** Weekly & morning auto-summaries, meeting-note summarizer, blocker detection. (Use an LLM and RAG from Knowledge Hub).
2. **Advanced Analytics:** Team velocity, tasks/week, burndown, contributor metrics.
3. **Recurring Goals & Tasks:** Scheduling logic + UI.
4. **Deeper Integrations:** Jira, GitHub 2-way sync, calendar.

**Scaling suggestions**
- Move heavy back-end logic into serverless microservices or dedicated Node services (if usage grows).
- Add caching (Redis) for hot reads like Progress Wall.
- Add rate-limits + monitoring (Sentry + Datadog/Prometheus-style metrics).

---

## 17. Final checklist of delivered artifacts (checked)

- [x] 2–3 sentence mission + 3 differentiators (in file 1)  
- [x] Architecture description + API surface (file 2)  
- [x] Data models (JSON + Prisma/SQL) (file 2 & 3)  
- [x] 4 module deep designs with wireframes (file 2)  
- [x] Tech stack + folder structure (file 3)  
- [x] Starter code snippets (Dashboard, Kanban, API) (file 3)  
- [x] Sprint plan (7 days) (file 3)  
- [x] README + onboarding drafts (file 3)  
- [x] Naming analysis + recommendation + domain/trademark checklist (file 1)  
- [x] Phase 2 roadmap (file 3)  

---

## Closing notes & next steps for you / the IDEA Agent
- **How to feed these to Cursor/IDEA:** Give the three `.md` files in order. The agent should process `01_foundation_and_strategy.md`, then `02_architecture_and_blueprint.md`, then `03_implementation_and_future.md`. Each file is self-contained and instructs the agent what output to produce before moving to the next file.  
- **If you want runnable scaffolding right now:** I can produce a zipped file tree (text-only) or paste full files individually.  
- **If you want the agent to generate more artifacts:** e.g., sample product landing copy, logo SVG concepts, or initial unit tests — tell me which; I’ll append.

Take a deep breath and work on this problem step-by-step.
