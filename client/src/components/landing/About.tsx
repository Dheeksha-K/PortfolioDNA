import { motion } from 'framer-motion'
import { Users } from 'lucide-react'

const audiences = [
  { label: 'Students', desc: 'Get feedback before your first job hunt.' },
  { label: 'Developers', desc: 'Identify blind spots in your online presence.' },
  { label: 'Freelancers', desc: 'Make sure clients can find and contact you.' },
  { label: 'Recruiters', desc: 'Quickly assess portfolio quality at a glance.' },
]

export default function About() {
  return (
    <section id="about" className="py-24 px-4 sm:px-6 border-t border-border">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-xs text-brand font-medium tracking-widest uppercase mb-3">About</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Built on honesty,<br />not hype
            </h2>
            <p className="text-muted text-sm leading-relaxed mb-4">
              PortfolioDNA does not fabricate insights. Every score, recommendation, and piece of detected
              information comes from what is genuinely present (or missing) on the page you submit.
            </p>
            <p className="text-muted text-sm leading-relaxed">
              If something cannot be determined — we say so. If your portfolio lacks a contact section —
              we tell you. No inflated scores, no cheerleading. Just an honest engineering report.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="flex items-center gap-2 mb-5">
              <Users size={15} className="text-muted-2" />
              <span className="text-xs text-muted font-medium uppercase tracking-widest">Who It's For</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {audiences.map(({ label, desc }) => (
                <div key={label} className="card p-4 card-hover">
                  <p className="font-semibold text-sm text-primary mb-1">{label}</p>
                  <p className="text-xs text-muted leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
