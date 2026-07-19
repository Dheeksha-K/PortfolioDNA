import { Calendar, Globe } from 'lucide-react'
import type { AnalysisResult } from '../../types/analysis'
import { scoreColor, scoreLabel } from '../../lib/utils'

interface Props { result: AnalysisResult }

export default function OverviewCard({ result }: Props) {
  const { overview, scores } = result
  const overall = scores.overall

  return (
    <div className="card p-5 h-full flex flex-col gap-4">
      <p className="text-xs text-muted uppercase tracking-widest font-medium">Overview</p>

      {/* Overall score ring */}
      <div className="flex items-center gap-4">
        <div className="relative w-20 h-20 shrink-0">
          <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
            <circle cx="40" cy="40" r="34" fill="none" stroke="#222" strokeWidth="7" />
            {overall !== null && (
              <circle
                cx="40" cy="40" r="34"
                fill="none"
                stroke={overall >= 80 ? '#22c55e' : overall >= 60 ? '#f59e0b' : '#ef4444'}
                strokeWidth="7"
                strokeLinecap="round"
                strokeDasharray={`${(overall / 100) * 213.6} 213.6`}
                className="transition-all duration-1000"
              />
            )}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {overall !== null ? (
              <>
                <span className={`text-xl font-bold ${scoreColor(overall)}`}>{overall}</span>
                <span className="text-[9px] text-muted">/ 100</span>
              </>
            ) : (
              <span className="text-xs text-muted text-center leading-tight">N/A</span>
            )}
          </div>
        </div>
        <div>
          <p className="font-semibold text-primary text-sm">
            {overall !== null ? scoreLabel(overall) : 'Incomplete'}
          </p>
          <p className="text-xs text-muted mt-0.5">Overall Score</p>
        </div>
      </div>

      <div className="border-t border-border pt-4 space-y-2">
        {overview.title && (
          <div className="flex items-start gap-2">
            <Globe size={13} className="text-muted shrink-0 mt-0.5" />
            <span className="text-xs text-muted-2 leading-relaxed">{overview.title}</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <Calendar size={13} className="text-muted shrink-0" />
          <span className="text-xs text-muted">
            {new Date(overview.analyzedAt).toLocaleString(undefined, {
              dateStyle: 'medium',
              timeStyle: 'short',
            })}
          </span>
        </div>
      </div>
    </div>
  )
}
