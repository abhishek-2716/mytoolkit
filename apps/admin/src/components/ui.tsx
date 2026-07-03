import { Loader2 } from 'lucide-react'

export function Spinner({ size = 20 }: { size?: number }) {
  return <Loader2 size={size} className="animate-spin text-indigo-400" />
}

export function PageHeader({
  title, subtitle, action,
}: {
  title: string
  subtitle?: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h1 className="text-xl font-semibold text-white">{title}</h1>
        {subtitle && <p className="text-sm text-slate-400 mt-0.5">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}

export function EmptyState({ message = 'No data found' }: { message?: string }) {
  return (
    <div className="text-center py-16 text-slate-500 text-sm">{message}</div>
  )
}

export function ErrorMsg({ message }: { message: string }) {
  return (
    <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
      {message}
    </div>
  )
}

export function StatCard({
  label, value, icon: Icon, color = 'indigo',
}: {
  label: string
  value: string | number
  icon: React.ElementType
  color?: string
}) {
  const colorMap: Record<string, string> = {
    indigo: 'bg-indigo-500/10 text-indigo-400',
    emerald: 'bg-emerald-500/10 text-emerald-400',
    amber: 'bg-amber-500/10 text-amber-400',
    red: 'bg-red-500/10 text-red-400',
    blue: 'bg-blue-500/10 text-blue-400',
    violet: 'bg-violet-500/10 text-violet-400',
  }
  return (
    <div className="card">
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorMap[color] ?? colorMap.indigo}`}>
          <Icon size={20} />
        </div>
        <div>
          <p className="text-2xl font-bold text-white">{value}</p>
          <p className="text-xs text-slate-400 mt-0.5">{label}</p>
        </div>
      </div>
    </div>
  )
}

export function Modal({
  open, onClose, title, children,
}: {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-slate-900 border border-slate-700 rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <h2 className="font-semibold text-white">{title}</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors text-xl leading-none">&times;</button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  )
}

export function ConfirmDialog({
  open, onClose, onConfirm, title, message,
}: {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
}) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <p className="text-sm text-slate-400 mb-5">{message}</p>
      <div className="flex gap-3 justify-end">
        <button onClick={onClose} className="btn-secondary">Cancel</button>
        <button onClick={() => { onConfirm(); onClose() }} className="btn-danger">Delete</button>
      </div>
    </Modal>
  )
}
