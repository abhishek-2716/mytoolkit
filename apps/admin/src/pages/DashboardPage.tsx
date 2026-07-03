import { useQuery } from '@tanstack/react-query'
import { analyticsApi, blogApi, newsletterApi, contactApi } from '../lib/endpoints'
import { StatCard, Spinner } from '../components/ui'
import { FileText, Mail, MessageSquare, Eye, Wrench, TrendingUp } from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts'
import { formatDate } from '../lib/utils'

export default function DashboardPage() {
  const { data: analytics, isLoading: aLoading } = useQuery({
    queryKey: ['analytics-dashboard'],
    queryFn: analyticsApi.dashboard,
  })
  const { data: blog } = useQuery({
    queryKey: ['blog', { limit: 5, status: 'PUBLISHED' }],
    queryFn: () => blogApi.list({ limit: 5, status: 'PUBLISHED' }),
  })
  const { data: nlStats } = useQuery({
    queryKey: ['newsletter-stats'],
    queryFn: newsletterApi.stats,
  })
  const { data: contactStats } = useQuery({
    queryKey: ['contact-stats'],
    queryFn: contactApi.stats,
  })

  if (aLoading) return (
    <div className="flex items-center justify-center h-64">
      <Spinner size={32} />
    </div>
  )

  const daily = (analytics?.dailyViews ?? []) as Array<{ date: string; count: string }>

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-white">Dashboard</h1>
        <p className="text-sm text-slate-400 mt-0.5">MyToolsHub platform overview</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard label="Total Views" value={analytics?.summary?.totalPageViews ?? 0} icon={Eye} color="indigo" />
        <StatCard label="Views (30d)" value={analytics?.summary?.pageViews30d ?? 0} icon={TrendingUp} color="blue" />
        <StatCard label="Views (7d)" value={analytics?.summary?.pageViews7d ?? 0} icon={TrendingUp} color="violet" />
        <StatCard label="Blog Posts" value={blog?.meta?.total ?? 0} icon={FileText} color="emerald" />
        <StatCard label="Subscribers" value={nlStats?.active ?? 0} icon={Mail} color="amber" />
        <StatCard label="Unread Messages" value={contactStats?.unread ?? 0} icon={MessageSquare} color="red" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Daily views chart */}
        <div className="card lg:col-span-2">
          <h2 className="text-sm font-medium text-slate-300 mb-4">Page Views — Last 30 Days</h2>
          {daily.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={daily.map(d => ({ date: d.date?.slice(5), views: Number(d.count) }))}>
                <defs>
                  <linearGradient id="viewGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 8 }}
                  labelStyle={{ color: '#94a3b8' }}
                  itemStyle={{ color: '#818cf8' }}
                />
                <Area type="monotone" dataKey="views" stroke="#6366f1" fill="url(#viewGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[200px] text-slate-600 text-sm">
              No data yet — views will appear once traffic comes in
            </div>
          )}
        </div>

        {/* Top tools */}
        <div className="card">
          <h2 className="text-sm font-medium text-slate-300 mb-4 flex items-center gap-2">
            <Wrench size={14} /> Top Tools (30d)
          </h2>
          <div className="space-y-3">
            {(analytics?.topTools ?? []).slice(0, 8).map((t: { slug: string; uses: number }, i: number) => (
              <div key={t.slug} className="flex items-center gap-3">
                <span className="text-xs text-slate-600 w-4">{i + 1}</span>
                <span className="flex-1 text-xs text-slate-300 truncate">{t.slug}</span>
                <span className="text-xs text-indigo-400 font-medium">{t.uses}</span>
              </div>
            ))}
            {!analytics?.topTools?.length && (
              <p className="text-xs text-slate-600 text-center py-4">No tool usage tracked yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent posts */}
      <div className="card">
        <h2 className="text-sm font-medium text-slate-300 mb-4 flex items-center gap-2">
          <FileText size={14} /> Recent Blog Posts
        </h2>
        <div className="divide-y divide-slate-800">
          {(blog?.data ?? []).map((post: { id: string; title: string; status: string; publishedAt?: string; author?: { name: string } }) => (
            <div key={post.id} className="py-3 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white truncate">{post.title}</p>
                <p className="text-xs text-slate-500 mt-0.5">{post.author?.name} · {post.publishedAt ? formatDate(post.publishedAt) : 'Draft'}</p>
              </div>
              <span className={`badge ${post.status === 'PUBLISHED' ? 'badge-green' : post.status === 'DRAFT' ? 'badge-yellow' : 'badge-slate'}`}>
                {post.status}
              </span>
            </div>
          ))}
          {!blog?.data?.length && (
            <p className="text-xs text-slate-600 py-4 text-center">No posts yet</p>
          )}
        </div>
      </div>
    </div>
  )
}
