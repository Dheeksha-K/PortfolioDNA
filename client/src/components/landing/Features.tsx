import { motion } from 'framer-motion'
import { ScanSearch, Gauge, Lightbulb, ShieldCheck, Layers, Eye } from 'lucide-react'

const features = [
  {
    icon: ScanSearch,
    title: 'Real Analysis Only',
    description: 'Every insight is derived from what is actually present on the page. No invented scores, no faked data.',
  },
  {
    icon: Gauge,
    title: 'Measurable Scores',
    description: 'SEO, accessibility, content, and branding scores calculated from verifiable, objective criteria.',
  },
  {
    icon: Lightbulb,
    title: 'Actionable Recommendations',
    description: 'Each issue comes with a specific fix, the reason it matters, and its potential impact on your visibility.',
  },
  {
    icon: Layers,
    title: 'Tech Stack Detection',
    description: 'Identifies frameworks, libraries, and tools used in your portfolio automatically.',
  },
  {
    icon: Eye,
    title: 'Accessibility Audit',
    description: 'Checks for lang attributes, alt text, viewport tags, ARIA labels, and other accessibility basics.',
  },
  {
    icon: ShieldCheck,
    title: 'Session-Only Privacy',
    description: 'Reports are never stored or shared publicly. Your analysis belongs only to your current session.',
  },
]

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export default function Features() {
  return (
    <section id="features" className="py-24 px-4 sm:px-6 border-t border-border">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <p className="text-xs text-brand font-medium tracking-widest uppercase mb-3">Features</p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            What PortfolioDNA Analyzes
          </h2>
          <p className="mt-3 text-muted text-sm max-w-md mx-auto">
            Built for developers who want honest, data-driven feedback on their portfolio.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {features.map(({ icon: Icon, title, description }) => (
            <motion.div
              key={title}
              variants={item}
              className="card card-hover p-5 group"
            >
              <div className="w-9 h-9 rounded-lg bg-surface-2 border border-border flex items-center justify-center mb-4 group-hover:border-brand/40 group-hover:bg-brand/10 transition-colors">
                <Icon size={17} className="text-muted-2 group-hover:text-brand transition-colors" />
              </div>
              <h3 className="font-semibold text-sm text-primary mb-1.5">{title}</h3>
              <p className="text-xs text-muted leading-relaxed">{description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
