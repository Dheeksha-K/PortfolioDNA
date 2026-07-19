import { motion } from 'framer-motion'

const steps = [
  {
    number: '01',
    title: 'Enter a Portfolio URL',
    description: 'Paste the public URL of any developer portfolio website into the input field.',
  },
  {
    number: '02',
    title: 'We Fetch & Parse',
    description: 'PortfolioDNA fetches the page server-side and analyzes the HTML, metadata, structure, and content.',
  },
  {
    number: '03',
    title: 'Receive Your Report',
    description: 'Get a detailed report with scores, detected information, strengths, issues, and prioritized recommendations.',
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-4 sm:px-6 border-t border-border">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <p className="text-xs text-brand font-medium tracking-widest uppercase mb-3">How It Works</p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Simple. Honest. Instant.
          </h2>
          <p className="mt-3 text-muted text-sm max-w-md mx-auto">
            No signup, no waiting. Paste a URL and get a professional analysis in seconds.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {/* connector line */}
          <div className="hidden md:block absolute top-8 left-[calc(16.7%)] right-[calc(16.7%)] h-px bg-gradient-to-r from-transparent via-border to-transparent" />

          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="flex flex-col items-center text-center"
            >
              <div className="relative z-10 w-16 h-16 rounded-2xl bg-surface border border-border flex items-center justify-center mb-5">
                <span className="font-mono text-lg font-bold text-gradient-brand">{step.number}</span>
              </div>
              <h3 className="font-semibold text-sm text-primary mb-2">{step.title}</h3>
              <p className="text-xs text-muted leading-relaxed max-w-[220px]">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
