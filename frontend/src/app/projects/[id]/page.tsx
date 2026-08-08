'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import TaskListView from '@/components/TaskListView';
import TaskBoardView from '@/components/TaskBoardView';
import TaskDetailsDrawer from '@/components/TaskDetailsDrawer';
import { Project, Task, User, projectsApi, usersApi, tasksApi } from '@/utils/api';
import { ChevronRight, Search, SlidersHorizontal, Filter, Plus, List, Kanban } from 'lucide-react';

export default function ProjectDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'list' | 'board'>('list');
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [visibleFields, setVisibleFields] = useState({
    priority: true,
    members: true,
    dueDate: true,
    labels: true,
    status: true,
  });

  useEffect(() => {
    fetchProjectData();
    fetchUsers();
  }, [projectId, searchQuery]);

  const fetchProjectData = async () => {
    try {
      const data = await projectsApi.getOne(projectId);
      setProject(data);
      
      const projTasks = await tasksApi.getAll({
        projectId,
        excludeSubtasks: true,
        search: searchQuery || undefined,
      });
      setTasks(projTasks);
    } catch (err) {
      console.error(err);
      router.push('/projects');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const data = await usersApi.getAll();
      setUsers(data);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <Sidebar />

      <main className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* Header Breadcrumbs Toolbar */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 bg-white px-8 py-5 dark:bg-[#111827] dark:border-slate-800/60 transition-colors duration-200 shadow-sm z-10">
          
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs font-bold text-slate-550 uppercase tracking-wider">
            <button
              onClick={() => router.push('/projects')}
              className="hover:text-primary transition-colors"
            >
              Projects
            </button>
            <ChevronRight className="h-4 w-4 text-slate-400" />
            <span className="text-slate-800 dark:text-slate-100 font-extrabold normal-case text-sm">
              {project?.name}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search project tasks..."
                className="w-48 rounded-2xl border border-slate-200 bg-slate-50/50 pl-9 pr-4 py-2 text-sm outline-none focus:border-primary dark:bg-slate-900 dark:border-slate-800"
              />
            </div>

            {/* Layout Toggle */}
            <div className="flex rounded-xl border border-slate-200 bg-slate-50 p-1 dark:border-slate-800 dark:bg-slate-905">
              <button
                onClick={() => setView('list')}
                className={`rounded-lg p-1.5 transition-colors ${
                  view === 'list'
                    ? 'bg-white text-primary shadow-sm dark:bg-slate-800'
                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
                }`}
                title="List View"
              >
                <List className="h-4 w-4" />
              </button>
              <button
                onClick={() => setView('board')}
                className={`rounded-lg p-1.5 transition-colors ${
                  view === 'board'
                    ? 'bg-white text-primary shadow-sm dark:bg-slate-800'
                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
                }`}
                title="Board View"
              >
                <Kanban className="h-4 w-4" />
              </button>
            </div>

            {/* Add Task inside Project */}
            <button
              onClick={async () => {
                const newTask = await tasksApi.create({
                  name: 'Untitled Task',
                  projectId: project?.id,
                  status: 'To Do',
                  priority: 'No Priority',
                });
                setSelectedTaskId(newTask.id);
                fetchProjectData();
              }}
              className="flex items-center gap-1.5 rounded-2xl bg-primary px-5 py-2.5 text-xs font-bold text-white hover:bg-primary-hover shadow-lg shadow-primary/15 hover:scale-[1.02] transition-all"
            >
              <Plus className="h-4.5 w-4.5" />
              Add Task
            </button>

          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8">
          {view === 'list' ? (
            <TaskListView
              tasks={tasks}
              users={users}
              visibleFields={visibleFields}
              onTaskClick={setSelectedTaskId}
              onRefresh={fetchProjectData}
              selectedProjectId={projectId}
            />
          ) : (
            <TaskBoardView
              tasks={tasks}
              users={users}
              onTaskClick={setSelectedTaskId}
              onRefresh={fetchProjectData}
              selectedProjectId={projectId}
            />
          )}
        </div>

      </main>

      {/* Task Details Side Drawer */}
      {selectedTaskId && (
        <TaskDetailsDrawer
          taskId={selectedTaskId}
          onClose={() => setSelectedTaskId(null)}
          onUpdate={fetchProjectData}
        />
      )}

    </div>
  );
}
