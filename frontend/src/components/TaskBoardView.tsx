'use client';

import React, { useState } from 'react';
import { Task, User, tasksApi } from '@/utils/api';
import { Plus, Calendar, MoreHorizontal, MessageSquare, Paperclip } from 'lucide-react';

interface TaskBoardViewProps {
  tasks: Task[];
  users: User[];
  onTaskClick: (taskId: string) => void;
  onRefresh: () => void;
  selectedProjectId?: string;
}

export default function TaskBoardView({
  tasks,
  users,
  onTaskClick,
  onRefresh,
  selectedProjectId,
}: TaskBoardViewProps) {
  
  const columns = ['To Do', 'Doing', 'Completed', 'On Hold'];
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [activeInlineCreator, setActiveInlineCreator] = useState<string | null>(null);
  const [newTaskName, setNewTaskName] = useState('');

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case 'Urgent':
        return 'bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400 border border-red-100/30';
      case 'High':
        return 'bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400 border border-rose-100/30';
      case 'Medium':
        return 'bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400 border border-amber-100/30';
      case 'Low':
        return 'bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400 border border-blue-100/30';
      default:
        return 'bg-slate-50 text-slate-650 dark:bg-slate-800 dark:text-slate-400 border border-slate-100 dark:border-slate-800/40';
    }
  };

  const handleDragStart = (taskId: string) => {
    setDraggedTaskId(taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (status: string) => {
    if (!draggedTaskId) return;

    try {
      await tasksApi.update(draggedTaskId, { status });
      onRefresh();
    } catch (err) {
      console.error(err);
    } finally {
      setDraggedTaskId(null);
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent, status: string) => {
    e.preventDefault();
    if (!newTaskName.trim()) return;

    try {
      await tasksApi.create({
        name: newTaskName,
        status,
        projectId: selectedProjectId || undefined,
        priority: 'No Priority',
      });
      setNewTaskName('');
      setActiveInlineCreator(null);
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const formatDueDate = (dateStr?: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start max-w-6xl mx-auto">
      {columns.map((col) => {
        const colTasks = tasks.filter((t) => t.status === col);

        return (
          <div
            key={col}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(col)}
            className="flex flex-col rounded-3xl bg-slate-50/50 p-4 border border-slate-100 min-h-[550px] dark:bg-slate-900/10 dark:border-slate-800/60 transition-all duration-300"
          >
            
            {/* Column Header */}
            <div className="flex items-center justify-between mb-4 px-2">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm tracking-wide text-slate-800 dark:text-slate-200">{col}</h3>
                <span className="rounded-full bg-slate-100/80 px-2 py-0.5 text-xs font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                  {colTasks.length}
                </span>
              </div>
              <button
                onClick={() => setActiveInlineCreator(col)}
                className="text-slate-400 hover:text-primary dark:hover:text-primary transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            {/* Task Cards Stack */}
            <div className="flex-1 space-y-3 mb-4">
              {colTasks.map((task) => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={() => handleDragStart(task.id)}
                  onClick={() => onTaskClick(task.id)}
                  className="group relative cursor-grab active:cursor-grabbing rounded-2xl bg-white p-4 border border-slate-100 shadow-sm hover:shadow-md hover:scale-[1.01] dark:bg-slate-900 dark:border-slate-800/60 transition-all duration-200"
                >
                  
                  {/* Task Name */}
                  <h4 className="text-sm font-bold text-slate-800 group-hover:text-primary dark:text-slate-100 transition-colors duration-150">
                    {task.name}
                  </h4>

                  {/* Badges & Properties */}
                  <div className="mt-3 flex flex-wrap gap-2 items-center justify-between">
                    <div className="flex flex-wrap gap-1.5 items-center">
                      
                      {/* Priority Badge */}
                      <span className={`text-[10px] px-2 py-0.5 rounded-lg font-bold ${getPriorityBadgeColor(task.priority)}`}>
                        {task.priority}
                      </span>

                      {/* Date Badge */}
                      {task.dueDate && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-slate-400 font-semibold">
                          <Calendar className="h-3 w-3" />
                          {formatDueDate(task.dueDate)}
                        </span>
                      )}
                    </div>

                    {/* Member Avatar */}
                    {task.assignee ? (
                      <div>
                        {task.assignee.avatarUrl ? (
                          <img
                            src={task.assignee.avatarUrl}
                            alt={task.assignee.name}
                            className="h-6 w-6 rounded-full bg-slate-100 border border-white dark:border-slate-800 dark:bg-slate-800"
                          />
                        ) : (
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white text-[9px] font-bold">
                            {task.assignee.initials}
                          </div>
                        )}
                      </div>
                    ) : null}
                  </div>

                  {/* Labels list */}
                  {task.labels && task.labels.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1 border-t border-slate-50 pt-2.5 dark:border-slate-800/20">
                      {task.labels.map((lbl) => (
                        <span
                          key={lbl}
                          className="inline-block text-[9px] font-bold bg-primary-light text-primary px-2 py-0.5 rounded-md"
                        >
                          {lbl}
                        </span>
                      ))}
                    </div>
                  )}

                </div>
              ))}

              {colTasks.length === 0 && !activeInlineCreator && (
                <div className="flex flex-col items-center justify-center py-10 text-center border border-dashed border-slate-200 rounded-2xl dark:border-slate-800/60">
                  <span className="text-xs font-semibold text-slate-400">Drag tasks here</span>
                </div>
              )}
            </div>

            {/* Inline Card Creator Form */}
            {activeInlineCreator === col ? (
              <form onSubmit={(e) => handleCreateSubmit(e, col)} className="mt-auto">
                <input
                  type="text"
                  value={newTaskName}
                  onChange={(e) => setNewTaskName(e.target.value)}
                  placeholder="Task title..."
                  className="w-full rounded-2xl border border-slate-200 bg-white px-3.5 py-2 text-sm outline-none focus:border-primary dark:bg-slate-950 dark:border-slate-800 mb-2 shadow-sm"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 rounded-2xl bg-primary text-white py-2 text-xs font-bold hover:bg-primary-hover shadow-lg shadow-primary/10"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveInlineCreator(null)}
                    className="rounded-2xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-500 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <button
                onClick={() => setActiveInlineCreator(col)}
                className="mt-auto flex w-full items-center justify-center gap-1 rounded-2xl border border-dashed border-slate-200 py-3 text-xs font-bold text-slate-500 hover:bg-slate-100/50 hover:text-slate-700 dark:border-slate-800/60 dark:text-slate-400 dark:hover:bg-slate-800/40 dark:hover:text-slate-200 transition-all"
              >
                <Plus className="h-4 w-4" />
                Add Task
              </button>
            )}

          </div>
        );
      })}
    </div>
  );
}
