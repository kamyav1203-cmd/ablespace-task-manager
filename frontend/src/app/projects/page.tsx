'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { Project, User, projectsApi, usersApi } from '@/utils/api';
import { Search, SlidersHorizontal, Filter, Plus, Calendar, ArrowUpRight, FolderKanban } from 'lucide-react';

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectPriority, setNewProjectPriority] = useState('Medium');
  const [newProjectLead, setNewProjectLead] = useState('');
  const [newProjectDueDate, setNewProjectDueDate] = useState('');

  useEffect(() => {
    fetchProjects();
    fetchUsers();
  }, [searchQuery]);

  const fetchProjects = async () => {
    try {
      const data = await projectsApi.getAll();
      if (searchQuery) {
        setProjects(data.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase())));
      } else {
        setProjects(data);
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

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;

    try {
      await projectsApi.create({
        name: newProjectName,
        priority: newProjectPriority,
        leadId: newProjectLead || undefined,
        dueDate: newProjectDueDate || undefined,
      });
      setNewProjectName('');
      setNewProjectLead('');
      setNewProjectDueDate('');
      setShowAddForm(false);
      fetchProjects();
    } catch (err) {
      console.error(err);
    }
  };

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-455 border border-rose-100/30';
      case 'Medium':
        return 'bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-455 border border-amber-100/30';
      case 'Low':
        return 'bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-455 border border-blue-100/30';
      default:
        return 'bg-slate-50 text-slate-700 dark:bg-slate-800 dark:text-slate-350 border border-slate-200';
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <Sidebar />

      <main className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* Header Toolbar */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 bg-white px-8 py-5 dark:bg-[#111827] dark:border-slate-800/60 transition-colors duration-200 shadow-sm z-10">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold tracking-tight text-slate-800 dark:text-white">
              Projects
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects..."
                className="w-48 rounded-2xl border border-slate-200 bg-slate-50/50 pl-9 pr-4 py-2 text-sm outline-none focus:border-primary dark:bg-slate-900 dark:border-slate-800"
              />
            </div>

            {/* Fields / Filters */}
            <button className="flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300">
              <SlidersHorizontal className="h-4 w-4 text-slate-400" />
              Fields
            </button>
            <button className="flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300">
              <Filter className="h-4 w-4 text-slate-400" />
              Filter
            </button>

            {/* Add Project Trigger */}
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-1.5 rounded-2xl bg-primary px-5 py-2.5 text-xs font-bold text-white hover:bg-primary-hover shadow-lg shadow-primary/15 hover:scale-[1.02] transition-all"
            >
              <Plus className="h-4.5 w-4.5" />
              Add Project
            </button>

          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8">
          
          {/* Add Project Form Drawer Modal */}
          {showAddForm && (
            <div className="mb-6 rounded-3xl border border-slate-100 bg-white p-6 dark:bg-[#111827] dark:border-slate-800 shadow-md animate-in fade-in slide-in-from-top-2">
              <h2 className="text-sm font-bold mb-4 text-slate-800 dark:text-slate-100 uppercase tracking-wider">Create New Project</h2>
              <form onSubmit={handleCreateProject} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-450 uppercase tracking-wide">Project Name</label>
                  <input
                    type="text"
                    required
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    placeholder="Enter project name..."
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm dark:bg-slate-900 dark:border-slate-800 outline-none focus:border-primary"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-450 uppercase tracking-wide">Priority</label>
                  <select
                    value={newProjectPriority}
                    onChange={(e) => setNewProjectPriority(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm dark:bg-slate-900 dark:border-slate-800 outline-none focus:border-primary"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-450 uppercase tracking-wide">Project Lead</label>
                  <select
                    value={newProjectLead}
                    onChange={(e) => setNewProjectLead(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm dark:bg-slate-900 dark:border-slate-800 outline-none focus:border-primary"
                  >
                    <option value="">Unassigned</option>
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-455 uppercase tracking-wide">Due Date</label>
                  <input
                    type="date"
                    value={newProjectDueDate}
                    onChange={(e) => setNewProjectDueDate(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm dark:bg-slate-900 dark:border-slate-800 outline-none focus:border-primary"
                  />
                </div>
                <div className="md:col-span-4 flex gap-2 justify-end mt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-2xl bg-primary px-5 py-2.5 text-xs font-bold text-white hover:bg-primary-hover shadow-lg shadow-primary/10"
                  >
                    Save Project
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Projects Table */}
          <div className="rounded-3xl border border-slate-100 bg-white dark:border-slate-800/60 dark:bg-slate-900/60 overflow-hidden shadow-md">
            <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-800">
              <thead className="bg-slate-50/20 dark:bg-slate-950/20">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-slate-400">
                    Project
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-slate-400">
                    Priority
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-slate-400">
                    Lead
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-slate-400">
                    Due Date
                  </th>
                  <th scope="col" className="relative px-6 py-4 w-20">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 bg-white dark:bg-slate-900 dark:divide-slate-850">
                {projects.map((proj) => (
                  <tr
                    key={proj.id}
                    onClick={() => router.push(`/projects/${proj.id}`)}
                    className="group cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-800/10"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3 font-bold text-slate-800 group-hover:text-primary dark:text-slate-100 transition-colors text-sm">
                        <FolderKanban className="h-4.5 w-4.5 text-slate-400" />
                        {proj.name}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-xl px-2.5 py-0.5 text-xs font-semibold ${getPriorityBadgeColor(proj.priority)}`}>
                        {proj.priority}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      {proj.lead ? (
                        <div className="flex items-center gap-2">
                          {proj.lead.avatarUrl ? (
                            <img src={proj.lead.avatarUrl} alt={proj.lead.name} className="h-6 w-6 rounded-full border border-slate-100 dark:border-slate-800" />
                          ) : (
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white text-[9px] font-bold">
                              {proj.lead.initials}
                            </div>
                          )}
                          <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{proj.lead.name}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">No Lead</span>
                      )}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                        {proj.dueDate ? new Date(proj.dueDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right whitespace-nowrap text-sm font-medium">
                      <span className="flex items-center justify-end text-primary opacity-0 group-hover:opacity-100 transition-all gap-1 text-xs font-bold">
                        View Tasks
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </span>
                    </td>
                  </tr>
                ))}

                {projects.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400 text-sm">
                      No projects found. Click "Add Project" to create one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>

      </main>

    </div>
  );
}
