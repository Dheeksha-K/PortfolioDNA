import Hero from './Hero'
import Features from './Features'
import HowItWorks from './HowItWorks'
import About from './About'
import type { AnalysisResult } from '../../types/analysis'

interface LandingPageProps {
  isAnalyzing: boolean
  analyzedUrl: string
  onAnalysisStart: (url: string) => void
  onAnalysisComplete: (data: AnalysisResult) => void
}

export default function LandingPage({ isAnalyzing, analyzedUrl, onAnalysisStart, onAnalysisComplete }: LandingPageProps) {
  return (
    <>
      <Hero
        isAnalyzing={isAnalyzing}
        analyzedUrl={analyzedUrl}
        onAnalysisStart={onAnalysisStart}
        onAnalysisComplete={onAnalysisComplete}
      />
      <Features />
      <HowItWorks />
      <About />
    </>
  )
}
