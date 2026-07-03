import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, FileText, Users, Tag, FolderOpen,
  Image, Link2, HelpCircle, Megaphone, Star,
  BarChart3, Mail, MessageSquare, Shield, LogOut,
  ChevronLeft, ChevronRight, Globe, User,
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { cn } from '../lib/utils'

const NAV = [
  { label: 'Dashboard', icon: LayoutDashboard, to: '/' },
  { label: 'Blog Posts', icon: FileText, to: '/blog' },
  { label: 'Authors', icon: User, to: '/authors' },
  { label: 'Categories', icon: FolderOpen, to: '/categories' },
  { label: 'Tags', icon: Tag, to: '/tags' },
  { label: 'Banners', icon: Image, to: '/banners' },
  { label: 'Footer Links', icon: Link2, to: '/footer' },
  { label: 'About Page', icon: Globe, to: '/about' },
  { label: 'FAQ', icon: HelpCircle, to: '/faq' },
  { label: 'Advertisements', icon: Megaphone, to: '/ads' },
  { label: 'Sponsorships', icon: Star, to: '/sponsors' },
  { label: 'Analytics', icon: BarChart3, to: '/analytics' },
  { label: 'Newsletter', icon: Mail, to: '/newsletter' },
  { label: 'Contact', icon: MessageSquare, to: '/contact' },
  { label: 'Users', icon: Shield, to: '/users' },
]

export function Sidebar({ collapsed, setCollapsed }: {
  collapsed: boolean
  setCollapsed: (v: boolean) => void
}) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <aside className={cn(
      'flex flex-col h-screen bg-slate-900 border-r border-slate-800 transition-all duration-200',
      collapsed ? 'w-16' : 'w-60'
    )}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-slate-800 min-h-[60px]">
        <div className="flex-shrink-0 w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white text-sm">M</div>
        {!collapsed && <span className="font-semibold text-white truncate">MyToolsHub</span>}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto text-slate-500 hover:text-slate-300 transition-colors"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {NAV.map(({ label, icon: Icon, to }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) => cn('sidebar-link', isActive && 'active')}
            title={collapsed ? label : undefined}
          >
            <Icon size={17} className="flex-shrink-0" />
            {!collapsed && <span className="truncate">{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div className="border-t border-slate-800 p-3">
        <div className={cn('flex items-center gap-3', collapsed && 'justify-center')}>
          <div className="w-8 h-8 rounded-full bg-indigo-600/30 flex items-center justify-center text-indigo-400 text-xs font-bold flex-shrink-0">
            {user?.name?.[0]?.toUpperCase() ?? 'A'}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white truncate">{user?.name}</p>
              <p className="text-xs text-slate-500 truncate">{user?.role}</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="text-slate-500 hover:text-red-400 transition-colors"
            title="Logout"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  )
}
