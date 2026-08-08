'use client';

import React, { useState } from 'react';
import { Task, User, tasksApi } from '@/utils/api';
import { ChevronRight, ChevronDown, Plus, MoreHorizontal, Calendar, Eye } from 'lucide-react';

interface TaskListViewProps {
  tasks: Task[];
  users: User[];
  visibleFields: {
    priority: boolean;
    members: boolean;
    dueDate: boolean;
    labels: boolean;
    status: boolean;
  };
  onTaskClick: (taskId: string) => void;
  onRefresh: () => void;
  selectedProjectId?: string;
}

export default function TaskListView({
  tasks,
  users,
  visibleFields,
  onTaskClick,
  onRefresh,
  selectedProjectId,
}: TaskListViewProps) {
  
  const statuses = ['To Do', 'Doing', 'Completed', 'On Hold'];
  const [collapsedStatuses, setCollapsedStatuses] = useState<Record<string, boolean>>({});
  const [inlineTaskNames, setInlineTaskNames] = useState<Record<string, string>>({});
  const [activeInlineCreator, setActiveInlineCreator] = useState<string | null>(null);

  const toggleCollapse = (status: string) => {
    setCollapsedStatuses((prev) => ({ ...prev, [status]: !prev[status] }));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Urgent':
        return 'bg-red-500';
      case 'High':
        return 'bg-rose-500';
      case 'Medium':
        return 'bg-amber-500';
      case 'Low':
        return 'bg-blue-500';
      default:
        return 'bg-slate-300 dark:bg-slate-600';
    }
  };

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case 'Urgent':
        return 'bg-red-50 text-red-750 dark:bg-red-950/20 dark:text-red-400 border border-red-100/30';
      case 'High':
        return 'bg-rose-50 text-rose-750 dark:bg-rose-950/20 dark:text-rose-400 border border-rose-100/30';
      case 'Medium':
        return 'bg-amber-50 text-amber-750 dark:bg-amber-950/20 dark:text-amber-400 border border-amber-100/30';
      case 'Low':
        return 'bg-blue-50 text-blue-750 dark:bg-blue-950/20 dark:text-blue-400 border border-blue-100/30';
      default:
        return 'bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-100 dark:border-slate-800/40';
    }
  };

  const handleInlineSubmit = async (e: React.FormEvent, status: string) => {
    e.preventDefault();
    const taskName = inlineTaskNames[status];
    if (!taskName || !taskName.trim()) return;

    try {
      await tasksApi.create({
        name: taskName,
        status,
        projectId: selectedProjectId || undefined,
        priority: 'No Priority',
      });
      setInlineTaskNames((prev) => ({ ...prev, [status]: '' }));
      setActiveInlineCreator(null);
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const formatDueDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {statuses.map((status) => {
        const groupTasks = tasks.filter((t) => t.status === status);
        const isCollapsed = collapsedStatuses[status];

        return (
          <div
            key={status}
            className="rounded-3xl border border-slate-100 bg-white shadow-md dark:border-slate-800/60 dark:bg-slate-900/60 overflow-hidden transition-all duration-300 hover:shadow-lg"
          >
            
            {/* Status Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4.5 dark:border-slate-800/60 bg-slate-50/30 dark:bg-slate-950/20">
              <button
                onClick={() => toggleCollapse(status)}
                className="flex items-center gap-2.5 font-bold text-slate-800 dark:text-slate-200 text-sm tracking-wide"
              >
                {isCollapsed ? (
                  <ChevronRight className="h-4.5 w-4.5 text-slate-400" />
                ) : (
                  <ChevronDown className="h-4.5 w-4.5 text-slate-400" />
                )}
                {status}
                <span className="ml-1 rounded-full bg-slate-100/80 px-2.5 py-0.5 text-xs font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                  {groupTasks.length}
                </span>
              </button>

              <button
                onClick={() => {
                  setActiveInlineCreator(status);
                  setCollapsedStatuses((prev) => ({ ...prev, [status]: false }));
                }}
                className="flex items-center gap-1 text-xs font-bold text-primary hover:underline hover:scale-[1.02] transition-transform"
              >
                <Plus className="h-4 w-4" />
                Add Task
              </button>
            </div>

            {/* Tasks Table */}
            {!isCollapsed && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-800">
                  <thead>
                    <tr className="bg-slate-50/10 dark:bg-slate-950/5">
                      <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-widest text-slate-400">
                        Task Name
                      </th>
                      {visibleFields.priority && (
                        <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-widest text-slate-400 w-32">
                          Priority
                        </th>
                      )}
                      {visibleFields.members && (
                        <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-widest text-slate-400 w-36">
                          Assignee
                        </th>
                      )}
                      {visibleFields.dueDate && (
                        <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-widest text-slate-400 w-32">
                          Due Date
                        </th>
                      )}
                      {visibleFields.labels && (
                        <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-widest text-slate-400">
                          Labels
                        </th>
                      )}
                      <th scope="col" className="relative px-6 py-3.5 w-20">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100 bg-white dark:bg-slate-900 dark:divide-slate-800">
                    {groupTasks.map((task) => (
                      <tr
                        key={task.id}
                        onClick={() => onTaskClick(task.id)}
                        className="group cursor-pointer hover:bg-slate-50/30 dark:hover:bg-slate-800/10 transition-colors duration-150"
                      >
                        {/* Task Name */}
                        <td className="px-6 py-4.5">
                          <div className="flex items-center gap-3">
                            <span className={`h-2.5 w-2.5 rounded-full ${getPriorityColor(task.priority)} shadow-sm`} />
                            <span className="text-sm font-bold text-slate-750 group-hover:text-primary dark:text-slate-200 transition-colors duration-150">
                              {task.name}
                            </span>
                          </div>
                        </td>

                        {/* Priority */}
                        {visibleFields.priority && (
                          <td className="px-6 py-4.5 whitespace-nowrap">
                            <span className={`inline-flex items-center rounded-xl px-2.5 py-1 text-xs font-semibold ${getPriorityBadgeColor(task.priority)}`}>
                              {task.priority}
                            </span>
                          </td>
                        )}

                        {/* Assignee */}
                        {visibleFields.members && (
                          <td className="px-6 py-4.5 whitespace-nowrap">
                            {task.assignee ? (
                              <div className="flex items-center gap-2">
                                {task.assignee.avatarUrl ? (
                                  <img
                                    src={task.assignee.avatarUrl}
                                    alt={task.assignee.name}
                                    className="h-6 w-6 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-100 dark:border-slate-800"
                                  />
                                ) : (
                                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white text-[9px] font-bold">
                                    {task.assignee.initials}
                                  </div>
                                )}
                                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                  {task.assignee.name}
                                </span>
                              </div>
                            ) : (
                              <span className="text-xs font-semibold text-slate-400">Unassigned</span>
                            )}
                          </td>
                        )}

                        {/* Due Date */}
                        {visibleFields.dueDate && (
                          <td className="px-6 py-4.5 whitespace-nowrap">
                            <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                              {formatDueDate(task.dueDate)}
                            </span>
                          </td>
                        )}

                        {/* Labels */}
                        {visibleFields.labels && (
                          <td className="px-6 py-4.5">
                            <div className="flex flex-wrap gap-1.5">
                              {task.labels?.map((lbl) => (
                                <span
                                  key={lbl}
                                  className="inline-flex items-center rounded-lg bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-primary"
                                >
                                  {lbl}
                                </span>
                              ))}
                              {(!task.labels || task.labels.length === 0) && (
                                <span className="text-xs text-slate-400">-</span>
                              )}
                            </div>
                          </td>
                        )}

                        {/* Actions */}
                        <td className="px-6 py-4.5 text-right whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onTaskClick(task.id);
                            }}
                            className="text-slate-400 hover:text-primary dark:hover:text-primary transition-colors flex items-center justify-end w-full gap-1 text-xs font-bold opacity-0 group-hover:opacity-100"
                          >
                            <Eye className="h-4 w-4" />
                            Open
                          </button>
                        </td>
                      </tr>
                    ))}

                    {/* Inline Task Creator Input Row */}
                    {activeInlineCreator === status && (
                      <tr className="bg-slate-50/10 dark:bg-slate-800/5">
                        <td colSpan={6} className="px-6 py-4">
                          <form
                            onSubmit={(e) => handleInlineSubmit(e, status)}
                            className="flex items-center gap-3"
                          >
                            <input
                              type="text"
                              value={inlineTaskNames[status] || ''}
                              onChange={(e) =>
                                setInlineTaskNames((prev) => ({
                                  ...prev,
                                  [status]: e.target.value,
                                }))
                              }
                              placeholder="Type task name..."
                              className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:border-primary dark:bg-slate-950 dark:border-slate-800"
                              autoFocus
                            />
                            <button
                              type="submit"
                              className="rounded-2xl bg-primary px-4 py-2 text-xs font-bold text-white hover:bg-primary-hover shadow-lg shadow-primary/10 hover:scale-[1.02] transition-all"
                            >
                              Create
                            </button>
                            <button
                              type="button"
                              onClick={() => setActiveInlineCreator(null)}
                              className="text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                            >
                              Cancel
                            </button>
                          </form>
                        </td>
                      </tr>
                    )}

                    {/* Empty State Row */}
                    {activeInlineCreator !== status && groupTasks.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-6 py-10 text-center text-slate-400 text-sm font-medium">
                          No tasks in this section.{' '}
                          <button
                            onClick={() => setActiveInlineCreator(status)}
                            className="text-primary font-bold hover:underline"
                          >
                            Add Task
                          </button>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

          </div>
        );
      })}
    </div>
  );
}
