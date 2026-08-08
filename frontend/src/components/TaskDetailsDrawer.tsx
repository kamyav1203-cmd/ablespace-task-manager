'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Task, Project, User, tasksApi, projectsApi, usersApi } from '@/utils/api';
import { X, Calendar, Plus, Trash2, Tag, CheckSquare, MessageSquare, Paperclip } from 'lucide-react';

interface TaskDetailsDrawerProps {
  taskId: string;
  onClose: () => void;
  onUpdate: () => void;
}

export default function TaskDetailsDrawer({ taskId, onClose, onUpdate }: TaskDetailsDrawerProps) {
  const [task, setTask] = useState<Task | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [newSubtaskName, setNewSubtaskName] = useState('');
  const [loading, setLoading] = useState(true);

  const availableLabels = ['Research', 'Design', 'Development', 'Testing', 'Deployment'];

  useEffect(() => {
    fetchTaskDetails();
    fetchMetadata();
  }, [taskId]);

  const fetchTaskDetails = async () => {
    setLoading(true);
    try {
      const data = await tasksApi.getOne(taskId);
      setTask(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMetadata = async () => {
    try {
      const [projData, userData] = await Promise.all([
        projectsApi.getAll(),
        usersApi.getAll(),
      ]);
      setProjects(projData);
      setUsers(userData);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFieldChange = async (fieldName: keyof Task, value: any) => {
    if (!task) return;
    try {
      const updated = await tasksApi.update(task.id, { [fieldName]: value });
      setTask((prev) => (prev ? { ...prev, ...updated } : null));
      onUpdate();
    } catch (err) {
      console.error(err);
    }
  };

  const handleLabelToggle = async (label: string) => {
    if (!task) return;
    const currentLabels = task.labels || [];
    const newLabels = currentLabels.includes(label)
      ? currentLabels.filter((l) => l !== label)
      : [...currentLabels, label];

    await handleFieldChange('labels', newLabels);
  };

  const handleAddSubtask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!task || !newSubtaskName.trim()) return;

    try {
      await tasksApi.create({
        name: newSubtaskName,
        parentTaskId: task.id,
        status: 'To Do',
        priority: 'No Priority',
        projectId: task.projectId,
      });
      setNewSubtaskName('');
      fetchTaskDetails();
      onUpdate();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteSubtask = async (subtaskId: string) => {
    try {
      await tasksApi.delete(subtaskId);
      fetchTaskDetails();
      onUpdate();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubtaskStatusToggle = async (subtask: Task) => {
    try {
      const newStatus = subtask.status === 'Completed' ? 'To Do' : 'Completed';
      await tasksApi.update(subtask.id, { status: newStatus });
      fetchTaskDetails();
      onUpdate();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTask = async () => {
    if (!task) return;
    if (confirm('Are you sure you want to delete this task?')) {
      try {
        await tasksApi.delete(task.id);
        onUpdate();
        onClose();
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-y-0 right-0 z-45 w-full max-w-4xl bg-[#ffffff] shadow-2xl dark:bg-[#111827] flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!task) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-45 flex w-full max-w-4xl bg-white shadow-2xl border-l border-border dark:bg-[#111827] dark:border-slate-800 transition-all duration-300">
      
      {/* Main Drawer Container */}
      <div className="flex flex-1 flex-col h-full overflow-hidden">
        
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold px-2 py-1 bg-slate-100 rounded text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              Task Details
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDeleteTask}
              className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/20"
              title="Delete Task"
            >
              <Trash2 className="h-4 w-4" />
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex flex-1 overflow-hidden">
          
          {/* Left Main Scrollable Panel */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* Title */}
            <div>
              <input
                type="text"
                value={task.name}
                onChange={(e) => handleFieldChange('name', e.target.value)}
                className="w-full bg-transparent text-2xl font-bold border-none outline-none focus:border-b focus:border-border text-slate-900 dark:text-white"
                placeholder="Task Title"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Description
              </label>
              <textarea
                value={task.description || ''}
                onChange={(e) => handleFieldChange('description', e.target.value)}
                className="w-full min-h-[100px] rounded-xl border border-border bg-slate-50/50 p-3 text-sm text-slate-800 outline-none focus:border-primary dark:bg-slate-800/20 dark:border-slate-800 dark:text-slate-200"
                placeholder="Add a detailed description..."
              />
            </div>

            {/* Labels Section */}
            <div className="space-y-3">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Tag className="h-3 w-3" />
                Labels
              </label>
              <div className="flex flex-wrap gap-2">
                {availableLabels.map((lbl) => {
                  const isSelected = task.labels?.includes(lbl);
                  return (
                    <button
                      key={lbl}
                      onClick={() => handleLabelToggle(lbl)}
                      className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all ${
                        isSelected
                          ? 'bg-primary text-white shadow-sm'
                          : 'bg-slate-50 border border-slate-200 text-slate-650 hover:bg-slate-100 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-350'
                      }`}
                    >
                      {lbl}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Subtasks Section */}
            <div className="space-y-4">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <CheckSquare className="h-4 w-4" />
                Subtasks
              </label>
              
              {/* Subtasks List */}
              <div className="border border-border rounded-xl overflow-hidden dark:border-slate-800">
                <table className="min-w-full divide-y divide-border dark:divide-slate-800">
                  <tbody className="bg-white divide-y divide-border dark:bg-slate-900 dark:divide-slate-850">
                    {task.subtasks?.map((st) => (
                      <tr key={st.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                        <td className="w-12 text-center pl-4 py-3">
                          <input
                            type="checkbox"
                            checked={st.status === 'Completed'}
                            onChange={() => handleSubtaskStatusToggle(st)}
                            className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                          />
                        </td>
                        <td className="py-3 px-2">
                          <span
                            className={`text-sm ${
                              st.status === 'Completed'
                                ? 'line-through text-slate-400'
                                : 'text-slate-700 dark:text-slate-200'
                            }`}
                          >
                            {st.name}
                          </span>
                        </td>
                        <td className="w-12 pr-4 text-right py-3">
                          <button
                            onClick={() => handleDeleteSubtask(st.id)}
                            className="text-slate-400 hover:text-red-500"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Add Subtask Form */}
              <form onSubmit={handleAddSubtask} className="flex gap-2">
                <input
                  type="text"
                  value={newSubtaskName}
                  onChange={(e) => setNewSubtaskName(e.target.value)}
                  placeholder="Add a subtask..."
                  className="flex-1 rounded-xl border border-border px-3 py-2 text-sm outline-none focus:border-primary dark:bg-slate-900 dark:border-slate-800"
                />
                <button
                  type="submit"
                  className="flex items-center gap-1 rounded-xl bg-primary text-white px-3 py-2 text-sm font-semibold hover:bg-primary-hover shadow"
                >
                  <Plus className="h-4 w-4" />
                  Add
                </button>
              </form>
            </div>

          </div>

          {/* Right Properties Panel */}
          <div className="w-80 border-l border-border bg-slate-50/50 p-6 space-y-6 dark:border-slate-800 dark:bg-slate-900/50">
            
            {/* Status Option */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Status
              </label>
              <select
                value={task.status}
                onChange={(e) => handleFieldChange('status', e.target.value)}
                className="w-full rounded-xl border border-border bg-white p-2.5 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-primary dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200"
              >
                <option value="Backlog">Backlog</option>
                <option value="To Do">To Do</option>
                <option value="Doing">Doing</option>
                <option value="Completed">Completed</option>
                <option value="On Hold">On Hold</option>
              </select>
            </div>

            {/* Priority Option */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Priority
              </label>
              <select
                value={task.priority}
                onChange={(e) => handleFieldChange('priority', e.target.value)}
                className="w-full rounded-xl border border-border bg-white p-2.5 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-primary dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200"
              >
                <option value="No Priority">No Priority</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>

            {/* Assignee Option */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Assignee
              </label>
              <select
                value={task.assigneeId || ''}
                onChange={(e) => handleFieldChange('assigneeId', e.target.value || null)}
                className="w-full rounded-xl border border-border bg-white p-2.5 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-primary dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200"
              >
                <option value="">Unassigned</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.email})
                  </option>
                ))}
              </select>
            </div>

            {/* Project Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Project
              </label>
              <select
                value={task.projectId || ''}
                onChange={(e) => handleFieldChange('projectId', e.target.value || null)}
                className="w-full rounded-xl border border-border bg-white p-2.5 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-primary dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200"
              >
                <option value="">No Project</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Due Date Option */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Due Date
              </label>
              <input
                type="date"
                value={task.dueDate ? task.dueDate.substring(0, 10) : ''}
                onChange={(e) => handleFieldChange('dueDate', e.target.value || null)}
                className="w-full rounded-xl border border-border bg-white p-2.5 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-primary dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200"
              />
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
