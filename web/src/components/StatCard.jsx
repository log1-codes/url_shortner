import React from 'react'
import { Link2, MousePointerClick, ShieldCheck } from 'lucide-react'

export function StatCard({ type, label, value }) {
  const getIcon = () => {
    switch (type) {
      case 'links':
        return <Link2 size={16} className="text-zinc-400" />
      case 'redirects':
        return <MousePointerClick size={16} className="text-emerald-400" />
      case 'session':
        return <ShieldCheck size={16} className="text-sky-400" />
      default:
        return null
    }
  }

  return (
    <div className="bg-[#101013] border border-white/[0.08] rounded-xl p-4 flex flex-col justify-between gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs text-zinc-400 font-medium">{label}</span>
        {getIcon()}
      </div>

      <div className="text-2xl font-bold text-zinc-100 tracking-tight">
        {value}
      </div>
    </div>
  )
}
