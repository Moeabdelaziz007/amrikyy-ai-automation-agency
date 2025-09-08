This document is designed to be the single source of truth for your development team.

# **The Nucleus: A Focused Command Center**

## **1\. Core Vision & Value Proposition**

**Mission:** To empower small, focused teams to achieve ambitious goals by providing a radically simple, momentum-driven workspace that eliminates noise and celebrates progress.

**Elevator Pitch:** The Nucleus is a command center for teams working on a single, high-stakes project. Unlike bloated project management tools, it combines task management, documentation, and a unique "Momentum System" to keep your team aligned, motivated, and perpetually in sync.

**Differentiators:**

1. **Singular Focus:** Built for one team and one project at a time. It intentionally lacks features for multi-project management, forcing clarity and focus.  
2. **Integrated Momentum:** Motivation is not an afterthought. The system is designed around celebrating small wins, tracking progress visibility, and building team momentum as a core feature.  
3. **Radical Simplicity:** A minimalist, curated feature set that removes the cognitive overhead of tools like Notion or Asana. If a feature doesn't directly contribute to moving the project forward, it doesn't exist.

**North Star Statement Examples:**

* (Emotional) Celebrate 10,000 "Done" tasks, representing 10,000 steps toward building the future.  
* (Measurable) Become the daily ritual for 1,000 teams, achieving an average of 5 daily "wins" per team.  
* (Customer-centric) Help teams ship their projects 20% faster by keeping them in a state of flow.

## **2\. High-Level System Architecture**

### **Architecture Description**

The system is designed as a modern web application using a Backend-as-a-Service (BaaS) model to accelerate development for the MVP.

* **Frontend:** A Next.js application hosted on Vercel. It will handle all UI rendering, client-side state management, and interaction.  
* **Backend:** Supabase will act as our all-in-one backend.  
  * **Database:** A Postgres database managed by Supabase for all relational data.  
  * **Authentication:** Supabase Auth for user sign-up, login (including OAuth providers like Google, GitHub), and session management.  
  * **Storage:** Supabase Storage for handling file uploads in the Knowledge Hub.  
  * **Serverless Functions:** Supabase Edge Functions (Deno-based) for custom backend logic, such as sending email digests or processing webhook events.  
* **CDN:** Vercel's Edge Network will serve the frontend application globally. Supabase's storage has a built-in CDN for file assets.  
* **Email:** An email service provider like Resend or Postmark will be triggered by a serverless function for sending morning digests and weekly summaries.  
* **Integrations (Phase 2):**  
  * **Slack:** A serverless function will receive events (e.g., milestone achieved) and post formatted messages to a specified Slack channel via a webhook.  
  * **GitHub:** A serverless function will act as a webhook receiver to automatically create tasks from new GitHub issues labeled `task`.

### **Recommended MVP Stack: Supabase**

**Justification:** For a project with structured, relational data (Users, Projects, Tasks, etc.), Postgres is a more robust and scalable choice than a NoSQL database like Firestore. Supabase provides the power of Postgres combined with the ease of use of a BaaS, including built-in authentication, row-level security (RLS) for permissions, and file storage. RLS is a killer feature for this kind of application, allowing us to define data access rules directly in the database.

**Trade-offs:**

* **Pro:** Powerful SQL queries, strong data consistency, mature ecosystem, excellent for defining relationships.  
* **Con:** Real-time data can be slightly more complex to set up than Firestore's native listeners, though Supabase's real-time subscriptions handle this well. Scaling requires more database knowledge than Firestore's automatic scaling.

### **API Surface (RESTful Endpoints)**

These will be implemented as Next.js API Routes or Supabase Functions.

| Endpoint | Method | Description |
| ----: | ----: | ----: |
| `/api/tasks` | POST | Create a new task. |
| `/api/tasks/{id}` | PUT | Update a task (status, assignee, etc.). |
| `/api/tasks/{id}` | DELETE | Delete a task. |
| `/api/goals` | POST | Set the weekly goal. |
| `/api/goals/current` | GET | Get the current weekly goal. |
| `/api/progress` | POST | Post a "daily win" to the Progress Wall. |
| `/api/progress` | GET | Get the latest entries for the Progress Wall. |
| `/api/knowledge/search` | GET | Full-text search across the Knowledge Hub. |

## **3\. Data Model & Schemas**

### **Prisma Schema (for Supabase/Postgres)**

This single schema defines our entire database structure and relationships.

مقتطف الرمز  
// This is your Prisma schema file,  
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {  
  provider \= "prisma-client-js"  
}

datasource db {  
  provider \= "postgresql"  
  url      \= env("DATABASE\_URL")  
}

model User {  
  id            String    @id @default(uuid())  
  email         String    @unique  
  name          String?  
  avatarUrl     String?   @map("avatar\_url")  
  createdAt     DateTime  @default(now()) @map("created\_at")  
  updatedAt     DateTime  @updatedAt @map("updated\_at")

  teamId        String?   @map("team\_id")  
  team          Team?     @relation(fields: \[teamId\], references: \[id\])  
  assignedTasks Task\[\]  
  progressEntries ProgressEntry\[\]

  @@map("users")  
}

model Team {  
  id        String    @id @default(uuid())  
  name      String  
  createdAt DateTime  @default(now()) @map("created\_at")  
  updatedAt DateTime  @updatedAt @map("updated\_at")

  members   User\[\]  
  project   Project?

  @@map("teams")  
}

model Project {  
  id          String      @id @default(uuid())  
  name        String      @default("The Nucleus Project")  
  teamId      String      @unique @map("team\_id")  
  team        Team        @relation(fields: \[teamId\], references: \[id\])  
  createdAt   DateTime    @default(now()) @map("created\_at")

  northStar   NorthStar?  
  goals       Goal\[\]  
  tasks       Task\[\]  
  milestones  Milestone\[\]  
  knowledge   Knowledge\[\]

  @@map("projects")  
}

model NorthStar {  
  id          String   @id @default(uuid())  
  statement   String  
  metric      String?  
  projectId   String   @unique @map("project\_id")  
  project     Project  @relation(fields: \[projectId\], references: \[id\])  
  createdAt   DateTime @default(now()) @map("created\_at")

  @@map("north\_stars")  
}

model Goal {  
  id          String   @id @default(uuid())  
  objective   String  
  startDate   DateTime @map("start\_date")  
  endDate     DateTime @map("end\_date")  
  isCurrent   Boolean  @default(true) @map("is\_current")  
  projectId   String   @map("project\_id")  
  project     Project  @relation(fields: \[projectId\], references: \[id\])  
  createdAt   DateTime @default(now()) @map("created\_at")

  @@map("goals")  
}

enum TaskStatus {  
  TODO  
  IN\_PROGRESS  
  FOR\_REVIEW  
  DONE  
}

model Task {  
  id           String      @id @default(uuid())  
  title        String  
  description  String?  
  status       TaskStatus  @default(TODO)  
  projectId    String      @map("project\_id")  
  project      Project     @relation(fields: \[projectId\], references: \[id\])  
  assigneeId   String?     @map("assignee\_id")  
  assignee     User?       @relation(fields: \[assigneeId\], references: \[id\])  
  createdAt    DateTime    @default(now()) @map("created\_at")  
  updatedAt    DateTime    @updatedAt @map("updated\_at")  
    
  history      ActivityLog\[\]

  @@map("tasks")  
}

model ActivityLog {  
  id        String   @id @default(uuid())  
  taskId    String   @map("task\_id")  
  task      Task     @relation(fields: \[taskId\], references: \[id\])  
  change    String   // e.g., "status changed from TODO to IN\_PROGRESS"  
  userId    String   @map("user\_id")  
  createdAt DateTime @default(now()) @map("created\_at")

  @@map("activity\_logs")  
}

model Milestone {  
  id            String   @id @default(uuid())  
  title         String  
  description   String?  
  achievedAt    DateTime? @map("achieved\_at")  
  isAchieved    Boolean   @default(false) @map("is\_achieved")  
  projectId     String   @map("project\_id")  
  project       Project  @relation(fields: \[projectId\], references: \[id\])

  @@map("milestones")  
}

model ProgressEntry {  
  id        String   @id @default(uuid())  
  content   String   // The "daily win" text  
  authorId  String   @map("author\_id")  
  author    User     @relation(fields: \[authorId\], references: \[id\])  
  createdAt DateTime @default(now()) @map("created\_at")  
    
  @@map("progress\_entries")  
}

model Knowledge {  
  id        String   @id @default(uuid())  
  type      String   // "DOCUMENT", "FILE", "MEETING\_NOTES"  
  title     String  
  content   String?  // For documents/notes  
  fileUrl   String?  @map("file\_url") // For files in Supabase Storage  
  projectId String   @map("project\_id")  
  project   Project  @relation(fields: \[projectId\], references: \[id\])  
  createdAt DateTime @default(now()) @map("created\_at")

  @@map("knowledge")  
}

### **JSON Schema Examples**

**Task:**

JSON  
{  
  "$schema": "http://json-schema.org/draft-07/schema\#",  
  "title": "Task",  
  "type": "object",  
  "properties": {  
    "id": { "type": "string", "format": "uuid" },  
    "title": { "type": "string", "minLength": 1 },  
    "description": { "type": "string" },  
    "status": { "enum": \["TODO", "IN\_PROGRESS", "FOR\_REVIEW", "DONE"\] },  
    "projectId": { "type": "string", "format": "uuid" },  
    "assigneeId": { "type": \["string", "null"\], "format": "uuid" },  
    "createdAt": { "type": "string", "format": "date-time" },  
    "updatedAt": { "type": "string", "format": "date-time" }  
  },  
  "required": \["id", "title", "status", "projectId", "createdAt", "updatedAt"\]  
}

**NorthStar:**

JSON  
{  
  "$schema": "http://json-schema.org/draft-07/schema\#",  
  "title": "NorthStar",  
  "type": "object",  
  "properties": {  
    "id": { "type": "string", "format": "uuid" },  
    "statement": { "type": "string" },  
    "metric": { "type": "string" },  
    "projectId": { "type": "string", "format": "uuid" },  
    "createdAt": { "type": "string", "format": "date-time" }  
  },  
  "required": \["id", "statement", "projectId", "createdAt"\]  
}

## **4\. Detailed Component Design**

### **A. Main Dashboard**

* **Purpose:** To provide an immediate, personalized "at-a-glance" view of the project's state and the user's priorities for the day. It sets the context and focus the moment the user logs in.  
* **Feature List:**  
  1. **Core:** Displays Project North Star, current weekly goal, user's assigned tasks for the day, and a feed of recent team wins (Progress Wall).  
  2. **Smart Touches:** The "My Tasks" section intelligently surfaces the 2-3 most critical tasks, not just a long list. A "Quick Add" button allows for frictionless task creation.

**UX / Wireframe Description (Desktop):**  
\+----------------------------------------------------------------------+  
| \[Header: Project Name\]              \[User Avatar\] \[Notifications\]    |  
\+----------------------------------------------------------------------+  
| \[NORTH STAR: Celebrate 10,000 "Done" tasks...\]                       |  
\+----------------------------------------------------------------------+  
| \[THIS WEEK'S GOAL: Launch landing page and get 50 signups.\]          |  
\+----------------------------------------------------------------------+  
| \[MY TASKS FOR TODAY\]                  | \[PROGRESS WALL\]              |  
| \+-----------------------------------+ | \+--------------------------+ |  
| | \[ \] Task 1: Design login modal    | | | \[Avatar\] Sarah just...   | |  
| | \[ \] Task 2: Setup DB schema       | | | \[Avatar\] Ahmed just...   | |  
| | \[ \] Task 3: Fix auth bug          | | | \[Avatar\] You just...     | |  
| | \[+ Add Task\]                      | | | \[Post a Win...\]          | |  
| \+-----------------------------------+ | \+--------------------------+ |  
\+----------------------------------------------------------------------+

*   
  1. **Mobile Notes:** The layout becomes a single-column stack. North Star and Goal at the top, followed by My Tasks, then Progress Wall.

**Example JSON Data:**  
JSON  
{  
  "dashboardData": {  
    "northStar": {  
      "statement": "Become the daily ritual for 1,000 teams."  
    },  
    "currentGoal": {  
      "objective": "Ship the MVP and onboard our first 10 beta users."  
    },  
    "myTasks": \[  
      { "id": "task-1", "title": "Implement drag-and-drop on Kanban board" },  
      { "id": "task-2", "title": "Finalize brand name and logo" }  
    \],  
    "progressWall": \[  
      { "id": "win-1", "author": "Sarah", "content": "pushed the final designs for the dashboard\!" },  
      { "id": "win-2", "author": "Ahmed", "content": "squashed the nasty authentication bug." }  
    \]  
  }  
}

*   
* **User Flow: Morning Check-in:**  
  1. User opens the app.  
  2. Frontend requests `/api/dashboard`.  
  3. Backend aggregates data for the North Star, current Goal, user's tasks, and recent Progress Entries.  
  4. The dashboard renders, giving the user immediate clarity on the team's main objective and their personal contribution for the day.

### **B. Task Board ("Kanban Engine")**

* **Purpose:** To be the single source of truth for all work in progress. It visualizes the workflow, clarifies who is doing what, and makes progress tangible.  
* **Feature List:**  
  1. **Core:** Columns (To Do, In Progress, For Review, Done), draggable task cards, assignees, task details modal.  
  2. **Smart Touches:** When a card is moved to "Done," a subtle confetti animation fires. The completion is automatically posted to the Progress Wall. The board can be filtered by assignee.

**UX / Wireframe Description:**  
\+----------------------------------------------------------------------+  
| \[Board View Controls: Filter by User\]        \[+ New Task\]            |  
\+----------------------------------------------------------------------+  
| \[TO DO (5)\]  | \[IN PROGRESS (2)\] | \[FOR REVIEW (1)\] | \[DONE (23)\]   |  
| \+----------+ | \+---------------+ | \+--------------+ | \+-----------+ |  
| | Task A   | | | Task F        | | | Task H       | | | Task Z    | |  
| | \[Avatar\] | | | \[Avatar\]      | | | \[Avatar\]     | | | \[Avatar\]  | |  
| \+----------+ | \+---------------+ | \+--------------+ | \+-----------+ |  
| | Task B   | | | Task G        | |                | |             | |  
| | \[Avatar\] | | | \[Avatar\]      | |                | |             | |  
| \+----------+ | \+---------------+ |                | |             | |  
| ...        |                     |                |               |  
\+----------------------------------------------------------------------+

*   
* **API Sample: Update Task Status**  
  1. `PUT /api/tasks/task-123`  
  2. Request Body: `{ "status": "DONE", "movedByUserId": "user-abc" }`  
  3. Response (200 OK): `{ "id": "task-123", "title": "...", "status": "DONE", ... }`  
* **User Flow: Completing a Task:**  
  1. User drags a task card from "For Review" to the "Done" column.  
  2. `onDragEnd` event fires on the frontend.  
  3. Frontend makes an API call: `PUT /api/tasks/task-123` with `{ status: "DONE" }`.  
  4. The UI optimistically shows the card in the "Done" column and triggers a confetti animation.  
  5. Backend updates the task's status, creates an `ActivityLog` entry (`"status changed to DONE"`), and creates a `ProgressEntry` (`"{User} just completed '{Task Title}'"`).

### **C. Knowledge Hub**

* **Purpose:** To be the project's long-term memory. It centralizes all critical documentation, files, and decisions, preventing knowledge loss and reducing repetitive questions.  
* **Feature List:**  
  * **Core:** Simple document editor, file uploads, notes section, powerful search.  
  * **Smart Touches:** Search covers document content, file names, and note text. A weekly summary of changes can be emailed out.

**UX / Wireframe Description:**  
\+----------------------------------------------------------------------+  
| \[Search Knowledge Hub...\]                                            |  
\+----------------------------------------------------------------------+  
| \[NAVIGATION\]     | \[CONTENT AREA\]                                    |  
| \+--------------+ | \+-----------------------------------------------+ |  
| | Project Brief| | | \# Project Brief                               | |  
| | Design Files | | |                                               | |  
| | Meeting Notes| | | \#\# The Problem                                | |  
| | \[+ New Doc\]  | | | We are solving...                             | |  
| \+--------------+ | \+-----------------------------------------------+ |  
\+----------------------------------------------------------------------+

*   
* **Search Implementation Note:**  
  * With Supabase, you can implement full-text search directly in Postgres. You would create a function and an index to make `Knowledge.content` searchable.  
  * Example Query: `SELECT * FROM "Knowledge" WHERE to_tsvector('english', content) @@ to_tsquery('english', 'authentication & flow');`

### **D. Momentum System**

* **Purpose:** To make progress feel visible, celebrated, and continuous. It's the emotional core of the application, designed to combat burnout and keep morale high.  
* **Feature List:**  
  1. **Core:** Daily Wins channel, milestone celebration banners, weekly summary digests.  
  2. **Smart Touches:** Streaks for consecutive days a user posts a "win." Small, non-intrusive achievement badges for contributions.  
* **User Flow: Posting a Daily Win:**  
  1. User clicks "Post a Win..." on the dashboard.  
  2. A simple modal opens with a text input: "What did you accomplish today?"  
  3. User types "Refactored the API to be 50% faster\!" and submits.  
  4. Frontend makes a call: `POST /api/progress` with `{ content: "Refactored the API..." }`.  
  5. Backend creates a `ProgressEntry`.  
  6. The new win immediately appears at the top of the Progress Wall for the whole team to see.

## **5\. UX & Design System**

### **Design Tokens**

JavaScript  
// tailwind.config.js snippet  
const colors \= require('tailwindcss/colors')

module.exports \= {  
  theme: {  
    colors: {  
      transparent: 'transparent',  
      current: 'currentColor',  
      black: colors.black,  
      white: colors.white,  
      gray: colors.zinc, // Using zinc for a modern, neutral gray  
      primary: colors.indigo,  
      success: colors.emerald,  
      warning: colors.amber,  
      danger: colors.red,  
    },  
    spacing: {  
      // 4px base grid  
      '0': '0', '1': '4px', '2': '8px', '3': '12px', '4': '16px', '5': '20px', '6': '24px', '8': '32px', '10': '40px', '12': '48px', '16': '64px',  
    },  
    fontFamily: {  
      sans: \['Inter', 'sans-serif'\],  
    },  
    // ...  
  },  
}

### **UI Language & Micro-interactions**

* **Style:** Minimalist, high-contrast, with generous whitespace. Cards should have subtle box shadows and a slight scale transform on hover.

**Celebration Animation:** A simple CSS keyframe animation for confetti.  
CSS  
@keyframes confetti-rain {  
  0% { transform: translateY(-100%); opacity: 1; }  
  100% { transform: translateY(100vh); opacity: 0; }  
}  
.confetti {  
  position: absolute;  
  width: 8px;  
  height: 12px;  
  background-color: var(--color-primary-500);  
  animation: confetti-rain 3s linear infinite;  
}

* 

## **6\. Technology Stack & Folder Structure**

### **Recommended Stack**

* **Frontend:** Next.js (App Router), React, TypeScript, Tailwind CSS, SWR (for data fetching, works great with Vercel).  
* **Backend:** Supabase (Postgres, Auth, Storage, Edge Functions).  
* **Hosting:** Vercel (Frontend), Supabase (Backend).

### **Folder Structure**

/the-nucleus/  
├── .github/  
│   └── workflows/  
│       └── ci.yml        \# CI/CD pipeline  
├── docs/  
│   └── api.md            \# API documentation  
├── frontend/             \# Next.js Application  
│   ├── app/  
│   │   ├── (auth)/         \# Auth routes (login, signup)  
│   │   ├── (dashboard)/    \# Protected routes  
│   │   │   ├── dashboard/  
│   │   │   │   └── page.tsx  
│   │   │   ├── tasks/  
│   │   │   │   └── page.tsx  
│   │   │   └── layout.tsx  
│   │   └── layout.tsx      \# Root layout  
│   │   └── page.tsx        \# Landing page  
│   ├── components/  
│   │   ├── ui/             \# Reusable UI components (Button, Card, etc.)  
│   │   └── dashboard/  
│   │       └── KanbanBoard.tsx  
│   ├── lib/  
│   │   └── supabase.ts     \# Supabase client setup  
│   ├── styles/  
│   │   └── globals.css  
│   ├── package.json  
│   └── tsconfig.json  
├── supabase/  
│   ├── functions/  
│   │   └── send-weekly-digest/  
│   │       └── index.ts  
│   └── migrations/  
│       └── \<timestamp\>\_init.sql  
└── package.json            \# Root package.json for workspace scripts

## **7\. Starter Code & Files**

### **`/frontend/app/(dashboard)/dashboard/page.tsx`**

TypeScript  
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';  
import { cookies } from 'next/headers';  
import KanbanBoard from '@/components/dashboard/KanbanBoard';

export default async function DashboardPage() {  
  const supabase \= createServerComponentClient({ cookies });

  const { data: { session } } \= await supabase.auth.getSession();  
  const { data: tasks } \= await supabase.from('tasks').select('\*');  
  const { data: currentGoal } \= await supabase.from('goals').select('objective').eq('isCurrent', true).single();

  return (  
    \<main className="p-8"\>  
      \<header className="mb-8"\>  
        \<h1 className="text-3xl font-bold"\>Dashboard\</h1\>  
        \<p className="text-gray-500"\>Welcome back, {session?.user?.email}\</p\>  
      \</header\>  
        
      \<div className="bg-primary-50 text-primary-800 p-4 rounded-lg mb-8"\>  
        \<h2 className="font-bold"\>This Week's Goal:\</h2\>  
        \<p\>{currentGoal?.objective || 'No goal set yet.'}\</p\>  
      \</div\>

      \<div\>  
        \<h3 className="text-xl font-bold mb-4"\>Task Board\</h3\>  
        \<KanbanBoard initialTasks={tasks || \[\]} /\>  
      \</div\>  
    \</main\>  
  );  
}

### **`/frontend/components/dashboard/KanbanBoard.tsx`**

TypeScript  
'use client';

import { useState } from 'react';  
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';  
// Note: react-beautiful-dnd needs a wrapper for React 18 strict mode.

// Simplified types for brevity  
type Task \= { id: string; title: string; status: string; };

export default function KanbanBoard({ initialTasks }: { initialTasks: Task\[\] }) {  
  const \[tasks, setTasks\] \= useState(initialTasks);

  const handleOnDragEnd \= (result) \=\> {  
    if (\!result.destination) return;  
    // ... Logic to update task status via API call and reorder locally  
    console.log('Task moved:', result);  
  };

  const columns \= \['TODO', 'IN\_PROGRESS', 'DONE'\];

  return (  
    \<DragDropContext onDragEnd={handleOnDragEnd}\>  
      \<div className="grid grid-cols-3 gap-4"\>  
        {columns.map(column \=\> (  
          \<Droppable droppableId={column} key={column}\>  
            {(provided) \=\> (  
              \<div  
                {...provided.droppableProps}  
                ref={provided.innerRef}  
                className="bg-gray-100 p-4 rounded-lg"  
              \>  
                \<h4 className="font-bold mb-4"\>{column}\</h4\>  
                {tasks.filter(t \=\> t.status \=== column).map((task, index) \=\> (  
                  \<Draggable key={task.id} draggableId={task.id} index={index}\>  
                    {(provided) \=\> (  
                      \<div  
                        ref={provided.innerRef}  
                        {...provided.draggableProps}  
                        {...provided.dragHandleProps}  
                        className="bg-white p-3 rounded shadow mb-3"  
                      \>  
                        {task.title}  
                      \</div\>  
                    )}  
                  \</Draggable\>  
                ))}  
                {provided.placeholder}  
              \</div\>  
            )}  
          \</Droppable\>  
        ))}  
      \</div\>  
    \</DragDropContext\>  
  );  
}

### **`/supabase/functions/add-task/index.ts`**

TypeScript  
// Deno \+ Supabase Edge Function Example  
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'  
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) \=\> {  
  if (req.method \=== 'OPTIONS') {  
    return new Response('ok', { headers: { 'Access-Control-Allow-Origin': '\*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey' } })  
  }

  try {  
    const supabaseClient \= createClient(  
      Deno.env.get('SUPABASE\_URL') ?? '',  
      Deno.env.get('SUPABASE\_ANON\_KEY') ?? '',  
      { global: { headers: { Authorization: req.headers.get('Authorization')\! } } }  
    )

    const { title, projectId } \= await req.json()

    const { data, error } \= await supabaseClient  
      .from('tasks')  
      .insert({ title, project\_id: projectId, status: 'TODO' })  
      .select()  
      .single()

    if (error) throw error

    return new Response(JSON.stringify(data), {  
      headers: { 'Content-Type': 'application/json' },  
      status: 201,  
    })  
  } catch (error) {  
    return new Response(JSON.stringify({ error: error.message }), {  
      headers: { 'Content-Type': 'application/json' },  
      status: 400,  
    })  
  }  
})

## **8\. Naming Analysis & Brand Recommendation**

### **Analysis of Finalists**

| Name | Meaning & Symbolism | Tone & Personality | Strengths | Risks |
| ----: | ----: | ----: | ----: | ----: |
| **Axon** | The nerve fiber that transmits signals. Represents communication, connection, and speed. | Smart, scientific, efficient, precise. | Unique, memorable, strong metaphor for the product. | Could sound too technical or biological for some users. |
| **Nexus X** | "Nexus" is a central point or hub. "X" adds a modern/techy variable or multiplier. | Professional, corporate, scalable, ambitious. | Clearly communicates "central hub," sounds credible. | Slightly generic "tech startup" name. "Nexus" is common. |
| **Crux** | The essential, core point of an issue. The platform is the "crux" of the project. | Focused, direct, powerful, minimalist. | Very strong brand story, short, impactful. | Pronunciation might be ambiguous (kruks vs. krush). |
| **Onyx** | A solid, sleek, premium black gemstone. Represents reliability, quality, and elegance. | Elegant, premium, reliable, minimalist, stylish. | Short, easy to remember, feels high-quality. | Meaning is not directly related to product function. |

### **Comparison Matrix**

| Criteria | Axon | Nexus X | Crux | Onyx |
| ----: | ----: | ----: | ----: | ----: |
| Memorability | High | Medium | High | High |
| Pronunciation | High | High | Medium | High |
| Domain/SEO | Medium | Low | High | Medium |
| Professionalism | High | High | High | High |
| Differentiation | High | Medium | High | High |
| Scalability | High | High | High | High |

### **Domain & Trademark Checklist**

1. **Domain Search:** Use a tool like `instantdomainsearch.com` or `who.is`.  
   * Check for `.com`, `.io`, `.app`, `.ai`.  
   * Example searches: `getaxon.com`, `axonapp.io`, `cruxhq.com`, `onyx.app`. Be prepared to use a prefix (`get`, `use`) or suffix (`app`, `hq`).  
2. **Trademark Search (Basic):**  
   * Go to the USPTO TESS database (for US) and EUIPO eSearch (for EU).  
   * Search for your name in the relevant class (likely Class 9 for computer software, Class 42 for SaaS).  
   * Look for exact matches and "likelihood of confusion" with existing software/tech brands. *This is not legal advice.*  
3. **Social Handle Search:** Check Twitter, GitHub, etc., for availability of the name.

### **Recommended Naming Routes**

**1\. The Fast & Professional Route: Axon** This name is the best all-rounder. It has a brilliant, relevant metaphor, sounds intelligent and professional, and is highly differentiated. It strikes the perfect balance between creative and credible.

* **English Brand Blurb:** **Axon.** The nerve center for your project. Axon streamlines your team's communication and workflow, transmitting progress at the speed of thought.  
* **Arabic Brand Blurb:** **أكسون (Axon).** المحور العصبي لمشروعك. ينظم "أكسون" تواصل فريقك وسير عمله، ناقلاً إشارة التقدم بسرعة الفكر.

**2\. The Creative & Differentiated Route: Crux** This name tells a powerful story. It positions the product not just as a tool, but as a philosophy of focus. It's for teams who are serious about cutting through the noise. It is short, bold, and confident.

* **English Brand Blurb:** **Crux.** The heart of the matter. Crux helps your team focus on the essential core of your project, turning complex goals into simple, actionable steps.  
* **Arabic Brand Blurb:** **كرَكس (Crux).** صُلب الموضوع. يساعد "كرَكس" فريقك على التركيز على الجوهر الأساسي لمشروعكم، محولاً الأهداف المعقدة إلى خطوات بسيطة وقابلة للتنفيذ.

### **Logo Brief (for Axon)**

* **Concept:** The transmission of an idea or signal.  
* **Style:** Minimalist, geometric, clean.  
* **Iconography:** Could be an abstract representation of a neuron, a signal pulse, pathways converging, or a stylized letter 'A'. Avoid literal biological drawings.  
* **Color Palette:** A core deep indigo or charcoal for trust and stability, with a vibrant electric blue or teal as an accent to represent the "signal" or "spark."  
* **Typography:** A clean, modern sans-serif font like Inter or Manrope.

## **9\. First-Week Sprint Roadmap**

| Day | Deliverable | Acceptance Criteria |
| ----: | ----: | ----: |
| **1** | Repo setup, Vercel/Supabase integration, Auth scaffolded | \- GitHub repo created. Vercel project linked. Supabase project created. \- Users can sign up and log in via email. |
| **2** | Core DB schema migration, Kanban data model CRUD | \- Prisma schema is applied. \- API endpoints to create, read, update, delete tasks exist. \- Basic Kanban UI fetches tasks. |
| **3** | Kanban drag-and-drop functionality | \- User can drag a task from one column to another. \- The task's status is updated in the database on drop. |
| **4** | Dashboard layout, North Star & Weekly Goal display | \- Dashboard page is protected and fetches/displays North Star and current Goal. \- "My Tasks" section shows assigned tasks. |
| **5** | Progress Wall and "Daily Win" feature | \- User can submit a "daily win" via a form. \- The Progress Wall on the dashboard displays the last 5 wins. |
| **6** | "Done" celebration and basic Milestone banner | \- When a task moves to Done, a confetti animation fires. \- A global banner can be manually triggered for milestones. |
| **7** | Polish, basic styling, and internal demo deployment | \- The app is styled according to the design tokens. \- The app is deployed to a Vercel preview URL for team review. |

## **10\. Documentation & Onboarding**

### **`README.md`**

Markdown  
\# The Nucleus (Project Axon)

The nerve center for your project. A focused command center for small teams.

\#\# Tech Stack

\- \*\*Frontend:\*\* Next.js, React, TypeScript, Tailwind CSS  
\- \*\*Backend:\*\* Supabase (Postgres, Auth, Storage, Edge Functions)  
\- \*\*Deployment:\*\* Vercel

\#\# Getting Started

\#\#\# 1\. Clone the repository  
\`\`\`bash  
git clone \<repo\_url\>  
cd the-nucleus

### **2\. Install dependencies**

Bash  
npm install

### **3\. Set up environment variables**

Create a `.env.local` file in the `frontend` directory and add your Supabase credentials.

NEXT\_PUBLIC\_SUPABASE\_URL=your-supabase-url  
NEXT\_PUBLIC\_SUPABASE\_ANON\_KEY=your-supabase-anon-key

You will also need to set up the `DATABASE_URL` for Prisma in a root `.env` file if you plan to run migrations locally.

### **4\. Run the development server**

Bash  
npm run dev

Open [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) with your browser to see the result.

## **Scripts**

* `npm run dev`: Starts the Next.js development server.  
* `npm run build`: Builds the application for production.  
* `npm run start`: Starts a production server.  
* `npx prisma db push`: Pushes the Prisma schema to your Supabase database.

\#\# 11\. Future Roadmap (Phase 2+)

\* \*\*AI Assistant:\*\* Integrate a simple LLM to provide daily progress summaries, identify potential blockers from task comments, or suggest weekly goals.  
\* \*\*Advanced Analytics:\*\* A simple dashboard showing team velocity (tasks completed per week), burndown charts for sprints, and contribution metrics.  
\* \*\*Integrations:\*\* Deep integration with Slack (notifications, creating tasks from messages) and GitHub (linking PRs to tasks).  
\* \*\*Recurring Tasks & Goals:\*\* Ability to set up recurring daily or weekly tasks and goals.  
\* \*\*Keeping "Less is More":\*\* Scale functionality through optional integrations rather than cluttering the core UI. Use feature flags to roll out new features to beta testers without affecting all users.

\---

\#\#\# Strict Deliverable Checklist  
\- \[x\] 2–3 sentence mission \+ 3 differentiators  
\- \[x\] Architecture description \+ API surface  
\- \[x\] Data models (JSON \+ Prisma/SQL)  
\- \[x\] 4 module deep designs with wireframes  
\- \[x\] Tech stack \+ folder structure  
\- \[x\] Starter code snippets (Dashboard, Kanban, API)  
\- \[x\] Sprint plan (7 days)  
\- \[x\] README \+ onboarding drafts  
\- \[x\] Naming analysis \+ recommendation \+ domain/trademark checklist  
\- \[x\] Phase 2 roadmap

Take a deep breath and work on this problem step-by-step.  
