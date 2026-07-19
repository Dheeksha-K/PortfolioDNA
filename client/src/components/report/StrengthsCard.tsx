import { CheckCircle2 } from 'lucide-react'
import { motion } from 'framer-motion'

interface Props { strengths: string[] }

export default function StrengthsCard({ strengths }: Props) {
  return (
    <div className="card p-5 h-full">
      <p className="text-xs text-muted uppercase tracking-widest font-medium mb-4">Strengths</p>
      {strengths.length === 0 ? (
        <p className="text-xs text-muted italic">No strengths detected based on available data.</p>
      ) : (
        <ul className="space-y-2">
          {strengths.map((s, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-start gap-2.5"
            >
              <CheckCircle2 size={14} className="text-success shrink-0 mt-0.5" />
              <span className="text-xs text-muted-2 leading-relaxed">{s}</span>
            </motion.li>
          ))}
        </ul>
      )}
    </div>
  )
}
