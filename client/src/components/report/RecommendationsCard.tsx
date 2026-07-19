import { motion } from 'framer-motion'
import { Lightbulb, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import type { Recommendation } from '../../types/analysis'
import { priorityColor } from '../../lib/utils'

interface Props { recommendations: Recommendation[] }

function RecommendationItem({ rec, index }: { rec: Recommendation; index: number }) {
  const [open, setOpen] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="border border-border rounded-lg overflow-hidden"
    >
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between gap-3 p-4 text-left hover:bg-surface-2 transition-colors"
      >
        <div className="flex items-center gap-3 min-w-0">
          <Lightbulb size={14} className="text-muted shrink-0" />
          <span className="text-xs font-medium text-primary truncate">{rec.issue}</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${priorityColor(rec.priority)}`}>
            {rec.priority}
          </span>
          {open ? <ChevronUp size={13} className="text-muted" /> : <ChevronDown size={13} className="text-muted" />}
        </div>
      </button>

      {open && (
        <div className="px-4 pb-4 pt-0 space-y-3 border-t border-border bg-surface-2">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
            <div>
              <p className="text-[10px] text-muted uppercase tracking-widest mb-1">Reason</p>
              <p className="text-xs text-muted-2 leading-relaxed">{rec.reason}</p>
            </div>
            <div>
              <p className="text-[10px] text-muted uppercase tracking-widest mb-1">Impact</p>
              <p className="text-xs text-muted-2 leading-relaxed">{rec.impact}</p>
            </div>
            <div>
              <p className="text-[10px] text-muted uppercase tracking-widest mb-1">Suggested Fix</p>
              <p className="text-xs text-muted-2 leading-relaxed">{rec.suggestedFix}</p>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default function RecommendationsCard({ recommendations }: Props) {
  const sorted = [...recommendations].sort((a, b) => {
    const order = { High: 0, Medium: 1, Low: 2 }
    return order[a.priority] - order[b.priority]
  })

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs text-muted uppercase tracking-widest font-medium">Recommendations</p>
        <span className="text-xs text-muted">{recommendations.length} item{recommendations.length !== 1 ? 's' : ''}</span>
      </div>

      {recommendations.length === 0 ? (
        <p className="text-xs text-muted italic">No recommendations — your portfolio looks great!</p>
      ) : (
        <div className="space-y-2">
          {sorted.map((rec, i) => (
            <RecommendationItem key={i} rec={rec} index={i} />
          ))}
        </div>
      )}
    </div>
  )
}
