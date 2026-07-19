import { motion } from 'framer-motion'
import { ExternalLink, AlertTriangle, Ban } from 'lucide-react'
import type { AnalysisResult } from '../../types/analysis'
import OverviewCard from './OverviewCard'
import ScoresCard from './ScoresCard'
import DetectedInfoCard from './DetectedInfoCard'
import StrengthsCard from './StrengthsCard'
import IssuesCard from './IssuesCard'
import RecommendationsCard from './RecommendationsCard'
import TechStackCard from './TechStackCard'
import ColorPaletteCard from './ColorPaletteCard'
import AccessibilityCard from './AccessibilityCard'
import { formatUrl } from '../../lib/utils'

interface ReportPageProps {
  result: AnalysisResult
  onNewAnalysis: () => void
}

export default function ReportPage({ result, onNewAnalysis }: ReportPageProps) {
  // fetch error
  if (result.error && !result.isPortfolio) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full card p-8 text-center">
          <div className="w-12 h-12 rounded-full bg-danger/10 border border-danger/20 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle size={20} className="text-danger" />
          </div>
          <h2 className="font-semibold text-primary mb-2">Could Not Fetch Website</h2>
          <p className="text-sm text-muted mb-6">{result.error}</p>
          <button
            onClick={onNewAnalysis}
            className="px-5 py-2.5 bg-primary text-background text-sm font-semibold rounded-lg hover:bg-accent transition-colors"
          >
            Try Another URL
          </button>
        </div>
      </div>
    )
  }

  // not a portfolio
  if (!result.isPortfolio) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full card p-8 text-center">
          <div className="w-12 h-12 rounded-full bg-warning/10 border border-warning/20 flex items-center justify-center mx-auto mb-4">
            <Ban size={20} className="text-warning" />
          </div>
          <h2 className="font-semibold text-primary mb-2">Not a Developer Portfolio</h2>
          <p className="text-sm text-muted mb-6">
            {result.notPortfolioMessage ||
              'This website does not appear to be a developer portfolio. PortfolioDNA currently analyzes personal portfolio websites.'}
          </p>
          <button
            onClick={onNewAnalysis}
            className="px-5 py-2.5 bg-primary text-background text-sm font-semibold rounded-lg hover:bg-accent transition-colors"
          >
            Try Another URL
          </button>
        </div>
      </div>
    )
  }

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.07 } },
  }
  const item = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      {/* Report header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
      >
        <div>
          <p className="text-xs text-muted mb-1 uppercase tracking-widest font-medium">Analysis Report</p>
          <a
            href={result.overview.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm text-primary hover:text-brand transition-colors font-mono group"
          >
            {formatUrl(result.overview.url)}
            <ExternalLink size={12} className="opacity-50 group-hover:opacity-100 transition-opacity" />
          </a>
        </div>
        <button
          onClick={onNewAnalysis}
          className="self-start sm:self-auto px-4 py-2 border border-border text-sm text-muted hover:text-primary hover:border-border-2 rounded-lg transition-colors"
        >
          Analyze Another
        </button>
      </motion.div>

      {/* Cards grid */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-4"
      >
        {/* Top row: overview + scores */}
        <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-2">
            <OverviewCard result={result} />
          </div>
          <div className="lg:col-span-3">
            <ScoresCard scores={result.scores} />
          </div>
        </motion.div>

        {/* Detected info */}
        <motion.div variants={item}>
          <DetectedInfoCard detected={result.detected} />
        </motion.div>

        {/* Strengths + Issues */}
        <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <StrengthsCard strengths={result.strengths} />
          <IssuesCard issues={result.issues} />
        </motion.div>

        {/* Recommendations */}
        <motion.div variants={item}>
          <RecommendationsCard recommendations={result.recommendations} />
        </motion.div>

        {/* Tech stack + Color palette */}
        <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <TechStackCard techStack={result.techStack} />
          <ColorPaletteCard palette={result.colorPalette} />
        </motion.div>

        {/* Accessibility */}
        <motion.div variants={item}>
          <AccessibilityCard accessibility={result.accessibility} />
        </motion.div>
      </motion.div>
    </div>
  )
}
