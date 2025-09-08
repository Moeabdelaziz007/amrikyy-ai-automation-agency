The Nucleus (Focused Command Center)

System architecture, data models, APIs, and detailed component designs.

1. High-Level System Architecture
Architecture Description

The Nucleus is designed as a modern web app leveraging a BaaS-first architecture for rapid MVP delivery.

Frontend:

Framework: Next.js (App Router) with React + TypeScript.

Styling: Tailwind CSS.

Deployment: Vercel (edge network for global performance).

Backend:

Primary: Supabase (Postgres, Auth, Storage, Edge Functions).

Alternative: Firebase (Firestore, Auth, Storage, Cloud Functions).

Database:

Postgres (Supabase) for relational, structured project data.

Advantages: SQL queries, strong data consistency, built-in RLS policies.

Authentication:

Supabase Auth (with OAuth support for Google, GitHub).

Storage:

Supabase Storage for Knowledge Hub files.

Serverless Functions:

Supabase Edge Functions for custom backend logic (e.g., daily digests, Slack/GitHub integrations).

Email Service:

Resend or Postmark, triggered from Edge Functions for digests & milestones.

Integrations (Phase 2):

Slack: Post milestone celebrations and daily summaries via webhook.

GitHub: Convert labeled issues into tasks automatically.

2. Supabase vs Firebase (Justification)

Supabase (Recommended):
✅ SQL (Postgres), RLS, built-in auth, strong relational modeling.
❌ Slightly more setup required for scaling vs Firebase.

Firebase (Alternative):
✅ Instant real-time sync, effortless scaling.
❌ NoSQL schema may lead to complexity; less relational clarity.

Decision: Supabase chosen for MVP due to structured relational needs (Users, Tasks, Goals).

3. API Surface (REST Endpoints)
Endpoint	Method	Description
/api/tasks	POST	Create a new task
/api/tasks/{id}	PUT	Update task (status, assignee)
/api/tasks/{id}	DELETE	Delete task
/api/goals	POST	Set/update weekly goal
/api/goals/current	GET	Get current weekly goal
/api/progress	POST	Post a daily win
/api/progress	GET	Fetch latest wins
/api/knowledge/search	GET	Full-text search Knowledge Hub
4. Data Models & Schemas
Prisma Schema (Supabase/Postgres)
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String    @id @default(uuid())
  email         String    @unique
  name          String?
  avatarUrl     String?   @map("avatar_url")
  createdAt     DateTime  @default(now()) @map("created_at")
  updatedAt     DateTime  @updatedAt @map("updated_at")

  teamId        String?   @map("team_id")
  team          Team?     @relation(fields: [teamId], references: [id])
  assignedTasks Task[]
  progressEntries ProgressEntry[]
}

model Team {
  id        String    @id @default(uuid())
  name      String
  createdAt DateTime  @default(now()) @map("created_at")
  updatedAt DateTime  @updatedAt @map("updated_at")

  members   User[]
  project   Project?
}

model Project {
  id          String      @id @default(uuid())
  name        String
  teamId      String      @unique @map("team_id")
  team        Team        @relation(fields: [teamId], references: [id])
  createdAt   DateTime    @default(now()) @map("created_at")

  northStar   NorthStar?
  goals       Goal[]
  tasks       Task[]
  milestones  Milestone[]
  knowledge   Knowledge[]
}


(Full schema continues with NorthStar, Goal, Task, ActivityLog, Milestone, ProgressEntry, Knowledge as in file 1.)

JSON Schema Examples

Task:

{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Task",
  "type": "object",
  "properties": {
    "id": { "type": "string", "format": "uuid" },
    "title": { "type": "string", "minLength": 1 },
    "status": { "enum": ["TODO", "IN_PROGRESS", "FOR_REVIEW", "DONE"] },
    "projectId": { "type": "string", "format": "uuid" },
    "assigneeId": { "type": ["string", "null"], "format": "uuid" }
  },
  "required": ["id", "title", "status", "projectId"]
}


NorthStar:

{
  "id": "uuid",
  "statement": "Become the daily ritual for 1,000 teams.",
  "metric": "5 wins per team per day",
  "projectId": "uuid",
  "createdAt": "date-time"
}

5. Detailed Component Designs
A. Dashboard (Shakhat al-Nazra al-Wahida)

Purpose: At-a-glance view of North Star, weekly goal, personal tasks, and team wins.

Features:

North Star display

This Week’s Goal

My Tasks (2–3 max)

Progress Wall feed

Quick Add task/win

Wireframe (Desktop):

+--------------------------------------------------------------+
| [Header: Project Name]                [User Avatar] [Bell]   |
+--------------------------------------------------------------+
| [NORTH STAR: Celebrate 10,000 “Done” tasks...]               |
+--------------------------------------------------------------+
| [WEEKLY GOAL: Launch landing page, 50 signups]               |
+--------------------------------------------------------------+
| [MY TASKS]                     | [PROGRESS WALL]             |
| [ ] Task 1: Design modal       | Sarah: finished logo        |
| [ ] Task 2: Setup DB schema    | Ahmed: fixed auth bug       |
| [+ Add Task]                   | [+ Post Win]                |
+--------------------------------------------------------------+


User Flow (Morning Digest):

User logs in → /api/dashboard fetches aggregated data.

Dashboard renders North Star, Goal, Tasks, Wins.

Daily digest sent via Edge Function to email/Slack.

B. Task Board (Kanban Engine)

Columns: To Do | In Progress | For Review | Done.

Smart Touch: Moving a task → “Done” triggers confetti + auto-post to Progress Wall.

Wireframe:

[TO DO]        [IN PROGRESS]     [FOR REVIEW]    [DONE]
Task A         Task D            Task H          Task Z
Task B         Task E                            Task Y


User Flow (Completing a Task):

Drag Task → Done.

PUT /api/tasks/{id} updates DB.

Confetti animation fires.

ProgressEntry created: “User completed {Task}.”

C. Knowledge Hub (Aql al-Mashroo)

Purpose: Team’s memory → docs, files, meeting notes.

Smart Touch: Full-text search across content.

Search Example (Supabase):

SELECT * FROM "Knowledge"
WHERE to_tsvector('english', content)
@@ to_tsquery('english', 'authentication & flow');

D. Momentum System (Heartbeat of the Project)

Core Features:

Daily Wins channel

Milestone celebration banners

Weekly digest summaries

Smart Touch: Streaks for consecutive wins + small achievement badges.

User Flow (Posting a Win):

User → “Post a Win.”

POST /api/progress with { content: "Refactored API" }.

Progress Wall updates in real time.

Weekly digest emails include this win.

✅ Deliverables from this File

High-level architecture (with justification).

API surface + sample endpoints.

Full Prisma schema.

JSON schemas for core entities.

Component wireframes (Dashboard, Kanban, Knowledge Hub, Momentum).

User flow examples.

⚡ Invocation for Agent
Take a deep breath and work on this problem step-by-step.