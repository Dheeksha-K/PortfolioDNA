import { AlertCircle, AlertTriangle, Info } from 'lucide-react'
import { motion } from 'framer-motion'
import type { Issue } from '../../types/analysis'

interface Props { issues: Issue[] }

const severityConfig = {
  high: { icon: AlertCircle, color: 'text-danger', bg: 'bg-danger/5 border-danger/20', label: 'High' },
  medium: { icon: AlertTriangle, color: 'text-warning', bg: 'bg-warning/5 border-warning/20', label: 'Medium' },
  low: { icon: Info, color: 'text-muted-2', bg: 'bg-surface-2 border-border', label: 'Low' },
}

export default function IssuesCard({ issues }: Props) {
  const counts = { high: 0, medium: 0, low: 0 }
  issues.forEach(i => counts[i.severity]++)

  return (
    <div className="card p-5 h-full">
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs text-muted uppercase tracking-widest font-medium">Issues Found</p>
        <div className="flex items-center gap-2">
          {counts.high > 0 && <span className="text-[10px] font-mono text-danger">{counts.high} high</span>}
          {counts.medium > 0 && <span className="text-[10px] font-mono text-warning">{counts.medium} med</span>}
          {counts.low > 0 && <span className="text-[10px] font-mono text-muted">{counts.low} low</span>}
        </div>
      </div>

      {issues.length === 0 ? (
        <p className="text-xs text-muted italic">No issues detected. Great job!</p>
      ) : (
        <ul className="space-y-2 max-h-80 overflow-y-auto pr-1">
          {issues.map((issue, i) => {
            const { icon: Icon, color, bg, label } = severityConfig[issue.severity]
            return (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`flex items-start gap-2.5 p-2.5 rounded-lg border ${bg}`}
              >
                <Icon size={13} className={`${color} shrink-0 mt-0.5`} />
                <div className="min-w-0">
                  <p className="text-xs font-medium text-primary leading-tight">{issue.title}</p>
                  <p className="text-[11px] text-muted mt-0.5 leading-relaxed">{issue.description}</p>
                </div>
                <span className={`text-[10px] font-medium shrink-0 ${color} opacity-70`}>{label}</span>
              </motion.li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
