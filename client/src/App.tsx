import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import LandingPage from './components/landing/LandingPage'
import ReportPage from './components/report/ReportPage'
import type { AnalysisResult } from './types/analysis'

export type AppView = 'landing' | 'analyzing' | 'report'

export default function App() {
  const [view, setView] = useState<AppView>('landing')
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [analyzedUrl, setAnalyzedUrl] = useState('')

  function handleAnalysisStart(url: string) {
    setAnalyzedUrl(url)
    setView('analyzing')
  }

  function handleAnalysisComplete(data: AnalysisResult) {
    setResult(data)
    setView('report')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleReset() {
    setView('landing')
    setResult(null)
    setAnalyzedUrl('')
    setTimeout(() => {
      document.getElementById('analyze')?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar onLogoClick={handleReset} showBack={view === 'report'} onBack={handleReset} />

      <main className="flex-1">
        <AnimatePresence mode="wait">
          {view !== 'report' ? (
            <motion.div
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <LandingPage
                isAnalyzing={view === 'analyzing'}
                analyzedUrl={analyzedUrl}
                onAnalysisStart={handleAnalysisStart}
                onAnalysisComplete={handleAnalysisComplete}
              />
            </motion.div>
          ) : (
            <motion.div
              key="report"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              {result && (
                <ReportPage result={result} onNewAnalysis={handleReset} />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  )
}
