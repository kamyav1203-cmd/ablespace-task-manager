# Pyramid - AbleSpace Task Management System

Pyramid is a premium, production-ready full-stack Task Management System designed and built for the AbleSpace technical assessment. 

It mirrors the Figma design system blocks and implements a complete caseload tracking workspace with a Next.js frontend and a NestJS backend.

---

## Features Implemented

### Frontend (Next.js & Tailwind CSS)
1. **Interactive Login**: Supports a secure guest authentication flow that automatically sets a session for the default user "Dexter".
2. **Workspace Layout**: Responsive sidebar with collapsible user options, active workspace selectors, and links to Tasks and Projects pages.
3. **Tasks List View**: Tasks grouped by status sections with collapsible headers, column toggles (Priority, Assignee, Due Date, Labels, Status), search keyword filtering, and inline task creation.
4. **Tasks Kanban Board View**: Drag-and-drop support for shifting tasks between status columns (To Do, Doing, Completed, On Hold).
5. **Task Details Side Panel**: An expandable drawer displaying comprehensive task details, description edits, labels selectors, properties dropdowns, and subtasks CRUD actions.
6. **Projects Management**: Table listing active projects, leads, and due dates, with subview navigation to drill down into project-specific tasks.
7. **Theme Engine**: Toggleable Light and Dark themes, with additional global primary Color Modes (Amber, Blue, Pink) that dynamically swap focus highlights. Selection persists across refreshes using `localStorage`.

### Backend (NestJS & TypeORM)
1. **Database Schema**: TypeORM entities modeling `User`, `Project`, and `Task` (supporting parent-child tasks relation for subtasks).
2. **SQLite Connection**: Uses `better-sqlite3` as a fast, reliable local SQL database driver.
3. **API Controllers**: Exposes RESTful CRUD routes for Tasks, Projects, and Users with class-validator validation pipelines.
4. **Figma Mock Data Seeding**: Automatically seeds the database on application startup with the exact tasks, projects, subtasks, and users displayed in the Figma design blocks.

---

## Tech Stack
- **Frontend**: Next.js 14+ (App Router), React, TypeScript, Axios, Tailwind CSS v4, Lucide Icons.
- **Backend**: NestJS, TypeScript, TypeORM, better-sqlite3, class-validator.
- **Database**: SQLite (file-based).

---

## Project Structure
```
ablespace-task-manager/
├── frontend/             # Next.js client
│   ├── src/
│   │   ├── app/          # App router pages (login, tasks, projects)
│   │   ├── components/   # UI components (Sidebar, TaskListView, TaskBoardView, etc.)
│   │   ├── context/      # Theme Context Provider
│   │   └── utils/        # Axios API client
├── backend/              # NestJS server
│   ├── src/
│   │   ├── auth/         # Guest login authentication
│   │   ├── projects/     # Projects REST resource
│   │   ├── tasks/        # Tasks & subtasks REST resource
│   │   ├── users/        # Users resource
│   │   ├── seed/         # Database startup seed service
│   │   └── main.ts       # NestJS entrypoint
```

---

## Setup & Running Locally

Ensure you have **Node.js (v18+)** and **npm** installed.

### 1. Run the Backend API Server
Navigate to the `backend` folder, install dependencies, and start the development server:
```bash
cd backend
npm install
npm run start
```
The server will run on `http://localhost:3001/api`.
*On startup, the SQLite database `db.sqlite` will be created and seeded with default Figma mockup items automatically.*

### 2. Run the Frontend Client
Navigate to the `frontend` folder, install dependencies, and start the development server:
```bash
cd frontend
npm install
npm run dev
```
The client will run on `http://localhost:3000`. Open `http://localhost:3000` in your web browser.

---

## Product Understanding (Part 2 Assessment)
The clinical caseload and UX/UI review for the AbleSpace **"Take Data"** screen can be found in the following document:
- [Product Understanding Document](product_understanding.md) (in the workspace brain folder)
