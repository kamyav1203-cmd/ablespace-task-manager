'use client';

import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '@/components/Sidebar';
import TaskListView from '@/components/TaskListView';
import TaskBoardView from '@/components/TaskBoardView';
import TaskDetailsDrawer from '@/components/TaskDetailsDrawer';
import { Task, User, tasksApi, usersApi } from '@/utils/api';
import { Search, SlidersHorizontal, Filter, Plus, List, Kanban, Check } from 'lucide-react';

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [view, setView] = useState<'list' | 'board'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAssigneeFilter, setSelectedAssigneeFilter] = useState<string | null>(null);

  // Field Popover state
  const [showFieldsPopover, setShowFieldsPopover] = useState(false);
  const [visibleFields, setVisibleFields] = useState({
    priority: true,
    members: true,
    dueDate: true,
    labels: true,
    status: true,
  });

  // Task details state
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchTasks();
    fetchUsers();
  }, [searchQuery, selectedAssigneeFilter]);

  // Close fields popover on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setShowFieldsPopover(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchTasks = async () => {
    try {
      const data = await tasksApi.getAll({
        excludeSubtasks: true,
        search: searchQuery || undefined,
      });

      if (selectedAssigneeFilter) {
        setTasks(data.filter((t) => t.assigneeId === selectedAssigneeFilter));
      } else {
        setTasks(data);
      }
    } catch (err) {
      console.error(err);
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

  const toggleField = (field: keyof typeof visibleFields) => {
    setVisibleFields((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* Header Toolbar */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 bg-white px-8 py-5 dark:bg-[#111827] dark:border-slate-800/60 transition-colors duration-200 shadow-sm z-10">
          
          {/* Title & Assignees filter bubble */}
          <div className="flex items-center gap-6">
            <h1 className="text-xl font-bold tracking-tight text-slate-800 dark:text-white">
              Tasks
            </h1>

            {/* Assignee filter bubble list */}
            <div className="flex items-center gap-1.5 border-l border-slate-200 pl-6 dark:border-slate-800">
              <button
                onClick={() => setSelectedAssigneeFilter(null)}
                className={`text-[10px] font-bold px-3 py-1.5 rounded-full transition-all duration-150 ${
                  selectedAssigneeFilter === null
                    ? 'bg-primary text-white shadow-md shadow-primary/10'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400'
                }`}
              >
                All
              </button>
              {users.map((u) => {
                const isSelected = selectedAssigneeFilter === u.id;
                return (
                  <button
                    key={u.id}
                    onClick={() => setSelectedAssigneeFilter(isSelected ? null : u.id)}
                    className={`relative group rounded-full overflow-visible p-0.5 border-2 transition-all duration-150 ${
                      isSelected ? 'border-primary scale-110' : 'border-transparent hover:border-slate-300'
                    }`}
                    title={u.name}
                  >
                    {u.avatarUrl ? (
                      <img src={u.avatarUrl} alt={u.name} className="h-6 w-6 rounded-full bg-slate-100 dark:bg-slate-800" />
                    ) : (
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white text-[9px] font-bold">
                        {u.initials}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tools and Filters */}
          <div className="flex flex-wrap items-center gap-3">
            
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tasks..."
                className="w-48 rounded-2xl border border-slate-250 bg-slate-50/50 pl-9 pr-4 py-2 text-sm outline-none focus:border-primary focus:w-60 dark:bg-slate-900 dark:border-slate-800 transition-all duration-200"
              />
            </div>

            {/* Fields Button with Popover */}
            <div className="relative" ref={popoverRef}>
              <button
                onClick={() => setShowFieldsPopover(!showFieldsPopover)}
                className="flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800/40"
              >
                <SlidersHorizontal className="h-4 w-4 text-slate-400" />
                Fields
              </button>

              {showFieldsPopover && (
                <div className="absolute right-0 mt-2 w-56 z-50 rounded-2xl border border-slate-150 bg-white p-4 shadow-2xl dark:border-slate-800 dark:bg-slate-950 transition-all duration-200">
                  {/* View layout toggle */}
                  <div className="mb-4 border-b border-slate-100 pb-4 dark:border-slate-800/60">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Layout</p>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setView('list')}
                        className={`flex items-center justify-center gap-1.5 rounded-xl py-1.5 text-xs font-bold border ${
                          view === 'list'
                            ? 'bg-primary/10 border-primary text-primary'
                            : 'border-slate-200 bg-white text-slate-650 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400'
                        }`}
                      >
                        <List className="h-3.5 w-3.5" />
                        List
                      </button>
                      <button
                        onClick={() => setView('board')}
                        className={`flex items-center justify-center gap-1.5 rounded-xl py-1.5 text-xs font-bold border ${
                          view === 'board'
                            ? 'bg-primary/10 border-primary text-primary'
                            : 'border-slate-200 bg-white text-slate-655 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400'
                        }`}
                      >
                        <Kanban className="h-3.5 w-3.5" />
                        Board
                      </button>
                    </div>
                  </div>

                  {/* Toggle Fields Columns */}
                  <div className="space-y-1.5">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Show Columns</p>
                    {(Object.keys(visibleFields) as Array<keyof typeof visibleFields>).map((field) => (
                      <button
                        key={field}
                        onClick={() => toggleField(field)}
                        className="flex w-full items-center justify-between rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800/40"
                      >
                        <span className="capitalize">{field}</span>
                        {visibleFields[field] && <Check className="h-4 w-4 text-primary" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Filter Button */}
            <button className="flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300">
              <Filter className="h-4 w-4 text-slate-400" />
              Filter
            </button>

            {/* Add Task Button */}
            <button
              onClick={() => {
                tasksApi.create({
                  name: 'Untitled Task',
                  status: 'To Do',
                  priority: 'No Priority',
                }).then((task) => {
                  setSelectedTaskId(task.id);
                  fetchTasks();
                });
              }}
              className="flex items-center gap-1.5 rounded-2xl bg-primary px-5 py-2.5 text-xs font-bold text-white hover:bg-primary-hover shadow-lg shadow-primary/15 hover:scale-[1.02] transition-all"
            >
              <Plus className="h-4.5 w-4.5" />
              Add Task
            </button>

          </div>
        </header>

        {/* Workspace Display Area */}
        <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50 dark:bg-slate-950/20">
          {view === 'list' ? (
            <TaskListView
              tasks={tasks}
              users={users}
              visibleFields={visibleFields}
              onTaskClick={setSelectedTaskId}
              onRefresh={fetchTasks}
            />
          ) : (
            <TaskBoardView
              tasks={tasks}
              users={users}
              onTaskClick={setSelectedTaskId}
              onRefresh={fetchTasks}
            />
          )}
        </div>

      </main>

      {/* Task Details Side Drawer */}
      {selectedTaskId && (
        <TaskDetailsDrawer
          taskId={selectedTaskId}
          onClose={() => setSelectedTaskId(null)}
          onUpdate={fetchTasks}
        />
      )}

    </div>
  );
}
