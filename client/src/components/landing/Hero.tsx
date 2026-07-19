import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Loader2, AlertCircle, ArrowRight } from 'lucide-react'
import { analyzePortfolio } from '../../lib/api'
import type { AnalysisResult } from '../../types/analysis'

interface HeroProps {
  isAnalyzing: boolean
  analyzedUrl: string
  onAnalysisStart: (url: string) => void
  onAnalysisComplete: (data: AnalysisResult) => void
}

export default function Hero({ isAnalyzing, analyzedUrl, onAnalysisStart, onAnalysisComplete }: HeroProps) {
  const [url, setUrl] = useState('')
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = url.trim()
    if (!trimmed) {
      setError('Please enter a portfolio URL.')
      inputRef.current?.focus()
      return
    }
    setError(null)
    onAnalysisStart(trimmed)
    try {
      const result = await analyzePortfolio(trimmed)
      onAnalysisComplete(result)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Something went wrong. Please try again.'
      setError(msg)
      // reset to landing
      onAnalysisComplete({ isPortfolio: false, error: msg } as AnalysisResult)
    }
  }

  return (
    <section
      id="analyze"
      className="relative min-h-[88vh] flex flex-col items-center justify-center px-4 sm:px-6 overflow-hidden"
    >
      {/* Subtle grid bg */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />

      {/* Radial glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-brand/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-3xl mx-auto text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-brand/30 bg-brand/10 text-brand text-xs font-medium mb-6"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
          AI-Powered Portfolio Analysis
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight mb-5"
        >
          Decode the DNA of{' '}
          <span className="text-gradient-brand">Every Developer</span>{' '}
          Portfolio
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-base sm:text-lg text-muted max-w-xl mx-auto mb-10 leading-relaxed"
        >
          Analyze developer portfolios and receive actionable insights into design, branding,
          accessibility, user experience, and overall presentation.
        </motion.p>

        {/* URL Input */}
        <motion.form
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          onSubmit={handleSubmit}
          className="w-full"
        >
          <div className="relative flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
              />
              <input
                ref={inputRef}
                type="text"
                value={url}
                onChange={(e) => { setUrl(e.target.value); setError(null) }}
                placeholder="https://yourname.dev"
                disabled={isAnalyzing}
                className="w-full pl-10 pr-4 py-3.5 bg-surface border border-border rounded-xl text-sm text-primary placeholder:text-muted focus:outline-none focus:border-brand/60 focus:ring-2 focus:ring-brand/20 transition-all disabled:opacity-50"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isAnalyzing}
              className="flex items-center justify-center gap-2 px-6 py-3.5 bg-primary text-background font-semibold text-sm rounded-xl hover:bg-accent transition-colors disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap sm:w-auto w-full"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  Analyzing…
                </>
              ) : (
                <>
                  Analyze Portfolio
                  <ArrowRight size={15} />
                </>
              )}
            </motion.button>
          </div>

          {/* Analyzing state */}
          <AnimatePresence>
            {isAnalyzing && analyzedUrl && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 flex items-center justify-center gap-2 text-sm text-muted"
              >
                <div className="flex gap-1">
                  {[0, 1, 2].map(i => (
                    <motion.span
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-brand"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                    />
                  ))}
                </div>
                Analyzing <span className="text-muted-2 font-mono text-xs ml-1 truncate max-w-[200px]">{analyzedUrl}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-4 flex items-start gap-2 p-3 bg-danger/10 border border-danger/20 rounded-lg text-sm text-danger"
              >
                <AlertCircle size={15} className="shrink-0 mt-0.5" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.form>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-5 text-xs text-muted"
        >
          Free · No account required · Analysis stays in your session
        </motion.p>
      </div>
    </section>
  )
}
