import type { AnalysisResult } from '../types/analysis'

export async function analyzePortfolio(url: string): Promise<AnalysisResult> {
  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  })

  if (!response.ok) {
    const data = await response.json().catch(() => ({}))
    throw new Error(data.error || `Server error: ${response.status}`)
  }

  return response.json()
}
