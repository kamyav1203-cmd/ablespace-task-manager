'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';
import { LayoutGrid, FolderKanban, LogOut, ChevronDown, Check, Sun, Moon, Palette, Settings } from 'lucide-react';

interface User {
  name: string;
  email: string;
  avatarUrl?: string;
  initials: string;
}

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, colorMode, toggleTheme, setColorMode } = useTheme();

  const [user, setUser] = useState<User | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [activeSubMenu, setActiveSubMenu] = useState<'main' | 'theme' | 'color'>('main');

  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      setUser({
        name: 'Dexter',
        email: 'Dexter@gmail.com',
        avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Dexter',
        initials: 'DX',
      });
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
        setActiveSubMenu('main');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('currentUser');
    router.push('/login');
  };

  const navItems = [
    { name: 'Tasks', href: '/tasks', icon: LayoutGrid },
    { name: 'Projects', href: '/projects', icon: FolderKanban },
  ];

  return (
    <aside className="relative flex h-screen w-64 flex-col border-r border-slate-200/60 bg-white px-4 py-6 dark:border-slate-800/60 dark:bg-slate-900 transition-colors duration-300">
      
      {/* Header Logo */}
      <div className="flex items-center gap-2.5 px-3 mb-8">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-primary-hover text-white shadow shadow-primary/20">
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 2L2 22h20L12 2z" />
          </svg>
        </div>
        <span className="font-extrabold tracking-wider text-slate-850 dark:text-slate-100 uppercase text-xs">
          Pyramid
        </span>
      </div>

      {/* User Header Profile Selector */}
      <div className="relative mb-6" ref={popoverRef}>
        <button
          onClick={() => {
            setProfileOpen(!profileOpen);
            setActiveSubMenu('main');
          }}
          className="flex w-full items-center justify-between rounded-2xl p-2.5 hover:bg-slate-50 dark:hover:bg-slate-800/40 border border-transparent hover:border-slate-100 dark:hover:border-slate-800/60 transition-all duration-200"
        >
          <div className="flex items-center gap-3">
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="h-9 w-9 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-100 dark:border-slate-800"
              />
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white font-bold text-xs">
                {user?.initials || 'DX'}
              </div>
            )}
            <div className="text-left">
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                {user?.name || 'Dexter'}
              </p>
              <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">caseload</p>
            </div>
          </div>
          <ChevronDown className="h-4 w-4 text-slate-400" />
        </button>

        {/* Profile Popover */}
        {profileOpen && (
          <div className="absolute left-0 mt-2 w-60 z-50 rounded-2xl border border-slate-150 bg-white py-2 shadow-2xl dark:border-slate-800 dark:bg-slate-950 transition-all duration-250 animate-in fade-in slide-in-from-top-2">
            {activeSubMenu === 'main' && (
              <div className="space-y-0.5">
                {/* User details header */}
                <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800/60 mb-1.5">
                  <p className="text-[10px] font-bold text-slate-450 dark:text-slate-500 uppercase tracking-widest">Signed in as</p>
                  <p className="text-xs font-bold truncate text-slate-700 dark:text-slate-200 mt-0.5">{user?.email}</p>
                </div>
                
                {/* Change Theme */}
                <button
                  onClick={() => setActiveSubMenu('theme')}
                  className="flex w-full items-center justify-between px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 dark:text-slate-350 dark:hover:bg-slate-800/40"
                >
                  <span className="flex items-center gap-2.5">
                    <Sun className="h-4 w-4 text-slate-400" />
                    Change Theme
                  </span>
                  <ChevronDown className="h-3.5 w-3.5 -rotate-90 text-slate-400" />
                </button>

                {/* Color Mode */}
                <button
                  onClick={() => setActiveSubMenu('color')}
                  className="flex w-full items-center justify-between px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 dark:text-slate-350 dark:hover:bg-slate-800/40"
                >
                  <span className="flex items-center gap-2.5">
                    <Palette className="h-4 w-4 text-slate-400" />
                    Color Mode
                  </span>
                  <ChevronDown className="h-3.5 w-3.5 -rotate-90 text-slate-400" />
                </button>

                {/* Settings */}
                <button className="flex w-full items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 dark:text-slate-350 dark:hover:bg-slate-800/40">
                  <Settings className="h-4 w-4 text-slate-400" />
                  Settings
                </button>

                {/* Logout */}
                <div className="border-t border-slate-100 dark:border-slate-800/60 mt-1.5 pt-1.5">
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-red-650 hover:bg-red-50/50 dark:text-red-400 dark:hover:bg-red-950/20"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              </div>
            )}

            {/* Change Theme Submenu */}
            {activeSubMenu === 'theme' && (
              <div>
                <button
                  onClick={() => setActiveSubMenu('main')}
                  className="flex w-full items-center gap-2 px-4 py-2 text-[10px] font-bold text-slate-450 hover:bg-slate-50 dark:hover:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800/60 mb-1"
                >
                  &larr; Back
                </button>
                <button
                  onClick={() => toggleTheme('light')}
                  className="flex w-full items-center justify-between px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800/40"
                >
                  <span className="flex items-center gap-2.5">
                    <Sun className="h-4 w-4" />
                    Light
                  </span>
                  {theme === 'light' && <Check className="h-4 w-4 text-primary" />}
                </button>
                <button
                  onClick={() => toggleTheme('dark')}
                  className="flex w-full items-center justify-between px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800/40"
                >
                  <span className="flex items-center gap-2.5">
                    <Moon className="h-4 w-4" />
                    Dark
                  </span>
                  {theme === 'dark' && <Check className="h-4 w-4 text-primary" />}
                </button>
              </div>
            )}

            {/* Color Mode Submenu */}
            {activeSubMenu === 'color' && (
              <div>
                <button
                  onClick={() => setActiveSubMenu('main')}
                  className="flex w-full items-center gap-2 px-4 py-2 text-[10px] font-bold text-slate-455 hover:bg-slate-50 dark:hover:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800/60 mb-1"
                >
                  &larr; Back
                </button>
                <button
                  onClick={() => setColorMode('amber')}
                  className="flex w-full items-center justify-between px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800/40"
                >
                  <span className="flex items-center gap-2.5">
                    <span className="h-3 w-3 rounded-full bg-amber-500 shadow-sm" />
                    Amber
                  </span>
                  {colorMode === 'amber' && <Check className="h-4 w-4 text-primary" />}
                </button>
                <button
                  onClick={() => setColorMode('blue')}
                  className="flex w-full items-center justify-between px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800/40"
                >
                  <span className="flex items-center gap-2.5">
                    <span className="h-3 w-3 rounded-full bg-blue-500 shadow-sm" />
                    Blue
                  </span>
                  {colorMode === 'blue' && <Check className="h-4 w-4 text-primary" />}
                </button>
                <button
                  onClick={() => setColorMode('pink')}
                  className="flex w-full items-center justify-between px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800/40"
                >
                  <span className="flex items-center gap-2.5">
                    <span className="h-3 w-3 rounded-full bg-pink-500 shadow-sm" />
                    Pink
                  </span>
                  {colorMode === 'pink' && <Check className="h-4 w-4 text-primary" />}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1.5">
        <p className="px-3 mb-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
          Workspaces
        </p>
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <button
              key={item.name}
              onClick={() => router.push(item.href)}
              className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? 'bg-primary/10 text-primary shadow-sm shadow-primary/5'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800/30 dark:hover:text-slate-200'
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
