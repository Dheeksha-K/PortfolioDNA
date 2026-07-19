import { motion } from 'framer-motion'
import type { Scores } from '../../types/analysis'
import { scoreColor } from '../../lib/utils'

interface Props { scores: Scores }

const scoreItems: { key: keyof Scores; label: string }[] = [
  { key: 'seo', label: 'SEO' },
  { key: 'accessibility', label: 'Accessibility' },
  { key: 'content', label: 'Content' },
  { key: 'branding', label: 'Branding' },
]

function barColor(score: number): string {
  if (score >= 80) return 'bg-success'
  if (score >= 60) return 'bg-warning'
  return 'bg-danger'
}

export default function ScoresCard({ scores }: Props) {
  return (
    <div className="card p-5 h-full">
      <p className="text-xs text-muted uppercase tracking-widest font-medium mb-5">Category Scores</p>
      <div className="space-y-4">
        {scoreItems.map(({ key, label }) => {
          const val = scores[key]
          return (
            <div key={key}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium text-muted-2">{label}</span>
                {val !== null ? (
                  <span className={`text-xs font-bold font-mono ${scoreColor(val)}`}>{val}</span>
                ) : (
                  <span className="text-xs text-muted">—</span>
                )}
              </div>
              <div className="h-1.5 bg-surface-2 rounded-full overflow-hidden">
                {val !== null && (
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${val}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
                    className={`h-full rounded-full ${barColor(val)}`}
                  />
                )}
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-5 pt-4 border-t border-border flex items-center gap-4">
        {[
          { label: 'Excellent', color: 'bg-success', range: '≥ 80' },
          { label: 'Good', color: 'bg-warning', range: '60–79' },
          { label: 'Needs Work', color: 'bg-danger', range: '< 60' },
        ].map(({ label, color, range }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${color}`} />
            <span className="text-xs text-muted">{label} ({range})</span>
          </div>
        ))}
      </div>
    </div>
  )
}
